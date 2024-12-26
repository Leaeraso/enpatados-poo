import { Op } from 'sequelize';
import ProductModel from '../data/models/product.model';
import ImageModel from '../data/models/image.model';
import SubcategoryModel from '../data/models/subcategory.model';
import CategoryModel from '../data/models/category.model';
import ProductDTO from '../data/dto/product.dto';
import ValidateHelper from '../helpers/validate.helper';

class NotFoundError extends Error {
  public statusCode: number;

  constructor(message: string) {
    super(message);
    this.statusCode = 404;
  }
}

class BadRequestError extends Error {
  public statusCode: number;

  constructor(message: string) {
    super(message);
    this.statusCode = 400;
  }
}

class InternalServerError extends Error {
  public statusCode: number;

  constructor(message: string) {
    super(message);
    this.statusCode = 500;
  }
}

class ProductService {
  async getProducts(
    page: number,
    pageSize: number,
    categoryId?: number,
    subcategoryId?: number,
    search?: string
  ) {
    try {
      let whereConditional: any = {};

      if (categoryId) {
        whereConditional['categoryId'] = categoryId;
      }
      if (subcategoryId) {
        whereConditional['subcategoryId'] = subcategoryId;
      }
      if (search) {
        whereConditional[Op.or] = [{ name: { [Op.like]: `%${search}%` } }];
      }

      let options = {
        limit: pageSize,
        offset: (page - 1) * pageSize,
        where: whereConditional,
      };

      const { rows, count } = await ProductModel.findAndCountAll({
        ...options,
        distinct: true,
        include: [
          {
            model: ImageModel,
            as: 'images',
            attributes: ['url'],
          },
          {
            model: SubcategoryModel,
            as: 'subcategory',
            attributes: ['name'],
          },
          {
            model: CategoryModel,
            as: 'category',
            attributes: ['name'],
          },
        ],
      });

      if (rows.length === 0) {
        throw new NotFoundError('Products not found');
      }

      const products = rows.map((row) => row.toJSON());

      const totalPages = Math.ceil(count / pageSize);

      return { products, totalPages, count };
    } catch (error) {
      console.error(error);
      throw new InternalServerError('Error trying to get the products');
    }
  }

  async getProductById(id: number) {
    try {
      const product = await ProductModel.findOne({
        where: {
          product_id: id,
        },
        include: [
          {
            model: ImageModel,
            as: 'images',
            attributes: ['url'],
          },
          {
            model: SubcategoryModel,
            as: 'subcategory',
            attributes: ['name'],
          },
          {
            model: CategoryModel,
            as: 'category',
            attributes: ['name'],
          },
        ],
      });

      if (!product) {
        throw new NotFoundError('Product not found');
      }

      return product.toJSON();
    } catch (error) {
      console.error(error);
      throw new InternalServerError('Error trying to get the product');
    }
  }

  async createProduct(product: ProductDTO, images: { url: string }[]) {
    try {
      await ValidateHelper.validateData(ProductModel, product);

      const existingProduct = await ProductModel.findOne({
        where: {
          name: product.name,
        },
      });

      if (existingProduct) {
        throw new BadRequestError('Product already exists');
      }

      const category = await CategoryModel.findByPk(product.categoryId);

      if (!category) {
        throw new NotFoundError('Category not found');
      }

      if (
        product.subcategoryId !== undefined &&
        product.subcategoryId !== null
      ) {
        const subcategory = await SubcategoryModel.findByPk(
          product.subcategoryId
        );

        if (!subcategory) {
          throw new NotFoundError('Subcategory not found');
        }
      }

      const newProduct = await ProductModel.create({
        name: product.name,
        description: product.description,
        price: product.price,
        stock: product.stock ?? 0,
        category_id: product.categoryId,
        subcategory_id: product.subcategoryId,
      });

      const imagesUrls = images.map((image) => ({
        url: image.url,
        product_id: newProduct.product_id,
      }));

      await ImageModel.bulkCreate(imagesUrls);

      return { message: 'product created successfully' };
    } catch (error) {
      console.error(error);
      throw new InternalServerError('Error trying to create the product');
    }
  }

  async updateProduct(updatedData: Partial<ProductDTO>, id: number) {
    try {
      const product = await ProductModel.findByPk(id);

      if (!product) {
        throw new NotFoundError('Product not found');
      }

      await product.update(updatedData);

      return product;
    } catch (error) {
      console.error(error);
      throw new InternalServerError('Error trying to update the product');
    }
  }

  async deleteProduct(id: number) {
    try {
      const deletedProduct = await ProductModel.destroy({
        where: { product_id: id },
      });

      if (deletedProduct === 0) {
        throw new NotFoundError('Product not found');
      }

      return { message: 'Product deleted successfully' };
    } catch (error) {
      console.error(error);
      throw new InternalServerError('Error trying to delete the product');
    }
  }
}

export default new ProductService();
