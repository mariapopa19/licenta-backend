const Sequelize = require("sequelize");
const sequelize = require("../utils/database");

const Produs = sequelize.define("produs", {
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
});

module.exports = Produs;
