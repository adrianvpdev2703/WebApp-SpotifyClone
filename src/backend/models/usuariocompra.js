module.exports = (sequelize) => {
  const { DataTypes } = require("sequelize");
  const UsuarioCompra = sequelize.define("UsuarioCompra", {
    usuario_id: { type: DataTypes.INTEGER, allowNull: false },
    item_id: { type: DataTypes.INTEGER, allowNull: false },
  }, { tableName: "usuario_compras", timestamps: true });
  return UsuarioCompra;
};
