import {
  CreationOptional,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  Model,
  Sequelize,
} from 'sequelize';

class CategoryModel extends Model<
  InferAttributes<CategoryModel>,
  InferCreationAttributes<CategoryModel>
> {
  declare category_id: CreationOptional<number>;
  declare name: string;
  declare description: string;
  declare icon: Text;

  public static initialize(sequelize: Sequelize) {
    CategoryModel.init(
      {
        category_id: {
          type: DataTypes.INTEGER,
          primaryKey: true,
          autoIncrement: true,
        },
        name: {
          type: DataTypes.STRING,
          allowNull: false,
          unique: true,
        },
        description: {
          type: DataTypes.STRING,
          allowNull: false,
          unique: true,
        },
        icon: {
          type: DataTypes.TEXT,
          allowNull: false,
        },
      },
      {
        timestamps: true,
        tableName: 'categories',
        sequelize,
      }
    );
  }
}

export default CategoryModel;
