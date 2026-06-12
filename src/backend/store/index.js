// src/backend/store/index.js
const { configureStore } = require("@reduxjs/toolkit");
const gamification = require("./gamificationSlice");

const store = configureStore({
  reducer: {
    gamification: gamification.reducer,
  },
});

module.exports = store;
module.exports.actions = { ...gamification.actions };
