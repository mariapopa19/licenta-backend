const express = express();
const shopController = require("../controllers/shop");

const router = express.Router();

router.get("/produse", shopController.getProduse);
router.get("/produs", shopController.getProdus);
router.get("/cos-cumparaturi", shopController.getCosCumparaturi);
router.post("cos-cumparaturi", shopController.postCosCumparaturi);
router.post(
  "/sterge-produs-cos-cumparaturi",
  shopController.postStergeProdusCosCumparaturi
);
router.post("/creaza-comanda", shopController.postComanda);
router.get("/comenzi", shopController.getComenzi);
router.get("/comenzi/:comandaId", shopController.getComanda);

module.exports = router;
