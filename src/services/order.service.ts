import OrderProductDTO from '../data/dto/order-product.dto';
import ImageModel from '../data/models/image.model';
import OrderModel from '../data/models/order.model';
import ProductModel from '../data/models/product.model';
import UserModel from '../data/models/user.model';
import OrderDTO, { States } from '../data/dto/order.dto';
import OrderProductModel from '../data/models/order-product.model.';
import { BadRequestError, NotFoundError } from '../helpers/error.helper';

type ProductWithOrderProduct = ProductModel & {
  OrderProductModel: {
    quantity: number;
  };
};

class OrderService {
  async getOrdersByUserId(page: number, pageSize: number, userId: number) {
    const options = {
      limit: pageSize,
      offset: (page - 1) * pageSize,
    };

    const { count, rows } = await OrderModel.findAndCountAll({
      ...options,
      where: {
        user_id: userId,
      },
      order: [['createdAt', 'DESC']],
      include: [
        {
          model: ProductModel,
          as: 'products',
          attributes: ['name'],
          include: [
            {
              model: ImageModel,
              as: 'images',
              attributes: ['url'],
            },
          ],
        },
      ],
    });

    if (rows.length === 0) {
      throw new NotFoundError('Orders not found');
    }

    const orders = rows.map((row) => row.toJSON());

    const totalPages = Math.ceil(count / pageSize);

    return { orders, totalPages, count };
  }

  async getOrders(page: number, pageSize: number) {
    const options = {
      limit: pageSize,
      offset: (page - 1) * pageSize,
    };

    const { rows, count } = await OrderModel.findAndCountAll({
      ...options,
      order: [['createdAt', 'DESC']],
      include: [
        {
          model: ProductModel,
          as: 'products',
          attributes: ['name'],
          include: [
            {
              model: ImageModel,
              as: 'images',
              attributes: ['url'],
            },
          ],
        },
        {
          model: UserModel,
          attributes: ['name', 'surname'],
        },
      ],
    });

    if (rows.length === 0) {
      throw new NotFoundError('Orders not found');
    }

    const totalPages = Math.ceil(count / pageSize);

    const orders = rows.map((row) => row.toJSON());

    return { orders, totalPages, count };
  }

  async getOrderById(orderId: number) {
    const order = await OrderModel.findOne({
      where: {
        order_number: orderId,
      },
      include: [
        {
          model: ProductModel,
          as: 'products',
          attributes: ['name'],
          include: [
            {
              model: ImageModel,
              as: 'images',
              attributes: ['url'],
            },
          ],
        },
        {
          model: UserModel,
          attributes: ['name', 'surname'],
        },
      ],
    });

    if (!order) {
      throw new NotFoundError('Order not found');
    }

    return order.toJSON();
  }

  async createOrder(
    userId: number,
    products: OrderProductDTO[],
    PHONE_NUMBER: number
  ) {
    if (products.length === 0) {
      throw new BadRequestError('There is not products in the shipping cart');
    }

    const productsIds = products.map((product) => product.productId);

    const productList = await ProductModel.findAll({
      where: { product_id: productsIds },
    });

    const productMap = new Map(
      productList.map((product) => [product.product_id, product])
    );

    let total = 0;

    for (const item of products) {
      const product = productMap.get(item.productId);

      if (!product) {
        throw new NotFoundError('Product not found');
      }

      total += product.price * item.quantity;
    }

    const newOrder = await OrderModel.create({
      date: new Date(),
      total: total,
      status: States.Pending,
      user_id: userId,
      discount: 0,
    });

    for (const item of products) {
      const product = productMap.get(item.productId);

      if (!product) {
        throw new NotFoundError('Product not found');
      }

      await OrderProductModel.create({
        order_id: newOrder.order_number,
        product_id: item.productId,
        quantity: item.quantity,
        subtotal: item.quantity * product.price,
      });
    }

    const message = `Hola enpatados! Acabo de visitar su sitio web y he comprado unas medias, mi numero de orden es ${newOrder.order_number}`;
    const whatsAppUrl = `https://wa.me/${PHONE_NUMBER}?text=${encodeURIComponent(
      message
    )}`;

    return whatsAppUrl;
  }

  async updateOrder(updatedOrder: Partial<OrderDTO>, orderId: number) {
    const order = await OrderModel.findOne({
      where: {
        order_number: orderId,
      },
      include: [
        {
          model: ProductModel,
          as: 'products',
          through: {
            attributes: ['quantity'],
          },
        },
      ],
    });

    if (!order) {
      throw new NotFoundError('Order not found');
    }

    if (updatedOrder.discount) {
      const totalWithDisc = order.total - updatedOrder.discount;

      updatedOrder.total = totalWithDisc;
    }

    if (updatedOrder.status === States.Paid) {
      if (!order.products || order.products.length === 0) {
        throw new BadRequestError('Products not found');
      }

      for (const product of order.products as ProductWithOrderProduct[]) {
        const productId = product.product_id;
        const quantityBought = product.OrderProductModel.quantity;

        await ProductModel.decrement('stock', {
          by: quantityBought,
          where: {
            product_id: productId,
          },
        });
      }
    }

    await order.update(updatedOrder);

    return order;
  }

  async deleteOrder(orderId: number) {
    const deletedOrder = await OrderModel.destroy({
      where: { order_number: orderId },
    });

    if (deletedOrder === 0) {
      throw new NotFoundError('Order not found');
    }

    return { message: 'Order deleted successfully' };
  }
}

export default new OrderService();
