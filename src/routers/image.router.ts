import express, { NextFunction, Request, Response } from 'express';
import authTokenMiddleware from '../middlewares/auth-token.middleware';
import authPermissionsMiddleware from '../middlewares/auth-permissions.middleware';
import { ErrorMiddleware } from '../middlewares/error.middleware';
import ImageService from '../services/image.service';

class ImageRouter {
  public router: express.Router;

  constructor() {
    this.router = express.Router();

    this.createRouters();
  }

  createRouters(): void {
    this.router.get(
      '/',
      authTokenMiddleware.authToken.bind(authTokenMiddleware),
      authPermissionsMiddleware
        .authPermissions(['admin'])
        .bind(authPermissionsMiddleware),
      this.handleGetImages.bind(this),
      ErrorMiddleware.handleError
    );
    this.router.get(
      '/:id',
      authTokenMiddleware.authToken.bind(authTokenMiddleware),
      authPermissionsMiddleware
        .authPermissions(['admin'])
        .bind(authPermissionsMiddleware),
      this.handleGetImagesByProductId.bind(this),
      ErrorMiddleware.handleError
    );
    this.router.post(
      '/',
      authTokenMiddleware.authToken.bind(authTokenMiddleware),
      authPermissionsMiddleware
        .authPermissions(['admin'])
        .bind(authPermissionsMiddleware),
      this.handleCreateImage.bind(this),
      ErrorMiddleware.handleError
    );
    this.router.put(
      '/:id',
      authTokenMiddleware.authToken.bind(authTokenMiddleware),
      authPermissionsMiddleware
        .authPermissions(['admin'])
        .bind(authPermissionsMiddleware),
      this.handleUpdateImage.bind(this),
      ErrorMiddleware.handleError
    );
    this.router.delete(
      '/:id',
      authTokenMiddleware.authToken.bind(authTokenMiddleware),
      authPermissionsMiddleware
        .authPermissions(['admin'])
        .bind(authPermissionsMiddleware),
      this.handleDeleteImage.bind(this),
      ErrorMiddleware.handleError
    );
  }

  private handleGetImages(req: Request, res: Response, next: NextFunction) {
    const { page = 1, pageSize = 10 } = req.query;

    ImageService.getImages(+page, +pageSize)
      .then((result) => res.json(result))
      .catch((err) => next(err));
  }

  private handleGetImagesByProductId(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    ImageService.getImagesByProductId(Number(req.params.id))
      .then((result) => res.json(result))
      .catch((err) => next(err));
  }

  private handleCreateImage(req: Request, res: Response, next: NextFunction) {
    ImageService.createImage(req.body)
      .then((result) => res.json(result))
      .catch((err) => next(err));
  }

  private handleUpdateImage(req: Request, res: Response, next: NextFunction) {
    ImageService.updateImage(req.body, Number(req.params.id))
      .then((result) => res.json(result))
      .catch((err) => next(err));
  }

  private handleDeleteImage(req: Request, res: Response, next: NextFunction) {
    ImageService.deleteImage(Number(req.params.id))
      .then((result) => res.json(result))
      .catch((err) => next(err));
  }
}

export default new ImageRouter().router;
