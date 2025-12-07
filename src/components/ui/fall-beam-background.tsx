"use client";

import { cn } from "../lib/utils";
import { motion } from "framer-motion";
import { useEffect, useState, useMemo } from "react";

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

export default function FallBeamBackground({
  beamCount,
  beamWidth,
  duration,
  staggerDelay = 0.5,
  colorFrom = "#d48aff",
  colorTo = "#ff40d9",
  darkColorFrom = "#9333ea",
  darkColorTo = "#ec4899",
  className,
  opacity = 0.25,
  darkOpacity = 0.35,
  animate = true,
  enableGlow = true,
}: FallBeamBackgroundProps) {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  // Detect dark mode
  useEffect(() => {
    const checkDarkMode = () => {
      const prefersDarkMode = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
      const isDarkModeActive = document.documentElement.classList.contains('dark') || prefersDarkMode;
      setIsDarkMode(isDarkModeActive);
    };

    checkDarkMode();

    const observer = new MutationObserver(() => {
      checkDarkMode();
    });

    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });

    return () => observer.disconnect();
  }, []);

  // Detect mobile/responsive breakpoint
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Detect prefers-reduced-motion
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);

    const handleChange = (e: MediaQueryListEvent) => {
      setPrefersReducedMotion(e.matches);
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  // Calculate responsive values - Increased beam count
  const responsiveBeamCount = beamCount ?? (isMobile ? 6 : 16);
  const responsiveBeamWidth = beamWidth ?? (isMobile ? 1.5 : 2);
  const responsiveDuration = duration ?? (isMobile ? 10 : 8);
  
  // Memoize expensive calculations
  const currentOpacity = useMemo(() => isDarkMode ? darkOpacity : opacity, [isDarkMode, darkOpacity, opacity]);
  const currentColorFrom = useMemo(() => isDarkMode ? darkColorFrom : colorFrom, [isDarkMode, darkColorFrom, colorFrom]);
  const currentColorTo = useMemo(() => isDarkMode ? darkColorTo : colorTo, [isDarkMode, darkColorTo, colorTo]);

  // Memoize beam generation to avoid unnecessary recalculations
  const beams = useMemo(() => {
    return Array.from({ length: responsiveBeamCount }, (_, i) => ({
      id: i,
      left: Math.random() * 100, // Random horizontal position (0-100%)
      delay: i * staggerDelay,
      speed: 0.8 + Math.random() * 0.4, // Vary speed between 0.8x and 1.2x for visual interest
    }));
  }, [responsiveBeamCount, staggerDelay]);

  // Respect reduced motion preference
  const shouldAnimate = animate && !prefersReducedMotion;

  // Memoize gradient string to avoid recalculating on every render
  const gradient = useMemo(
    () => `linear-gradient(to bottom, ${currentColorFrom} 0%, ${currentColorTo} 30%, ${currentColorTo} 70%, transparent 100%)`,
    [currentColorFrom, currentColorTo]
  );

  // Pre-calculate blur amount
  const blurAmount = responsiveBeamWidth * 0.5;
  const glowSize = responsiveBeamWidth * 4;

  return (
    <div
      className={cn(
        "pointer-events-none fixed inset-0 overflow-hidden z-0 fall-beam-background",
        "will-change-transform", // Optimize for animations
        className
      )}
      data-fall-beam="true"
    >
      {beams.map((beam) => {
        const beamDuration = responsiveDuration * beam.speed;

        return (
          <motion.div
            key={beam.id}
            className="absolute top-0"
            style={{
              left: `${beam.left}%`,
              width: `${responsiveBeamWidth}px`,
              height: "150vh",
              background: gradient,
              opacity: currentOpacity,
              // Optimized: Simplified filter - removed expensive drop-shadow
              filter: `blur(${blurAmount}px)`,
              transform: "translateZ(0)",
              willChange: "transform, opacity",
              // Use CSS boxShadow for glow effect instead of expensive filter
              boxShadow: enableGlow 
                ? `0 0 ${glowSize}px ${currentColorTo}40` 
                : "none",
            }}
            initial={shouldAnimate ? { y: "-150vh", opacity: 0 } : { y: 0, opacity: currentOpacity }}
            animate={
              shouldAnimate
                ? {
                    y: "250vh",
                    // Simplified opacity animation for better performance
                    opacity: [0, currentOpacity, currentOpacity, 0],
                    transition: {
                      duration: beamDuration,
                      delay: beam.delay,
                      repeat: Infinity,
                      ease: "linear", // Linear easing is more performant
                      repeatDelay: responsiveDuration * 0.1, // Reduced delay
                    },
                  }
                : {}
            }
          />
        );
      })}
    </div>
  );
}

