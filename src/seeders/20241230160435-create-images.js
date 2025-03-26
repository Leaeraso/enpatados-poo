"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert(
      "images",
      [
        {
          url: "https://res.cloudinary.com/deocpgvil/image/upload/v1733352213/ENPATADOS/SOQUETES/ulkjtnylgjjiwwuvmb5u.webp",
          product_id: 1,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          url: "https://res.cloudinary.com/deocpgvil/image/upload/v1733352213/ENPATADOS/SOQUETES/ulkjtnylgjjiwwuvmb5u.webp",
          product_id: 2,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          url: "https://res.cloudinary.com/deocpgvil/image/upload/v1733352213/ENPATADOS/SOQUETES/ulkjtnylgjjiwwuvmb5u.webp",
          product_id: 2,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          url: "https://res.cloudinary.com/deocpgvil/image/upload/v1733352213/ENPATADOS/SOQUETES/ulkjtnylgjjiwwuvmb5u.webp",
          product_id: 3,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          url: "https://res.cloudinary.com/deocpgvil/image/upload/v1733352213/ENPATADOS/SOQUETES/ulkjtnylgjjiwwuvmb5u.webp",
          product_id: 3,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          url: "https://res.cloudinary.com/deocpgvil/image/upload/v1733352213/ENPATADOS/SOQUETES/ulkjtnylgjjiwwuvmb5u.webp",
          product_id: 4,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          url: "https://res.cloudinary.com/deocpgvil/image/upload/v1733352213/ENPATADOS/SOQUETES/ulkjtnylgjjiwwuvmb5u.webp",
          product_id: 4,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {}
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("images", null, {});
  },
};
