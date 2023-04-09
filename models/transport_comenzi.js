const Sequelize = require("sequelize");
const sequelize = require("../utils/database");

const TransportComanda = sequelize.define(
  "transportComanda",
  {
    id: {
      type: Sequelize.UUID,
      defaultValue: Sequelize.UUIDV4,
      primaryKey: true,
    },
    status: Sequelize.STRING,
  },
  {
    name: {
      singular: "transportComanda",
      plural: "transportComenzi",
    },
  }
);

module.exports = TransportComanda;
