// App.jsx
import { useState, useEffect, lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";
import {
  Home,
  User,
  GraduationCap,
  Briefcase,
  FolderKanban,
  Trophy,
  FileText,
  Mail,
} from "lucide-react";
import { useIsMobile } from "./components/hooks/use-mobile";
import { TourProvider, useTourContext } from "./components/Tour/TourContext";
import {
  PageLoader,
  SectionLoader,
  ComponentLoader,
  HeaderLoader,
  BackgroundLoader,
  AIAssistantLoader,
} from "./components/Loading/LoadingComponents";

// Lazy load section components
const Header = lazy(() => import("./components/Header/Header"));
const HeroSection = lazy(() =>
  import("./components/HeroSection/HeroSection").then((module) => ({
    default: module.HeroSection,
  }))
);
const AboutSection = lazy(() =>
  import("./components/AboutSection/AboutSection").then((module) => ({
    default: module.AboutSection,
  }))
);
const ProjectsSection = lazy(() =>
  import("./components/ProjectsSection/ProjectsSection").then((module) => ({
    default: module.ProjectsSection,
  }))
);
const EducationSection = lazy(() =>
  import("./components/EducationSection/EducationSection").then((module) => ({
    default: module.EducationSection,
  }))
);
const CareerTimeline = lazy(() =>
  import("./components/CareerSection/CareerTimeline").then((module) => ({
    default: module.CareerTimeline,
  }))
);
const AchievementsSection = lazy(() =>
  import("./components/AchievementsSection/AchievementsSection").then(
    (module) => ({ default: module.AchievementsSection })
  )
);
const ContactSection = lazy(() =>
  import("./components/ContactSection/ContactSection").then((module) => ({
    default: module.ContactSection,
  }))
);
const ResumeSection = lazy(() =>
  import("./components/ResumeSection/ResumeSection").then((module) => ({
    default: module.ResumeSection,
  }))
);

// Lazy load other components
const AIAssistant = lazy(() => import("./components/AIAssistant/AIAssistant"));
const Tour = lazy(() =>
  import("./components/Tour/Tour").then((module) => ({ default: module.Tour }))
);
const Dock = lazy(() => import("./components/lightswind/dock"));

const ParticlesBackground = lazy(
  () => import("./components/lightswind/particles-background")
);

const FallBeamBackground = lazy(
  () => import("./components/lightswind/fall-beam-background")
);

// Lazy load route pages for code splitting
const MarketJD = lazy(() => import("./pages/MarketJD"));
const Portfolio = lazy(() => import("./pages/Portfolio"));

function HomePage() {
  const [showDock, setShowDock] = useState(false);
  const [isDockVisible, setIsDockVisible] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0);
  const isMobile = useIsMobile();
  const tour = useTourContext();

  // Sync visibility state with showDock for smooth animations
  useEffect(() => {
    if (showDock) {
      setIsDockVisible(true);
    } else {
      setIsDockVisible(false);
    }
  }, [showDock]);

  // Track scroll direction
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      // Show dock if scrolling down OR if tour is active and on dock step
      const shouldShowDock =
        (currentScrollY > lastScrollY && currentScrollY > 100) ||
        (tour.isTourActive && tour.currentStep === 9); // Step 9 is the dock step

      if (shouldShowDock) {
        setShowDock(true);
      } else if (currentScrollY < lastScrollY && !tour.isTourActive) {
        // scrolling up -> hide Dock (unless tour is active)
        setIsDockVisible(false);
        // Remove from DOM after animation completes
        setTimeout(() => setShowDock(false), 700);
      }

      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll);

    // Show dock if tour is on dock step
    if (tour.isTourActive && tour.currentStep === 9) {
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
      icon: <FileText size={iconSize} />,
      label: "Resume",
      onClick: () => scrollToSection("resume"),
    },
    {
      icon: <Mail size={iconSize} />,
      label: "Contact",
      onClick: () => scrollToSection("contact"),
    },
  ];
  return (
    <div className="bg-background min-h-screen w-full">
      <Suspense fallback={<HeaderLoader />}>
        <Header />
      </Suspense>

      <div
        className="w-full bg-transparent max-w-5xl mx-auto px-4 py-8
        lg:rounded-3xl backdrop-blur-xl border-gray-100 dark:border-gray-900"
      >
        <div className="z-[111]">
          {/* Sections with IDs for smooth scrolling navigation */}
          <Suspense fallback={<SectionLoader />}>
            <HeroSection />
            <AboutSection />
            <EducationSection />
            <CareerTimeline />
            <ProjectsSection />
            <AchievementsSection />
            <ResumeSection />
            <ContactSection />
          </Suspense>
        </div>
      </div>

      {/* Dock with smooth show/hide animation */}

      {showDock && (
        <div
          data-dock
          className={`fixed bottom-2 sm:bottom-4 left-1/2 -translate-x-1/2 w-full max-w-[calc(100vw-1rem)] px-2 sm:px-0 transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] ${
            isDockVisible
              ? "translate-y-0 opacity-100 scale-100"
              : "translate-y-[100px] opacity-0 scale-95"
          } ${
            tour.isTourActive && tour.currentStep === 9
              ? "z-[10001]"
              : "z-[999]"
          }`}
          style={{ willChange: "transform, opacity" }}
        >
          <Suspense fallback={<ComponentLoader />}>
            <Dock
              items={dockItems}
              position="bottom"
              magnification={isMobile ? 60 : 85}
              baseItemSize={isMobile ? 40 : 50}
              distance={isMobile ? 120 : 200}
              panelHeight={isMobile ? 56 : 64}
            />
          </Suspense>
        </div>
      )}

      {/* Tour Component */}
      <Suspense fallback={<ComponentLoader />}>
        <Tour
          isActive={tour.isTourActive}
          currentStep={tour.currentStep}
          onNext={tour.nextStep}
          onPrev={tour.prevStep}
          onSkip={tour.skipTour}
          onClose={tour.endTour}
        />
      </Suspense>
    </div>
  );
}

function App() {
  const isMobile = useIsMobile();

  return (
    <TourProvider>
      <BrowserRouter>
        <Routes>
          {/* MarketJD Project Detail Page */}
          <Route
            path="/marketjd"
            element={
              <Suspense fallback={<PageLoader />}>
                <>
                  <div className="z-[111]">
                    <MarketJD />
                  </div>
                </>
              </Suspense>
            }
          />

          {/* Portfolio Project Detail Page */}
          <Route
            path="/portfolio"
            element={
              <Suspense fallback={<PageLoader />}>
                <>
                  <div className="z-[111]">
                    <Portfolio />
                  </div>
                </>
              </Suspense>
            }
          />

          {/* Main Portfolio Page */}
          <Route path="/" element={<HomePage />} />
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
        {!isMobile && (
          <>
            <Suspense fallback={<BackgroundLoader />}>
              <ParticlesBackground />
            </Suspense>
            <Suspense fallback={<BackgroundLoader />}>
              <FallBeamBackground beamCount={5} />
            </Suspense>
          </>
        )}
      </BrowserRouter>
    </TourProvider>
  );
}

export default App;
