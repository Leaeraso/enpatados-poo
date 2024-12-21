import { NextFunction, Request, Response } from 'express';

class AuthPermissionsMiddleware {
  authPermissions(permissions: string[]) {
    return (req: Request, _res: Response, next: NextFunction) => {
      try {
        if (permissions.includes(req.user?.role)) {
          next();
        } else {
          return next({
            message: 'You are not allowed to do that.',
          });
        }
      } catch (error) {
        console.error(
          'There has been an error verifying the permissions of the user',
          error
        );
        return next({ message: 'Error verifying the users permissions' });
      }
    };
  }
}

export default new AuthPermissionsMiddleware();
