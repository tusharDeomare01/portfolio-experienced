import { useRef, useCallback } from "react";
import { gsap, useGSAP } from "@/lib/gsap";

/**
 * GSAP Animations for AI Assistant Components
 * Provides professional, responsive animations with reduced motion support
 */

// ============================================================================
// MAGNETIC BUTTON HOOK - Cursor-following hover effect for floating button
// ============================================================================
export function useGSAPMagneticButton(enabled: boolean = true) {
  const buttonRef = useRef<HTMLButtonElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const sparkleRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (!enabled || !buttonRef.current) return;

    const button = buttonRef.current;
    const glow = glowRef.current;
    const ring = ringRef.current;
    const sparkle = sparkleRef.current;

    const mm = gsap.matchMedia();

    // Desktop: Full magnetic effect + enhanced animations
    mm.add("(min-width: 768px) and (prefers-reduced-motion: no-preference)", () => {
      // Magnetic hover effect using quickTo for smooth 60fps updates
      const xTo = gsap.quickTo(button, "x", { duration: 0.4, ease: "power3.out" });
      const yTo = gsap.quickTo(button, "y", { duration: 0.4, ease: "power3.out" });

      const handleMouseMove = (e: MouseEvent) => {
        const rect = button.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        const deltaX = e.clientX - centerX;
        const deltaY = e.clientY - centerY;
        const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
        const maxDistance = 150;

        if (distance < maxDistance) {
          const strength = 1 - distance / maxDistance;
          xTo(deltaX * 0.3 * strength);
          yTo(deltaY * 0.3 * strength);
        }
      };

      const handleMouseLeave = () => {
        xTo(0);
        yTo(0);
      };

      // Glow pulse animation
      if (glow) {
        gsap.to(glow, {
          scale: 1.3,
          opacity: 0.6,
          duration: 1.5,
          repeat: -1,
          yoyo: true,
          ease: "power1.inOut",
        });
      }

      // Ring expansion animation
      if (ring) {
        gsap.to(ring, {
          scale: 1.4,
          opacity: 0,
          duration: 2,
          repeat: -1,
          ease: "power2.out",
        });
      }

      // Sparkle icon gentle rotation and scale
      if (sparkle) {
        gsap.to(sparkle, {
          rotation: 8,
          scale: 1.1,
          duration: 2,
          repeat: -1,
          yoyo: true,
          ease: "power1.inOut",
        });
      }

      document.addEventListener("mousemove", handleMouseMove);
      button.addEventListener("mouseleave", handleMouseLeave);

      return () => {
        document.removeEventListener("mousemove", handleMouseMove);
        button.removeEventListener("mouseleave", handleMouseLeave);
        gsap.killTweensOf([button, glow, ring, sparkle]);
      };
    });

    // Mobile: Simplified animations without magnetic effect
    mm.add("(max-width: 767px) and (prefers-reduced-motion: no-preference)", () => {
      // Simple glow pulse
      if (glow) {
        gsap.to(glow, {
          scale: 1.2,
          opacity: 0.4,
          duration: 2,
          repeat: -1,
          yoyo: true,
          ease: "power1.inOut",
        });
      }

      // Ring pulse
      if (ring) {
        gsap.to(ring, {
          scale: 1.3,
          opacity: 0,
          duration: 2.5,
          repeat: -1,
          ease: "power2.out",
        });
      }

      return () => {
        gsap.killTweensOf([glow, ring]);
      };
    });

    // Reduced motion: Static or minimal animations
    mm.add("(prefers-reduced-motion: reduce)", () => {
      // Just a subtle opacity pulse for accessibility
      if (glow) {
        gsap.to(glow, {
          opacity: 0.3,
          duration: 3,
          repeat: -1,
          yoyo: true,
          ease: "none",
        });
      }
    });
  }, { dependencies: [enabled] });

  return { buttonRef, glowRef, ringRef, sparkleRef };
}

