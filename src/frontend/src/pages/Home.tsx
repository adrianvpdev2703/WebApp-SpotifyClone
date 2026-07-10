import { useEffect, useState } from "react";
import { useAppSelector, useAppDispatch } from "../store/hooks";
import { Song, setCurrentSong, setQueue } from "../store/gamificationSlice";

interface Album {
  id: number;
  nombre: string;
  imagen?: string;
  artista?: number;
  canciones?: Song[];
  artistaData?: { id: number; nombre: string };
}

export const Home = () => {
  const dispatch = useAppDispatch();
  const currentSong = useAppSelector((s) => s.gamification.currentSong);
  const userId = useAppSelector((s) => s.gamification.id);

  const [canciones, setCanciones] = useState<Song[]>([]);
  const [albumes, setAlbumes] = useState<Album[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedAlbum, setSelectedAlbum] = useState<Album | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [sRes, aRes] = await Promise.all([
          fetch("http://localhost:3006/canciones"),
          fetch("http://localhost:3006/albumes"),
        ]);
        if (sRes.ok) {
          const songsData = await sRes.json();
          setCanciones(songsData);
        }
        if (aRes.ok) {
          const albumsData = await aRes.json();
          const albumsWithSongs = await Promise.all(
            albumsData.map(async (album: Album) => {
              const songRes = await fetch(`http://localhost:3006/canciones/search`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ album: album.id }),
              });
              const songs = songRes.ok ? await songRes.json() : [];
              return { ...album, canciones: songs };
            })
          );
          setAlbumes(albumsWithSongs);
        }
      } catch (error) {
        console.error("Error cargando datos:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const playSong = (song: Song) => {
    dispatch(setCurrentSong(song));
    if (!userId) return;
  };

  const playAlbumSongs = (album: Album) => {
    if (!album.canciones || album.canciones.length === 0) return;
    const songs = album.canciones;
    dispatch(setQueue(songs.map((s) => ({ song: s }))));
    dispatch(setCurrentSong(songs[0]));
    setSelectedAlbum(album);
  };

  const playAllShuffled = () => {
    if (canciones.length === 0) return;
    const shuffled = [...canciones].sort(() => Math.random() - 0.5);
    dispatch(setQueue(shuffled.map((s) => ({ song: s, shuffled: true }))));
    dispatch(setCurrentSong(shuffled[0]));
    setSelectedAlbum(null);
  };

  return (
    <div className="animate-fade-in">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-4xl font-bold gradient-text">Buenas tardes</h1>
          <p className="text-gray-400 mt-1">Descubre nuevas canciones</p>
        </div>
        {userId && canciones.length > 0 && (
          <button
            onClick={playAllShuffled}
            className="glass-strong px-4 py-2 rounded-full text-sm font-bold border border-zinc-700/50 hover:border-green-500/30 transition-all duration-300 flex items-center gap-2 hover:scale-105"
          >
            <span>🔀</span>
            Reproducir aleatorio
          </button>
        )}
      </div>

      {loading ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="glass rounded-xl p-4 animate-pulse">
              <div className="aspect-square bg-zinc-700/50 rounded-lg mb-4" />
              <div className="h-4 bg-zinc-700/50 rounded w-3/4 mb-2" />
              <div className="h-3 bg-zinc-700/50 rounded w-1/2" />
            </div>
          ))}
        </div>
      ) : (
        <>
          {/* Álbumes destacados */}
          {!selectedAlbum && (
            <section className="mb-10 animate-slide-up">
              <h2 className="text-2xl font-bold mb-4 gradient-text">Álbumes destacados</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                {albumes.map((album, index) => (
                  <div
                    key={album.id}
                    onClick={() => playAlbumSongs(album)}
                    className="group glass card-hover rounded-xl p-4 cursor-pointer animate-slide-up"
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    <div className="relative mb-4">
                      <div className="aspect-square rounded-lg overflow-hidden shadow-xl">
                        {album.imagen ? (
                          <img src={`http://localhost:3006/${album.imagen}`} alt={album.nombre} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                        ) : (
                          <div className="w-full h-full bg-gradient-to-br from-green-600 to-zinc-800 flex items-center justify-center">
                            <span className="text-5xl">💿</span>
                          </div>
                        )}
                      </div>
                      <div className="absolute bottom-2 right-2 w-12 h-12 bg-green-500 rounded-full flex items-center justify-center shadow-xl opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300 hover:scale-105">
                        <span className="text-black text-lg ml-0.5">▶</span>
                      </div>
                    </div>
                    <h3 className="font-bold text-white truncate">{album.nombre}</h3>
                    <p className="text-xs text-gray-400 mt-1">{album.canciones?.length || 0} canciones</p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Vista de canciones del álbum seleccionado */}
          {selectedAlbum && selectedAlbum.canciones && (
            <section className="mb-10 animate-slide-up">
              <div className="flex items-center gap-4 mb-6">
                <button onClick={() => setSelectedAlbum(null)} className="text-gray-400 hover:text-white transition text-lg">←</button>
                <h2 className="text-2xl font-bold gradient-text">{selectedAlbum.nombre}</h2>
                <button
                  onClick={() => playAlbumSongs(selectedAlbum!)}
                  className="btn-primary text-sm"
                >
                  Reproducir álbum
                </button>
              </div>
              <div className="space-y-1 glass-strong rounded-xl p-2">
                {selectedAlbum.canciones.map((song, idx) => {
                  const isActive = currentSong?.id === song.id;
                  return (
                    <div
                      key={song.id}
                      onClick={() => playSong(song)}
                      className={`flex items-center gap-4 p-3 rounded-lg cursor-pointer transition-all duration-300 group ${
                        isActive
                          ? "bg-green-500/10 border border-green-500/30"
                          : "hover:bg-zinc-800/50"
                      }`}
                    >
                      <span className="text-gray-500 w-6 text-center text-sm">{idx + 1}</span>
                      <div className="w-10 h-10 rounded overflow-hidden flex-shrink-0">
                        {(song.imagen || selectedAlbum.imagen) ? (
                          <img src={`http://localhost:3006/${song.imagen || selectedAlbum.imagen}`} alt="" className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full bg-zinc-700 flex items-center justify-center text-sm">🎵</div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className={`font-bold text-sm truncate ${isActive ? "text-green-400" : "text-white"}`}>{song.nombre}</p>
                        <p className="text-xs text-gray-400 truncate">{ song.albumData?.artistaData?.nombre || "" }</p>
                      </div>
                      <span className="text-xs text-gray-500 opacity-0 group-hover:opacity-100 transition">▶</span>
                    </div>
                  );
                })}
              </div>
            </section>
          )}

          {/* Todas las canciones */}
          {!selectedAlbum && (
            <section className="animate-slide-up">
              <h2 className="text-2xl font-bold mb-4 gradient-text">Todas las canciones</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                {canciones.map((cancion, index) => {
                  const isActive = currentSong?.id === cancion.id;
                  const albumArt = cancion.imagen || cancion.albumData?.imagen;
                  const artista = cancion.albumData?.artistaData?.nombre || "Artista desconocido";
                  return (
                    <div
                      key={cancion.id}
                      onClick={() => playSong(cancion)}
                      className={`group glass card-hover rounded-xl p-4 cursor-pointer animate-slide-up ${isActive ? "border-green-500/50 bg-zinc-700/60" : "border-transparent hover:border-zinc-700"}`}
                      style={{ animationDelay: `${index * 30}ms` }}
                    >
                      <div className="relative mb-4">
                        <div className="aspect-square rounded-lg overflow-hidden shadow-xl">
                          {albumArt ? (
                            <img src={`http://localhost:3006/${albumArt}`} alt={cancion.nombre} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                          ) : (
                            <div className="w-full h-full bg-gradient-to-br from-green-600 to-zinc-800 flex items-center justify-center">
                              <span className="text-5xl">🎵</span>
                            </div>
                          )}
                        </div>
                        <button
                          onClick={(e) => { e.stopPropagation(); playSong(cancion); }}
                          className="absolute bottom-2 right-2 w-12 h-12 bg-green-500 rounded-full flex items-center justify-center shadow-xl opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300 hover:scale-105"
                        >
                          <span className="text-black text-xl ml-0.5">▶</span>
                        </button>
                      </div>
                      <h3 className="font-bold text-white truncate">{cancion.nombre}</h3>
                      <p className="text-sm text-gray-400 truncate mt-1">{artista}</p>
                    </div>
                  );
                })}
              </div>
            </section>
          )}
        </>
      )}
    </div>
  );
};