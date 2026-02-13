import { useRef } from "react";
import gsap from "gsap";
import { Observer } from "gsap/Observer";
import { useGSAP } from "@/lib/gsap";
import type { RefObject } from "react";

/**
 * Velocity thresholds for different scroll speeds (pixels per second)
 */
const VELOCITY_THRESHOLDS = {
  SLOW: 500,
  MEDIUM: 2000,
  FAST: 2000,
  MOBILE_FAST: 6000,
};

/**
 * Configuration for useObserverVelocity hook
 */
export interface ObserverVelocityConfig {
  /** Reference to container element to observe */
  containerRef: RefObject<HTMLElement | null>;
  /** Callback fired on fast scroll (>2000px/s or >6000px/s on mobile) */
  onFastScroll?: (velocity: number) => void;
  /** Callback fired on medium speed scroll (500-2000px/s) */
  onMediumScroll?: (velocity: number) => void;
  /** Callback fired on slow scroll (<500px/s) */
  onSlowScroll?: (velocity: number) => void;
  /** Callback fired when scroll velocity reaches zero */
  onStopScroll?: () => void;
  /** Enable/disable observer (default: true) */
  enabled?: boolean;
  /** Custom fast scroll threshold (default: 2000px/s on desktop, 6000px/s on mobile) */
  fastThreshold?: number;
  /** Apply blur effect based on velocity (0-8px) */
  enableBlur?: boolean;
  /** Apply bounce effect when scroll stops */
  enableBounce?: boolean;
}

/**
 * useObserverVelocity
 *
 * Uses GSAP Observer plugin to detect scroll velocity and trigger callbacks.
 * Enables dynamic, velocity-based animations that respond to user scroll speed.
 *
 * Features:
 * - Scroll velocity detection (fast, medium, slow)
 * - Optional blur effect proportional to velocity
 * - Optional bounce effect when scroll stops
 * - Mobile-optimized with higher velocity thresholds
 * - Respects prefers-reduced-motion
 * - Automatic cleanup on unmount
 *
 * @example
 * ```tsx
 * const containerRef = useRef<HTMLDivElement>(null);
 *
 * useObserverVelocity({
 *   containerRef,
 *   onFastScroll: (velocity) => {
 *     gsap.to(titleRef.current, { filter: "blur(3px)" });
 *   },
 *   onSlowScroll: () => {
 *     gsap.to(titleRef.current, { filter: "blur(0px)" });
 *   },
 *   enableBlur: true,
 *   enableBounce: true,
 * });
 * ```
 */
export function useObserverVelocity({
  containerRef,
  onFastScroll,
  onMediumScroll,
  onSlowScroll,
  onStopScroll,
  enabled = true,
  fastThreshold,
  enableBlur = false,
  enableBounce = false,
}: ObserverVelocityConfig) {
  const observerRef = useRef<any>(null);
  const velocityRef = useRef<number>(0);
  const velocityTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const lastVelocityCallRef = useRef<"fast" | "medium" | "slow" | null>(null);

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

      // Determine if mobile
      const isMobile = window.innerWidth < 768;
      const finalFastThreshold =
        fastThreshold ||
        (isMobile ? VELOCITY_THRESHOLDS.MOBILE_FAST : VELOCITY_THRESHOLDS.FAST);

      // Create Observer instance
      const observerConfig = {
        type: "wheel,touch",
        onMove: (self: any) => {
          const velocity = Math.abs(self.getVelocity());
          velocityRef.current = velocity;

          // Clear existing timeout
          if (velocityTimeoutRef.current) {
            clearTimeout(velocityTimeoutRef.current);
          }

          // Determine velocity category
          let category: "fast" | "medium" | "slow";

          if (velocity > finalFastThreshold) {
            category = "fast";
          } else if (velocity > VELOCITY_THRESHOLDS.SLOW) {
            category = "medium";
          } else {
            category = "slow";
          }

          // Only call callbacks when category changes
          if (category !== lastVelocityCallRef.current) {
            lastVelocityCallRef.current = category;

            switch (category) {
              case "fast":
                onFastScroll?.(velocity);
                break;
              case "medium":
                onMediumScroll?.(velocity);
                break;
              case "slow":
                onSlowScroll?.(velocity);
                break;
            }
          }

          // Apply blur effect if enabled
          if (enableBlur && containerRef.current) {
            const blurAmount = Math.min((velocity / finalFastThreshold) * 8, 8);
            gsap.to(containerRef.current, {
              filter: `blur(${blurAmount}px)`,
              duration: 0.15,
              overwrite: false,
            });
          }

          // Set timeout to detect scroll stop
          velocityTimeoutRef.current = setTimeout(() => {
            if (velocityRef.current === velocity && velocity < 100) {
              lastVelocityCallRef.current = null;
              onStopScroll?.();

              // Apply bounce effect if enabled
              if (enableBounce && containerRef.current) {
                gsap.to(containerRef.current, {
                  filter: enableBlur ? "blur(0px)" : undefined,
                  duration: 0.3,
                  ease: "elastic.out(1.5, 0.5)",
                  overwrite: false,
                });
              }
            }
          }, 150);
        },
      };

      // Create Observer instance (cast to any to work around type issues)
      observerRef.current = new (Observer as any)(observerConfig);

      // Cleanup function
      return () => {
        observerRef.current?.kill();
        if (velocityTimeoutRef.current) {
          clearTimeout(velocityTimeoutRef.current);
        }
      };
    },
    { scope: containerRef, dependencies: [enabled, enableBlur, enableBounce] }
  );
}
