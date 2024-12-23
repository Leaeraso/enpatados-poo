import { JwtPayload } from 'jsonwebtoken';
import { Request } from 'express';

declare global {
  namespace Express {
    interface User {
      id: string;
      email: string;
      role: string;
    }

    interface Request {
      user?: User;
    }
  }
}

export interface IGetUserAuthInfoRequest extends Request {
  user: string | JwtPayload;
}
