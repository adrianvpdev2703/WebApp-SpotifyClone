module.exports = (app) => {
  const tiendaController = require("../controllers/tienda.controller");
  const router = require("express").Router();

  router.get("/items", tiendaController.obtenerItems);
  router.post("/comprar", tiendaController.comprarItem);
  router.get("/compras/:usuario_id", tiendaController.obtenerCompras);

  app.use("/tienda", router);
};
