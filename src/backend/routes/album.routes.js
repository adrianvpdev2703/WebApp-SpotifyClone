const {
  albumSchema,
  albumOptionalSchema,
  albumSearchSchema,
} = require("../validators/albumSchema");

const validateJson = require("../middlewares/validation.middleware");
const isJsonRequestValid = require("../middlewares/isJsonRequestValid.middleware");
const getObjectOr404 = require("../middlewares/getObjectOr404.middleware");
const db = require("../models");

module.exports = (app) => {
  const router = require("express").Router();
  const controller = require("../controllers/album.controller");

  router.get("/", controller.getAllAlbumes);
  router.get("/:id", getObjectOr404(db.Album), controller.getAlbumById);
  router.post(
    "/",
    isJsonRequestValid,
    validateJson(albumSchema),
    controller.insertAlbum
  );
  router.put(
    "/:id",
    isJsonRequestValid,
    validateJson(albumSchema),
    getObjectOr404(db.Album),
    controller.updateAlbumPut
  );
  router.patch(
    "/:id",
    isJsonRequestValid,
    validateJson(albumOptionalSchema),
    getObjectOr404(db.Album),
    controller.updateAlbumPatch
  );
  router.delete("/:id", getObjectOr404(db.Album), controller.deleteAlbum);
  router.post(
    "/search",
    isJsonRequestValid,
    validateJson(albumSearchSchema),
    controller.searchAlbumes
  );

  app.use("/albumes", router);
};
