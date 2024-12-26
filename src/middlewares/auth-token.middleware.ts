import { NextFunction, Request, Response } from 'express';
import { Configuration } from '../config/config';
import jwt, { TokenExpiredError } from 'jsonwebtoken';
import dotenv from 'dotenv';

interface User {
  id: string;
  email: string;
  role: string;
}

dotenv.config();

class AuthTokenMiddleware extends Configuration {
  private SECRET_KEY: string;

  constructor() {
    super();
    this.SECRET_KEY = this.getEnviroment('SECRET_KEY')!;
  }

  authToken(req: Request, _res: Response, next: NextFunction) {
    try {
      // let token = req.signedCookies.token;
      let token = req.headers['authorization']?.split(' ')[1];

      console.log('token', token);
      // console.log('secret_key', this.SECRET_KEY);

      if (!token) {
        token =
          typeof req.query.token === 'string' ? req.query.token : undefined;
      }

      if (!token) {
        return next({
          message: 'Token is required',
        });
      }

      const user = jwt.verify(token, this.SECRET_KEY);

      if (
        typeof user === 'object' &&
        'id' in user &&
        'email' in user &&
        'role' in user
      ) {
        req.user = user as User;
        console.log('token validated successfully');
        next();
      } else {
        return next({ message: 'Invalid token' });
      }
    } catch (error) {
      console.error(error);
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
