const express = require("express");
const shipController = require("../controllers/ship");

const router = express.Router();

router.get("/comenzi/:token/:oras", shipController.getComenzi);
router.get("/comanda/:token/:comandaId", shipController.getComanda);
router.post("/comanda", shipController.postComanda);
router.post("/comanda-finalizata", shipController.postComandaFinalizata);

module.exports = router;
