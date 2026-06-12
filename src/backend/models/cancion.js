const { DataTypes } = require("sequelize");

module.exports = function (sequelize) {
  const Cancion = sequelize.define("Cancion", {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    nombre: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    album: {
      type: DataTypes.INTEGER, // FK a Album
      allowNull: false,
    },
    imagen: {
      type: DataTypes.STRING,
    },
    archivo: {
      type: DataTypes.STRING, // Ruta al mp3
    },
  });
  return Cancion;
};
