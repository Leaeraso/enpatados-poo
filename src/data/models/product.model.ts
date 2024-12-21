import {
  CreationOptional,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  Model,
  Sequelize,
} from 'sequelize';

class ProductModel extends Model<
  InferAttributes<ProductModel>,
  InferCreationAttributes<ProductModel>
> {
  declare product_id: CreationOptional<number>;
  declare name: string;
  declare description: string;
  declare price: number;
  declare stock: number;
  declare category_id: number;
  declare subcategory_id: number | null;

  public static initialize(sequelize: Sequelize) {
    ProductModel.init(
      {
        product_id: {
          type: DataTypes.INTEGER,
          primaryKey: true,
          autoIncrement: true,
        },
        name: {
          type: DataTypes.STRING,
          allowNull: false,
          validate: {
            min: 2,
            max: 20,
          },
        },
        description: {
          type: DataTypes.STRING,
          allowNull: true,
        },
        price: {
          type: DataTypes.FLOAT,
          allowNull: false,
          defaultValue: 0,
        },
        stock: {
          type: DataTypes.INTEGER,
          allowNull: false,
          defaultValue: 0,
        },
        category_id: {
          type: DataTypes.INTEGER,
          allowNull: false,
        },
        subcategory_id: {
          type: DataTypes.INTEGER,
          allowNull: true,
        },
      },
      {
        timestamps: true,
        tableName: 'products',
        sequelize,
      }
    );
  }
}

export default ProductModel;
