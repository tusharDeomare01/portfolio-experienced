import type { RefObject } from "react";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsap";

interface SectionColorsConfig {
  containerRef: RefObject<HTMLElement | null>;
  enabled?: boolean;
}

/**
 * Smooth background color/tint morphing between sections on scroll.
 *
 * Creates a single fixed overlay that covers the entire viewport and
 * subtly shifts its color as each major section enters view. The overlay
 * uses `mix-blend-mode: soft-light` at extremely low opacity (0.02-0.04)
 * so the tint is felt rather than seen — just enough to shift the mood
 * without being obvious.
 *
 * Inspired by:
 * - Apple product pages: ambient color washes that shift with content
 * - Linear.app: section-aware tinting that guides emotional tone
 *
 * Desktop-only. Respects prefers-reduced-motion.
 * Cleans up the injected DOM overlay on unmount.
 */

interface SectionTint {
  id: string;
  color: string;
  opacity: number;
}

const SECTION_TINTS: SectionTint[] = [
  { id: "about", color: "rgba(245, 158, 11, 1)", opacity: 0.03 },    // Warm amber/gold
  { id: "education", color: "rgba(59, 130, 246, 1)", opacity: 0.03 }, // Cool blue
  { id: "career", color: "rgba(99, 102, 241, 1)", opacity: 0.025 },   // Indigo
  { id: "projects", color: "rgba(168, 85, 247, 1)", opacity: 0.035 }, // Purple
  { id: "achievements", color: "rgba(234, 179, 8, 1)", opacity: 0.03 }, // Gold
  { id: "contact", color: "rgba(34, 197, 94, 1)", opacity: 0.03 },    // Green
];

export function useGSAPSectionColors({
  containerRef,
  enabled = true,
}: SectionColorsConfig) {
  useGSAP(
    () => {
      if (!containerRef.current || !enabled) return;

      const mm = gsap.matchMedia();

      mm.add(
        "(min-width: 768px) and (prefers-reduced-motion: no-preference)",
        () => {
          const container = containerRef.current!;

          // ─── Create the shared overlay element ───────────────────────────
          const overlay = document.createElement("div");
          overlay.setAttribute("aria-hidden", "true");
          overlay.setAttribute("data-gsap-section-tint", "");
          Object.assign(overlay.style, {
            position: "fixed",
            inset: "0",
            width: "100vw",
            height: "100vh",
            pointerEvents: "none",
            zIndex: "1",
            mixBlendMode: "soft-light",
            opacity: "0",
            backgroundColor: "transparent",
            willChange: "opacity, background-color",
          });
          document.body.appendChild(overlay);

          // ─── Build scroll-driven tint transitions per section ────────────
          SECTION_TINTS.forEach(({ id, color, opacity }) => {
            const section = container.querySelector(`#${id}`);
            if (!section) return;

            // As section enters the viewport, morph the overlay to this tint
            gsap.to(overlay, {
              backgroundColor: color,
              opacity,
              ease: "none",
              scrollTrigger: {
                trigger: section,
                start: "top 80%",
                end: "top 30%",
                scrub: true,
              },
            });

            // As section exits the viewport, fade the overlay back out
            gsap.to(overlay, {
              opacity: 0,
              ease: "none",
              scrollTrigger: {
                trigger: section,
                start: "bottom 30%",
                end: "bottom top",
                scrub: true,
              },
            });
          });

          ScrollTrigger.refresh();

          // ─── Cleanup: remove overlay when matchMedia context reverts ────
          return () => {
            overlay.remove();
          };
        }
      );
    },
    { scope: containerRef, dependencies: [enabled] }
  );
}
