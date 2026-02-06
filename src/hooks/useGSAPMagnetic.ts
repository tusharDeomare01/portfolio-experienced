import type { RefObject } from "react";
import { gsap, useGSAP } from "@/lib/gsap";

interface MagneticConfig {
  containerRef: RefObject<HTMLElement | null>;
  selector: string;
  /** Strength of the pull (0 to 1). Default: 0.3 */
  strength?: number;
  /** Whether the target elements are ready in the DOM */
  enabled?: boolean;
}

/**
 * Premium magnetic hover effect with elastic snap-back.
 *
 * Inspired by:
 * - Olivier Larose: gsap.quickTo for performant mousemove tracking
 * - Dylan Brouwer: elastic.out(1.1, 0.4) ease on mouse leave
 * - Decor24: Icon rotation 45° + scale on hover
 *
 * Elements subtly follow the cursor on hover, then spring back
 * with a satisfying elastic bounce when the cursor leaves.
 *
 * Desktop-only — disabled on touch devices.
 */
export function useGSAPMagnetic({
  containerRef,
  selector,
  strength = 0.3,
  enabled = true,
}: MagneticConfig) {
  useGSAP(
    () => {
      if (!containerRef.current || !enabled) return;

      const mm = gsap.matchMedia();

      mm.add("(min-width: 768px) and (hover: hover) and (prefers-reduced-motion: no-preference)", () => {
        const elements =
          containerRef.current!.querySelectorAll<HTMLElement>(selector);

        if (!elements.length) return;

        const cleanups: Array<() => void> = [];

        elements.forEach((el) => {
          // quickTo for buttery-smooth tracking (pre-creates tween for reuse)
          const xTo = gsap.quickTo(el, "x", {
            duration: 0.4,
            ease: "power3",
          });
          const yTo = gsap.quickTo(el, "y", {
            duration: 0.4,
            ease: "power3",
          });

          const handleMove = (e: MouseEvent) => {
            const rect = el.getBoundingClientRect();
            const centerX = rect.left + rect.width / 2;
            const centerY = rect.top + rect.height / 2;
            xTo((e.clientX - centerX) * strength);
            yTo((e.clientY - centerY) * strength);
          };

          // Elastic snap-back on leave — the signature award-winning feel
          const handleLeave = () => {
            gsap.to(el, {
              x: 0,
              y: 0,
              duration: 1,
              ease: "elastic.out(1.1, 0.4)",
            });
          };

          el.addEventListener("mousemove", handleMove);
          el.addEventListener("mouseleave", handleLeave);

          cleanups.push(() => {
            el.removeEventListener("mousemove", handleMove);
            el.removeEventListener("mouseleave", handleLeave);
            gsap.killTweensOf(el, "x,y");
            gsap.set(el, { x: 0, y: 0, clearProps: "x,y" });
          });
        });

        return () => {
          cleanups.forEach((fn) => fn());
        };
      });
    },
    { scope: containerRef, dependencies: [enabled] }
  );
}
