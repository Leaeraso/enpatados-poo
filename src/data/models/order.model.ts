import {
  CreationOptional,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  Model,
  Sequelize,
} from 'sequelize';
import ProductModel from './product.model';

class OrderModel extends Model<
  InferAttributes<OrderModel>,
  InferCreationAttributes<OrderModel>
> {
  declare order_number: CreationOptional<number>;
  declare date: Date;
  declare total: number;
  declare status: string;
  declare user_id: number;
  declare discount: CreationOptional<number>;
  declare products?: ProductModel[];

  public static initialize(sequelize: Sequelize) {
    OrderModel.init(
      {
        order_number: {
          type: DataTypes.INTEGER,
          autoIncrement: true,
          primaryKey: true,
          unique: true,
        },
        date: {
          type: DataTypes.DATE,
          allowNull: false,
          validate: {
            isDate: true,
          },
        },
        total: {
          type: DataTypes.FLOAT,
          allowNull: false,
        },
        status: {
          type: DataTypes.ENUM('pendiente', 'pagado', 'cancelado'),
          allowNull: false,
          defaultValue: 'pendiente',
        },
        user_id: {
          type: DataTypes.INTEGER,
          allowNull: false,
        },
        discount: {
          type: DataTypes.FLOAT,
          allowNull: true,
        },
      },
      {
        tableName: 'orders',
        timestamps: true,
        sequelize,
      }
    );
  }
}
export default OrderModel;
