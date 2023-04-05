const Sequelize = require("sequelize");
const sequelize = require("../utils/database");

const CosCumparaturi = sequelize.define(
  "cosCumparaturi",
  {
    id: {
      type: Sequelize.UUID,
      defaultValue: Sequelize.UUIDV4,
      primaryKey: true,
    },
  },
  {
    name: {
      singular: "cosCumparaturi",
      plural: "cosuriCumparaturi",
    },
  }
);

module.exports = CosCumparaturi;
