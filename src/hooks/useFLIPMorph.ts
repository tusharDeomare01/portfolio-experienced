import { useRef, useCallback } from "react";
import { Flip, useGSAP } from "@/lib/gsap";

/**
 * Configuration for useFLIPMorph hook
 */
export interface FLIPMorphConfig {
  /** Enable/disable FLIP morphing (default: true) */
  enabled?: boolean;
  /** Duration of morph animation in seconds (default: 0.8) */
  duration?: number;
  /** Ease function for morph (default: "smooth.out") */
  ease?: string;
  /** Stagger duration between elements if multiple (default: 0.05) */
  stagger?: number;
  /** Callback fired when morph animation completes */
  onComplete?: () => void;
}

/**
 * Return type for useFLIPMorph hook
 */
export interface FLIPMorphReturn {
  /** Initiate FLIP morph - call before DOM changes */
  initiateFlip: () => void;
  /** Reverse FLIP morph animation */
  reverseFlip: () => void;
}

/**
 * useFLIPMorph
 *
 * Enables seamless layout morphing animations using GSAP FLIP plugin.
 * Perfect for rearranging layouts, expanding elements, or dynamic repositioning.
 *
 * Pattern:
 * 1. Call initiateFlip() to capture current layout state
 * 2. Make DOM changes (rearrange, add/remove elements, change classes)
 * 3. FLIP automatically animates from old to new position
 *
 * Features:
 * - GPU-accelerated transforms (force3D: true)
 * - Automatic willChange management
 * - Respects prefers-reduced-motion
 * - Proper cleanup on unmount
 *
 * @param config Configuration options
 * @returns Object with initiateFlip and reverseFlip functions
 *
 * @example
 * ```tsx
 * const { initiateFlip } = useFLIPMorph({ duration: 0.8 });
 *
 * const handleFilterChange = (filter) => {
 *   initiateFlip(); // Capture state
 *   setActiveFilter(filter); // DOM changes trigger
 *   // FLIP handles animation automatically
 * };
 * ```
 */
export function useFLIPMorph({
  enabled = true,
  duration = 0.8,
  ease = "smooth.out",
  stagger = 0.05,
  onComplete,
}: FLIPMorphConfig = {}): FLIPMorphReturn {
  const flipStateRef = useRef<any>(null);
  const flipTimelineRef = useRef<gsap.core.Timeline | null>(null);

  useGSAP(() => {
    // Check for reduced motion preference
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (prefersReducedMotion) {
      return;
    }

    // Cleanup function
    return () => {
      flipTimelineRef.current?.kill();
      flipStateRef.current = null;
    };
  });

  /**
   * Initiate FLIP morph by capturing current layout state
   * Call this BEFORE making DOM changes
   */
  const initiateFlip = useCallback(() => {
    if (!enabled) return;

    // Check for reduced motion
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (prefersReducedMotion) {
      return;
    }

    // Kill any existing animation
    flipTimelineRef.current?.kill();

    // Capture current state (positions, dimensions, etc.)
    flipStateRef.current = Flip.getState("[data-flip]");
  }, [enabled]);

  /**
   * Reverse FLIP morph animation
   * Animates back to previous state
   */
  const reverseFlip = useCallback(() => {
    if (!enabled || !flipStateRef.current) return;

    // Check for reduced motion
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (prefersReducedMotion) {
      onComplete?.();
      return;
    }

    // Kill any existing animation
    flipTimelineRef.current?.kill();

    // Create animation from previous state to current
    flipTimelineRef.current = Flip.from(flipStateRef.current, {
      duration,
      ease,
      stagger,
      force3D: true,
      onComplete: () => {
        flipStateRef.current = null;
        onComplete?.();
      },
    }) as gsap.core.Timeline;
  }, [enabled, duration, ease, stagger, onComplete]);

  return {
    initiateFlip,
    reverseFlip,
  };
}

/**
 * Advanced FLIP morph hook with automatic state capture
 * Useful for components that need FLIP without manual state management
 */
export interface AutoFLIPMorphConfig extends FLIPMorphConfig {
  /** Selector for elements to morph (default: "[data-flip]") */
  selector?: string;
  /** Automatically apply FLIP on target elements change */
  autoApply?: boolean;
}

/**
 * useAutoFLIPMorph
 *
 * Higher-level FLIP hook that automatically captures and applies morphing.
 * Useful when you want FLIP to "just work" without manual state management.
 *
 * @example
 * ```tsx
 * const { applyFlip } = useAutoFLIPMorph({
 *   selector: ".project-card",
 *   duration: 0.6,
 * });
 *
 * const handleSort = (sortBy) => {
 *   applyFlip(() => {
 *     setProjects(sortedProjects);
 *   });
 * };
 * ```
 */
export function useAutoFLIPMorph({
  selector = "[data-flip]",
  duration = 0.8,
  ease = "smooth.out",
  stagger = 0.05,
  onComplete,
  enabled = true,
}: AutoFLIPMorphConfig = {}) {
  const flipStateRef = useRef<any>(null);
  const flipTimelineRef = useRef<gsap.core.Timeline | null>(null);

  /**
   * Apply FLIP morphing with a callback
   * Automatically captures state, executes callback, and animates
   */
  const applyFlip = useCallback(
    async (callback: () => void | Promise<void>) => {
      if (!enabled) {
        await callback();
        return;
      }

      // Check for reduced motion
      const prefersReducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches;

      // Capture current state
      const targets = document.querySelectorAll(selector);
      if (targets.length === 0) {
        await callback();
        return;
      }

      flipStateRef.current = Flip.getState(targets);

      // Execute DOM changes
      await callback();

      // Wait a frame for DOM to settle
      await new Promise((resolve) => requestAnimationFrame(resolve));

      if (prefersReducedMotion) {
        onComplete?.();
        return;
      }

      // Kill existing animation
      flipTimelineRef.current?.kill();

      // Apply FLIP animation
      flipTimelineRef.current = Flip.from(flipStateRef.current, {
        duration,
        ease,
        stagger,
        force3D: true,
        onComplete: () => {
          flipStateRef.current = null;
          onComplete?.();
        },
      }) as gsap.core.Timeline;
    },
    [selector, enabled, duration, ease, stagger, onComplete]
  );

  useGSAP(() => {
    return () => {
      flipTimelineRef.current?.kill();
      flipStateRef.current = null;
    };
  });

  return {
    applyFlip,
  };
}
