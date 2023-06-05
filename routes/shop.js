const express = require("express");
const shopController = require("../controllers/shop");
const isAuth = require("../middlewares/is-auth");

const router = express.Router();

router.get("/produse", shopController.getProduse);
router.get("/produse/:produsId", shopController.getProdus);
router.get("/produse-categorii", shopController.getCategoriiProduse);
router.get("/produse-categorie/:categorieId", shopController.getProduseCategorie);
router.get("/cos-cumparaturi", isAuth, shopController.getCosCumparaturi);
router.post("/cos-cumparaturi", isAuth, shopController.postCosCumparaturi);
router.post(
  "/scoate-produs-cos",
  isAuth,
  shopController.postScoateProdusCosCumparaturi
);
router.delete(
  "/sterge-produs-cos-cumparaturi/:prodId",
  isAuth,
  shopController.deleteStergeProdusCosCumparaturi
);
router.post("/creaza-comanda", isAuth, shopController.postComanda);
router.get("/comenzi", isAuth, shopController.getComenzi);
router.get("/comenzi/:comandaId", isAuth, shopController.getComanda);

router.post(
  "/create-checkout-session",
  isAuth,
  shopController.postStripeCheckoutSession
);
router.post(
  "/webhook",
  // express.raw({type: 'application/json'}),
  shopController.postStripeWebhooks
);
module.exports = router;
