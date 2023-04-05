const Sequelize = require("sequelize");
const sequelize = require("../utils/database");

const CategorieProdus = sequelize.define(
  "categorieProdus",
  {
    id: {
      type: Sequelize.UUID,
      defaultValue: Sequelize.UUIDV4,
      primaryKey: true,
    },
    denumire: {
      type: Sequelize.STRING,
      allowNull: false,
    },
  },
  {
    name: {
      singular: "categorieProdus",
      plural: "categoriiProdus",
    },
  }
);

module.exports = CategorieProdus;
