import type { RefObject } from "react";
import { gsap, useGSAP } from "@/lib/gsap";

interface CounterTarget {
  /** CSS selector for the element containing the number */
  selector: string;
  /** The end value to count to */
  endValue: number;
  /** Text prefix (e.g., "$") */
  prefix?: string;
  /** Text suffix (e.g., "+", "%") */
  suffix?: string;
  /** Number of decimal places */
  decimals?: number;
  /** Animation duration in seconds */
  duration?: number;
}

interface CounterConfig {
  /** Ref to the container scoping all queries */
  containerRef: RefObject<HTMLElement | null>;
  /** Array of counter targets */
  counters: CounterTarget[];
}

/**
 * Animates numbers counting up when they scroll into view.
 * Targets existing DOM elements by selector — no component modifications needed.
 */
export function useGSAPCounter({ containerRef, counters }: CounterConfig) {
  useGSAP(
    () => {
      if (!containerRef.current) return;

      counters.forEach(
        ({
          selector,
          endValue,
          prefix = "",
          suffix = "",
          decimals = 0,
          duration = 2,
        }) => {
          const element =
            containerRef.current!.querySelector<HTMLElement>(selector);
          if (!element) return;

          const proxy = { value: 0 };
          const snapValue =
            decimals === 0 ? 1 : 1 / Math.pow(10, decimals);

          gsap.to(proxy, {
            value: endValue,
            duration,
            ease: "power2.out",
            snap: { value: snapValue },
            scrollTrigger: {
              trigger: element,
              start: "top 85%",
              toggleActions: "play none none none",
            },
            onUpdate: () => {
              element.textContent = `${prefix}${proxy.value.toFixed(decimals)}${suffix}`;
            },
          });
        }
      );
    },
    { scope: containerRef }
  );
}
