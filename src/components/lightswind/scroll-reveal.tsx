// "use client"; directive is correctly placed at the top

import React, { useRef, useMemo, useState, useEffect } from "react"; // Added useMemo
import { motion, useInView, useScroll, useTransform } from "framer-motion";
import { cn } from "../../lib/utils"; // Assuming cn utility is available

export interface ScrollRevealProps {
  children: React.ReactNode;
  /** Custom container className */
  containerClassName?: string;
  /** Custom text className */
  textClassName?: string;
  /** Enable blur animation effect */
  enableBlur?: boolean;
  /** Base opacity when text is out of view */
  baseOpacity?: number;
  /** Base rotation angle in degrees */
  baseRotation?: number;
  /** Blur strength in pixels */
  blurStrength?: number;
  /** Animation delay between words in seconds */
  staggerDelay?: number;
  /** Viewport threshold for triggering animation */
  threshold?: number;
  /** Animation duration in seconds */
  duration?: number;
  /** Spring animation configuration */
  springConfig?: {
    damping?: number;
    stiffness?: number;
    mass?: number;
  };
  /** Text size variant */
  size?: "sm" | "md" | "lg" | "xl" | "2xl";
  /** Text alignment */
  align?: "left" | "center" | "right";
  /** Color variant */
  variant?: "default" | "muted" | "accent" | "primary";
}

const sizeClasses = {
  sm: "text-lg md:text-xl",
  md: "text-xl md:text-2xl lg:text-3xl",
  lg: "text-2xl md:text-3xl lg:text-4xl xl:text-5xl",
  xl: "text-3xl md:text-4xl lg:text-5xl xl:text-6xl",
  "2xl": "text-4xl md:text-5xl lg:text-6xl xl:text-7xl",
};

const alignClasses = {
  left: "text-left",
  center: "text-center",
  right: "text-right",
};

const variantClasses = {
  default: "text-foreground",
  muted: "text-muted-foreground",
  accent: "text-accent-foreground",
  primary: "text-primary",
};

