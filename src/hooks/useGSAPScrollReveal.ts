import type { RefObject } from "react";
import { gsap, ScrollTrigger, SplitText, useGSAP } from "@/lib/gsap";

interface ScrollRevealConfig {
  containerRef: RefObject<HTMLElement | null>;
  enabled?: boolean;
}

/**
 * Award-winning scroll-triggered reveal system.
 *
 * Inspired by:
 * - Dylan Brouwer: word-level reveals with skew, scrub-driven sections
 * - Decor24: SplitText line reveals, pinned hero overlays
 * - Magnify Partners: char-level animations, grayscale→color reveals
 * - Signals: staggered mask reveals, parallax images
 *
 * Performance:
 * — clip-path reveals (GPU-composited, zero layout cost)
 * — scrub:true for 1:1 scroll-lock on desktop
 * — Subtle 3D transforms (rotateX/rotateY) with transformPerspective for premium depth
 * — Wave-ripple staggers from center for organic motion
 * — prefers-reduced-motion respected at every level
 */
export function useGSAPScrollReveal({
  containerRef,
  enabled = true,
}: ScrollRevealConfig) {
  useGSAP(
    () => {
      if (!containerRef.current || !enabled) return;

      const mm = gsap.matchMedia();
      const container = containerRef.current;

      // ─── Desktop: Premium reveals ──────────────────────────────────────
      mm.add("(min-width: 768px) and (prefers-reduced-motion: no-preference)", () => {

        // ── About Section: Line-by-line clip-path wipe reveal ──
        // (Inspired by Decor24's SplitText word reveals)
        const aboutParagraphs = container.querySelectorAll(
          "#about .font-bold"
        );
        aboutParagraphs.forEach((p) => {
          // Hint GPU layer for clip-path transition
          gsap.set(p, { willChange: "clip-path, transform, opacity", transformPerspective: 600 });
          // Clip-path wipe from bottom with perspective tilt
          gsap.fromTo(
            p,
            {
              clipPath: "inset(100% 0% 0% 0%)",
              y: 30,
              opacity: 0,
              rotateX: 8,
            },
            {
              clipPath: "inset(0% 0% 0% 0%)",
              y: 0,
              opacity: 1,
              rotateX: 0,
              duration: 1,
              ease: "reveal",
              scrollTrigger: {
                trigger: p,
                start: "top 88%",
                end: "top 50%",
                scrub: 1,
                onLeave: () => gsap.set(p, { willChange: "auto" }),
                onEnterBack: () => gsap.set(p, { willChange: "clip-path, transform, opacity" }),
              },
            }
          );
        });

        // ── Education Section: Card reveals with perspective lift ──
        // (Inspired by Magnify Partners' staggered card depth)
        const eduCards = container.querySelectorAll(
          "#education .grid > div"
        );
        eduCards.forEach((card, i) => {
          gsap.set(card, { transformPerspective: 800 });
          gsap.fromTo(
            card,
            {
              y: 60,
              opacity: 0,
              scale: 0.95,
              rotateY: i % 2 === 0 ? -5 : 5,
            },
            {
              y: 0,
              opacity: 1,
              scale: 1,
              rotateY: 0,
              duration: 0.8,
              ease: "smooth.out",
              scrollTrigger: {
                trigger: card,
                start: "top 92%",
                end: "top 58%",
                scrub: 1,
              },
              delay: i * 0.05,
            }
          );
        });

        // ── Education: Soft Skills badges wave reveal ──
        // (Inspired by Signals' staggered copy reveals)
        const skillBadges = container.querySelectorAll(
          "#skills .flex-wrap > div"
        );
        if (skillBadges.length) {
          gsap.fromTo(
            skillBadges,
            { y: 20, opacity: 0, scale: 0.9 },
            {
              y: 0,
              opacity: 1,
              scale: 1,
              stagger: {
                each: 0.04,
                from: "center",
                ease: "power2.out",
              },
              duration: 0.5,
              ease: "smooth.out",
              scrollTrigger: {
                trigger: "#skills",
                start: "top 85%",
                end: "top 55%",
                scrub: 1,
              },
            }
          );
        }

        // NOTE: Projects section animations are now self-contained in
        // ProjectsSection.tsx using its own useGSAP hook with bidirectional
        // scroll-driven reveals. Removed from here to avoid conflicts.

        // ── Contact Section: Form fields stagger reveal ──
        const contactFields = container.querySelectorAll(
          "#contact form input, #contact form textarea, #contact form select"
        );
        if (contactFields.length) {
          gsap.fromTo(
            contactFields,
            { y: 30, opacity: 0, boxShadow: "inset 200px 0 0 0 transparent" },
            {
              y: 0,
              opacity: 1,
              stagger: 0.06,
              duration: 0.5,
              ease: "smooth.out",
              scrollTrigger: {
                trigger: "#contact form",
                start: "top 85%",
                end: "top 60%",
                scrub: 1,
              },
            }
          );
        }

        // ── Contact submit button: Spring entrance ──
        const submitBtn = container.querySelector(
          "#contact form button[type='submit']"
        );
        if (submitBtn) {
          gsap.fromTo(
            submitBtn,
            { scale: 0.85, opacity: 0 },
            {
              scale: 1,
              opacity: 1,
              duration: 0.5,
              ease: "spring",
              scrollTrigger: {
                trigger: submitBtn,
                start: "top 92%",
                toggleActions: "play none none reverse",
              },
            }
          );
        }

        // ── Section headings: Word-by-word SplitText reveal ──
        // (Inspired by Dylan Brouwer's staggered word reveals)
        const sectionHeadings = container.querySelectorAll(
          "#about > div:first-child, #education > div > .flex:first-child, #career > .text-center, #achievements > .flex:first-child, #contact > .text-center"
        );
        sectionHeadings.forEach((heading) => {
          // Try to do SplitText on heading text elements
          const textEl = heading.querySelector("p, h2, h3, span");
          if (textEl && textEl.textContent && textEl.textContent.trim().length > 0) {
            try {
              const split = new SplitText(textEl, { type: "words" });
              gsap.fromTo(
                split.words,
                { y: 25, opacity: 0, letterSpacing: "0.05em" },
                {
                  y: 0,
                  opacity: 1,
                  letterSpacing: "0em",
                  stagger: 0.04,
                  duration: 0.5,
                  ease: "smooth.out",
                  scrollTrigger: {
                    trigger: heading,
                    start: "top 90%",
                    end: "top 65%",
                    scrub: 1,
                  },
                }
              );
            } catch {
              // Fallback: Animate the whole heading
              gsap.fromTo(
                heading,
                { y: 30, opacity: 0 },
                {
                  y: 0,
                  opacity: 1,
                  duration: 0.6,
                  ease: "smooth.out",
                  scrollTrigger: {
                    trigger: heading,
                    start: "top 90%",
                    end: "top 65%",
                    scrub: 1,
                  },
                }
              );
            }
          } else {
            // No text element found, animate container
            gsap.fromTo(
              heading,
              { y: 30, opacity: 0 },
              {
                y: 0,
                opacity: 1,
                duration: 0.6,
                ease: "smooth.out",
                scrollTrigger: {
                  trigger: heading,
                  start: "top 90%",
                  end: "top 65%",
                  scrub: 1,
                },
              }
            );
          }
        });
      });

      // ─── Mobile: Simpler reveals ──────────────────────────────────────
      mm.add("(max-width: 767px)", () => {
        const sections = ["#about", "#education", "#projects", "#contact"];
        sections.forEach((sel) => {
          const section = container.querySelector(sel);
          if (!section) return;

          gsap.fromTo(
            section.children,
            { y: 30, opacity: 0 },
            {
              y: 0,
              opacity: 1,
              stagger: 0.06,
              duration: 0.5,
              ease: "smooth.out",
              scrollTrigger: {
                trigger: section,
                start: "top 88%",
                toggleActions: "play none none none",
              },
            }
          );
        });
      });

      // ─── Reduced motion: instant reveals ──────────────────────────────
      mm.add("(prefers-reduced-motion: reduce)", () => {
        gsap.globalTimeline.timeScale(20);
      });

      ScrollTrigger.refresh();
    },
    { scope: containerRef, dependencies: [enabled] }
  );
}
