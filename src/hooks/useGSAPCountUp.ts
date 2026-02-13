import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@/lib/gsap";
import type { RefObject } from "react";

/**
 * Configuration for number counter animation
 */
export interface CountUpConfig {
  /** Reference to the element containing the number */
  elementRef: RefObject<HTMLElement | null>;
  /** Starting value (default: 0) */
  from?: number;
  /** Target value to count up to */
  to: number;
  /** Duration of animation in seconds (default: 1.5) */
  duration?: number;
  /** Ease function (default: "power2.out") */
  ease?: string;
  /** Number of decimal places to show (default: 0) */
  decimals?: number;
  /** Prefix to prepend to number (e.g., "$", "#") */
  prefix?: string;
  /** Suffix to append to number (e.g., "+", "yrs", "%") */
  suffix?: string;
  /** Separator for thousand values (default: ",") */
  separator?: string;
  /** Enable/disable animation (default: true) */
  enabled?: boolean;
  /** ScrollTrigger configuration for scroll-triggered animation */
  scrollTrigger?: Record<string, unknown> & { enabled?: boolean };
  /** Custom format function */
  format?: (value: number) => string;
  /** Callback when animation completes */
  onComplete?: () => void;
}

/**
 * useGSAPCountUp
 *
 * Animates a number counting up from one value to another.
 * Useful for statistics, metrics, years of experience, etc.
 *
 * Features:
 * - Customizable format (prefix, suffix, separators)
 * - ScrollTrigger integration (count on scroll into view)
 * - Decimal precision support
 * - Custom format function support
 * - Respects prefers-reduced-motion
 *
 * @example
 * ```tsx
 * // Count up when element scrolls into view
 * <span ref={yearsRef} data-countup="15" data-countup-suffix="+ years">
 *   15+ years
 * </span>
 *
 * // With hook
 * useGSAPCountUp({
 *   elementRef: yearsRef,
 *   to: 15,
 *   suffix: "+ years",
 *   scrollTrigger: {
 *     trigger: yearsRef.current,
 *     start: "top 80%",
 *   },
 * });
 * ```
 */
export function useGSAPCountUp({
  elementRef,
  from = 0,
  to,
  duration = 1.5,
  ease = "power2.out",
  decimals = 0,
  prefix = "",
  suffix = "",
  separator = ",",
  enabled = true,
  scrollTrigger: scrollTriggerConfig,
  format,
  onComplete,
}: CountUpConfig) {
  const counterRef = useRef({ value: from });
  const timelineRef = useRef<gsap.core.Timeline | null>(null);

  useGSAP(
    () => {
      if (!enabled || !elementRef.current) {
        return;
      }

      // Check for reduced motion preference
      const prefersReducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches;

      if (prefersReducedMotion) {
        // Set to final value immediately
        elementRef.current.textContent = formatNumber(to);
        onComplete?.();
        return;
      }

      /**
       * Format a number with proper separators and decimals
       */
      function formatNumber(value: number): string {
        if (format) {
          return format(value);
        }

        // Round or keep decimals
        const formatted = decimals > 0 ? value.toFixed(decimals) : Math.round(value);

        // Add separators for thousands
        const parts = formatted.toString().split(".");
        parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, separator);

        return `${prefix}${parts.join(".")}${suffix}`;
      }

      // Create animation config
      const animConfig: any = {
        value: to,
        duration,
        ease,
        onUpdate: () => {
          if (elementRef.current) {
            elementRef.current.textContent = formatNumber(counterRef.current.value);
          }
        },
        onComplete: () => {
          onComplete?.();
        },
      };

      // Add ScrollTrigger if configured
      if (scrollTriggerConfig && scrollTriggerConfig.enabled !== false) {
        animConfig.scrollTrigger = {
          ...scrollTriggerConfig,
          toggleActions: "play none none none",
          markers: false,
        };
      }

      // Kill existing timeline
      timelineRef.current?.kill();

      // Create animation
      timelineRef.current = gsap.timeline();
      timelineRef.current.to(counterRef.current, animConfig);

      // Cleanup
      return () => {
        timelineRef.current?.kill();
      };
    },
    { scope: elementRef, dependencies: [to, duration, decimals] }
  );
}

