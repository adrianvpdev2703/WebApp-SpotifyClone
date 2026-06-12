const {
  artistaxgeneroSchema,
  artistaxgeneroOptionalSchema,
} = require("../validators/artistaxgeneroSchema");

const validateJson = require("../middlewares/validation.middleware");
const isJsonRequestValid = require("../middlewares/isJsonRequestValid.middleware");
const getObjectOr404 = require("../middlewares/getObjectOr404.middleware");
const db = require("../models");

module.exports = (app) => {
  const router = require("express").Router();
  const controller = require("../controllers/artistaxgenero.controller");

  router.get("/", controller.getAllArtistaxGenero);
  router.get(
    "/:id",
    getObjectOr404(db.ArtistaxGenero),
    controller.getArtistaxGeneroById
  );

  router.post(
    "/",
    isJsonRequestValid,
    validateJson(artistaxgeneroSchema),
    controller.insertArtistaxGenero
  );

  router.put(
    "/:id",
    getObjectOr404(db.ArtistaxGenero),
    isJsonRequestValid,
    validateJson(artistaxgeneroSchema),
    controller.updateArtistaxGeneroPut
  );

  router.patch(
    "/:id",
    getObjectOr404(db.ArtistaxGenero),
    isJsonRequestValid,
    validateJson(artistaxgeneroOptionalSchema),
    controller.updateArtistaxGeneroPatch
  );

  router.delete(
    "/:id",
    getObjectOr404(db.ArtistaxGenero),
    controller.deleteArtistaxGenero
  );

  app.use("/artistaxgenero", router);
};
