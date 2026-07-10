const {
  sequelize, Artista, Genero, Album, Cancion, ArtistaxGenero, TiendaItem, Usuario, Comunidad, Mensaje,
} = require("../models");

async function poblarBaseDeDatos() {
  try {
    console.log("⏳ Conectando a la base de datos...");
    await sequelize.sync({ force: true });
    console.log("🌱 Plantando datos masivos...");

    // ==========================
    // GÉNEROS
    // ==========================
    const rock = await Genero.create({ nombre: "Rock" });
    const indie = await Genero.create({ nombre: "Indie Pop" });
    const hiphop = await Genero.create({ nombre: "Hip-Hop / Rap" });
    const metal = await Genero.create({ nombre: "Metal" });
    const punk = await Genero.create({ nombre: "Punk" });
    const electronica = await Genero.create({ nombre: "Electrónica" });
    const pop = await Genero.create({ nombre: "Pop" });
    const alternativo = await Genero.create({ nombre: "Alternativo" });
    const corridos = await Genero.create({ nombre: "Corridos Tumbados" });
    const eurodance = await Genero.create({ nombre: "Eurodance" });
    const cloudRap = await Genero.create({ nombre: "Cloud Rap" });
    const horrorPunk = await Genero.create({ nombre: "Horror Punk" });

    // ==========================
    // ARTISTAS (usando imágenes reales de uploads/images)
    // ==========================
    const imgCaramell = "uploads/images/caramelldansen.jpg";
    const imgJuniorH = "uploads/images/juniorH-mientrasDuermes.jpg";
    const imgLorem = "uploads/images/lorem-ipsum.jpg";
    const imgMetallica = "uploads/images/metallica_blackAlbum.jpeg";
    const imgMisfits = "uploads/images/misfits_horrro_bussines.jpg";
    const imgSlipknot = "uploads/images/slipknot_album_1.jpg";
    const imgYungLean = "uploads/images/Yung Lean.jpg";

    const caramell = await Artista.create({ nombre: "Caramell", imagen: imgCaramell });
    const juniorH = await Artista.create({ nombre: "Junior H", imagen: imgJuniorH });
    const misfits = await Artista.create({ nombre: "Misfits", imagen: imgMisfits });
    const metallica = await Artista.create({ nombre: "Metallica", imagen: imgMetallica });
    const slipknot = await Artista.create({ nombre: "Slipknot", imagen: imgSlipknot });
    const yungLean = await Artista.create({ nombre: "Yung Lean", imagen: imgYungLean });
    const artistaGenerico = await Artista.create({ nombre: "Varios Artistas", imagen: imgLorem });

    await ArtistaxGenero.create({ artista: caramell.id, genero: eurodance.id });
    await ArtistaxGenero.create({ artista: caramell.id, genero: pop.id });
    await ArtistaxGenero.create({ artista: juniorH.id, genero: corridos.id });
    await ArtistaxGenero.create({ artista: juniorH.id, genero: hiphop.id });
    await ArtistaxGenero.create({ artista: misfits.id, genero: horrorPunk.id });
    await ArtistaxGenero.create({ artista: misfits.id, genero: punk.id });
    await ArtistaxGenero.create({ artista: misfits.id, genero: rock.id });
    await ArtistaxGenero.create({ artista: metallica.id, genero: metal.id });
    await ArtistaxGenero.create({ artista: metallica.id, genero: rock.id });
    await ArtistaxGenero.create({ artista: slipknot.id, genero: metal.id });
    await ArtistaxGenero.create({ artista: slipknot.id, genero: alternativo.id });
    await ArtistaxGenero.create({ artista: yungLean.id, genero: cloudRap.id });
    await ArtistaxGenero.create({ artista: yungLean.id, genero: hiphop.id });
    await ArtistaxGenero.create({ artista: yungLean.id, genero: indie.id });
    await ArtistaxGenero.create({ artista: artistaGenerico.id, genero: pop.id });
    await ArtistaxGenero.create({ artista: artistaGenerico.id, genero: rock.id });

    // ==========================
    // ÁLBUMES Y CANCIONES (usando solo audio de 10 segundos)
    // ==========================
    const audio10s = "uploads/audio/10 Seconds Timer with Music.mp3";

    // --- CARAMMELL ---
    const albumCaramell = await Album.create({ nombre: "Supergott", imagen: imgCaramell, artista: caramell.id });
    await Cancion.create({ nombre: "Caramelldansen", archivo: audio10s, album: albumCaramell.id, imagen: imgCaramell });
    await Cancion.create({ nombre: "Bumble Bee", archivo: audio10s, album: albumCaramell.id, imagen: imgCaramell });
    await Cancion.create({ nombre: "U-UA-UA", archivo: audio10s, album: albumCaramell.id, imagen: imgCaramell });
    await Cancion.create({ nombre: "Allra Bästa Vänner", archivo: audio10s, album: albumCaramell.id, imagen: imgCaramell });
    await Cancion.create({ nombre: "Boys", archivo: audio10s, album: albumCaramell.id, imagen: imgCaramell });

    // --- JUNIOR H ---
    const albumJuniorH = await Album.create({ nombre: "$ad Boyz 4 Life", imagen: imgJuniorH, artista: juniorH.id });
    await Cancion.create({ nombre: "Mientras Duermes", archivo: audio10s, album: albumJuniorH.id, imagen: imgJuniorH });
    await Cancion.create({ nombre: "El Azul", archivo: audio10s, album: albumJuniorH.id, imagen: imgJuniorH });
    await Cancion.create({ nombre: "Lady Gaga", archivo: audio10s, album: albumJuniorH.id, imagen: imgJuniorH });
    await Cancion.create({ nombre: "Mente Positiva", archivo: audio10s, album: albumJuniorH.id, imagen: imgJuniorH });
    await Cancion.create({ nombre: "Disfruto lo Malo", archivo: audio10s, album: albumJuniorH.id, imagen: imgJuniorH });

    // --- MISFITS ---
    const albumMisfits1 = await Album.create({ nombre: "Horror Business", imagen: imgMisfits, artista: misfits.id });
    await Cancion.create({ nombre: "Horror Business", archivo: audio10s, album: albumMisfits1.id, imagen: imgMisfits });
    await Cancion.create({ nombre: "Teenagers from Mars", archivo: audio10s, album: albumMisfits1.id, imagen: imgMisfits });
    await Cancion.create({ nombre: "Night of the Living Dead", archivo: audio10s, album: albumMisfits1.id, imagen: imgMisfits });
    await Cancion.create({ nombre: "Where Eagles Dare", archivo: audio10s, album: albumMisfits1.id, imagen: imgMisfits });

    const albumMisfits2 = await Album.create({ nombre: "Walk Among Us", imagen: imgLorem, artista: misfits.id });
    await Cancion.create({ nombre: "20 Eyes", archivo: audio10s, album: albumMisfits2.id, imagen: imgLorem });
    await Cancion.create({ nombre: "I Turned Into a Martian", archivo: audio10s, album: albumMisfits2.id, imagen: imgLorem });
    await Cancion.create({ nombre: "Skulls", archivo: audio10s, album: albumMisfits2.id, imagen: imgLorem });
    await Cancion.create({ nombre: "Astro Zombies", archivo: audio10s, album: albumMisfits2.id, imagen: imgLorem });
    await Cancion.create({ nombre: "Mommy, Can I Go Out & Kill Tonight?", archivo: audio10s, album: albumMisfits2.id, imagen: imgLorem });

    // --- METALLICA ---
    const albumMetallica1 = await Album.create({ nombre: "Metallica (Black Album)", imagen: imgMetallica, artista: metallica.id });
    await Cancion.create({ nombre: "Enter Sandman", archivo: audio10s, album: albumMetallica1.id, imagen: imgMetallica });
    await Cancion.create({ nombre: "Sad But True", archivo: audio10s, album: albumMetallica1.id, imagen: imgMetallica });
    await Cancion.create({ nombre: "The Unforgiven", archivo: audio10s, album: albumMetallica1.id, imagen: imgMetallica });
    await Cancion.create({ nombre: "Wherever I May Roam", archivo: audio10s, album: albumMetallica1.id, imagen: imgMetallica });
    await Cancion.create({ nombre: "Nothing Else Matters", archivo: audio10s, album: albumMetallica1.id, imagen: imgMetallica });

    const albumMetallica2 = await Album.create({ nombre: "Master of Puppets", imagen: imgLorem, artista: metallica.id });
    await Cancion.create({ nombre: "Battery", archivo: audio10s, album: albumMetallica2.id, imagen: imgLorem });
    await Cancion.create({ nombre: "Master of Puppets", archivo: audio10s, album: albumMetallica2.id, imagen: imgLorem });
    await Cancion.create({ nombre: "Welcome Home (Sanitarium)", archivo: audio10s, album: albumMetallica2.id, imagen: imgLorem });
    await Cancion.create({ nombre: "Orion", archivo: audio10s, album: albumMetallica2.id, imagen: imgLorem });

    // --- SLIPKNOT ---
    const albumSlipknot1 = await Album.create({ nombre: "Iowa", imagen: imgSlipknot, artista: slipknot.id });
    await Cancion.create({ nombre: "People = Shit", archivo: audio10s, album: albumSlipknot1.id, imagen: imgSlipknot });
    await Cancion.create({ nombre: "Left Behind", archivo: audio10s, album: albumSlipknot1.id, imagen: imgSlipknot });
    await Cancion.create({ nombre: "My Plague", archivo: audio10s, album: albumSlipknot1.id, imagen: imgSlipknot });
    await Cancion.create({ nombre: "The Heretic Anthem", archivo: audio10s, album: albumSlipknot1.id, imagen: imgSlipknot });
    await Cancion.create({ nombre: "Disasterpiece", archivo: audio10s, album: albumSlipknot1.id, imagen: imgSlipknot });

    const albumSlipknot2 = await Album.create({ nombre: "Vol. 3: The Subliminal Verses", imagen: imgLorem, artista: slipknot.id });
    await Cancion.create({ nombre: "Duality", archivo: audio10s, album: albumSlipknot2.id, imagen: imgLorem });
    await Cancion.create({ nombre: "Before I Forget", archivo: audio10s, album: albumSlipknot2.id, imagen: imgLorem });
    await Cancion.create({ nombre: "Vermilion", archivo: audio10s, album: albumSlipknot2.id, imagen: imgLorem });
    await Cancion.create({ nombre: "Psychosocial", archivo: audio10s, album: albumSlipknot2.id, imagen: imgLorem });

    // --- YUNG LEAN ---
    const albumYung1 = await Album.create({ nombre: "Stranger", imagen: imgYungLean, artista: yungLean.id });
    await Cancion.create({ nombre: "Agony", archivo: audio10s, album: albumYung1.id, imagen: imgYungLean });
    await Cancion.create({ nombre: "Red Bottom Sky", archivo: audio10s, album: albumYung1.id, imagen: imgYungLean });
    await Cancion.create({ nombre: "Miami Ultras", archivo: audio10s, album: albumYung1.id, imagen: imgYungLean });
    await Cancion.create({ nombre: "Hurt", archivo: audio10s, album: albumYung1.id, imagen: imgYungLean });

    const albumYung2 = await Album.create({ nombre: "Unknown Death 2002", imagen: imgLorem, artista: yungLean.id });
    await Cancion.create({ nombre: "Ginseng Strip 2002", archivo: audio10s, album: albumYung2.id, imagen: imgLorem });
    await Cancion.create({ nombre: "Kyoto", archivo: audio10s, album: albumYung2.id, imagen: imgLorem });
    await Cancion.create({ nombre: "Yoshi City", archivo: audio10s, album: albumYung2.id, imagen: imgLorem });
    await Cancion.create({ nombre: "Oreomilkshake", archivo: audio10s, album: albumYung2.id, imagen: imgLorem });

    // --- ÁLBUM VARIADO (genérico) ---
    const albumGenerico = await Album.create({ nombre: "Spotify Clone Mix", imagen: imgLorem, artista: artistaGenerico.id });
    await Cancion.create({ nombre: "Test Track 1", archivo: audio10s, album: albumGenerico.id, imagen: imgLorem });
    await Cancion.create({ nombre: "Test Track 2", archivo: audio10s, album: albumGenerico.id, imagen: imgLorem });
    await Cancion.create({ nombre: "Test Track 3", archivo: audio10s, album: albumGenerico.id, imagen: imgLorem });
    await Cancion.create({ nombre: "Test Track 4", archivo: audio10s, album: albumGenerico.id, imagen: imgLorem });
    await Cancion.create({ nombre: "Test Track 5", archivo: audio10s, album: albumGenerico.id, imagen: imgLorem });

    // ==========================
    // TIENDA ITEMS
    // ==========================
    await TiendaItem.create({ nombre: "Cambiar color de usuario", descripcion: "Destaca con un nombre de usuario de color especial", precio: 50, tipo: "cosmetico", icono: "🎨" });
    await TiendaItem.create({ nombre: "Insignia Legendaria", descripcion: "Una insignia exclusiva que muestra tu dedicación", precio: 100, tipo: "insignia", icono: "🏅" });
    await TiendaItem.create({ nombre: "Multiplicador XP x2 (1 hora)", descripcion: "Gana el doble de XP durante 1 hora", precio: 200, tipo: "boost", icono: "⚡" });
    await TiendaItem.create({ nombre: "Título personalizado", descripcion: "Elige un título único que aparecerá en tu perfil", precio: 150, tipo: "titulo", icono: "👑" });
    await TiendaItem.create({ nombre: "Tema oscuro premium", descripcion: "Un tema oscuro aún más elegante para tu reproductor", precio: 75, tipo: "tema", icono: "🌙" });
    await TiendaItem.create({ nombre: "Avatar exclusivo", descripcion: "Un avatar único que solo los verdaderos fans tienen", precio: 300, tipo: "cosmetico", icono: "🖼" });
    await TiendaItem.create({ nombre: "Salto de nivel instantáneo", descripcion: "Sube un nivel al instante", precio: 500, tipo: "boost", icono: "🚀" });

    // ==========================
    // USUARIOS DE PRUEBA
    // ==========================
    const u1 = await Usuario.create({ username: "AdrianTester", email: "adrian@spotifyclone.com", xp_actual: 450, nivel: 5, puntos_tienda: 200, racha_dias: 7 });
    const u2 = await Usuario.create({ username: "GamerPro", email: "gamer@spotifyclone.com", xp_actual: 820, nivel: 8, puntos_tienda: 450, racha_dias: 15 });
    const u3 = await Usuario.create({ username: "Melomano", email: "musica@spotifyclone.com", xp_actual: 120, nivel: 3, puntos_tienda: 80, racha_dias: 3 });
    const u4 = await Usuario.create({ username: "LinuxFan", email: "tux@spotifyclone.com", xp_actual: 1500, nivel: 12, puntos_tienda: 600, racha_dias: 30 });
    const u5 = await Usuario.create({ username: "DevJunior", email: "dev@spotifyclone.com", xp_actual: 60, nivel: 2, puntos_tienda: 30, racha_dias: 1 });
    const u6 = await Usuario.create({ username: "Rockero99", email: "rock@spotifyclone.com", xp_actual: 900, nivel: 9, puntos_tienda: 320, racha_dias: 20 });
    const u7 = await Usuario.create({ username: "MetalHead", email: "metal@spotifyclone.com", xp_actual: 2100, nivel: 15, puntos_tienda: 850, racha_dias: 45 });

    // ==========================
    // COMUNIDADES DE EJEMPLO
    // ==========================
    const com1 = await Comunidad.create({ nombre: "Rockeros Sin Pausa", descripcion: "Solo los que mantienen combos de XP altos", es_privada: false });
    const com2 = await Comunidad.create({ nombre: "Metal Army", descripcion: "Para los amantes del metal más pesado", es_privada: false });
    const com3 = await Comunidad.create({ nombre: "Indie Lovers", descripcion: "Música indie y alternativa", es_privada: false });
    const com4 = await Comunidad.create({ nombre: "Club de la Lucha Lírica", descripcion: "Competiciones semanales de rap", es_privada: true });
    const com5 = await Comunidad.create({ nombre: "Rainbow Connection", descripcion: "Comunidad diversa y amigable", es_privada: false });

    await com1.addMiembros([u1, u2, u3]);
    await com2.addMiembros([u4, u6, u7]);
    await com3.addMiembros([u1, u3, u5, u7]);
    await com4.addMiembros([u2, u4]);
    await com5.addMiembros([u1, u2, u3, u4, u5, u6, u7]);

    await Mensaje.create({ contenido: "¡Bienvenidos al grupo! Aquí compartiremos las mejores canciones.", es_cancion: false, usuario_id: u1.id, comunidad_id: com1.id });
    await Mensaje.create({ contenido: "Escuchen esta rola: Agony - Yung Lean", es_cancion: true, usuario_id: u2.id, comunidad_id: com1.id });
    await Mensaje.create({ contenido: "Buenísima, acabo de ganar 45 XP escuchándola", es_cancion: false, usuario_id: u3.id, comunidad_id: com1.id });
    await Mensaje.create({ contenido: "¿Alguien tiene recomendaciones de metal?", es_cancion: false, usuario_id: u4.id, comunidad_id: com2.id });
    await Mensaje.create({ contenido: "Master of Puppets de Metallica, obra maestra", es_cancion: true, usuario_id: u6.id, comunidad_id: com2.id });
    await Mensaje.create({ contenido: "People = Shit de Slipknot, para desestresarse", es_cancion: true, usuario_id: u7.id, comunidad_id: com2.id });
    await Mensaje.create({ contenido: "Hola a todos! Nueva música indie para compartir", es_cancion: false, usuario_id: u1.id, comunidad_id: com3.id });

    console.log("✅ ¡Base de datos poblada con éxito!");
    console.log(`   - ${await Genero.count()} géneros`);
    console.log(`   - ${await Artista.count()} artistas`);
    console.log(`   - ${await Album.count()} álbumes`);
    console.log(`   - ${await Cancion.count()} canciones`);
    console.log(`   - ${await TiendaItem.count()} items en tienda`);
    console.log(`   - ${await Usuario.count()} usuarios`);
    console.log(`   - ${await Comunidad.count()} comunidades`);
    process.exit(0);
  } catch (error) {
    console.error("❌ Error al poblar:", error);
    process.exit(1);
  }
}

poblarBaseDeDatos();