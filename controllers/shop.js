const Produs = require("../models/produse");
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
    const id = req.params.produsId;
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
    const userId = req.params.userId;
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
      const vecheaCantitate = produs.produsCosCumparaturi.cantitate;
      nouaCantitate = vecheaCantitate + 1;
    }

    const produsAdaugatInCos = await Produs.findByPk(prodId);
    await cosCumpExistent.addProdus(produsAdaugatInCos, {
      through: { cantitate: nouaCantitate },
    });
    const result = await cosCumparaturi.getProduse({ where: { id: prodId } });
    res
      .status(200)
      .json({ message: "Produs adaugat cu succes!", result: result });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.postScoateProdusCosCumparaturi = async (req, res, next) => {
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

    const vecheaCantitate = produs.produsCosCumparaturi.cantitate;

    if (produs && vecheaCantitate > 1) {
      nouaCantitate = vecheaCantitate - 1;
    } else {
      const err = {
        statusCode: 404,
        message:
          "Produsul are cantitatea mai mica de 2, pentru asta apeleaza ruta '/sterge-produs-cos-cumparaturi'",
      };
      throw err;
    }

    const produsAdaugatInCos = await Produs.findByPk(prodId);
    await cosCumpExistent.addProdus(produsAdaugatInCos, {
      through: { cantitate: nouaCantitate },
    });
    const result = await cosCumparaturi.getProduse({ where: { id: prodId } });
    res
      .status(200)
      .json({ message: "Produs scazut din cos cu succes!", result: result });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.deleteStergeProdusCosCumparaturi = async (req, res, next) => {
  try {
    const prodId = req.params.prodId;
    const userId = req.params.userId;
    const utilizator = await Utilizator.findByPk(userId);
    const cosCumparaturi = await utilizator.getCosCumparaturi();
    const produse = await cosCumparaturi.getProduse({ where: { id: prodId } });
    const produs = produse[0];
    await produs.produsCosCumparaturi.destroy();
    const rezultat = await utilizator.getCosCumparaturi();
    res
      .status(200)
      .json({ message: "Produs sters din cos!", result: rezultat });
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

    const adresa = req.body.adresa;
    const oras = req.body.oras
    const judet = req.body.judet
    const ziLivrare = req.body.ziLivrare;
    const intervalLivrare = req.body.intervalLivrare;

    const comanda = await utilizator.createComanda({
      status: 'confirmata',
      adresa: adresa,
      oras: oras,
      judet: judet,
      ziLivrare: ziLivrare,
      intervalLivrare: intervalLivrare,
    });
    const rezultat = await comanda.addProdus(
      produse.map((prod) => {
        prod.produseComanda = {
          cantitate: prod.produsCosCumparaturi.cantitate,
        };
        return prod;
      })
    );

    cosExistent.setProduse(null);

    res
      .status(201)
      .json({ message: "Comanda creata cu succes!", result: rezultat });
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
    const comenzi = await utilizator.getComenzi({ include: ["produse"] });
    res
      .status(200)
      .json({ message: "Comenzi afisate cu succes", comenzi: comenzi });
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
    const utilizator = await Utilizator.findByPk(userId);
    const comanda = await utilizator.getComenzi({
      where: { id: comandaId },
      include: ["produse"],
    });
    res
      .status(200)
      .json({ message: "Comanda afisata cu succes", comanda: comanda });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};
