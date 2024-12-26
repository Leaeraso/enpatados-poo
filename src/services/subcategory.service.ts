import CategoryModel from '../data/models/category.model';
import SubcategoryModel from '../data/models/subcategory.model';

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

class SubcategoryService {
  async getSubcategories() {
    try {
      const subcategories = await SubcategoryModel.findAll({
        include: [
          {
            model: CategoryModel,
            as: 'category',
            attributes: ['category_id', 'name'],
          },
        ],
      });

      if (subcategories.length === 0) {
        throw new NotFoundError('Subcategories not found');
      }

      const subcategoriesRet = subcategories.map((subcategory) =>
        subcategory.toJSON()
      );

      return subcategories;
    } catch (error) {
      console.error(error);
      throw new InternalServerError('Error trying to get the subcategories');
    }
  }

  async getSubcategoryById(id: number) {
    try {
    } catch (error) {}
  }
}

export default new SubcategoryService();
