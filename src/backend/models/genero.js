const { DataTypes } = require("sequelize");

module.exports = function (sequelize) {
  const Genero = sequelize.define("Genero", {
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
  return Genero;
};