// ============================================================================
// CHAT WIDGET ENTRANCE ANIMATION
// ============================================================================
export function useGSAPChatEntrance(isOpen: boolean) {
  const containerRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (!containerRef.current || !isOpen) return;

    const container = containerRef.current;
    const card = cardRef.current;
    const header = headerRef.current;
    const content = contentRef.current;
    const input = inputRef.current;

    const mm = gsap.matchMedia();

    mm.add("(prefers-reduced-motion: no-preference)", () => {
      const tl = gsap.timeline({
        defaults: { ease: "power3.out" },
      });

      // Initial state
      gsap.set(container, { opacity: 0, scale: 0.9, y: 30, transformOrigin: "bottom right" });
      if (card) gsap.set(card, { opacity: 0 });
      if (header) gsap.set(header, { opacity: 0, y: -20 });
      if (content) gsap.set(content, { opacity: 0 });
      if (input) gsap.set(input, { opacity: 0, y: 20 });

      // Container entrance with spring-like feel
      tl.to(container, {
        opacity: 1,
        scale: 1,
        y: 0,
        duration: 0.5,
        ease: "back.out(1.4)",
      });

      // Card fade in
      if (card) {
        tl.to(card, {
          opacity: 1,
          duration: 0.3,
        }, "-=0.3");
      }

      // Header slide down
      if (header) {
        tl.to(header, {
          opacity: 1,
          y: 0,
          duration: 0.4,
        }, "-=0.2");
      }

      // Content fade in
      if (content) {
        tl.to(content, {
          opacity: 1,
          duration: 0.4,
        }, "-=0.2");
      }

      // Input slide up with bounce
      if (input) {
        tl.to(input, {
          opacity: 1,
          y: 0,
          duration: 0.4,
          ease: "back.out(1.2)",
        }, "-=0.2");
      }

      return () => {
        tl.kill();
      };
    });

    // Reduced motion: instant appearance
    mm.add("(prefers-reduced-motion: reduce)", () => {
      gsap.set([container, card, header, content, input], { opacity: 1, y: 0, scale: 1 });
    });
  }, { dependencies: [isOpen] });

  // Exit animation function
  const playExitAnimation = useCallback(() => {
    return new Promise<void>((resolve) => {
      if (!containerRef.current) {
        resolve();
        return;
      }

      const container = containerRef.current;
      const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

      if (prefersReducedMotion) {
        gsap.set(container, { opacity: 0 });
        resolve();
        return;
      }

      gsap.to(container, {
        opacity: 0,
        scale: 0.9,
        y: 30,
        duration: 0.3,
        ease: "power2.in",
        onComplete: resolve,
      });
    });
  }, []);

  return { containerRef, cardRef, headerRef, contentRef, inputRef, playExitAnimation };
}

// ============================================================================
// MESSAGE BUBBLE ANIMATION
// ============================================================================
export function useGSAPMessageBubble(messageId: string) {
  const bubbleRef = useRef<HTMLDivElement>(null);
  const avatarRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (!bubbleRef.current) return;

    const bubble = bubbleRef.current;
    const avatar = avatarRef.current;
    const content = contentRef.current;

    const mm = gsap.matchMedia();

    mm.add("(prefers-reduced-motion: no-preference)", () => {
      const tl = gsap.timeline();

      // Initial state
      gsap.set(bubble, { opacity: 0, y: 15, scale: 0.95 });
      if (avatar) gsap.set(avatar, { scale: 0, rotation: -180 });
      if (content) gsap.set(content, { opacity: 0, x: -10 });

      // Bubble entrance
      tl.to(bubble, {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.4,
        ease: "power2.out",
      });

      // Avatar pop in with rotation
      if (avatar) {
        tl.to(avatar, {
          scale: 1,
          rotation: 0,
          duration: 0.5,
          ease: "back.out(2)",
        }, "-=0.3");
      }

      // Content slide in
      if (content) {
        tl.to(content, {
          opacity: 1,
          x: 0,
          duration: 0.3,
        }, "-=0.3");
      }
    });

    // Reduced motion
    mm.add("(prefers-reduced-motion: reduce)", () => {
      gsap.set([bubble, avatar, content], { opacity: 1, y: 0, x: 0, scale: 1, rotation: 0 });
    });
  }, { dependencies: [messageId] });

  return { bubbleRef, avatarRef, contentRef };
}

