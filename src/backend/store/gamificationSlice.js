// src/backend/store/gamificationSlice.js
const { createSlice } = require("@reduxjs/toolkit");

const initialState = {
  usuariosActivos: {},
};

const gamificationSlice = createSlice({
  name: "gamification",
  initialState,
  reducers: {
    cargarUsuarioEnMemoria: (state, action) => {
      const { id, xpActual, nivel } = action.payload;
      if (!state.usuariosActivos[id]) {
        state.usuariosActivos[id] = { xpActual, nivel };
      }
    },

    sumarXpA_Usuario: (state, action) => {
      const { id, xpGanada } = action.payload;
      const usuario = state.usuariosActivos[id];

      if (usuario) {
        usuario.xpActual += xpGanada;

        let xpRequerida = usuario.nivel * 100;
        usuario.subioNivel = false;

        while (usuario.xpActual >= xpRequerida) {
          usuario.xpActual -= xpRequerida;
          usuario.nivel += 1;
          usuario.subioNivel = true;
          xpRequerida = usuario.nivel * 100;
        }
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
