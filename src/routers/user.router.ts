import express, { NextFunction, Request, Response } from 'express';
import authTokenMiddleware from '../middlewares/auth-token.middleware';
import authPermissionsMiddleware from '../middlewares/auth-permissions.middleware';
import { Configuration } from '../config/config';
import passport from 'passport';
import jwt from 'jsonwebtoken';
import UserService from '../services/user.service';

class UserRouter extends Configuration {
  public router: express.Router;
  private SECRET_KEY: string;
  private CORS: string | undefined;

  constructor() {
    super();
    this.router = express.Router();
    this.SECRET_KEY = this.getEnviroment('SECRET_KEY')!;
    this.CORS = this.getEnviroment('CORS')!;

    this.createRouters();
  }

  createRouters(): void {
    this.router.get(
      '/user/auth/token',
      authTokenMiddleware.authToken,
      this.handleValidateSession.bind(this)
    );
    this.router.get('/user/auth/google', this.handleAuthGoogle.bind(this));
    this.router.get(
      '/user/auth/google/callback',
      passport.authenticate('google', {
        failureMessage: 'Error trying to login with Google',
        failureRedirect: '/login',
      }),
      this.handleAuthGoogleCallback.bind(this)
    );
    this.router.get('/user/', authTokenMiddleware.authToken),
      this.handleGetUsers.bind(this);
    this.router.post(
      '/user/pass/recovery',
      this.handlePasswordRecovery.bind(this)
    );
    this.router.post('/user/register');
    this.router.post('/user/login');
    this.router.put('/user/reset', authTokenMiddleware.authToken);
    this.router.put(
      '/user/:id',
      authTokenMiddleware.authToken,
      authPermissionsMiddleware.authPermissions(['admin'])
    );
  }

  private handleValidateSession(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    if (!req.user) {
      next({ message: 'Error verifying the session' });
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
      next();
    }

    const token = jwt.sign(
      { id: req.user.id, email: req.user.emial, role: req.user.role },
      this.SECRET_KEY,
      { expiresIn: this.getEnviroment('EXPIRE_TOKEN') }
    );

    res.redirect(`${this.CORS?.split(' ')[0]}/auth/google?token=${token}`);
  }

  private handleGetUsers(req: Request, res: Response, next: NextFunction) {
    const { page = 1, pageSize = 10 } = req.query;

    UserService.getUsers(Number(page), Number(pageSize))
      .then((result) => res.json(result))
      .catch((err) => next(err));
  }

  private handlePasswordRecovery(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    UserService.passwordRecovery(req.body, this.SECRET_KEY)
      .then((result) => res.json(result))
      .catch((err) => next(err));
  }
}

export default new UserRouter().router;
