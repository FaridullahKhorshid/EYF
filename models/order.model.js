module.exports = (sequelize, Sequelize) => {
    const Orders = sequelize.define("orders", {
        seatNumber: {
            type: Sequelize.INTEGER
        },
        lastName: {
            type: Sequelize.STRING
        },
        paymentType: {
            type: Sequelize.STRING
        },
        orderStatus: {
            type: Sequelize.STRING
        },
        date: {
            type: Sequelize.DATE
        },
        totalPrice: {
            type: Sequelize.INTEGER
        }

    }, {timestamps: false})
    return Orders;
}
