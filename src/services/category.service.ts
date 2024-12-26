import CategoryDTO from '../data/dto/category.dto';
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

class CategoryService {
  async getCategories() {
    try {
      const categories = await CategoryModel.findAll({
        include: [
          {
            model: SubcategoryModel,
            as: 'subcategories',
            attributes: ['subcategory_id', 'name'],
          },
        ],
      });

      if (categories.length === 0) {
        throw new NotFoundError('Categories not found');
      }

      const categoriesRet = categories.map((category) => category.toJSON());

      return categoriesRet;
    } catch (error) {
      console.error(error);
      throw new InternalServerError('Error trying to get the categories');
    }
  }

  async getCategoryById(id: number) {
    try {
      const category = await CategoryModel.findOne({
        where: { category_id: id },
        include: [
          {
            model: SubcategoryModel,
            as: 'subcategories',
            attributes: ['subcategory_id', 'name'],
          },
        ],
      });

      if (!category) {
        throw new NotFoundError('Category not found');
      }

      return category.toJSON();
    } catch (error) {
      console.error(error);
      throw new InternalServerError('Error trying to get the category');
    }
  }

  async createCategory(category: CategoryDTO) {
    try {
      const existingCategory = await CategoryModel.findOne({
        where: { name: category.name },
      });

      if (existingCategory) {
        throw new BadRequestError('Category already exists');
      }

      await CategoryModel.create({
        name: category.name,
        description: category.description,
        icon: category.icon,
      });

      return { message: 'Category created successfully' };
    } catch (error) {
      console.error(error);
      throw new Error('Error trying to create the category');
    }
  }

  async updateCategory(updatedCategory: Partial<CategoryDTO>, id: number) {
    try {
      const category = await CategoryModel.findByPk(id);

      if (!category) {
        throw new NotFoundError('Category not found');
      }

      category.update(updatedCategory);

      return category;
    } catch (error) {
      console.error(error);
      throw new InternalServerError('Error trying to update the category');
    }
  }

  async deleteCategory(id: number) {
    try {
      const deletedCategory = await CategoryModel.destroy({
        where: { category_id: id },
      });

      if (deletedCategory === 0) {
        throw new NotFoundError('Category not found');
      }

      return { message: 'Category deleted successfully' };
    } catch (error) {
      console.error(error);
      throw new InternalServerError('Error trying to delete the category');
    }
  }
}

export default new CategoryService();
