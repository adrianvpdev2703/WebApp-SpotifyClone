require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const fileUpload = require("express-fileupload");
const path = require("path");
const cors = require("cors");
const db = require("./models");

const app = express();
const port = 3000;

// ==========================================
// 1. Configurar CORS (Para permitir a Vite/React conectarse)
// ==========================================
app.use(
  cors({
    origin: "http://localhost:5173", // Puerto de tu frontend en Vite
    credentials: true,
  }),
);

// Configurar EJS (Mantenemos tu configuración original)
app.set("views", path.join(__dirname, "../frontend/views"));
app.set("view engine", "ejs");

// Carpetas públicas
app.use(express.static(path.join(__dirname, "../frontend/public")));

// ==========================================
// 2. Exponer la carpeta de Uploads para los audios e imágenes
// ==========================================
app.use("/uploads", express.static(path.join(__dirname, "public/uploads")));

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
