// src/backend/controllers/usuario.controller.js
const { Usuario } = require("../models");
const store = require("../store");
const { cargarUsuarioEnMemoria, procesarFinCancion } =
  require("../store/gamificationSlice").actions;
const moment = require("moment");

// Añade esta función en tu controlador
const crearUsuario = async (req, res) => {
  try {
    const { username, email } = req.body;

    // Validación básica
    if (!username || !email) {
      return res
        .status(400)
        .json({ error: "Faltan datos obligatorios (username, email)" });
    }

    // Verificar si el correo ya existe
    const usuarioExistente = await Usuario.findOne({ where: { email } });
    if (usuarioExistente) {
      return res.status(400).json({ error: "El correo ya está registrado" });
    }

    // Crear el nuevo usuario (inicia con stats en 0 por defecto gracias al modelo)
    const nuevoUsuario = await Usuario.create({
      username,
      email,
    });

    res.status(201).json({
      mensaje: "Usuario creado con éxito",
      usuario: nuevoUsuario,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getOrCreateUsuario = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ error: "Email requerido" });

    const [usuario, created] = await Usuario.findOrCreate({
      where: { email },
      defaults: { username: email.split("@")[0] },
    });

    //carga en el estado grobal del redux
    store.dispatch(
      cargarUsuarioEnMemoria({
        id: usuario.id,
        xpActual: usuario.xp_actual,
        nivel: usuario.nivel,
        puntos: usuario.puntos_tienda || 0,
        racha: usuario.racha_dias || 0,
      }),
    );

    res.json(usuario);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const registrarCancionEscuchada = async (req, res) => {
  try {
    const { id, sinPausasNiSaltos } = req.body; // El front enviará true o false

    // Buscar usuario en BD
    const usuarioBd = await Usuario.findByPk(id);
    if (!usuarioBd)
      return res.status(404).json({ error: "Usuario no encontrado" });

    // Cargar en Redux si no estaba
    let state = store.getState().gamification.usuariosActivos[id];
    if (!state) {
      store.dispatch(
        cargarUsuarioEnMemoria({
          id: usuarioBd.id,
          xpActual: usuarioBd.xp_actual,
          nivel: usuarioBd.nivel,
          puntos: usuarioBd.puntos_tienda,
          racha: usuarioBd.racha_dias,
        }),
      );
    }

    // Calcular Lógica de Fechas para la Racha
    const ahora = moment();
    const ultimaConexion = usuarioBd.ultima_cancion_fecha
      ? moment(usuarioBd.ultima_cancion_fecha)
      : null;

    let esNuevoDia = false;
    let rachaPerdida = false;

    if (!ultimaConexion) {
      esNuevoDia = true; // Primera vez que escucha
    } else {
      const diferenciaDias = ahora
        .startOf("day")
        .diff(ultimaConexion.startOf("day"), "days");
      if (diferenciaDias === 1)
        esNuevoDia = true; // Volvió al día siguiente ¡Racha!
      else if (diferenciaDias > 1) rachaPerdida = true; // Pasó más de un día, pierde racha
    }

    // Despachar a Redux
    store.dispatch(
      procesarFinCancion({
        id,
        mantuvoCombo: sinPausasNiSaltos,
        esNuevoDia,
        rachaPerdida,
      }),
    );

    // Obtener estado procesado
    const estadoActualizado = store.getState().gamification.usuariosActivos[id];

    // Persistir en SQLite
    await Usuario.update(
      {
        xp_actual: estadoActualizado.xpActual,
        nivel: estadoActualizado.nivel,
        puntos_tienda: estadoActualizado.puntos,
        racha_dias: estadoActualizado.racha,
        ultima_cancion_fecha: new Date(),
      },
      { where: { id: id } },
    );

    res.json({
      mensaje: estadoActualizado.subioNivel
        ? "¡Subiste de nivel y ganaste puntos!"
        : "Canción registrada",
      xpGanada: estadoActualizado.ultimaXpGanada,
      usuario: {
        nivel: estadoActualizado.nivel,
        xp_actual: estadoActualizado.xpActual,
        racha: estadoActualizado.racha,
        combo_actual: estadoActualizado.combo,
        puntos_tienda: estadoActualizado.puntos,
        xp_requerida: estadoActualizado.nivel * 100,
      },
      subioNivel: estadoActualizado.subioNivel,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
const getRanking = async (req, res) => {
  try {
    // Buscamos a los top 10 usuarios
    const ranking = await Usuario.findAll({
      order: [
        ["nivel", "DESC"], // Primero los de mayor nivel
        ["xp_actual", "DESC"], // Si empatan en nivel, desempata la XP
      ],
      limit: 10,
      attributes: [
        "id",
        "username",
        "nivel",
        "xp_actual",
        "racha_dias",
        "puntos_tienda",
      ], // Solo devolvemos datos públicos
    });

    res.json({
      mensaje: "Top 10 Global",
      ranking: ranking,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
module.exports = {
  getOrCreateUsuario,
  registrarCancionEscuchada,
  getRanking,
  crearUsuario,
};
