const jwt = require("jsonwebtoken");
const Utilizator = require("../models/utilizatori");
const Comanda = require("../models/comenzi");
const TransportComanda = require("../models/transport_comenzi");
const Produs = require("../models/produse");

exports.getComenzi = async (req, res, next) => {
  try {
    const oras = req.params.oras;
    const token = req.params.token;
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    const userId = decoded.userId;
    const utilizator = await Utilizator.findOne({
      where: { id: userId, curier: true },
    });
    if (utilizator) {
      const comenzi = await Comanda.findAll({
        where: { oras: oras },
        include: Produs,
      });
      res
        .status(200)
        .json({ message: "Comenzi afisate cu succes!", comenzi: comenzi });
    } else {
      const err = {
        statusCode: 403,
        message: "Utilizatorul nu este curier",
      };
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
    const token = req.params.token;
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    const userId = decoded.userId;
    const comandaId = req.params.comandaId;
    const utilizator = await Utilizator.findOne({
      where: { id: userId, curier: true },
    });
    if (utilizator) {
      const comanda = await Comanda.findByPk(comandaId, { include: Produs });
      res
        .status(200)
        .json({ message: "Comanda afisata cu succes!", comanda: comanda });
    } else {
      const err = {
        statusCode: 403,
        message: "Utilizatorul nu este curier",
      };
      throw err;
    }
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.postComanda = async (req, res, next) => {
  try {
    const token = req.body.token;
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    const userId = decoded.userId;
    const comandaId = req.body.comandaId;
    const utilizator = await Utilizator.findOne({
      where: { id: userId, curier: true },
    });
    if (utilizator) {
      const comanda = await Comanda.findOne({ where: { id: comandaId } });
      const transport = await utilizator.createTransportComanda({
        comandaId: comanda.id,
        status: "in tranzit",
      });
      await Comanda.update(
        { status: "in tranzit" },
        {
          where: { id: comanda.id },
        }
      );
      res
        .status(200)
        .json({ message: "Comanda preluata cu success!", comenzi: transport });
    } else {
      const err = {
        statusCode: 403,
        message: "Utilizatorul nu este curier",
      };
      throw err;
    }
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.postComandaFinalizata = async (req, res, next) => {
  try {
    const token = req.body.token;
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    const userId = decoded.userId;
    const comandaId = req.body.comandaId;
    const utilizator = await Utilizator.findOne({
      where: { id: userId, curier: true },
    });
    if (utilizator) {
      let comanda = await Comanda.findOne({ where: { id: comandaId } });
      await Comanda.update(
        { status: "finalizata" },
        {
          where: { id: comanda.id },
        }
      );
      const transport = await utilizator.getTransportComanda();
      await transport.destroy();
      comanda = await Comanda.findOne({ where: { id: comandaId } });
      res
        .status(200)
        .json({ message: "Comanda finalizata cu success!", comenzi: comanda });
    } else {
      const err = {
        statusCode: 403,
        message: "Utilizatorul nu este curier",
      };
      throw err;
    }
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};
