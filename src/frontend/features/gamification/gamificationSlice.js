import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// Acción asíncrona que llama a nuestro backend de Sequelize
export const addXpAsync = createAsyncThunk(
  "gamification/addXp",
  async ({ userId, xpGained }, { rejectWithValue }) => {
    try {
      const response = await fetch("/usuarios/add-xp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: userId, xp_ganada: xpGained }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error);
      return data; // Retorna { usuario, subioNivel, mensaje }
    } catch (error) {
      return rejectWithValue(error.message);
    }
  },
);

const initialState = {
  userId: null,
  nivel: 1,
  xpActual: 0,
  xpRequerida: 100,
  notificaciones: [], // Para mostrar alertas como "¡Subiste de nivel!"
  status: "idle",
};

const gamificationSlice = createSlice({
  name: "gamification",
  initialState,
  reducers: {
    // Reducer síncrono para inicializar el usuario al hacer login
    setUserGamificationData: (state, action) => {
      state.userId = action.payload.id;
      state.nivel = action.payload.nivel;
      state.xpActual = action.payload.xp_actual;
      state.xpRequerida = action.payload.nivel * 100;
    },
    limpiarNotificaciones: (state) => {
      state.notificaciones = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(addXpAsync.pending, (state) => {
        state.status = "loading";
      })
      .addCase(addXpAsync.fulfilled, (state, action) => {
        state.status = "succeeded";
        // El backend nos devuelve el estado validado (single source of truth)
        const { usuario, subioNivel } = action.payload;

        state.xpActual = usuario.xp_actual;
        state.nivel = usuario.nivel;
        state.xpRequerida = usuario.xp_requerida_siguiente;

        // Si subió de nivel, disparamos una notificación para el UI
        if (subioNivel) {
          state.notificaciones.push(
            `¡Felicidades! Has alcanzado el Nivel ${usuario.nivel} 🎉`,
          );
        }
      })
      .addCase(addXpAsync.rejected, (state, action) => {
        state.status = "failed";
        console.error("Error al añadir XP:", action.payload);
      });
  },
});

export const { setUserGamificationData, limpiarNotificaciones } =
  gamificationSlice.actions;
export default gamificationSlice.reducer;
