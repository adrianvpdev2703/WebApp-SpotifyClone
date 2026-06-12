require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const fileUpload = require("express-fileupload");
const path = require("path");
const db = require("./models");

const app = express();
const port = 3000;

// Configurar EJS
app.set("views", path.join(__dirname, "../frontend/views"));
app.set("view engine", "ejs");

// Carpetas públicas
app.use(express.static(path.join(__dirname, "../frontend/public")));

// parse application/x-www-form-urlencoded y json
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Configuración de express-fileupload
app.use(
  fileUpload({
    limits: { fileSize: 10 * 1024 * 1024 }, // 10 MB
    abortOnLimit: true,
    createParentPath: true,
  }),
);

// Base de datos
db.sequelize.sync().then(() => console.log("DB sincronizada"));

// Rutas
require("./routes")(app);

// Página principal
app.get("/", (req, res) => {
  res.render("home", { title: "Spotify Clone" });
});

app.listen(port, () => console.log(`App listening on port ${port}`));
