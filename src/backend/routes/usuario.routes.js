module.exports = (app) => {
  const usuarioController = require("../controllers/usuario.controller");
  const router = require("express").Router();

  // Endpoints
  router.post("/login-test", usuarioController.getOrCreateUsuario);
  router.post("/add-xp", usuarioController.addXp);

  // Registramos la ruta base en la app
  app.use("/usuarios", router);
};
