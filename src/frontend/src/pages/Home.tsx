import { useEffect, useState } from "react";
import { useGamificationStore, Song } from "../store/userGamificationStore";

export const Home = () => {
  const [canciones, setCanciones] = useState<Song[]>([]);
  const [loading, setLoading] = useState(true);
  const setCurrentSong = useGamificationStore((state) => state.setCurrentSong);
  const currentSong = useGamificationStore((state) => state.currentSong);

  useEffect(() => {
    const fetchCanciones = async () => {
      try {
        const res = await fetch("http://localhost:3000/canciones");
        if (res.ok) {
          const data = await res.json();
          setCanciones(data);
        }
      } catch (error) {
        console.error("Error cargando canciones:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchCanciones();
  }, []);

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-4xl font-bold">Buenas tardes</h1>
          <p className="text-gray-400 mt-1">Descubre nuevas canciones</p>
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="bg-zinc-800/50 rounded-lg p-4 animate-pulse">
              <div className="aspect-square bg-zinc-700 rounded-lg mb-4" />
              <div className="h-4 bg-zinc-700 rounded w-3/4 mb-2" />
              <div className="h-3 bg-zinc-700 rounded w-1/2" />
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {canciones.map((cancion) => {
            const isActive = currentSong?.id === cancion.id;
            const albumArt = cancion.imagen || cancion.albumData?.imagen;
            const artista = cancion.albumData?.artistaData?.nombre || "Artista desconocido";

            return (
              <div
                key={cancion.id}
                onClick={() => setCurrentSong(cancion)}
                className={`group bg-zinc-800/40 hover:bg-zinc-700/40 p-4 rounded-lg cursor-pointer transition-all duration-300 border ${isActive ? "border-green-500/50 bg-zinc-700/60" : "border-transparent hover:border-zinc-700"}`}
              >
                <div className="relative mb-4">
                  <div className="aspect-square rounded-lg overflow-hidden shadow-lg">
                    {albumArt ? (
                      <img
                        src={`http://localhost:3000/${albumArt}`}
                        alt={cancion.nombre}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-green-600 to-zinc-800 flex items-center justify-center">
                        <span className="text-5xl">🎵</span>
                      </div>
                    )}
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setCurrentSong(cancion);
                    }}
                    className="absolute bottom-2 right-2 w-12 h-12 bg-green-500 rounded-full flex items-center justify-center shadow-xl opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300 hover:scale-105"
                  >
                    <span className="text-black text-xl ml-0.5">
                      {isActive ? "▶" : "▶"}
                    </span>
                  </button>
                </div>

                <h3 className="font-bold text-white truncate">{cancion.nombre}</h3>
                <p className="text-sm text-gray-400 truncate mt-1">{artista}</p>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
