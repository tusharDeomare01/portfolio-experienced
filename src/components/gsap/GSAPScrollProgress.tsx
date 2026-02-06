import { useRef, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsap";

/** Evenly-spaced section markers (6 sections). */
const SECTION_POSITIONS = [17, 33, 50, 67, 83, 100] as const;

/** Percentage the momentum glow trails behind the main bar. */
const TRAIL_LAG = 5;

/**
 * Premium scroll progress indicator fixed at the top of the viewport.
 *
 * Features:
 * - Gradient bar that grows left-to-right with scroll
 * - Glow/bloom effect that intensifies near completion
 * - Completion pulse at 100 % that briefly scales the bar
 * - Dynamic hue shift based on scroll position
 * - Bar thickens as the user nears the bottom
 * - Spark particle at the leading edge with pulsing opacity
 * - Section tick-marks that light up as progress passes them
 * - Momentum glow trail that lags behind the main bar
 *
 * Uses a single ScrollTrigger with onUpdate callback for all layers,
 * keeping GPU-composited scaleX performance (no layout reflow).
 */
export function GSAPScrollProgress() {
  const barRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);
  const sparkRef = useRef<HTMLDivElement>(null);
  const trailRef = useRef<HTMLDivElement>(null);
  const tickRefs = useRef<(HTMLDivElement | null)[]>([]);
  const location = useLocation();
  const scrollTriggerRef = useRef<ScrollTrigger | null>(null);

  // Refresh ScrollTrigger on route changes and after DOM updates
  useEffect(() => {
    // Wait for DOM to fully render
    const refreshScrollTrigger = () => {
      // Force recalculation of document height
      ScrollTrigger.refresh();
    };

    // Initial refresh after DOM is ready
    const timeoutId = setTimeout(refreshScrollTrigger, 300);
    
    // Refresh on route changes
    const routeTimeoutId = setTimeout(refreshScrollTrigger, 150);

    // Refresh when window resizes (document height might change)
    window.addEventListener("resize", refreshScrollTrigger);
    
    // Refresh when images/content finish loading (document height might increase)
    window.addEventListener("load", refreshScrollTrigger);
    
    // Use MutationObserver to detect DOM changes that might affect document height
    let observerTimeoutId: ReturnType<typeof setTimeout> | null = null;
    const observer = new MutationObserver(() => {
      // Debounce refresh to avoid excessive calls
      if (observerTimeoutId) clearTimeout(observerTimeoutId);
      observerTimeoutId = setTimeout(refreshScrollTrigger, 100);
    });
    observer.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: false,
    });
    
    return () => {
      clearTimeout(timeoutId);
      clearTimeout(routeTimeoutId);
      if (observerTimeoutId) clearTimeout(observerTimeoutId);
      window.removeEventListener("resize", refreshScrollTrigger);
      window.removeEventListener("load", refreshScrollTrigger);
      observer.disconnect();
    };
  }, [location.pathname]);

  useGSAP(() => {
    if (!barRef.current) return;

    const bar = barRef.current;
    const glow = glowRef.current;
    const spark = sparkRef.current;
    const trail = trailRef.current;
    const ticks = tickRefs.current;

    // ── Spark pulse animation (loops independently) ────────────────────────
    let sparkPulse: gsap.core.Tween | undefined;
    if (spark) {
      sparkPulse = gsap.to(spark, {
        opacity: 1,
        duration: 0.4,
        ease: "sine.inOut",
        yoyo: true,
        repeat: -1,
      });
      // Start invisible; the onUpdate will position it
      gsap.set(spark, { opacity: 0.6 });
    }

    // Track whether the completion pulse has already fired
    let pulseTriggered = false;

    // Use quickSetter for the hot-path scaleX updates (avoids gsap.set overhead)
    const setBarScaleX = gsap.quickSetter(bar, "scaleX");
    const setGlowScaleX = glow ? gsap.quickSetter(glow, "scaleX") : null;
    const setTrailScaleX = trail ? gsap.quickSetter(trail, "scaleX") : null;

    // Single ScrollTrigger drives every visual layer via onUpdate.
    // Configured to track the ENTIRE document scroll across all sections.
    // This ensures the progress bar works for the full page, not just HeroSection.
    const st = ScrollTrigger.create({
      trigger: document.documentElement, // Track entire document
      start: "top top",
      end: () => `+=${document.documentElement.scrollHeight - window.innerHeight}`, // Explicit full document height
      invalidateOnRefresh: true,
      refreshPriority: -1, // Lower priority to refresh after other ScrollTriggers
      onUpdate: (self) => {
        const p = self.progress;

        // ── Main bar ────────────────────────────────────────────────────
        setBarScaleX(p);

        // Color shift — hue rotates 0-30 degrees
        const hue = Math.round(p * 30);
        bar.style.background = `linear-gradient(90deg, hsl(var(--primary)), hsl(${220 + hue}, 80%, 60%), hsl(${260 + hue}, 70%, 55%))`;

        // Bar height increase near the bottom: 2px -> 3.5px
        const height = 2 + p * 1.5;
        bar.style.height = `${height}px`;

        // At 100 %, trigger a completion pulse
        if (p >= 0.99 && !pulseTriggered) {
          pulseTriggered = true;
          gsap.fromTo(
            bar,
            { scaleY: 1 },
            { scaleY: 2.5, duration: 0.3, ease: "power2.out", yoyo: true, repeat: 1 },
          );
        }
        if (p < 0.98) {
          pulseTriggered = false;
        }

        // ── Glow layer ──────────────────────────────────────────────────
        if (glow && setGlowScaleX) {
          const glowOpacity = gsap.utils.clamp(0, 1, (p - 0.3) / 0.7);
          setGlowScaleX(p);
          glow.style.opacity = String(glowOpacity);
        }

        // ── Spark at leading edge ───────────────────────────────────────
        if (spark) {
          gsap.set(spark, { left: `${p * 100}%` });
        }

        // ── Momentum glow trail (lags by TRAIL_LAG %) ───────────────────
        if (trail && setTrailScaleX) {
          const trailProgress = Math.max(0, p - TRAIL_LAG / 100);
          setTrailScaleX(trailProgress);
          trail.style.opacity = String(gsap.utils.clamp(0, 0.7, p));
        }

        // ── Section tick-marks ──────────────────────────────────────────
        const progressPercent = p * 100;
        for (let i = 0; i < ticks.length; i++) {
          const tick = ticks[i];
          if (!tick) continue;
          const position = SECTION_POSITIONS[i];
          const isPassed = progressPercent >= position;
          // Use direct style instead of gsap.set for CSS variable colors
          // (GSAP's color parser can't resolve var() references)
          tick.style.opacity = isPassed ? "1" : "0.25";
          tick.style.backgroundColor = isPassed
            ? "hsl(var(--primary))"
            : "hsl(var(--primary) / 0.3)";
        }
      },
    });

    // Store reference for route change handling
    scrollTriggerRef.current = st;

    return () => {
      st.kill();
      sparkPulse?.kill();
      scrollTriggerRef.current = null;
    };
  });

  return (
    <>
      {/* Glow layer (behind the bar) */}
      <div
        ref={glowRef}
        className="fixed top-0 left-0 right-0 h-[6px] z-[9998] origin-left pointer-events-none"
        style={{
          background:
            "linear-gradient(90deg, transparent 60%, hsl(var(--primary) / 0.4), #3b82f6aa, #8b5cf6aa)",
          transform: "scaleX(0)",
          willChange: "transform",
          filter: "blur(4px)",
        }}
        aria-hidden="true"
      />

      {/* Momentum glow trail — lags behind the main bar */}
      <div
        ref={trailRef}
        className="fixed top-0 left-0 right-0 h-[4px] z-[9999] origin-left pointer-events-none"
        style={{
          background:
            "linear-gradient(90deg, transparent 40%, hsl(var(--primary) / 0.5), #3b82f680)",
          transform: "scaleX(0)",
          willChange: "transform",
          filter: "blur(8px)",
          opacity: 0,
        }}
        aria-hidden="true"
      />

      {/* Main bar */}
      <div
        ref={barRef}
        className="fixed top-0 left-0 right-0 h-[2px] z-[10000] origin-left pointer-events-none"
        style={{
          background:
            "linear-gradient(90deg, hsl(var(--primary)), #3b82f6, #8b5cf6)",
          transform: "scaleX(0)",
          willChange: "transform",
        }}
        aria-hidden="true"
      />

      {/* Spark particle at the leading edge */}
      <div
        ref={sparkRef}
        className="fixed z-[10001] pointer-events-none"
        style={{
          top: 0,
          left: "0%",
          width: 4,
          height: 4,
          borderRadius: "50%",
          transform: "translate(-50%, -25%)",
          background:
            "radial-gradient(circle, hsl(var(--primary)) 0%, #3b82f6 40%, transparent 70%)",
          boxShadow:
            "0 0 6px 2px hsl(var(--primary) / 0.6), 0 0 12px 4px #3b82f640",
          opacity: 0.6,
          willChange: "left, opacity",
        }}
        aria-hidden="true"
      />

      {/* Section tick-marks */}
      {SECTION_POSITIONS.map((pos, i) => (
        <div
          key={pos}
          ref={(el) => {
            tickRefs.current[i] = el;
          }}
          className="fixed z-[10001] pointer-events-none"
          style={{
            top: 0,
            left: `${pos}%`,
            width: 1,
            height: 4,
            backgroundColor: "hsl(var(--primary) / 0.3)",
            opacity: 0.25,
            transform: "translateX(-50%)",
            transition: "background-color 0.15s ease",
            willChange: "opacity",
          }}
          aria-hidden="true"
        />
      ))}
    </>
  );
}
