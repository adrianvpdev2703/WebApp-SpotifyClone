import { useEffect, useState } from "react";
import { useAppSelector, useAppDispatch } from "../store/hooks";
import { addNotification } from "../store/gamificationSlice";

interface Comunidad {
  id: number;
  nombre: string;
  descripcion: string;
  es_privada: boolean;
  miembros_count: number;
  created_at: string;
}

interface Miembro {
  id: number;
  username: string;
}

interface Mensaje {
  id: number;
  contenido: string;
  es_cancion: boolean;
  usuario_id: number;
  autor: { id: number; username: string };
  created_at?: string;
  createdAt: string;
}

export const Communities = () => {
  const dispatch = useAppDispatch();
  const userId = useAppSelector((s) => s.gamification.id);

  const [comunidades, setComunidades] = useState<Comunidad[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCom, setSelectedCom] = useState<Comunidad | null>(null);
  const [miembros, setMiembros] = useState<Miembro[]>([]);
  const [mensajes, setMensajes] = useState<Mensaje[]>([]);
  const [mensajeInput, setMensajeInput] = useState("");
  const [showCreate, setShowCreate] = useState(false);
  const [newNombre, setNewNombre] = useState("");
  const [newDesc, setNewDesc] = useState("");
  const [newPrivada, setNewPrivada] = useState(false);

  const fetchComunidades = async () => {
    try {
      const res = await fetch("http://localhost:3006/comunidades");
      if (res.ok) setComunidades(await res.json());
    } catch (e) { console.error(e); }
    setLoading(false);
  };

  useEffect(() => { fetchComunidades(); }, []);

  const openComunidad = async (com: Comunidad) => {
    setSelectedCom(com);
    try {
      const [detRes, msgRes] = await Promise.all([
        fetch(`http://localhost:3006/comunidades/${com.id}`),
        fetch(`http://localhost:3006/comunidades/${com.id}/mensajes`),
      ]);
      if (detRes.ok) {
        const det = await detRes.json();
        setMiembros(det.miembros || []);
      }
      if (msgRes.ok) setMensajes(await msgRes.json());
    } catch (e) { console.error(e); }
  };

  const joinComunidad = async (comunidad_id: number) => {
    if (!userId) return;
    try {
      const res = await fetch("http://localhost:3006/comunidades/unirse", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ usuario_id: userId, comunidad_id }),
      });
      const data = await res.json();
      dispatch(addNotification({ id: `join-${Date.now()}`, type: "info", message: data.mensaje || "Te has unido" }));
      if (res.ok) fetchComunidades();
    } catch (e) { console.error(e); }
  };

  const leaveComunidad = async (comunidad_id: number) => {
    if (!userId) return;
    try {
      const res = await fetch("http://localhost:3006/comunidades/abandonar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ usuario_id: userId, comunidad_id }),
      });
      const data = await res.json();
      dispatch(addNotification({ id: `leave-${Date.now()}`, type: "info", message: data.mensaje || "Has abandonado" }));
      if (res.ok) {
        fetchComunidades();
        if (selectedCom?.id === comunidad_id) setSelectedCom(null);
      }
    } catch (e) { console.error(e); }
  };

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userId || !selectedCom || !mensajeInput.trim()) return;
    const isSong = mensajeInput.startsWith("/song ");
    const contenido = isSong ? mensajeInput.replace("/song ", "") : mensajeInput;
    try {
      const res = await fetch("http://localhost:3006/comunidades/mensaje", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          usuario_id: userId,
          comunidad_id: selectedCom.id,
          contenido,
          es_cancion: isSong,
        }),
      });
      if (res.ok) {
        const data = await res.json();
        setMensajes((prev) => [...prev, data.data]);
        setMensajeInput("");
      }
    } catch (e) { console.error(e); }
  };

  const createComunidad = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userId) return;
    try {
      const res = await fetch("http://localhost:3006/comunidades/crear", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nombre: newNombre,
          descripcion: newDesc,
          es_privada: newPrivada,
          creador_id: userId,
        }),
      });
      if (res.ok) {
        dispatch(addNotification({ id: `create-${Date.now()}`, type: "info", message: "¡Comunidad creada!" }));
        setShowCreate(false);
        setNewNombre("");
        setNewDesc("");
        fetchComunidades();
      }
    } catch (e) { console.error(e); }
  };

  if (loading) {
    return (
      <div className="space-y-4 animate-fade-in">
        <h1 className="text-3xl font-bold gradient-text mb-6">Comunidades</h1>
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="glass rounded-xl p-4 animate-pulse h-20" style={{ animationDelay: `${i * 100}ms` }} />
        ))}
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold gradient-text">Comunidades</h1>
        {userId && (
          <button onClick={() => setShowCreate(!showCreate)}
            className={`btn-${showCreate ? "secondary" : "primary"} text-sm`}>
            {showCreate ? "Cancelar" : "+ Crear comunidad"}
          </button>
        )}
      </div>

      {showCreate && (
        <form onSubmit={createComunidad} className="glass-strong rounded-xl p-6 border border-zinc-700/50 mb-6 space-y-3 animate-slide-up">
          <input type="text" placeholder="Nombre de la comunidad" value={newNombre}
            onChange={(e) => setNewNombre(e.target.value)}
            className="input-base" required />
          <textarea placeholder="Descripción" value={newDesc}
            onChange={(e) => setNewDesc(e.target.value)}
            className="input-base" rows={3} />
          <label className="flex items-center gap-2 text-sm text-gray-300">
            <input type="checkbox" checked={newPrivada} onChange={(e) => setNewPrivada(e.target.checked)}
              className="rounded bg-zinc-800 border-zinc-700" />
            Comunidad privada
          </label>
          <button type="submit" className="btn-primary">Crear</button>
        </form>
      )}

      {selectedCom ? (
        <div className="animate-fade-in">
          <div className="flex items-center gap-4 mb-6">
            <button onClick={() => { setSelectedCom(null); setMensajes([]); setMiembros([]); }}
              className="text-gray-400 hover:text-white text-lg">←</button>
            <div>
              <h2 className="text-2xl font-bold gradient-text">{selectedCom.nombre}</h2>
              <p className="text-sm text-gray-400">{selectedCom.descripcion}</p>
              <p className="text-xs text-gray-500">{miembros.length} miembros</p>
            </div>
            {userId && (
              <div className="ml-auto flex gap-2">
                {!miembros.some((m) => m.id === userId) ? (
                  <button onClick={() => joinComunidad(selectedCom.id)}
                    className="btn-primary text-sm">Unirse</button>
                ) : (
                  <button onClick={() => leaveComunidad(selectedCom.id)}
                    className="bg-red-500/20 text-red-400 px-4 py-1.5 rounded-full text-sm font-bold border border-red-500/30 hover:bg-red-500/30 transition">Abandonar</button>
                )}
              </div>
            )}
          </div>

          {/* Miembros */}
          <div className="mb-6">
            <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-2">Miembros</h3>
            <div className="flex flex-wrap gap-2">
              {miembros.map((m) => (
                <span key={m.id} className="glass text-white px-3 py-1 rounded-full text-xs border border-zinc-700/50">
                  {m.username}
                </span>
              ))}
            </div>
          </div>

          {/* Chat */}
          <div className="glass-strong rounded-xl border border-zinc-700/50">
            <div className="h-96 overflow-y-auto p-4 space-y-3 scrollbar-thin">
              {mensajes.length === 0 ? (
                <p className="text-gray-500 text-center py-10">No hay mensajes aún. ¡Sé el primero en escribir!</p>
              ) : (
                mensajes.map((msg) => (
                  <div key={msg.id} className={`flex ${msg.autor?.id === userId ? "justify-end" : "justify-start"} animate-slide-up`}>
                    <div className={`max-w-[70%] p-3 rounded-xl ${msg.autor?.id === userId ? "bg-green-500/20 border border-green-500/30" : "glass border border-zinc-700/50"} ${msg.es_cancion ? "border-l-4 border-l-green-500" : ""}`}>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-bold text-green-400">{msg.autor?.username || "Desconocido"}</span>
                        <span className="text-xs text-gray-500">{new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                        {msg.es_cancion && <span className="text-xs text-green-400">🎵 Canción</span>}
                      </div>
                      <p className="text-sm text-white">{msg.contenido}</p>
                    </div>
                  </div>
                ))
              )}
            </div>

            {userId && miembros.some((m) => m.id === userId) && (
              <form onSubmit={sendMessage} className="flex gap-2 p-4 border-t border-zinc-800">
                <input type="text" placeholder="Escribe un mensaje... (usa /song para compartir canción)" value={mensajeInput}
                  onChange={(e) => setMensajeInput(e.target.value)}
                  className="flex-1 input-base text-sm" />
                <button type="submit" className="btn-primary text-sm">Enviar</button>
              </form>
            )}
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {comunidades.map((com, index) => (
            <div key={com.id}
              className="glass card-hover rounded-xl p-5 cursor-pointer transition group animate-slide-up"
              onClick={() => openComunidad(com)}
              style={{ animationDelay: `${index * 80}ms` }}
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="text-lg font-bold text-white group-hover:text-green-400 transition">{com.nombre}</h3>
                  <p className="text-sm text-gray-400 mt-1 line-clamp-2">{com.descripcion}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 text-sm text-gray-500">
                <span>👥 {com.miembros_count} miembros</span>
                {com.es_privada && <span className="text-xs glass px-2 py-0.5 rounded-full">🔒 Privada</span>}
              </div>
            </div>
          ))}
          {comunidades.length === 0 && (
            <p className="text-gray-400 col-span-2 text-center py-10">No hay comunidades aún. ¡Crea la primera!</p>
          )}
        </div>
      )}
    </div>
  );
};