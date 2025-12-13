// App.jsx
import { useState, useEffect, lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";
import Header from "./components/Header/Header";
import { HeroSection } from "./components/HeroSection/HeroSection";
// import StripedBackground from "./components/lightswind/StripedBackground";
import FallBeamBackground from "@/components/ui/fall-beam-background";
// @ts-ignore - smokey-cursor is a JS file without type definitions
import SmokeyCursor from "./components/lightswind/smokey-cursor";
import { AboutSection } from "./components/AboutSection/AboutSection";
import { ProjectsSection } from "./components/ProjectsSection/ProjectsSection";
import { EducationSection } from "./components/EducationSection/EducationSection";
import { CareerTimeline } from "./components/CareerSection/CareerTimeline";
import { AchievementsSection } from "./components/AchievementsSection/AchievementsSection";
import { ContactSection } from "./components/ContactSection/ContactSection";
import Dock from "./components/lightswind/dock";
import {
  Home,
  User,
  GraduationCap,
  Briefcase,
  FolderKanban,
  Trophy,
  Mail,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import AIAssistant from "./components/AIAssistant/AIAssistant";
import { useIsMobile } from "./components/hooks/use-mobile";
import { Tour } from "./components/Tour/Tour";
import { TourProvider, useTourContext } from "./components/Tour/TourContext";

// Lazy load route pages for code splitting
const MarketJD = lazy(() => import("./pages/MarketJD"));
const Portfolio = lazy(() => import("./pages/Portfolio"));

// Loading component for lazy-loaded routes
const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center bg-background">
    <div className="text-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
      <p className="text-muted-foreground">Loading...</p>
    </div>
  </div>
);

function HomePage() {
  const [showDock, setShowDock] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0);
  const isMobile = useIsMobile();
  const tour = useTourContext();

  // Track scroll direction
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      // Show dock if scrolling down OR if tour is active and on dock step
      const shouldShowDock = 
        (currentScrollY > lastScrollY && currentScrollY > 100) ||
        (tour.isTourActive && tour.currentStep === 8); // Step 8 is the dock step

      if (shouldShowDock) {
        setShowDock(true);
      } else if (currentScrollY < lastScrollY && !tour.isTourActive) {
        // scrolling up -> hide Dock (unless tour is active)
        setShowDock(false);
      }

      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll);
    
    // Show dock if tour is on dock step
    if (tour.isTourActive && tour.currentStep === 8) {
      setShowDock(true);
    }
    
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [lastScrollY, tour.isTourActive, tour.currentStep]);

  // Helper for smooth scroll using native browser API
  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      const offset = 80;
      const elementPosition = el.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
    }
  };

  // Dock items with responsive icon sizes
  const iconSize = isMobile ? 20 : 24;
  const dockItems = [
    {
      icon: <Home size={iconSize} />,
      label: "Home",
      onClick: () => scrollToSection("hero"),
    },
    {
      icon: <User size={iconSize} />,
      label: "About",
      onClick: () => scrollToSection("about"),
    },
    {
      icon: <GraduationCap size={iconSize} />,
      label: "Education",
      onClick: () => scrollToSection("education"),
    },
    {
      icon: <Briefcase size={iconSize} />,
      label: "Career",
      onClick: () => scrollToSection("career"),
    },
    {
      icon: <FolderKanban size={iconSize} />,
      label: "Projects",
      onClick: () => scrollToSection("projects"),
    },
    {
      icon: <Trophy size={iconSize} />,
      label: "Achievements",
      onClick: () => scrollToSection("achievements"),
    },
    {
      icon: <Mail size={iconSize} />,
      label: "Contact",
      onClick: () => scrollToSection("contact"),
    },
  ];
  return (
    <div className="bg-background min-h-screen w-full">
      <Header />

      <div
        className="w-full bg-transparent max-w-5xl mx-auto px-4 py-8
        lg:rounded-3xl backdrop-blur-xl border-gray-100 dark:border-gray-900"
      >
        <div className="z-10">
          {/* Sections with IDs for smooth scrolling navigation */}
          <HeroSection />
          <AboutSection />
          <EducationSection />
          <CareerTimeline />
          <ProjectsSection />
          <AchievementsSection />
          <ContactSection />
        </div>
      </div>

      {/* Dock with smooth show/hide animation */}
      <AnimatePresence>
        {showDock && (
          <motion.div
            data-dock
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            transition={{ duration: 0.6, ease: "easeInOut" }}
            className={`fixed bottom-2 sm:bottom-4 left-1/2 -translate-x-1/2 w-full max-w-[calc(100vw-1rem)] px-2 sm:px-0 ${
              tour.isTourActive && tour.currentStep === 8 ? "z-[10001]" : "z-[999]"
            }`}
          >
            <Dock
              items={dockItems}
              position="bottom"
              magnification={isMobile ? 60 : 85}
              baseItemSize={isMobile ? 40 : 50}
              distance={isMobile ? 120 : 200}
              panelHeight={isMobile ? 56 : 64}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Tour Component */}
      <Tour
        isActive={tour.isTourActive}
        currentStep={tour.currentStep}
        onNext={tour.nextStep}
        onPrev={tour.prevStep}
        onSkip={tour.skipTour}
        onClose={tour.endTour}
      />
    </div>
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
              <MarketJD />
            </Suspense>
          }
        />

        {/* Portfolio Project Detail Page */}
        <Route
          path="/portfolio"
          element={
            <Suspense fallback={<PageLoader />}>
              <Portfolio />
            </Suspense>
          }
        />

        {/* Main Portfolio Page */}
        <Route path="/" element={<HomePage />} />
      </Routes>
      {/* AI Assistant - Available on all routes */}
      <AIAssistant />
      {/* <SmokeyCursor
        followMouse={true}
        autoColors={true}
        dyeResolution={1440}
        simulationResolution={256}
      /> */}
      {/* <StripedBackground className={"fixed z-0 blur-xs"} /> */}
      <FallBeamBackground className="fixed z-0" />
    </BrowserRouter>
    </TourProvider>
  );
}

export default App;
