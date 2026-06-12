const { sequelize } = require("../config/db.config");

// Importación de modelos
const Cancion = require("./cancion")(sequelize);
const Album = require("./album")(sequelize);
const Artista = require("./artista")(sequelize);
const Genero = require("./genero")(sequelize);
const ArtistaxGenero = require("./artistaxgenero")(sequelize);

// Un Álbum pertenece a un Artista
Album.belongsTo(Artista, { foreignKey: "artista", as: "artistaData" });
Artista.hasMany(Album, { foreignKey: "artista", as: "albumes" });

// Una Canción pertenece a un Álbum
Cancion.belongsTo(Album, { foreignKey: "album", as: "albumData" });
Album.hasMany(Cancion, { foreignKey: "album", as: "canciones" });

// Relación N a N entre Artista y Género usando tabla intermedia ArtistaxGenero
ArtistaxGenero.belongsTo(Artista, { foreignKey: "artista", as: "artistaData" });
Artista.hasMany(ArtistaxGenero, { foreignKey: "artista", as: "generos" });

ArtistaxGenero.belongsTo(Genero, { foreignKey: "genero", as: "generoData" });
Genero.hasMany(ArtistaxGenero, { foreignKey: "genero", as: "artistas" });

module.exports = {
  Cancion,
  Album,
  Artista,
  Genero,
  ArtistaxGenero,
  sequelize,
  Sequelize: sequelize.Sequelize,
};
