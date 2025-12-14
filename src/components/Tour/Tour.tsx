import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  ChevronRight,
  ChevronLeft,
  Sparkles,
  Home,
  User,
  GraduationCap,
  Briefcase,
  FolderKanban,
  Trophy,
  Mail,
  Bot,
  Maximize2,
  FileText,
} from "lucide-react";
import { Button } from "../lightswind/button";
import { BorderBeam } from "../lightswind/border-beam";

export interface TourStep {
  id: string;
  target: string;
  title: string;
  content: string;
  position?: "top" | "bottom" | "left" | "right" | "center";
  icon?: React.ReactNode;
}

const TOUR_STEPS: TourStep[] = [
  {
    id: "welcome",
    target: "#hero",
    title: "Welcome to My Portfolio! 👋",
    content:
      "Welcome! This is my interactive portfolio showcasing my work, skills, and achievements. Let me guide you through the different sections.",
    position: "bottom",
    icon: <Sparkles className="w-5 h-5" />,
  },
  {
    id: "header",
    target: "header",
    title: "Navigation Header",
    content:
      "Use the header to navigate between sections. You can toggle between light/dark theme and enter fullscreen mode for a better viewing experience.",
    position: "bottom",
    icon: <Maximize2 className="w-5 h-5" />,
  },
  {
    id: "about",
    target: "#about",
    title: "About Me",
    content:
      "Learn more about who I am, my background, and what drives me as a developer. This section gives you insights into my personality and approach to software development.",
    position: "top",
    icon: <User className="w-5 h-5" />,
  },
  {
    id: "education",
    target: "#education",
    title: "Education & Skills",
    content:
      "Explore my educational background and technical skills. Here you'll find my academic achievements and the technologies I'm proficient in.",
    position: "top",
    icon: <GraduationCap className="w-5 h-5" />,
  },
  {
    id: "career",
    target: "#career",
    title: "Career Timeline",
    content:
      "Discover my professional journey through an interactive timeline. See my work experience, roles, and key achievements throughout my career.",
    position: "top",
    icon: <Briefcase className="w-5 h-5" />,
  },
  {
    id: "projects",
    target: "#projects",
    title: "Featured Projects",
    content:
      "Browse through my portfolio projects. Each project showcases different technologies and solutions I've built. Click on any project to see detailed information.",
    position: "top",
    icon: <FolderKanban className="w-5 h-5" />,
  },
  {
    id: "achievements",
    target: "#achievements",
    title: "Achievements & Awards",
    content:
      "View my notable achievements and recognitions. This includes awards, certifications, and other milestones in my professional journey.",
    position: "top",
    icon: <Trophy className="w-5 h-5" />,
  },
  {
    id: "resume",
    target: "#resume",
    title: "View My Resume",
    content:
      "Explore my professional resume with interactive PDF viewer. You can zoom, search, download, or print the document. Use the toolbar controls for navigation and viewing options.",
    position: "top",
    icon: <FileText className="w-5 h-5" />,
  },
  {
    id: "contact",
    target: "#contact",
    title: "Get In Touch",
    content:
      "Have a project in mind or want to collaborate? Fill out the contact form to reach out. I'm always open to interesting opportunities and conversations.",
    position: "top",
    icon: <Mail className="w-5 h-5" />,
  },
  {
    id: "dock",
    target: "[data-dock]",
    title: "Quick Navigation Dock",
    content:
      "When you scroll down, a navigation dock appears at the bottom. Use it to quickly jump to any section without scrolling back to the top.",
    position: "top",
    icon: <Home className="w-5 h-5" />,
  },
  {
    id: "ai-assistant",
    target: "[data-ai-assistant]",
    title: "AI Assistant",
    content:
      "Meet your AI assistant! Click the floating button to get help, ask questions about my portfolio, or get information about my projects and experience.",
    position: "left",
    icon: <Bot className="w-5 h-5" />,
  },
];

