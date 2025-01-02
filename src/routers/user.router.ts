import express, { NextFunction, Request, Response } from 'express';
import authTokenMiddleware from '../middlewares/auth-token.middleware';
import authPermissionsMiddleware from '../middlewares/auth-permissions.middleware';
import passport from 'passport';
import jwt from 'jsonwebtoken';
import UserService from '../services/user.service';
import { Configuration } from '../config/config';

class UserRouter extends Configuration {
  public router: express.Router;
  private SECRET_KEY: string;
  private CORS: string;
  private EXPIRE_TOKEN: string;

  constructor() {
    super();
    this.router = express.Router();
    this.SECRET_KEY = this.getEnviroment('SECRET_KEY')!;
    this.CORS = this.getEnviroment('CORS')!;
    this.EXPIRE_TOKEN = this.getEnviroment('EXPIRE_TOKEN')!;

    this.createRouters();
  }

  createRouters(): void {
    this.router.get(
      '/user/auth/token',
      authTokenMiddleware.authToken.bind(authTokenMiddleware),
      this.validateSession.bind(this)
    );
    this.router.get('/user/auth/google', this.authGoogle.bind(this));
    this.router.get(
      '/user/auth/google/callback',
      passport.authenticate('google', {
        failureMessage: 'Error trying to login with Google',
        failureRedirect: '/login',
      }),
      this.authGoogleCallback.bind(this)
    );
    this.router.get(
      '/user/',
      authTokenMiddleware.authToken.bind(authTokenMiddleware),
      this.getUsers.bind(this)
    ),
      this.router.post('/user/pass/recovery', this.passwordRecovery.bind(this));
    this.router.post('/user/register', this.registerUser.bind(this));
    this.router.post('/user/login', this.loginUser.bind(this));
    this.router.patch(
      '/user/reset',
      authTokenMiddleware.authToken.bind(authTokenMiddleware),
      this.userResetPassword.bind(this)
    );
    this.router.put(
      '/user/:id',
      authTokenMiddleware.authToken.bind(authTokenMiddleware),
      authPermissionsMiddleware.authPermissions(['admin']),
      this.updateUser.bind(this)
    );
  }

  private validateSession(req: Request, res: Response, next: NextFunction) {
    if (!req.user) {
      next({ statusCode: 401, message: 'Error verifying the session' });
    }

    res.status(200).json({ user: req.user });
  }

  private authGoogle(req: Request, res: Response, next: NextFunction) {
    passport.authenticate('google', {
      scope: ['profile', 'email'],
    })(req, res, next);
  }

  private authGoogleCallback(req: Request, res: Response, next: NextFunction) {
    if (!req.user) {
      return next({
        statusCode: 401,
        message: 'Error trying to login with Google',
      });
    }

    const { id, email, role } = req.user;

    const token = jwt.sign({ id, email, role }, this.SECRET_KEY, {
      expiresIn: this.getEnviroment('EXPIRE_TOKEN'),
    });

    res.redirect(`${this.CORS?.split(' ')[0]}/auth/google?token=${token}`);
  }

  private getUsers(req: Request, res: Response, next: NextFunction) {
    const { page = 1, pageSize = 10 } = req.query;

    UserService.getUsers(Number(page), Number(pageSize))
      .then((result) => res.json(result))
      .catch((err) => {
        console.error(err);
        next(err);
      });
  }

  private passwordRecovery(req: Request, res: Response, next: NextFunction) {
    UserService.passwordRecovery(req.body.email, this.SECRET_KEY)
      .then((result) => res.json(result))
      .catch((err) => next(err));
  }

  private registerUser(req: Request, res: Response, next: NextFunction) {
    const user = {
      name: req.body.name,
      surname: req.body.surname,
      password: req.body.password,
      email: req.body.email,
      dateOfBirth: req.body.dateOfBirth,
    };

    UserService.registerUser(user, this.SECRET_KEY, this.EXPIRE_TOKEN)
      .then((result) => {
        res.cookie('token', result, {
          httpOnly: true,
          secure: true,
          maxAge: 7 * 24 * 60 * 60 * 1000,
          signed: true,
        });
        //solo para development
        res.json(result);
      })
      .catch((err) => next(err));
  }

  private loginUser(req: Request, res: Response, next: NextFunction) {
    const loginUser = {
      email: req.body.email,
      password: req.body.password,
    };

    UserService.loginUser(loginUser, this.SECRET_KEY, this.EXPIRE_TOKEN)
      .then((result) => {
        res.cookie('token', result, {
          httpOnly: true,
          secure: true,
          maxAge: 7 * 24 * 60 * 60 * 1000,
          signed: true,
        });
        //solo para development
        res.json(result);
      })
      .catch((err) => next(err));
  }

  private userResetPassword(req: Request, res: Response, next: NextFunction) {
    const token = req.query.token;

    UserService.resetPassword(String(token), req.body.password, this.SECRET_KEY)
      .then((result) => res.json(result))
      .catch((err) => next(err));
  }

  private updateUser(req: Request, res: Response, next: NextFunction) {
    const user = req.user as any;

    UserService.updateUser(req.body, Number(req.params.id), user.role)
      .then((result) => res.json(result))
      .catch((err) => next(err));
  }
}

export default new UserRouter().router;
