import {
  CreationOptional,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  Model,
  Sequelize,
} from 'sequelize';

class UserModel extends Model<
  InferAttributes<UserModel>,
  InferCreationAttributes<UserModel>
> {
  declare id: CreationOptional<number>;
  declare google_id: string | null;
  declare name: string;
  declare surname: string;
  declare password: string;
  declare email: string;
  declare date_of_birth: Date | null;
  declare role: CreationOptional<string>;

  public static initialize(sequelize: Sequelize) {
    UserModel.init(
      {
        id: {
          type: DataTypes.INTEGER,
          primaryKey: true,
          autoIncrement: true,
        },
        google_id: {
          type: DataTypes.STRING,
          allowNull: true,
          unique: true,
        },
        name: {
          type: DataTypes.STRING,
          allowNull: false,
          validate: {
            min: 2,
            max: 20,
          },
        },
        surname: {
          type: DataTypes.STRING,
          allowNull: false,
          validate: {
            min: 2,
            max: 20,
          },
        },
        password: {
          type: DataTypes.STRING,
          allowNull: true,
          validate: {
            min: 8,
            max: 30,
          },
        },
        email: {
          type: DataTypes.STRING,
          allowNull: false,
          unique: true,
          validate: {
            isEmail: true,
          },
        },
        date_of_birth: {
          type: DataTypes.DATE,
          allowNull: true,
          validate: {
            isDate: true,
          },
          defaultValue: '2000-01-01',
        },
        role: {
          type: DataTypes.ENUM('admin', 'customer'),
          allowNull: false,
          defaultValue: 'customer',
        },
      },
      {
        sequelize,
        timestamps: true,
        tableName: 'users',
      }
    );
  }
}

export default UserModel;
