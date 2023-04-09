const express = require("express");
const adminController = require("../controllers/admin");

const router = express.Router();

router.post("/firma", adminController.postFirma);
router.post("/categorie", adminController.postCategorie);
router.post("/produs", adminController.postPodus);
router.patch('/produs/:produsId', adminController.patchMofificaProdus)
router.delete('/produs/:produsId', adminController.deleteProdus)
router.delete('/firma/:firmaId', adminController.deleteFirma)
router.delete('/categorie/:categorieId', adminController.deleteCategorie)
router.get('/comenzi', adminController.getComenzi)

module.exports = router;
