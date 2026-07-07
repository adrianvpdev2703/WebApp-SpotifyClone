import { useEffect, useState, useRef } from "react";
import { useAppSelector } from "../store/hooks";

interface Artist { id: number; nombre: string; imagen?: string }
interface Album { id: number; nombre: string; artista: number; imagen?: string }
interface Song { id: number; nombre: string; album: number; archivo?: string; imagen?: string }

type Tab = "artistas" | "albumes" | "canciones";

export const Admin = () => {
  const [tab, setTab] = useState<Tab>("canciones");
  const userId = useAppSelector((s) => s.gamification.id);

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Panel de Administración</h1>
      {!userId ? (
        <p className="text-gray-400">Inicia sesión para administrar contenido</p>
      ) : (
        <>
          <div className="flex gap-2 mb-6">
            {(["artistas", "albumes", "canciones"] as Tab[]).map((t) => (
              <button key={t} onClick={() => setTab(t)}
                className={`px-4 py-2 rounded-full font-bold text-sm transition ${tab === t ? "bg-green-500 text-black" : "bg-zinc-800 text-gray-400 hover:bg-zinc-700"}`}>
                {t.charAt(0).toUpperCase() + t.slice(1)}
              </button>
            ))}
          </div>
          {tab === "artistas" && <ArtistManager />}
          {tab === "albumes" && <AlbumManager />}
          {tab === "canciones" && <SongManager />}
        </>
      )}
    </div>
  );
};

const ArtistManager = () => {
  const [artists, setArtists] = useState<Artist[]>([]);
  const [nombre, setNombre] = useState("");
  const fetchArtists = async () => {
    const res = await fetch("http://localhost:3006/artistas");
    if (res.ok) setArtists(await res.json());
  };
  useEffect(() => { fetchArtists(); }, []);
  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("nombre", nombre);
    const res = await fetch("http://localhost:3006/artistas", { method: "POST", body: formData });
    if (res.ok) { setNombre(""); fetchArtists(); }
  };
  const handleDelete = async (id: number) => {
    await fetch(`http://localhost:3006/artistas/${id}`, { method: "DELETE" });
    fetchArtists();
  };
  return (
    <div>
      <form onSubmit={handleCreate} className="flex gap-2 mb-6">
        <input type="text" placeholder="Nombre del artista" value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          className="flex-1 p-3 rounded bg-zinc-800 text-white border border-zinc-700 focus:outline-none focus:border-green-500" required />
        <button type="submit" className="bg-green-500 text-black px-6 py-3 rounded-full font-bold hover:scale-105 transition">Agregar</button>
      </form>
      <div className="space-y-2">
        {artists.map((a) => (
          <div key={a.id} className="flex items-center justify-between bg-zinc-800/40 p-3 rounded-lg border border-zinc-800">
            <span className="font-bold">{a.nombre}</span>
            <button onClick={() => handleDelete(a.id)} className="text-red-500 hover:text-red-400 text-sm">Eliminar</button>
          </div>
        ))}
      </div>
    </div>
  );
};

