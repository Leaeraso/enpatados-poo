"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert(
      "orders",
      [
        {
          date: new Date(),
          total: 7500,
          status: "pending",
          user_id: 1,
          discount: 0,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          date: new Date(),
          total: 17500,
          status: "paid",
          user_id: 2,
          discount: 0,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          date: new Date(),
          total: 5000,
          status: "canceled",
          user_id: 3,
          discount: 0,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      { returning: true }
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("orders", null, {});
  },
};
