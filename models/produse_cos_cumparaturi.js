const Sequelize = require("sequelize");
const sequelize = require("../utils/database");

const ProdusCosCumparaturi = sequelize.define(
  "produsCosCumparaturi",
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
      singular: "produsCosCumparaturi",
      plural: "produseCosCumparaturi",
    },
  }
);

module.exports = ProdusCosCumparaturi;
