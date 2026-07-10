import { useRef, useState, useEffect, useCallback } from "react";
import { useAppSelector, useAppDispatch } from "../store/hooks";
import { store } from "../store";
import { updateUser, addNotification, nextInQueue } from "../store/gamificationSlice";

export const Player = () => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [showXpGained, setShowXpGained] = useState(false);
  const [lastXpGained, setLastXpGained] = useState(0);
  const [showLevelUp, setShowLevelUp] = useState(false);
  const [levelUpValue, setLevelUpValue] = useState(0);
  const wasPausedRef = useRef(false);

  const dispatch = useAppDispatch();
  const { id: userId, currentSong, queue, queueIndex, isShuffled, combo } =
    useAppSelector((s) => s.gamification);

  useEffect(() => {
    if (currentSong && audioRef.current) {
      audioRef.current.currentTime = 0;
      audioRef.current.play().catch(() => {});
      setIsPlaying(true);
      setProgress(0);
      wasPausedRef.current = false;
    }
  }, [currentSong]);

  const togglePlay = () => {
    if (audioRef.current && currentSong) {
      if (isPlaying) {
        audioRef.current.pause();
        wasPausedRef.current = true;
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

  const handleNext = () => {
    wasPausedRef.current = true;
    dispatch(nextInQueue());
  };

  const handleSongEnd = useCallback(async () => {
    setIsPlaying(false);
    setProgress(0);

    if (!userId || !currentSong) return;

    const songId = currentSong.id;
    const sinPausasNiSaltos = !wasPausedRef.current;

    try {
      const response = await fetch(
        "http://localhost:3006/usuarios/registrarCancionEscuchada",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: userId, sinPausasNiSaltos }),
        },
      );

      if (response.ok) {
        const data = await response.json();
        if (data.usuario) {
          const state = store.getState().gamification;
          const oldCombo = state.combo;
          dispatch(updateUser(data.usuario));

          setLastXpGained(data.xpGanada || 0);
          setShowXpGained(true);
          setTimeout(() => setShowXpGained(false), 3000);

          if (data.subioNivel) {
            setLevelUpValue(data.usuario.nivel);
            setShowLevelUp(true);
            setTimeout(() => setShowLevelUp(false), 4000);
            dispatch(addNotification({
              id: `levelup-${Date.now()}`,
              type: "levelup",
              message: `¡Subiste al nivel ${data.usuario.nivel}!`,
              value: "+50 puntos de tienda",
            }));
          }

          const newCombo = data.usuario.combo_actual || 0;
          if (newCombo > 1 && newCombo > oldCombo) {
            dispatch(addNotification({
              id: `combo-${Date.now()}`,
              type: "combo",
              message: `¡Combo x${newCombo}!`,
              value: "Sigue escuchando sin saltar",
            }));
          }

          dispatch(addNotification({
            id: `xp-${Date.now()}`,
            type: "xp",
            message: `+${data.xpGanada || 0} XP`,
            value: "Canción completada",
          }));
        }
      }
    } catch (error) {
      console.error("Error al registrar XP:", error);
    }

    // Only auto-advance if we're still on the same song (not manually skipped)
    const newState = store.getState().gamification;
    if (newState.currentSong?.id === songId) {
      if (newState.queue.length > 0 && newState.queueIndex < newState.queue.length - 1) {
        dispatch(nextInQueue());
      }
    }
  }, [userId, currentSong, dispatch]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.addEventListener("ended", handleSongEnd);
    return () => audio.removeEventListener("ended", handleSongEnd);
  }, [handleSongEnd]);

  if (!currentSong) {
    return (
      <div className="fixed bottom-0 w-full bg-zinc-900/80 backdrop-blur-sm border-t border-zinc-800 p-4 flex justify-center text-gray-500 z-50 text-sm">
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
    <div className="fixed bottom-0 w-full bg-zinc-950/95 backdrop-blur-md border-t border-zinc-800 z-50">
      <div className="h-1.5 bg-zinc-800 relative overflow-hidden">
        <div 
          className="h-full bg-gradient-to-r from-green-500 via-green-400 to-emerald-500 transition-all duration-300 ease-out relative"
          style={{ width: `${progress}%` }}
        >
          <div className="absolute right-0 top-0 w-2 h-full bg-white/30" />
        </div>
      </div>

      <div className="flex items-center justify-between px-4 py-3 gap-4">
        <div className="flex items-center gap-3 w-[30%] min-w-0">
          <div className="w-12 h-12 rounded-lg overflow-hidden flex-shrink-0 shadow-xl border border-zinc-700">
            {albumArt ? (
              <img src={`http://localhost:3006/${albumArt}`} alt={currentSong.nombre} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-green-600 to-zinc-700 flex items-center justify-center text-xl">🎵</div>
            )}
          </div>
          <div className="min-w-0">
            <h4 className="text-white font-bold text-sm truncate">{currentSong.nombre}</h4>
            <p className="text-xs text-gray-400 truncate">{artista}</p>
            {queue.length > 1 && (
              <p className="text-xs text-gray-500">{queueIndex + 1} / {queue.length}</p>
            )}
          </div>
          {combo > 1 && (
            <div className="flex items-center gap-1 bg-orange-500/20 text-orange-400 px-2 py-0.5 rounded-full text-xs font-bold border border-orange-500/30 whitespace-nowrap">
              <span>🔥</span>
              <span>Combo x{combo}</span>
            </div>
          )}
          {showXpGained && (
            <div className="ml-2 bg-green-500/20 text-green-400 text-xs font-bold px-3 py-1 rounded-full animate-pulse whitespace-nowrap flex items-center gap-1">
              <span className="animate-bounce">⚡</span>
              +{lastXpGained} XP
            </div>
          )}
          {showLevelUp && (
            <div className="ml-2 bg-yellow-500/20 text-yellow-400 text-xs font-bold px-3 py-1 rounded-full animate-pulse whitespace-nowrap flex items-center gap-1 border border-yellow-500/30">
              <span className="animate-bounce">⬆</span>
              ¡Nivel {levelUpValue}!
            </div>
          )}
        </div>

        <div className="flex items-center gap-4">
          <button className="text-gray-400 hover:text-white transition text-lg opacity-50">⏮</button>
          <button onClick={togglePlay} className="bg-white text-black w-10 h-10 rounded-full flex items-center justify-center hover:scale-105 transition shadow-xl shadow-green-500/20">
            {isPlaying ? "⏸" : "▶"}
          </button>
          <button onClick={handleNext} className="text-gray-400 hover:text-white transition text-lg">⏭</button>
        </div>

        <div className="w-[30%] flex justify-end items-center gap-3">
          {isShuffled && <span className="text-xs text-green-400 font-bold flex items-center gap-1">🔀 Aleatorio</span>}
          <audio ref={audioRef} src={`http://localhost:3006/${currentSong.archivo}`} onTimeUpdate={handleTimeUpdate} />
        </div>
      </div>
    </div>
  );
};