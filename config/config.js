require('dotenv').config(); // ← Charge les variables .env

module.exports = {
  development: {
    username: process.env.DB_USER || "root",
    password: process.env.DB_PASS || "",
    database: process.env.DB_NAME || "nbhmail",
    host: process.env.DB_HOST || "localhost",
    dialect: "mysql"
  },
  test: {
    username: process.env.DB_USER || "root",
    password: process.env.DB_PASS || "",
    database: process.env.DB_NAME_TEST || "nbhmail_test",
    host: process.env.DB_HOST || "localhost",
    dialect: "mysql"
  },
  production: {
    username: process.env.DB_USER || "root",
    password: process.env.DB_PASS || "",
    database: process.env.DB_NAME_PROD || "nbhmail_prod",
    host: process.env.DB_HOST || "localhost",
    dialect: "mysql"
  }
};
