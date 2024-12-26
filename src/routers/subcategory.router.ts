import express, { NextFunction, Request, Response } from 'express';
import SubcategoryService from '../services/subcategory.service';

class SubcategoryRouter {
  public router: express.Router;

  constructor() {
    this.router = express.Router();

    this.createRouters();
  }

  createRouters(): void {
    this.router.get('/', this.handleGetSubcategories.bind(this));
  }

  private handleGetSubcategories(
    _req: Request,
    res: Response,
    next: NextFunction
  ) {
    SubcategoryService.getSubcategories()
      .then((result) => res.json(result))
      .catch((err) => next(err));
  }

  private handleGetSubcategoryById(
    req: Request,
    res: Response,
    next: NextFunction
  ) {}
}

export default new SubcategoryRouter().router;
