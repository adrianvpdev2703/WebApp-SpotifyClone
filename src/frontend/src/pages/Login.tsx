import { useState } from "react";
import { useGamificationStore } from "../store/userGamificationStore";
import { useNavigate } from "react-router-dom";

export const Login = () => {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [isRegister, setIsRegister] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const updateUser = useGamificationStore((state) => state.updateUser);
  const addNotification = useGamificationStore((state) => state.addNotification);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (isRegister) {
        const res = await fetch("http://localhost:3000/usuarios/registro", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ username, email }),
        });
        if (!res.ok) {
          const data = await res.json();
          throw new Error(data.error || "Error al registrarse");
        }
      }

      const res = await fetch("http://localhost:3000/usuarios/login-test", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      if (!res.ok) throw new Error("Error al iniciar sesión");

      const data = await res.json();
      updateUser({
        id: data.id,
        username: data.username,
        nivel: data.nivel,
        xp_actual: data.xp_actual,
        racha_dias: data.racha_dias,
        puntos_tienda: data.puntos_tienda,
      });

      addNotification({
        id: `login-${Date.now()}`,
        type: "info",
        message: `¡Bienvenido, ${data.username}!`,
      });

      navigate("/");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Error desconocido";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-20">
      <div className="bg-zinc-900 p-8 rounded-lg border border-zinc-800">
        <div className="flex mb-8">
          <button
            onClick={() => setIsRegister(false)}
            className={`flex-1 py-2 text-center font-bold rounded-l-full transition ${!isRegister ? "bg-green-500 text-black" : "bg-zinc-800 text-gray-400"}`}
          >
            Iniciar Sesión
          </button>
          <button
            onClick={() => setIsRegister(true)}
            className={`flex-1 py-2 text-center font-bold rounded-r-full transition ${isRegister ? "bg-green-500 text-black" : "bg-zinc-800 text-gray-400"}`}
          >
            Registrarse
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {isRegister && (
            <input
              type="text"
              placeholder="Nombre de usuario"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="p-3 rounded bg-zinc-800 text-white border border-zinc-700 focus:outline-none focus:border-green-500"
              required
            />
          )}
          <input
            type="email"
            placeholder="Correo electrónico"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="p-3 rounded bg-zinc-800 text-white border border-zinc-700 focus:outline-none focus:border-green-500"
            required
          />

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="bg-green-500 text-black font-bold py-3 rounded-full hover:scale-105 transition disabled:opacity-50"
          >
            {loading ? "Cargando..." : isRegister ? "Crear Cuenta" : "Entrar"}
          </button>
        </form>
      </div>
    </div>
  );
};
