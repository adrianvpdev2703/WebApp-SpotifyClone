module.exports = (sequelize) => {
  const { DataTypes } = require("sequelize");

  const Comunidad = sequelize.define(
    "Comunidad",
    {
      nombre: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      descripcion: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      es_privada: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
    },
    {
      tableName: "comunidades",
      timestamps: true, // Agrega createdAt y updatedAt automáticamente
    },
  );

  return Comunidad;
};
