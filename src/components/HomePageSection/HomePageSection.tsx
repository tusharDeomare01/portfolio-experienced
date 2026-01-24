import {
  lazy,
  Suspense,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useIsMobile } from "../hooks/use-mobile";
import { useTourContext } from "../Tour/TourContext";
import { useThrottleRAF } from "@/hooks/useThrottle";
import {
  motion,
  useReducedMotion,
  AnimatePresence,
  type Variants,
} from "framer-motion";
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

// Premium spring configurations for buttery smooth animations
const SPRING_CONFIG = {
  gentle: { mass: 0.5, stiffness: 100, damping: 15 },
  snappy: { mass: 0.3, stiffness: 200, damping: 20 },
  bouncy: { mass: 0.4, stiffness: 300, damping: 25 },
};

// Custom easing for premium feel
const PREMIUM_EASE = [0.25, 0.46, 0.45, 0.94] as const;

// Staggered section animation variants
const sectionVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 60,
    scale: 0.98,
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.8,
      ease: PREMIUM_EASE,
    },
  },
};

// Dock animation variants with spring physics
const dockVariants: Variants = {
  hidden: {
    y: 100,
    opacity: 0,
    scale: 0.9,
  },
  visible: {
    y: 0,
    opacity: 1,
    scale: 1,
    transition: {
      type: "spring",
      ...SPRING_CONFIG.bouncy,
      opacity: { duration: 0.4 },
    },
  },
  exit: {
    y: 100,
    opacity: 0,
    scale: 0.95,
    transition: {
      type: "spring",
      ...SPRING_CONFIG.gentle,
      opacity: { duration: 0.3 },
    },
  },
};

// Animated section wrapper component with scroll-triggered reveal
const AnimatedSection = ({
  children,
  delay = 0,
}: {
  children: React.ReactNode;
  delay?: number;
}) => {
  const prefersReducedMotion = useReducedMotion();

  if (prefersReducedMotion) {
    return <>{children}</>;
  }

  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.15, margin: "-50px" }}
      variants={{
        hidden: sectionVariants.hidden,
        visible: {
          opacity: 1,
          y: 0,
          scale: 1,
          transition: {
            duration: 0.8,
            ease: PREMIUM_EASE,
            delay,
          },
        },
      }}
    >
      {children}
    </motion.div>
  );
};
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

  // Helper for smooth scroll using native browser API
  const scrollToSection = useCallback((id: string) => {
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

          {/* Premium animated sections with staggered scroll reveals */}
          <Suspense fallback={<SectionLoader />}>
            <AnimatedSection delay={0}>
              <AboutSection />
            </AnimatedSection>

            <AnimatedSection delay={0.05}>
              <EducationSection />
            </AnimatedSection>

            <AnimatedSection delay={0.05}>
              <CareerTimeline />
            </AnimatedSection>

            <AnimatedSection delay={0.05}>
              <ProjectsSection />
            </AnimatedSection>

            <AnimatedSection delay={0.05}>
              <AchievementsSection />
            </AnimatedSection>

            <AnimatedSection delay={0.05}>
              <ContactSection />
            </AnimatedSection>
          </Suspense>
        </div>
      </div>

      {/* Dock with premium spring-based show/hide animation */}
      <AnimatePresence mode="wait">
        {showDock && (
          <motion.div
            data-dock
            key="dock"
            variants={dockVariants}
            initial="hidden"
            animate={isDockVisible ? "visible" : "hidden"}
            exit="exit"
            className={`fixed bottom-2 sm:bottom-4 left-1/2 -translate-x-1/2 w-full max-w-[calc(100vw-1rem)] px-2 sm:px-0 ${
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
                spring={SPRING_CONFIG.snappy}
              />
            </Suspense>
          </motion.div>
        )}
      </AnimatePresence>

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
