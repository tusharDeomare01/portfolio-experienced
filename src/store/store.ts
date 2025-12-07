import { configureStore, type Middleware } from "@reduxjs/toolkit";
import { persistStore, persistReducer, REHYDRATE } from "redux-persist";
import storage from "redux-persist/lib/storage";
import chatReducer from "./slices/chatSlice";
import themeReducer from "./slices/themeSlice";

const persistedChatReducer = persistReducer(
  { key: "chat", storage },
  chatReducer
);

const persistedThemeReducer = persistReducer(
  { key: "theme", storage },
  themeReducer
);

// Middleware to apply theme on rehydration
const themeRehydrationMiddleware: Middleware =
  () => (next) => (action: any) => {
    if (action.type === REHYDRATE && action.key === "theme" && action.payload) {
      const theme = action.payload.theme;
      if (theme === "dark" || theme === "light") {
        if (theme === "dark") {
          document.documentElement.classList.add("dark");
        } else {
          document.documentElement.classList.remove("dark");
        }
      }
    }
    return next(action);
  };

export const store = configureStore({
  reducer: {
    chat: persistedChatReducer,
    theme: persistedThemeReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ["persist/PERSIST", "persist/REHYDRATE"],
      },
    }).concat(themeRehydrationMiddleware),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
