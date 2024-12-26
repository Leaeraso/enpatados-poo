import express, { NextFunction, Request, Response } from 'express';
import authTokenMiddleware from '../middlewares/auth-token.middleware';
import authPermissionsMiddleware from '../middlewares/auth-permissions.middleware';
import { Configuration } from '../config/config';
import { ErrorMiddleware } from '../middlewares/error.middleware';
import ProductService from '../services/product.service';

class ProductRouter extends Configuration {
  public router: express.Router;

  constructor() {
    super();
    this.router = express.Router();

    this.createRouters();
  }

  createRouters(): void {
    this.router.get(
      '/',
      this.handleGetProducts.bind(this),
      ErrorMiddleware.handleError
    );
    this.router.get(
      '/:id',
      this.handleGetProductById.bind(this),
      ErrorMiddleware.handleError
    );
    this.router.post(
      '/',
      authTokenMiddleware.authToken.bind(authTokenMiddleware),
      authPermissionsMiddleware
        .authPermissions(['admin'])
        .bind(authPermissionsMiddleware),
      this.handleCreateProduct.bind(this),
      ErrorMiddleware.handleError
    );
    this.router.put(
      '/:id',
      authTokenMiddleware.authToken.bind(authTokenMiddleware),
      authPermissionsMiddleware
        .authPermissions(['admin'])
        .bind(authPermissionsMiddleware),
      this.handleUpdateProduct.bind(this),
      ErrorMiddleware.handleError
    );
    this.router.delete(
      '/:id',
      authTokenMiddleware.authToken.bind(authTokenMiddleware),
      authPermissionsMiddleware
        .authPermissions(['admin'])
        .bind(authPermissionsMiddleware),
      this.handleDeleteProduct.bind(this),
      ErrorMiddleware.handleError
    );
  }

  private handleGetProducts(req: Request, res: Response, next: NextFunction) {
    const {
      page = 1,
      pageSize = 10,
      categoryId,
      subcategoryId,
      search,
    } = req.query;

    ProductService.getProducts(
      +page,
      +pageSize,
      Number(categoryId),
      Number(subcategoryId),
      search as string
    )
      .then((result) => res.json(result))
      .catch((err) => next(err));
  }

  private handleGetProductById(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    ProductService.getProductById(Number(req.params.id))
      .then((result) => res.json(result))
      .catch((err) => next(err));
  }

  private handleCreateProduct(req: Request, res: Response, next: NextFunction) {
    const { name, description, price, stock, categoryId, subcategoryId } =
      req.body;
    const images: { url: string }[] = req.body.images;

    const product = {
      name,
      description,
      price,
      stock,
      categoryId,
      subcategoryId,
    };

    ProductService.createProduct(product, images)
      .then((result) => res.json(result))
      .catch((err) => next(err));
  }

  private handleUpdateProduct(req: Request, res: Response, next: NextFunction) {
    ProductService.updateProduct(req.body, Number(req.params.id))
      .then((result) => res.json(result))
      .catch((err) => next(err));
  }

  private handleDeleteProduct(req: Request, res: Response, next: NextFunction) {
    ProductService.deleteProduct(Number(req.params.id))
      .then((result) => res.json(result))
      .catch((err) => next(err));
  }
}

export default new ProductRouter().router;
