import { Routes, Route } from "react-router-dom";
import { Header } from "./components/Header";
import { Player } from "./components/Player";
import { Toast } from "./components/Toast";
import { Home } from "./pages/Home";
import { Login } from "./pages/Login";
import { Admin } from "./pages/Admin";
import { Shop } from "./pages/Shop";
import { Ranking } from "./pages/Ranking";
import { Communities } from "./pages/Communities";

export default function App() {
  return (
    <div className="min-h-screen bg-black text-white pb-24">
      <Header />
      <Toast />
      <main className="p-6 md:p-8 max-w-7xl mx-auto">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/tienda" element={<Shop />} />
          <Route path="/ranking" element={<Ranking />} />
          <Route path="/comunidades" element={<Communities />} />
        </Routes>
      </main>
      <Player />
    </div>
  );
}
