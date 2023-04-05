const Sequelize = require("sequelize");
const sequelize = require("../utils/database");

const Firma = sequelize.define(
  "firma",
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
      singular: "firma",
      plural: "firme",
    },
  }
);

module.exports = Firma;
