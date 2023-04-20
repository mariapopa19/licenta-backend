const express = require("express");
const { body } = require("express-validator");
const adminController = require("../controllers/admin");
const PerioadaContractFirma = require("../models/perioada_contract_firme");

const router = express.Router();

router.post("/firma", adminController.postFirma);
router.post("/categorie", adminController.postCategorie);
router.post("/produs", adminController.postPodus);
router.patch("/produs/:produsId", adminController.patchMofificaProdus);
router.get("/produse", adminController.getProduse);
router.delete("/produs/:produsId", adminController.deleteProdus);
router.delete("/firma/:firmaId", adminController.deleteFirma);
router.delete("/categorie/:categorieId", adminController.deleteCategorie);
router.get("/comenzi", adminController.getComenzi);
router.get("/firme", adminController.getFirme);
router.patch(
  "firma/firmaId",
  [body("dataSfarsitContract").isDate()],
  adminController.patchModificaFirma
);
router.get("/categorii", adminController.getCategorii);

module.exports = router;
