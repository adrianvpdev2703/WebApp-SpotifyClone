module.exports = (sequelize) => {
  const { DataTypes } = require("sequelize");

  const Mensaje = sequelize.define(
    "Mensaje",
    {
      contenido: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      es_cancion: {
        type: DataTypes.BOOLEAN,
        defaultValue: false, // Si es true, el 'contenido' podría ser el ID de la canción
      },
    },
    {
      tableName: "mensajes",
      timestamps: true, // Nos sirve para ordenar el chat por fecha
    },
  );

  return Mensaje;
};
