// App.jsx
import { lazy, Suspense, type ReactNode } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";
import { useIsMobile } from "./components/hooks/use-mobile";
import { TourProvider } from "./components/Tour/TourContext";
import {
  PageLoader,
  AIAssistantLoader,
} from "./components/Loading/LoadingComponents";

// SEO FIX: HomePageSection loads immediately so critical content (name) is visible to Googlebot
import HomePageSection from "./components/HomePageSection/HomePageSection";

// GSAP global components (scroll progress, page intro, cursor, overlays)
import { GSAPScrollProgress } from "./components/gsap/GSAPScrollProgress";
import { GSAPPageIntro } from "./components/gsap/GSAPPageIntro";
import { GSAPRouteTransition } from "./components/gsap/GSAPRouteTransition";
import { FloatingArchitectureButton } from "./components/SiteArchitecture/FloatingArchitectureButton";

// Lazy load other components (not critical for SEO)
const AIAssistant = lazy(() => import("./components/AIAssistant/AIAssistant"));
const LightRays = lazy(() => import("./components/reactBits/lightRays"));

// Lazy load route pages for code splitting
const MarketJD = lazy(() => import("./pages/MarketJD"));
const LineLeaderPage = lazy(() => import("./pages/LineLeader"));
const Portfolio = lazy(() => import("./pages/Portfolio"));
const LanyardPage = lazy(() => import("./pages/Lanyard"));
const SiteArchitecture = lazy(() => import("./pages/SiteArchitecture"));

// Shared wrapper: renders LightRays background on desktop, skips on mobile
function PageWithLightRays({ children }: { children: ReactNode }) {
  const isMobile = useIsMobile();
  return (
    <>
      {!isMobile && (
        <div className="fixed inset-0 z-0">
          <LightRays
            raysOrigin="top-center"
            raysColor="#ffffff"
            raysSpeed={2}
            lightSpread={10}
            rayLength={0.8}
            followMouse={true}
            mouseInfluence={0.1}
            noiseAmount={0}
            distortion={0.05}
            fadeDistance={10}
            className="custom-rays"
          />
        </div>
      )}
      <div className="relative z-10">
        {children}
      </div>
    </>
  );
}

function App() {
  return (
    <TourProvider>
      <BrowserRouter>
        {/* GSAP global enhancements */}
        <GSAPScrollProgress />
        <GSAPPageIntro />
        <GSAPRouteTransition>
          <Routes>
          {/* MarketJD Project Detail Page */}
          <Route
            path="/marketjd"
            element={
              <Suspense fallback={<PageLoader />}>
                <PageWithLightRays><MarketJD /></PageWithLightRays>
              </Suspense>
            }
          />

          {/* LineLeader Project Detail Page */}
          <Route
            path="/lineleader"
            element={
              <Suspense fallback={<PageLoader />}>
                <PageWithLightRays><LineLeaderPage /></PageWithLightRays>
              </Suspense>
            }
          />

          {/* Portfolio Project Detail Page */}
          <Route
            path="/portfolio"
            element={
              <Suspense fallback={<PageLoader />}>
                <PageWithLightRays><Portfolio /></PageWithLightRays>
              </Suspense>
            }
          />

          {/* Lanyard Interactive Page */}
          <Route
            path="/lanyard"
            element={
              <Suspense fallback={<PageLoader />}>
                <LanyardPage />
              </Suspense>
            }
          />

          {/* Site Architecture Page */}
          <Route
            path="/sitemap"
            element={
              <Suspense fallback={<PageLoader />}>
                <SiteArchitecture />
              </Suspense>
            }
          />

          {/* Main Portfolio Page */}
          {/* SEO FIX: No Suspense wrapper - loads immediately for better SEO */}
          <Route path="/" element={<HomePageSection />} />
          </Routes>
        </GSAPRouteTransition>
        {/* Floating buttons - Available on all routes */}
        <FloatingArchitectureButton />
        <Suspense fallback={<AIAssistantLoader />}>
          <AIAssistant />
        </Suspense>
      </BrowserRouter>
    </TourProvider>
  );
}

export default App;