// ============================================================================
// SUGGESTED QUESTIONS CENTER-OUT WAVE ANIMATION
// ============================================================================
export function useGSAPSuggestedQuestions(isVisible: boolean) {
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (!containerRef.current || !isVisible) return;

    const container = containerRef.current;
    const buttons = container.querySelectorAll("button");

    if (buttons.length === 0) return;

    const mm = gsap.matchMedia();

    mm.add("(prefers-reduced-motion: no-preference)", () => {
      // Calculate center-out stagger
      const centerIndex = Math.floor(buttons.length / 2);

      // Initial state
      gsap.set(buttons, {
        opacity: 0,
        y: 20,
        scale: 0.8,
        filter: "blur(4px)",
      });

      // Animate with center-out wave
      buttons.forEach((button, index) => {
        const distanceFromCenter = Math.abs(index - centerIndex);
        const delay = distanceFromCenter * 0.1;

        gsap.to(button, {
          opacity: 1,
          y: 0,
          scale: 1,
          filter: "blur(0px)",
          duration: 0.5,
          delay: delay + 0.2, // Base delay for container to be visible
          ease: "back.out(1.5)",
        });
      });

      // Subtle hover effect for buttons
      buttons.forEach((button) => {
        const handleMouseEnter = () => {
          gsap.to(button, {
            scale: 1.05,
            y: -2,
            duration: 0.2,
            ease: "power2.out",
          });
        };

        const handleMouseLeave = () => {
          gsap.to(button, {
            scale: 1,
            y: 0,
            duration: 0.3,
            ease: "power2.out",
          });
        };

        button.addEventListener("mouseenter", handleMouseEnter);
        button.addEventListener("mouseleave", handleMouseLeave);
      });
    });

    // Reduced motion
    mm.add("(prefers-reduced-motion: reduce)", () => {
      gsap.set(buttons, { opacity: 1, y: 0, scale: 1, filter: "blur(0px)" });
    });
  }, { dependencies: [isVisible] });

  return containerRef;
}

// ============================================================================
// STREAMING TEXT CURSOR ANIMATION
// ============================================================================
export function useGSAPStreamingCursor() {
  const cursorRef = useRef<HTMLSpanElement>(null);

  useGSAP(() => {
    if (!cursorRef.current) return;

    const cursor = cursorRef.current;

    const mm = gsap.matchMedia();

    mm.add("(prefers-reduced-motion: no-preference)", () => {
      // Smooth blink animation
      gsap.to(cursor, {
        opacity: 0,
        duration: 0.5,
        repeat: -1,
        yoyo: true,
        ease: "power1.inOut",
      });

      return () => {
        gsap.killTweensOf(cursor);
      };
    });

    mm.add("(prefers-reduced-motion: reduce)", () => {
      // Simple opacity toggle for reduced motion
      gsap.to(cursor, {
        opacity: 0.5,
        duration: 1,
        repeat: -1,
        yoyo: true,
        ease: "none",
      });
    });
  }, []);

  return cursorRef;
}

// ============================================================================
// TOOLTIP ANIMATION
// ============================================================================
export function useGSAPTooltip(isVisible: boolean) {
  const tooltipRef = useRef<HTMLDivElement>(null);
  const arrowRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (!tooltipRef.current) return;

    const tooltip = tooltipRef.current;
    const arrow = arrowRef.current;

    const mm = gsap.matchMedia();

    if (isVisible) {
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const tl = gsap.timeline();

        // Initial state
        gsap.set(tooltip, { opacity: 0, scale: 0.8, y: 15, transformOrigin: "bottom center" });
        if (arrow) gsap.set(arrow, { y: 0 });

        // Tooltip entrance with spring
        tl.to(tooltip, {
          opacity: 1,
          scale: 1,
          y: 0,
          duration: 0.5,
          ease: "back.out(2)",
        });

        // Subtle pulse glow effect
        tl.to(tooltip, {
          boxShadow: "0 0 20px rgba(var(--primary-rgb, 59, 130, 246), 0.3)",
          duration: 1,
          repeat: -1,
          yoyo: true,
          ease: "power1.inOut",
        }, "+=0.2");

        // Arrow bounce
        if (arrow) {
          tl.to(arrow, {
            y: -4,
            duration: 0.8,
            repeat: -1,
            yoyo: true,
            ease: "power1.inOut",
          }, 0.5);
        }
      });

      mm.add("(prefers-reduced-motion: reduce)", () => {
        gsap.set(tooltip, { opacity: 1, scale: 1, y: 0 });
      });
    }
  }, { dependencies: [isVisible] });

  return { tooltipRef, arrowRef };
}

