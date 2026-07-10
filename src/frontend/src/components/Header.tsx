import { Link } from "react-router-dom";
import { useAppSelector, useAppDispatch } from "../store/hooks";
import { clearUser } from "../store/gamificationSlice";
import { useEffect, useRef, useState } from "react";

export const Header = () => {
  const dispatch = useAppDispatch();
  const { id, username, nivel, xp, xpRequerida, racha, puntos, combo } =
    useAppSelector((s) => s.gamification);

  const xpProgress = xpRequerida > 0 ? (xp / xpRequerida) * 100 : 0;

  const prevXpRef = useRef(xp);
  const prevPuntosRef = useRef(puntos);
  const [xpPulse, setXpPulse] = useState(false);
  const [puntosPulse, setPuntosPulse] = useState(false);

  useEffect(() => {
    if (prevXpRef.current !== xp && xp > prevXpRef.current) {
      setXpPulse(true);
      setTimeout(() => setXpPulse(false), 600);
    }
    prevXpRef.current = xp;
  }, [xp]);

  useEffect(() => {
    if (prevPuntosRef.current !== puntos && puntos > prevPuntosRef.current) {
      setPuntosPulse(true);
      setTimeout(() => setPuntosPulse(false), 600);
    }
    prevPuntosRef.current = puntos;
  }, [puntos]);

  return (
    <header className="bg-black/80 backdrop-blur-md text-white px-6 py-3 flex justify-between items-center border-b border-zinc-800 sticky top-0 z-50">
      <div className="flex items-center gap-6">
        <Link to="/" className="flex items-center gap-2 text-xl font-bold text-green-500 hover:scale-105 transition inline-block">
          <img src="/spotify.png" alt="Spotify" className="w-8 h-8 drop-shadow-lg" />
          <span className="bg-gradient-to-r from-green-400 to-green-600 bg-clip-text text-transparent">Spotify Clone</span>
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
            <div className="hidden sm:flex items-center gap-1 bg-orange-500/20 text-orange-400 px-3 py-1 rounded-full text-xs font-bold border border-orange-500/30 animate-pulse">
              <span>🔥</span>
              <span>Combo x{combo}</span>
            </div>
          )}
          <div className={`hidden sm:flex items-center gap-2 bg-zinc-900/50 px-4 py-2 rounded-full border border-zinc-700/50 backdrop-blur-sm ${xpPulse ? 'animate-pulse ring-2 ring-green-500/50' : ''}`}>
            <div className="flex flex-col">
              <div className="flex items-center gap-3 text-xs">
                <span className="text-green-500 font-bold">Lv.{nivel}</span>
                <span className="text-orange-400 flex items-center gap-1">
                  <span className="animate-bounce">📅</span>
                  <span>{racha}d racha</span>
                </span>
                <span className={`text-yellow-400 flex items-center gap-1 font-bold ${puntosPulse ? 'animate-bounce' : ''}`}>
                  <span>💎</span>
                  <span>{puntos}</span>
                </span>
              </div>
              <div className="w-32 h-1.5 bg-zinc-700 rounded-full mt-1 overflow-hidden relative">
                <div 
                  className="h-full bg-gradient-to-r from-green-500 to-green-400 rounded-full transition-all duration-500 ease-out"
                  style={{ width: `${Math.min(xpProgress, 100)}%` }}
                />
                {xpPulse && (
                  <div className="absolute inset-0 bg-gradient-to-r from-green-300 to-transparent animate-ping opacity-50" />
                )}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2 bg-zinc-900/50 px-3 py-1.5 rounded-full border border-zinc-700/50 backdrop-blur-sm">
            <div className="w-7 h-7 bg-gradient-to-br from-green-500 to-green-700 rounded-full flex items-center justify-center text-black font-bold text-xs">
              {username.charAt(0).toUpperCase()}
            </div>
            <span className="text-sm font-bold hidden sm:inline">{username}</span>
          </div>
          <button onClick={() => dispatch(clearUser())} className="text-xs text-red-500 hover:text-red-400 transition px-2 py-1 rounded hover:bg-red-500/10">Salir</button>
        </div>
      ) : (
        <Link to="/login" className="bg-white text-black px-5 py-1.5 rounded-full font-bold text-sm hover:scale-105 transition shadow-lg hover:shadow-green-500/20">Iniciar Sesión</Link>
      )}
    </header>
  );
};
