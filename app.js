const express = require("express");
const dotenv = require("dotenv");
const bodyParser = require("body-parser");
const cors = require("cors");

const sequlize = require("./utils/database");
const Comanda = require("./models/comenzi");
const Firma = require("./models/firme");
const PerioadaContractFirma = require("./models/perioada_contract_firme");
const ProdusComanda = require("./models/produse_comanda");
const Produs = require("./models/produse");
const ProdusCosCumparaturi = require("./models/produse_cos_cumparaturi");
const CosCumparaturi = require("./models/cos_cumparaturi");
const Utilizator = require("./models/utilizatori");
const CategorieProdus = require("./models/categorie_produs");
const TransportComanda = require("./models/transport_comenzi");

const authRoutes = require("./routes/auth");
const shopRoutes = require("./routes/shop");
const shipRoutes = require("./routes/ship");
const adminRoutes = require("./routes/admin");

const errorMiddleware = require("./middlewares/error").error;

const app = express();
dotenv.config();

app.use(cors());
app.use(bodyParser.json());

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, PATCH, DELETE"
  );
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.setHeader("Content-Security-Policy", "script-src", "*");
  next();
});
// console.log(process.env);

Utilizator.hasMany(Comanda);
Comanda.belongsTo(Utilizator);
Comanda.belongsToMany(Produs, { through: ProdusComanda });
Produs.belongsToMany(Comanda, { through: ProdusComanda });
Utilizator.hasOne(CosCumparaturi);
CosCumparaturi.belongsTo(Utilizator);
CosCumparaturi.belongsToMany(Produs, { through: ProdusCosCumparaturi });
Produs.belongsToMany(CosCumparaturi, { through: ProdusCosCumparaturi });
Firma.hasMany(Produs);
Produs.belongsTo(Firma, { constraints: true, onDelete: "CASCADE" });
Firma.hasOne(PerioadaContractFirma);
PerioadaContractFirma.belongsTo(Firma);
CategorieProdus.hasMany(Produs);
Produs.belongsTo(CategorieProdus, { constraints: true });
Utilizator.hasOne(TransportComanda);
TransportComanda.belongsTo(Utilizator);
Comanda.hasOne(TransportComanda);
TransportComanda.belongsTo(Comanda);

app.use("/auth", authRoutes);
app.use("/shop", shopRoutes);
app.use("/ship", shipRoutes);
app.use("/admin", adminRoutes);

app.use(errorMiddleware);

sequlize
  // .sync({ force: true })
  // .sync()
  .sync({ alter: true })
  // .drop()
  .then((res) => {
    // console.log(res);
    app.listen(4000);
  })
  .catch((err) => console.log(err));
// app.listen(4000);
