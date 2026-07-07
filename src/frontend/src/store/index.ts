import { configureStore } from "@reduxjs/toolkit";
import gamificationReducer from "./gamificationSlice";

export const store = configureStore({
  reducer: {
    gamification: gamificationReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
