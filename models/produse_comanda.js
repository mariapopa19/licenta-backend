const Sequelize = require("sequelize");
const sequelize = require("../utils/database");

const ProduseComanda = sequelize.define(
  "produseComanda",
  {
    id: {
      type: Sequelize.UUID,
      defaultValue: Sequelize.UUIDV4,
      primaryKey: true,
    },
    cantitate: Sequelize.INTEGER,
  },
  {
    name: {
      singular: "produsComanda",
      plural: "produseComanda",
    },
  }
);

module.exports = ProduseComanda;
