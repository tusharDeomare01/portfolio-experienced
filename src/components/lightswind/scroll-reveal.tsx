import React, { useRef, useMemo, useCallback } from "react";
import { motion, useInView, useScroll, useTransform, useReducedMotion } from "framer-motion";
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

// Optimized whitespace check using regex (faster for most cases)
const WHITESPACE_REGEX = /^\s+$/;
const isWhitespaceOnly = (str: string): boolean => {
  if (str.length === 0) return false;
  // Fast path: single character check
  if (str.length === 1) {
    const char = str[0];
    return char === " " || char === "\t" || char === "\n" || char === "\r";
  }
  // Use regex for longer strings (more efficient than loop for most cases)
  return WHITESPACE_REGEX.test(str);
};

// Cache for text splitting to avoid re-splitting same text
const textSplitCache = new Map<string, Array<{ value: string; isSpace: boolean; originalIndex: number }>>();
const MAX_CACHE_SIZE = 100;

// Optimized text splitter with caching
const splitTextOptimized = (text: string): Array<{ value: string; isSpace: boolean; originalIndex: number }> => {
  // Check cache first
  if (textSplitCache.has(text)) {
    return textSplitCache.get(text)!;
  }

  // Split and process
  const parts = text.split(/(\s+)/);
  const result = parts
    .map((part, index) => ({
      value: part,
      isSpace: isWhitespaceOnly(part),
      originalIndex: index,
    }))
    .filter((item) => item.value.length > 0);

  // Cache result (with size limit to prevent memory leaks)
  if (textSplitCache.size >= MAX_CACHE_SIZE) {
    // Remove oldest entry (FIFO)
    const firstKey = textSplitCache.keys().next().value;
    if (firstKey !== undefined) {
      textSplitCache.delete(firstKey);
    }
  }
  textSplitCache.set(text, result);

  return result;
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
  const prefersReducedMotion = useReducedMotion();
  
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
  
  // Only use scroll-based rotation if not reduced motion
  const shouldUseScrollRotation = !prefersReducedMotion && baseRotation !== 0;
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: DEFAULT_SCROLL_OFFSET,
  });

  // Memoize rotation transform output array (input is constant)
  const rotationOutput = useMemo<[number, number, number]>(
    () => [baseRotation, 0, 0],
    [baseRotation]
  );

  // Transform rotation based on scroll (only if enabled)
  const rotation = useTransform(
    scrollYProgress,
    DEFAULT_ROTATION_INPUT,
    rotationOutput,
    { clamp: true } // Clamp values for better performance
  );

  // Memoize style object with GPU acceleration hints
  const rotationStyle = useMemo(
    () => ({
      rotate: shouldUseScrollRotation ? rotation : 0,
      willChange: shouldUseScrollRotation ? "transform" : "auto",
    }),
    [rotation, shouldUseScrollRotation]
  );

  // Split text into words and spaces with caching
  const splitText = useMemo(() => {
    const text = typeof children === "string" ? children : "";
    if (!text) return [];
    
    return splitTextOptimized(text);
  }, [children]);

  // Memoize containerVariants - respect reduced motion preference
  const containerVariants = useMemo(
    () => {
      if (prefersReducedMotion) {
        return {
          hidden: { opacity: 0 },
          visible: {
            opacity: 1,
            transition: {
              duration: 0.3, // Faster, simpler animation for reduced motion
            },
          },
        };
      }
      return {
        hidden: { opacity: 0 },
        visible: {
          opacity: 1,
          transition: {
            staggerChildren: staggerDelay,
            delayChildren: 0.1,
          },
        },
      };
    },
    [staggerDelay, prefersReducedMotion]
  );

  // Memoize blur filter string - disable for reduced motion
  const blurFilter = useMemo(
    () => {
      if (prefersReducedMotion || !enableBlur) return "blur(0px)";
      return `blur(${blurStrength}px)`;
    },
    [enableBlur, blurStrength, prefersReducedMotion]
  );

  // Memoize wordVariants - respect reduced motion preference
  const wordVariants = useMemo(
    () => {
      if (prefersReducedMotion) {
        return {
          hidden: {
            opacity: baseOpacity,
            y: 0, // No movement for reduced motion
          },
          visible: {
            opacity: 1,
            y: 0,
            transition: {
              duration: 0.3,
            },
          },
        };
      }
      return {
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
            type: "spring" as const, // Explicitly use spring for better performance
          },
        },
      };
    },
    [baseOpacity, blurFilter, damping, stiffness, mass, duration, prefersReducedMotion]
  );

  // Memoize className strings to prevent recalculation
  const containerClass = useMemo(
    () => cn(
      "my-5 transform-gpu",
      "will-change-transform", // Hint browser for GPU acceleration
      "contain-layout", // CSS containment for better rendering performance
      containerClassName
    ),
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

  // Memoize render function for word spans to prevent recreation
  const renderWord = useCallback(
    (item: { value: string; isSpace: boolean; originalIndex: number }) => {
      if (item.isSpace) {
        return <span key={`space-${item.originalIndex}`}>{item.value}</span>;
      }
      return (
        <motion.span
          key={`word-${item.originalIndex}`}
          className="inline-block will-change-[opacity,transform,filter]"
          variants={wordVariants}
        >
          {item.value}
        </motion.span>
      );
    },
    [wordVariants]
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
        {splitText.map(renderWord)}
      </motion.p>
    </motion.div>
  );
};

// Custom comparison function for React.memo to prevent unnecessary re-renders
const arePropsEqual = (
  prevProps: ScrollRevealProps,
  nextProps: ScrollRevealProps
): boolean => {
  // Quick reference check
  if (prevProps === nextProps) return true;

  // Compare all props
  return (
    prevProps.children === nextProps.children &&
    prevProps.containerClassName === nextProps.containerClassName &&
    prevProps.textClassName === nextProps.textClassName &&
    prevProps.enableBlur === nextProps.enableBlur &&
    prevProps.baseOpacity === nextProps.baseOpacity &&
    prevProps.baseRotation === nextProps.baseRotation &&
    prevProps.blurStrength === nextProps.blurStrength &&
    prevProps.staggerDelay === nextProps.staggerDelay &&
    prevProps.threshold === nextProps.threshold &&
    prevProps.duration === nextProps.duration &&
    prevProps.size === nextProps.size &&
    prevProps.align === nextProps.align &&
    prevProps.variant === nextProps.variant &&
    // Deep compare springConfig
    (prevProps.springConfig === nextProps.springConfig ||
      (prevProps.springConfig?.damping === nextProps.springConfig?.damping &&
        prevProps.springConfig?.stiffness === nextProps.springConfig?.stiffness &&
        prevProps.springConfig?.mass === nextProps.springConfig?.mass))
  );
};

// Memoize component with custom comparison for optimal performance
export const ScrollReveal = React.memo(ScrollRevealComponent, arePropsEqual);

export default ScrollReveal;
