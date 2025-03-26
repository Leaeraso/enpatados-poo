import express, { NextFunction, Request, Response } from 'express';
import authTokenMiddleware from '../middlewares/auth-token.middleware';
import authPermissionsMiddleware from '../middlewares/auth-permissions.middleware';
import ImageService from '../services/image.service';

class ImageRouter {
  public router: express.Router;

  constructor() {
    this.router = express.Router();

    this.createRouters();
  }

  createRouters(): void {
    this.router.get('/image/', this.getImages.bind(this));
    this.router.get('/image/:id', this.getImagesByProductId.bind(this));
    this.router.post(
      '/image/',
      authTokenMiddleware.authToken.bind(authTokenMiddleware),
      authPermissionsMiddleware
        .authPermissions(['admin'])
        .bind(authPermissionsMiddleware),
      this.createImage.bind(this)
    );
    this.router.put(
      '/image/:id',
      authTokenMiddleware.authToken.bind(authTokenMiddleware),
      authPermissionsMiddleware
        .authPermissions(['admin'])
        .bind(authPermissionsMiddleware),
      this.updateImage.bind(this)
    );
    this.router.delete(
      '/image/:id',
      authTokenMiddleware.authToken.bind(authTokenMiddleware),
      authPermissionsMiddleware
        .authPermissions(['admin'])
        .bind(authPermissionsMiddleware),
      this.deleteImage.bind(this)
    );
  }

  private getImages(req: Request, res: Response, next: NextFunction) {
    const { page = 1, pageSize = 10 } = req.query;

    ImageService.getImages(+page, +pageSize)
      .then((result) => res.json(result))
      .catch((err) => next(err));
  }

  private getImagesByProductId(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    ImageService.getImagesByProductId(Number(req.params.id))
      .then((result) => res.json(result))
      .catch((err) => next(err));
  }

  private createImage(req: Request, res: Response, next: NextFunction) {
    ImageService.createImage(req.body)
      .then((result) => res.json(result))
      .catch((err) => next(err));
  }

  private updateImage(req: Request, res: Response, next: NextFunction) {
    ImageService.updateImage(req.body, Number(req.params.id))
      .then((result) => res.json(result))
      .catch((err) => next(err));
  }

  private deleteImage(req: Request, res: Response, next: NextFunction) {
    ImageService.deleteImage(Number(req.params.id))
      .then((result) => res.json(result))
      .catch((err) => next(err));
  }
}

export default new ImageRouter().router;
