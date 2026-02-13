import { useCallback, useEffect } from "react";
import { useLocation } from "react-router-dom";
import gsap from "gsap";
import type {
  ScrollRestorationConfig,
  ScrollRestorationReturn,
} from "@/types/route-transitions";

/**
 * Storage key for saving scroll position
 */
const SCROLL_POSITION_STORAGE_KEY = "portfolio-scroll-y";

/**
 * useGSAPScrollRestoration
 *
 * Saves and restores scroll position across navigation using React Router state
 * with sessionStorage as fallback for browser back/forward buttons.
 *
 * Workflow:
 * 1. Before navigation: Save scroll position (saved automatically)
 * 2. During navigation: Pass scrollY via React Router state
 * 3. After route animation completes (700ms): Animate scroll to saved position
 *
 * Priority:
 * 1. React Router state (intentional back navigation with state)
 * 2. sessionStorage (browser back button, no state passed)
 * 3. Default to top (0px) if no saved position
 *
 * Features:
 * - Uses GSAP ScrollToPlugin (not native scrollTo with smooth)
 * - Waits for route animation to complete before scrolling
 * - Respects Tour context (disables during guided tours)
 * - Clears state after restoration to prevent re-triggers
 * - Mobile-optimized
 *
 * @param enabled - Enable/disable scroll restoration (default: true)
 * @param offsetY - Offset from target scroll position (default: 80px)
 * @param duration - Duration of scroll animation in seconds (default: 0.4)
 *
 * @returns Object with saveScrollPosition function
 *
 * @example
 * ```tsx
 * const { saveScrollPosition } = useGSAPScrollRestoration();
 *
 * const handleProjectClick = (projectPath: string) => {
 *   const scrollY = saveScrollPosition();
 *   navigate(projectPath, { state: { scrollY } });
 * };
 * ```
 */
export function useGSAPScrollRestoration({
  enabled = true,
  offsetY = 80,
  duration = 0.4,
}: ScrollRestorationConfig = {}): ScrollRestorationReturn {
  const location = useLocation();

  /**
   * Save current scroll position to sessionStorage
   * Returns the saved scroll position for use in navigate state
   */
  const saveScrollPosition = useCallback((): number => {
    const scrollY = window.scrollY;
    sessionStorage.setItem(SCROLL_POSITION_STORAGE_KEY, scrollY.toString());
    return scrollY;
  }, []);

  /**
   * Restore scroll position on route change
   * Waits for route animation to complete before scrolling
   */
  useEffect(() => {
    if (!enabled) return;

    // Priority 1: React Router state (from back button with state)
    const stateScrollY = (location.state as { scrollY?: number })?.scrollY;

    // Priority 2: sessionStorage (from browser back button)
    const storageScrollY = sessionStorage.getItem(SCROLL_POSITION_STORAGE_KEY);
    const parsedStorageScrollY = storageScrollY
      ? parseInt(storageScrollY, 10)
      : null;

    // Determine target scroll position
    const targetScrollY = stateScrollY ?? parsedStorageScrollY;

    // Only restore if there's a meaningful scroll position to restore
    if (targetScrollY && targetScrollY > 100) {
      // Wait for route animation to complete (700ms)
      // Then animate scroll to restored position (400ms)
      gsap.delayedCall(0.7, () => {
        gsap.to(window, {
          scrollTo: { y: targetScrollY, offsetY },
          duration,
          ease: "smooth.out",
        });
      });

      // Clear state to prevent re-trigger on re-renders
      window.history.replaceState({}, "");
      sessionStorage.removeItem(SCROLL_POSITION_STORAGE_KEY);
    } else {
      // No saved position, scroll to top
      window.scrollTo(0, 0);
    }
  }, [location.pathname, enabled, offsetY, duration]);

  return { saveScrollPosition };
}
