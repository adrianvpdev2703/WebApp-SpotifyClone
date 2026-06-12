const { Sequelize } = require("sequelize");

// Config SQLite
const sequelize = new Sequelize({
  dialect: "sqlite",
  storage: "database.sqlite", // El archivo se creará automáticamente en la raíz de tu proyecto
});

/* // Configuración anterior de MariaDB comentada o eliminada
const sequelize = new Sequelize(
  process.env.MYSQL_DATABASE,
  process.env.MYSQL_USER,
  process.env.MYSQL_PASSWORD,
  {
    dialect: "mariadb",
    host: process.env.MYSQL_HOST,
    port: process.env.MYSQL_PORT,
    dialectOptions: {
      connectTimeout: 10000,
    },
  }
);
*/

sequelize
  .authenticate()
  .then(() => {
    console.log("Connection has been established successfully.");
  })
  .catch((error) => {
    console.error("Unable to connect to the database:", error);
  });

module.exports = {
  sequelize,
  Sequelize,
};
