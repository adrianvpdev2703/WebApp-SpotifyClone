import { useEffect } from "react";
import { Header } from "./components/Header";
import { Player } from "./components/Player"; // <-- Importar el reproductor
import { useGamificationStore } from "./store/userGamificationStore";

export default function App() {
  const updateUser = useGamificationStore((state) => state.updateUser);

  useEffect(() => {
    // Simulamos un inicio de sesión cargando a AdrianTester con sus datos
    updateUser({
      id: 1,
      username: "AdrianTester",
      nivel: 1,
      xp_actual: 0,
      racha_dias: 0,
      puntos_tienda: 0,
    });
  }, [updateUser]);

  return (
    <div className="min-h-screen bg-black text-white pb-24">
      {" "}
      {/* pb-24 da espacio para que el Player no tape contenido */}
      <Header />
      <main className="p-8">
        <h1 className="text-3xl font-bold mb-6">Buenas tardes</h1>

        {/* Aquí irán las tarjetas de las canciones o comunidades más adelante */}
        <div className="bg-zinc-800/50 p-6 rounded-lg w-fit border border-zinc-700">
          <p className="text-gray-300">Dale play a la música abajo.</p>
          <p className="text-gray-300">
            Cuando la canción termine, mira cómo sube tu XP mágicamente.
          </p>
        </div>
      </main>
      {/* El reproductor fijado en la parte inferior */}
      <Player />
    </div>
  );
}
