module.exports = (app) => {
  const router = require("express").Router();

  // Panel principal
  router.get("/", (req, res) => res.render("admin/index"));

  // Vistas con forms de cada modelo
  router.get("/artistas", (req, res) => res.render("admin/artistas"));
  router.get("/albumes", (req, res) => res.render("admin/albumes"));
  router.get("/generos", (req, res) => res.render("admin/generos"));
  router.get("/canciones", (req, res) => res.render("admin/canciones"));
  router.get("/artistaxgenero", (req, res) =>
    res.render("admin/artistaxgenero")
  );

  app.use("/admin", router);
};