const TOUR_STORAGE_KEY = "portfolio_tour_completed";

export function useTour() {
  const [isTourActive, setIsTourActive] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [hasSeenTour, setHasSeenTour] = useState(false);

  // Check if this is the first visit - only auto-start tour once in lifetime
  useEffect(() => {
    try {
      const tourCompleted = localStorage.getItem(TOUR_STORAGE_KEY);

      if (tourCompleted === "true") {
        // User has seen the tour before
        setHasSeenTour(true);
      } else {
        // First time visiting - auto-start tour after a short delay
        const timer = setTimeout(() => {
          setIsTourActive(true);
        }, 1500);
        return () => clearTimeout(timer);
      }
    } catch (error) {
      // Handle localStorage errors (e.g., private browsing mode)
      console.warn("Tour: Could not access localStorage", error);
    }
  }, []);

  const startTour = useCallback(() => {
    setCurrentStep(0);
    setIsTourActive(true);
    // Prevent body scroll during tour
    document.body.style.overflow = "hidden";
  }, []);

  const endTour = useCallback(() => {
    setIsTourActive(false);
    // Restore body scroll
    document.body.style.overflow = "";
    // Mark tour as completed in localStorage - persists across sessions
    try {
      localStorage.setItem(TOUR_STORAGE_KEY, "true");
    } catch (error) {
      console.warn("Tour: Could not save to localStorage", error);
    }
    setHasSeenTour(true);
  }, []);

  const nextStep = useCallback(() => {
    setCurrentStep((prev) => {
      if (prev < TOUR_STEPS.length - 1) {
        return prev + 1;
      } else {
        endTour();
        return prev;
      }
    });
  }, [endTour]);

  const prevStep = useCallback(() => {
    setCurrentStep((prev) => Math.max(0, prev - 1));
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      // Restore body scroll if component unmounts while tour is active
      if (isTourActive) {
        document.body.style.overflow = "";
      }
    };
  }, [isTourActive]);

  const skipTour = useCallback(() => {
    endTour();
  }, [endTour]);

  return {
    isTourActive,
    currentStep,
    hasSeenTour,
    startTour,
    endTour,
    nextStep,
    prevStep,
    skipTour,
  };
}

interface TourProps {
  isActive: boolean;
  currentStep: number;
  onNext: () => void;
  onPrev: () => void;
  onSkip: () => void;
  onClose: () => void;
}

interface TooltipPosition {
  top: number;
  left: number;
  width: number;
  position: "top" | "bottom" | "left" | "right" | "center";
}

interface ArrowPosition {
  top: number;
  left: number;
  direction: "top" | "bottom" | "left" | "right";
}

// Throttle function for performance
function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean;
  return function (this: any, ...args: Parameters<T>) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}

