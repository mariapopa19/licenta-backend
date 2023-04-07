const Utilizator = require("../models/utilizatori");
const Comanda = require("../models/comenzi");

exports.getComenzi = async (req, res, next) => {
  try {
    const userId = req.body.userId;
    const oras = req.body.oras;
    const utilizator = await Utilizator.findOne({
      where: { id: userId, curier: true },
    });
    if (utilizator) {
      const comenzi = await Comanda.findAll({ where: { oras: oras } });
      res
        .status(200)
        .json({ message: "Comenzi afisate cu succes!", comenzi: comenzi });
    } else {
      const err = {
        statusCode: 403,
        message: 'Utilizatorul nu este curier'
      }
      throw err;
    }
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.getComanda = async (req, res, next) => {
  try {
    const userId = req.body.userId;
    const comandaId = req.params.comandaId;
    const utilizator = await Utilizator.findOne({
      where: { id: userId, curier: true },
    });
    if (utilizator) {
      const comenzi = await Comanda.findAll({ where: { id: comandaId } });
      res
        .status(200)
        .json({ message: "Comenzi afisate cu succes!", comenzi: comenzi });
    } else {
      const err = {
        statusCode: 403,
        message: 'Utilizatorul nu este curier'
      }
      throw err;
    }
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};