/**
 * Data-attribute driven counter hook
 * Looks for elements with data-countup attributes
 */
export interface DataAttributeCountUpConfig {
  /** Container reference */
  containerRef: RefObject<HTMLElement | null>;
  /** Default animation duration (default: 1.5s) */
  duration?: number;
  /** Default ease (default: "power2.out") */
  ease?: string;
  /** Enable ScrollTrigger for all counters (default: true) */
  useScrollTrigger?: boolean;
  /** ScrollTrigger start position (default: "top 80%") */
  triggerStart?: string;
}

/**
 * useDataAttributeCountUp
 *
 * Automatically counts up elements with data-countup attributes.
 *
 * Expected attributes:
 * - data-countup="NUMBER" - The target number to count to
 * - data-countup-from="NUMBER" (optional) - Starting value, default 0
 * - data-countup-decimals="NUMBER" (optional) - Decimal places
 * - data-countup-prefix="TEXT" (optional) - Prefix (e.g., "$")
 * - data-countup-suffix="TEXT" (optional) - Suffix (e.g., "+")
 *
 * @example
 * ```tsx
 * useDataAttributeCountUp({ containerRef });
 *
 * // In JSX:
 * <span data-countup="2" data-countup-suffix="+ years">2+ years</span>
 * <span data-countup="15" data-countup-prefix="#">#15</span>
 * <span data-countup="2024" data-countup-decimals="2">2024</span>
 * ```
 */
export function useDataAttributeCountUp({
  containerRef,
  duration = 1.5,
  ease = "power2.out",
  useScrollTrigger = true,
  triggerStart = "top 80%",
}: DataAttributeCountUpConfig) {
  const timeLinesRef = useRef<Map<HTMLElement, gsap.core.Timeline>>(new Map());

  useGSAP(
    () => {
      if (!containerRef.current) return;

      const prefersReducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches;

      // Find all data-countup elements
      const countupElements = containerRef.current.querySelectorAll(
        "[data-countup]"
      );

      countupElements.forEach((element) => {
        const targetStr = element.getAttribute("data-countup");
        if (!targetStr) return;

        const target = parseFloat(targetStr);
        if (isNaN(target)) return;

        const fromStr = element.getAttribute("data-countup-from");
        const from = fromStr ? parseFloat(fromStr) : 0;

        const decimalsStr = element.getAttribute("data-countup-decimals");
        const decimals = decimalsStr ? parseInt(decimalsStr, 10) : 0;

        const prefix = element.getAttribute("data-countup-prefix") || "";
        const suffix = element.getAttribute("data-countup-suffix") || "";

        const counterObj = { value: from };

        function formatNumber(value: number): string {
          const formatted = decimals > 0 ? value.toFixed(decimals) : Math.round(value);
          const parts = formatted.toString().split(".");
          parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
          return `${prefix}${parts.join(".")}${suffix}`;
        }

        const animConfig: any = {
          value: target,
          duration,
          ease,
          onUpdate: () => {
            (element as HTMLElement).textContent = formatNumber(counterObj.value);
          },
        };

        if (useScrollTrigger && !prefersReducedMotion) {
          animConfig.scrollTrigger = {
            trigger: element,
            start: triggerStart,
            toggleActions: "play none none none",
            markers: false,
          };
        }

        // Kill existing timeline for this element
        timeLinesRef.current.get(element as HTMLElement)?.kill();

        // Create animation
        const tl = gsap.timeline();
        tl.to(counterObj, animConfig);
        timeLinesRef.current.set(element as HTMLElement, tl);
      });

      return () => {
        timeLinesRef.current.forEach((tl) => tl.kill());
        timeLinesRef.current.clear();
      };
    },
    { scope: containerRef }
  );
}
