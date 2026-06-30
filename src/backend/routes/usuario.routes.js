module.exports = (app) => {
  const usuarioController = require("../controllers/usuario.controller");
  const router = require("express").Router();

  // Endpoints
  // Añade esta línea
  router.post("/registro", usuarioController.crearUsuario);
  router.post("/login-test", usuarioController.getOrCreateUsuario);
  router.post(
    "/registrarCancionEscuchada",
    usuarioController.registrarCancionEscuchada,
  );
  router.get("/ranking", usuarioController.getRanking);

  // Registramos la ruta base en la app
  app.use("/usuarios", router);
};
