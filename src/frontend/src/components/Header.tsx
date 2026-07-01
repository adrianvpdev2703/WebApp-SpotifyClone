// src/components/Header.tsx
import { useGamificationStore } from "../store/userGamificationStore"; // <-- Cambio a @/ y el nombre correcto del archivo

export const Header = () => {
  const user = useGamificationStore();

  return (
    <header className="bg-black text-white p-4 flex justify-between items-center border-b border-zinc-800">
      <div className="text-xl font-bold">Spotify Clone</div>

      {user.id ? (
        <div className="flex items-center gap-4 bg-zinc-900 px-4 py-2 rounded-full text-sm">
          <span className="text-green-500 font-bold">Nivel {user.nivel}</span>
          <div className="text-orange-500">🔥 {user.racha}</div>
          <div className="text-yellow-400">💎 {user.puntos}</div>
          <span className="font-bold">{user.username}</span>
        </div>
      ) : (
        <button className="bg-white text-black px-4 py-1 rounded-full font-bold">
          Iniciar Sesión
        </button>
      )}
    </header>
  );
};
