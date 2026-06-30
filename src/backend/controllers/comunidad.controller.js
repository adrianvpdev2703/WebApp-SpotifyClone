const { Comunidad, Usuario, Mensaje } = require("../models");

// 1. Crear una nueva comunidad
const crearComunidad = async (req, res) => {
  try {
    const { nombre, descripcion, es_privada, creador_id } = req.body;

    // Crear el grupo
    const nuevaComunidad = await Comunidad.create({
      nombre,
      descripcion,
      es_privada,
    });

    // Añadir al creador como el primer miembro de la comunidad
    const usuario = await Usuario.findByPk(creador_id);
    if (usuario) {
      await nuevaComunidad.addMiembro(usuario); // Este método "addMiembro" lo genera Sequelize mágicamente
    }

    res
      .status(201)
      .json({
        mensaje: "Comunidad creada con éxito",
        comunidad: nuevaComunidad,
      });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 2. Unirse a una comunidad
const unirseComunidad = async (req, res) => {
  try {
    const { usuario_id, comunidad_id } = req.body;

    const comunidad = await Comunidad.findByPk(comunidad_id);
    const usuario = await Usuario.findByPk(usuario_id);

    if (!comunidad || !usuario)
      return res
        .status(404)
        .json({ error: "Comunidad o usuario no encontrado" });

    // Si es privada, se requeriría lógica de invitación (lo saltamos para la demo básica)
    await comunidad.addMiembro(usuario);

    res.json({ mensaje: `Te has unido correctamente a: ${comunidad.nombre}` });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 3. Enviar mensaje o compartir canción al chat
const enviarMensaje = async (req, res) => {
  try {
    const { usuario_id, comunidad_id, contenido, es_cancion } = req.body;

    // Si es_cancion es true, el "contenido" puede ser simplemente el ID o nombre de la canción
    const mensaje = await Mensaje.create({
      contenido,
      es_cancion,
      usuario_id,
      comunidad_id,
    });

    res.status(201).json({ mensaje: "Mensaje enviado", data: mensaje });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 4. Cargar el historial del chat
const obtenerMensajes = async (req, res) => {
  try {
    const { comunidad_id } = req.params;

    // Traemos los mensajes incluyendo el nombre del usuario que lo envió
    const mensajes = await Mensaje.findAll({
      where: { comunidad_id },
      include: [{ model: Usuario, as: "autor", attributes: ["username"] }],
      order: [["createdAt", "ASC"]], // Del más antiguo al más reciente (como WhatsApp)
    });

    res.json(mensajes);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  crearComunidad,
  unirseComunidad,
  enviarMensaje,
  obtenerMensajes,
};
