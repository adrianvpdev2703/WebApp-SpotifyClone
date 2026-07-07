import { useEffect, useState } from "react";

interface RankedUser {
  id: number;
  username: string;
  nivel: number;
  xp_actual: number;
  racha_dias: number;
  puntos_tienda: number;
}

const tierBg: Record<string, string> = {
  "1": "bg-yellow-500/10 border-yellow-500/30",
  "2": "bg-gray-300/10 border-gray-400/30",
  "3": "bg-amber-600/10 border-amber-600/30",
};

const tierIcons: Record<string, string> = {
  "1": "🥇",
  "2": "🥈",
  "3": "🥉",
};

export const Ranking = () => {
  const [ranking, setRanking] = useState<RankedUser[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRanking = async () => {
      try {
        const res = await fetch("http://localhost:3000/usuarios/ranking");
        if (res.ok) {
          const data = await res.json();
          setRanking(data.ranking || []);
        }
      } catch (error) {
        console.error("Error cargando ranking:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchRanking();
  }, []);

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Ranking Global</h1>
        <p className="text-gray-400 mt-1">Los mejores oyentes de la comunidad</p>
      </div>

      {loading ? (
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="bg-zinc-800/50 rounded-lg p-4 animate-pulse flex items-center gap-4">
              <div className="w-8 h-8 bg-zinc-700 rounded-full" />
              <div className="flex-1 h-4 bg-zinc-700 rounded w-1/3" />
              <div className="h-4 bg-zinc-700 rounded w-20" />
            </div>
          ))}
        </div>
      ) : ranking.length === 0 ? (
        <p className="text-gray-400 text-center py-10">No hay usuarios en el ranking aún</p>
      ) : (
        <div className="space-y-2">
          {ranking.map((user, index) => {
            const pos = index + 1;
            const isTop3 = pos <= 3;

            return (
              <div
                key={user.id}
                className={`flex items-center gap-4 p-4 rounded-lg border transition ${isTop3 ? tierBg[String(pos)] : "bg-zinc-800/30 border-zinc-800 hover:bg-zinc-800/50"}`}
              >
                <div className="w-10 text-center">
                  {isTop3 ? (
                    <span className="text-2xl">{tierIcons[String(pos)]}</span>
                  ) : (
                    <span className="text-gray-500 font-bold text-lg">{pos}</span>
                  )}
                </div>

                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-green-500 to-green-700 flex items-center justify-center text-white font-bold text-sm">
                  {user.username.charAt(0).toUpperCase()}
                </div>

                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-white truncate">{user.username}</h3>
                  <p className="text-xs text-gray-400">
                    Nivel {user.nivel} · {user.xp_actual} XP
                  </p>
                </div>

                <div className="flex items-center gap-4 text-sm">
                  <div className="hidden sm:flex items-center gap-1 text-orange-400">
                    <span>🔥</span>
                    <span>{user.racha_dias}d</span>
                  </div>
                  <div className="flex items-center gap-1 text-yellow-400">
                    <span>💎</span>
                    <span>{user.puntos_tienda}</span>
                  </div>
                  <div className="bg-green-500/20 text-green-400 px-3 py-1 rounded-full text-xs font-bold border border-green-500/30 min-w-[60px] text-center">
                    Lv.{user.nivel}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
