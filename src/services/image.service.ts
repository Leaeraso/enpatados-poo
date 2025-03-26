import ImageDTO from '../data/dto/image.dto';
import ImageModel from '../data/models/image.model';
import ProductModel from '../data/models/product.model';
import validateHelper from '../helpers/validate.helper';
import { BadRequestError, NotFoundError } from '../helpers/error.helper';

class ImageService {
  async getImages(page: number, pageSize: number) {
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
  }

  async getImagesByProductId(productId: number) {
    const images = await ImageModel.findAll({
      where: {
        product_id: productId,
      },
    });

    if (images.length === 0) {
      throw new NotFoundError('Images not found');
    }

    const imagesRet = images.map((image) => image.toJSON());

    return imagesRet;
  }

  async createImage(image: ImageDTO) {
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
  }

  async updateImage(updatedImage: Partial<ImageDTO>, imageId: number) {
    const image = await ImageModel.findByPk(imageId);

    if (!image) {
      throw new NotFoundError('Image not found');
    }

    image.update(updatedImage);

    return image;
  }

  async deleteImage(imageId: number) {
    const deletedImage = await ImageModel.destroy({
      where: {
        image_id: imageId,
      },
    });

    if (deletedImage === 0) {
      throw new NotFoundError('Image not found');
    }

    return { message: 'Image deleted successfully' };
  }
}

export default new ImageService();
