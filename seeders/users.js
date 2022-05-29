module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('user', [
      {
        userName: 'vliegtuig1',
        password: 'testww',
      },
      {
        userName: 'vliegtuig2',
        password: 'testww',
      },
      {
        userName: 'vliegtuig3',
        password: 'testww',
      }
    ])
  }
}
