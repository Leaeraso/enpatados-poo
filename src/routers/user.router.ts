import express, { NextFunction, Request, Response } from 'express';
import authTokenMiddleware from '../middlewares/auth-token.middleware';
import authPermissionsMiddleware from '../middlewares/auth-permissions.middleware';
import { Configuration } from '../config/config';
import passport from 'passport';
import jwt from 'jsonwebtoken';
import UserService from '../services/user.service';
import { ErrorMiddleware } from '../middlewares/error.middleware';

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
      this.handleValidateSession.bind(this),
      ErrorMiddleware.handleError
    );
    this.router.get('/user/auth/google', this.handleAuthGoogle.bind(this));
    this.router.get(
      '/user/auth/google/callback',
      passport.authenticate('google', {
        failureMessage: 'Error trying to login with Google',
        failureRedirect: '/login',
      }),
      this.handleAuthGoogleCallback.bind(this),
      ErrorMiddleware.handleError
    );
    this.router.get(
      '/user/',
      authTokenMiddleware.authToken.bind(authTokenMiddleware),
      this.handleGetUsers.bind(this),
      ErrorMiddleware.handleError
    ),
      this.router.post(
        '/user/pass/recovery',
        this.handlePasswordRecovery.bind(this),
        ErrorMiddleware.handleError
      );
    this.router.post(
      '/user/register',
      this.handleRegisterUser.bind(this),
      ErrorMiddleware.handleError
    );
    this.router.post(
      '/user/login',
      this.handleLoginUser.bind(this),
      ErrorMiddleware.handleError
    );
    this.router.patch(
      '/user/reset',
      authTokenMiddleware.authToken.bind(authTokenMiddleware),
      this.handleUserResetPassword.bind(this),
      ErrorMiddleware.handleError
    );
    this.router.put(
      '/user/:id',
      authTokenMiddleware.authToken.bind(authTokenMiddleware),
      authPermissionsMiddleware.authPermissions(['admin']),
      this.handleUpdateUser.bind(this),
      ErrorMiddleware.handleError
    );
  }

  private handleValidateSession(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    if (!req.user) {
      next({ statusCode: 401, message: 'Error verifying the session' });
    }

    res.status(200).json({ user: req.user });
  }

  private handleAuthGoogle(req: Request, res: Response, next: NextFunction) {
    passport.authenticate('google', {
      scope: ['profile', 'email'],
    })(req, res, next);
  }

  private handleAuthGoogleCallback(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
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

  private handleGetUsers(req: Request, res: Response, next: NextFunction) {
    const { page = 1, pageSize = 10 } = req.query;

    UserService.getUsers(Number(page), Number(pageSize))
      .then((result) => res.json(result))
      .catch((err) => {
        console.error(err);
        next(err);
      });
  }

  private handlePasswordRecovery(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    UserService.passwordRecovery(req.body.email, this.SECRET_KEY)
      .then((result) => res.json(result))
      .catch((err) => next(err));
  }

  private handleRegisterUser(req: Request, res: Response, next: NextFunction) {
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

  private handleLoginUser(req: Request, res: Response, next: NextFunction) {
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

  private handleUserResetPassword(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    const token = req.query.token;

    UserService.resetPassword(String(token), req.body.password, this.SECRET_KEY)
      .then((result) => res.json(result))
      .catch((err) => next(err));
  }

  private handleUpdateUser(req: Request, res: Response, next: NextFunction) {
    const user = req.user as any;

    UserService.updateUser(req.body, Number(req.params.id), user.role)
      .then((result) => res.json(result))
      .catch((err) => next(err));
  }
}

export default new UserRouter().router;
