module.exports = (sequelize) => {
  const { DataTypes } = require("sequelize");
  const TiendaItem = sequelize.define("TiendaItem", {
    nombre: { type: DataTypes.STRING, allowNull: false },
    descripcion: { type: DataTypes.TEXT },
    precio: { type: DataTypes.INTEGER, allowNull: false },
    tipo: { type: DataTypes.STRING, defaultValue: "cosmetico" },
    icono: { type: DataTypes.STRING, defaultValue: "🎁" },
  }, { tableName: "tienda_items", timestamps: true });
  return TiendaItem;
};
