"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert(
      "order_product",
      [
        {
          order_id: 1,
          product_id: 1,
          quantity: 2,
          subtotal: 5000,
        },
        {
          order_id: 1,
          product_id: 2,
          quantity: 1,
          subtotal: 2500,
        },
        {
          order_id: 2,
          product_id: 3,
          quantity: 3,
          subtotal: 10500,
        },
        {
          order_id: 2,
          product_id: 4,
          quantity: 2,
          subtotal: 7000,
        },
        {
          order_id: 3,
          product_id: 1,
          quantity: 1,
          subtotal: 2500,
        },
        {
          order_id: 3,
          product_id: 2,
          quantity: 1,
          subtotal: 2500,
        },
      ],
      {}
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("order_product", null, {});
  },
};
