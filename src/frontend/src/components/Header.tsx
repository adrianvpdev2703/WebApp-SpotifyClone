import { Link } from "react-router-dom";
import { useAppSelector, useAppDispatch } from "../store/hooks";
import { clearUser } from "../store/gamificationSlice";

export const Header = () => {
  const dispatch = useAppDispatch();
  const { id, username, nivel, xp, xpRequerida, racha, puntos, combo } =
    useAppSelector((s) => s.gamification);

  const xpProgress = xpRequerida > 0 ? (xp / xpRequerida) * 100 : 0;

  return (
    <header className="bg-black text-white px-6 py-3 flex justify-between items-center border-b border-zinc-800 sticky top-0 z-50">
      <div className="flex items-center gap-6">
        <Link to="/" className="text-xl font-bold text-green-500 hover:scale-105 transition inline-block">
          Spotify Clone
        </Link>
        <nav className="hidden md:flex items-center gap-4">
          <Link to="/" className="text-gray-300 hover:text-white font-semibold text-sm transition">Inicio</Link>
          <Link to="/ranking" className="text-gray-300 hover:text-white font-semibold text-sm transition">Ranking</Link>
          <Link to="/tienda" className="text-gray-300 hover:text-white font-semibold text-sm transition">Tienda</Link>
          <Link to="/comunidades" className="text-gray-300 hover:text-white font-semibold text-sm transition">Comunidades</Link>
          <Link to="/admin" className="text-gray-300 hover:text-white font-semibold text-sm transition">Admin</Link>
        </nav>
      </div>

      {id ? (
        <div className="flex items-center gap-4">
          {combo > 1 && (
            <div className="hidden sm:flex items-center gap-1 bg-orange-500/20 text-orange-400 px-3 py-1 rounded-full text-xs font-bold border border-orange-500/30">
              <span>🔥</span>
              <span>x{combo}</span>
            </div>
          )}
          <div className="hidden sm:flex items-center gap-2 bg-zinc-900 px-4 py-2 rounded-full border border-zinc-700">
            <div className="flex flex-col">
              <div className="flex items-center gap-3 text-xs">
                <span className="text-green-500 font-bold">Lv.{nivel}</span>
                <span className="text-orange-400">🔥 {racha}d</span>
                <span className="text-yellow-400">💎 {puntos}</span>
              </div>
              <div className="w-32 h-1.5 bg-zinc-700 rounded-full mt-1 overflow-hidden">
                <div className="h-full bg-gradient-to-r from-green-500 to-green-400 rounded-full transition-all duration-500" style={{ width: `${Math.min(xpProgress, 100)}%` }} />
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2 bg-zinc-900 px-3 py-1.5 rounded-full border border-zinc-700">
            <div className="w-7 h-7 bg-green-500 rounded-full flex items-center justify-center text-black font-bold text-xs">
              {username.charAt(0).toUpperCase()}
            </div>
            <span className="text-sm font-bold hidden sm:inline">{username}</span>
          </div>
          <button onClick={() => dispatch(clearUser())} className="text-xs text-red-500 hover:text-red-400 transition">Salir</button>
        </div>
      ) : (
        <Link to="/login" className="bg-white text-black px-5 py-1.5 rounded-full font-bold text-sm hover:scale-105 transition">Iniciar Sesión</Link>
      )}
    </header>
  );
};
