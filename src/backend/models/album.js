const { DataTypes } = require("sequelize");

module.exports = function (sequelize) {
  const Album = sequelize.define("Album", {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    nombre: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    artista: {
      type: DataTypes.INTEGER, // FK a Artista
      allowNull: false,
    },
    imagen: {
      type: DataTypes.STRING,
    },
  });
  return Album;
};
