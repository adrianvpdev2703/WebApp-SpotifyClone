// const db = require("../models");
// const path = require("path");
// const fs = require("fs");

// // GET para Artistas
// exports.getAllArtistas = async (req, res) => {
//   const artistas = await db.Artista.findAll();
//   res.json(artistas);
// };

// // GET artista por ID
// exports.getArtistaById = async (req, res) => {
//   res.json(req.obj);
// };

// // POST para artista con express-fileupload
// exports.insertArtista = async (req, res) => {
//   const { nombre } = req.body;
//   let imagen = null;

//   try {
//     if (req.files && req.files.imagen) {
//       const archivo = req.files.imagen;
//       const uploadPath = path.join(
//         __dirname,
//         "..",
//         "public",
//         "uploads",
//         "images",
//         Date.now() + "_" + archivo.name
//       );
//       await archivo.mv(uploadPath);
//       imagen = `/uploads/images/${Date.now()}_${archivo.name}`;
//     }

//     const artista = await db.Artista.create({ nombre, imagen });
//     res.status(201).json(artista);
//   } catch (error) {
//     console.error(error);
//     res
//       .status(500)
//       .json({ error: "Error al crear el Artista", details: error.message });
//   }
// };

// // PUT para artista con imagen
// exports.updateArtistaPut = async (req, res) => {
//   const artista = req.obj;
//   const { nombre } = req.body;

//   try {
//     artista.nombre = nombre;

//     if (req.files && req.files.imagen) {
//       const archivo = req.files.imagen;
//       const uploadPath = path.join(
//         __dirname,
//         "..",
//         "public",
//         "uploads",
//         "images",
//         Date.now() + "_" + archivo.name
//       );
//       await archivo.mv(uploadPath);
//       artista.imagen = `/uploads/images/${Date.now()}_${archivo.name}`;
//     }

//     await artista.save();
//     res.json(artista);
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({
//       error: "Error al actualizar el artista",
//       details: error.message,
//     });
//   }
// };

// // PATCH para artista con imagen
// exports.updateArtistaPatch = async (req, res) => {
//   const artista = req.obj;
//   const { nombre } = req.body;

//   try {
//     if (nombre !== undefined) artista.nombre = nombre;
//     if (req.files && req.files.imagen) {
//       const archivo = req.files.imagen;
//       const uploadPath = path.join(
//         __dirname,
//         "..",
//         "public",
//         "uploads",
//         "images",
//         Date.now() + "_" + archivo.name
//       );
//       await archivo.mv(uploadPath);
//       artista.imagen = `/uploads/images/${Date.now()}_${archivo.name}`;
//     }

//     await artista.save();
//     res.json(artista);
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({
//       error: "Error al actualizar el artista",
//       details: error.message,
//     });
//   }
// };

// // DELETE artista
// exports.deleteArtista = async (req, res) => {
//   const id = req.obj.id; // gracias al middleware getObjectOr404 ya lo tenemos
//   try {
//     // 1. Eliminar relaciones en ArtistaxGeneros
//     await db.ArtistaxGenero.destroy({
//       where: { artista: id },
//     });

//     // 2. Eliminar el artista
//     await req.obj.destroy();

//     res.json({ message: "Artista eliminado correctamente papu" });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({
//       error: "Error al eliminar el artista",
//       details: error.message,
//     });
//   }
// };

// // SEARCH para artista
// exports.searchArtista = async (req, res) => {
//   const { nombre } = req.body;
//   const whereClause = {};
//   if (nombre) whereClause.nombre = { [db.Sequelize.Op.like]: `%${nombre}%` };
//   const artistas = await db.Artista.findAll({ where: whereClause });
//   res.json(artistas);
// };

const db = require("../models");
const path = require("path");

// GET para Artistas
exports.getAllArtistas = async (req, res) => {
  const artistas = await db.Artista.findAll();
  res.json(artistas);
};

// GET artista por ID
exports.getArtistaById = async (req, res) => {
  res.json(req.obj);
};

// POST para artista con imagen
exports.insertArtista = async (req, res) => {
  const { nombre } = req.body;
  let imagen = null;

  try {
    if (req.files && req.files.imagen) {
      const archivo = req.files.imagen;
      const timestampedName = Date.now() + "_" + archivo.name;
      const uploadPath = path.join(
        __dirname,
        "..",
        "public",
        "uploads",
        "images",
        timestampedName
      );
      await archivo.mv(uploadPath);
      imagen = `/uploads/images/${timestampedName}`;
    }

    const artista = await db.Artista.create({ nombre, imagen });
    res.status(201).json(artista);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "Error al crear el Artista", details: error.message });
  }
};

// PUT para artista con imagen
exports.updateArtistaPut = async (req, res) => {
  const artista = req.obj;
  const { nombre } = req.body;

  try {
    artista.nombre = nombre;

    if (req.files && req.files.imagen) {
      const archivo = req.files.imagen;
      const timestampedName = Date.now() + "_" + archivo.name;
      const uploadPath = path.join(
        __dirname,
        "..",
        "public",
        "uploads",
        "images",
        timestampedName
      );
      await archivo.mv(uploadPath);
      artista.imagen = `/uploads/images/${timestampedName}`;
    }

    await artista.save();
    res.json(artista);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: "Error al actualizar el artista",
      details: error.message,
    });
  }
};

// PATCH para artista con imagen
exports.updateArtistaPatch = async (req, res) => {
  const artista = req.obj;
  const { nombre } = req.body;

  try {
    if (nombre !== undefined) artista.nombre = nombre;

    if (req.files && req.files.imagen) {
      const archivo = req.files.imagen;
      const timestampedName = Date.now() + "_" + archivo.name;
      const uploadPath = path.join(
        __dirname,
        "..",
        "public",
        "uploads",
        "images",
        timestampedName
      );
      await archivo.mv(uploadPath);
      artista.imagen = `/uploads/images/${timestampedName}`;
    }

    await artista.save();
    res.json(artista);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: "Error al actualizar el artista",
      details: error.message,
    });
  }
};

// DELETE artista
exports.deleteArtista = async (req, res) => {
  const id = req.obj.id;
  try {
    await db.ArtistaxGenero.destroy({ where: { artista: id } });
    await req.obj.destroy();
    res.json({ message: "Artista eliminado correctamente" });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "Error al eliminar el artista", details: error.message });
  }
};

// SEARCH para artista
exports.searchArtista = async (req, res) => {
  const { nombre } = req.body;
  const whereClause = {};
  if (nombre) whereClause.nombre = { [db.Sequelize.Op.like]: `%${nombre}%` };
  const artistas = await db.Artista.findAll({ where: whereClause });
  res.json(artistas);
};
