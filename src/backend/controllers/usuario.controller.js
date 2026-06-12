// src/backend/controllers/usuario.controller.js
const { Usuario } = require("../models");
const store = require("../store");
const { cargarUsuarioEnMemoria, sumarXpA_Usuario } =
  require("../store/gamificationSlice").actions;

const getOrCreateUsuario = async (req, res) => {
  try {
    const [usuario, created] = await Usuario.findOrCreate({
      where: { email: "test@spotifyclone.com" },
      defaults: { username: "AdrianTester" },
    });

    // Cargar en el estado global de Redux del Backend
    store.dispatch(
      cargarUsuarioEnMemoria({
        id: usuario.id,
        xpActual: usuario.xp_actual,
        nivel: usuario.nivel,
      }),
    );

    res.json(usuario);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const addXp = async (req, res) => {
  try {
    const { id, xp_ganada } = req.body;

    // 1. Revisar si está en la memoria de Redux
    let state = store.getState().gamification.usuariosActivos[id];

    // Si el servidor se reinició y no está en memoria, buscar en BD y cargar
    if (!state) {
      const usuarioBd = await Usuario.findByPk(id);
      if (!usuarioBd)
        return res.status(404).json({ error: "Usuario no encontrado" });

      store.dispatch(
        cargarUsuarioEnMemoria({
          id: usuarioBd.id,
          xpActual: usuarioBd.xp_actual,
          nivel: usuarioBd.nivel,
        }),
      );
    }

    // 2. Ejecutar la lógica de gamificación en RAM (Redux)
    store.dispatch(sumarXpA_Usuario({ id, xpGanada: xp_ganada }));

    // 3. Obtener el resultado
    const estadoActualizado = store.getState().gamification.usuariosActivos[id];

    // 4. Guardar respaldo en SQLite
    await Usuario.update(
      { xp_actual: estadoActualizado.xpActual, nivel: estadoActualizado.nivel },
      { where: { id: id } },
    );

    // 5. Enviar respuesta al Frontend
    res.json({
      mensaje: estadoActualizado.subioNivel
        ? "¡Subiste de nivel!"
        : "XP añadida",
      usuario: {
        id: id,
        xp_actual: estadoActualizado.xpActual,
        nivel: estadoActualizado.nivel,
        xp_requerida_siguiente: estadoActualizado.nivel * 100,
      },
      subioNivel: estadoActualizado.subioNivel,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { getOrCreateUsuario, addXp };
