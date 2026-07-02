import { useRef, useState } from "react";
import { useGamificationStore } from "../store/userGamificationStore";

export const Player = () => {
  // Referencia al elemento <audio> de HTML
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  // Obtenemos el ID del usuario actual y la función para actualizar sus stats
  const userId = useGamificationStore((state) => state.id);
  const updateUser = useGamificationStore((state) => state.updateUser);

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  // Esta es la función clave para tu proyecto de grado
  const handleSongEnd = async () => {
    setIsPlaying(false);

    if (!userId) {
      console.log("No hay usuario logueado. No se otorga XP.");
      return;
    }

    try {
      // Llamamos a tu backend exactamente como lo hacías en Postman
      const response = await fetch(
        "http://localhost:3000/usuarios/registrarCancionEscuchada",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            id: userId,
            sinPausasNiSaltos: true, // Asumimos que la escuchó completa
          }),
        },
      );

      if (response.ok) {
        const data = await response.json();
        // data.usuario contiene los stats actualizados desde la base de datos
        if (data.usuario) {
          updateUser(data.usuario);
        }
        console.log("¡XP obtenida!", data.mensaje);
      }
    } catch (error) {
      console.error("Error al registrar la canción en el backend:", error);
    }
  };

  return (
    <div className="fixed bottom-0 w-full bg-zinc-900 border-t border-zinc-800 p-4 flex flex-col items-center z-50">
      {/* Controles de reproducción */}
      <div className="flex gap-6 items-center mb-2">
        <button className="text-gray-400 hover:text-white transition">
          ⏮
        </button>

        <button
          onClick={togglePlay}
          className="bg-white text-black w-10 h-10 rounded-full flex items-center justify-center hover:scale-105 transition shadow-lg"
        >
          {isPlaying ? "⏸" : "▶"}
        </button>

        <button className="text-gray-400 hover:text-white transition">
          ⏭
        </button>
      </div>

      {/* Barra de progreso visual (estática por ahora) */}
      <div className="w-1/3 flex items-center gap-2 text-xs text-gray-400">
        <span>0:00</span>
        <div className="h-1 flex-1 bg-zinc-700 rounded-full overflow-hidden">
          <div className="h-full bg-white w-0"></div>{" "}
          {/* Aquí luego animaremos el ancho */}
        </div>
        <span>3:45</span>
      </div>

      {/* Elemento de audio real (oculto) */}
      <audio
        ref={audioRef}
        /* Usamos el archivo que vi en tus carpetas del backend para probar */
        src="http://localhost:3000/uploads/audio/Yung Lean - 'Agony' (Official Audio).mp3"
        onEnded={handleSongEnd}
      />
    </div>
  );
};
