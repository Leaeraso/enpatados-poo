import { NextFunction, Request, Response } from 'express';
import { Configuration } from '../config/config';
import jwt, { TokenExpiredError } from 'jsonwebtoken';

class AuthTokenMiddleware extends Configuration {
  private SECRET_KEY: string;

  constructor() {
    super();
    this.SECRET_KEY = this.getEnviroment('SECRET_KEY')!;
  }

  authToken(req: Request, _res: Response, next: NextFunction) {
    try {
      //const token = req.signedCookies.token
      let token = req.headers['authorization']?.split(' ')[1];

      if (!token) {
        token =
          typeof req.query.token === 'string' ? req.query.token : undefined;
      }

      if (!token) {
        return next({
          message: 'Token is required',
        });
      }

      const user = jwt.verify(token!, this.SECRET_KEY);
      req.user = user;
    } catch (error) {
      if (error instanceof TokenExpiredError) {
        return next({
          message: 'Token is expired. Please login again',
        });
      }
      return next({
        message: 'Invalid Token',
      });
    }
  }
}

export default new AuthTokenMiddleware();
