import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import type { RouteAnimationConfig } from "@/types/route-transitions";

/**
 * useGSAPRouteAnimation
 *
 * Orchestrates route transition animations using GSAP.
 *
 * Supports three scenarios:
 * 1. Home → Project: 700ms (exit 0-350ms + enter 350-700ms + children stagger 400-700ms)
 * 2. Project → Home: 700ms (exit 0-350ms + enter 200-550ms with 150ms overlap)
 * 3. Project ↔ Project: 500ms (exit 0-250ms + enter 150-500ms with 100ms overlap)
 *
 * Features:
 * - GPU-accelerated properties only (transform, opacity, filter)
 * - willChange lifecycle management for performance
 * - Media queries for desktop/mobile/reduced-motion
 * - Children stagger for premium feel (50ms intervals on desktop, 30ms on mobile)
 * - Automatic cleanup via useGSAP scope
 *
 * @param containerRef - Reference to container element to animate
 * @param transitionType - Type of transition (determines animation sequence)
 * @param onComplete - Optional callback when animation completes
 * @param enabled - Enable/disable animations (default: true)
 *
 * @example
 * ```tsx
 * const pageRef = useRef<HTMLDivElement>(null);
 * useGSAPRouteAnimation({
 *   containerRef: pageRef,
 *   transitionType: 'home-to-project',
 * });
 * ```
 */
export function useGSAPRouteAnimation({
  containerRef,
  transitionType,
  onComplete,
  enabled = true,
}: RouteAnimationConfig) {
  const timelineRef = useRef<gsap.core.Timeline | null>(null);

  useGSAP(
    () => {
      if (!containerRef.current || !transitionType || !enabled) {
        return;
      }

      const mm = gsap.matchMedia();
      const cleanups: Array<() => void> = [];

      /**
       * Desktop: Full animations with blur, scale, proper stagger
       */
      mm.add("(min-width: 768px) and (prefers-reduced-motion: no-preference)", () => {
        const tl = gsap.timeline({
          onComplete: () => {
            onComplete?.();
          },
        });

        timelineRef.current = tl;

        switch (transitionType) {
          case "home-to-project":
            animateHomeToProject(tl, containerRef.current!);
            break;
          case "project-to-home":
            animateProjectToHome(tl, containerRef.current!);
            break;
          case "project-to-project":
            animateProjectToProject(tl, containerRef.current!);
            break;
        }

        cleanups.push(() => tl.kill());
      });

      /**
       * Mobile: Reduced durations (30% faster), skip blur if low-end device
       */
      mm.add("(max-width: 767px) and (prefers-reduced-motion: no-preference)", () => {
        const isLowEnd = navigator.hardwareConcurrency < 4;

        const tl = gsap.timeline({
          onComplete: () => {
            onComplete?.();
          },
        });

        timelineRef.current = tl;

        const durationMultiplier = 0.7; // 30% faster
        const shouldBlur = !isLowEnd; // Skip blur on low-end devices

        switch (transitionType) {
          case "home-to-project":
            animateHomeToProjectMobile(
              tl,
              containerRef.current!,
              durationMultiplier,
              shouldBlur
            );
            break;
          case "project-to-home":
            animateProjectToHomeMobile(
              tl,
              containerRef.current!,
              durationMultiplier,
              shouldBlur
            );
            break;
          case "project-to-project":
            animateProjectToProjectMobile(
              tl,
              containerRef.current!,
              durationMultiplier,
              shouldBlur
            );
            break;
        }

        cleanups.push(() => tl.kill());
      });

      /**
       * Reduced motion: Opacity-only, fast duration (100ms)
       */
      mm.add("(prefers-reduced-motion: reduce)", () => {
        const tl = gsap.timeline({
          onComplete: () => {
            onComplete?.();
          },
        });

        timelineRef.current = tl;

        gsap.set(containerRef.current!, {
          willChange: "opacity",
        });

        // Simple opacity fade for all transition types
        tl.to(
          containerRef.current!,
          {
            opacity: 0.5,
            duration: 0.05,
            ease: "none",
          },
          0
        ).to(
          containerRef.current!,
          {
            opacity: 1,
            duration: 0.05,
            ease: "none",
          },
          0.05
        );

        cleanups.push(() => {
          tl.kill();
          gsap.set(containerRef.current!, {
            willChange: "auto",
            clearProps: "opacity",
          });
        });
      });

      return () => {
        cleanups.forEach((fn) => fn());
        mm.revert();
      };
    },
    { scope: containerRef, dependencies: [transitionType, enabled] }
  );
}

