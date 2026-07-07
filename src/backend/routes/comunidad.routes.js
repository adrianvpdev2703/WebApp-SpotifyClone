module.exports = (app) => {
  const controller = require("../controllers/comunidad.controller");
  const router = require("express").Router();

  router.get("/", controller.listarComunidades);
  router.get("/:comunidad_id", controller.detalleComunidad);
  router.get("/:comunidad_id/mensajes", controller.obtenerMensajes);
  router.post("/crear", controller.crearComunidad);
  router.post("/unirse", controller.unirseComunidad);
  router.post("/abandonar", controller.abandonarComunidad);
  router.post("/mensaje", controller.enviarMensaje);

  app.use("/comunidades", router);
};
