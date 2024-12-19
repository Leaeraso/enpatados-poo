import {
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  Model,
  Sequelize,
} from 'sequelize';

class OrderProductModel extends Model<
  InferAttributes<OrderProductModel>,
  InferCreationAttributes<OrderProductModel>
> {
  declare order_id: number;
  declare product_id: number;
  declare quantity: number;
  declare subtotal: number;

  public static initialize(sequelize: Sequelize) {
    OrderProductModel.init(
      {
        order_id: {
          type: DataTypes.INTEGER,
          allowNull: false,
          references: {
            model: 'orders',
            key: 'order_number',
          },
        },
        product_id: {
          type: DataTypes.INTEGER,
          allowNull: false,
        },
        quantity: {
          type: DataTypes.INTEGER,
          allowNull: false,
        },
        subtotal: {
          type: DataTypes.FLOAT,
          allowNull: false,
        },
      },
      {
        tableName: 'order_product',
        timestamps: false,
        sequelize,
      }
    );
  }
}
export default OrderProductModel;
