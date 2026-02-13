import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@/lib/gsap";
import type { RefObject } from "react";

/**
 * Parallax speed configuration
 */
export const PARALLAX_SPEEDS = {
  VERY_FAST: 0.5, // Moves slower (background)
  FAST: 0.6,
  SLOW: 0.8,
  NORMAL: 1,
  FAST_FOREGROUND: 1.2,
  VERY_FAST_FOREGROUND: 1.4,
} as const;

/**
 * Configuration for parallax layer animation
 */
export interface ParallaxLayerConfig {
  /** Reference to the container/section element */
  containerRef: RefObject<HTMLElement | null>;
  /** Parallax speed multiplier (0.5 = slower, 1 = normal, 1.2 = faster) */
  speed?: number;
  /** Direction: "vertical" (default) or "horizontal" */
  direction?: "vertical" | "horizontal";
  /** Enable/disable parallax (default: true) */
  enabled?: boolean;
  /** Custom scrub duration (default: 1) */
  scrub?: number | boolean;
  /** Trigger element selector (default: container) */
  trigger?: string;
  /** Custom ScrollTrigger start position */
  start?: string;
  /** Custom ScrollTrigger end position */
  end?: string;
  /** Marker text for debugging */
  marker?: string;
}

/**
 * useGSAPParallaxLayers
 *
 * Creates a parallax scrolling effect for container elements.
 * Elements scroll at different speeds based on their parallax speed value,
 * creating a cinematic 3D depth effect.
 *
 * Common Speed Values:
 * - 0.5-0.6: Slow background elements (mountains, sky)
 * - 0.8-1.0: Midground elements
 * - 1.2-1.4: Fast foreground elements (text, close-up images)
 *
 * Features:
 * - GPU-accelerated with transform
 * - ScrollTrigger integration for dynamic updates
 * - Supports vertical and horizontal parallax
 * - Respects prefers-reduced-motion
 * - Mobile-optimized
 *
 * @example
 * ```tsx
 * // Background layer (moves slower)
 * const bgRef = useRef<HTMLDivElement>(null);
 * useGSAPParallaxLayers({
 *   containerRef: bgRef,
 *   speed: 0.6,
 * });
 *
 * // Foreground layer (moves faster)
 * const fgRef = useRef<HTMLDivElement>(null);
 * useGSAPParallaxLayers({
 *   containerRef: fgRef,
 *   speed: 1.2,
 * });
 * ```
 */
export function useGSAPParallaxLayers({
  containerRef,
  speed = 1,
  direction = "vertical",
  enabled = true,
  scrub = 1,
  trigger,
  start = "top top",
  end = "bottom bottom",
  marker,
}: ParallaxLayerConfig) {
  const scrollTriggerRef = useRef<ScrollTrigger | null>(null);

  useGSAP(
    () => {
      if (!enabled || !containerRef.current) {
        return;
      }

      // Check for reduced motion preference
      const prefersReducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches;

      if (prefersReducedMotion) {
        return;
      }

      // Calculate distance to move
      // Speed < 1 = moves slower (background effect)
      // Speed > 1 = moves faster (foreground effect)
      const distance = (1 - speed) * 100;

      // Determine which property to animate based on direction
      const animationProp = direction === "vertical" ? "yPercent" : "xPercent";

      // Create ScrollTrigger
      scrollTriggerRef.current = ScrollTrigger.create({
        trigger: trigger || containerRef.current,
        start,
        end,
        scrub: scrub as boolean | number,
        markers: marker ? { startColor: "green", endColor: "red" } : false,
        onUpdate: (self) => {
          // Calculate position based on scroll progress
          const progress = self.progress;
          const moveAmount = distance * progress;

          gsap.set(containerRef.current, {
            [animationProp]: moveAmount,
            force3D: true,
            overwrite: false,
          });
        },
      });

      // Cleanup
      return () => {
        scrollTriggerRef.current?.kill();
        scrollTriggerRef.current = null;
      };
    },
    { scope: containerRef, dependencies: [speed, direction, enabled] }
  );
}

/**
 * Advanced configuration for multi-layer parallax
 */
export interface MultiLayerParallaxConfig {
  /** Container reference */
  containerRef: RefObject<HTMLElement | null>;
  /** Layer configurations with selectors */
  layers: Array<{
    selector: string;
    speed: number;
    direction?: "vertical" | "horizontal";
  }>;
  /** Base scrub value (default: 1) */
  scrub?: number | boolean;
  /** Common start trigger */
  trigger?: string;
  /** Custom start position */
  start?: string;
  /** Custom end position */
  end?: string;
}

