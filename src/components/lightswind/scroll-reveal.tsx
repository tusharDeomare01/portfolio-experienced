import React, { useRef, useMemo } from "react";
import { motion, useInView, useScroll, useTransform } from "framer-motion";
import { cn } from "../../lib/utils";

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

// Constants moved outside component to avoid recreation
const DEFAULT_SCROLL_OFFSET: ["start end", "end start"] = ["start end", "end start"];
const DEFAULT_ROTATION_INPUT: [number, number, number] = [0, 0.5, 1];
const DEFAULT_SPRING_CONFIG = {
  damping: 25,
  stiffness: 100,
  mass: 1,
} as const;

// Optimized whitespace check function
const isWhitespaceOnly = (str: string): boolean => {
  if (str.length === 0) return false;
  // Fast check: if first char is not whitespace, it's not whitespace-only
  if (str[0] !== " " && str[0] !== "\t" && str[0] !== "\n" && str[0] !== "\r") {
    return false;
  }
  // Check all characters are whitespace
  for (let i = 0; i < str.length; i++) {
    const char = str[i];
    if (char !== " " && char !== "\t" && char !== "\n" && char !== "\r") {
      return false;
    }
  }
  return true;
};

const ScrollRevealComponent = ({
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
  springConfig,
  size = "lg",
  align = "left",
  variant = "default",
}: ScrollRevealProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Use stable default springConfig reference
  const stableSpringConfig = springConfig ?? DEFAULT_SPRING_CONFIG;
  
  // Extract spring config values to avoid dependency on object reference
  const { damping, stiffness, mass } = stableSpringConfig;
  
  // Memoize useInView options to prevent recreation on every render
  const inViewOptions = useMemo(
    () => ({
      amount: threshold,
      once: false,
    }),
    [threshold]
  );
  
  const isInView = useInView(containerRef, inViewOptions);
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: DEFAULT_SCROLL_OFFSET,
  });

  // Memoize rotation transform output array (input is constant)
  const rotationOutput = useMemo<[number, number, number]>(
    () => [baseRotation, 0, 0],
    [baseRotation]
  );

  // Transform rotation based on scroll
  const rotation = useTransform(
    scrollYProgress,
    DEFAULT_ROTATION_INPUT,
    rotationOutput
  );

  // Memoize style object to prevent recreation
  const rotationStyle = useMemo(
    () => ({ rotate: rotation }),
    [rotation]
  );

  // Split text into words and spaces, ensuring each part is an object
  const splitText = useMemo(() => {
    const text = typeof children === "string" ? children : "";
    if (!text) return [];
    
    // Optimized: use efficient whitespace check function
    return text
      .split(/(\s+)/)
      .map((part, index) => ({
        value: part,
        isSpace: isWhitespaceOnly(part),
        originalIndex: index,
      }))
      .filter((item) => item.value.length > 0);
  }, [children]);

  // Memoize containerVariants to prevent recreation on every render
  const containerVariants = useMemo(
    () => ({
      hidden: { opacity: 0 },
      visible: {
        opacity: 1,
        transition: {
          staggerChildren: staggerDelay,
          delayChildren: 0.1,
        },
      },
    }),
    [staggerDelay]
  );

  // Memoize blur filter string to avoid template literal recreation
  const blurFilter = useMemo(
    () => (enableBlur ? `blur(${blurStrength}px)` : "blur(0px)"),
    [enableBlur, blurStrength]
  );

  // Memoize wordVariants to prevent recreation on every render
  // Use extracted spring config values to avoid dependency on object reference
  const wordVariants = useMemo(
    () => ({
      hidden: {
        opacity: baseOpacity,
        filter: blurFilter,
        y: 20,
      },
      visible: {
        opacity: 1,
        filter: "blur(0px)",
        y: 0,
        transition: {
          damping,
          stiffness,
          mass,
          duration,
        },
      },
    }),
    [baseOpacity, blurFilter, damping, stiffness, mass, duration]
  );

  // Memoize className strings to prevent recalculation
  const containerClass = useMemo(
    () => cn("my-5 transform-gpu", containerClassName),
    [containerClassName]
  );

  const textClass = useMemo(
    () =>
      cn(
        "leading-relaxed font-semibold",
        sizeClasses[size],
        alignClasses[align],
        variantClasses[variant],
        textClassName
      ),
    [size, align, variant, textClassName]
  );

  return (
    <motion.div
      ref={containerRef}
      style={rotationStyle}
      className={containerClass}
    >
      <motion.p
        className={textClass}
        variants={containerVariants}
        initial="hidden"
        animate={isInView ? "visible" : "hidden"}
      >
        {splitText.map((item) =>
          item.isSpace ? (
            <span key={`space-${item.originalIndex}`}>{item.value}</span>
          ) : (
            <motion.span
              key={`word-${item.originalIndex}`}
              className="inline-block"
              variants={wordVariants}
            >
              {item.value}
            </motion.span>
          )
        )}
      </motion.p>
    </motion.div>
  );
};

// Memoize component to prevent unnecessary re-renders when props haven't changed
export const ScrollReveal = React.memo(ScrollRevealComponent);

export default ScrollReveal;
