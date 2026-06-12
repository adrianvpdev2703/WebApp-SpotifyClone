const {
  generoSchema,
  generoOptionalSchema,
  generoSearchSchema,
} = require("../validators/generoSchema");

const validateJson = require("../middlewares/validation.middleware");
const isJsonRequestValid = require("../middlewares/isJsonRequestValid.middleware");
const getObjectOr404 = require("../middlewares/getObjectOr404.middleware");
const db = require("../models");

module.exports = (app) => {
  const router = require("express").Router();
  const controller = require("../controllers/genero.controller");

  router.get("/", controller.getAllGeneros);
  router.get("/:id", getObjectOr404(db.Genero), controller.getGeneroById);

  router.post(
    "/",
    isJsonRequestValid,
    validateJson(generoSchema),
    controller.insertGenero
  );
  router.put(
    "/:id",
    getObjectOr404(db.Genero),
    isJsonRequestValid,
    validateJson(generoSchema),
    controller.updateGeneroPut
  );
  router.patch(
    "/:id",
    getObjectOr404(db.Genero),
    isJsonRequestValid,
    validateJson(generoOptionalSchema),
    controller.updateGeneroPatch
  );

  router.delete("/:id", getObjectOr404(db.Genero), controller.deleteGenero);
  router.post(
    "/search",
    validateJson(generoSearchSchema),
    controller.searchGeneros
  );

  app.use("/generos", router);
};
