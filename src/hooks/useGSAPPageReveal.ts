import type { RefObject } from "react";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsap";

interface PageRevealConfig {
  containerRef: RefObject<HTMLElement | null>;
}

/**
 * Premium GSAP scroll-driven reveals for project detail pages
 * (MarketJD, Portfolio).
 *
 * Uses `data-section` attributes for robust targeting instead of
 * fragile CSS utility class selectors.
 *
 * Desktop:
 * - Hero: staggered entrance (immediate, not scroll-driven)
 * - Hero logo parallax: logo drifts up at a different scroll rate
 * - Hero badges stagger pop: badges pop in with spring easing after hero entrance
 * - Nav row: slide down
 * - Content sections: alternating clip-path wipe directions (bottom/right) + staggered children, scrub-driven
 * - Section icon rotation: heading SVG icons rotate in with back.out easing on scroll
 * - Summary card: horizontal clip-path wipe
 * - Summary grid items: counter-style alternating entrance (left/below/right)
 * - All scroll-driven animations are bidirectional (reverse on scroll up)
 *
 * Mobile:
 * - Simple fade-up reveals with toggleActions for bidirectional
 *
 * Respects prefers-reduced-motion.
 */
export function useGSAPPageReveal({ containerRef }: PageRevealConfig) {
  useGSAP(
    () => {
      if (!containerRef.current) return;

      const mm = gsap.matchMedia();
      const container = containerRef.current;

      // ─── Desktop: Premium reveals ──────────────────────────────────
      mm.add("(min-width: 768px) and (prefers-reduced-motion: no-preference)", () => {
        // ── Nav row entrance (immediate, not scroll-driven) ──
        const navRow = container.querySelector('[data-section="nav"]');
        if (navRow) {
          gsap.fromTo(
            navRow,
            { y: -20, opacity: 0 },
            {
              y: 0,
              opacity: 1,
              duration: 0.6,
              ease: "smooth.out",
              delay: 0.1,
            }
          );
        }

        // ── Hero header: staggered entrance (immediate) ──
        const heroSection = container.querySelector('[data-section="hero"]');
        if (heroSection) {
          const heroChildren = heroSection.children;
          gsap.fromTo(
            heroChildren,
            { y: 50, opacity: 0, scale: 0.97 },
            {
              y: 0,
              opacity: 1,
              scale: 1,
              stagger: 0.1,
              duration: 0.8,
              ease: "smooth.out",
              delay: 0.2,
            }
          );

          // ── Hero logo parallax: drifts up at a different rate ──
          const heroLogo = heroSection.querySelector(".min-w-\\[120px\\]");
          if (heroLogo) {
            gsap.to(heroLogo, {
              yPercent: -15,
              scale: 0.95,
              ease: "none",
              scrollTrigger: {
                trigger: heroSection,
                start: "top top",
                end: "bottom top",
                scrub: true,
              },
            });
          }

          // ── Hero badges stagger pop ──
          const heroBadges = heroSection.querySelectorAll(
            ".flex-wrap .inline-flex, .flex-wrap > span, .flex-wrap > div"
          );
          if (heroBadges.length) {
            gsap.fromTo(
              heroBadges,
              { y: 20, opacity: 0, scale: 0.8 },
              {
                y: 0,
                opacity: 1,
                scale: 1,
                stagger: 0.08,
                duration: 0.5,
                ease: "back.out(1.7)",
                delay: 0.6,
              }
            );
          }
        }

        // ── Scroll-driven content sections ──
        const scrollSections = container.querySelectorAll(
          '[data-section="tech-stack"], [data-section="integrations"], [data-section="features"]'
        );
        scrollSections.forEach((section, sectionIndex) => {
          // ── Alternating section reveal direction ──
          // Even sections wipe from bottom, odd sections wipe from right
          const clipFrom =
            sectionIndex % 2 === 0
              ? "inset(100% 0% 0% 0%)" // bottom wipe
              : "inset(0% 0% 0% 100%)"; // right wipe

          // Section heading: clip-path wipe with alternating direction
          const heading = section.querySelector(".mb-6");
          if (heading) {
            gsap.set(heading, { willChange: "clip-path, transform, opacity" });
            gsap.fromTo(
              heading,
              {
                clipPath: clipFrom,
                y: 20,
                opacity: 0,
              },
              {
                clipPath: "inset(0% 0% 0% 0%)",
                y: 0,
                opacity: 1,
                duration: 0.7,
                ease: "reveal",
                scrollTrigger: {
                  trigger: heading,
                  start: "top 88%",
                  end: "top 60%",
                  scrub: 1,
                  // Bidirectional: willChange lifecycle
                  onLeave: () => gsap.set(heading, { willChange: "auto" }),
                  onEnterBack: () => gsap.set(heading, { willChange: "clip-path, transform, opacity" }),
                },
              }
            );

            // ── Section icon rotation ──
            const icon = heading.querySelector("svg");
            if (icon) {
              gsap.fromTo(
                icon,
                { rotate: -90, scale: 0.5, opacity: 0 },
                {
                  rotate: 0,
                  scale: 1,
                  opacity: 1,
                  duration: 0.6,
                  ease: "back.out(1.7)",
                  scrollTrigger: {
                    trigger: heading,
                    start: "top 88%",
                    end: "top 60%",
                    scrub: 1,
                  },
                }
              );
            }
          }

          // Section content: the main content area below heading
          // Target direct children that aren't the heading
          const contentChildren = Array.from(section.children).filter(
            (child) => !child.classList.contains("mb-6")
          );
          if (contentChildren.length) {
            gsap.fromTo(
              contentChildren,
              { y: 40, opacity: 0, scale: 0.97 },
              {
                y: 0,
                opacity: 1,
                scale: 1,
                stagger: 0.08,
                duration: 0.7,
                ease: "smooth.out",
                scrollTrigger: {
                  trigger: section,
                  start: "top 82%",
                  end: "top 40%",
                  scrub: 1,
                },
              }
            );
          }
        });

        // ── Summary card: horizontal clip-path wipe ──
        const summarySection = container.querySelector('[data-section="summary"]');
        if (summarySection) {
          const card = summarySection.querySelector(".border-primary\\/20");
          const target = card || summarySection;

          gsap.set(target, { willChange: "clip-path, opacity" });
          gsap.fromTo(
            target,
            {
              clipPath: "inset(0% 100% 0% 0%)",
              opacity: 0,
            },
            {
              clipPath: "inset(0% 0% 0% 0%)",
              opacity: 1,
              duration: 1,
              ease: "reveal",
              scrollTrigger: {
                trigger: target,
                start: "top 88%",
                end: "top 50%",
                scrub: 1,
                onLeave: () => gsap.set(target, { willChange: "auto" }),
                onEnterBack: () => gsap.set(target, { willChange: "clip-path, opacity" }),
              },
            }
          );

          // Summary grid items: counter-style alternating entrance
          const gridItems = summarySection.querySelectorAll(".grid > div");
          if (gridItems.length) {
            gridItems.forEach((item, i) => {
              // First from left, second from below, third from right, then repeat
              const fromX = i % 3 === 0 ? -40 : i % 3 === 2 ? 40 : 0;
              const fromY = i % 3 === 1 ? 40 : 20;
              gsap.fromTo(
                item,
                { x: fromX, y: fromY, opacity: 0, scale: 0.9 },
                {
                  x: 0,
                  y: 0,
                  opacity: 1,
                  scale: 1,
                  duration: 0.6,
                  ease: "smooth.out",
                  scrollTrigger: {
                    trigger: summarySection,
                    start: `top ${75 - i * 3}%`,
                    end: `top ${40 - i * 3}%`,
                    scrub: 1,
                  },
                }
              );
            });
          }
        }
      });

      // ─── Mobile: Simple bidirectional reveals ────────────────────────
      mm.add("(max-width: 767px) and (prefers-reduced-motion: no-preference)", () => {
        // Hero entrance (immediate)
        const heroSection = container.querySelector('[data-section="hero"]');
        if (heroSection) {
          gsap.fromTo(
            heroSection.children,
            { y: 25, opacity: 0 },
            {
              y: 0,
              opacity: 1,
              stagger: 0.08,
              duration: 0.5,
              ease: "smooth.out",
              delay: 0.1,
            }
          );
        }

        // Scroll-driven sections with bidirectional toggle
        const sections = container.querySelectorAll("[data-section]");
        sections.forEach((section) => {
          const sectionType = section.getAttribute("data-section");
          // Skip nav and hero (already animated above)
          if (sectionType === "nav" || sectionType === "hero") return;

          gsap.fromTo(
            section,
            { y: 30, opacity: 0 },
            {
              y: 0,
              opacity: 1,
              duration: 0.5,
              ease: "smooth.out",
              scrollTrigger: {
                trigger: section,
                start: "top 90%",
                toggleActions: "play none none reverse",
              },
            }
          );
        });
      });

      // ─── Reduced motion: instant ──────────────────────────────────
      mm.add("(prefers-reduced-motion: reduce)", () => {
        const allSections = container.querySelectorAll("[data-section]");
        allSections.forEach((section) => {
          gsap.set(section, { opacity: 1, y: 0, scale: 1, clipPath: "none" });
          gsap.set(section.children, { opacity: 1, y: 0, scale: 1 });
        });
      });

      ScrollTrigger.refresh();
    },
    { scope: containerRef }
  );
}
