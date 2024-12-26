import express, { NextFunction, Request, Response } from 'express';
import authTokenMiddleware from '../middlewares/auth-token.middleware';
import authPermissionsMiddleware from '../middlewares/auth-permissions.middleware';
import { ErrorMiddleware } from '../middlewares/error.middleware';
import CategoryService from '../services/category.service';

class CategoryRouter {
  public router: express.Router;

  constructor() {
    this.router = express.Router();

    this.createRouters();
  }

  createRouters(): void {
    this.router.get(
      '/',
      this.handleGetCategories.bind(this),
      ErrorMiddleware.handleError
    );
    this.router.get(
      '/:id',
      this.handleGetCategoryById.bind(this),
      ErrorMiddleware.handleError
    );
    this.router.post(
      '/',
      authTokenMiddleware.authToken.bind(authTokenMiddleware),
      authPermissionsMiddleware
        .authPermissions(['admin'])
        .bind(authPermissionsMiddleware),
      this.handleCreateCategory.bind(this),
      ErrorMiddleware.handleError
    );
    this.router.put(
      '/:id',
      authTokenMiddleware.authToken.bind(authTokenMiddleware),
      authPermissionsMiddleware
        .authPermissions(['admin'])
        .bind(authPermissionsMiddleware),
      this.handleUpdateCategory.bind(this),
      ErrorMiddleware.handleError
    );
    this.router.delete(
      '/:id',
      authTokenMiddleware.authToken.bind(authTokenMiddleware),
      authPermissionsMiddleware
        .authPermissions(['admin'])
        .bind(authPermissionsMiddleware),
      this.handleDeleteCategory.bind(this),
      ErrorMiddleware.handleError
    );
  }

  private handleGetCategories(
    _req: Request,
    res: Response,
    next: NextFunction
  ) {
    CategoryService.getCategories()
      .then((result) => res.json(result))
      .catch((err) => next(err));
  }

  private handleGetCategoryById(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    CategoryService.getCategoryById(Number(req.params.id))
      .then((result) => res.json(result))
      .catch((err) => next(err));
  }

  private handleCreateCategory(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
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

  private handleUpdateCategory(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    CategoryService.updateCategory(req.body, Number(req.params.id))
      .then((result) => res.json(result))
      .catch((err) => next(err));
  }

  private handleDeleteCategory(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    CategoryService.deleteCategory(Number(req.params.id))
      .then((result) => res.json(result))
      .catch((err) => next(err));
  }
}

export default new CategoryRouter().router;
