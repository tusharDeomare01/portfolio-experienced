import type { RefObject } from "react";
import { gsap, useGSAP } from "@/lib/gsap";

interface SectionExitConfig {
  containerRef: RefObject<HTMLElement | null>;
  sectionIds?: string[];
  enabled?: boolean;
}

/**
 * Cinematic section exit — sections recede into depth as the user scrolls past.
 *
 * Inspired by Decor24's footer slide-up and Magnify Partners' background fade.
 * Creates a layered "card stack" feel where past sections dim, shrink, and
 * visually recede like fading memories.
 *
 * Premium multi-layer approach:
 * - Opacity fades to 0.2 with progressive blur (depth-of-field)
 * - Subtle scale-down to 0.96 with rotateX 2.5 for dramatic 3D receding
 * - Gentle upward drift (-50px)
 * - Color desaturation via CSS filter (blur + saturate + grayscale) for a
 *   "memory fading" feel
 * - Progressive clip-path mask — content narrows into a receding card shape
 * - Border radius growth — sections morph into floating cards
 * - Box shadow emergence — depth shadow appears as sections recede
 * - 3D perspective depth (transformPerspective: 800) for convincing parallax
 * - Staggered child dissolution — children animate independently
 *
 * Desktop-only, scrub:true for 1:1 scroll-lock.
 * Respects prefers-reduced-motion.
 */
export function useGSAPSectionExit({
  containerRef,
  sectionIds = [
    "about",
    "education",
    "career",
    "projects",
    "achievements",
    "contact",
  ],
  enabled = true,
}: SectionExitConfig) {
  useGSAP(
    () => {
      if (!containerRef.current || !enabled) return;

      const mm = gsap.matchMedia();

      mm.add("(min-width: 768px) and (prefers-reduced-motion: no-preference)", () => {
        const container = containerRef.current!;

        sectionIds.forEach((id) => {
          const section = container.querySelector(`#${id}`) as HTMLElement | null;
          if (!section) return;

          // Ensure the section has overflow hidden so clip-path and border-radius
          // render cleanly without child bleed
          gsap.set(section, { overflow: "hidden" });

          // Premium exit: fade + scale + lift + blur + grayscale desaturation +
          // rotateX with perspective + clip-path mask + border-radius + box-shadow
          gsap.to(section, {
            opacity: 0.2,
            scale: 0.96,
            y: -50,
            transformPerspective: 800,
            rotateX: 2.5,
            filter: "blur(2px) saturate(0.7) grayscale(0.4)",
            clipPath: "inset(0% 2% 0% 2%)",
            borderRadius: "16px",
            boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
            ease: "none",
            scrollTrigger: {
              trigger: section,
              start: "bottom 25%",
              end: "bottom -20%",
              scrub: true,
              onEnter: () =>
                gsap.set(section, {
                  willChange: "transform, opacity, filter, clip-path, border-radius, box-shadow",
                }),
              onLeave: () =>
                gsap.set(section, { willChange: "auto" }),
              onEnterBack: () =>
                gsap.set(section, {
                  willChange: "transform, opacity, filter, clip-path, border-radius, box-shadow",
                }),
              onLeaveBack: () =>
                gsap.set(section, {
                  willChange: "auto",
                  filter: "none",
                  clipPath: "none",
                  borderRadius: "0px",
                  boxShadow: "none",
                }),
            },
          });

          // Staggered child dissolution — children animate independently
          const children = section.querySelectorAll(":scope > *");
          if (children.length > 1) {
            gsap.to(children, {
              opacity: 0.3,
              y: -15,
              stagger: 0.02,
              ease: "none",
              scrollTrigger: {
                trigger: section,
                start: "bottom 20%",
                end: "bottom -25%",
                scrub: true,
              },
            });
          }
        });
      });
    },
    { scope: containerRef, dependencies: [enabled] }
  );
}
