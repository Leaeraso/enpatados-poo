import ImageDTO from '../data/dto/image.dto';
import ImageModel from '../data/models/image.model';
import ProductModel from '../data/models/product.model';
import validateHelper from '../helpers/validate.helper';

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

class ImageService {
  async getImages(page: number, pageSize: number) {
    try {
      let options = {
        limit: pageSize,
        offset: (page - 1) * pageSize,
      };

      const { count, rows } = await ImageModel.findAndCountAll({
        ...options,
        distinct: true,
        include: [
          {
            model: ProductModel,
            as: 'product',
            attributes: ['name'],
          },
        ],
      });

      if (rows.length === 0) {
        throw new NotFoundError('Images not found');
      }

      const totalCounts = Array.isArray(count)
        ? count.reduce((sum, group) => sum + group.count, 0)
        : count;

      const images = rows.map((row) => row.toJSON());

      const totalPages = Math.ceil(totalCounts / pageSize);

      return { images, totalCounts, totalPages };
    } catch (error) {
      console.error(error);
      throw new InternalServerError('Error trying to get the images');
    }
  }

  async getImagesByProductId(id: number) {
    try {
      const images = await ImageModel.findAll({
        where: {
          product_id: id,
        },
      });

      if (images.length === 0) {
        throw new NotFoundError('Images not found');
      }

      const imagesRet = images.map((image) => image.toJSON());

      return imagesRet;
    } catch (error) {
      console.error(error);
      throw new InternalServerError(
        'Error trying to get the images of the product'
      );
    }
  }

  async createImage(image: ImageDTO) {
    try {
      await validateHelper.validateData(ImageModel, image);

      const existingImage = await ImageModel.findOne({
        where: { url: image.url },
      });

      if (existingImage) {
        throw new BadRequestError('Image already exists');
      }

      await ImageModel.create({
        url: image.url,
        product_id: image.productId,
      });

      return { message: 'Image created successfully' };
    } catch (error) {
      console.error(error);
      throw new InternalServerError('Error trying to create the image');
    }
  }

  async updateImage(updatedImage: Partial<ImageDTO>, id: number) {
    try {
      const image = await ImageModel.findByPk(id);

      if (!image) {
        throw new NotFoundError('Image not found');
      }

      image.update(updatedImage);

      return image;
    } catch (error) {
      console.error(error);
      throw new InternalServerError('Error trying to update the image');
    }
  }

  async deleteImage(id: number) {
    try {
      const deletedImage = await ImageModel.destroy({
        where: {
          image_id: id,
        },
      });

      if (deletedImage === 0) {
        throw new NotFoundError('Image not found');
      }

      return { message: 'Image deleted successfully' };
    } catch (error) {
      console.error(error);
      throw new InternalServerError('Errory trying to delete the image');
    }
  }
}

export default new ImageService();
