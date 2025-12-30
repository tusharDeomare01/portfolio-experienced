import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { useEffect, useState, useMemo, useRef, memo, useCallback } from "react";

// Constants
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

const PERFORMANCE_TIERS = {
  LOW: "low",
  MID: "mid",
  HIGH: "high",
} as const;

// Utilities
const generateStableRandom = (seed: number): number => {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
};

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

// Optimized performance detection
const detectDevicePerformance =
  (): (typeof PERFORMANCE_TIERS)[keyof typeof PERFORMANCE_TIERS] => {
    if (typeof window === "undefined") return PERFORMANCE_TIERS.MID;

    const cores = navigator.hardwareConcurrency || 2;
    const memory = (navigator as any).deviceMemory || 4;
    const isMobile =
      /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
        navigator.userAgent
      );

    if (isMobile && (cores <= 2 || memory <= 2)) return PERFORMANCE_TIERS.LOW;
    if (cores <= 4 || memory <= 4 || isMobile) return PERFORMANCE_TIERS.MID;
    return PERFORMANCE_TIERS.HIGH;
  };

// Optimized page visibility hook
const usePageVisibility = () => {
  const [isVisible, setIsVisible] = useState(() =>
    typeof document === "undefined" ? true : !document.hidden
  );

  useEffect(() => {
    if (typeof document === "undefined") return;

    const handleVisibilityChange = () => setIsVisible(!document.hidden);
    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () =>
      document.removeEventListener("visibilitychange", handleVisibilityChange);
  }, []);

  return isVisible;
};

interface FallBeamBackgroundProps {
  beamCount?: number;
  beamWidth?: number;
  duration?: number;
  staggerDelay?: number;
  colorFrom?: string;
  colorTo?: string;
  darkColorFrom?: string;
  darkColorTo?: string;
  className?: string;
  opacity?: number;
  darkOpacity?: number;
  animate?: boolean;
  enableGlow?: boolean;
}

// Memoized beam component for better performance
const Beam = memo(
  ({
    // beam,
    style,
    shouldAnimate,
    initialAnimation,
    animationConfig,
    transitionConfig,
  }: any) => (
    <motion.div
      className="absolute top-0"
      style={style}
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
  )
);

