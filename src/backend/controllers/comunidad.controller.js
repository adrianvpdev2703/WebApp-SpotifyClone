const { Comunidad, Usuario, Mensaje } = require("../models");

const crearComunidad = async (req, res) => {
  try {
    const { nombre, descripcion, es_privada, creador_id } = req.body;
    const nuevaComunidad = await Comunidad.create({ nombre, descripcion, es_privada });
    const usuario = await Usuario.findByPk(creador_id);
    if (usuario) await nuevaComunidad.addMiembro(usuario);
    res.status(201).json({ mensaje: "Comunidad creada con éxito", comunidad: nuevaComunidad });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const unirseComunidad = async (req, res) => {
  try {
    const { usuario_id, comunidad_id } = req.body;
    const comunidad = await Comunidad.findByPk(comunidad_id);
    const usuario = await Usuario.findByPk(usuario_id);
    if (!comunidad || !usuario) return res.status(404).json({ error: "Comunidad o usuario no encontrado" });
    const miembros = await comunidad.getMiembros();
    if (miembros.some((m) => m.id === usuario.id)) {
      return res.json({ mensaje: "Ya eres miembro de esta comunidad" });
    }
    await comunidad.addMiembro(usuario);
    res.json({ mensaje: `Te has unido correctamente a: ${comunidad.nombre}` });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const abandonarComunidad = async (req, res) => {
  try {
    const { usuario_id, comunidad_id } = req.body;
    const comunidad = await Comunidad.findByPk(comunidad_id);
    const usuario = await Usuario.findByPk(usuario_id);
    if (!comunidad || !usuario) return res.status(404).json({ error: "Comunidad o usuario no encontrado" });
    await comunidad.removeMiembro(usuario);
    res.json({ mensaje: `Has abandonado: ${comunidad.nombre}` });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const enviarMensaje = async (req, res) => {
  try {
    const { usuario_id, comunidad_id, contenido, es_cancion } = req.body;
    const mensaje = await Mensaje.create({ contenido, es_cancion, usuario_id, comunidad_id });
    const mensajeConAutor = await Mensaje.findByPk(mensaje.id, {
      include: [{ model: Usuario, as: "autor", attributes: ["id", "username"] }],
    });
    res.status(201).json({ mensaje: "Mensaje enviado", data: mensajeConAutor });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const obtenerMensajes = async (req, res) => {
  try {
    const { comunidad_id } = req.params;
    const mensajes = await Mensaje.findAll({
      where: { comunidad_id },
      include: [{ model: Usuario, as: "autor", attributes: ["id", "username"] }],
      order: [["createdAt", "ASC"]],
    });
    res.json(mensajes);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const listarComunidades = async (req, res) => {
  try {
    const comunidades = await Comunidad.findAll({
      include: [{ model: Usuario, as: "miembros", attributes: ["id"] }],
      order: [["createdAt", "DESC"]],
    });
    const resultado = comunidades.map((c) => ({
      id: c.id,
      nombre: c.nombre,
      descripcion: c.descripcion,
      es_privada: c.es_privada,
      miembros_count: c.miembros ? c.miembros.length : 0,
      created_at: c.createdAt,
    }));
    res.json(resultado);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const detalleComunidad = async (req, res) => {
  try {
    const { comunidad_id } = req.params;
    const comunidad = await Comunidad.findByPk(comunidad_id, {
      include: [{ model: Usuario, as: "miembros", attributes: ["id", "username"] }],
    });
    if (!comunidad) return res.status(404).json({ error: "Comunidad no encontrada" });
    res.json({
      id: comunidad.id,
      nombre: comunidad.nombre,
      descripcion: comunidad.descripcion,
      es_privada: comunidad.es_privada,
      miembros: comunidad.miembros || [],
      created_at: comunidad.createdAt,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  crearComunidad,
  unirseComunidad,
  abandonarComunidad,
  enviarMensaje,
  obtenerMensajes,
  listarComunidades,
  detalleComunidad,
};
