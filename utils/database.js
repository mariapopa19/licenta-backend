const Sequelize = require("sequelize");
const dotenv = require("dotenv");

dotenv.config();

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASS,
  {
    dialect: "mysql",
    host: process.env.DB_HOST,
    define: {
      freezeTableName: true,
    },
    logging: false,
  }
);

module.exports = sequelize;
