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

    // ==========================
    // ARTISTAS
    // ==========================
    const imgYung = "uploads/images/artworks-wXaB3xVGEq3yz8ey-6eHtAw-t500x500.jpg";
    const imgMisfits = "uploads/images/Misfits_-_Horror_Business_cover.jpg";
    const imgMetal = "uploads/images/ab67616d0000b27381e0d9617e70d75e7ae11fa6.jpg";
    const imgSlipknot = "uploads/images/ab67616d0000b27339a6368dd1efeaea760d1d46.jpg";
    const imgLorem = "uploads/images/lorem-ipsum-sample-text-lettering-comic-design-for-t-shirt-or-poster-R26AMG.jpg";
    const imgGeneric = "uploads/images/WhatsApp Image 2026-07-01 at 01.37.04.jpeg";

    const yungLean = await Artista.create({ nombre: "Yung Lean", imagen: imgYung });
    const misfits = await Artista.create({ nombre: "Misfits", imagen: imgMisfits });
    const metallica = await Artista.create({ nombre: "Metallica", imagen: imgMetal });
    const slipknot = await Artista.create({ nombre: "Slipknot", imagen: imgSlipknot });
    const nirvana = await Artista.create({ nombre: "Nirvana", imagen: imgLorem });
    const radiohead = await Artista.create({ nombre: "Radiohead", imagen: imgGeneric });
    const daftPunk = await Artista.create({ nombre: "Daft Punk", imagen: imgYung });

    await ArtistaxGenero.create({ artista: yungLean.id, genero: hiphop.id });
    await ArtistaxGenero.create({ artista: yungLean.id, genero: indie.id });
    await ArtistaxGenero.create({ artista: misfits.id, genero: punk.id });
    await ArtistaxGenero.create({ artista: misfits.id, genero: rock.id });
    await ArtistaxGenero.create({ artista: metallica.id, genero: metal.id });
    await ArtistaxGenero.create({ artista: metallica.id, genero: rock.id });
    await ArtistaxGenero.create({ artista: slipknot.id, genero: metal.id });
    await ArtistaxGenero.create({ artista: nirvana.id, genero: rock.id });
    await ArtistaxGenero.create({ artista: nirvana.id, genero: alternativo.id });
    await ArtistaxGenero.create({ artista: radiohead.id, genero: alternativo.id });
    await ArtistaxGenero.create({ artista: radiohead.id, genero: rock.id });
    await ArtistaxGenero.create({ artista: daftPunk.id, genero: electronica.id });
    await ArtistaxGenero.create({ artista: daftPunk.id, genero: pop.id });

    // ==========================
    // ÁLBUMES Y CANCIONES
    // ==========================
    const audioAgony = "uploads/audio/Yung Lean - 'Agony'.mp3";
    const audioRedSky = "uploads/audio/Yung Lean - Red Bottom Sky.mp3";
    const audioHorror = "uploads/audio/Horror Business.mp3";
    const audioLofi = "uploads/audio/5 MINUTES OF (No Copyright Music) CHILL LOFI HIP HOP BEAT (Royalty free).mp3";
    const audioDormir = "uploads/audio/MIENTRAS DUERMES.mp3";

    // --- YUNG LEAN - Stranger ---
    const albumStranger = await Album.create({ nombre: "Stranger", imagen: imgYung, artista: yungLean.id });
    await Cancion.create({ nombre: "Agony", archivo: audioAgony, album: albumStranger.id });
    await Cancion.create({ nombre: "Red Bottom Sky", archivo: audioRedSky, album: albumStranger.id });
    await Cancion.create({ nombre: "Miami Ultras", archivo: audioLofi, album: albumStranger.id });
    await Cancion.create({ nombre: "Hurt", archivo: audioDormir, album: albumStranger.id });

    // --- YUNG LEAN - Unknown Death 2002 ---
    const albumDeath = await Album.create({ nombre: "Unknown Death 2002", imagen: imgGeneric, artista: yungLean.id });
    await Cancion.create({ nombre: "Ginseng Strip 2002", archivo: audioLofi, album: albumDeath.id });
    await Cancion.create({ nombre: "Kyoto", archivo: audioDormir, album: albumDeath.id });
    await Cancion.create({ nombre: "Yoshi City", archivo: audioAgony, album: albumDeath.id });

    // --- MISFITS - Horror Business ---
    const albumHorror = await Album.create({ nombre: "Horror Business", imagen: imgMisfits, artista: misfits.id });
    await Cancion.create({ nombre: "Horror Business", archivo: audioHorror, album: albumHorror.id });
    await Cancion.create({ nombre: "Teenagers from Mars", archivo: audioLofi, album: albumHorror.id });
    await Cancion.create({ nombre: "Night of the Living Dead", archivo: audioDormir, album: albumHorror.id });
    await Cancion.create({ nombre: "Where Eagles Dare", archivo: audioAgony, album: albumHorror.id });

    // --- MISFITS - Walk Among Us ---
    const albumWalk = await Album.create({ nombre: "Walk Among Us", imagen: imgLorem, artista: misfits.id });
    await Cancion.create({ nombre: "I Turned Into a Martian", archivo: audioHorror, album: albumWalk.id });
    await Cancion.create({ nombre: "Skulls", archivo: audioLofi, album: albumWalk.id });
    await Cancion.create({ nombre: "Astro Zombies", archivo: audioDormir, album: albumWalk.id });

    // --- METALLICA - Black Album ---
    const albumBlack = await Album.create({ nombre: "Metallica (Black Album)", imagen: imgMetal, artista: metallica.id });
    await Cancion.create({ nombre: "Enter Sandman", archivo: audioLofi, album: albumBlack.id });
    await Cancion.create({ nombre: "Sad But True", archivo: audioDormir, album: albumBlack.id });
    await Cancion.create({ nombre: "The Unforgiven", archivo: audioHorror, album: albumBlack.id });
    await Cancion.create({ nombre: "Wherever I May Roam", archivo: audioAgony, album: albumBlack.id });
    await Cancion.create({ nombre: "Nothing Else Matters", archivo: audioRedSky, album: albumBlack.id });

    // --- METALLICA - Master of Puppets ---
    const albumMaster = await Album.create({ nombre: "Master of Puppets", imagen: imgGeneric, artista: metallica.id });
    await Cancion.create({ nombre: "Battery", archivo: audioLofi, album: albumMaster.id });
    await Cancion.create({ nombre: "Master of Puppets", archivo: audioHorror, album: albumMaster.id });
    await Cancion.create({ nombre: "Welcome Home (Sanitarium)", archivo: audioDormir, album: albumMaster.id });
    await Cancion.create({ nombre: "Orion", archivo: audioAgony, album: albumMaster.id });

    // --- SLIPKNOT - Iowa ---
    const albumIowa = await Album.create({ nombre: "Iowa", imagen: imgSlipknot, artista: slipknot.id });
    await Cancion.create({ nombre: "People = Shit", archivo: audioHorror, album: albumIowa.id });
    await Cancion.create({ nombre: "Left Behind", archivo: audioLofi, album: albumIowa.id });
    await Cancion.create({ nombre: "My Plague", archivo: audioDormir, album: albumIowa.id });
    await Cancion.create({ nombre: "The Heretic Anthem", archivo: audioAgony, album: albumIowa.id });

    // --- SLIPKNOT - Vol. 3 ---
    const albumVol3 = await Album.create({ nombre: "Vol. 3: The Subliminal Verses", imagen: imgLorem, artista: slipknot.id });
    await Cancion.create({ nombre: "Before I Forget", archivo: audioLofi, album: albumVol3.id });
    await Cancion.create({ nombre: "Duality", archivo: audioHorror, album: albumVol3.id });
    await Cancion.create({ nombre: "Vermilion", archivo: audioDormir, album: albumVol3.id });

    // --- NIRVANA - Nevermind ---
    const albumNevermind = await Album.create({ nombre: "Nevermind", imagen: imgLorem, artista: nirvana.id });
    await Cancion.create({ nombre: "Smells Like Teen Spirit", archivo: audioHorror, album: albumNevermind.id });
    await Cancion.create({ nombre: "Come As You Are", archivo: audioLofi, album: albumNevermind.id });
    await Cancion.create({ nombre: "Lithium", archivo: audioDormir, album: albumNevermind.id });
    await Cancion.create({ nombre: "In Bloom", archivo: audioAgony, album: albumNevermind.id });

    // --- NIRVANA - In Utero ---
    const albumUtero = await Album.create({ nombre: "In Utero", imagen: imgGeneric, artista: nirvana.id });
    await Cancion.create({ nombre: "Heart-Shaped Box", archivo: audioRedSky, album: albumUtero.id });
    await Cancion.create({ nombre: "Rape Me", archivo: audioLofi, album: albumUtero.id });
    await Cancion.create({ nombre: "All Apologies", archivo: audioDormir, album: albumUtero.id });

    // --- RADIOHEAD - OK Computer ---
    const albumOK = await Album.create({ nombre: "OK Computer", imagen: imgGeneric, artista: radiohead.id });
    await Cancion.create({ nombre: "Paranoid Android", archivo: audioLofi, album: albumOK.id });
    await Cancion.create({ nombre: "Karma Police", archivo: audioDormir, album: albumOK.id });
    await Cancion.create({ nombre: "No Surprises", archivo: audioAgony, album: albumOK.id });
    await Cancion.create({ nombre: "Exit Music (For a Film)", archivo: audioHorror, album: albumOK.id });

    // --- RADIOHEAD - Kid A ---
    const albumKidA = await Album.create({ nombre: "Kid A", imagen: imgLorem, artista: radiohead.id });
    await Cancion.create({ nombre: "Everything In Its Right Place", archivo: audioDormir, album: albumKidA.id });
    await Cancion.create({ nombre: "Idioteque", archivo: audioLofi, album: albumKidA.id });
    await Cancion.create({ nombre: "How to Disappear Completely", archivo: audioAgony, album: albumKidA.id });

    // --- DAFT PUNK - Discovery ---
    const albumDiscovery = await Album.create({ nombre: "Discovery", imagen: imgYung, artista: daftPunk.id });
    await Cancion.create({ nombre: "One More Time", archivo: audioLofi, album: albumDiscovery.id });
    await Cancion.create({ nombre: "Harder, Better, Faster, Stronger", archivo: audioHorror, album: albumDiscovery.id });
    await Cancion.create({ nombre: "Digital Love", archivo: audioDormir, album: albumDiscovery.id });
    await Cancion.create({ nombre: "Something About Us", archivo: audioAgony, album: albumDiscovery.id });

    // --- DAFT PUNK - Random Access Memories ---
    const albumRAM = await Album.create({ nombre: "Random Access Memories", imagen: imgLorem, artista: daftPunk.id });
    await Cancion.create({ nombre: "Get Lucky", archivo: audioLofi, album: albumRAM.id });
    await Cancion.create({ nombre: "Instant Crush", archivo: audioDormir, album: albumRAM.id });
    await Cancion.create({ nombre: "Lose Yourself to Dance", archivo: audioHorror, album: albumRAM.id });

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
