// App.jsx
import { lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";
import { useIsMobile } from "./components/hooks/use-mobile";
import { TourProvider } from "./components/Tour/TourContext";
import {
  PageLoader,
  HomePageSkeleton,
  // BackgroundLoader,
  AIAssistantLoader,
} from "./components/Loading/LoadingComponents";

// Lazy load other components
const AIAssistant = lazy(() => import("./components/AIAssistant/AIAssistant"));
const LightRays = lazy(() => import("./components/reactBits/lightRays"));
const HomePageSection = lazy(
  () => import("./components/HomePageSection/HomePageSection")
);

// const ParticlesBackground = lazy(
//   () => import("./components/lightswind/particles-background")
// );

// const FallBeamBackground = lazy(
//   () => import("./components/lightswind/fall-beam-background")
// );

// Lazy load route pages for code splitting
const MarketJD = lazy(() => import("./pages/MarketJD"));
const Portfolio = lazy(() => import("./pages/Portfolio"));
const LanyardPage = lazy(() => import("./pages/Lanyard"));

// Wrapper component for MarketJD with conditional LightRays background
function MarketJDPage() {
  const isMobile = useIsMobile();
  return (
    <>
      {/* LightRays Background - Only render on non-mobile devices */}
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
            // pulsating={true}
            // saturation={20}
            className="custom-rays"
          />
        </div>
      )}
      {/* MarketJD Content */}
      <div className="relative z-10">
        <MarketJD />
      </div>
    </>
  );
}

// Wrapper component for Portfolio with conditional LightRays background
function PortfolioPage() {
  const isMobile = useIsMobile();

  return (
    <>
      {/* LightRays Background - Only render on non-mobile devices */}
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
            // pulsating={true}
            // saturation={20}
            className="custom-rays"
          />
        </div>
      )}
      {/* Portfolio Content */}
      <div className="relative z-10">
        <Portfolio />
      </div>
    </>
  );
}

function App() {
  return (
    <TourProvider>
      <BrowserRouter>
        <Routes>
          {/* MarketJD Project Detail Page */}
          <Route
            path="/marketjd"
            element={
              <Suspense fallback={<PageLoader />}>
                <MarketJDPage />
              </Suspense>
            }
          />

          {/* Portfolio Project Detail Page */}
          <Route
            path="/portfolio"
            element={
              <Suspense fallback={<PageLoader />}>
                <PortfolioPage />
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

          {/* Main Portfolio Page */}
          <Route
            path="/"
            element={
              <Suspense fallback={<HomePageSkeleton />}>
                <HomePageSection />
              </Suspense>
            }
          />
        </Routes>
        {/* AI Assistant - Available on all routes */}
        <Suspense fallback={<AIAssistantLoader />}>
          <AIAssistant />
        </Suspense>
        {/* <SmokeyCursor
        followMouse={true}
        autoColors={true}
        dyeResolution={1440}
        simulationResolution={256}
      /> */}
        {/* <StripedBackground className={"fixed z-0 blur-xs"} /> */}
        {/* <Suspense fallback={<BackgroundLoader />}>
          <ParticlesBackground />
        </Suspense>
        <Suspense fallback={<BackgroundLoader />}>
          <FallBeamBackground beamCount={5} />
        </Suspense> */}
      </BrowserRouter>
    </TourProvider>
  );
}

export default App;
