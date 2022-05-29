require('dotenv').config();

const database = process.env.DB_NAME;
const pass = process.env.DB_PASS;
const user = process.env.DB_USER;
const host = process.env.DB_HOST;

module.exports = {
    development: {
        username: user,
        password: pass,
        database: database,
        host: host,
        dialect: "mysql",
        port: 3306
    }
}
