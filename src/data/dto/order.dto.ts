interface OrderDTO {
  orderNumber?: number;
  date: Date;
  total: number;
  status: States;
  userId: number;
  discount: number;
}

export enum States {
  Pending = 'pending',
  Paid = 'paid',
  Canceled = 'canceled',
}

export default OrderDTO;
