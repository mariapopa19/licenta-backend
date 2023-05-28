const express = require("express");
const adminController = require("../controllers/admin");

const router = express.Router();

router.post("/firma", adminController.postFirma);
router.post("/categorie", adminController.postCategorie);
router.post("/produs", adminController.postPodus);
router.post("/utilizator", adminController.postUtilizator);

router.delete("/produs/:produsId", adminController.deleteProdus);
router.delete("/firma/:firmaId", adminController.deleteFirma);
router.delete("/categorie/:categorieId", adminController.deleteCategorie);
router.delete("/utilizator/:userId", adminController.deleteUtilizator);

router.patch("/produs/:produsId", adminController.patchMofificaProdus);
router.patch("/firma/:firmaId", adminController.patchModificaFirma);
router.patch("/categorie/:categorieId", adminController.patchModificaCategorie);
router.patch("/comanda/:comandaId", adminController.patchModificaComanda);
router.patch("/utilizator/:userId", adminController.patchUtilizator);

router.get("/produse", adminController.getProduse);
router.get("/comenzi", adminController.getComenzi);
router.get("/comanda/:comandaId", adminController.getComanda);
router.get("/firme", adminController.getFirme);
router.get("/categorii", adminController.getCategorii);
router.get("/utilizatori", adminController.getUtilizatori);

module.exports = router;
