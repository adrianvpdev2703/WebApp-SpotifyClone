const { DataTypes } = require("sequelize");

module.exports = function (sequelize) {
  const ArtistaxGenero = sequelize.define("ArtistaxGenero", {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    genero: {
      type: DataTypes.INTEGER, // FK a Genero
      allowNull: false,
    },
    artista: {
      type: DataTypes.INTEGER, // FK a Artista
      allowNull: false,
    },
  });
  return ArtistaxGenero;
};
