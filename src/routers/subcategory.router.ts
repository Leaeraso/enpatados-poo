import express, { NextFunction, Request, Response } from 'express';
import SubcategoryService from '../services/subcategory.service';
import authTokenMiddleware from '../middlewares/auth-token.middleware';
import authPermissionsMiddleware from '../middlewares/auth-permissions.middleware';
import { ErrorMiddleware } from '../middlewares/error.middleware';

class SubcategoryRouter {
  public router: express.Router;

  constructor() {
    this.router = express.Router();

    this.createRouters();
  }

  createRouters(): void {
    this.router.get(
      '/',
      this.handleGetSubcategories.bind(this),
      ErrorMiddleware.handleError
    );
    this.router.get(
      '/:id',
      this.handleGetSubcategoryById.bind(this),
      ErrorMiddleware.handleError
    );
    this.router.post(
      '/',
      authTokenMiddleware.authToken.bind(authTokenMiddleware),
      authPermissionsMiddleware
        .authPermissions(['admin'])
        .bind(authPermissionsMiddleware),
      this.handleCreateSubcategory.bind(this),
      ErrorMiddleware.handleError
    );
    this.router.put(
      '/:id',
      authTokenMiddleware.authToken.bind(authTokenMiddleware),
      authPermissionsMiddleware
        .authPermissions(['admin'])
        .bind(authPermissionsMiddleware),
      this.handleUpdateSubcategory.bind(this),
      ErrorMiddleware.handleError
    );
    this.router.delete(
      '/:id',
      authTokenMiddleware.authToken.bind(authTokenMiddleware),
      authPermissionsMiddleware
        .authPermissions(['admin'])
        .bind(authPermissionsMiddleware),
      this.handleDeleteSubcategory.bind(this),
      ErrorMiddleware.handleError
    );
  }

  private handleGetSubcategories(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    const { search } = req.body;
    SubcategoryService.getSubcategories(search)
      .then((result) => res.json(result))
      .catch((err) => next(err));
  }

  private handleGetSubcategoryById(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    SubcategoryService.getSubcategoryById(Number(req.params.id))
      .then((result) => res.json(result))
      .catch((err) => next(err));
  }

  private handleCreateSubcategory(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    const { name, categoryId } = req.body;

    const subcategory = {
      name,
      categoryId,
    };

    SubcategoryService.createSubcategory(subcategory)
      .then((result) => res.json(result))
      .catch((err) => next(err));
  }

  private handleUpdateSubcategory(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    SubcategoryService.updateSubcategory(req.body, Number(req.params.id))
      .then((result) => res.json(result))
      .catch((err) => next(err));
  }

  private handleDeleteSubcategory(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    SubcategoryService.deleteSubcategory(Number(req.params.id))
      .then((result) => res.json(result))
      .catch((err) => next(err));
  }
}

export default new SubcategoryRouter().router;
