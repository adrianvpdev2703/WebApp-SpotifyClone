module.exports = (app) => {
  const comunidadController = require("../controllers/comunidad.controller");
  const router = require("express").Router();

  // Endpoints para gestionar las comunidades y el chat
  router.post("/crear", comunidadController.crearComunidad);
  router.post("/unirse", comunidadController.unirseComunidad);
  router.post("/mensaje", comunidadController.enviarMensaje);
  router.get("/:comunidad_id/mensajes", comunidadController.obtenerMensajes);

  // Registramos la ruta base
  app.use("/comunidades", router);
};
