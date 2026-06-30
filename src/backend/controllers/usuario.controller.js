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

    //carga en el estado grobal del redux
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

    let state = store.getState().gamification.usuariosActivos[id];

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

    store.dispatch(sumarXpA_Usuario({ id, xpGanada: xp_ganada }));

    const estadoActualizado = store.getState().gamification.usuariosActivos[id];

    await Usuario.update(
      { xp_actual: estadoActualizado.xpActual, nivel: estadoActualizado.nivel },
      { where: { id: id } },
    );

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
