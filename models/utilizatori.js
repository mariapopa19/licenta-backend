const Sequelize = require("sequelize");
const sequelize = require("../utils/database");

const Utilizator = sequelize.define(
  "utilizator",
  {
    id: {
      type: Sequelize.UUID,
      defaultValue: Sequelize.UUIDV4,
      primaryKey: true,
    },
    nume: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    email: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    parola: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    curier: {
      type: Sequelize.BOOLEAN,
    },
  },
  {
    name: {
      singular: "utilizator",
      plural: "utilizatori",
    },
  }
);

module.exports = Utilizator;
