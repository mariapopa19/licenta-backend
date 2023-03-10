const Sequelize = require("sequelize");
const sequelize = require("../utils/database");

const Comanda = sequelize.define("comanda", {
  id: {
    type: Sequelize.UUID,
    defaultValue: Sequelize.UUIDV4,
    primaryKey: true,
  },
  status: {
    type: Sequelize.STRING,
  },
  adresa: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  ziLivrare: {
    type: Sequelize.DATEONLY,
    allowNull: false,
    comment:
      "In aceasta coloana memoram invervalul la care utilizatorul doreste sa isi fie livrat cadoul, adica data",
  },
  intervalLivrare: {
    type: Sequelize.TIME,
    allowNull: false,
    comment:
      "In aceasta coloana memoram invervalul la care utilizatorul doreste sa isi fie livrat cadoul, adica ora",
  },
});

module.exports = Comanda;
