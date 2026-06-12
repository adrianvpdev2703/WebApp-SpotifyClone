// controllers/usuario.controller.js
const { Usuario } = require("../models");

// Endpoint para simular el login o crear un usuario de prueba
const getOrCreateUsuario = async (req, res) => {
  try {
    const [usuario, created] = await Usuario.findOrCreate({
      where: { email: "test@spotifyclone.com" },
      defaults: { username: "AdrianTester" },
    });
    res.json(usuario);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Endpoint que Redux llamará para sumar XP
const addXp = async (req, res) => {
  try {
    const { id, xp_ganada } = req.body;

    const usuario = await Usuario.findByPk(id);
    if (!usuario)
      return res.status(404).json({ error: "Usuario no encontrado" });

    usuario.xp_actual += xp_ganada;

    // Lógica de subida de nivel: requiere 100 XP * nivel actual para subir
    // Nivel 1 -> Nivel 2: 100 XP. Nivel 2 -> Nivel 3: 200 XP (Total 300 acumulado), etc.
    let xpRequerida = usuario.nivel * 100;
    let subioNivel = false;

    while (usuario.xp_actual >= xpRequerida) {
      usuario.xp_actual -= xpRequerida; // Restamos la XP usada para subir de nivel
      usuario.nivel += 1;
      subioNivel = true;
      xpRequerida = usuario.nivel * 100; // Recalculamos para el siguiente nivel
    }

    await usuario.save();

    res.json({
      mensaje: "XP añadida",
      usuario: {
        id: usuario.id,
        xp_actual: usuario.xp_actual,
        nivel: usuario.nivel,
        xp_requerida_siguiente: usuario.nivel * 100,
      },
      subioNivel,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { getOrCreateUsuario, addXp };
