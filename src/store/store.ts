import { configureStore } from "@reduxjs/toolkit";

import messageReducer from "../slices/messageSlice";

export const store = configureStore({
  reducer: {
    message: messageReducer,
  },
});

export type AppDispatch = typeof store.dispatch;
export type RootType = ReturnType<typeof store.getState>;
