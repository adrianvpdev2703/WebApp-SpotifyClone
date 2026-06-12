const { where } = require("sequelize");
const db = require("../models");
const path = require("path");

//GET para las canciones
exports.getAllCanciones = async (req, res) => {
  const canciones = await db.Cancion.findAll();
  res.json(canciones);
};

//GET para cancion por id
exports.getCancionById = async (req, res) => {
  res.json(req.obj);
};

// PATCH actualizar parcialmente
exports.updateCancionPatch = async (req, res) => {
  const cancion = req.obj;
  const { nombre, album } = req.body;

  try {
    if (nombre) cancion.nombre = nombre;
    if (album) cancion.album = album;

    if (req.files) {
      if (req.files.archivo) {
        const file = req.files.archivo;
        const archivo = `/uploads/audio/${file.name}`;
        await file.mv(path.join(__dirname, "../public", archivo));
        cancion.archivo = archivo;
      }
      if (req.files.imagen) {
        const fileImg = req.files.imagen;
        const imagen = `/uploads/images/${fileImg.name}`;
        await fileImg.mv(path.join(__dirname, "../public", imagen));
        cancion.imagen = imagen;
      }
    }

    await cancion.save();
    res.json(cancion);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al actualizar la canción" });
  }
};

//POST crear cancion (version con mp3 e imagen opcional)
exports.insertCancion = async (req, res) => {
  const { nombre, album } = req.body;
  let archivo = null;
  let imagen = null;

  try {
    if (req.files) {
      if (req.files.archivo) {
        const file = req.files.archivo;
        archivo = `/uploads/audio/${file.name}`;
        await file.mv(path.join(__dirname, "../public", archivo));
      }
      if (req.files.imagen) {
        const fileImg = req.files.imagen;
        imagen = `/uploads/images/${fileImg.name}`;
        await fileImg.mv(path.join(__dirname, "../public", imagen));
      }
    }

    const cancion = await db.Cancion.create({ nombre, album, archivo, imagen });
    res.status(201).json(cancion);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Error al crear la canción" });
  }
};
//PUT actualizar completamente
exports.updateCancionPut = async (req, res) => {
  const cancion = req.obj;
  const { nombre, album } = req.body;

  try {
    cancion.nombre = nombre;
    cancion.album = album;

    if (req.files) {
      if (req.files.archivo) {
        const file = req.files.archivo;
        const archivo = `/uploads/audio/${file.name}`;
        await file.mv(path.join(__dirname, "../public", archivo));
        cancion.archivo = archivo;
      }
      if (req.files.imagen) {
        const fileImg = req.files.imagen;
        const imagen = `/uploads/images/${fileImg.name}`;
        await fileImg.mv(path.join(__dirname, "../public", imagen));
        cancion.imagen = imagen;
      }
    }
    await cancion.save();
    res.json(cancion);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al actualizar la cancion" });
  }
};

//DELETE para canciones
exports.deleteCancion = async (req, res) => {
  try {
    await req.obj.destroy();
    res.json({ message: "Cancion eliminada" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al eliminar la canción" });
  }
};

//POST q hace search para canciones
exports.searchCanciones = async (req, res) => {
  const { nombre, album } = req.body;
  const whereClause = {};
  if (nombre) whereClause.nombre = { [db.Sequelize.Op.like]: `%${nombre}%` };

  if (album) whereClause.album = album;

  const canciones = await db.Cancion.findAll({ where: whereClause });
  res.json(canciones);
};
