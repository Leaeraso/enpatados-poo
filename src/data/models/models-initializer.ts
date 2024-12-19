import { Connection } from '../../config/database/connection.database';
import { Sequelize } from 'sequelize';
import CategoryModel from './category.model';
import ImageModel from './image.model';
import OrderProductModel from './order-product.model.';
import OrderModel from './order.model';
import ProductModel from './product.model';
import SubcategoryModel from './subcategory.model';
import UserModel from './user.model';

class ModelsInitializer {
  private sequelize: Sequelize;

  constructor() {
    this.sequelize = Connection.getInstance().sequelize;

    this.initializeModels();
    this.setupAssociations();
  }

  public initializeModels(): void {
    CategoryModel.initialize(this.sequelize);
    ImageModel.initialize(this.sequelize);
    OrderProductModel.initialize(this.sequelize);
    OrderModel.initialize(this.sequelize);
    ProductModel.initialize(this.sequelize);
    SubcategoryModel.initialize(this.sequelize);
    UserModel.initialize(this.sequelize);
  }

  public setupAssociations() {
    OrderModel.belongsToMany(ProductModel, {
      through: 'order_product',
      foreignKey: 'order_id',
      otherKey: 'product_id',
      as: 'products',
    });
    ProductModel.belongsToMany(OrderModel, {
      through: 'order_product',
      foreignKey: 'product_id',
      otherKey: 'order_id',
      as: 'orders',
    });

    OrderProductModel.belongsTo(OrderModel, {
      foreignKey: 'order_id',
      onDelete: 'CASCADE',
    });
    OrderProductModel.belongsTo(ProductModel, {
      foreignKey: 'product_id',
      onDelete: 'CASCADE',
    });

    UserModel.hasMany(OrderModel, {
      foreignKey: 'user_id',
      onDelete: 'CASCADE',
    });
    OrderModel.belongsTo(UserModel, {
      foreignKey: 'user_id',
      onDelete: 'CASCADE',
    });

    CategoryModel.hasMany(ProductModel, {
      foreignKey: 'category_id',
      as: 'products',
      onDelete: 'CASCADE',
    });
    ProductModel.belongsTo(CategoryModel, {
      foreignKey: 'category_id',
      as: 'category',
      onDelete: 'CASCADE',
    });

    CategoryModel.hasMany(SubcategoryModel, {
      foreignKey: 'category_id',
      as: 'subcategories',
      onDelete: 'CASCADE',
    });
    SubcategoryModel.belongsTo(CategoryModel, {
      foreignKey: 'category_id',
      as: 'category',
      onDelete: 'CASCADE',
    });

    SubcategoryModel.hasMany(ProductModel, {
      foreignKey: 'subcategory_id',
      as: 'products',
      onDelete: 'CASCADE',
    });
    ProductModel.belongsTo(SubcategoryModel, {
      foreignKey: 'subcategory_id',
      as: 'subcategory',
      onDelete: 'CASCADE',
    });

    ProductModel.hasMany(ImageModel, {
      foreignKey: 'product_id',
      as: 'images',
      onDelete: 'CASCADE',
    });
    ImageModel.belongsTo(ProductModel, {
      foreignKey: 'product_id',
      as: 'product',
      onDelete: 'CASCADE',
    });
  }
}

export default ModelsInitializer;
