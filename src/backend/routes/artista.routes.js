const {
  artistaSchema,
  artistaOptionalSchema,
  artistaSearchSchema,
} = require("../validators/artistaSchema");

const validateJson = require("../middlewares/validation.middleware");
const isJsonRequestValid = require("../middlewares/isJsonRequestValid.middleware");
const getObjectOr404 = require("../middlewares/getObjectOr404.middleware");
const db = require("../models");
const controller = require("../controllers/artista.controller");

module.exports = (app) => {
  const router = require("express").Router();

  router.get("/", controller.getAllArtistas);
  router.get("/:id", getObjectOr404(db.Artista), controller.getArtistaById);

  router.post("/", controller.insertArtista); // ya no multer
  router.put(
    "/:id",
    getObjectOr404(db.Artista),
    isJsonRequestValid,
    validateJson(artistaSchema),
    controller.updateArtistaPut
  );
  router.patch(
    "/:id",
    getObjectOr404(db.Artista),
    isJsonRequestValid,
    validateJson(artistaOptionalSchema),
    controller.updateArtistaPatch
  );

  router.delete("/:id", getObjectOr404(db.Artista), controller.deleteArtista);
  router.post(
    "/search",
    validateJson(artistaSearchSchema),
    controller.searchArtista
  );

  app.use("/artistas", router);
};
