import {
  lazy,
  Suspense,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useLocation } from "react-router-dom";
import { useIsMobile } from "../hooks/use-mobile";
import { useTourContext } from "../Tour/TourContext";
import { useThrottleRAF } from "@/hooks/useThrottle";
import { useGSAPScrollRestoration } from "@/hooks/useGSAPScrollRestoration";
import { gsap } from "@/lib/gsap";
import {
  Briefcase,
  FolderKanban,
  GraduationCap,
  Home,
  Mail,
  Trophy,
  User,
} from "lucide-react";
import { ComponentLoader, SectionLoader } from "../Loading/LoadingComponents";
// SEO FIX: Header and HeroSection are NOT lazy-loaded for better SEO
// Googlebot needs to see the name "Tushar Deomare" immediately
import Header from "../Header/Header";
import { HeroSection } from "../HeroSection/HeroSection";
const AboutSection = lazy(() =>
  import("../AboutSection/AboutSection").then((module) => ({
    default: module.AboutSection,
  }))
);
const ProjectsSection = lazy(() =>
  import("../ProjectsSection/ProjectsSection").then((module) => ({
    default: module.ProjectsSection,
  }))
);
const EducationSection = lazy(() =>
  import("../EducationSection/EducationSection").then((module) => ({
    default: module.EducationSection,
  }))
);
const CareerTimeline = lazy(() =>
  import("../CareerSection/CareerTimeline").then((module) => ({
    default: module.CareerTimeline,
  }))
);
const AchievementsSection = lazy(() =>
  import("../AchievementsSection/AchievementsSection").then((module) => ({
    default: module.AchievementsSection,
  }))
);
const ContactSection = lazy(() =>
  import("../ContactSection/ContactSection").then((module) => ({
    default: module.ContactSection,
  }))
);

const Tour = lazy(() =>
  import("../Tour/Tour").then((module) => ({ default: module.Tour }))
);
const Dock = lazy(() => import("../lightswind/dock"));

const HomePageSection = () => {
  const [showDock, setShowDock] = useState(false);
  const [isDockVisible, setIsDockVisible] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0);
  const isMobile = useIsMobile();
  const tour = useTourContext();
  const location = useLocation();
  const { saveScrollPosition: _saveScrollPosition } = useGSAPScrollRestoration();
  // Handle scroll-to-section when navigating back from project pages
  useEffect(() => {
    const scrollTarget = (location.state as { scrollTo?: string })?.scrollTo;
    if (scrollTarget) {
      // Clear the state so it doesn't re-trigger on re-renders
      window.history.replaceState({}, "");
      // Wait for the DOM to be ready before scrolling
      requestAnimationFrame(() => {
        const el = document.getElementById(scrollTarget);
        if (el) {
          gsap.to(window, {
            scrollTo: { y: el, offsetY: 80 },
            duration: 1,
            ease: "power2.inOut",
          });
        }
      });
    }
  }, [location.state]);

  // Sync visibility state with showDock for smooth animations
  useEffect(() => {
    if (showDock) {
      setIsDockVisible(true);
    } else {
      setIsDockVisible(false);
    }
  }, [showDock]);

  // Track scroll direction - optimized with throttled handler
  const handleScroll = useThrottleRAF(() => {
    const currentScrollY = window.scrollY;

    // Show dock if scrolling down OR if tour is active and on dock step
    const shouldShowDock =
      (currentScrollY > lastScrollY && currentScrollY > 100) ||
      (tour.isTourActive && tour.currentStep === 9); // Step 9 (index) is the dock step

    if (shouldShowDock) {
      setShowDock(true);
    } else if (currentScrollY < lastScrollY && !tour.isTourActive) {
      // scrolling up -> hide Dock (unless tour is active)
      setIsDockVisible(false);
      // Remove from DOM after animation completes
      setTimeout(() => setShowDock(false), 700);
    }

    setLastScrollY(currentScrollY);
  });

  useEffect(() => {
    window.addEventListener("scroll", handleScroll, { passive: true });

    // Show dock if tour is on dock step
    if (tour.isTourActive && tour.currentStep === 9) {
      setShowDock(true);
    }

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [handleScroll, tour.isTourActive, tour.currentStep]);

  const scrollToSection = useCallback((id: string) => {
    const el = document.getElementById(id);
    if (el) {
      gsap.to(window, {
        scrollTo: { y: el, offsetY: 80 },
        duration: 1,
        ease: "power2.inOut",
      });
    }
  }, []);

  // Dock items with responsive icon sizes - memoized
  const iconSize = isMobile ? 20 : 24;
  const dockItems = useMemo(
    () => [
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
    ],
    [iconSize, scrollToSection]
  );
  return (
    <div className="bg-transparent z-10 min-h-screen w-full">
      {/* SEO FIX: Header loads immediately - no lazy loading */}
      <Header />

      <div
        className="w-full bg-transparent max-w-5xl mx-auto px-4 py-8
          lg:rounded-3xl border-gray-100 dark:border-gray-900"
      >
        <div className="relative z-[10]">
          {/* SEO FIX: HeroSection loads immediately so Googlebot sees "Tushar Deomare" */}
          <HeroSection />

          {/* Other sections can remain lazy-loaded as they're below the fold */}
          <Suspense fallback={<SectionLoader />}>
            <AboutSection />
            <EducationSection />
            <CareerTimeline />
            <ProjectsSection />
            <AchievementsSection />
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
};

export default HomePageSection;
