const {
  cancionSchema,
  cancionOptionalSchema,
  cancionSearchSchema,
} = require("../validators/cancionSchema");

const validateJson = require("../middlewares/validation.middleware");
const isJsonRequestValid = require("../middlewares/isJsonRequestValid.middleware");
const getObjectOr404 = require("../middlewares/getObjectOr404.middleware");
const db = require("../models");

module.exports = (app) => {
  const router = require("express").Router();
  const controller = require("../controllers/cancion.controller");

  router.get("/", controller.getAllCanciones);
  router.get("/:id", getObjectOr404(db.Cancion), controller.getCancionById);
  router.post(
    "/",
    isJsonRequestValid,
    validateJson(cancionSchema),
    controller.insertCancion
  );
  router.put(
    "/:id",
    isJsonRequestValid,
    validateJson(cancionSchema),
    getObjectOr404(db.Cancion),
    controller.updateCancionPut
  );
  router.patch(
    "/:id",
    isJsonRequestValid,
    validateJson(cancionOptionalSchema),
    getObjectOr404(db.Cancion),
    controller.updateCancionPatch
  );
  router.delete("/:id", getObjectOr404(db.Cancion), controller.deleteCancion);
  router.post(
    "/search",
    validateJson(cancionSearchSchema),
    controller.searchCanciones
  );

  app.use("/canciones", router);
};
