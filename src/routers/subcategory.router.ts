import express, { NextFunction, Request, Response } from 'express';
import SubcategoryService from '../services/subcategory.service';
import authTokenMiddleware from '../middlewares/auth-token.middleware';
import authPermissionsMiddleware from '../middlewares/auth-permissions.middleware';

class SubcategoryRouter {
  public router: express.Router;

  constructor() {
    this.router = express.Router();

    this.createRouters();
  }

  createRouters(): void {
    this.router.get('/subcategory/', this.getSubcategories.bind(this));
    this.router.get('/subcategory/:id', this.getSubcategoryById.bind(this));
    this.router.post(
      '/subcategory/',
      authTokenMiddleware.authToken.bind(authTokenMiddleware),
      authPermissionsMiddleware
        .authPermissions(['admin'])
        .bind(authPermissionsMiddleware),
      this.createSubcategory.bind(this)
    );
    this.router.put(
      '/subcategory/:id',
      authTokenMiddleware.authToken.bind(authTokenMiddleware),
      authPermissionsMiddleware
        .authPermissions(['admin'])
        .bind(authPermissionsMiddleware),
      this.updateSubcategory.bind(this)
    );
    this.router.delete(
      '/subcategory/:id',
      authTokenMiddleware.authToken.bind(authTokenMiddleware),
      authPermissionsMiddleware
        .authPermissions(['admin'])
        .bind(authPermissionsMiddleware),
      this.deleteSubcategory.bind(this)
    );
  }

  private getSubcategories(req: Request, res: Response, next: NextFunction) {
    const { search } = req.body;
    SubcategoryService.getSubcategories(search)
      .then((result) => res.json(result))
      .catch((err) => next(err));
  }

  private getSubcategoryById(req: Request, res: Response, next: NextFunction) {
    SubcategoryService.getSubcategoryById(Number(req.params.id))
      .then((result) => res.json(result))
      .catch((err) => next(err));
  }

  private createSubcategory(req: Request, res: Response, next: NextFunction) {
    const { name, categoryId } = req.body;

    const subcategory = {
      name,
      categoryId,
    };

    SubcategoryService.createSubcategory(subcategory)
      .then((result) => res.json(result))
      .catch((err) => next(err));
  }

  private updateSubcategory(req: Request, res: Response, next: NextFunction) {
    SubcategoryService.updateSubcategory(req.body, Number(req.params.id))
      .then((result) => res.json(result))
      .catch((err) => next(err));
  }

  private deleteSubcategory(req: Request, res: Response, next: NextFunction) {
    SubcategoryService.deleteSubcategory(Number(req.params.id))
      .then((result) => res.json(result))
      .catch((err) => next(err));
  }
}

export default new SubcategoryRouter().router;
