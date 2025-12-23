import { cn } from "../lib/utils";
import { motion } from "framer-motion";
import { useEffect, useState, useMemo, useRef, memo } from "react";

// Page Visibility API hook for pausing animations when tab is not visible
const usePageVisibility = () => {
  const [isVisible, setIsVisible] = useState(() => {
    if (typeof document === "undefined") return true;
    return !document.hidden;
  });

  useEffect(() => {
    if (typeof document === "undefined") return;

    const handleVisibilityChange = () => {
      setIsVisible(!document.hidden);
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);

  return isVisible;
};

interface FallBeamBackgroundProps {
  /**
   * The number of beams to render (auto-adjusted for mobile)
   */
  beamCount?: number;
  /**
   * The width of each beam (auto-adjusted for mobile)
   */
  beamWidth?: number;
  /**
   * The duration of the fall animation in seconds (auto-adjusted for mobile)
   */
  duration?: number;
  /**
   * The delay between beams starting their animation
   */
  staggerDelay?: number;
  /**
   * The color gradient from (top) - light mode
   */
  colorFrom?: string;
  /**
   * The color gradient to (bottom) - light mode
   */
  colorTo?: string;
  /**
   * The color gradient from (top) - dark mode
   */
  darkColorFrom?: string;
  /**
   * The color gradient to (bottom) - dark mode
   */
  darkColorTo?: string;
  /**
   * The class name for the container
   */
  className?: string;
  /**
   * The opacity of the beams (light mode)
   */
  opacity?: number;
  /**
   * The opacity of the beams (dark mode)
   */
  darkOpacity?: number;
  /**
   * Whether to enable the animation
   */
  animate?: boolean;
  /**
   * Enable glow effect around beams
   */
  enableGlow?: boolean;
}

// Constants moved outside component to avoid recreation
const MOBILE_BREAKPOINT = 768;
const DEFAULT_STAGGER_DELAY = 0.5;
const DEFAULT_COLOR_FROM = "#d48aff";
const DEFAULT_COLOR_TO = "#ff40d9";
const DEFAULT_DARK_COLOR_FROM = "#9333ea";
const DEFAULT_DARK_COLOR_TO = "#ec4899";
const DEFAULT_OPACITY = 0.25;
const DEFAULT_DARK_OPACITY = 0.35;
const HEIGHT_OFFSET = "150vh";
const ANIMATION_END_OFFSET = "250vh";
const INITIAL_Y_OFFSET = "-150vh";

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

// Optimized random seed generator for stable beam positions
const generateStableRandom = (seed: number): number => {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
};

// Debounce utility for resize events
const debounce = <T extends (...args: any[]) => void>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: ReturnType<typeof setTimeout> | null = null;
  return (...args: Parameters<T>) => {
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};

function FallBeamBackgroundComponent({
  beamCount,
  beamWidth,
  duration,
  staggerDelay = DEFAULT_STAGGER_DELAY,
  colorFrom = DEFAULT_COLOR_FROM,
  colorTo = DEFAULT_COLOR_TO,
  darkColorFrom = DEFAULT_DARK_COLOR_FROM,
  darkColorTo = DEFAULT_DARK_COLOR_TO,
  className,
  opacity = DEFAULT_OPACITY,
  darkOpacity = DEFAULT_DARK_OPACITY,
  animate = true,
  enableGlow = true,
}: FallBeamBackgroundProps) {
  // Optimistic initial state - assume light mode, desktop, no reduced motion
  const [isDarkMode, setIsDarkMode] = useState(() => {
    if (typeof window === "undefined") return false;
    const prefersDarkMode =
      window.matchMedia?.("(prefers-color-scheme: dark)").matches ?? false;
    return (
      document.documentElement.classList.contains("dark") || prefersDarkMode
    );
  });
  
  const [isMobile, setIsMobile] = useState(() => {
    if (typeof window === "undefined") return false;
    return window.innerWidth < MOBILE_BREAKPOINT;
  });
  
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(() => {
    if (typeof window === "undefined") return false;
    return window.matchMedia?.("(prefers-reduced-motion: reduce)").matches ?? false;
  });

  // Device performance detection (memoized, only runs once)
  const devicePerformance = useMemo(() => detectDevicePerformance(), []);

  // Use refs to store media query objects to avoid recreation
  const darkModeMediaQueryRef = useRef<MediaQueryList | null>(null);
  const reducedMotionMediaQueryRef = useRef<MediaQueryList | null>(null);
  const mutationObserverRef = useRef<MutationObserver | null>(null);

  // Consolidated effect hook for better performance
  useEffect(() => {
    if (typeof window === "undefined") return;

    // Dark mode detection function
    const checkDarkMode = () => {
      const prefersDarkMode =
        darkModeMediaQueryRef.current?.matches ?? false;
      const isDarkModeActive =
        document.documentElement.classList.contains("dark") || prefersDarkMode;
      setIsDarkMode(isDarkModeActive);
    };

    // Initialize media queries
    darkModeMediaQueryRef.current = window.matchMedia("(prefers-color-scheme: dark)");
    reducedMotionMediaQueryRef.current = window.matchMedia("(prefers-reduced-motion: reduce)");
    
    // Set initial values
    checkDarkMode();
    setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
    setPrefersReducedMotion(reducedMotionMediaQueryRef.current.matches);

    // Dark mode handlers
    const handleDarkModeChange = (e: MediaQueryListEvent) => {
      const isDarkModeActive =
        document.documentElement.classList.contains("dark") || e.matches;
      setIsDarkMode(isDarkModeActive);
    };

    // Reduced motion handler
    const handleReducedMotionChange = (e: MediaQueryListEvent) => {
      setPrefersReducedMotion(e.matches);
    };

    // Mobile detection with debounce
    const debouncedCheckMobile = debounce(() => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
    }, 150);

    // Mutation observer for class changes (optimized)
    mutationObserverRef.current = new MutationObserver(() => {
      checkDarkMode();
    });

    // Setup listeners
    darkModeMediaQueryRef.current.addEventListener("change", handleDarkModeChange);
    reducedMotionMediaQueryRef.current.addEventListener("change", handleReducedMotionChange);
    window.addEventListener("resize", debouncedCheckMobile, { passive: true });
    mutationObserverRef.current.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    // Cleanup
    return () => {
      darkModeMediaQueryRef.current?.removeEventListener("change", handleDarkModeChange);
      reducedMotionMediaQueryRef.current?.removeEventListener("change", handleReducedMotionChange);
      window.removeEventListener("resize", debouncedCheckMobile);
      mutationObserverRef.current?.disconnect();
    };
  }, []);

  // Calculate responsive values with memoization - optimized for device performance
  const responsiveBeamCount = useMemo(() => {
    if (beamCount !== undefined) return beamCount;
    
    // Reduce beam count based on device performance
    if (devicePerformance === PERFORMANCE_TIERS.LOW) {
      return isMobile ? 3 : 6; // Minimal beams for low-end devices
    } else if (devicePerformance === PERFORMANCE_TIERS.MID) {
      return isMobile ? 4 : 10; // Reduced beams for mid-range devices
    }
    // High-end: original values
    return isMobile ? 6 : 16;
  }, [beamCount, isMobile, devicePerformance]);

  const responsiveBeamWidth = useMemo(
    () => beamWidth ?? (isMobile ? 1.5 : 2),
    [beamWidth, isMobile]
  );
  
  const responsiveDuration = useMemo(
    () => duration ?? (isMobile ? 10 : 8),
    [duration, isMobile]
  );

  // Reduce blur for low-end devices (blur is expensive)
  const shouldUseBlur = useMemo(
    () => devicePerformance !== PERFORMANCE_TIERS.LOW,
    [devicePerformance]
  );

  // Reduce glow for low-end and mid-range devices
  const shouldUseGlow = useMemo(
    () => enableGlow && devicePerformance === PERFORMANCE_TIERS.HIGH,
    [enableGlow, devicePerformance]
  );

  // Memoize expensive calculations
  const currentOpacity = useMemo(
    () => (isDarkMode ? darkOpacity : opacity),
    [isDarkMode, darkOpacity, opacity]
  );
  const currentColorFrom = useMemo(
    () => (isDarkMode ? darkColorFrom : colorFrom),
    [isDarkMode, darkColorFrom, colorFrom]
  );
  const currentColorTo = useMemo(
    () => (isDarkMode ? darkColorTo : colorTo),
    [isDarkMode, darkColorTo, colorTo]
  );

  // Optimized beam generation with stable random positions
  const beams = useMemo(() => {
    return Array.from({ length: responsiveBeamCount }, (_, i) => ({
      id: i,
      left: generateStableRandom(i) * 100, // Stable random position based on index
      delay: i * staggerDelay,
      speed: 0.8 + generateStableRandom(i + 1000) * 0.4, // Stable speed variation
    }));
  }, [responsiveBeamCount, staggerDelay]);

  // Page visibility for pausing animations when tab is not visible
  const isPageVisible = usePageVisibility();

  // Respect reduced motion preference and page visibility
  const shouldAnimate = useMemo(
    () => animate && !prefersReducedMotion && isPageVisible,
    [animate, prefersReducedMotion, isPageVisible]
  );

  // Memoize gradient string to avoid recalculating on every render
  const gradient = useMemo(
    () =>
      `linear-gradient(to bottom, ${currentColorFrom} 0%, ${currentColorTo} 30%, ${currentColorTo} 70%, transparent 100%)`,
    [currentColorFrom, currentColorTo]
  );

  // Pre-calculate blur amount and glow size with memoization
  // Reduced blur for low-end devices (blur is GPU-intensive)
  const blurAmount = useMemo(
    () => (shouldUseBlur ? responsiveBeamWidth * 0.5 : responsiveBeamWidth * 0.2),
    [responsiveBeamWidth, shouldUseBlur]
  );
  
  const glowSize = useMemo(
    () => responsiveBeamWidth * 4,
    [responsiveBeamWidth]
  );

  // Memoize base style object to prevent recreation
  // Only use will-change when actually animating (it's expensive)
  const baseBeamStyle = useMemo(
    () => ({
      height: HEIGHT_OFFSET,
      background: gradient,
      opacity: currentOpacity,
      filter: shouldUseBlur ? `blur(${blurAmount}px)` : "none",
      transform: "translateZ(0)", // Force hardware acceleration
      // Only set will-change when animating to reduce memory usage
      willChange: shouldAnimate ? "transform" : "auto",
    }),
    [gradient, currentOpacity, blurAmount, shouldUseBlur, shouldAnimate]
  );

  // Memoize glow box shadow (disabled for low/mid-range devices)
  const glowBoxShadow = useMemo(
    () => (shouldUseGlow ? `0 0 ${glowSize}px ${currentColorTo}40` : "none"),
    [shouldUseGlow, glowSize, currentColorTo]
  );

  // Memoize initial animation state - simplified for low-end devices
  const initialAnimation = useMemo(() => {
    if (!shouldAnimate) {
      return { y: 0, opacity: currentOpacity };
    }
    // For low-end devices, start with opacity already set to reduce animation complexity
    if (devicePerformance === PERFORMANCE_TIERS.LOW) {
      return { y: INITIAL_Y_OFFSET, opacity: currentOpacity * 0.3 };
    }
    return { y: INITIAL_Y_OFFSET, opacity: 0 };
  }, [shouldAnimate, currentOpacity, devicePerformance]);

  // Memoize container className - optimized for performance
  const containerClassName = useMemo(
    () =>
      cn(
        "pointer-events-none fixed inset-0 overflow-hidden z-0 fall-beam-background",
        // Only use will-change when animating
        shouldAnimate && "will-change-transform",
        className
      ),
    [className, shouldAnimate]
  );

  // Memoize container style for performance optimizations
  const containerStyle = useMemo<React.CSSProperties>(
    () => ({
      // Use content-visibility for better rendering performance on low-end devices
      ...(devicePerformance === PERFORMANCE_TIERS.LOW && {
        contentVisibility: "auto" as const,
      }),
    }),
    [devicePerformance]
  );

  // Memoize animation configuration - simplified for low-end devices
  const animationConfig = useMemo(() => {
    // For low-end devices, use simpler opacity animation (no complex arrays)
    if (devicePerformance === PERFORMANCE_TIERS.LOW) {
      return {
        y: ANIMATION_END_OFFSET,
        // Simple fade in/out instead of complex opacity array
        opacity: currentOpacity,
      };
    }
    // For mid/high-end devices, use the original complex opacity animation
    return {
      y: ANIMATION_END_OFFSET,
      opacity: [0, currentOpacity, currentOpacity, 0],
    };
  }, [currentOpacity, devicePerformance]);

  return (
    <div
      className={containerClassName}
      style={containerStyle}
      data-fall-beam="true"
    >
      {beams.map((beam) => {
        const beamDuration = responsiveDuration * beam.speed;
        // Reduce repeat delay for low-end devices to improve perceived performance
        const repeatDelay = devicePerformance === PERFORMANCE_TIERS.LOW 
          ? responsiveDuration * 0.05 
          : responsiveDuration * 0.1;

        // Create individual beam style (optimized: spread base style)
        const beamStyle: React.CSSProperties = {
          ...baseBeamStyle,
          left: `${beam.left}%`,
          width: `${responsiveBeamWidth}px`,
          boxShadow: glowBoxShadow,
          // Use contain for better paint performance on low-end devices
          ...(devicePerformance === PERFORMANCE_TIERS.LOW && {
            contain: "layout style paint",
          }),
        };

        // Create transition config - optimized for device performance
        const transitionConfig = {
          duration: beamDuration,
          delay: beam.delay,
          repeat: Infinity,
          ease: "linear" as const, // Linear is most performant
          repeatDelay,
          // Reduce animation complexity for low-end devices
          ...(devicePerformance === PERFORMANCE_TIERS.LOW && {
            // Use simpler timing function
            type: "tween" as const,
          }),
        };

        return (
          <motion.div
            key={beam.id}
            className="absolute top-0"
            style={beamStyle}
            initial={initialAnimation}
            animate={
              shouldAnimate
                ? {
                    ...animationConfig,
                    transition: transitionConfig,
                  }
                : undefined
            }
          />
        );
      })}
    </div>
  );
};

// Memoize component to prevent unnecessary re-renders
const FallBeamBackground = memo(FallBeamBackgroundComponent);

export default FallBeamBackground;
