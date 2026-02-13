import type { RefObject } from "react";

/**
 * Defines the type of route transition occurring
 */
export type TransitionType =
  | "home-to-project"
  | "project-to-home"
  | "project-to-project"
  | null;

/**
 * State managed by GSAPRouteTransition wrapper
 */
export interface RouteTransitionState {
  /** Whether a transition is currently in progress */
  isTransitioning: boolean;
  /** The previous route path */
  previousPath: string | null;
  /** The next route path */
  nextPath: string | null;
  /** Scroll position before navigation */
  scrollPosition: number;
  /** Type of transition based on previous and next paths */
  transitionType: TransitionType;
}

/**
 * Configuration for useGSAPRouteAnimation hook
 */
export interface RouteAnimationConfig {
  /** Reference to the container element to animate */
  containerRef: RefObject<HTMLElement | null>;
  /** Type of transition (determines animation sequence) */
  transitionType: TransitionType;
  /** Callback fired when animation completes */
  onComplete?: () => void;
  /** Enable/disable animations (useful for direct visits) */
  enabled?: boolean;
}

/**
 * Configuration for useGSAPScrollRestoration hook
 */
export interface ScrollRestorationConfig {
  /** Enable/disable scroll restoration */
  enabled?: boolean;
  /** Offset from target scroll position (default: 80px) */
  offsetY?: number;
  /** Duration of scroll animation in seconds (default: 0.4) */
  duration?: number;
}

/**
 * Return type for useGSAPScrollRestoration hook
 */
export interface ScrollRestorationReturn {
  /** Function to save current scroll position before navigation */
  saveScrollPosition: () => number;
}
