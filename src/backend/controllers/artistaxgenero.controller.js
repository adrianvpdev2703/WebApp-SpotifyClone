const db = require("../models");

// GET todos
exports.getAllArtistaxGenero = async (req, res) => {
  const list = await db.ArtistaxGenero.findAll();
  res.json(list);
};

// GET por ID
exports.getArtistaxGeneroById = async (req, res) => {
  res.json(req.obj);
};

// POST
exports.insertArtistaxGenero = async (req, res) => {
  const { genero, artista } = req.body;
  try {
    const rel = await db.ArtistaxGenero.create({ genero, artista });
    res.status(201).json(rel);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al crear la relacion" });
  }
};

// PUT
exports.updateArtistaxGeneroPut = async (req, res) => {
  const rel = req.obj;
  const { genero, artista } = req.body;

  try {
    rel.genero = genero;
    rel.artista = artista;
    await rel.save();
    res.json(rel);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al actualizar la relacion" });
  }
};

// PATCH
exports.updateArtistaxGeneroPatch = async (req, res) => {
  const rel = req.obj;
  const { genero, artista } = req.body;
  try {
    if (genero !== undefined) rel.genero = genero;
    if (artista !== undefined) rel.artista = artista;
    await rel.save();
    res.json(rel);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al actualizar la relación" });
  }
};

// DELETE
exports.deleteArtistaxGenero = async (req, res) => {
  try {
    await req.obj.destroy();
    res.json({ message: "Relación eliminada correctamente" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al eliminar la relación" });
  }
};
