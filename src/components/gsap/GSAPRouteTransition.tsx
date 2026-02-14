import React, { createContext, useContext, useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import type {
  RouteTransitionState,
  TransitionType,
} from "@/types/route-transitions";

/**
 * Context for route transition state
 * Provides animation state to child components
 */
const RouteTransitionContext = createContext<RouteTransitionState | null>(null);

/**
 * Hook to access route transition state from context
 */
export function useRouteTransition(): RouteTransitionState {
  const context = useContext(RouteTransitionContext);
  if (!context) {
    throw new Error("useRouteTransition must be used within GSAPRouteTransition");
  }
  return context;
}

/**
 * Determines the type of transition based on previous and next paths
 */
function getTransitionType(from: string | null, to: string): TransitionType {
  if (!from) return null;

  const isHome = (path: string) => path === "/";
  const isProject = (path: string) =>
    ["/marketjd", "/portfolio", "/sitemap"].includes(path);

  if (isHome(from) && isProject(to)) return "home-to-project";
  if (isProject(from) && isHome(to)) return "project-to-home";
  if (isProject(from) && isProject(to)) return "project-to-project";

  return null;
}

/**
 * GSAPRouteTransition
 *
 * Wrapper component that detects route changes and provides transition context.
 * Orchestrates exit → enter animation sequences across route boundaries.
 *
 * Handles three transition scenarios:
 * 1. Home → Project: 700ms (exit + enter + stagger)
 * 2. Project → Home: 700ms (exit + enter) + 400ms scroll restoration
 * 3. Project ↔ Project: 500ms (fast cross-fade)
 *
 * Non-destructive: Navigation happens immediately, animations are visual only.
 *
 * @example
 * ```tsx
 * <GSAPRouteTransition>
 *   <Routes>
 *     <Route path="/" element={<Home />} />
 *     <Route path="/project" element={<Project />} />
 *   </Routes>
 * </GSAPRouteTransition>
 * ```
 */
export function GSAPRouteTransition({
  children,
}: {
  children: React.ReactNode;
}) {
  const location = useLocation();
  const previousPathRef = useRef<string | null>(null);

  const [transitionState, setTransitionState] = useState<RouteTransitionState>({
    isTransitioning: false,
    previousPath: null,
    nextPath: location.pathname,
    scrollPosition: 0,
    transitionType: null,
  });

  /**
   * Detect route changes and determine transition type
   */
  useEffect(() => {
    const prevPath = previousPathRef.current;
    const currPath = location.pathname;

    // First visit or initial load
    if (prevPath === null) {
      previousPathRef.current = currPath;
      return;
    }

    // Path hasn't actually changed
    if (prevPath === currPath) {
      return;
    }

    // New route detected
    const scrollPosition = window.scrollY;
    const transitionType = getTransitionType(prevPath, currPath);

    setTransitionState({
      isTransitioning: true,
      previousPath: prevPath,
      nextPath: currPath,
      scrollPosition,
      transitionType,
    });

    // Update ref for next comparison
    previousPathRef.current = currPath;

    // Debug logging (can be removed in production)
    if (transitionType) {
      console.debug(
        `[Route Transition] ${prevPath} → ${currPath} (${transitionType})`
      );
    }
  }, [location.pathname]);

  return (
    <RouteTransitionContext.Provider value={transitionState}>
      {/* Overlay element for visual transition effects */}
      <div
        className="route-transition-overlay"
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          pointerEvents: "none",
          zIndex: 9998,
        }}
      />
      {children}
    </RouteTransitionContext.Provider>
  );
}
