const Produs = require("../models/produse");
const Firma = require("../models/firme");
const CategorieProdus = require("../models/categorie_produs");
const PerioadaContractFirma = require("../models/perioada_contract_firme");

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