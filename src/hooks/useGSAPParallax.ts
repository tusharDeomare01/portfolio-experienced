import type { RefObject } from "react";
import { gsap, useGSAP } from "@/lib/gsap";

interface ParallaxConfig {
  containerRef: RefObject<HTMLElement | null>;
}

/**
 * Cinematic multi-layer parallax system with premium 3D tilt.
 *
 * Inspired by:
 * - Decor24: Hero overlay with scroll-driven opacity + scale transitions
 * - Thomas Thorstensson: Multi-layer depth with translateZ(0)
 * - Dylan Brouwer: Section heading drift for subtle depth
 * - Apple product pages: Mouse-driven 3D tilt for depth perception
 *
 * Layers move at different speeds relative to scroll:
 * - Profile image: slowest (recedes into distance)
 * - Hero text: moderate drift (separates from image)
 * - Hero buttons: fastest drift (closest to viewer)
 *
 * Premium enhancements:
 * - Mouse-driven 3D tilt on hero elements (opposite-direction parallax card)
 * - Continuous floating animation on profile image
 * - Scroll-linked rotation on profile image
 *
 * Desktop-only; respects prefers-reduced-motion.
 */
export function useGSAPParallax({ containerRef }: ParallaxConfig) {
  useGSAP(
    () => {
      if (!containerRef.current) return;

      const mm = gsap.matchMedia();

      mm.add("(min-width: 768px) and (prefers-reduced-motion: no-preference)", () => {
        const container = containerRef.current!;
        const heroEl = container.querySelector<HTMLElement>("#hero");

        // ─── Layer 1: Profile image — slowest, recedes back ─────────────
        const heroImage = container.querySelector<HTMLElement>(
          "#hero .hero-right-section"
        );
        if (heroImage) {
          gsap.set(heroImage, {
            willChange: "transform, opacity",
            transformPerspective: 800,
            transformStyle: "preserve-3d",
          });

          // Existing scroll parallax
          gsap.to(heroImage, {
            yPercent: -25,
            scale: 0.92,
            opacity: 0.3,
            ease: "none",
            scrollTrigger: {
              trigger: "#hero",
              start: "top top",
              end: "bottom top",
              scrub: true,
            },
          });

          // Scroll-linked rotation (0 -> 8 degrees as user scrolls)
          gsap.to(heroImage, {
            rotationZ: 8,
            ease: "none",
            scrollTrigger: {
              trigger: "#hero",
              start: "top top",
              end: "bottom top",
              scrub: 1.5,
            },
          });

          // Continuous floating animation (subtle yoyo up/down)
          const floatTween = gsap.to(heroImage, {
            y: -10,
            duration: 3,
            ease: "sine.inOut",
            yoyo: true,
            repeat: -1,
          });

          // Stop floating when hero scrolls out of view to save resources
          gsap.timeline({
            scrollTrigger: {
              trigger: "#hero",
              start: "top top",
              end: "bottom top",
              onLeave: () => floatTween.pause(),
              onEnterBack: () => floatTween.resume(),
            },
          });
        }

        // ─── Layer 2: Hero text — moderate speed, drifts up with fade ───
        const heroText = container.querySelector<HTMLElement>(
          "#hero .hero-left-section"
        );
        if (heroText) {
          gsap.set(heroText, {
            willChange: "transform, opacity",
            transformPerspective: 600,
            transformStyle: "preserve-3d",
          });
          gsap.to(heroText, {
            yPercent: -15,
            opacity: 0.1,
            ease: "none",
            scrollTrigger: {
              trigger: "#hero",
              start: "center center",
              end: "bottom top",
              scrub: true,
            },
          });
        }

        // ─── Layer 3: Hero buttons — fastest drift (foreground feel) ────
        const heroButtons = container.querySelector<HTMLElement>(
          "#hero .hero-buttons"
        );
        if (heroButtons) {
          gsap.set(heroButtons, { willChange: "transform, opacity" });
          gsap.to(heroButtons, {
            yPercent: -35,
            opacity: 0,
            ease: "none",
            scrollTrigger: {
              trigger: "#hero",
              start: "40% top",
              end: "bottom top",
              scrub: true,
            },
          });
        }

        // ─── Mouse-driven 3D tilt system ────────────────────────────────
        // Uses gsap.quickTo for buttery-smooth pointer tracking.
        // Tilts hero elements in the opposite direction of the mouse
        // to create a premium parallax card depth effect.
        if (heroEl) {
          // Profile image tilt — stronger effect (~8 degrees max)
          const imageRotateX = heroImage
            ? gsap.quickTo(heroImage, "rotationX", { duration: 0.6, ease: "power2.out" })
            : null;
          const imageRotateY = heroImage
            ? gsap.quickTo(heroImage, "rotationY", { duration: 0.6, ease: "power2.out" })
            : null;

          // Hero text tilt — subtler effect (~3 degrees max)
          const textRotateX = heroText
            ? gsap.quickTo(heroText, "rotationX", { duration: 0.8, ease: "power2.out" })
            : null;
          const textRotateY = heroText
            ? gsap.quickTo(heroText, "rotationY", { duration: 0.8, ease: "power2.out" })
            : null;

          const IMAGE_MAX_TILT = 8;
          const TEXT_MAX_TILT = 3;

          const handleMouseMove = (e: MouseEvent) => {
            const rect = heroEl.getBoundingClientRect();

            // Normalize mouse position to -1 ... 1 range relative to hero
            const normalizedX = ((e.clientX - rect.left) / rect.width) * 2 - 1;
            const normalizedY = ((e.clientY - rect.top) / rect.height) * 2 - 1;

            // Tilt in the OPPOSITE direction of the mouse for parallax depth
            // rotationX: positive = top edge comes toward viewer
            // rotationY: positive = right edge comes toward viewer
            if (imageRotateX) imageRotateX(normalizedY * IMAGE_MAX_TILT);
            if (imageRotateY) imageRotateY(-normalizedX * IMAGE_MAX_TILT);

            if (textRotateX) textRotateX(normalizedY * TEXT_MAX_TILT);
            if (textRotateY) textRotateY(-normalizedX * TEXT_MAX_TILT);
          };

          const handleMouseLeave = () => {
            // Smoothly reset tilt to neutral on mouse leave
            if (imageRotateX) imageRotateX(0);
            if (imageRotateY) imageRotateY(0);
            if (textRotateX) textRotateX(0);
            if (textRotateY) textRotateY(0);
          };

          heroEl.addEventListener("mousemove", handleMouseMove);
          heroEl.addEventListener("mouseleave", handleMouseLeave);

          // ─── Cleanup ────────────────────────────────────────────────
          // matchMedia context auto-reverts GSAP tweens/ScrollTriggers,
          // but we must manually remove DOM event listeners and clear
          // willChange to avoid compositor layer leaks.
          return () => {
            heroEl.removeEventListener("mousemove", handleMouseMove);
            heroEl.removeEventListener("mouseleave", handleMouseLeave);

            // Clear willChange on all managed elements
            const managedEls = [heroImage, heroText, heroButtons].filter(
              (el): el is HTMLElement => el !== null
            );
            for (const el of managedEls) {
              gsap.set(el, { willChange: "auto" });
            }
          };
        }
      });
    },
    { scope: containerRef }
  );
}
