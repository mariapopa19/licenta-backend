const Sequelize = require("sequelize");
const sequelize = require("../utils/database");

const Produs = sequelize.define(
  "produs",
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
    pret: {
      type: Sequelize.DOUBLE,
      allowNull: false,
    },
    imageURL: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    descriere: {
      type: Sequelize.STRING,
      allowNull: false,
    },
  },
  {
    name: {
      singular: "produs",
      plural: "produse",
    },
  }
);

module.exports = Produs;
