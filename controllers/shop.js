const Produs = require("../models/produse");
const CosCumparaturi = require("../models/cos_cumparaturi");
const ProduseCosCumparaturi = require("../models/produse_cos_cumparaturi");
const Comanda = require("../models/comenzi");
const ProduseComanda = require("../models/produse_comanda");
const Utilizator = require("../models/utilizatori");

exports.getProduse = async (req, res, next) => {
  try {
    const produse = await Produs.findAll();
    const { numar_produse, randuri } = await Produs.findAndCountAll();
    res.status(200).json({
      message: "Toate produsele au fost returnate!",
      produse: produse,
      totalProduse: numar_produse,
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.getProdus = async (req, res, next) => {
  try {
    const id = req.body.produsId;
    const produs = await Produs.findByPk(id);
    res.status(200).json({ message: "Produs găsit!", produs: produs });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.getCosCumparaturi = async (req, res, next) => {
  try {
    const userId = req.body.userId;
    const utilizator = await Utilizator.findByPk(userId);
    const cosCumparaturi = await utilizator.getCosCumparaturi();
    const produse = await cosCumparaturi.getProduse();
    res.status(200).json({
      message: "Cos cumparaturi incarcat cu succes!",
      produseCos: produse,
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.postCosCumparaturi = async (req, res, next) => {
  try {
    const userId = req.body.userId;
    const prodId = req.body.prodId;
    let cosCumpExistent;
    let nouaCantitate = 1;

    const utilizator = await Utilizator.findByPk(userId);
    const cosCumparaturi = await utilizator.getCosCumparaturi();
    cosCumpExistent = cosCumparaturi;
    const produse = await cosCumparaturi.getProduse({ where: { id: prodId } });

    let produs;
    if (produse.length > 0) {
      produs = produse[0];
    }

    if (produs) {
      const vecheaCantitate = produs.produseCosCumparaturi.cantitate;
      nouaCantitate = vecheaCantitate + 1;
    }

    const produsAdaugatInCos = await Produs.findByPk(prodId);
    const rezultat = cosCumpExistent.addProdus(produsAdaugatInCos, {
      through: { cantitate: nouaCantitate },
    });
    res.status(200).json({ message: "Produs adaugat cu succes!" });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.postStergeProdusCosCumparaturi = async (req, res, next) => {
  try {
    const prodId = req.body.prodId;
    const userId = req.body.userId;
    const utilizator = await Utilizator.findByPk(userId);
    const cosCumparaturi = await utilizator.getCosCumparaturi();
    const produse = await cosCumparaturi.getProduse({ where: { id: prodId } });
    const produs = produse[0];
    const rezultat = produs.produseCosCumparaturi.destroy();
    res.status(200).json({ message: "Produs adaugat cu succes!" });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.postComanda = async (req, res, next) => {
  try {
    let cosExistent;
    const userId = req.body.userId;
    const utilizator = await Utilizator.findByPk(userId);
    const cosCumparaturi = await utilizator.getCosCumparaturi();
    cosExistent = cosCumparaturi;
    const produse = await cosCumparaturi.getProduse();

    const comanda = utilizator.createComanda();
    const rezultat = comanda.addProdus(
      produse.map((prod) => {
        prod.produseComanda = {
          cantitate: prod.produseCosCumparaturi.cantitate,
        };
        return prod;
      })
    );

    cosExistent.setProduse(null);

    res.status(200).json({ message: "Comanda creata cu succes!" });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.getComenzi = async (req, res, next) => {
  try {
    const userId = req.body.userId;
    const utilizator = await Utilizator.findByPk(userId);
    const comenzi = await utilizator.getComanda({ include: ["products"] });
    res
      .status(200)
      .json({ message: "Comenzi returnate cu succes", comenzi: comenzi });
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
    const comandaId = req.body.comandaId;
    const utilizator = await Utilizator.findByPk(userId);
    const comanda = await utilizator.getComanda(
      { where: { id: comandaId } },
      { include: ["products"] }
    );
    res.status(200).json({message: 'Comanda returnata cu succes', comanda: comanda})
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};
