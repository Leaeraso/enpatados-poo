import express from 'express';
import ProductRouter from './product.router';
import UserRouter from './user.router';
import CategoryRouter from './category.router';
import SubcategoryRouter from './subcategory.router';
import ImageRouter from './image.router';
import OrderRouter from './order.router';

class IndexRouter {
  public router: express.Router;

  constructor() {
    this.router = express.Router();

    this.createRouters();
  }

  createRouters(): void {
    this.router.use(ProductRouter);
    this.router.use(UserRouter);
    this.router.use(CategoryRouter);
    this.router.use(SubcategoryRouter);
    this.router.use(ImageRouter);
    this.router.use(OrderRouter);
  }
}

export default new IndexRouter().router;
