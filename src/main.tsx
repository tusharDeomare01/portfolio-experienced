import React, { StrictMode, useEffect, Suspense, lazy } from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { store, persistor } from "./store/store";
import { setTheme } from "./store/slices/themeSlice";
import { useAppSelector } from "./store/hooks";
import { selectTheme } from "./store/hooks";
import "./index.css";
import App from "./App.tsx";
import "@fontsource/geist-sans/400.css"; // Specific weight
import "@fontsource/geist-sans/700.css"; // Bold
import {
  // BackgroundLoader,
  PageLoader,
} from "./components/Loading/LoadingComponents";
// import ClickSpark from "./components/reactBits/clickSpark.tsx";
// import Particles from "./components/reactBits/reactBitsParticles.tsx";

const ClickSpark = lazy(() => import("./components/reactBits/clickSpark.tsx"));
const Particles = lazy(
  () => import("./components/reactBits/reactBitsParticles.tsx")
);
const GlobeBackground = lazy(
  () => import("./components/reactBits/globeBackground.tsx")
);
// const FallBeamBackground = lazy(
//   () => import("./components/lightswind/fall-beam-background")
// );

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

// Component to wrap ClickSpark with theme-aware spark color
function ThemedClickSpark({ children }: { children: React.ReactNode }) {
  const theme = useAppSelector(selectTheme) || "dark"; // Default to dark theme
  const sparkColor = theme === "dark" ? "#fff" : "#000"; // White for dark theme, black for light theme

  return (
    <ClickSpark
      sparkColor={sparkColor}
      sparkSize={10}
      sparkRadius={30}
      sparkCount={10}
      duration={500}
    >
      {children}
    </ClickSpark>
  );
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Provider store={store}>
      <PersistGate loading={<PageLoader />} persistor={persistor}>
        <ThemeSync />
        <Suspense fallback={<PageLoader />}>
          <ThemedClickSpark>
            <div className="fixed inset-0 z-[0] w-full h-full">
              <Particles
                particleColors={["#ffffff", "#000000", "#ffffff", "#000000"]}
                particleCount={200}
                particleSpread={10}
                speed={0.1}
                particleBaseSize={100}
                moveParticlesOnHover={true}
                alphaParticles={false}
                disableRotation={false}
                pixelRatio={Math.min(window.devicePixelRatio, 2)}
                cameraDistance={1}
                className="w-full h-full pointer-events-none"
              />
            </div>
            <div className="fixed inset-0 z-[1] w-full h-full pointer-events-none">
              <GlobeBackground className="w-full h-full" />
            </div>
            <div
              className="relative z-[10] !bg-transparent transition-opacity duration-300 ease-out
             opacity-100"
            >
              {/* <Suspense fallback={<BackgroundLoader />}>
                <FallBeamBackground beamCount={5} />
              </Suspense> */}
              <App />
            </div>
          </ThemedClickSpark>
        </Suspense>
      </PersistGate>
    </Provider>
  </StrictMode>
);
