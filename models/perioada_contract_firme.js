const Sequelize = require("sequelize");
const sequelize = require("../utils/database");

const PerioadaContractFirma = sequelize.define("perioadaContractFirma", {
  id: {
    type: Sequelize.UUID,
    defaultValue: Sequelize.UUIDV4,
    primaryKey: true,
  },
  data_inceput: {
    type: Sequelize.DATE,
  },
  data_finalizare: {
    type: Sequelize.DATE,
  },
});

module.exports = PerioadaContractFirma;
