import { Op } from 'sequelize';
import SubcategoryDTO from '../data/dto/subcategory.dto';
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
  async getSubcategories(search?: string) {
    try {
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
    } catch (error) {
      console.error(error);
      throw new InternalServerError('Error trying to get the subcategories');
    }
  }

  async getSubcategoryById(id: number) {
    try {
      const subcategory = await SubcategoryModel.findOne({
        where: { subcategory_id: id },
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
    } catch (error) {
      console.error(error);
      throw new InternalServerError('Error trying to get the subcategory');
    }
  }

  async createSubcategory(subcategory: SubcategoryDTO) {
    try {
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
    } catch (error) {
      console.error(error);
      throw new InternalServerError('Error trying to create the subcategory');
    }
  }

  async updateSubcategory(
    updatedSubcategory: Partial<SubcategoryDTO>,
    id: number
  ) {
    try {
      const subcategory = await SubcategoryModel.findByPk(id);

      if (!subcategory) {
        throw new NotFoundError('Subcategory not found');
      }

      subcategory.update(updatedSubcategory);

      return subcategory;
    } catch (error) {
      console.error(error);
      throw new InternalServerError('Error trying to update the subcategory');
    }
  }

  async deleteSubcategory(id: number) {
    try {
      const deletedSubcategory = await SubcategoryModel.destroy({
        where: { subcategory_id: id },
      });

      if (deletedSubcategory === 0) {
        throw new NotFoundError('Subcategory not found');
      }

      return { message: 'Subcategory deleted successfully' };
    } catch (error) {
      console.error(error);
      throw new InternalServerError('Error trying to delete the subcategory');
    }
  }
}

export default new SubcategoryService();
