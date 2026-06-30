const { createSlice } = require("@reduxjs/toolkit");

const initialState = {
  usuariosActivos: {},
};

const gamificationSlice = createSlice({
  name: "gamification",
  initialState,
  reducers: {
    cargarUsuarioEnMemoria: (state, action) => {
      const { id, xpActual, nivel, puntos, racha } = action.payload;
      if (!state.usuariosActivos[id]) {
        // Añadimos combo actual que inicia en 0 por cada sesión
        state.usuariosActivos[id] = {
          xpActual,
          nivel,
          puntos,
          racha,
          combo: 0,
        };
      }
    },

    procesarFinCancion: (state, action) => {
      const { id, mantuvoCombo, esNuevoDia, rachaPerdida } = action.payload;
      const usuario = state.usuariosActivos[id];

      if (usuario) {
        // 1. LÓGICA DE RACHA DIARIA
        if (rachaPerdida)
          usuario.racha = 1; // Pierde racha, empieza día 1
        else if (esNuevoDia) usuario.racha += 1; // Suma día

        // 2. LÓGICA DE COMBO (Sin pausas ni saltos)
        if (mantuvoCombo) {
          usuario.combo += 1;
        } else {
          usuario.combo = 0; // Se rompió el combo
        }

        // 3. CÁLCULO DE EXPERIENCIA DINÁMICA
        const xpBase = 20;
        const multiplicadorCombo = 1 + usuario.combo * 0.2; // +20% XP por cada canción seguida
        const bonusRacha = usuario.racha * 5; // +5 XP extra por cada día de racha

        const xpGanada = Math.floor(xpBase * multiplicadorCombo + bonusRacha);
        usuario.xpActual += xpGanada;

        // 4. LÓGICA DE NIVEL Y TIENDA
        let xpRequerida = usuario.nivel * 100;
        usuario.subioNivel = false;

        while (usuario.xpActual >= xpRequerida) {
          usuario.xpActual -= xpRequerida;
          usuario.nivel += 1;
          usuario.subioNivel = true;
          usuario.puntos += 50; // Otorga 50 puntos para la tienda por cada Nivel!

          xpRequerida = usuario.nivel * 100;
        }

        // Guardamos cuánta XP ganó en este turno para el feedback del frontend
        usuario.ultimaXpGanada = xpGanada;
      }
    },

    descargarUsuarioDeMemoria: (state, action) => {
      const { id } = action.payload;
      delete state.usuariosActivos[id];
    },
  },
});

module.exports = {
  reducer: gamificationSlice.reducer,
  actions: gamificationSlice.actions,
};
