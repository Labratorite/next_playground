'use strict';

/** @type {import('sequelize-cli').Migration} */
const { fakerJA: faker } = require('@faker-js/faker');

module.exports = {
  async up(queryInterface) {
    const workflows = [...Array(2)].map(() => ({
      name: 'flow' + faker.number.int(),
      publish: faker.datatype.boolean(),
      createdAt: new Date(),
      updatedAt: new Date(),
    }));

    return queryInterface.bulkInsert('Workflows', workflows, {});
  },

  async down(queryInterface) {
    return queryInterface.bulkDelete('Workflows', null, {});
  },
};