export function Tour({
  isActive,
  currentStep,
  onNext,
  onPrev,
  onSkip,
  onClose,
}: TourProps) {
  const step = useMemo(() => TOUR_STEPS[currentStep], [currentStep]);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const [tooltipPosition, setTooltipPosition] = useState<TooltipPosition>({
    top: 0,
    left: 0,
    width: 380,
    position: "bottom",
  });
  const [arrowPosition, setArrowPosition] = useState<ArrowPosition | null>(
    null
  );
  const [isPositioning, setIsPositioning] = useState(false);
  const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isNavigatingRef = useRef(false);

  // Improved scroll completion detection with Intersection Observer
  const waitForScrollComplete = useCallback(
    (callback: () => void, targetElement?: Element | null) => {
      let lastScrollTop =
        window.pageYOffset || document.documentElement.scrollTop;
      let scrollEndTimer: NodeJS.Timeout | null = null;
      let rafId: number | null = null;
      let isComplete = false;
      let observer: IntersectionObserver | null = null;
      let fallbackTimer: NodeJS.Timeout | null = null;

      const cleanup = () => {
        isComplete = true;
        if (scrollEndTimer) clearTimeout(scrollEndTimer);
        if (rafId !== null) cancelAnimationFrame(rafId);
        if (fallbackTimer) clearTimeout(fallbackTimer);
        if (observer && targetElement) {
          observer.disconnect();
        }
      };

      // Use Intersection Observer if target element is provided
      if (targetElement) {
        observer = new IntersectionObserver(
          (entries) => {
            const entry = entries[0];
            if (entry.isIntersecting && entry.intersectionRatio > 0.5) {
              // Element is visible, wait a bit for smooth scroll to settle
              if (scrollEndTimer) clearTimeout(scrollEndTimer);
              scrollEndTimer = setTimeout(() => {
                if (!isComplete) {
                  cleanup();
                  callback();
                }
              }, 250);
            }
          },
          { threshold: 0.5, rootMargin: "0px" }
        );

        observer.observe(targetElement);

        // Fallback timeout
        fallbackTimer = setTimeout(() => {
          if (!isComplete) {
            cleanup();
            callback();
          }
        }, 1500);

        return cleanup;
      }

      // Fallback to scroll position tracking
      const checkScroll = () => {
        if (isComplete) return;

        const currentScrollTop =
          window.pageYOffset || document.documentElement.scrollTop;

        if (Math.abs(currentScrollTop - lastScrollTop) < 1) {
          // Scroll has stopped (within 1px tolerance)
          if (scrollEndTimer) {
            clearTimeout(scrollEndTimer);
          }
          scrollEndTimer = setTimeout(() => {
            if (!isComplete) {
              cleanup();
              callback();
            }
          }, 200);
        } else {
          lastScrollTop = currentScrollTop;
          rafId = requestAnimationFrame(checkScroll);
        }
      };

      rafId = requestAnimationFrame(checkScroll);

      // Fallback timeout
      fallbackTimer = setTimeout(() => {
        if (!isComplete) {
          cleanup();
          callback();
        }
      }, 1200);

      return cleanup;
    },
    []
  );

  // Optimized position calculation with error handling
  const calculatePosition = useCallback(() => {
    if (!step || !isActive) return;

    setIsPositioning(true);

    const performPositioning = (targetElement?: Element | null) => {
      requestAnimationFrame(() => {
        try {
          // Update dimensions in case of resize
          const width = window.innerWidth;
          const height = window.innerHeight;
          const isSmall = width < 375;
          const isMobile = width < 768;
          const isTablet = width >= 768 && width < 1024;
          const isLarge = width >= 1920;

          const currentDimensions = {
            width,
            height,
            tooltipWidth: isSmall
              ? 300
              : isMobile
              ? 340
              : isTablet
              ? 400
              : isLarge
              ? 450
              : 420,
            spacing: isSmall
              ? 12
              : isMobile
              ? 16
              : isTablet
              ? 20
              : isLarge
              ? 28
              : 24,
            padding: isSmall
              ? 12
              : isMobile
              ? 16
              : isTablet
              ? 20
              : isLarge
              ? 32
              : 24,
            estimatedHeight: isSmall
              ? 260
              : isMobile
              ? 280
              : isTablet
              ? 300
              : 320,
          };

          const element = targetElement || document.querySelector(step.target);

          if (!element) {
            // Element not found - center tooltip
            setTooltipPosition({
              top: currentDimensions.height / 2,
              left: currentDimensions.width / 2,
              width: currentDimensions.tooltipWidth,
              position: "center",
            });
            setArrowPosition(null);
            setIsPositioning(false);
            return;
          }

          const rect = element.getBoundingClientRect();

          // Check if element is actually visible
          if (rect.width === 0 && rect.height === 0) {
            setTooltipPosition({
              top: currentDimensions.height / 2,
              left: currentDimensions.width / 2,
              width: currentDimensions.tooltipWidth,
              position: "center",
            });
            setArrowPosition(null);
            setIsPositioning(false);
            return;
          }

          const { tooltipWidth, spacing, padding, estimatedHeight } =
            currentDimensions;

          let finalPosition: "top" | "bottom" | "left" | "right" | "center" =
            step.position || "bottom";
          let tooltipTop = 0;
          let tooltipLeft = 0;

          // Smart positioning logic for mobile
          if (
            currentDimensions.width < 768 &&
            (finalPosition === "left" || finalPosition === "right")
          ) {
            finalPosition =
              rect.top > currentDimensions.height / 2 ? "top" : "bottom";
          }

          switch (finalPosition) {
            case "top":
              tooltipTop = rect.top - spacing;
              tooltipLeft = rect.left + rect.width / 2 - tooltipWidth / 2;
              if (tooltipTop < padding) {
                tooltipTop = rect.bottom + spacing;
                finalPosition = "bottom";
              }
              break;
            case "bottom":
              tooltipTop = rect.bottom + spacing;
              tooltipLeft = rect.left + rect.width / 2 - tooltipWidth / 2;
              if (
                tooltipTop + estimatedHeight >
                currentDimensions.height - padding
              ) {
                tooltipTop = Math.max(
                  padding,
                  rect.top - spacing - estimatedHeight
                );
                finalPosition = "top";
              }
              break;
            case "left":
              tooltipTop = rect.top + rect.height / 2 - estimatedHeight / 2;
              tooltipLeft = rect.left - tooltipWidth - spacing;
              if (tooltipLeft < padding) {
                tooltipLeft = rect.right + spacing;
                finalPosition = "right";
              }
              break;
            case "right":
              tooltipTop = rect.top + rect.height / 2 - estimatedHeight / 2;
              tooltipLeft = rect.right + spacing;
              if (
                tooltipLeft + tooltipWidth >
                currentDimensions.width - padding
              ) {
                tooltipLeft = Math.max(
                  padding,
                  rect.left - tooltipWidth - spacing
                );
                finalPosition = "left";
              }
              break;
          }

          // Constrain to viewport with safe margins
          tooltipLeft = Math.max(
            padding,
            Math.min(
              tooltipLeft,
              currentDimensions.width - tooltipWidth - padding
            )
          );
          tooltipTop = Math.max(
            padding,
            Math.min(
              tooltipTop,
              currentDimensions.height - estimatedHeight - padding
            )
          );

          setTooltipPosition({
            top:
              finalPosition === "center"
                ? currentDimensions.height / 2
                : tooltipTop,
            left:
              finalPosition === "center"
                ? currentDimensions.width / 2
                : tooltipLeft,
            width: tooltipWidth,
            position: finalPosition,
          });

          // Calculate arrow position
          if (finalPosition !== "center") {
            const arrowSize =
              currentDimensions.width < 375
                ? 10
                : currentDimensions.width < 768
                ? 11
                : 12;
            let arrowTop = 0;
            let arrowLeft = 0;

            switch (finalPosition) {
              case "top":
                arrowTop = tooltipTop + estimatedHeight - arrowSize;
                arrowLeft = rect.left + rect.width / 2 - arrowSize;
                break;
              case "bottom":
                arrowTop = tooltipTop - arrowSize;
                arrowLeft = rect.left + rect.width / 2 - arrowSize;
                break;
              case "left":
                arrowTop = tooltipTop + estimatedHeight / 2 - arrowSize;
                arrowLeft = tooltipLeft + tooltipWidth - arrowSize;
                break;
              case "right":
                arrowTop = tooltipTop + estimatedHeight / 2 - arrowSize;
                arrowLeft = tooltipLeft - arrowSize;
                break;
            }

            arrowLeft = Math.max(
              padding,
              Math.min(
                arrowLeft,
                currentDimensions.width - arrowSize * 2 - padding
              )
            );
            arrowTop = Math.max(
              padding,
              Math.min(
                arrowTop,
                currentDimensions.height - arrowSize * 2 - padding
              )
            );

            setArrowPosition({
              top: arrowTop,
              left: arrowLeft,
              direction: finalPosition,
            });
          } else {
            setArrowPosition(null);
          }

          setIsPositioning(false);
        } catch (error) {
          console.error("Tour: Error calculating position", error);
          setIsPositioning(false);
        }
      });
    };

    // Smooth scroll to target first, then position
    try {
      if (step.id === "dock") {
        window.scrollTo({
          top: document.documentElement.scrollHeight,
          behavior: "smooth",
        });
        const dockElement = document.querySelector(step.target);
        waitForScrollComplete(
          () => performPositioning(dockElement),
          dockElement
        );
      } else {
        const targetElement = document.querySelector(step.target);
        if (targetElement) {
          targetElement.scrollIntoView({
            behavior: "smooth",
            block: "center",
            inline: "nearest",
          });
          waitForScrollComplete(
            () => performPositioning(targetElement),
            targetElement
          );
        } else {
          performPositioning();
        }
      }
    } catch (error) {
      console.error("Tour: Error scrolling to target", error);
      performPositioning();
    }
  }, [step, isActive, waitForScrollComplete]);

  // Throttled resize handler
  const handleResize = useMemo(
    () =>
      throttle(() => {
        calculatePosition();
      }, 150),
    [calculatePosition]
  );

  // Effect for position calculation with debouncing
  useEffect(() => {
    if (!isActive || !step) return;

    // Clear any pending scroll timeouts
    if (scrollTimeoutRef.current) {
      clearTimeout(scrollTimeoutRef.current);
      scrollTimeoutRef.current = null;
    }

    // Small delay to allow DOM to settle before calculating position
    const timer = setTimeout(() => {
      calculatePosition();
    }, 100); // Slightly increased for better stability

    // Add keyboard navigation with debouncing
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isActive || isNavigatingRef.current) return;

      if (e.key === "Escape") {
        onClose();
      } else if (e.key === "ArrowRight" && (e.ctrlKey || e.metaKey)) {
        e.preventDefault();
        isNavigatingRef.current = true;
        onNext();
        setTimeout(() => {
          isNavigatingRef.current = false;
        }, 500);
      } else if (e.key === "ArrowLeft" && (e.ctrlKey || e.metaKey)) {
        e.preventDefault();
        isNavigatingRef.current = true;
        onPrev();
        setTimeout(() => {
          isNavigatingRef.current = false;
        }, 500);
      }
    };

    window.addEventListener("resize", handleResize, { passive: true });
    window.addEventListener("keydown", handleKeyDown);

    // Focus management for accessibility
    if (tooltipRef.current) {
      tooltipRef.current.focus();
    }

    return () => {
      clearTimeout(timer);
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [
    isActive,
    currentStep,
    step,
    calculatePosition,
    handleResize,
    onClose,
    onNext,
    onPrev,
  ]);

  // Create overlay clip path
  const overlayClipPath = useMemo(() => {
    if (!step || !isActive) return "";

    const targetElement = document.querySelector(step.target);
    if (!targetElement) return "";

    const rect = targetElement.getBoundingClientRect();
    const padding = 10;
    const safeLeft = Math.max(0, rect.left - padding);
    const safeTop = Math.max(0, rect.top - padding);
    const safeRight = Math.min(window.innerWidth, rect.right + padding);
    const safeBottom = Math.min(window.innerHeight, rect.bottom + padding);

    return `polygon(
      0% 0%, 0% 100%,
      ${safeLeft}px 100%,
      ${safeLeft}px ${safeTop}px,
      ${safeRight}px ${safeTop}px,
      ${safeRight}px ${safeBottom}px,
      ${safeLeft}px ${safeBottom}px,
      ${safeLeft}px 100%,
      100% 100%, 100% 0%
    )`;
  }, [step, isActive]);

  if (!isActive || !step) return null;

  const isCenter = tooltipPosition.position === "center";
  const tooltipStyle: React.CSSProperties = isCenter
    ? {
        position: "fixed",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        width: `${tooltipPosition.width}px`,
        maxWidth: "95vw",
      }
    : {
        position: "fixed",
        top: `${tooltipPosition.top}px`,
        left: `${tooltipPosition.left}px`,
        width: `${tooltipPosition.width}px`,
        maxWidth: "95vw",
      };

  return (
    <AnimatePresence mode="wait">
      <div className="fixed inset-0 z-[10000] pointer-events-none">
        {/* Overlay */}
        <motion.div
          key={`overlay-${currentStep}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{
            duration: 0.4,
            ease: [0.4, 0, 0.2, 1],
          }}
          className="bg-black/60 backdrop-blur-sm transition-opacity duration-300"
          style={{ clipPath: overlayClipPath }}
        />

        {/* Arrow */}
        {arrowPosition && (
          <motion.div
            key={`arrow-${currentStep}`}
            initial={{ opacity: 0, scale: 0.5, rotate: -180 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            exit={{ opacity: 0, scale: 0.5, rotate: 180 }}
            transition={{
              type: "spring",
              stiffness: 350,
              damping: 28,
              delay: 0.2,
            }}
            className="pointer-events-none"
            style={{
              position: "fixed",
              top: `${arrowPosition.top}px`,
              left: `${arrowPosition.left}px`,
              width: "24px",
              height: "24px",
            }}
          >
            <div
              className={`w-0 h-0 border-[12px] transition-all duration-300 ${
                arrowPosition.direction === "top"
                  ? "border-t-primary border-r-transparent border-b-transparent border-l-transparent"
                  : arrowPosition.direction === "bottom"
                  ? "border-b-primary border-r-transparent border-t-transparent border-l-transparent"
                  : arrowPosition.direction === "left"
                  ? "border-l-primary border-r-transparent border-t-transparent border-b-transparent"
                  : "border-r-primary border-l-transparent border-t-transparent border-b-transparent"
              }`}
            />
          </motion.div>
        )}

        {/* Tooltip with BorderBeam */}
        <motion.div
          key={`tooltip-${currentStep}`}
          ref={tooltipRef}
          initial={{ opacity: 0, scale: 0.92, y: 20, filter: "blur(4px)" }}
          animate={{
            opacity: 1,
            scale: 1,
            y: 0,
            filter: "blur(0px)",
          }}
          exit={{
            opacity: 0,
            scale: 0.92,
            y: 20,
            filter: "blur(4px)",
          }}
          transition={{
            type: "spring",
            stiffness: 450,
            damping: 32,
            mass: 0.75,
          }}
          className="pointer-events-auto relative bg-background/95 backdrop-blur-md border-2 border-primary/50 rounded-xl shadow-2xl p-4 sm:p-5 md:p-6 overflow-hidden focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
          style={tooltipStyle}
          role="dialog"
          aria-modal="true"
          aria-labelledby={`tour-title-${currentStep}`}
          aria-describedby={`tour-content-${currentStep}`}
          tabIndex={-1}
        >
          {/* BorderBeam wrapper */}
          <BorderBeam />
          {/* Content wrapper with relative positioning for BorderBeam */}
          <div className="relative z-10">
            {/* Header */}
            <motion.div
              className="flex items-start justify-between gap-3 mb-4"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.3 }}
            >
              <div className="flex items-start gap-3 flex-1 min-w-0">
                {step.icon && (
                  <motion.div
                    className="p-2 rounded-lg bg-primary/10 text-primary flex-shrink-0 transition-all duration-300 hover:bg-primary/20 hover:scale-105"
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{
                      type: "spring",
                      stiffness: 300,
                      damping: 20,
                      delay: 0.15,
                    }}
                  >
                    {step.icon}
                  </motion.div>
                )}
                <div className="flex-1 min-w-0">
                  <motion.h3
                    id={`tour-title-${currentStep}`}
                    className="text-base sm:text-lg font-bold text-foreground leading-tight mb-1 break-words"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2, duration: 0.3 }}
                  >
                    {step.title}
                  </motion.h3>
                  <motion.span
                    className="text-xs text-muted-foreground"
                    aria-live="polite"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3, duration: 0.3 }}
                  >
                    Step {currentStep + 1} of {TOUR_STEPS.length}
                  </motion.span>
                </div>
              </div>
              <motion.button
                onClick={onClose}
                className="p-1.5 rounded-lg hover:bg-muted transition-all duration-200 flex-shrink-0 touch-manipulation focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-1 active:scale-95"
                aria-label="Close tour"
                type="button"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.25, type: "spring", stiffness: 300 }}
              >
                <X className="w-4 h-4 sm:w-5 sm:h-5 text-muted-foreground" />
              </motion.button>
            </motion.div>

            {/* Content */}
            <motion.p
              id={`tour-content-${currentStep}`}
              className="text-sm text-muted-foreground mb-6 leading-relaxed break-words"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25, duration: 0.4 }}
            >
              {step.content}
            </motion.p>

            {/* Actions */}
            <motion.div
              className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.4 }}
            >
              <Button
                variant="outline"
                onClick={onSkip}
                className="text-xs sm:text-sm h-9 sm:h-10 order-2 sm:order-1 w-full sm:w-auto transition-all duration-200 hover:scale-105 active:scale-95"
                type="button"
                aria-label="Skip tour"
              >
                Skip Tour
              </Button>
              <div className="flex items-center gap-2 order-1 sm:order-2 w-full sm:w-auto">
                <Button
                  variant="outline"
                  onClick={() => {
                    if (!isNavigatingRef.current) {
                      isNavigatingRef.current = true;
                      onPrev();
                      setTimeout(() => {
                        isNavigatingRef.current = false;
                      }, 500);
                    }
                  }}
                  disabled={currentStep === 0 || isPositioning}
                  className="text-xs sm:text-sm flex items-center gap-1 h-9 sm:h-10 flex-1 sm:flex-initial transition-all duration-200 hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                  type="button"
                  aria-label={`Go to previous step${
                    currentStep === 0 ? " (disabled)" : ""
                  }`}
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span className="hidden sm:inline">Previous</span>
                </Button>
                <Button
                  onClick={() => {
                    if (!isNavigatingRef.current) {
                      isNavigatingRef.current = true;
                      onNext();
                      setTimeout(() => {
                        isNavigatingRef.current = false;
                      }, 500);
                    }
                  }}
                  disabled={isPositioning}
                  className="text-xs sm:text-sm flex items-center gap-1 h-9 sm:h-10 flex-1 sm:flex-initial transition-all duration-200 hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                  type="button"
                  aria-label={
                    currentStep === TOUR_STEPS.length - 1
                      ? "Finish tour"
                      : "Go to next step"
                  }
                >
                  <span>
                    {currentStep === TOUR_STEPS.length - 1 ? "Finish" : "Next"}
                  </span>
                  {currentStep < TOUR_STEPS.length - 1 && (
                    <ChevronRight className="w-4 h-4" />
                  )}
                </Button>
              </div>
            </motion.div>

            {/* Progress */}
            <motion.div
              className="flex items-center justify-center gap-1.5 sm:gap-2 mt-4 pt-4 border-t border-border"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.35, duration: 0.4 }}
            >
              {TOUR_STEPS.map((_, index) => (
                <motion.div
                  key={index}
                  className={`h-1.5 sm:h-2 rounded-full transition-all duration-300 flex-shrink-0 ${
                    index === currentStep
                      ? "w-5 sm:w-6 md:w-8 bg-primary"
                      : index < currentStep
                      ? "w-1.5 sm:w-2 bg-primary/50"
                      : "w-1.5 sm:w-2 bg-muted"
                  }`}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{
                    delay: 0.4 + index * 0.02,
                    type: "spring",
                    stiffness: 300,
                    damping: 25,
                  }}
                />
              ))}
            </motion.div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
