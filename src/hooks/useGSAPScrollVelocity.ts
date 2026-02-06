import type { RefObject } from "react";
import { gsap, Observer, useGSAP } from "@/lib/gsap";

interface ScrollVelocityConfig {
  containerRef: RefObject<HTMLElement | null>;
  selector: string;
  maxSkew?: number;
  enabled?: boolean;
}

/**
 * Scroll-velocity based skew effect for premium momentum feel.
 *
 * When the user scrolls fast, matched elements subtly skew in the
 * scroll direction. When scrolling stops, they spring back to neutral.
 *
 * Inspired by:
 * - Locomotive Scroll's velocity-driven transforms
 * - Awwwards SOTD sites with scroll-reactive layouts
 * - Linear's micro-interaction philosophy
 *
 * Uses gsap.quickTo for buttery 60fps interpolation and Observer
 * for high-frequency velocity tracking without layout thrash.
 *
 * Desktop-only; respects prefers-reduced-motion.
 */
export function useGSAPScrollVelocity({
  containerRef,
  selector,
  maxSkew = 4,
  enabled = true,
}: ScrollVelocityConfig) {
  useGSAP(
    () => {
      if (!containerRef.current || !enabled) return;

      const mm = gsap.matchMedia();

      mm.add(
        "(min-width: 768px) and (prefers-reduced-motion: no-preference)",
        () => {
          const container = containerRef.current!;
          const elements = container.querySelectorAll(selector);

          if (!elements.length) return;

          // Prepare quickTo instances for each element — one per element
          // for smooth, independent interpolation at 60fps.
          const quickToInstances = Array.from(elements).map((el) => {
            gsap.set(el, { willChange: "transform" });
            return gsap.quickTo(el, "skewY", {
              duration: 0.4,
              ease: "power2.out",
            });
          });

          // Track whether we have a pending "spring back" timeout
          let springBackTimeout: ReturnType<typeof setTimeout> | null = null;

          // Use Observer for high-frequency scroll velocity tracking.
          // Observer fires on every scroll frame without layout reads.
          const observer = Observer.create({
            target: window,
            type: "scroll,wheel,touch",
            onChangeY: (self) => {
              // self.velocityY is pixels/second — normalize to a skew value.
              // Typical fast scroll is ~2000-4000 px/s; map to [-maxSkew, maxSkew].
              const velocity = self.velocityY ?? 0;
              const normalizedSkew = (velocity / 1000) * maxSkew;

              // Clamp between -maxSkew and +maxSkew
              const clampedSkew = gsap.utils.clamp(
                -maxSkew,
                maxSkew,
                normalizedSkew
              );

              // Apply skew to all elements via quickTo (smooth interpolation)
              quickToInstances.forEach((qt) => qt(clampedSkew));

              // Clear any existing spring-back timer
              if (springBackTimeout !== null) {
                clearTimeout(springBackTimeout);
              }

              // Schedule spring-back to 0 when scrolling stops.
              // 150ms debounce ensures we don't spring back during active scroll.
              springBackTimeout = setTimeout(() => {
                elements.forEach((el) => {
                  gsap.to(el, {
                    skewY: 0,
                    duration: 0.8,
                    ease: "elastic.out(1, 0.4)",
                    overwrite: true,
                  });
                });
                springBackTimeout = null;
              }, 150);
            },
          });

          // Clean up on context kill (matchMedia revert or unmount)
          return () => {
            observer.kill();

            if (springBackTimeout !== null) {
              clearTimeout(springBackTimeout);
            }

            // Reset all elements to neutral skew and clear willChange
            elements.forEach((el) => {
              gsap.set(el, { skewY: 0, willChange: "auto" });
            });
          };
        }
      );
    },
    { scope: containerRef, dependencies: [enabled, selector, maxSkew] }
  );
}
