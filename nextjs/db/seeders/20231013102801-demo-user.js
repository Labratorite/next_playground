'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    return queryInterface.bulkInsert('Users', [{
		firstName: 'Ka',
		lastName: 'Ko',
        nickname: 'KK',
		email: 'example@example.com',
		createdAt: new Date(),
		updatedAt: new Date()
	  }]);
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
	return queryInterface.bulkDelete('Users', null, {});
  }
};