Beam.displayName = "Beam";

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
  // State with optimistic defaults
  const [isDarkMode, setIsDarkMode] = useState(() => {
    if (typeof window === "undefined") return false;
    return (
      document.documentElement.classList.contains("dark") ||
      window.matchMedia?.("(prefers-color-scheme: dark)").matches
    );
  });

  const [isMobile, setIsMobile] = useState(() =>
    typeof window === "undefined"
      ? false
      : window.innerWidth < MOBILE_BREAKPOINT
  );

  const [prefersReducedMotion, setPrefersReducedMotion] = useState(() =>
    typeof window === "undefined"
      ? false
      : window.matchMedia?.("(prefers-reduced-motion: reduce)").matches
  );

  // Device performance (runs once)
  const devicePerformance = useMemo(() => detectDevicePerformance(), []);

  // Refs for media queries
  const darkModeMediaQueryRef = useRef<MediaQueryList | null>(null);
  const reducedMotionMediaQueryRef = useRef<MediaQueryList | null>(null);
  const mutationObserverRef = useRef<MutationObserver | null>(null);

  // Memoized dark mode check
  const checkDarkMode = useCallback(() => {
    const prefersDarkMode = darkModeMediaQueryRef.current?.matches ?? false;
    setIsDarkMode(
      document.documentElement.classList.contains("dark") || prefersDarkMode
    );
  }, []);

  // Single effect for all event listeners
  useEffect(() => {
    if (typeof window === "undefined") return;

    darkModeMediaQueryRef.current = window.matchMedia(
      "(prefers-color-scheme: dark)"
    );
    reducedMotionMediaQueryRef.current = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    );

    checkDarkMode();
    setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
    setPrefersReducedMotion(reducedMotionMediaQueryRef.current.matches);

    const handleDarkModeChange = (e: MediaQueryListEvent) => {
      setIsDarkMode(
        document.documentElement.classList.contains("dark") || e.matches
      );
    };

    const handleReducedMotionChange = (e: MediaQueryListEvent) => {
      setPrefersReducedMotion(e.matches);
    };

    const debouncedCheckMobile = debounce(() => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
    }, 150);

    mutationObserverRef.current = new MutationObserver(checkDarkMode);

    darkModeMediaQueryRef.current.addEventListener(
      "change",
      handleDarkModeChange
    );
    reducedMotionMediaQueryRef.current.addEventListener(
      "change",
      handleReducedMotionChange
    );
    window.addEventListener("resize", debouncedCheckMobile, { passive: true });
    mutationObserverRef.current.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    return () => {
      darkModeMediaQueryRef.current?.removeEventListener(
        "change",
        handleDarkModeChange
      );
      reducedMotionMediaQueryRef.current?.removeEventListener(
        "change",
        handleReducedMotionChange
      );
      window.removeEventListener("resize", debouncedCheckMobile);
      mutationObserverRef.current?.disconnect();
    };
  }, [checkDarkMode]);

  // Responsive values with performance tiers
  const responsiveBeamCount = useMemo(() => {
    if (beamCount !== undefined) return beamCount;
    if (devicePerformance === PERFORMANCE_TIERS.LOW) return isMobile ? 3 : 6;
    if (devicePerformance === PERFORMANCE_TIERS.MID) return isMobile ? 4 : 10;
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

  const shouldUseBlur = devicePerformance !== PERFORMANCE_TIERS.LOW;
  const shouldUseGlow =
    enableGlow && devicePerformance === PERFORMANCE_TIERS.HIGH;

  // Current values
  const currentOpacity = isDarkMode ? darkOpacity : opacity;
  const currentColorFrom = isDarkMode ? darkColorFrom : colorFrom;
  const currentColorTo = isDarkMode ? darkColorTo : colorTo;

  // Beam generation with stable positions
  const beams = useMemo(
    () =>
      Array.from({ length: responsiveBeamCount }, (_, i) => ({
        id: i,
        left: generateStableRandom(i) * 100,
        delay: i * staggerDelay,
        speed: 0.8 + generateStableRandom(i + 1000) * 0.4,
      })),
    [responsiveBeamCount, staggerDelay]
  );

  const isPageVisible = usePageVisibility();
  const shouldAnimate = animate && !prefersReducedMotion && isPageVisible;

  // Memoized styles
  const gradient = useMemo(
    () =>
      `linear-gradient(to bottom, ${currentColorFrom} 0%, ${currentColorTo} 30%, ${currentColorTo} 70%, transparent 100%)`,
    [currentColorFrom, currentColorTo]
  );

  const blurAmount = shouldUseBlur
    ? responsiveBeamWidth * 0.5
    : responsiveBeamWidth * 0.2;
  const glowSize = responsiveBeamWidth * 4;

  const baseBeamStyle = useMemo(
    () => ({
      height: HEIGHT_OFFSET,
      background: gradient,
      opacity: currentOpacity,
      filter: shouldUseBlur ? `blur(${blurAmount}px)` : "none",
      transform: "translateZ(0)",
      willChange: shouldAnimate ? "transform" : "auto",
    }),
    [gradient, currentOpacity, blurAmount, shouldUseBlur, shouldAnimate]
  );

  const glowBoxShadow = shouldUseGlow
    ? `0 0 ${glowSize}px ${currentColorTo}40`
    : "none";

  const initialAnimation = useMemo(() => {
    if (!shouldAnimate) return { y: 0, opacity: currentOpacity };
    if (devicePerformance === PERFORMANCE_TIERS.LOW) {
      return { y: INITIAL_Y_OFFSET, opacity: currentOpacity * 0.3 };
    }
    return { y: INITIAL_Y_OFFSET, opacity: 0 };
  }, [shouldAnimate, currentOpacity, devicePerformance]);

  const animationConfig = useMemo(() => {
    if (devicePerformance === PERFORMANCE_TIERS.LOW) {
      return { y: ANIMATION_END_OFFSET, opacity: currentOpacity };
    }
    return {
      y: ANIMATION_END_OFFSET,
      opacity: [0, currentOpacity, currentOpacity, 0],
    };
  }, [currentOpacity, devicePerformance]);

  return (
    <div
      className={cn(
        "pointer-events-none fixed inset-0 overflow-hidden z-0",
        shouldAnimate && "will-change-transform",
        className
      )}
      style={
        devicePerformance === PERFORMANCE_TIERS.LOW
          ? { contentVisibility: "auto" }
          : undefined
      }
    >
      {beams.map((beam) => {
        const beamDuration = responsiveDuration * beam.speed;
        const repeatDelay =
          devicePerformance === PERFORMANCE_TIERS.LOW
            ? responsiveDuration * 0.05
            : responsiveDuration * 0.1;

        const beamStyle: React.CSSProperties = {
          ...baseBeamStyle,
          left: `${beam.left}%`,
          width: `${responsiveBeamWidth}px`,
          boxShadow: glowBoxShadow,
          ...(devicePerformance === PERFORMANCE_TIERS.LOW && {
            contain: "layout style paint",
          }),
        };

        const transitionConfig = {
          duration: beamDuration,
          delay: beam.delay,
          repeat: Infinity,
          ease: "linear" as const,
          repeatDelay,
          ...(devicePerformance === PERFORMANCE_TIERS.LOW && {
            type: "tween" as const,
          }),
        };

        return (
          <Beam
            key={beam.id}
            beam={beam}
            style={beamStyle}
            shouldAnimate={shouldAnimate}
            initialAnimation={initialAnimation}
            animationConfig={animationConfig}
            transitionConfig={transitionConfig}
          />
        );
      })}
    </div>
  );
}

const FallBeamBackground = memo(FallBeamBackgroundComponent);

export default FallBeamBackground;
