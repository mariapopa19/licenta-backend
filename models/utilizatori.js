const Sequelize = require("sequelize");
const sequelize = require("../utils/database");

const Utilizatori = sequelize.define("utilizatori", {
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
 
});

module.exports = Utilizatori;
