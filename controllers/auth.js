const Utilizator = require("../models/utilizatori");
const { validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const sgMail = require("@sendgrid/mail");

dotenv.config();
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

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
  const curier = req.body.curier || false;

  try {
    const token = jwt.sign(
      {
        email: email,
        parola: parola,
        nume: nume,
        curier: curier,
      },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "10min" }
    );
    const hashedPw = await bcrypt.hash(parola, 12);
    const utilizator = await Utilizator.create({
      email: email,
      parola: hashedPw,
      nume: nume,
      curier: curier,
    });
    await utilizator.createCosCumparaturi();
    res
      .status(201)
      .json({ message: "Utilizator creat!", userId: utilizator.id });
    // await sgMail.send({
    //   to: email,
    //   from: "maria_popa@365.univ-ovidius.ro",
    //   subject: "Verifică-ți email-ul",
    //   html: `<h3>Pentru a confirma email-ul apasă pe link-ul de mai jos: </h3>
    //   <br>
    //   <a href='http://localhost:4000/auth/verify/${token}'>http://localhost:4000/auth/verify/${token}</a>`,
    // });
    // res.status(200).json({ message: "Email de veridicare trimis", token: token });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.verificaTokenEmail = async (req, res, next) => {
  try {
    const token = req.params.token;

    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    const email = decoded.email;
    const parola = decoded.parola;
    const nume = decoded.nume;
    const curier = decoded.curier;

    const hashedPw = await bcrypt.hash(parola, 12);
    const utilizator = await Utilizator.create({
      email: email,
      parola: hashedPw,
      nume: nume,
      curier: curier,
    });
    await utilizator.createCosCumparaturi();
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

exports.getSchimbaParola = async (req, res, next) => {
  const email = req.params.email;
  try {
    const utilizator = await Utilizator.findOne({ where: { email: email } });

    if (utilizator) {
      const token = jwt.sign(
        {
          email: email,
        },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: "10min" }
      );
      await sgMail.send({
        to: email,
        from: "maria_popa@365.univ-ovidius.ro",
        subject: "Schimbă-ți parola",
        html: `<h3>Pentru a-ți schimba parola apasă pe link-ul de mai jos: </h3>
                <br>
                <a href='${process.env.CLIENT_URL}/resetare-parola/${token}'>${process.env.CLIENT_URL}/resetare-parola/${token}</a>`,
      });
      res.status(200).json({
        message: "Email pentru schimbarea parolei trimis",
        token: token,
      });
    } else {
      res.status(404).json({ message: "Utilizatotul nu exista" });
    }
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.postSchimbaParola = async (req, res, next) => {
  const token = req.params.token;
  const parola = req.body.parola;
  try {
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    const email = decoded.email;

    const utilizator = await Utilizator.findOne({ where: { email: email } });
    const hashedPw = await bcrypt.hash(parola, 12);

    await Utilizator.update(
      { parola: hashedPw },
      { where: { id: utilizator.id } }
    );

    res.status(200).json({ message: "Parola modificata cu succes!" });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.getDetaliiUser = async (req, res, next) => {
  const token = req.params.token;
  try {
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    const userId = decoded.userId;

    const utilizator = await Utilizator.findByPk(userId);
    res
      .status(200)
      .json({ message: "Utilizator gasit cu succes", result: utilizator });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.patchDetaliiUser = async (req, res, next) => {
  const token = req.params.token;
  const nume = req.body.nume;
  const email = req.body.email;
  try {
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    const userId = decoded.userId;

    await Utilizator.update(
      {
        nume: nume,
        email: email,
      },
      { where: { id: userId } }
    );
    const utilizator = await Utilizator.findByPk(userId);
    res
      .status(200)
      .json({ message: "Utilizator actualizat cu succes", result: utilizator });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};
