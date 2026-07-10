import { createSlice, PayloadAction } from "@reduxjs/toolkit";

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

interface Notification {
  id: string;
  type: "xp" | "levelup" | "combo" | "racha" | "puntos" | "info";
  message: string;
  value?: string | number;
}

interface QueueItem {
  song: Song;
  shuffled?: boolean;
}

interface GamificationState {
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
  queue: QueueItem[];
  queueIndex: number;
  isShuffled: boolean;
}

const initialState: GamificationState = {
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
  queue: [],
  queueIndex: -1,
  isShuffled: false,
};

const gamificationSlice = createSlice({
  name: "gamification",
  initialState,
  reducers: {
    updateUser(state, action: PayloadAction<Partial<UserData>>) {
      const d = action.payload;
      if (d.id !== undefined) state.id = d.id;
      if (d.username !== undefined) state.username = d.username;
      if (d.nivel !== undefined) state.nivel = d.nivel;
      if (d.xp_actual !== undefined) state.xp = d.xp_actual;
      if (d.xp_requerida !== undefined) state.xpRequerida = d.xp_requerida;
      else if (d.nivel !== undefined) state.xpRequerida = d.nivel * 100;
      if (d.racha_dias !== undefined) state.racha = d.racha_dias;
      if (d.puntos_tienda !== undefined) state.puntos = d.puntos_tienda;
      if (d.combo_actual !== undefined) state.combo = d.combo_actual;
    },
    setCurrentSong(state, action: PayloadAction<Song | null>) {
      state.currentSong = action.payload;
    },
    addNotification(state, action: PayloadAction<Notification>) {
      state.notifications.push(action.payload);
    },
    removeNotification(state, action: PayloadAction<string>) {
      state.notifications = state.notifications.filter((n) => n.id !== action.payload);
    },
    clearUser(state) {
      state.id = null;
      state.username = "";
      state.nivel = 1;
      state.xp = 0;
      state.xpRequerida = 100;
      state.racha = 0;
      state.puntos = 0;
      state.combo = 0;
      state.currentSong = null;
      state.notifications = [];
      state.queue = [];
      state.queueIndex = -1;
    },
    setQueue(state, action: PayloadAction<QueueItem[]>) {
      state.queue = action.payload;
      state.queueIndex = 0;
    },
    setQueueIndex(state, action: PayloadAction<number>) {
      state.queueIndex = action.payload;
    },
    nextInQueue(state) {
      if (state.queue.length === 0) return;
      const nextIdx = state.queueIndex + 1;
      if (nextIdx < state.queue.length) {
        state.queueIndex = nextIdx;
        state.currentSong = state.queue[nextIdx].song;
      }
    },
    toggleShuffle(state) {
      state.isShuffled = !state.isShuffled;
    },
    addXpGained(state, action: PayloadAction<{ xp: number; subioNivel: boolean; nuevoNivel: number }>) {
      const { subioNivel, nuevoNivel } = action.payload;
      if (subioNivel) {
        state.nivel = nuevoNivel;
      }
    },
  },
});

export const {
  updateUser,
  setCurrentSong,
  addNotification,
  removeNotification,
  clearUser,
  setQueue,
  setQueueIndex,
  nextInQueue,
  toggleShuffle,
  addXpGained,
} = gamificationSlice.actions;

export default gamificationSlice.reducer;