/**
 * useMultiLayerParallax
 *
 * Applies parallax effects to multiple layers within a container.
 * Useful for complex scenes with many depth layers.
 *
 * @example
 * ```tsx
 * useMultiLayerParallax({
 *   containerRef: sectionRef,
 *   layers: [
 *     { selector: ".bg-mountain", speed: 0.5 },
 *     { selector: ".mid-cloud", speed: 0.8 },
 *     { selector: ".fg-tree", speed: 1.2 },
 *   ],
 * });
 * ```
 */
export function useMultiLayerParallax({
  containerRef,
  layers,
  scrub = 1,
  trigger,
  start = "top top",
  end = "bottom bottom",
}: MultiLayerParallaxConfig) {
  const scrollTriggersRef = useRef<ScrollTrigger[]>([]);

  useGSAP(
    () => {
      if (!containerRef.current) return;

      const prefersReducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches;

      if (prefersReducedMotion) return;

      // Create ScrollTrigger for each layer
      layers.forEach((layer) => {
        const elements = containerRef.current?.querySelectorAll(layer.selector);
        if (!elements || elements.length === 0) return;

        const distance = (1 - layer.speed) * 100;
        const animationProp =
          layer.direction === "horizontal" ? "xPercent" : "yPercent";

        const st = ScrollTrigger.create({
          trigger: trigger || containerRef.current,
          start,
          end,
          scrub: scrub as boolean | number,
          onUpdate: (self) => {
            const progress = self.progress;
            const moveAmount = distance * progress;

            elements.forEach((el) => {
              gsap.set(el, {
                [animationProp]: moveAmount,
                force3D: true,
                overwrite: false,
              });
            });
          },
        });

        scrollTriggersRef.current.push(st);
      });

      return () => {
        scrollTriggersRef.current.forEach((st) => st.kill());
        scrollTriggersRef.current = [];
      };
    },
    { scope: containerRef, dependencies: [layers] }
  );
}

/**
 * Data-attribute driven parallax hook
 * Looks for elements with data-parallax="speed" attributes
 */
export interface DataAttributeParallaxConfig {
  /** Container reference */
  containerRef: RefObject<HTMLElement | null>;
  /** Default scrub value (default: 1) */
  scrub?: number | boolean;
  /** Trigger selector (default: container) */
  trigger?: string;
  /** Start position (default: "top top") */
  start?: string;
  /** End position (default: "bottom bottom") */
  end?: string;
}

/**
 * useDataAttributeParallax
 *
 * Applies parallax based on data-parallax attributes.
 * Allows easy configuration in JSX without explicit hooks.
 *
 * Recognized values:
 * - "very-slow" (0.5)
 * - "slow" (0.8)
 * - "normal" (1.0)
 * - "fast" (1.2)
 * - "very-fast" (1.4)
 * - Or any numeric value (e.g., "0.6")
 *
 * @example
 * ```tsx
 * useDataAttributeParallax({ containerRef });
 *
 * // In JSX:
 * <div data-parallax="very-slow">Mountain background</div>
 * <div data-parallax="fast">Foreground text</div>
 * <div data-parallax="0.7">Custom speed</div>
 * ```
 */
export function useDataAttributeParallax({
  containerRef,
  scrub = 1,
  trigger,
  start = "top top",
  end = "bottom bottom",
}: DataAttributeParallaxConfig) {
  const scrollTriggersRef = useRef<ScrollTrigger[]>([]);

  useGSAP(
    () => {
      if (!containerRef.current) return;

      const prefersReducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches;

      if (prefersReducedMotion) return;

      // Speed value mappings
      const speedMap: Record<string, number> = {
        "very-slow": 0.5,
        slow: 0.8,
        normal: 1,
        fast: 1.2,
        "very-fast": 1.4,
      };

      // Find all parallax elements
      const parallaxElements = containerRef.current?.querySelectorAll(
        "[data-parallax]"
      );

      if (!parallaxElements) return;

      parallaxElements.forEach((el) => {
        const speedAttr = el.getAttribute("data-parallax");
        if (!speedAttr) return;

        // Determine speed
        const speed =
          speedMap[speedAttr] || parseFloat(speedAttr) || PARALLAX_SPEEDS.NORMAL;

        const distance = (1 - speed) * 100;

        const st = ScrollTrigger.create({
          trigger: trigger || containerRef.current,
          start,
          end,
          scrub: scrub as boolean | number,
          onUpdate: (self) => {
            const progress = self.progress;
            const moveAmount = distance * progress;

            gsap.set(el, {
              yPercent: moveAmount,
              force3D: true,
              overwrite: false,
            });
          },
        });

        scrollTriggersRef.current.push(st);
      });

      return () => {
        scrollTriggersRef.current.forEach((st) => st.kill());
        scrollTriggersRef.current = [];
      };
    },
    { scope: containerRef }
  );
}
