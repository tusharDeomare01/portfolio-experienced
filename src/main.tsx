import { StrictMode, useEffect, Suspense } from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { store, persistor } from "./store/store";
import { setTheme } from "./store/slices/themeSlice";
import "./index.css";
import App from "./App.tsx";
import "@fontsource/geist-sans/400.css"; // Specific weight
import "@fontsource/geist-sans/700.css"; // Bold
import { PageLoader } from "./components/Loading/LoadingComponents";

// Component to handle theme sync across tabs
function ThemeSync() {
  useEffect(() => {
    // Listen for storage changes (when theme changes in another tab)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'persist:theme' && e.newValue) {
        try {
          const parsed = JSON.parse(e.newValue);
          const theme = parsed.theme;
          if (theme === 'dark' || theme === 'light') {
            // Dispatch action to update Redux state (setTheme will apply to document)
            store.dispatch(setTheme(theme));
          }
        } catch (error) {
          console.error('Error parsing theme from storage:', error);
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  return null;
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Provider store={store}>
      <PersistGate loading={<PageLoader />} persistor={persistor}>
        <ThemeSync />
        <Suspense fallback={<PageLoader />}>
          <App />
        </Suspense>
      </PersistGate>
    </Provider>
  </StrictMode>
);
