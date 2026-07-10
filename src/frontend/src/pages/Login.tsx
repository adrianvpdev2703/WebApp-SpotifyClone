import { useState } from "react";
import { useAppDispatch } from "../store/hooks";
import { updateUser, addNotification } from "../store/gamificationSlice";
import { useNavigate } from "react-router-dom";

export const Login = () => {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [isRegister, setIsRegister] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (isRegister) {
        const res = await fetch("http://localhost:3006/usuarios/registro", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ username, email }),
        });
        if (!res.ok) {
          const data = await res.json();
          throw new Error(data.error || "Error al registrarse");
        }
      }

      const res = await fetch("http://localhost:3006/usuarios/login-test", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      if (!res.ok) throw new Error("Error al iniciar sesión");

      const data = await res.json();
      dispatch(updateUser({
        id: data.id,
        username: data.username,
        nivel: data.nivel,
        xp_actual: data.xp_actual,
        racha_dias: data.racha_dias,
        puntos_tienda: data.puntos_tienda,
      }));

      dispatch(addNotification({
        id: `login-${Date.now()}`,
        type: "info",
        message: `¡Bienvenido, ${data.username}!`,
      }));

      navigate("/");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Error desconocido";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-20 animate-fade-in">
      <div className="glass-strong rounded-xl p-8 border border-zinc-700/50 shadow-2xl">
        <h1 className="text-2xl font-bold gradient-text text-center mb-6">
          {isRegister ? "Crear cuenta" : "Iniciar sesión"}
        </h1>
        <div className="flex mb-8 rounded-full overflow-hidden border border-zinc-700/50">
          <button onClick={() => setIsRegister(false)}
            className={`flex-1 py-2 text-center font-bold transition ${!isRegister ? "bg-green-500 text-black" : "bg-zinc-800 text-gray-400 hover:bg-zinc-700"}`}>Iniciar Sesión</button>
          <button onClick={() => setIsRegister(true)}
            className={`flex-1 py-2 text-center font-bold transition ${isRegister ? "bg-green-500 text-black" : "bg-zinc-800 text-gray-400 hover:bg-zinc-700"}`}>Registrarse</button>
        </div>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {isRegister && (
            <input type="text" placeholder="Nombre de usuario" value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="input-base" required />
          )}
          <input type="email" placeholder="Correo electrónico" value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="input-base" required />
          {error && <p className="text-red-500 text-sm bg-red-500/10 p-2 rounded-lg">{error}</p>}
          <button type="submit" disabled={loading}
            className="btn-primary disabled:opacity-50">
            {loading ? "Cargando..." : isRegister ? "Crear Cuenta" : "Entrar"}
          </button>
        </form>
      </div>
    </div>
  );
};