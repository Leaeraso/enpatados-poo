import { Op } from 'sequelize';
import CategoryDTO from '../data/dto/category.dto';
import CategoryModel from '../data/models/category.model';
import SubcategoryModel from '../data/models/subcategory.model';
import { BadRequestError, NotFoundError } from '../helpers/error.helper';

class CategoryService {
  async getCategories(search?: string) {
    let whereConditional: any = {};

    if (search) {
      whereConditional[Op.or] = [{ name: { [Op.like]: `%${search}%` } }];
    }

    const categories = await CategoryModel.findAll({
      where: whereConditional,
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
  }

  async getCategoryById(categoryId: number) {
    const category = await CategoryModel.findOne({
      where: { category_id: categoryId },
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
  }

  async createCategory(category: CategoryDTO) {
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
  }

  async updateCategory(
    updatedCategory: Partial<CategoryDTO>,
    categoryId: number
  ) {
    const category = await CategoryModel.findByPk(categoryId);

    if (!category) {
      throw new NotFoundError('Category not found');
    }

    category.update(updatedCategory);

    return category;
  }

  async deleteCategory(categoryId: number) {
    const deletedCategory = await CategoryModel.destroy({
      where: { category_id: categoryId },
    });

    if (deletedCategory === 0) {
      throw new NotFoundError('Category not found');
    }

    return { message: 'Category deleted successfully' };
  }
}

export default new CategoryService();
