import { Op } from 'sequelize';
import SubcategoryDTO from '../data/dto/subcategory.dto';
import CategoryModel from '../data/models/category.model';
import SubcategoryModel from '../data/models/subcategory.model';
import { BadRequestError, NotFoundError } from '../helpers/error.helper';

class SubcategoryService {
  async getSubcategories(search?: string) {
    let whereConditional: any = {};

    if (search) {
      whereConditional[Op.or] = [{ name: { [Op.like]: `%${search}%` } }];
    }

    const subcategories = await SubcategoryModel.findAll({
      ...whereConditional,
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

    return subcategoriesRet;
  }

  async getSubcategoryById(subcategoryId: number) {
    const subcategory = await SubcategoryModel.findOne({
      where: { subcategory_id: subcategoryId },
      include: [
        {
          model: CategoryModel,
          as: 'category',
          attributes: ['category_id', 'name'],
        },
      ],
    });

    if (!subcategory) {
      throw new NotFoundError('Subcategory not found');
    }

    return subcategory.toJSON();
  }

  async createSubcategory(subcategory: SubcategoryDTO) {
    const existingSubcategory = await SubcategoryModel.findOne({
      where: { name: subcategory.name },
    });

    if (existingSubcategory) {
      throw new BadRequestError('The subcategory already exists');
    }

    await SubcategoryModel.create({
      name: subcategory.name,
      category_id: subcategory.categoryId,
    });

    return { message: 'Subcategory created successfully' };
  }

  async updateSubcategory(
    updatedSubcategory: Partial<SubcategoryDTO>,
    subcategoryId: number
  ) {
    const subcategory = await SubcategoryModel.findByPk(subcategoryId);

    if (!subcategory) {
      throw new NotFoundError('Subcategory not found');
    }

    subcategory.update(updatedSubcategory);

    return subcategory;
  }

  async deleteSubcategory(subcategoryId: number) {
    const deletedSubcategory = await SubcategoryModel.destroy({
      where: { subcategory_id: subcategoryId },
    });

    if (deletedSubcategory === 0) {
      throw new NotFoundError('Subcategory not found');
    }

    return { message: 'Subcategory deleted successfully' };
  }
}

export default new SubcategoryService();
