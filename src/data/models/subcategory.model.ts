import {
  CreationOptional,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  Model,
  Sequelize,
} from 'sequelize';

class SubcategoryModel extends Model<
  InferAttributes<SubcategoryModel>,
  InferCreationAttributes<SubcategoryModel>
> {
  declare id: CreationOptional<number>;
  declare name: string;
  declare category_id: number;

  public static initialize(sequelize: Sequelize) {
    SubcategoryModel.init(
      {
        id: {
          type: DataTypes.INTEGER,
          primaryKey: true,
          autoIncrement: true,
        },
        name: {
          type: DataTypes.STRING,
          allowNull: false,
          unique: true,
        },
        category_id: {
          type: DataTypes.INTEGER,
          allowNull: false,
        },
      },
      {
        timestamps: true,
        tableName: 'subcategories',
        sequelize,
      }
    );
  }
}

export default SubcategoryModel;
