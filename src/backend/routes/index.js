module.exports = (app) => {
  require("./cancion.routes")(app);
  require("./album.routes")(app);
  require("./artista.routes")(app);
  require("./genero.routes")(app);
  require("./artistaxgenero.routes")(app);
  require("./admin.routes")(app);
  require("./search.routes")(app);
  require("./usuario.routes")(app);
  require("./comunidad.routes")(app);
  require("./tienda.routes")(app);
};