/**
 * Home → Project: 700ms total
 * Exit (0-350ms): Fade 1→0.3, Blur 0→6px, Scale 1→0.98, Y 0→-10px
 * Enter (350-700ms): Reverse, stagger children
 */
function animateHomeToProject(
  tl: gsap.core.Timeline,
  container: HTMLElement
) {
  gsap.set(container, {
    willChange: "transform, opacity, filter",
  });

  // Exit: 0-350ms
  tl.to(
    container,
    {
      opacity: 0.3,
      filter: "blur(6px)",
      scale: 0.98,
      y: -10,
      duration: 0.35,
      ease: "power2.inOut",
    },
    0
  );

  // Enter: 350-700ms (fade in, blur clear, scale restore)
  tl.fromTo(
    ".route-enter-content",
    {
      opacity: 0.3,
      filter: "blur(6px)",
      scale: 0.98,
      y: -10,
    },
    {
      opacity: 1,
      filter: "blur(0px)",
      scale: 1,
      y: 0,
      duration: 0.35,
      ease: "power3.out",
      clearProps: "filter",
    },
    0.35
  );

  // Children stagger: 400-700ms (50ms intervals)
  tl.fromTo(
    ".route-enter-child",
    {
      opacity: 0,
      y: 20,
    },
    {
      opacity: 1,
      y: 0,
      duration: 0.4,
      stagger: 0.05,
      ease: "power3.out",
      onComplete: () => {
        gsap.set(container, { willChange: "auto" });
      },
    },
    0.4
  );
}

/**
 * Project → Home: 700ms total
 * Exit (0-350ms): Fade 1→0.2, Blur 0→8px, Scale 1→0.95
 * Enter (200-550ms): Reverse with 150ms overlap
 */
function animateProjectToHome(
  tl: gsap.core.Timeline,
  container: HTMLElement
) {
  gsap.set(container, {
    willChange: "transform, opacity, filter",
  });

  // Exit: 0-350ms (deeper fade and blur than home→project)
  tl.to(
    container,
    {
      opacity: 0.2,
      filter: "blur(8px)",
      scale: 0.95,
      duration: 0.35,
      ease: "power2.inOut",
    },
    0
  );

  // Enter: 200-550ms (150ms overlap for smooth cross-fade)
  tl.fromTo(
    ".route-enter-content",
    {
      opacity: 0.2,
      filter: "blur(8px)",
      scale: 0.95,
    },
    {
      opacity: 1,
      filter: "blur(0px)",
      scale: 1,
      duration: 0.35,
      ease: "power3.out",
      clearProps: "filter",
      onComplete: () => {
        gsap.set(container, { willChange: "auto" });
      },
    },
    0.2
  );
}

/**
 * Project ↔ Project: 500ms total
 * Exit (0-250ms): Fade 1→0, Blur 0→6px (fast)
 * Enter (150-500ms): Reverse with 100ms overlap
 */
function animateProjectToProject(
  tl: gsap.core.Timeline,
  container: HTMLElement
) {
  gsap.set(container, {
    willChange: "transform, opacity, filter",
  });

  // Exit: 0-250ms (faster than full page transitions)
  tl.to(
    container,
    {
      opacity: 0,
      filter: "blur(6px)",
      duration: 0.25,
      ease: "power2.in",
    },
    0
  );

  // Enter: 150-500ms (100ms overlap for snappy cross-fade)
  tl.fromTo(
    ".route-enter-content",
    {
      opacity: 0,
      filter: "blur(6px)",
    },
    {
      opacity: 1,
      filter: "blur(0px)",
      duration: 0.35,
      ease: "power3.out",
      clearProps: "filter",
      onComplete: () => {
        gsap.set(container, { willChange: "auto" });
      },
    },
    0.15
  );
}

/**
 * Mobile: Home → Project with optimizations
 */