const AlbumManager = () => {
  const [albums, setAlbums] = useState<Album[]>([]);
  const [artists, setArtists] = useState<Artist[]>([]);
  const [nombre, setNombre] = useState("");
  const [artista, setArtista] = useState("");
  const fetchData = async () => {
    const [aRes, alRes] = await Promise.all([
      fetch("http://localhost:3006/artistas"),
      fetch("http://localhost:3006/albumes"),
    ]);
    if (aRes.ok) setArtists(await aRes.json());
    if (alRes.ok) setAlbums(await alRes.json());
  };
  useEffect(() => { fetchData(); }, []);
  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("nombre", nombre);
    formData.append("artista", artista);
    const res = await fetch("http://localhost:3006/albumes", { method: "POST", body: formData });
    if (res.ok) { setNombre(""); setArtista(""); fetchData(); }
  };
  const handleDelete = async (id: number) => {
    await fetch(`http://localhost:3006/albumes/${id}`, { method: "DELETE" });
    fetchData();
  };
  return (
    <div>
      <form onSubmit={handleCreate} className="flex gap-2 mb-6 flex-wrap">
        <input type="text" placeholder="Nombre del álbum" value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          className="flex-1 min-w-[200px] p-3 rounded bg-zinc-800 text-white border border-zinc-700 focus:outline-none focus:border-green-500" required />
        <select value={artista} onChange={(e) => setArtista(e.target.value)}
          className="p-3 rounded bg-zinc-800 text-white border border-zinc-700 focus:outline-none focus:border-green-500" required>
          <option value="">Seleccionar artista</option>
          {artists.map((a) => <option key={a.id} value={a.id}>{a.nombre}</option>)}
        </select>
        <button type="submit" className="bg-green-500 text-black px-6 py-3 rounded-full font-bold hover:scale-105 transition">Agregar</button>
      </form>
      <div className="space-y-2">
        {albums.map((al) => (
          <div key={al.id} className="flex items-center justify-between bg-zinc-800/40 p-3 rounded-lg border border-zinc-800">
            <span className="font-bold">{al.nombre}</span>
            <button onClick={() => handleDelete(al.id)} className="text-red-500 hover:text-red-400 text-sm">Eliminar</button>
          </div>
        ))}
      </div>
    </div>
  );
};

const SongManager = () => {
  const [songs, setSongs] = useState<Song[]>([]);
  const [albums, setAlbums] = useState<Album[]>([]);
  const [nombre, setNombre] = useState("");
  const [album, setAlbum] = useState("");
  const [archivo, setArchivo] = useState<File | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const fetchData = async () => {
    const [sRes, alRes] = await Promise.all([
      fetch("http://localhost:3006/canciones"),
      fetch("http://localhost:3006/albumes"),
    ]);
    if (sRes.ok) setSongs(await sRes.json());
    if (alRes.ok) setAlbums(await alRes.json());
  };
  useEffect(() => { fetchData(); }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("nombre", nombre);
    formData.append("album", album);
    if (archivo) formData.append("archivo", archivo);
    const res = await fetch("http://localhost:3006/canciones", { method: "POST", body: formData });
    if (res.ok) { setNombre(""); setAlbum(""); setArchivo(null); if (fileRef.current) fileRef.current.value = ""; fetchData(); }
  };

  const handleDelete = async (id: number) => {
    await fetch(`http://localhost:3006/canciones/${id}`, { method: "DELETE" });
    fetchData();
  };

  return (
    <div>
      <form onSubmit={handleCreate} className="flex flex-col gap-3 mb-6">
        <div className="flex gap-2 flex-wrap">
          <input type="text" placeholder="Nombre de la canción" value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            className="flex-1 min-w-[200px] p-3 rounded bg-zinc-800 text-white border border-zinc-700 focus:outline-none focus:border-green-500" required />
          <select value={album} onChange={(e) => setAlbum(e.target.value)}
            className="p-3 rounded bg-zinc-800 text-white border border-zinc-700 focus:outline-none focus:border-green-500" required>
            <option value="">Seleccionar álbum</option>
            {albums.map((a) => <option key={a.id} value={a.id}>{a.nombre}</option>)}
          </select>
        </div>
        <div className="flex gap-2 items-center">
          <input ref={fileRef} type="file" accept="audio/*" onChange={(e) => setArchivo(e.target.files?.[0] || null)}
            className="text-sm text-gray-400 file:mr-3 file:py-2 file:px-4 file:rounded-full file:border-0 file:bg-zinc-800 file:text-white file:font-bold hover:file:bg-zinc-700" />
          <button type="submit" className="bg-green-500 text-black px-6 py-3 rounded-full font-bold hover:scale-105 transition">Agregar</button>
        </div>
      </form>
      <div className="space-y-2">
        {songs.map((s) => (
          <div key={s.id} className="flex items-center justify-between bg-zinc-800/40 p-3 rounded-lg border border-zinc-800">
            <span className="font-bold">{s.nombre}</span>
            <span className="text-xs text-gray-500">{s.archivo ? "📁 audio" : "❌ sin audio"}</span>
            <button onClick={() => handleDelete(s.id)} className="text-red-500 hover:text-red-400 text-sm">Eliminar</button>
          </div>
        ))}
      </div>
    </div>
  );
};
