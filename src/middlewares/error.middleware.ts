import { NextFunction, Request, Response } from 'express';

export class ErrorMiddleware {
  static handleError(
    err: any,
    _req: Request,
    res: Response,
    _next: NextFunction
  ): void {
    console.error('Error:', err);

    const statusCode = err.statusCode || 500;
    const message = err.message || 'Internal server error';

    res.status(statusCode).json({
      error: true,
      message,
    });
  }
}
