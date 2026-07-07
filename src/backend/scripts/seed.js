const {
  sequelize,
  Artista,
  Genero,
  Album,
  Cancion,
  ArtistaxGenero,
  TiendaItem,
} = require("../models");

async function poblarBaseDeDatos() {
  try {
    console.log("⏳ Conectando a la base de datos...");

    await sequelize.sync({ alter: true });

    console.log("🌱 Iniciando la plantación de datos...");

    // ==========================
    // GÉNEROS
    // ==========================
    // La tabla Generos solo usa 'nombre' y 'imagen'
    const generoRock = await Genero.create({
      nombre: "Rock",
    });

    const generoIndie = await Genero.create({
      nombre: "Indie Pop",
    });

    const generoHipHop = await Genero.create({
      nombre: "Hip-Hop / Rap",
    });

    // ==========================
    // ARTISTAS
    // ==========================
    // La tabla Artista usa 'nombre' e 'imagen'
    const artistaYung = await Artista.create({
      nombre: "Yung Lean",
      imagen: "uploads/images/artworks-wXaB3xVGEq3yz8ey-6eHtAw-t500x500.jpg",
    });

    const artistaMisfits = await Artista.create({
      nombre: "Misfits",
      imagen: "uploads/images/Misfits_-_Horror_Business_cover.jpg",
    });

    // ==========================
    // RELACIONES ARTISTA-GÉNERO
    // ==========================
    // Las columnas de clave foránea son 'artista' y 'genero' (no _id)
    await ArtistaxGenero.create({
      artista: artistaYung.id,
      genero: generoHipHop.id,
    });

    await ArtistaxGenero.create({
      artista: artistaYung.id,
      genero: generoIndie.id,
    });

    await ArtistaxGenero.create({
      artista: artistaMisfits.id,
      genero: generoRock.id,
    });

    // ==========================
    // ÁLBUMES
    // ==========================
    // La tabla Albums usa 'nombre', 'imagen' y la clave 'artista'
    const albumStranger = await Album.create({
      nombre: "Stranger",
      imagen: "uploads/images/artworks-wXaB3xVGEq3yz8ey-6eHtAw-t500x500.jpg",
      artista: artistaYung.id,
    });

    const albumHorrorBusiness = await Album.create({
      nombre: "Horror Business",
      imagen: "uploads/images/Misfits_-_Horror_Business_cover.jpg",
      artista: artistaMisfits.id,
    });

    // ==========================
    // CANCIONES
    // ==========================
    // La tabla Cancions usa 'nombre', 'archivo', 'imagen' y la clave 'album'
    await Cancion.create({
      nombre: "Agony",
      archivo: "uploads/audio/Yung Lean - 'Agony'.mp3",
      album: albumStranger.id,
    });

    await Cancion.create({
      nombre: "Red Bottom Sky",
      archivo: "uploads/audio/Yung Lean - Red Bottom Sky.mp3",
      album: albumStranger.id,
    });

    await Cancion.create({
      nombre: "Horror Business",
      archivo: "uploads/audio/Horror Business.mp3",
      album: albumHorrorBusiness.id,
    });

    // ==========================
    // TIENDA ITEMS
    // ==========================
    await TiendaItem.create({ nombre: "Cambiar color de usuario", descripcion: "Destaca con un nombre de usuario de color especial", precio: 50, tipo: "cosmetico", icono: "🎨" });
    await TiendaItem.create({ nombre: "Insignia Legendaria", descripcion: "Una insignia exclusiva que muestra tu dedicación", precio: 100, tipo: "insignia", icono: "🏅" });
    await TiendaItem.create({ nombre: "Multiplicador XP x2 (1 hora)", descripcion: "Gana el doble de XP durante 1 hora", precio: 200, tipo: "boost", icono: "⚡" });
    await TiendaItem.create({ nombre: "Título personalizado", descripcion: "Elige un título único que aparecerá en tu perfil", precio: 150, tipo: "titulo", icono: "👑" });
    await TiendaItem.create({ nombre: "Tema oscuro premium", descripcion: "Un tema oscuro aún más elegante para tu reproductor", precio: 75, tipo: "tema", icono: "🌙" });

    console.log("✅ ¡Base de datos poblada con éxito!");
    process.exit(0);
  } catch (error) {
    console.error("❌ Error al poblar la base de datos:", error);
    process.exit(1);
  }
}

poblarBaseDeDatos();
