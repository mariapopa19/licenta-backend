const express = require("express");
const shopController = require("../controllers/shop");

const router = express.Router();

router.get("/produse", shopController.getProduse);
router.get("/produse/:produsId", shopController.getProdus);
router.get("/cos-cumparaturi/:token", shopController.getCosCumparaturi);
router.post("/cos-cumparaturi", shopController.postCosCumparaturi);
router.post(
  "/scoate-produs-cos",
  shopController.postScoateProdusCosCumparaturi
);
router.delete(
  "/sterge-produs-cos-cumparaturi/:token/:prodId",
  shopController.deleteStergeProdusCosCumparaturi
);
router.post("/creaza-comanda", shopController.postComanda);
router.get("/comenzi/:token", shopController.getComenzi);
router.get("/comenzi/:token/:comandaId", shopController.getComanda);

router.post(
  "/create-checkout-session",
  shopController.postStripeCheckoutSession
);
router.post(
  "/webhook",
  // express.raw({type: 'application/json'}),
  shopController.postStripeWebhooks
);
module.exports = router;
