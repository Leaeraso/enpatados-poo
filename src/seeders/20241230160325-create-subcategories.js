"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert(
      "subcategories",
      [
        {
          name: "3/4",
          category_id: 1,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: "soquetes",
          category_id: 1,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {}
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("subcategories", null, {});
  },
};
