import { useState, useEffect, useCallback, useMemo, memo } from "react";
import { motion } from "framer-motion";
import ThreeDCarousel from "../lightswind/ThreeDCarousel";
import type { ThreeDCarouselItem } from "../lightswind/ThreeDCarousel";
import { ScrollReveal } from "../lightswind/scroll-reveal";
import { Trophy, X } from "lucide-react";

// Performance tiers for device optimization
const PERFORMANCE_TIERS = {
  LOW: "low",
  MID: "mid",
  HIGH: "high",
} as const;

// Device performance detection (optimized for low-end devices)
const detectDevicePerformance = (): typeof PERFORMANCE_TIERS[keyof typeof PERFORMANCE_TIERS] => {
  if (typeof window === "undefined") return PERFORMANCE_TIERS.MID;
  
  // Check hardware concurrency (CPU cores)
  const cores = navigator.hardwareConcurrency || 2;
  
  // Check device memory (if available)
  const memory = (navigator as any).deviceMemory || 4;
  
  // Check if it's a mobile device
  const isMobileDevice = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent
  );
  
  // Low-end: mobile with <= 2 cores or <= 2GB RAM
  if (isMobileDevice && (cores <= 2 || memory <= 2)) {
    return PERFORMANCE_TIERS.LOW;
  }
  
  // Mid-range: 2-4 cores or 2-4GB RAM, or mobile with more resources
  if (cores <= 4 || memory <= 4 || isMobileDevice) {
    return PERFORMANCE_TIERS.MID;
  }
  
  // High-end: > 4 cores and > 4GB RAM
  return PERFORMANCE_TIERS.HIGH;
};

// Extract static achievements data to constants
const ACHIEVEMENTS_DATA: ThreeDCarouselItem[] = [
  {
    id: "1",
    image: "/image-1.png",
    title: "Above & Beyond Award Ceremony",
    description:
      "Receiving the prestigious 'Above & Beyond' award from Thinkitive, recognizing exceptional dedication and outstanding contributions to the company's success.",
  },
  {
    id: "2",
    image: "/image-2.png",
    title: "Thinkitive Above & Beyond Award 2024",
    description:
      "Honored with the 'Above & Beyond of the Year 2024' trophy, celebrating relentless effort and selfless dedication in driving innovation and excellence.",
  },
  {
    id: "3",
    image: "/image-3.png",
    title: "Recognition Certificate",
    description:
      "Certificate of recognition for transforming challenges into opportunities and playing a pivotal role in driving Thinkitive Inc. to new heights during their Glorious 10 Years celebration.",
  },
] as const;

// Extract className strings to constants
const CONTAINER_CLASSES =
  "text-foreground max-w-7xl mx-auto w-full px-4 sm:px-6 py-12 sm:py-16 md:py-20 min-h-screen flex flex-col justify-center";
const HEADING_CONTAINER_CLASSES = "flex flex-col items-center justify-center mb-8 sm:mb-12";
const HEADER_CLASSES = "flex items-baseline justify-center gap-4 mb-3 sm:mb-4";
const ICON_CLASSES =
  "w-8 h-8 md:w-10 md:h-10 lg:w-12 lg:h-12 text-primary flex-shrink-0 mt-1 md:mt-1.5 lg:mt-2";
const CAROUSEL_WRAPPER_CLASSES = "w-full overflow-hidden";
const BACKDROP_CLASSES =
  "fixed inset-0 z-[100] bg-black/60 dark:bg-black/80 backdrop-blur-sm";
const MODAL_CLASSES =
  "fixed inset-0 z-[101] flex items-center justify-center p-4 sm:p-6 md:p-8";
const MODAL_CONTENT_CLASSES =
  "relative w-full max-w-5xl max-h-[92vh] bg-background dark:bg-background rounded-xl shadow-2xl dark:shadow-black/50 overflow-hidden flex flex-col border border-border dark:border-border/50";
const CLOSE_BUTTON_CLASSES =
  "absolute top-4 right-4 z-10 p-1.5 rounded-md bg-background/80 dark:bg-background/60 hover:bg-muted dark:hover:bg-muted/80 transition-colors duration-200 cursor-pointer border border-border/50 dark:border-border/30";
const IMAGE_SECTION_CLASSES =
  "relative w-full bg-gradient-to-b from-muted/40 via-muted/30 to-muted/40 dark:from-muted/30 dark:via-muted/20 dark:to-muted/30";
const IMAGE_CONTAINER_CLASSES =
  "w-full h-[45vh] sm:h-[55vh] md:h-[60vh] flex items-center justify-center p-8 sm:p-12 md:p-16";
const CONTENT_SECTION_CLASSES =
  "flex-1 overflow-y-auto px-6 sm:px-8 md:px-10 py-6 sm:py-8 bg-background";

