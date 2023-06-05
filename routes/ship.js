const express = require("express");
const shipController = require("../controllers/ship");
const isAuth = require("../middlewares/is-auth");


const router = express.Router();

router.get("/comenzi", isAuth, shipController.getComenzi);
router.get("/comenzi/:oras", isAuth, shipController.getComenziDupaOras);
router.get("/comanda/:comandaId", isAuth, shipController.getComanda);
router.post("/comanda", isAuth, shipController.postComanda);
router.post("/comanda-finalizata", isAuth, shipController.postComandaFinalizata);

module.exports = router;
