import type { RefObject } from "react";
import { gsap, useGSAP } from "@/lib/gsap";

interface BlurRevealConfig {
  containerRef: RefObject<HTMLElement | null>;
  selector: string;
  blurAmount?: number;
  start?: string;
  enabled?: boolean;
}

/**
 * Premium blur-to-focus text reveal on scroll.
 *
 * Elements start blurred and gradually sharpen as the user scrolls
 * them into view. Creates a cinematic "rack focus" effect.
 *
 * Desktop-only, scrub-driven, respects reduced motion.
 */
export function useGSAPBlurReveal({
  containerRef,
  selector,
  blurAmount = 12,
  start = "top 85%",
  enabled = true,
}: BlurRevealConfig) {
  useGSAP(
    () => {
      if (!containerRef.current || !enabled) return;

      const mm = gsap.matchMedia();

      mm.add("(min-width: 768px) and (prefers-reduced-motion: no-preference)", () => {
        const elements = containerRef.current!.querySelectorAll<HTMLElement>(selector);

        elements.forEach((el) => {
          gsap.set(el, { willChange: "filter, transform, opacity" });

          gsap.fromTo(
            el,
            {
              filter: `blur(${blurAmount}px)`,
              opacity: 0.3,
              y: 15,
            },
            {
              filter: "blur(0px)",
              opacity: 1,
              y: 0,
              duration: 1,
              ease: "smooth.out",
              scrollTrigger: {
                trigger: el,
                start,
                end: "top 45%",
                scrub: 1,
                onLeave: () => gsap.set(el, { willChange: "auto" }),
                onEnterBack: () => gsap.set(el, { willChange: "filter, transform, opacity" }),
              },
            }
          );
        });
      });
    },
    { scope: containerRef, dependencies: [enabled] }
  );
}
