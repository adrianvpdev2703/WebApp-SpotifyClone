import { create } from "zustand";

interface UserData {
  id: number;
  username: string;
  nivel: number;
  xp_actual: number;
  racha_dias: number;
  puntos_tienda: number;
  combo_actual?: number;
  xp_requerida?: number;
}

export interface Song {
  id: number;
  nombre: string;
  archivo: string;
  imagen?: string;
  album?: number;
  albumData?: {
    id: number;
    nombre: string;
    imagen?: string;
    artistaData?: {
      id: number;
      nombre: string;
      imagen?: string;
    };
  };
}

interface Notification {
  id: string;
  type: "xp" | "levelup" | "combo" | "racha" | "puntos" | "info";
  message: string;
  value?: string | number;
}

interface UserState {
  id: number | null;
  username: string;
  nivel: number;
  xp: number;
  xpRequerida: number;
  racha: number;
  puntos: number;
  combo: number;
  currentSong: Song | null;
  notifications: Notification[];

  updateUser: (data: UserData) => void;
  setCurrentSong: (song: Song | null) => void;
  addNotification: (notif: Notification) => void;
  removeNotification: (id: string) => void;
  clearUser: () => void;
}

export const useGamificationStore = create<UserState>((set) => ({
  id: null,
  username: "",
  nivel: 1,
  xp: 0,
  xpRequerida: 100,
  racha: 0,
  puntos: 0,
  combo: 0,
  currentSong: null,
  notifications: [],

  updateUser: (data) =>
    set({
      id: data.id,
      username: data.username,
      nivel: data.nivel,
      xp: data.xp_actual,
      xpRequerida: data.xp_requerida ?? data.nivel * 100,
      racha: data.racha_dias,
      puntos: data.puntos_tienda,
      combo: data.combo_actual ?? 0,
    }),

  setCurrentSong: (song) => set({ currentSong: song }),

  addNotification: (notif) =>
    set((state) => ({
      notifications: [...state.notifications, notif],
    })),

  removeNotification: (id) =>
    set((state) => ({
      notifications: state.notifications.filter((n) => n.id !== id),
    })),

  clearUser: () =>
    set({
      id: null,
      username: "",
      nivel: 1,
      xp: 0,
      xpRequerida: 100,
      racha: 0,
      puntos: 0,
      combo: 0,
      currentSong: null,
      notifications: [],
    }),
}));
