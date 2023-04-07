const express = require("express");
const shopController = require("../controllers/shop");

const router = express.Router();

router.get("/produse", shopController.getProduse);
router.get("/produse/:produsId", shopController.getProdus);
router.get("/cos-cumparaturi", shopController.getCosCumparaturi);
router.post("/cos-cumparaturi", shopController.postCosCumparaturi);
router.post('/scoate-produs-cos', shopController.postScoateProdusCosCumparaturi)
router.delete(
  "/sterge-produs-cos-cumparaturi/:userId/:prodId",
  shopController.deleteStergeProdusCosCumparaturi
);
router.post("/creaza-comanda", shopController.postComanda);
router.get("/comenzi", shopController.getComenzi);
router.get("/comenzi/:comandaId", shopController.getComanda);

module.exports = router;
