import {
  CreationOptional,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  Model,
  Sequelize,
} from 'sequelize';

class ImageModel extends Model<
  InferAttributes<ImageModel>,
  InferCreationAttributes<ImageModel>
> {
  declare id: CreationOptional<number>;
  declare url: string;
  declare product_id: number;

  public static initialize(sequelize: Sequelize) {
    ImageModel.init(
      {
        id: {
          type: DataTypes.INTEGER,
          primaryKey: true,
          autoIncrement: true,
        },
        url: {
          type: DataTypes.STRING(2048),
          allowNull: false,
        },
        product_id: {
          type: DataTypes.INTEGER,
          allowNull: false,
        },
      },
      {
        timestamps: true,
        tableName: 'images',
        sequelize,
      }
    );
  }
}

export default ImageModel;
