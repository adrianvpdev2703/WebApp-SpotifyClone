const db = require("../models");
const path = require("path");

//GET all generos
exports.getAllGeneros = async (req, res) => {
  const generos = await db.Genero.findAll();
  res.json(generos);
};

//GET genero by id
exports.getGeneroById = async (req, res) => {
  res.json(req.obj);
};

//POST crear genero con subida de imagen
exports.insertGenero = async (req, res) => {
  const { nombre } = req.body;
  let imagen = null;

  try {
    if (req.files && req.files.imagen) {
      const fileImg = req.files.imagen;
      imagen = `/uploads/images/${fileImg.name}`;
      await fileImg.mv(path.join(__dirname, "../public", imagen));
    }

    const genero = await db.Genero.create({ nombre, imagen });
    res.status(201).json(genero);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al insertar el genero" });
  }
};

// PUT actualizar completamente
exports.updateGeneroPut = async (req, res) => {
  const genero = req.obj;
  const { nombre } = req.body;

  try {
    if (nombre) genero.nombre = nombre;

    if (req.files && req.files.imagen) {
      const fileImg = req.files.imagen;
      const imagen = `/uploads/images/${fileImg.name}`;
      await fileImg.mv(path.join(__dirname, "../public", imagen));
      genero.imagen = imagen;
    }

    await genero.save();
    res.json(genero);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al actualizar el genero" });
  }
};

// PATCH actualizar parcialmente
exports.updateGeneroPatch = async (req, res) => {
  const genero = req.obj;
  const { nombre } = req.body;

  try {
    if (nombre) genero.nombre = nombre;

    if (req.files && req.files.imagen) {
      const fileImg = req.files.imagen;
      const imagen = `/uploads/images/${fileImg.name}`;
      await fileImg.mv(path.join(__dirname, "../public", imagen));
      genero.imagen = imagen;
    }

    await genero.save();
    res.json(genero);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al actualizar el genero" });
  }
};

//DELETE genero
exports.deleteGenero = async (req, res) => {
  try {
    await req.obj.destroy();
    res.json({ message: "Genero eliminado" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al eliminar el genero" });
  }
};

//SEARCH genero
exports.searchGeneros = async (req, res) => {
  const { nombre } = req.body;
  const whereClause = {};

  if (nombre) whereClause.nombre = { [db.Sequelize.Op.like]: `%${nombre}%` };

  const generos = await db.Genero.findAll({ where: whereClause });
  res.json(generos);
};
