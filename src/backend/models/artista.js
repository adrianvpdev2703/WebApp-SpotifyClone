const { DataTypes } = require("sequelize");

module.exports = function (sequelize) {
  const Artista = sequelize.define("Artista", {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    nombre: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    imagen: {
      type: DataTypes.STRING,
    },
  });
  return Artista;
};
