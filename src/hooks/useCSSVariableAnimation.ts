import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@/lib/gsap";
import type { RefObject } from "react";

/**
 * Configuration for CSS variable animation
 */
export interface CSSVariableAnimConfig {
  /** CSS variable name (without --) */
  variable: string;
  /** Starting value */
  from: number | string;
  /** Ending value */
  to: number | string;
  /** Target element (default: document.documentElement) */
  target?: RefObject<HTMLElement | null> | HTMLElement | null;
  /** Duration in seconds (default: 1) */
  duration?: number;
  /** Ease function (default: "none") */
  ease?: string;
  /** ScrollTrigger configuration (optional) */
  scrollTrigger?: Record<string, unknown> & { enabled?: boolean };
  /** Custom update function to format value */
  onUpdate?: (value: number | string) => void;
  /** Enable/disable animation (default: true) */
  enabled?: boolean;
  /** Number of decimal places for numeric values (default: 0) */
  precision?: number;
  /** Unit to append to value (e.g., "px", "deg", "%") */
  unit?: string;
}

/**
 * useCSSVariableAnimation
 *
 * Animates CSS variables using GSAP, creating dynamic color shifts,
 * rotation effects, and other variable-based animations.
 *
 * Perfect for:
 * - Hue rotation over scroll (0-360°)
 * - Saturation pulsing (80%-100%)
 * - Dynamic opacity shifts
 * - Section color morphing
 * - Dark mode transitions via variables
 *
 * Features:
 * - Scroll-triggered animations via ScrollTrigger
 * - Precision control for numeric values
 * - Unit formatting (px, deg, %, etc.)
 * - Respects prefers-reduced-motion
 * - Automatic cleanup
 *
 * @example
 * ```tsx
 * // Rotate hue 0-360° over page scroll
 * useCSSVariableAnimation({
 *   variable: "--hue",
 *   from: 0,
 *   to: 360,
 *   unit: "deg",
 *   scrollTrigger: {
 *     trigger: document.body,
 *     start: "top top",
 *     end: "bottom bottom",
 *     scrub: 1,
 *   },
 * });
 *
 * // Pulse saturation on hover
 * useCSSVariableAnimation({
 *   variable: "--saturation",
 *   from: 80,
 *   to: 100,
 *   unit: "%",
 *   duration: 0.8,
 *   ease: "power1.inOut",
 * });
 * ```
 */
export function useCSSVariableAnimation({
  variable,
  from,
  to,
  target,
  duration = 1,
  ease = "none",
  scrollTrigger: scrollTriggerConfig,
  onUpdate,
  enabled = true,
  precision = 0,
  unit = "",
}: CSSVariableAnimConfig) {
  const timelineRef = useRef<gsap.core.Timeline | null>(null);
  const animationRef = useRef<any>(null);

  useGSAP(() => {
    if (!enabled) return;

    // Check for reduced motion preference
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (prefersReducedMotion) return;

    // Determine target element
    let targetEl: HTMLElement | null = null;

    if (target instanceof HTMLElement) {
      targetEl = target;
    } else if (target && "current" in target) {
      targetEl = target.current;
    } else {
      targetEl = document.documentElement;
    }

    if (!targetEl) return;

    // Convert from/to to numbers if they are numeric
    const fromNum = typeof from === "number" ? from : parseFloat(from as string);
    const toNum = typeof to === "number" ? to : parseFloat(to as string);

    // Determine if values are numeric
    const isNumeric = !isNaN(fromNum) && !isNaN(toNum);

    if (!isNumeric && typeof from !== "string") {
      console.warn(
        `[useCSSVariableAnimation] Invalid from/to values for ${variable}`
      );
      return;
    }

    const animConfig: any = {
      duration,
      ease,
      onUpdate: () => {
        if (isNumeric && animationRef.current) {
          const currentValue = parseFloat(animationRef.current[`--${variable}`]);
          const formatted = precision > 0
            ? currentValue.toFixed(precision)
            : Math.round(currentValue);
          const displayValue = `${formatted}${unit}`;
          onUpdate?.(displayValue);
        }
      },
    };

    // Add ScrollTrigger if configured
    if (scrollTriggerConfig && scrollTriggerConfig.enabled !== false) {
      animConfig.scrollTrigger = {
        ...scrollTriggerConfig,
        markers: false, // Never show markers in production
      };
    }

    // Create animation
    if (isNumeric) {
      // For numeric values, animate from number to number
      animationRef.current = { [`--${variable}`]: fromNum };

      const tl = gsap.timeline();
      tl.to(animationRef.current, {
        [`--${variable}`]: toNum,
        ...animConfig,
        onUpdate: () => {
          const currentValue = parseFloat(
            animationRef.current[`--${variable}`]
          );
          const formatted = precision > 0
            ? currentValue.toFixed(precision)
            : Math.round(currentValue);
          const displayValue = `${formatted}${unit}`;

          // Update CSS variable on element
          targetEl?.style.setProperty(`--${variable}`, displayValue);
          onUpdate?.(displayValue);
        },
      });

      timelineRef.current = tl;
    } else {
      // For string values, set directly on element
      targetEl.style.setProperty(`--${variable}`, String(to));
      onUpdate?.(to);
    }

    // Cleanup
    return () => {
      timelineRef.current?.kill();
      animationRef.current = null;
    };
  });
}

/**
 * Advanced configuration for multi-variable animation
 */
export interface MultiVariableAnimConfig {
  /** Array of variable animations */
  variables: CSSVariableAnimConfig[];
  /** Stagger delay between variables (default: 0) */
  stagger?: number;
  /** Enable/disable all animations (default: true) */
  enabled?: boolean;
}

/**
 * useMultiVariableAnimation
 *
 * Animate multiple CSS variables simultaneously with optional stagger.
 *
 * @example
 * ```tsx
 * useMultiVariableAnimation({
 *   variables: [
 *     { variable: "--hue", from: 0, to: 360 },
 *     { variable: "--saturation", from: 80, to: 100 },
 *     { variable: "--lightness", from: 50, to: 60 },
 *   ],
 *   stagger: 0.1,
 * });
 * ```
 */
export function useMultiVariableAnimation({
  variables,
  stagger = 0,
  enabled = true,
}: MultiVariableAnimConfig) {
  // Register each variable animation with optional stagger
  variables.forEach((config, index) => {
    const delay = index * stagger;

    useCSSVariableAnimation({
      ...config,
      enabled: enabled && config.enabled !== false,
      duration: (config.duration || 1) + delay,
    });
  });
}

/**
 * Helper to create pulsing color variable animation
 *
 * @example
 * ```tsx
 * usePulseVariableAnimation("--saturation", { from: 80, to: 100 })
 * ```
 */
export function usePulseVariableAnimation(
  variable: string,
  config: { from: number; to: number; duration?: number }
) {
  const { to, duration = 0.8 } = config;

  useGSAP(() => {
    const target = document.documentElement;

    const tl = gsap.timeline({ repeat: -1, yoyo: true });

    tl.to(
      target,
      {
        [`--${variable}`]: to,
        duration,
        ease: "power1.inOut",
      },
      0
    );

    return () => tl.kill();
  });
}