// ============================================================================
// LOADING DOTS ANIMATION
// ============================================================================
export function useGSAPLoadingDots() {
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (!containerRef.current) return;

    const dots = containerRef.current.querySelectorAll(".loading-dot");

    if (dots.length === 0) return;

    const mm = gsap.matchMedia();

    mm.add("(prefers-reduced-motion: no-preference)", () => {
      // Staggered bounce animation
      gsap.to(dots, {
        y: -8,
        duration: 0.4,
        stagger: {
          each: 0.1,
          repeat: -1,
          yoyo: true,
        },
        ease: "power2.out",
      });

      return () => {
        gsap.killTweensOf(dots);
      };
    });

    mm.add("(prefers-reduced-motion: reduce)", () => {
      // Simple opacity pulse
      gsap.to(dots, {
        opacity: 0.5,
        duration: 0.8,
        repeat: -1,
        yoyo: true,
        ease: "none",
      });
    });
  }, []);

  return containerRef;
}

// ============================================================================
// BUTTON ENTRANCE ANIMATION (for floating button initial appearance)
// ============================================================================
export function useGSAPButtonEntrance(enabled: boolean = true) {
  const wrapperRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (!enabled || !wrapperRef.current) return;

    const wrapper = wrapperRef.current;

    const mm = gsap.matchMedia();

    mm.add("(prefers-reduced-motion: no-preference)", () => {
      // Initial state
      gsap.set(wrapper, { scale: 0, opacity: 0, rotation: -180 });

      // Entrance animation
      gsap.to(wrapper, {
        scale: 1,
        opacity: 1,
        rotation: 0,
        duration: 0.8,
        delay: 0.5, // Wait for page to settle
        ease: "elastic.out(1, 0.5)",
      });
    });

    mm.add("(prefers-reduced-motion: reduce)", () => {
      gsap.set(wrapper, { scale: 1, opacity: 1, rotation: 0 });
    });
  }, { dependencies: [enabled] });

  return wrapperRef;
}

// ============================================================================
// EMPTY STATE ANIMATION
// ============================================================================
export function useGSAPEmptyState(isVisible: boolean) {
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (!containerRef.current || !isVisible) return;

    const container = containerRef.current;
    const icon = container.querySelector(".empty-state-icon");
    const title = container.querySelector(".empty-state-title");
    const subtitle = container.querySelector(".empty-state-subtitle");

    const mm = gsap.matchMedia();

    mm.add("(prefers-reduced-motion: no-preference)", () => {
      const tl = gsap.timeline({ delay: 0.3 });

      // Initial states
      if (icon) gsap.set(icon, { scale: 0, rotation: -45 });
      if (title) gsap.set(title, { opacity: 0, y: 15 });
      if (subtitle) gsap.set(subtitle, { opacity: 0, y: 10 });

      // Icon pop in
      if (icon) {
        tl.to(icon, {
          scale: 1,
          rotation: 0,
          duration: 0.6,
          ease: "back.out(2)",
        });
      }

      // Title fade in
      if (title) {
        tl.to(title, {
          opacity: 1,
          y: 0,
          duration: 0.4,
        }, "-=0.3");
      }

      // Subtitle fade in
      if (subtitle) {
        tl.to(subtitle, {
          opacity: 1,
          y: 0,
          duration: 0.4,
        }, "-=0.2");
      }
    });

    mm.add("(prefers-reduced-motion: reduce)", () => {
      gsap.set([icon, title, subtitle], { opacity: 1, y: 0, scale: 1, rotation: 0 });
    });
  }, { dependencies: [isVisible] });

  return containerRef;
}

// ============================================================================
// SESSION LIST ITEM ANIMATION
// ============================================================================
export function useGSAPSessionList(isVisible: boolean) {
  const listRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (!listRef.current || !isVisible) return;

    const items = listRef.current.querySelectorAll(".session-item");

    if (items.length === 0) return;

    const mm = gsap.matchMedia();

    mm.add("(prefers-reduced-motion: no-preference)", () => {
      // Initial state
      gsap.set(items, { opacity: 0, x: -20 });

      // Staggered entrance
      gsap.to(items, {
        opacity: 1,
        x: 0,
        duration: 0.4,
        stagger: 0.08,
        ease: "power2.out",
      });
    });

    mm.add("(prefers-reduced-motion: reduce)", () => {
      gsap.set(items, { opacity: 1, x: 0 });
    });
  }, { dependencies: [isVisible] });

  return listRef;
}
