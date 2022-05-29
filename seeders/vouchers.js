module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.bulkInsert('voucher', [
            {
                code: 'Tulip01',
                price: 100,
                duration: 3,
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                code: 'Tulip02',
                price: 100,
                duration: 4,
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                code: 'Tulip03',
                price: 100,
                duration: 2,
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                code: 'Tulip04',
                price: 100,
                duration: 4,
                createdAt: new Date(),
                updatedAt: new Date()
            },
        ])
    },
    down: (queryInterface, Sequelize) => {
        return queryInterface.bulkDelete('voucher', null, {});
    }
}
