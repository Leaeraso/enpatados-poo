"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    try {
      const insertedProducts = await queryInterface.bulkInsert(
        "products",
        [
          {
            name: "medias de wolverine",
            description: "medias de wolverine para combinar con deadpool",
            price: 2500,
            stock: 10,
            category_id: 1,
            subcategory_id: 2,
            createdAt: new Date(),
            updatedAt: new Date(),
          },
          {
            name: "medias de deadpool",
            description: "medias de deadpool para combinar con wolverine",
            price: 2500,
            stock: 5,
            category_id: 1,
            subcategory_id: 2,
            createdAt: new Date(),
            updatedAt: new Date(),
          },
          {
            name: "medias adidas blancas",
            description: "medias deportivas adidas blancas con detalles negros",
            price: 3500,
            stock: 8,
            category_id: 1,
            subcategory_id: 1,
            createdAt: new Date(),
            updatedAt: new Date(),
          },
          {
            name: "medias nike negras",
            description: "medias deportivas nike negras con detalles blancos",
            price: 3500,
            stock: 12,
            category_id: 1,
            subcategory_id: 1,
            createdAt: new Date(),
            updatedAt: new Date(),
          },
        ],
        { returning: true }
      );

      // const productIds = insertedProducts.map((product) => product.product_id);

      // console.log("products:", productIds);

      if (!insertedProducts || insertedProducts.length === 0) {
        throw new Error("No se encontraron productos.");
      }
    } catch (error) {
      console.error(error);
    }
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("products", null, {});
  },
};
