const { sequelize } = require("../config/db.config");

// Importación de modelos
const Cancion = require("./cancion")(sequelize);
const Album = require("./album")(sequelize);
const Artista = require("./artista")(sequelize);
const Genero = require("./genero")(sequelize);
const ArtistaxGenero = require("./artistaxgenero")(sequelize);

const Usuario = require("./usuario")(sequelize);

const Comunidad = require("./comunidad")(sequelize);
const Mensaje = require("./mensaje")(sequelize);
const TiendaItem = require("./tiendaitem")(sequelize);
const UsuarioCompra = require("./usuariocompra")(sequelize);

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

// 1. Usuarios <-> Comunidades (Muchos a Muchos)
// Crea automáticamente la tabla 'UsuarioComunidad'
Usuario.belongsToMany(Comunidad, {
  through: "UsuarioComunidad",
  as: "comunidades",
});
Comunidad.belongsToMany(Usuario, {
  through: "UsuarioComunidad",
  as: "miembros",
});

// 2. Un Usuario crea Muchos Mensajes (Uno a Muchos)
Usuario.hasMany(Mensaje, { foreignKey: "usuario_id", as: "mensajes" });
Mensaje.belongsTo(Usuario, { foreignKey: "usuario_id", as: "autor" });

// 3. Una Comunidad tiene Muchos Mensajes (Uno a Muchos)
Comunidad.hasMany(Mensaje, { foreignKey: "comunidad_id", as: "mensajes" });
Mensaje.belongsTo(Comunidad, { foreignKey: "comunidad_id", as: "comunidad" });

// 4. Usuario -> Compras
Usuario.hasMany(UsuarioCompra, { foreignKey: "usuario_id", as: "compras" });
UsuarioCompra.belongsTo(Usuario, { foreignKey: "usuario_id", as: "usuario" });

// 5. TiendaItem -> Compras
TiendaItem.hasMany(UsuarioCompra, { foreignKey: "item_id", as: "compras" });
UsuarioCompra.belongsTo(TiendaItem, { foreignKey: "item_id", as: "item" });

module.exports = {
  Cancion,
  Album,
  Artista,
  Genero,
  ArtistaxGenero,
  Usuario,
  Comunidad,
  Mensaje,
  TiendaItem,
  UsuarioCompra,
  sequelize,
  Sequelize: sequelize.Sequelize,
};
