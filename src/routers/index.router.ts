import express from 'express';
import ProductRouter from './product.router';
import UserRouter from './user.router';
import CategoryRouter from './category.router';
import SubcategoryRouter from './subcategory.router';

class IndexRouter {
  public router: express.Router;

  constructor() {
    this.router = express.Router();

    this.createRouters();
  }

  createRouters(): void {
    this.router.use('/product', ProductRouter);
    this.router.use('/user', UserRouter);
    this.router.use('/category', CategoryRouter);
    this.router.use('/subcategory', SubcategoryRouter);
  }
}

export default new IndexRouter().router;
