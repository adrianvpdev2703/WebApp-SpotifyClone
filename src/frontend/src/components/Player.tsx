import { useRef, useState, useEffect, useCallback } from "react";
import { useGamificationStore } from "../store/userGamificationStore";

export const Player = () => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [showXpGained, setShowXpGained] = useState(false);
  const [lastXpGained, setLastXpGained] = useState(0);

  const userId = useGamificationStore((state) => state.id);
  const updateUser = useGamificationStore((state) => state.updateUser);
  const currentSong = useGamificationStore((state) => state.currentSong);
  const addNotification = useGamificationStore((state) => state.addNotification);

  useEffect(() => {
    if (currentSong && audioRef.current) {
      audioRef.current.play().catch(() => {});
      setIsPlaying(true);
      setProgress(0);
    }
  }, [currentSong]);

  const togglePlay = () => {
    if (audioRef.current && currentSong) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play().catch(() => {});
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleTimeUpdate = () => {
    if (audioRef.current && currentSong) {
      setProgress((audioRef.current.currentTime / audioRef.current.duration) * 100);
    }
  };

  const handleSongEnd = useCallback(async () => {
    setIsPlaying(false);
    setProgress(0);

    if (!userId || !currentSong) return;

    try {
      const response = await fetch(
        "http://localhost:3000/usuarios/registrarCancionEscuchada",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: userId, sinPausasNiSaltos: true }),
        },
      );

      if (response.ok) {
        const data = await response.json();
        if (data.usuario) {
          const oldCombo = useGamificationStore.getState().combo;
          updateUser(data.usuario);

          setLastXpGained(data.xpGanada || 0);
          setShowXpGained(true);
          setTimeout(() => setShowXpGained(false), 3000);

          if (data.subioNivel) {
            addNotification({
              id: `levelup-${Date.now()}`,
              type: "levelup",
              message: `¡Subiste al nivel ${data.usuario.nivel}!`,
              value: `+50 puntos de tienda`,
            });
          }

          const newCombo = data.usuario.combo_actual || 0;
          if (newCombo > 1 && newCombo > oldCombo) {
            addNotification({
              id: `combo-${Date.now()}`,
              type: "combo",
              message: `¡Combo x${newCombo}!`,
              value: `Sigue escuchando sin saltar`,
            });
          }

          addNotification({
            id: `xp-${Date.now()}`,
            type: "xp",
            message: `+${data.xpGanada || 0} XP`,
            value: `Canción completada`,
          });
        }
      }
    } catch (error) {
      console.error("Error al registrar XP:", error);
    }
  }, [userId, currentSong, updateUser, addNotification]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.addEventListener("ended", handleSongEnd);
    return () => audio.removeEventListener("ended", handleSongEnd);
  }, [handleSongEnd]);

  const skipNext = () => {
  };

  const skipPrev = () => {
  };

  if (!currentSong) {
    return (
      <div className="fixed bottom-0 w-full bg-zinc-900 border-t border-zinc-800 p-4 flex justify-center text-gray-500 z-50 text-sm">
        <span className="flex items-center gap-2">
          <span>🎵</span>
          Selecciona una canción para empezar a escuchar
        </span>
      </div>
    );
  }

  const artista = currentSong.albumData?.artistaData?.nombre || "Artista desconocido";
  const albumArt = currentSong.imagen || currentSong.albumData?.imagen;

  return (
    <div className="fixed bottom-0 w-full bg-zinc-900 border-t border-zinc-800 z-50">
      <div className="h-1 bg-zinc-800">
        <div
          className="h-full bg-green-500 transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>

      <div className="flex items-center justify-between px-4 py-3">
        <div className="flex items-center gap-3 w-[30%] min-w-0">
          <div className="w-12 h-12 rounded overflow-hidden flex-shrink-0 shadow-lg">
            {albumArt ? (
              <img
                src={`http://localhost:3000/${albumArt}`}
                alt={currentSong.nombre}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-green-600 to-zinc-700 flex items-center justify-center text-xl">
                🎵
              </div>
            )}
          </div>
          <div className="min-w-0">
            <h4 className="text-white font-bold text-sm truncate">{currentSong.nombre}</h4>
            <p className="text-xs text-gray-400 truncate">{artista}</p>
          </div>
          {showXpGained && (
            <div className="ml-2 bg-green-500/20 text-green-400 text-xs font-bold px-2 py-1 rounded-full animate-pulse whitespace-nowrap">
              +{lastXpGained} XP
            </div>
          )}
        </div>

        <div className="flex items-center gap-4">
          <button onClick={skipPrev} className="text-gray-400 hover:text-white transition text-lg">
            ⏮
          </button>
          <button
            onClick={togglePlay}
            className="bg-white text-black w-9 h-9 rounded-full flex items-center justify-center hover:scale-105 transition shadow-lg"
          >
            {isPlaying ? "⏸" : "▶"}
          </button>
          <button onClick={skipNext} className="text-gray-400 hover:text-white transition text-lg">
            ⏭
          </button>
        </div>

        <div className="w-[30%] flex justify-end items-center gap-3">
          {useGamificationStore.getState().combo > 0 && (
            <div className="hidden md:flex items-center gap-1 bg-orange-500/20 text-orange-400 px-2 py-1 rounded text-xs font-bold border border-orange-500/30">
              <span>🔥</span>
              <span>x{useGamificationStore.getState().combo}</span>
            </div>
          )}
          <audio
            ref={audioRef}
            src={`http://localhost:3000/${currentSong.archivo}`}
            onTimeUpdate={handleTimeUpdate}
          />
        </div>
      </div>
    </div>
  );
};
