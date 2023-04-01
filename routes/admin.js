const express = require("express");
const adminController = require("../controllers/admin");

const router = express.Router();

router.post("/firma", adminController.postFirma);
router.post("/categorie", adminController.postCategorie);
router.post("/produs", adminController.postPodus);
router.patch('/produs/:produsId', adminController.patchMofificaProdus)

module.exports = router;
