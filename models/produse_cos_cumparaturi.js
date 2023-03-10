const Sequelize = require("sequelize");
const sequelize = require("../utils/database");

const ProdusCosCumparaturi = sequelize.define("produs-cos-cumparaturi", {
  id: {
    type: Sequelize.UUID,
    defaultValue: Sequelize.UUIDV4,
    primaryKey: true,
  },
  cantitate: Sequelize.INTEGER,
});

module.exports = ProdusCosCumparaturi;
