const express = require("express");
const shipController = require("../controllers/ship");

const router = express.Router();

router.get("/comenzi", shipController.getComenzi);
router.get("/comanzi/:comandaId", shipController.getComanda);
router.post("/comanda");
router.post("/comanda-terminata");

module.exports = router;
