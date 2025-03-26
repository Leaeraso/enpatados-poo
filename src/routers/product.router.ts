import express, { NextFunction, Request, Response } from 'express';
import authTokenMiddleware from '../middlewares/auth-token.middleware';
import authPermissionsMiddleware from '../middlewares/auth-permissions.middleware';
import ProductService from '../services/product.service';

class ProductRouter {
  public router: express.Router;

  constructor() {
    this.router = express.Router();

    this.createRouters();
  }

  createRouters(): void {
    this.router.get('/product/', this.getProducts.bind(this));
    this.router.get('/product/:id', this.getProductById.bind(this));
    this.router.post(
      '/product/',
      authTokenMiddleware.authToken.bind(authTokenMiddleware),
      authPermissionsMiddleware
        .authPermissions(['admin'])
        .bind(authPermissionsMiddleware),
      this.createProduct.bind(this)
    );
    this.router.put(
      '/product/:id',
      authTokenMiddleware.authToken.bind(authTokenMiddleware),
      authPermissionsMiddleware
        .authPermissions(['admin'])
        .bind(authPermissionsMiddleware),
      this.updateProduct.bind(this)
    );
    this.router.delete(
      '/product/:id',
      authTokenMiddleware.authToken.bind(authTokenMiddleware),
      authPermissionsMiddleware
        .authPermissions(['admin'])
        .bind(authPermissionsMiddleware),
      this.deleteProduct.bind(this)
    );
  }

  private getProducts(req: Request, res: Response, next: NextFunction) {
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

  private getProductById(req: Request, res: Response, next: NextFunction) {
    ProductService.getProductById(Number(req.params.id))
      .then((result) => res.json(result))
      .catch((err) => next(err));
  }

  private createProduct(req: Request, res: Response, next: NextFunction) {
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

  private updateProduct(req: Request, res: Response, next: NextFunction) {
    ProductService.updateProduct(req.body, Number(req.params.id))
      .then((result) => res.json(result))
      .catch((err) => next(err));
  }

  private deleteProduct(req: Request, res: Response, next: NextFunction) {
    ProductService.deleteProduct(Number(req.params.id))
      .then((result) => res.json(result))
      .catch((err) => next(err));
  }
}

export default new ProductRouter().router;
