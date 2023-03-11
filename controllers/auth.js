const Utilizator = require("../models/utilizatori");
const { validationResult } = require('express-validator');
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");

dotenv.config();

exports.signup = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error("Validation failed.");
    error.statusCode = 422;
    error.data = errors.array();
    throw error;
  }
  const email = req.body.email;
  const nume = req.body.nume;
  const parola = req.body.parola;
  const curier = req.body.curier;

  try {
    const hashedPw = await bcrypt.hash(parola, 12);
    const utilizator = await Utilizator.create({
      email: email,
      parola: hashedPw,
      nume: nume,
      curier: curier,
    });
    res
      .status(201)
      .json({ message: "Utilizator creat!", userId: utilizator.id });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.login = async (req, res, next) => {
  const email = req.body.email;
  const parola = req.body.parola;
  let loadedUser;
  try {
    const utilizator = await Utilizator.findOne({ where: { email: email } });
    if (utilizator === null) {
      const error = new Error("Nu exista utilizator cu acest email.");
      error.statusCode = 401;
      throw error;
    }
    loadedUser = utilizator;
    const isEqual = await bcrypt.compare(parola, utilizator.parola);
    if (!isEqual) {
      const error = new Error("Parola gresita!");
      error.statusCode = 401;
      throw error;
    }
    const token = jwt.sign(
      {
        email: loadedUser.email,
        userId: loadedUser.id,
      },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "1h" }
    );
    res.status(200).json({ token: token, userId: loadedUser.id });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};
