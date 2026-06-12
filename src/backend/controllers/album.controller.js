const db = require("../models");
const path = require("path");

// GET pa todos los albumes
exports.getAllAlbumes = async (req, res) => {
  const albumes = await db.Album.findAll({
    include: [{ model: db.Artista, as: "artistaData" }],
  });
  res.json(albumes);
};

// GET pa un album por id
exports.getAlbumById = async (req, res) => {
  res.json(req.obj);
};

// POST crear album
exports.insertAlbum = async (req, res) => {
  const { nombre, artista } = req.body;
  let imagen = null;

  try {
    if (req.files && req.files.imagen) {
      const fileImg = req.files.imagen;
      imagen = `/uploads/images/${fileImg.name}`;
      await fileImg.mv(path.join(__dirname, "../public", imagen));
    }

    const album = await db.Album.create({
      nombre,
      artista,
      imagen,
    });
    res.status(201).json(album);
  } catch (error) {
    console.error("Error al crear el álbum:", error);
    res.status(500).json({ error: "Error al crear el álbum" });
  }
};

// PUT actualizar album (completo)
exports.updateAlbumPut = async (req, res) => {
  const album = req.obj;
  const { nombre, artista } = req.body;

  try {
    album.nombre = nombre;
    album.artista = artista;

    if (req.files && req.files.imagen) {
      const fileImg = req.files.imagen;
      const imagen = `/uploads/images/${fileImg.name}`;
      await fileImg.mv(path.join(__dirname, "../public", imagen));
      album.imagen = imagen;
    }

    await album.save();
    res.json(album);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al actualizar el álbum" });
  }
};

// PATCH actualizar parcialmente
exports.updateAlbumPatch = async (req, res) => {
  const album = req.obj;
  const { nombre, artista } = req.body;

  try {
    if (nombre) album.nombre = nombre;
    if (artista) album.artista = artista;

    if (req.files && req.files.imagen) {
      const fileImg = req.files.imagen;
      const imagen = `/uploads/images/${fileImg.name}`;
      await fileImg.mv(path.join(__dirname, "../public", imagen));
      album.imagen = imagen;
    }

    await album.save();
    res.json(album);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al actualizar el álbum" });
  }
};

// DELETE eliminar album
exports.deleteAlbum = async (req, res) => {
  try {
    await req.obj.destroy();
    res.json({ message: "Álbum eliminado" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al eliminar el álbum" });
  }
};

// SEARCH buscar albumes
exports.searchAlbumes = async (req, res) => {
  const { nombre, artista } = req.body;
  const whereClause = {};

  if (nombre) whereClause.nombre = { [db.Sequelize.Op.like]: `%${nombre}%` };
  if (artista) whereClause.artista = artista;

  const albumes = await db.Album.findAll({ where: whereClause });
  res.json(albumes);
};
