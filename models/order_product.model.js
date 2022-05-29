module.exports = (sequelize, Sequelize) => {
    const OrderProduct = sequelize.define("order_product", {
        orderId: {
            type: Sequelize.INTEGER
        },
        orderProductId: {
            type: Sequelize.INTEGER
        },
        amount: {
            type: Sequelize.INTEGER
        }
    }, {timestamps: false, })
    return OrderProduct;
}
