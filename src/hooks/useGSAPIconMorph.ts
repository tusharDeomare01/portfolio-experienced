import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@/lib/gsap";

/**
 * Configuration for icon morph animations
 */
export interface IconMorphConfig {
  /** Enable/disable animations (default: true) */
  enabled?: boolean;
  /** Duration of morph animation (default: 0.4) */
  duration?: number;
  /** Ease function (default: "elastic.out(1, 0.5)") */
  ease?: string;
  /** Custom icon morph definitions */
  customMorphs?: Record<string, IconMorphDefinition>;
}

/**
 * Definition for a specific icon morph
 */
export interface IconMorphDefinition {
  /** Animation properties for the icon */
  enter: Record<string, any>;
  /** Animation properties to reset/exit */
  exit: Record<string, any>;
  /** Optional nested selectors to animate (e.g., inner SVG elements) */
  children?: {
    selector: string;
    enter: Record<string, any>;
    exit: Record<string, any>;
  }[];
}

/**
 * Built-in icon morph animations
 */
const DEFAULT_MORPHS: Record<string, IconMorphDefinition> = {
  mail: {
    enter: {
      rotateX: -30,
      scale: 1.05,
    },
    exit: {
      rotateX: 0,
      scale: 1,
    },
    children: [
      {
        selector: "path:nth-child(1)",
        enter: { y: -3 },
        exit: { y: 0 },
      },
    ],
  },
  trophy: {
    enter: {
      translateY: -5,
      scale: 1.15,
    },
    exit: {
      translateY: 0,
      scale: 1,
    },
  },
  settings: {
    enter: {
      rotateZ: 180,
      scale: 1.1,
    },
    exit: {
      rotateZ: 0,
      scale: 1,
    },
  },
  arrow: {
    enter: {
      scale: 1.2,
    },
    exit: {
      scale: 1,
    },
  },
  checkmark: {
    enter: {
      scale: 1,
      opacity: 1,
    },
    exit: {
      scale: 0.8,
      opacity: 0.7,
    },
  },
};

/**
 * useGSAPIconMorph
 *
 * Adds playful, smooth hover animations to icons using GSAP.
 * Supports built-in morphs (mail, trophy, settings, arrow, checkmark)
 * and custom morph definitions.
 *
 * Features:
 * - Data-attribute driven (`data-icon-morph="mail"`)
 * - Automatic hover listener setup
 * - Built-in spring/elastic easing for playful feel
 * - Support for nested element animations
 * - Respects prefers-reduced-motion
 * - Automatic cleanup
 *
 * @example
 * ```tsx
 * // Built-in morphs
 * useGSAPIconMorph();
 *
 * // In JSX
 * <Mail data-icon-morph="mail" className="w-6 h-6" />
 * <Trophy data-icon-morph="trophy" className="w-6 h-6" />
 *
 * // Custom morphs
 * useGSAPIconMorph({
 *   customMorphs: {
 *     custom: {
 *       enter: { scale: 1.5, rotate: 360 },
 *       exit: { scale: 1, rotate: 0 },
 *     },
 *   },
 * });
 * ```
 */
export function useGSAPIconMorph({
  enabled = true,
  duration = 0.4,
  ease = "elastic.out(1, 0.5)",
  customMorphs = {},
}: IconMorphConfig = {}) {
  const iconListenersRef = useRef<Array<() => void>>([]);

  useGSAP(() => {
    if (!enabled) return;

    // Check for reduced motion preference
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (prefersReducedMotion) return;

    // Merge custom and default morphs
    const allMorphs = { ...DEFAULT_MORPHS, ...customMorphs };

    // Find all icons with data-icon-morph attribute
    const icons = document.querySelectorAll("[data-icon-morph]");

    icons.forEach((icon) => {
      const morphType = icon.getAttribute("data-icon-morph");
      if (!morphType || !allMorphs[morphType]) return;

      const morphDef = allMorphs[morphType];

      // Create hover listeners
      const handleMouseEnter = () => {
        gsap.to(icon, {
          ...morphDef.enter,
          duration,
          ease,
          overwrite: false,
        });

        // Animate children if defined
        if (morphDef.children) {
          morphDef.children.forEach(({ selector, enter }) => {
            const child = icon.querySelector(selector);
            if (child) {
              gsap.to(child, {
                ...enter,
                duration,
                ease,
                overwrite: false,
              });
            }
          });
        }
      };

      const handleMouseLeave = () => {
        gsap.to(icon, {
          ...morphDef.exit,
          duration: duration * 0.7,
          ease: "power2.inOut",
          overwrite: false,
        });

        // Reset children
        if (morphDef.children) {
          morphDef.children.forEach(({ selector, exit }) => {
            const child = icon.querySelector(selector);
            if (child) {
              gsap.to(child, {
                ...exit,
                duration: duration * 0.7,
                ease: "power2.inOut",
                overwrite: false,
              });
            }
          });
        }
      };

      // Add listeners
      (icon as HTMLElement).addEventListener("mouseenter", handleMouseEnter);
      (icon as HTMLElement).addEventListener("mouseleave", handleMouseLeave);

      // Store cleanup function
      iconListenersRef.current.push(() => {
        (icon as HTMLElement).removeEventListener("mouseenter", handleMouseEnter);
        (icon as HTMLElement).removeEventListener("mouseleave", handleMouseLeave);
      });
    });

    // Cleanup
    return () => {
      iconListenersRef.current.forEach((cleanup) => cleanup());
      iconListenersRef.current = [];
    };
  });
}

/**
 * Advanced hook for programmatic icon morph control
 */
export function useIconMorphController() {
  const morphsRef = useRef<Map<HTMLElement, any>>(new Map());

  /**
   * Register an icon for manual morph control
   */
  const registerIcon = (
    icon: HTMLElement | null,
    morphDef: IconMorphDefinition,
    options = { duration: 0.4, ease: "elastic.out(1, 0.5)" }
  ) => {
    if (!icon) return;
    morphsRef.current.set(icon, { morphDef, ...options });
  };

  /**
   * Morph icon to enter state
   */
  const morphEnter = (icon: HTMLElement | null) => {
    if (!icon || !morphsRef.current.has(icon)) return;

    const { morphDef, duration, ease } = morphsRef.current.get(icon);

    gsap.to(icon, {
      ...morphDef.enter,
      duration,
      ease,
      overwrite: false,
    });

    if (morphDef.children) {
      morphDef.children.forEach(
        (child: { selector: string; enter: Record<string, any> }) => {
          const childEl = icon.querySelector(child.selector);
          if (childEl) {
            gsap.to(childEl, {
              ...child.enter,
              duration,
              ease,
              overwrite: false,
            });
          }
        }
      );
    }
  };

  /**
   * Morph icon to exit state
   */
  const morphExit = (icon: HTMLElement | null) => {
    if (!icon || !morphsRef.current.has(icon)) return;

    const { morphDef, duration } = morphsRef.current.get(icon);
    const exitDuration = duration * 0.7;

    gsap.to(icon, {
      ...morphDef.exit,
      duration: exitDuration,
      ease: "power2.inOut",
      overwrite: false,
    });

    if (morphDef.children) {
      morphDef.children.forEach(
        (child: { selector: string; exit: Record<string, any> }) => {
          const childEl = icon.querySelector(child.selector);
          if (childEl) {
            gsap.to(childEl, {
              ...child.exit,
              duration: exitDuration,
              ease: "power2.inOut",
              overwrite: false,
            });
          }
        }
      );
    }
  };

  return {
    registerIcon,
    morphEnter,
    morphExit,
  };
}
