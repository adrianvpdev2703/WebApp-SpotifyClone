import { useEffect, useState } from "react";
import { useGamificationStore } from "../store/userGamificationStore";

interface ShopItem {
  id: number;
  nombre: string;
  descripcion: string;
  precio: number;
  tipo: string;
  icono: string;
}

export const Shop = () => {
  const [items, setItems] = useState<ShopItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [buying, setBuying] = useState<number | null>(null);

  const userId = useGamificationStore((state) => state.id);
  const puntos = useGamificationStore((state) => state.puntos);
  const updateUser = useGamificationStore((state) => state.updateUser);
  const addNotification = useGamificationStore((state) => state.addNotification);

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      const res = await fetch("http://localhost:3000/tienda/items");
      if (res.ok) {
        const data = await res.json();
        setItems(data);
      }
    } catch (error) {
      console.error("Error cargando tienda:", error);
    } finally {
      setLoading(false);
    }
  };

  const buyItem = async (itemId: number, precio: number) => {
    if (!userId) {
      addNotification({ id: "no-login", type: "info", message: "Inicia sesión para comprar" });
      return;
    }
    if (puntos < precio) {
      addNotification({ id: "no-points", type: "info", message: "Puntos insuficientes" });
      return;
    }

    setBuying(itemId);
    try {
      const res = await fetch("http://localhost:3000/tienda/comprar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ usuario_id: userId, item_id: itemId }),
      });

      const data = await res.json();
      if (res.ok) {
        updateUser({
          id: userId,
          username: useGamificationStore.getState().username,
          nivel: useGamificationStore.getState().nivel,
          xp_actual: useGamificationStore.getState().xp,
          racha_dias: useGamificationStore.getState().racha,
          puntos_tienda: data.puntos_restantes,
        });

        addNotification({
          id: `buy-${Date.now()}`,
          type: "puntos",
          message: `¡Comprado: ${data.item.nombre}!`,
          value: `Te quedan ${data.puntos_restantes} puntos`,
        });
      } else {
        addNotification({
          id: `buy-fail-${Date.now()}`,
          type: "info",
          message: data.error || "Error al comprar",
        });
      }
    } catch (error) {
      addNotification({ id: "buy-error", type: "info", message: "Error de conexión" });
    } finally {
      setBuying(null);
    }
  };

  if (!userId) {
    return (
      <div className="text-center py-20">
        <h1 className="text-3xl font-bold mb-4">Tienda</h1>
        <p className="text-gray-400">Inicia sesión para gastar tus puntos</p>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">Tienda</h1>
          <p className="text-gray-400 mt-1">Gasta tus puntos en beneficios exclusivos</p>
        </div>
        <div className="bg-yellow-500/20 text-yellow-400 px-4 py-2 rounded-full font-bold border border-yellow-500/30 flex items-center gap-2">
          <span>💎</span>
          <span>{puntos} puntos</span>
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="bg-zinc-800/50 rounded-lg p-6 animate-pulse border border-zinc-700/50">
              <div className="h-12 w-12 bg-zinc-700 rounded-full mb-4" />
              <div className="h-5 bg-zinc-700 rounded w-2/3 mb-2" />
              <div className="h-3 bg-zinc-700 rounded w-full mb-4" />
              <div className="h-4 bg-zinc-700 rounded w-1/3" />
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {items.map((item) => {
            const canAfford = puntos >= item.precio;
            return (
              <div
                key={item.id}
                className={`bg-zinc-800/40 border ${canAfford ? "border-zinc-700 hover:border-zinc-600" : "border-zinc-800/50 opacity-60"} rounded-lg p-6 transition-all duration-300`}
              >
                <div className="text-4xl mb-4">{item.icono}</div>
                <h3 className="text-lg font-bold text-white mb-1">{item.nombre}</h3>
                <p className="text-sm text-gray-400 mb-4">{item.descripcion}</p>
                <div className="flex items-center justify-between">
                  <span className="text-yellow-400 font-bold flex items-center gap-1">
                    <span>💎</span>
                    {item.precio}
                  </span>
                  <button
                    onClick={() => buyItem(item.id, item.precio)}
                    disabled={buying === item.id || !canAfford}
                    className={`px-4 py-2 rounded-full text-sm font-bold transition ${canAfford ? "bg-green-500 text-black hover:scale-105" : "bg-zinc-700 text-gray-500 cursor-not-allowed"} ${buying === item.id ? "opacity-50" : ""}`}
                  >
                    {buying === item.id ? "..." : canAfford ? "Comprar" : "Sin puntos"}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
