'use strict';

/** @type {import('sequelize-cli').Migration} */
const { fakerJA: faker } = require('@faker-js/faker');

module.exports = {
  async up(queryInterface) {
    const users = [...Array(20)].map(() => ({
      firstName: faker.person.firstName(),
      lastName: faker.person.lastName(),
      nickname: faker.internet.userName(),
      email: faker.internet.email(),
      //userName: faker.internet.userName(),
      //password: faker.internet.password(8),
      createdAt: new Date(),
      updatedAt: new Date(),
    }));

    return queryInterface.bulkInsert('Users', users, {});
  },

  async down(queryInterface) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    return queryInterface.bulkDelete('Users', null, {});
  },
};
