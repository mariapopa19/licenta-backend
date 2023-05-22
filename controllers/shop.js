const CategorieProdus = require("../models/categorie_produs");
const Firma = require("../models/firme");
const Produs = require("../models/produse");
const Utilizator = require("../models/utilizatori");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const Stripe = require("stripe");

dotenv.config();
const stripe = Stripe(process.env.STRIPE_KEY);

exports.getProduse = async (req, res, next) => {
  try {
    const produse = await Produs.findAll();
    const { count } = await Produs.findAndCountAll({
      include: [Firma, CategorieProdus],
    });
    res.status(200).json({
      message: "Toate produsele au fost returnate!",
      produse: produse,
      totalProduse: count,
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.getProdus = async (req, res, next) => {
  try {
    const id = req.params.produsId;
    const produs = await Produs.findByPk(id, { include: Firma });
    res.status(200).json({ message: "Produs găsit!", produs: produs });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.getCosCumparaturi = async (req, res, next) => {
  try {
    const token = req.params.token;
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    const userId = decoded.userId;

    const utilizator = await Utilizator.findByPk(userId);
    const cosCumparaturi = await utilizator.getCosCumparaturi();
    const produse = await cosCumparaturi.getProduse();
    res.status(200).json({
      message: "Cos cumparaturi incarcat cu succes!",
      produseCos: produse,
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.postCosCumparaturi = async (req, res, next) => {
  try {
    const token = req.body.token;
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    const userId = decoded.userId;
    const prodId = req.body.prodId;
    let cosCumpExistent;
    let nouaCantitate = 1;

    const utilizator = await Utilizator.findByPk(userId);
    const cosCumparaturi = await utilizator.getCosCumparaturi();
    cosCumpExistent = cosCumparaturi;
    const produse = await cosCumparaturi.getProduse({ where: { id: prodId } });

    let produs;
    if (produse.length > 0) {
      produs = produse[0];
    }

    if (produs) {
      const vecheaCantitate = produs.produsCosCumparaturi.cantitate;
      nouaCantitate = vecheaCantitate + 1;
    }

    const produsAdaugatInCos = await Produs.findByPk(prodId);
    await cosCumpExistent.addProdus(produsAdaugatInCos, {
      through: { cantitate: nouaCantitate },
    });
    const result = await cosCumparaturi.getProduse({ where: { id: prodId } });
    res
      .status(200)
      .json({ message: "Produs adaugat cu succes!", result: result });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.postScoateProdusCosCumparaturi = async (req, res, next) => {
  try {
    const token = req.body.token;
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    const userId = decoded.userId;
    const prodId = req.body.prodId;
    let cosCumpExistent;
    let nouaCantitate = 1;

    const utilizator = await Utilizator.findByPk(userId);
    const cosCumparaturi = await utilizator.getCosCumparaturi();
    cosCumpExistent = cosCumparaturi;
    const produse = await cosCumparaturi.getProduse({ where: { id: prodId } });

    let produs;
    if (produse.length > 0) {
      produs = produse[0];
    }

    const vecheaCantitate = produs.produsCosCumparaturi.cantitate;

    if (produs && vecheaCantitate > 1) {
      nouaCantitate = vecheaCantitate - 1;
    } else {
      const err = {
        statusCode: 404,
        message:
          "Produsul are cantitatea mai mica de 2, pentru asta apeleaza ruta '/sterge-produs-cos-cumparaturi'",
      };
      throw err;
    }

    const produsAdaugatInCos = await Produs.findByPk(prodId);
    await cosCumpExistent.addProdus(produsAdaugatInCos, {
      through: { cantitate: nouaCantitate },
    });
    const result = await cosCumparaturi.getProduse({ where: { id: prodId } });
    res
      .status(200)
      .json({ message: "Produs scazut din cos cu succes!", result: result });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.deleteStergeProdusCosCumparaturi = async (req, res, next) => {
  try {
    const token = req.params.token;
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    const userId = decoded.userId;
    const prodId = req.params.prodId;

    const utilizator = await Utilizator.findByPk(userId);
    const cosCumparaturi = await utilizator.getCosCumparaturi();
    const produse = await cosCumparaturi.getProduse({ where: { id: prodId } });
    const produs = produse[0];
    await produs.produsCosCumparaturi.destroy();
    const rezultat = await cosCumparaturi.getProduse();
    res
      .status(200)
      .json({ message: "Produs sters din cos!", result: rezultat });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.postComanda = async (req, res, next) => {
  try {
    let cosExistent;
    const token = req.body.token;
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    const userId = decoded.userId;
    const utilizator = await Utilizator.findByPk(userId);
    const cosCumparaturi = await utilizator.getCosCumparaturi();
    cosExistent = cosCumparaturi;
    const produse = await cosCumparaturi.getProduse();

    const adresa = req.body.adresa;
    const oras = req.body.oras;
    const judet = req.body.judet;
    const ziLivrare = req.body.ziLivrare;
    const intervalLivrare = req.body.intervalLivrare;

    const comanda = await utilizator.createComanda({
      status: "confirmata",
      adresa: adresa,
      oras: oras,
      judet: judet,
      ziLivrare: ziLivrare,
      intervalLivrare: intervalLivrare,
    });
    const rezultat = await comanda.addProdus(
      produse.map((prod) => {
        prod.produseComanda = {
          cantitate: prod.produsCosCumparaturi.cantitate,
        };
        return prod;
      })
    );

    cosExistent.setProduse(null);

    res
      .status(201)
      .json({ message: "Comanda creata cu succes!", result: rezultat });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.getComenzi = async (req, res, next) => {
  try {
    const token = req.params.token;
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    const userId = decoded.userId;
    const utilizator = await Utilizator.findByPk(userId);
    const comenzi = await utilizator.getComenzi({ include: ["produse"] });
    res
      .status(200)
      .json({ message: "Comenzi afisate cu succes", comenzi: comenzi });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.getComanda = async (req, res, next) => {
  try {
    const token = req.params.token;
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    const userId = decoded.userId;
    const comandaId = req.params.comandaId;
    const utilizator = await Utilizator.findByPk(userId);
    const comanda = await utilizator.getComenzi({
      where: { id: comandaId },
      include: ["produse"],
    });
    res
      .status(200)
      .json({ message: "Comanda afisata cu succes", comanda: comanda[0] });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.postStripeCheckoutSession = async (req, res, next) => {
  const token = req.body.token;
  const adresa = req.body.adresa;
  const oras = req.body.oras;
  const judet = req.body.judet;
  const ziLivrare = req.body.ziLivrare;
  const oraLivrare = req.body.oraLivrare;
  try {
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    const userId = decoded.userId;
    const utilizator = await Utilizator.findByPk(userId);
    const cosCumparaturi = await utilizator.getCosCumparaturi();
    const produse = await cosCumparaturi.getProduse();

    const customer = await stripe.customers.create({
      metadata: {
        token: token,
        adresa: adresa,
        oras: oras,
        judet: judet,
        ziLivrare: ziLivrare,
        oraLivrare: oraLivrare,
        // TODO - de adaugat restul datelor necesare, cum ar fi adresa, ora si ziua de livrare
      },
    });

    const line_items = produse.map((produs) => {
      return {
        price_data: {
          currency: "ron",
          product_data: {
            name: produs.denumire,
            images: [produs.imageURL],
            metadata: {
              id: produs.id,
            },
          },
          unit_amount: produs.pret * 100,
        },
        quantity: produs.produsCosCumparaturi.cantitate,
      };
    });

    const session = await stripe.checkout.sessions.create({
      line_items,
      customer: customer.id,
      mode: "payment",
      success_url: `${process.env.CLIENT_URL}/checkout-success`,
      cancel_url: `${process.env.CLIENT_URL}/cos-cumparaturi`,
    });
    res.send({ url: session.url });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.postStripeWebhooks = async (req, res) => {
  let endpointSecret;
  const sig = req.headers["stripe-signature"];

  let data;
  let eventType;

  if (endpointSecret) {
    let event;
    try {
      event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
      console.log("Webhook verified");
    } catch (err) {
      res.status(400).send(`Webhook Error: ${err.message}`);
      return;
    }
    data = event.data.object;
    eventType = event.type;
  } else {
    data = req.body.data.object;
    eventType = req.body.type;
  }

  // Handle the event
  if (eventType === "checkout.session.completed") {
    const customer = await stripe.customers.retrieve(data.customer);
    try {
      let cosExistent;
      const decoded = jwt.verify(customer.metadata.token, process.env.ACCESS_TOKEN_SECRET);
      const userId = decoded.userId;
      const utilizator = await Utilizator.findByPk(userId);
      const cosCumparaturi = await utilizator.getCosCumparaturi();
      cosExistent = cosCumparaturi;
      const produse = await cosCumparaturi.getProduse();

  
      const comanda = await utilizator.createComanda({
        status: "confirmata",
        adresa: customer.metadata.adresa,
        oras: customer.metadata.oras,
        judet: customer.metadata.judet,
        ziLivrare: customer.metadata.ziLivrare,
        intervalLivrare: customer.metadata.oraLivrare,
      });
      const rezultat = await comanda.addProdus(
        produse.map((prod) => {
          prod.produseComanda = {
            cantitate: prod.produsCosCumparaturi.cantitate,
          };
          return prod;
        })
      );
  
      cosExistent.setProduse(null);
  
      res
        .status(201)
        .json({ message: "Comanda creata cu succes!", result: rezultat });
    } catch (err) {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    }
  }
  // Return a 200 response to acknowledge receipt of the event
  res.send().end();
};
