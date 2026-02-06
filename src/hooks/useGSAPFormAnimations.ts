import type { RefObject } from "react";
import { gsap, useGSAP } from "@/lib/gsap";

interface FormAnimationsConfig {
  /** Ref to the container scoping all queries */
  containerRef: RefObject<HTMLElement | null>;
  /** Selector for the form element */
  formSelector?: string;
  /** Whether the target elements are ready in the DOM */
  enabled?: boolean;
}

/**
 * Adds interactive animations to form fields:
 * - Focus: bottom border glow effect
 * - Error: shake animation on invalid fields (via exported shakeElement)
 *
 * Targets existing form DOM elements — no component modifications needed.
 * Waits for `enabled` to be true before initializing.
 */
export function useGSAPFormAnimations({
  containerRef,
  formSelector = "#contact form",
  enabled = true,
}: FormAnimationsConfig) {
  useGSAP(
    () => {
      if (!containerRef.current || !enabled) return;

      const mm = gsap.matchMedia();

      mm.add("(min-width: 768px)", () => {
        const form = containerRef.current!.querySelector(formSelector);
        if (!form) return;

        const inputs = form.querySelectorAll<HTMLElement>(
          "input, textarea, select"
        );
        const cleanups: Array<() => void> = [];

        inputs.forEach((input) => {
          const handleFocus = () => {
            gsap.to(input, {
              boxShadow: "0 2px 0 0 hsl(var(--primary))",
              duration: 0.3,
              ease: "power2.out",
            });
          };

          const handleBlur = () => {
            gsap.to(input, {
              boxShadow: "none",
              duration: 0.3,
              ease: "power2.out",
            });
          };

          input.addEventListener("focus", handleFocus);
          input.addEventListener("blur", handleBlur);

          cleanups.push(() => {
            input.removeEventListener("focus", handleFocus);
            input.removeEventListener("blur", handleBlur);
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

/**
 * Shake animation for form validation errors.
 * Call this imperatively when a field fails validation.
 */
export function shakeElement(element: Element) {
  gsap.to(element, {
    keyframes: [
      { x: -10, duration: 0.07 },
      { x: 10, duration: 0.07 },
      { x: -8, duration: 0.07 },
      { x: 8, duration: 0.07 },
      { x: -4, duration: 0.07 },
      { x: 4, duration: 0.07 },
      { x: 0, duration: 0.07 },
    ],
    ease: "power2.out",
  });

  gsap.to(element, {
    borderColor: "#ef4444",
    duration: 0.15,
    onComplete: () => {
      gsap.to(element, {
        borderColor: "",
        duration: 0.3,
        delay: 1,
      });
    },
  });
}
