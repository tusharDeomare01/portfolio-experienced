import type { RefObject } from "react";
import { gsap, SplitText, useGSAP } from "@/lib/gsap";

interface TextRevealConfig {
  containerRef: RefObject<HTMLElement | null>;
  /** CSS selector for elements whose text should be split and revealed */
  selector: string;
  /** ScrollTrigger start position */
  start?: string;
  /** Whether lazy sections are ready in the DOM */
  enabled?: boolean;
}

/**
 * Premium text reveal using GSAP SplitText plugin with built-in masking.
 *
 * Inspired by:
 * - Dylan Brouwer: word-by-word reveals with skew + y-offset
 * - Decor24: SplitText line reveals with stagger 0.075s
 * - Magnify Partners: character-level y translate with opacity
 *
 * Uses SplitText's built-in `mask` option (v3.13+) which automatically
 * creates overflow:hidden wrapper divs — no manual CSS needed.
 *
 * Words slide up from behind their line mask, creating a clean
 * "text waterfall" effect. Desktop-only; mobile shows text instantly.
 */
export function useGSAPTextReveal({
  containerRef,
  selector,
  start = "top 78%",
  enabled = true,
}: TextRevealConfig) {
  useGSAP(
    () => {
      if (!containerRef.current || !enabled) return;

      const mm = gsap.matchMedia();

      mm.add("(min-width: 768px) and (prefers-reduced-motion: no-preference)", () => {
        const elements =
          containerRef.current!.querySelectorAll<HTMLElement>(selector);
        const splits: SplitText[] = [];

        elements.forEach((el) => {
          if (!el.textContent?.trim()) return;

          // SplitText with mask: "words" auto-creates overflow:hidden wrappers
          const split = new SplitText(el, {
            type: "words",
            wordsClass: "gsap-word",
            mask: "words",
          });
          splits.push(split);

          // Animate words sliding up from behind their mask
          gsap.fromTo(
            split.words,
            {
              yPercent: 110,
            },
            {
              yPercent: 0,
              stagger: 0.035,
              duration: 0.8,
              ease: "smooth.out",
              scrollTrigger: {
                trigger: el,
                start,
                end: "top 45%",
                scrub: 1,
              },
            }
          );
        });

        // Cleanup: revert SplitText on context kill
        return () => {
          splits.forEach((s) => s.revert());
        };
      });
    },
    { scope: containerRef, dependencies: [enabled] }
  );
}
