import express, { NextFunction, Request, Response } from 'express';
import authTokenMiddleware from '../middlewares/auth-token.middleware';
import authPermissionsMiddleware from '../middlewares/auth-permissions.middleware';
import OrderService from '../services/order.service';
import { Configuration } from '../config/config';

class OrderRouter extends Configuration {
  public router: express.Router;
  private PHONE_NUMBER: number;

  constructor() {
    super();
    this.router = express.Router();
    this.PHONE_NUMBER = this.getNumberEnviroment('PHONE_NUMBER');

    this.createRouters();
  }

  createRouters(): void {
    this.router.get(
      '/order/user/:id',
      authTokenMiddleware.authToken.bind(authTokenMiddleware),
      this.getOrdersByUserId.bind(this)
    );
    this.router.get(
      '/order/',
      authTokenMiddleware.authToken.bind(authTokenMiddleware),
      authPermissionsMiddleware
        .authPermissions(['admin'])
        .bind(authPermissionsMiddleware),
      this.getOrders.bind(this)
    );
    this.router.get(
      '/order/:id',
      authTokenMiddleware.authToken.bind(authTokenMiddleware),
      authPermissionsMiddleware
        .authPermissions(['admin'])
        .bind(authPermissionsMiddleware),
      this.getOrderById.bind(this)
    );
    this.router.post(
      '/order/',
      authTokenMiddleware.authToken.bind(authTokenMiddleware),
      this.createOrder.bind(this)
    );
    this.router.put(
      '/order/:id',
      authTokenMiddleware.authToken.bind(authTokenMiddleware),
      authPermissionsMiddleware
        .authPermissions(['admin'])
        .bind(authPermissionsMiddleware),
      this.updateOrder.bind(this)
    );
    this.router.delete(
      '/order/:id',
      authTokenMiddleware.authToken.bind(authTokenMiddleware),
      authPermissionsMiddleware
        .authPermissions(['admin'])
        .bind(authPermissionsMiddleware),
      this.deleteOrder.bind(this)
    );
  }

  private getOrdersByUserId(req: Request, res: Response, next: NextFunction) {
    const { page = 1, pageSize = 10 } = req.query;

    OrderService.getOrdersByUserId(+page, +pageSize, Number(req.params.id))
      .then((result) => res.json(result))
      .catch((err) => next(err));
  }

  private getOrders(req: Request, res: Response, next: NextFunction) {
    const { page = 1, pageSize = 10 } = req.query;

    OrderService.getOrders(+page, +pageSize)
      .then((result) => res.json(result))
      .catch((err) => next(err));
  }

  private getOrderById(req: Request, res: Response, next: NextFunction) {
    OrderService.getOrderById(Number(req.params.id))
      .then((result) => res.json(result))
      .catch((err) => next(err));
  }

  private createOrder(req: Request, res: Response, next: NextFunction) {
    const userId = req.user?.id;

    const { products } = req.body;

    OrderService.createOrder(Number(userId), products, this.PHONE_NUMBER)
      .then((result) => res.json(result))
      .catch((err) => next(err));
  }

  private updateOrder(req: Request, res: Response, next: NextFunction) {
    OrderService.updateOrder(req.body, Number(req.params.id))
      .then((result) => res.json(result))
      .catch((err) => next(err));
  }

  private deleteOrder(req: Request, res: Response, next: NextFunction) {
    OrderService.deleteOrder(Number(req.params.id))
      .then((result) => res.json(result))
      .catch((err) => next(err));
  }
}

export default new OrderRouter().router;
