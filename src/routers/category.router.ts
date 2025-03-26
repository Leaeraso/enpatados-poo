import express, { NextFunction, Request, Response } from 'express';
import authTokenMiddleware from '../middlewares/auth-token.middleware';
import authPermissionsMiddleware from '../middlewares/auth-permissions.middleware';
import CategoryService from '../services/category.service';

class CategoryRouter {
  public router: express.Router;

  constructor() {
    this.router = express.Router();

    this.createRouters();
  }

  createRouters(): void {
    this.router.get('/category/', this.getCategories.bind(this));
    this.router.get('/category/:id', this.getCategoryById.bind(this));
    this.router.post(
      '/category/',
      authTokenMiddleware.authToken.bind(authTokenMiddleware),
      authPermissionsMiddleware
        .authPermissions(['admin'])
        .bind(authPermissionsMiddleware),
      this.createCategory.bind(this)
    );
    this.router.put(
      '/category/:id',
      authTokenMiddleware.authToken.bind(authTokenMiddleware),
      authPermissionsMiddleware
        .authPermissions(['admin'])
        .bind(authPermissionsMiddleware),
      this.updateCategory.bind(this)
    );
    this.router.delete(
      '/category/:id',
      authTokenMiddleware.authToken.bind(authTokenMiddleware),
      authPermissionsMiddleware
        .authPermissions(['admin'])
        .bind(authPermissionsMiddleware),
      this.deleteCategory.bind(this)
    );
  }

  private getCategories(req: Request, res: Response, next: NextFunction) {
    const { search } = req.body;

    CategoryService.getCategories(search)
      .then((result) => res.json(result))
      .catch((err) => next(err));
  }

  private getCategoryById(req: Request, res: Response, next: NextFunction) {
    CategoryService.getCategoryById(Number(req.params.id))
      .then((result) => res.json(result))
      .catch((err) => next(err));
  }

  private createCategory(req: Request, res: Response, next: NextFunction) {
    const { name, description, icon } = req.body;

    const category = {
      name,
      description,
      icon,
    };

    CategoryService.createCategory(category)
      .then((result) => res.json(result))
      .catch((err) => next(err));
  }

  private updateCategory(req: Request, res: Response, next: NextFunction) {
    CategoryService.updateCategory(req.body, Number(req.params.id))
      .then((result) => res.json(result))
      .catch((err) => next(err));
  }

  private deleteCategory(req: Request, res: Response, next: NextFunction) {
    CategoryService.deleteCategory(Number(req.params.id))
      .then((result) => res.json(result))
      .catch((err) => next(err));
  }
}

export default new CategoryRouter().router;
