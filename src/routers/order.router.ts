import express, { NextFunction, Request, Response } from 'express';
import authTokenMiddleware from '../middlewares/auth-token.middleware';
import authPermissionsMiddleware from '../middlewares/auth-permissions.middleware';
import { ErrorMiddleware } from '../middlewares/error.middleware';
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
      '/user/:id',
      authTokenMiddleware.authToken.bind(authTokenMiddleware),
      this.handleGetOrdersByUserId.bind(this),
      ErrorMiddleware.handleError
    );
    this.router.get(
      '/',
      authTokenMiddleware.authToken.bind(authTokenMiddleware),
      authPermissionsMiddleware
        .authPermissions(['admin'])
        .bind(authPermissionsMiddleware),
      this.handleGetOrders.bind(this),
      ErrorMiddleware.handleError
    );
    this.router.get(
      '/:id',
      authTokenMiddleware.authToken.bind(authTokenMiddleware),
      authPermissionsMiddleware
        .authPermissions(['admin'])
        .bind(authPermissionsMiddleware),
      this.handleGetOrderById.bind(this),
      ErrorMiddleware.handleError
    );
    this.router.post(
      '/',
      authTokenMiddleware.authToken.bind(authTokenMiddleware),
      this.handleCreateOrder.bind(this),
      ErrorMiddleware.handleError
    );
    this.router.put(
      '/:id',
      authTokenMiddleware.authToken.bind(authTokenMiddleware),
      authPermissionsMiddleware
        .authPermissions(['admin'])
        .bind(authPermissionsMiddleware),
      this.handleUpdateOrder.bind(this),
      ErrorMiddleware.handleError
    );
    this.router.delete(
      '/:id',
      authTokenMiddleware.authToken.bind(authTokenMiddleware),
      authPermissionsMiddleware
        .authPermissions(['admin'])
        .bind(authPermissionsMiddleware),
      this.handleDeleteOrder.bind(this),
      ErrorMiddleware.handleError
    );
  }

  private handleGetOrdersByUserId(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    const { page = 1, pageSize = 10 } = req.query;

    OrderService.getOrdersByUserId(+page, +pageSize, Number(req.params.id))
      .then((result) => res.json(result))
      .catch((err) => next(err));
  }

  private handleGetOrders(req: Request, res: Response, next: NextFunction) {
    const { page = 1, pageSize = 10 } = req.query;

    OrderService.getOrders(+page, +pageSize)
      .then((result) => res.json(result))
      .catch((err) => next(err));
  }

  private handleGetOrderById(req: Request, res: Response, next: NextFunction) {
    OrderService.getOrderById(Number(req.params.id))
      .then((result) => res.json(result))
      .catch((err) => next(err));
  }

  private handleCreateOrder(req: Request, res: Response, next: NextFunction) {
    const userId = req.user?.id;

    const { products } = req.body;

    OrderService.createOrder(Number(userId), products, this.PHONE_NUMBER)
      .then((result) => res.json(result))
      .catch((err) => next(err));
  }

  private handleUpdateOrder(req: Request, res: Response, next: NextFunction) {
    OrderService.updateOrder(req.body, Number(req.params.id))
      .then((result) => res.json(result))
      .catch((err) => next(err));
  }

  private handleDeleteOrder(req: Request, res: Response, next: NextFunction) {
    OrderService.deleteOrder(Number(req.params.id))
      .then((result) => res.json(result))
      .catch((err) => next(err));
  }
}

export default new OrderRouter().router;
