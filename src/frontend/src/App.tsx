import { useEffect } from "react";
import { Header } from "./components/Header";
import { useGamificationStore } from "./store/userGamificationStore";

export default function App() {
  const updateUser = useGamificationStore((state) => state.updateUser);

  useEffect(() => {
    updateUser({
      id: 1,
      username: "AdrianTester",
      nivel: 3,
      xp_actual: 75,
      racha_dias: 12,
      puntos_tienda: 250,
    });
  }, [updateUser]);

  return (
    <div className="min-h-screen bg-black text-white">
      <Header />
      <main className="p-8">
        <h1>App</h1>
      </main>
    </div>
  );
}
