const Produs = require("../models/produse");
const Firma = require("../models/firme");
const CategorieProdus = require("../models/categorie_produs");
const PerioadaContractFirma = require("../models/perioada_contract_firme");
const Comanda = require("../models/comenzi");

exports.postFirma = async (req, res, next) => {
  try {
    const denumireFirma = req.body.denumire;
    const dataInceputContractFirma = req.body.data_inceput;
    const dataFinalizareContractFirma = req.body.data_finalizare;

    const firma = await Firma.create({
      denumire: denumireFirma,
    });
    const contract = await firma.createPerioadaContractFirma({
      data_inceput: dataInceputContractFirma,
      data_finalizare: dataFinalizareContractFirma,
    });

    const result = await Firma.findByPk(contract.firmaId, {
      include: PerioadaContractFirma,
    });
    res.status(201).json({
      message: "Firma si contract create cu succes",
      result: result,
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.postCategorie = async (req, res, next) => {
  try {
    const denumireCategorie = req.body.denumire;

    const categorie = await CategorieProdus.create({
      denumire: denumireCategorie,
    });

    res
      .status(201)
      .json({ message: "Categorie adaugata cu succes!", result: categorie });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.postPodus = async (req, res, next) => {
  try {
    const denumirePodus = req.body.denumire;
    const pretProdus = req.body.pret;
    const categorieProdus = req.body.categorie;
    const imageURL = req.body.imageURL;
    const descriere = req.body.descriere;
    const denumireFirma = req.body.denumireFirma;

    const firma = await Firma.findOne({ where: { denumire: denumireFirma } });
    const categorie = await CategorieProdus.findOne({
      where: { denumire: categorieProdus },
    });
    const produs = await Produs.create({
      denumire: denumirePodus,
      pret: pretProdus,
      imageURL: imageURL,
      descriere: descriere,
      categorieProduId: categorie.id,
      firmaId: firma.id,
    });

    const result = await Produs.findByPk(produs.id, {
      include: [CategorieProdus, Firma],
    });
    res
      .status(201)
      .json({ message: "Produs creat cu succes!", rezultat: result });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.patchMofificaProdus = async (req, res, next) => {
  try {
    const produsId = req.params.produsId;
    const denumireProdus = req.body.denumire;
    const pretProdus = req.body.pret;
    const descriere = req.body.descriere;
    const imageURL = req.body.imageURL;

    await Produs.update(
      {
        denumire: denumireProdus,
        pret: pretProdus,
        descriere: descriere,
        imageURL: imageURL,
      },
      { where: { id: produsId } }
    );

    const produsActualizat = await Produs.findByPk(produsId)

    res
      .status(200)
      .json({
        message: "Produs actualizat cu succes!",
        response: produsActualizat,
      });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.deleteProdus = async (req, res, next) => {
  try{
    const produsId = req.params.produsId;
    const produs = await Produs.findByPk(produsId)
    await produs.destroy();
    const produse = await Produs.findAll()
    res.status(200).json({message: 'Produsul a fost sters', produse: produse})
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
}

exports.deleteFirma = async (req, res, next) => {
  try {
    const firmaId = req.params.firmaId;
    const firma = await Firma.findByPk(firmaId);
    await firma.destroy();
    const firme = await Firma.findAll()
    res.status(200).json({message: 'Firma a fost stearsa', firme: firme})
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
}

exports.deleteCategorie = async (req, res, next) => {
  try {
    const categorieId = req.params.categorieId;
    const categorie = await CategorieProdus.findByPk(categorieId);
    await categorie.destroy();
    const categorii = await CategorieProdus.findAll()
    res.status(200).json({message: 'Firma a fost stearsa', categorii: categorii})
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
}

exports.getComenzi = async (req, res, next) => {
  try {
    const comenzi = await Comanda.findAll()
    res.status(200).json({message: 'Comenzi gasite cu succes', result: comenzi})
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
}