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
import "@fontsource/geist-sans/400.css";
import "@fontsource/geist-sans/700.css";
import { PageLoader } from "./components/Loading/LoadingComponents";

const ClickSpark = lazy(() => import("./components/reactBits/clickSpark.tsx"));
const Particles = lazy(
  () => import("./components/reactBits/reactBitsParticles.tsx")
);

// Detect low-end devices: <4 cores or device memory <4GB or mobile
const isLowEnd =
  (navigator.hardwareConcurrency ?? 4) < 4 ||
  ((navigator as unknown as { deviceMemory?: number }).deviceMemory ?? 8) < 4;
const isMobileDevice = /Mobi|Android|iPhone/i.test(navigator.userAgent);
const particleCount = isMobileDevice ? 50 : isLowEnd ? 80 : 150;

// Component to handle theme sync across tabs
function ThemeSync() {
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "persist:theme" && e.newValue) {
        try {
          const parsed = JSON.parse(e.newValue);
          const theme = parsed.theme;
          if (theme === "dark" || theme === "light") {
            store.dispatch(setTheme(theme));
          }
        } catch {
          // ignore parse errors
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
  const theme = useAppSelector(selectTheme) || "dark";
  const sparkColor = theme === "dark" ? "#fff" : "#000";

  return (
    <ClickSpark
      sparkColor={sparkColor}
      sparkSize={10}
      sparkRadius={30}
      sparkCount={8}
      duration={400}
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
            <div className="fixed inset-0 z-0 w-full h-full pointer-events-none" aria-hidden="true">
              <Particles
                particleColors={["#ffffff", "#000000", "#ffffff", "#000000"]}
                particleCount={particleCount}
                particleSpread={10}
                speed={0.1}
                particleBaseSize={100}
                moveParticlesOnHover={!isMobileDevice}
                alphaParticles={false}
                disableRotation={false}
                pixelRatio={Math.min(window.devicePixelRatio, 1.5)}
                cameraDistance={1}
                className="w-full h-full pointer-events-none"
              />
            </div>
            <div className="relative z-10 bg-transparent">
              <App />
            </div>
          </ThemedClickSpark>
        </Suspense>
      </PersistGate>
    </Provider>
  </StrictMode>
);