export function ScrollReveal({
  children,
  containerClassName,
  textClassName,
  enableBlur = true,
  baseOpacity = 0.1,
  baseRotation = 3,
  blurStrength = 4,
  staggerDelay = 0.05,
  threshold = 0.5,
  duration = 0.8,
  springConfig = { // Default spring config optimized for smoothness
    damping: 28,
    stiffness: 120,
    mass: 0.8,
  },
  size = "lg",
  align = "left",
  variant = "default",
}: ScrollRevealProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isMobile, setIsMobile] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const [isLowPerformance, setIsLowPerformance] = useState(false);
  const [refreshRate, setRefreshRate] = useState(60); // Default to 60Hz
  const detectionCompleteRef = useRef(false);

  // Detect mobile devices (with SSR safety)
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    const checkMobile = () => {
      try {
        setIsMobile(window.innerWidth < 768);
      } catch (error) {
        // Fallback to mobile if detection fails
        setIsMobile(true);
      }
    };
    
    checkMobile();
    const resizeHandler = () => checkMobile();
    window.addEventListener('resize', resizeHandler, { passive: true });
    return () => {
      if (typeof window !== 'undefined') {
        window.removeEventListener('resize', resizeHandler);
      }
    };
  }, []);

  // Detect device refresh rate (runs once on mount) with error handling
  useEffect(() => {
    if (typeof window === 'undefined' || typeof performance === 'undefined' || !window.requestAnimationFrame) {
      // SSR or unsupported browser - use default
      setRefreshRate(60);
      detectionCompleteRef.current = true;
      return;
    }

    let rafId: number | null = null;
    let lastTime = performance.now();
    let samples: number[] = [];
    const sampleCount = 10; // Sample 10 frames for accuracy
    let isCancelled = false;

    const detectRefreshRate = () => {
      if (isCancelled) return;
      
      try {
        const currentTime = performance.now();
        const delta = currentTime - lastTime;
        
        if (delta > 0 && delta < 100) { // Sanity check: delta should be reasonable
          samples.push(delta);
          
          if (samples.length >= sampleCount) {
            // Calculate average frame time
            const avgFrameTime = samples.reduce((a, b) => a + b, 0) / samples.length;
            
            // Sanity check: frame time should be reasonable (8-33ms for 30-120Hz)
            if (avgFrameTime >= 8 && avgFrameTime <= 33) {
              // Convert to refresh rate (1000ms / frameTime = Hz)
              const detectedRate = Math.round(1000 / avgFrameTime);
              
              // Clamp to reasonable values (30-240Hz)
              const clampedRate = Math.max(30, Math.min(240, detectedRate));
              
              // Round to common refresh rates for better optimization
              let optimizedRate = 60;
              if (clampedRate >= 120) {
                optimizedRate = 120; // High refresh rate displays
              } else if (clampedRate >= 90) {
                optimizedRate = 90; // Mid-high refresh rate
              } else if (clampedRate >= 60) {
                optimizedRate = 60; // Standard refresh rate
              } else if (clampedRate >= 30) {
                optimizedRate = 30; // Low refresh rate (rare)
              }
              
              setRefreshRate(optimizedRate);
              detectionCompleteRef.current = true;
              
              // Cleanup
              if (rafId !== null) {
                cancelAnimationFrame(rafId);
              }
              return;
            }
          }
        }
        
        lastTime = currentTime;
        rafId = requestAnimationFrame(detectRefreshRate);
      } catch (error) {
        // Error during detection - use default
        console.warn('Refresh rate detection failed, using default 60Hz:', error);
        setRefreshRate(60);
        detectionCompleteRef.current = true;
        if (rafId !== null) {
          cancelAnimationFrame(rafId);
        }
      }
    };

    // Start detection
    try {
      rafId = requestAnimationFrame(detectRefreshRate);
    } catch (error) {
      console.warn('Failed to start refresh rate detection:', error);
      setRefreshRate(60);
      detectionCompleteRef.current = true;
    }
    
    // Fallback: if detection takes too long, use default
    const timeout = setTimeout(() => {
      if (!detectionCompleteRef.current) {
        isCancelled = true;
        if (rafId !== null) {
          cancelAnimationFrame(rafId);
        }
        setRefreshRate(60);
        detectionCompleteRef.current = true;
      }
    }, 2000);

    return () => {
      isCancelled = true;
      if (rafId !== null) {
        cancelAnimationFrame(rafId);
      }
      clearTimeout(timeout);
    };
  }, []);

  // Detect low-performance devices (runs once on mount) with error handling
  useEffect(() => {
    if (typeof window === 'undefined' || typeof navigator === 'undefined') {
      // SSR or unsupported - assume low performance for safety
      setIsLowPerformance(true);
      return;
    }

    try {
      // Check for low-end device indicators
      const checkPerformance = () => {
        try {
          const hasLowCPU = navigator.hardwareConcurrency && navigator.hardwareConcurrency <= 2;
          const hasLowMemory = (navigator as any).deviceMemory && (navigator as any).deviceMemory <= 2;
          const hasSlowConnection = (navigator as any).connection && 
            ((navigator as any).connection.effectiveType === '2g' || 
             (navigator as any).connection.effectiveType === 'slow-2g');
          
          // Check GPU capabilities
          let hasNoGPU = false;
          try {
            const canvas = document.createElement('canvas');
            const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
            hasNoGPU = !gl;
          } catch (error) {
            // GPU check failed - assume no GPU for safety
            hasNoGPU = true;
          }
          
          setIsLowPerformance(hasLowCPU || hasLowMemory || hasSlowConnection || hasNoGPU);
        } catch (error) {
          // Error during performance check - assume low performance for safety
          console.warn('Performance detection failed, using safe defaults:', error);
          setIsLowPerformance(true);
        }
      };

      checkPerformance();
      
      // Check battery if available (for battery saver mode)
      if ((navigator as any).getBattery) {
        (navigator as any).getBattery().then((battery: any) => {
          try {
            if (battery && battery.charging === false && battery.level < 0.2) {
              setIsLowPerformance(true);
            }
          } catch (error) {
            // Battery check failed - ignore
          }
        }).catch(() => {
          // Battery API not available or failed - ignore
        });
      }
    } catch (error) {
      // Overall error - use safe defaults
      console.warn('Performance detection error:', error);
      setIsLowPerformance(true);
    }
  }, []);

  // Detect prefers-reduced-motion (with SSR safety)
  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) {
      // SSR or unsupported - respect reduced motion by default
      setPrefersReducedMotion(true);
      return;
    }

    try {
      const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
      setPrefersReducedMotion(mediaQuery.matches);

      const handleChange = (e: MediaQueryListEvent) => {
        try {
          setPrefersReducedMotion(e.matches);
        } catch (error) {
          // Ignore errors in handler
        }
      };

      // Use addEventListener if available, fallback to addListener for older browsers
      if (mediaQuery.addEventListener) {
        mediaQuery.addEventListener('change', handleChange);
        return () => {
          if (mediaQuery.removeEventListener) {
            mediaQuery.removeEventListener('change', handleChange);
          }
        };
      } else if ((mediaQuery as any).addListener) {
        // Fallback for older browsers
        (mediaQuery as any).addListener(handleChange);
        return () => {
          if ((mediaQuery as any).removeListener) {
            (mediaQuery as any).removeListener(handleChange);
          }
        };
      }
    } catch (error) {
      // Error accessing media query - respect reduced motion
      console.warn('Failed to detect reduced motion preference:', error);
      setPrefersReducedMotion(true);
    }
  }, []);

  // Ensure minimum smoothness: never go below 30Hz equivalent to prevent laggy feel
  const effectiveRefreshRate = Math.max(refreshRate, 30);
  
  // Optimize settings based on device capabilities and refresh rate
  const optimizedBlur = (isMobile || isLowPerformance) ? false : enableBlur;
  const optimizedBlurStrength = (isMobile || isLowPerformance) ? 0 : blurStrength;
  const optimizedRotation = (isMobile || prefersReducedMotion || isLowPerformance) ? 0 : baseRotation;
  
  // Adjust stagger delay based on refresh rate
  // Higher refresh rate = can handle faster stagger without feeling laggy
  // This creates smoother cascading effects on high-refresh displays
  const baseStaggerDelay = isLowPerformance 
    ? staggerDelay * 0.2 
    : isMobile 
    ? staggerDelay * 0.4 
    : staggerDelay;
  const optimizedStaggerDelay = effectiveRefreshRate >= 120 
    ? baseStaggerDelay * 0.7  // Faster stagger on high refresh rate (120Hz+)
    : effectiveRefreshRate >= 90
    ? baseStaggerDelay * 0.85  // Slightly faster on mid-high refresh rate (90Hz)
    : baseStaggerDelay;  // Standard on 60Hz
  
  // Duration adapts to refresh rate for consistent perceived speed
  // Higher refresh rates can handle slightly faster animations without feeling rushed
  const baseDuration = isLowPerformance
    ? duration * 0.5
    : isMobile 
    ? duration * 0.7 
    : duration;
  const optimizedDuration = effectiveRefreshRate >= 120
    ? baseDuration * 0.9  // Slightly faster on high refresh rate for snappier feel
    : effectiveRefreshRate >= 90
    ? baseDuration * 0.95  // Very slightly faster on mid-high refresh rate
    : baseDuration;  // Standard duration on 60Hz
  
  const optimizedThreshold = isMobile ? 0.15 : threshold;
  const shouldAnimateOnce = isMobile || prefersReducedMotion || isLowPerformance;
  
  // Use simpler animations on low-performance devices
  const shouldAnimateWords = !isMobile && !isLowPerformance;

  // Smoother spring config - optimized for smooth animations based on device and refresh rate
  // Higher refresh rates can handle more responsive springs without feeling janky
  // Spring physics adapt to refresh rate for optimal frame utilization
  const isDefaultSpring = springConfig.damping === 28 && springConfig.stiffness === 120 && springConfig.mass === 0.8;
  
  const smoothSpringConfig = isLowPerformance ? {
    type: "spring" as const,
    damping: 35,
    stiffness: 250,
    mass: 0.3,
  } : isMobile ? {
    type: "spring" as const,
    damping: isDefaultSpring ? 30 : springConfig.damping,
    stiffness: isDefaultSpring ? 200 : springConfig.stiffness,
    mass: isDefaultSpring ? 0.5 : springConfig.mass,
  } : effectiveRefreshRate >= 120 ? {
    // High refresh rate (120Hz+): More responsive spring for ultra-smooth feel
    // Lower damping allows more natural motion, higher stiffness for responsiveness
    type: "spring" as const,
    damping: isDefaultSpring ? 26 : springConfig.damping,
    stiffness: isDefaultSpring ? 130 : springConfig.stiffness,
    mass: isDefaultSpring ? 0.7 : springConfig.mass,
  } : effectiveRefreshRate >= 90 ? {
    // Mid-high refresh rate (90Hz): Balanced spring config
    type: "spring" as const,
    damping: isDefaultSpring ? 27 : springConfig.damping,
    stiffness: isDefaultSpring ? 125 : springConfig.stiffness,
    mass: isDefaultSpring ? 0.75 : springConfig.mass,
  } : {
    // Standard refresh rate (60Hz): Default optimized config
    type: "spring" as const,
    ...springConfig,
  };

  const isInView = useInView(containerRef, {
    amount: optimizedThreshold,
    once: shouldAnimateOnce,
    margin: isMobile ? "0px 0px -50px 0px" : "0px 0px -100px 0px"
  });

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  // Smoother rotation transform with easing
  const rotation = useTransform(
    scrollYProgress,
    [0, 0.3, 0.7, 1],
    [optimizedRotation, optimizedRotation * 0.5, optimizedRotation * 0.2, 0],
    { clamp: false }
  );

  // Split text into words and spaces, ensuring each part is an object
  // Added error handling for edge cases
  const splitText = useMemo(() => {
    try {
      const text = typeof children === "string" ? children : "";
      if (!text || text.trim().length === 0) {
        return [];
      }
      
      // Split by spaces, keeping the spaces as separate elements in the array.
      // Each 'part' will either be a word or a sequence of spaces.
      return text.split(/(\s+)/).map((part, index) => {
        // Return an object for both words and spaces, with a 'type' property
        // to differentiate them in the rendering loop.
        return {
          value: part,
          isSpace: part.match(/^\s+$/) !== null && part.length > 0, // Check if it's a non-empty string of only whitespace
          originalIndex: index, // Keep original index for stable keys
        };
      }).filter(item => item.value.length > 0); // Filter out any empty strings that might result from split
    } catch (error) {
      // If text splitting fails, return empty array (will render as whole block)
      console.warn('Text splitting failed:', error);
      return [];
    }
  }, [children]);

  // Smoother easing curves - using Framer Motion compatible easing
  // Using predefined easing strings that match smooth cubic-bezier curves
  const smoothEaseOut = "easeOut" as const; // Very smooth ease-out

  // Simplified animation for mobile/reduced motion
  const containerVariants = prefersReducedMotion ? {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.3,
        ease: smoothEaseOut,
      },
    },
  } : {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: optimizedStaggerDelay,
        delayChildren: isMobile ? 0.05 : 0.15,
        ease: smoothEaseOut,
      },
    },
  } as const;

  const wordVariants = prefersReducedMotion ? {
    hidden: {
      opacity: 0,
    },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.25,
        ease: smoothEaseOut,
      },
    },
  } : {
    hidden: {
      opacity: baseOpacity,
      filter: optimizedBlur ? `blur(${optimizedBlurStrength}px)` : "blur(0px)",
      y: isMobile ? 8 : 15, // Reduced movement for smoother feel
      scale: isMobile ? 0.98 : 0.95, // Subtle scale for depth
    },
    visible: {
      opacity: 1,
      filter: "blur(0px)",
      y: 0,
      scale: 1,
      transition: isMobile ? {
        // Smooth spring on mobile
        ...smoothSpringConfig,
        duration: optimizedDuration,
      } : {
        // Enhanced spring animation on desktop
        ...smoothSpringConfig,
        duration: optimizedDuration,
      },
    },
  } as const;

  // Handle empty or invalid children
  if (!children || (typeof children === "string" && children.trim().length === 0)) {
    return null;
  }

  // For mobile/reduced motion, render simpler version
  if (prefersReducedMotion) {
    return (
      <motion.div
        ref={containerRef}
        className={cn(
          "my-5",
          containerClassName
        )}
      >
        <motion.p
          className={cn(
            "leading-relaxed font-semibold",
            sizeClasses[size],
            alignClasses[align],
            variantClasses[variant],
            textClassName
          )}
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
        >
          {children}
        </motion.p>
      </motion.div>
    );
  }

  return (
    <motion.div
      ref={containerRef}
      style={isMobile ? {} : { rotate: rotation }}
      className={cn(
        "my-5",
        !isMobile && "transform-gpu will-change-transform",
        containerClassName
      )}
      initial={false}
    >
      <motion.p
        className={cn(
          "leading-relaxed font-semibold",
          sizeClasses[size],
          alignClasses[align],
          variantClasses[variant],
          textClassName,
          "will-change-transform"
        )}
        variants={containerVariants}
        initial="hidden"
        animate={isInView ? "visible" : "hidden"}
        style={{
          backfaceVisibility: "hidden",
          WebkitBackfaceVisibility: "hidden",
          perspective: 1000,
        }}
      >
        {shouldAnimateWords ? (
          // On high-performance desktop, use word-by-word animation
          splitText.map((item) => (
            item.isSpace ? (
              // Render spaces as a regular span
              <span key={`space-${item.originalIndex}`}>{item.value}</span>
            ) : (
              // Render words as motion.span for animation
              <motion.span
                key={`word-${item.originalIndex}`}
                className="inline-block will-change-transform"
                variants={wordVariants}
                style={{
                  backfaceVisibility: "hidden",
                  WebkitBackfaceVisibility: "hidden",
                  transform: "translateZ(0)", // Force GPU acceleration
                }}
              >
                {item.value}
              </motion.span>
            )
          ))
        ) : (
          // On mobile/low-performance devices, animate the whole text block for smoother performance
          <motion.span
            variants={wordVariants}
            className="inline-block will-change-transform"
            style={{
              backfaceVisibility: "hidden",
              WebkitBackfaceVisibility: "hidden",
            }}
          >
            {children}
          </motion.span>
        )}
      </motion.p>
    </motion.div>
  );
}

export default ScrollReveal;
