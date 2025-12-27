import { StrictMode, useEffect, Suspense, lazy } from "react";
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
// import ClickSpark from "./components/reactBits/clickSpark.tsx";
// import Particles from "./components/reactBits/reactBitsParticles.tsx";

const ClickSpark = lazy(() => import("./components/reactBits/clickSpark.tsx"));
const Particles = lazy(
  () => import("./components/reactBits/reactBitsParticles.tsx")
);

// Component to handle theme sync across tabs
function ThemeSync() {
  useEffect(() => {
    // Listen for storage changes (when theme changes in another tab)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "persist:theme" && e.newValue) {
        try {
          const parsed = JSON.parse(e.newValue);
          const theme = parsed.theme;
          if (theme === "dark" || theme === "light") {
            // Dispatch action to update Redux state (setTheme will apply to document)
            store.dispatch(setTheme(theme));
          }
        } catch (error) {
          if (import.meta.env.DEV) {
            console.error("Error parsing theme from storage:", error);
          }
        }
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => {
      window.removeEventListener("storage", handleStorageChange);
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
          <ClickSpark
            sparkColor="#fff"
            sparkSize={10}
            sparkRadius={15}
            sparkCount={8}
            duration={400}
          >
            <div className="fixed inset-0 z-[0] w-full h-full">
              <Particles
                particleColors={["#ffffff", "#ffffff"]}
                particleCount={200}
                particleSpread={10}
                speed={0.1}
                particleBaseSize={100}
                moveParticlesOnHover={true}
                alphaParticles={true}
                disableRotation={false}
                pixelRatio={1}
                cameraDistance={1}
                className="w-full h-full pointer-events-none"
              />
            </div>
            <div className="relative z-[10] !bg-transparent">
              <App />
            </div>
          </ClickSpark>
        </Suspense>
      </PersistGate>
    </Provider>
  </StrictMode>
);
