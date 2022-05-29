module.exports = (sequelize, Sequelize) => {
  const Product = sequelize.define("product", {
    name: {
      type: Sequelize.STRING
    },
    description: {
      type: Sequelize.STRING
    },
    product_type: {
      type: Sequelize.STRING
    },
    price: {
      type: Sequelize.DECIMAL,
    },
    image: {
      type: Sequelize.STRING
    },
  }, {timestamps: false});
  return Product;
}
