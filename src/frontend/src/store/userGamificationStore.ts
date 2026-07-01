import { create } from "zustand";

interface UserData {
  id: number;
  username: string;
  nivel: number;
  xp_actual: number;
  racha_dias: number;
  puntos_tienda: number;
}

interface UserState {
  id: number | null;
  username: string;
  nivel: number;
  xp: number;
  racha: number;
  puntos: number;
  updateUser: (data: UserData) => void;
}

export const useGamificationStore = create<UserState>((set) => ({
  id: null,
  username: "",
  nivel: 1,
  xp: 0,
  racha: 0,
  puntos: 0,
  updateUser: (data) =>
    set({
      id: data.id,
      username: data.username,
      nivel: data.nivel,
      xp: data.xp_actual,
      racha: data.racha_dias,
      puntos: data.puntos_tienda,
    }),
}));
