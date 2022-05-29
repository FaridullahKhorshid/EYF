module.exports = (sequelize, Sequelize) => {

    const Voucher = sequelize.define("voucher", {
        code: {
            unique: true,
            type: Sequelize.STRING
        },
        duration: {
            type: Sequelize.INTEGER
        },
        price: {
            type: Sequelize.DECIMAL,
        }
    });

    return Voucher;
}

