const { TiendaItem, UsuarioCompra, Usuario } = require("../models");

const obtenerItems = async (req, res) => {
  try {
    const items = await TiendaItem.findAll({ order: [["precio", "ASC"]] });
    res.json(items);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const comprarItem = async (req, res) => {
  try {
    const { usuario_id, item_id } = req.body;
    const usuario = await Usuario.findByPk(usuario_id);
    const item = await TiendaItem.findByPk(item_id);
    if (!usuario) return res.status(404).json({ error: "Usuario no encontrado" });
    if (!item) return res.status(404).json({ error: "Item no encontrado" });
    if (usuario.puntos_tienda < item.precio) {
      return res.status(400).json({ error: "Puntos insuficientes" });
    }

    const yaComprado = await UsuarioCompra.findOne({
      where: { usuario_id, item_id },
    });
    if (yaComprado) {
      return res.status(400).json({ error: "Ya has comprado este item" });
    }

    usuario.puntos_tienda -= item.precio;
    await usuario.save();
    await UsuarioCompra.create({ usuario_id, item_id });

    res.json({
      mensaje: `¡Has comprado ${item.nombre}!`,
      puntos_restantes: usuario.puntos_tienda,
      item,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const obtenerCompras = async (req, res) => {
  try {
    const { usuario_id } = req.params;
    const compras = await UsuarioCompra.findAll({
      where: { usuario_id },
      include: [{ model: TiendaItem, as: "item" }],
    });
    res.json(compras);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { obtenerItems, comprarItem, obtenerCompras };
