const express = require("express");
const { check, body } = require("express-validator");
const authController = require("../controllers/auth");
const Utilizator = require("../models/utilizatori");

const router = express.Router();

router.post(
  "/signup",
  [
    body("email")
      .isEmail()
      .withMessage("Introdu o adresa de email valida.")
      .custom(async (value, { req }) => {
        const email = await Utilizator.findOne({ where: { email: value } });
        if (email !== null) {
          return Promise.reject("Acest email exista deja!");
        }
      })
      .normalizeEmail(),
    body("parola").trim().isLength({ min: 5 }),
    body("nume").trim().not().isEmpty(),
  ],
  authController.signup
);
router.get('/verify/:token', authController.verificaTokenEmail)

router.post(
  "/login",
  [
    body("email").trim().isEmail(),
    body("parola").trim().isLength({ min: 5 }),
  ],
  authController.login
);

router.get('/new-pass', authController.getSchimbaParola)
router.post('/new-pass/:token', authController.postSchimbaParola)

module.exports = router;
