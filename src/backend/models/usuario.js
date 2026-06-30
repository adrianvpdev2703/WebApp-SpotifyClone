module.exports = (sequelize) => {
  const { DataTypes } = require("sequelize");

  const Usuario = sequelize.define(
    "Usuario",
    {
      username: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      xp_actual: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
      },
      nivel: {
        type: DataTypes.INTEGER,
        defaultValue: 1,
      },
      // NUEVAS COLUMNAS PARA GAMIFICACIÓN
      puntos_tienda: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
      },
      racha_dias: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
      },
      ultima_cancion_fecha: {
        type: DataTypes.DATE,
        allowNull: true,
      },
    },
    {
      tableName: "usuarios",
      timestamps: false,
    },
  );

  return Usuario;
};
