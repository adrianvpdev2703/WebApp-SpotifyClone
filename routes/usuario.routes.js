// routes/usuario.routes.js
const express = require("express");
const router = express.Router();
const usuarioController = require("../controllers/usuario.controller");

router.post("/login-test", usuarioController.getOrCreateUsuario);
router.post("/add-xp", usuarioController.addXp);

module.exports = router;
