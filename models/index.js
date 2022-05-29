const config = require('../config/config.js');
const {Sequelize} = require('sequelize');
const {database, username, password} = config["development"];

const sequelize = new Sequelize(
  database,
  username,
  password,
  {
    host: config["development"]["host"],
    dialect: "mysql",
    define: {
     freezeTableName: true
    }
  }
);

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.product = require('./product.model.js')(sequelize, Sequelize);
db.voucher = require('./voucher.model.js')(sequelize, Sequelize);
db.user = require('./user.model.js')(sequelize, Sequelize);
db.order = require('./order.model.js')(sequelize, Sequelize);
db.order_product = require('./order_product.model.js')(sequelize, Sequelize);


db.order.hasMany(db.order_product);
db.order_product.belongsTo(db.product, {foreignKey: 'orderProductId'});


module.exports = db;
