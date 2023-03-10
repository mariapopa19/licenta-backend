const Sequelize = require("sequelize");
const sequelize = require("../utils/database");

const CosCumparaturi = sequelize.define("cos-cumparaturi", {
  id: {
    type: Sequelize.UUID,
    defaultValue: Sequelize.UUIDV4,
    primaryKey: true,
  },
});

module.exports = CosCumparaturi;