function animateHomeToProjectMobile(
  tl: gsap.core.Timeline,
  container: HTMLElement,
  durationMultiplier: number,
  shouldBlur: boolean
) {
  gsap.set(container, {
    willChange: shouldBlur ? "transform, opacity, filter" : "transform, opacity",
  });

  const exitDuration = 0.35 * durationMultiplier;
  const enterDuration = 0.35 * durationMultiplier;
  const staggerDuration = 0.4 * durationMultiplier;

  // Exit
  const exitProps: any = {
    opacity: 0.3,
    scale: 0.98,
    y: -10,
    duration: exitDuration,
    ease: "power2.inOut",
  };
  if (shouldBlur) exitProps.filter = "blur(6px)";

  tl.to(container, exitProps, 0);

  // Enter
  const enterFromProps: any = {
    opacity: 0.3,
    scale: 0.98,
    y: -10,
  };
  const enterToProps: any = {
    opacity: 1,
    scale: 1,
    y: 0,
    duration: enterDuration,
    ease: "power3.out",
  };
  if (shouldBlur) {
    enterFromProps.filter = "blur(6px)";
    enterToProps.filter = "blur(0px)";
    enterToProps.clearProps = "filter";
  }

  tl.fromTo(".route-enter-content", enterFromProps, enterToProps, exitDuration);

  // Children stagger (faster on mobile: 30ms instead of 50ms)
  tl.fromTo(
    ".route-enter-child",
    {
      opacity: 0,
      y: 20,
    },
    {
      opacity: 1,
      y: 0,
      duration: staggerDuration,
      stagger: 0.03,
      ease: "power3.out",
      onComplete: () => {
        gsap.set(container, { willChange: "auto" });
      },
    },
    exitDuration + 0.05
  );
}

/**
 * Mobile: Project → Home with optimizations
 */
function animateProjectToHomeMobile(
  tl: gsap.core.Timeline,
  container: HTMLElement,
  durationMultiplier: number,
  shouldBlur: boolean
) {
  gsap.set(container, {
    willChange: shouldBlur ? "transform, opacity, filter" : "transform, opacity",
  });

  const exitDuration = 0.35 * durationMultiplier;
  const enterDuration = 0.35 * durationMultiplier;
  const overlapDelay = 0.2 * durationMultiplier;

  // Exit
  const exitProps: any = {
    opacity: 0.2,
    scale: 0.95,
    duration: exitDuration,
    ease: "power2.inOut",
  };
  if (shouldBlur) exitProps.filter = "blur(8px)";

  tl.to(container, exitProps, 0);

  // Enter
  const enterFromProps: any = {
    opacity: 0.2,
    scale: 0.95,
  };
  const enterToProps: any = {
    opacity: 1,
    scale: 1,
    duration: enterDuration,
    ease: "power3.out",
    onComplete: () => {
      gsap.set(container, { willChange: "auto" });
    },
  };
  if (shouldBlur) {
    enterFromProps.filter = "blur(8px)";
    enterToProps.filter = "blur(0px)";
    enterToProps.clearProps = "filter";
  }

  tl.fromTo(
    ".route-enter-content",
    enterFromProps,
    enterToProps,
    overlapDelay
  );
}

/**
 * Mobile: Project ↔ Project with optimizations
 */
function animateProjectToProjectMobile(
  tl: gsap.core.Timeline,
  container: HTMLElement,
  durationMultiplier: number,
  shouldBlur: boolean
) {
  gsap.set(container, {
    willChange: shouldBlur ? "transform, opacity, filter" : "transform, opacity",
  });

  const exitDuration = 0.25 * durationMultiplier;
  const enterDuration = 0.35 * durationMultiplier;
  const overlapDelay = 0.15 * durationMultiplier;

  // Exit
  const exitProps: any = {
    opacity: 0,
    duration: exitDuration,
    ease: "power2.in",
  };
  if (shouldBlur) exitProps.filter = "blur(6px)";

  tl.to(container, exitProps, 0);

  // Enter
  const enterFromProps: any = { opacity: 0 };
  const enterToProps: any = {
    opacity: 1,
    duration: enterDuration,
    ease: "power3.out",
    onComplete: () => {
      gsap.set(container, { willChange: "auto" });
    },
  };
  if (shouldBlur) {
    enterFromProps.filter = "blur(6px)";
    enterToProps.filter = "blur(0px)";
    enterToProps.clearProps = "filter";
  }

  tl.fromTo(
    ".route-enter-content",
    enterFromProps,
    enterToProps,
    overlapDelay
  );
}