// Extract ScrollReveal props to constants
const TITLE_REVEAL_PROPS = {
  size: "xl" as const,
  align: "center" as const,
  variant: "default" as const,
  baseRotation: 0,
} as const;

const SUBTITLE_REVEAL_PROPS = {
  size: "sm" as const,
  align: "center" as const,
  variant: "muted" as const,
  baseRotation: 0,
  containerClassName: "max-w-2xl px-4",
} as const;

const AchievementsSectionComponent = () => {
  // Device performance detection (memoized, only runs once)
  const devicePerformance = useMemo(() => detectDevicePerformance(), []);

  // Check for reduced motion preference
  const prefersReducedMotion = useMemo(() => {
    if (typeof window === "undefined") return false;
    return window.matchMedia?.("(prefers-reduced-motion: reduce)").matches ?? false;
  }, []);

  const [achievements] = useState<ThreeDCarouselItem[]>(ACHIEVEMENTS_DATA);
  const [selectedAchievement, setSelectedAchievement] =
    useState<ThreeDCarouselItem | null>(null);

  // Memoize blur settings based on device performance
  const blurSettings = useMemo(() => {
    if (devicePerformance === PERFORMANCE_TIERS.LOW || prefersReducedMotion) {
      return { enableBlur: false, blurStrength: 0 };
    }
    return { enableBlur: true, blurStrength: devicePerformance === PERFORMANCE_TIERS.MID ? 3 : 5 };
  }, [devicePerformance, prefersReducedMotion]);

  const handleItemClick = useCallback((item: ThreeDCarouselItem) => {
    setSelectedAchievement(item);
  }, []);

  const closeModal = useCallback(() => {
    setSelectedAchievement(null);
  }, []);

  // Handle ESC key to close modal and prevent body scroll
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && selectedAchievement) {
        closeModal();
      }
    };

    if (selectedAchievement) {
      document.addEventListener("keydown", handleEscape);
      // Prevent body scroll when modal is open
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [selectedAchievement, closeModal]);

  // Optimize animation configs based on device performance
  const sectionAnimation = useMemo(() => {
    if (prefersReducedMotion) {
      return {
        initial: { opacity: 0 },
        whileInView: { opacity: 1 },
        transition: { duration: 0.2 },
      };
    }

    if (devicePerformance === PERFORMANCE_TIERS.LOW) {
      return {
        initial: { opacity: 0, y: 20 },
        whileInView: { opacity: 1, y: 0 },
        transition: { duration: 0.4 },
      };
    }

    return {
      initial: { opacity: 0, y: 50, filter: "blur(5px)" },
      whileInView: { opacity: 1, y: 0, filter: "blur(0px)" },
      transition: { duration: 1.8 },
    };
  }, [devicePerformance, prefersReducedMotion]);

  // Optimize modal animations based on device performance
  const modalBackdropAnimation = useMemo(() => {
    if (prefersReducedMotion) {
      return {
        initial: { opacity: 0 },
        animate: { opacity: 1 },
        exit: { opacity: 0 },
        transition: { duration: 0.15 },
      };
    }

    return {
      initial: { opacity: 0 },
      animate: { opacity: 1 },
      exit: { opacity: 0 },
      transition: {
        duration: devicePerformance === PERFORMANCE_TIERS.LOW ? 0.2 : 0.3,
      },
    };
  }, [devicePerformance, prefersReducedMotion]);

  const modalContentAnimation = useMemo(() => {
    if (prefersReducedMotion) {
      return {
        initial: { opacity: 0 },
        animate: { opacity: 1 },
        exit: { opacity: 0 },
        transition: { duration: 0.15 },
      };
    }

    if (devicePerformance === PERFORMANCE_TIERS.LOW) {
      return {
        initial: { opacity: 0, scale: 0.98 },
        animate: { opacity: 1, scale: 1 },
        exit: { opacity: 0, scale: 0.98 },
        transition: {
          type: "tween" as const,
          duration: 0.2,
        },
      };
    }

    return {
      initial: { opacity: 0, scale: 0.95 },
      animate: { opacity: 1, scale: 1 },
      exit: { opacity: 0, scale: 0.95 },
      transition: {
        type: "spring" as const,
        stiffness: 300,
        damping: 30,
        duration: 0.3,
      },
    };
  }, [devicePerformance, prefersReducedMotion]);

  const imageAnimation = useMemo(() => {
    if (prefersReducedMotion || devicePerformance === PERFORMANCE_TIERS.LOW) {
      return {
        initial: { opacity: 0 },
        animate: { opacity: 1 },
        transition: { duration: 0.2 },
      };
    }

    return {
      initial: { opacity: 0, scale: 0.98 },
      animate: { opacity: 1, scale: 1 },
      transition: { duration: 0.4 },
    };
  }, [devicePerformance, prefersReducedMotion]);

  const contentAnimation = useMemo(() => {
    if (prefersReducedMotion || devicePerformance === PERFORMANCE_TIERS.LOW) {
      return {
        initial: { opacity: 0 },
        animate: { opacity: 1 },
        transition: { duration: 0.2 },
      };
    }

    return {
      initial: { opacity: 0, y: 10 },
      animate: { opacity: 1, y: 0 },
      transition: { delay: 0.15, duration: 0.3 },
    };
  }, [devicePerformance, prefersReducedMotion]);

  // Optimize backdrop blur based on device performance
  const backdropBlurClass = useMemo(() => {
    if (devicePerformance === PERFORMANCE_TIERS.LOW) {
      return "backdrop-blur-0"; // Remove blur on low-end devices
    }
    return "backdrop-blur-sm";
  }, [devicePerformance]);

  return (
    <motion.section
      id="achievements"
      className={`${CONTAINER_CLASSES} transform-gpu will-change-transform`}
      {...sectionAnimation}
      viewport={{ once: true, amount: 0.2 }}
    >
      {/* Centered Heading */}
      <div className={HEADING_CONTAINER_CLASSES}>
        <div className={HEADER_CLASSES}>
          <Trophy className={ICON_CLASSES} />
          <ScrollReveal
            {...TITLE_REVEAL_PROPS}
            enableBlur={blurSettings.enableBlur}
            blurStrength={blurSettings.blurStrength}
          >
            Achievements
          </ScrollReveal>
        </div>
        <ScrollReveal
          {...SUBTITLE_REVEAL_PROPS}
          enableBlur={blurSettings.enableBlur}
          blurStrength={blurSettings.blurStrength}
        >
          Showcasing career milestones, awards, and notable accomplishments
        </ScrollReveal>
      </div>

      {/* 3D Carousel */}
      <div className={CAROUSEL_WRAPPER_CLASSES}>
        <ThreeDCarousel
          items={achievements}
          autoRotate={true}
          rotateInterval={devicePerformance === PERFORMANCE_TIERS.LOW ? 3000 : 2500}
          onItemClick={handleItemClick}
          pauseAutoRotate={!!selectedAchievement}
        />
      </div>

      {/* Detailed View Modal */}
      {selectedAchievement && (
        <>
          {/* Backdrop */}
          <motion.div
            {...modalBackdropAnimation}
            className={`${BACKDROP_CLASSES} ${backdropBlurClass}`}
            onClick={closeModal}
          />

          {/* Modal Content */}
          <motion.div
            {...modalContentAnimation}
            className={`${MODAL_CLASSES} transform-gpu will-change-transform`}
            onClick={(e) => e.stopPropagation()}
          >
            <div className={MODAL_CONTENT_CLASSES}>
              {/* Close Button */}
              <button
                onClick={closeModal}
                className={CLOSE_BUTTON_CLASSES}
                aria-label="Close modal"
              >
                <X className="h-4 w-4 sm:h-5 sm:w-5 text-muted-foreground hover:text-foreground transition-colors" />
              </button>

              {/* Image Section */}
              <div className={IMAGE_SECTION_CLASSES}>
                <div className={IMAGE_CONTAINER_CLASSES}>
                  <motion.div
                    className="relative w-full h-full flex items-center justify-center transform-gpu will-change-transform"
                    {...imageAnimation}
                  >
                    <img
                      src={selectedAchievement.image}
                      alt={selectedAchievement.title || "Achievement"}
                      className="max-w-full max-h-full w-auto h-auto object-contain brightness-105 contrast-105 dark:brightness-100 dark:contrast-100 drop-shadow-2xl dark:drop-shadow-lg"
                      style={{
                        filter:
                          "brightness(1.05) contrast(1.05) saturate(1.02)",
                      }}
                      loading="lazy"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src =
                          "https://images.pexels.com/photos/3184433/pexels-photo-3184433.jpeg?auto=compress&cs=tinysrgb&w=800";
                      }}
                    />
                  </motion.div>
                </div>
              </div>

              {/* Content Section */}
              <div className={CONTENT_SECTION_CLASSES}>
                <motion.div
                  {...contentAnimation}
                  className="space-y-3 sm:space-y-4 max-w-3xl mx-auto"
                >
                  {/* Title */}
                  {selectedAchievement.title && (
                    <h2 className="text-xl sm:text-2xl md:text-3xl font-semibold text-foreground leading-tight tracking-tight">
                      {selectedAchievement.title}
                    </h2>
                  )}

                  {/* Description */}
                  {selectedAchievement.description && (
                    <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                      {selectedAchievement.description}
                    </p>
                  )}
                </motion.div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </motion.section>
  );
};

// Memoize component to prevent unnecessary re-renders
export const AchievementsSection = memo(AchievementsSectionComponent);
