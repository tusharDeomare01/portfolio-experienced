import { useRef, useState } from "react";
import { gsap, SplitText, useGSAP } from "@/lib/gsap";

/**
 * Cinematic page load intro overlay.
 *
 * Inspired by:
 * - Dylan Brouwer: Scramble text resolve with SplitText char animation
 * - Decor24: Preloader counter + overlay wipe reveal
 * - Magnify Partners: Page wipe transition with scaleX
 *
 * Phases:
 * 0. Progress counter 0→100 (preloader feel)
 * 1. Scramble → Resolve name (each character resolves from random noise)
 * 2. SplitText char-level scatter (the "fuzzy" effect the user loved)
 * 3. Subtitle "Software Engineer" fades in then out
 * 4. Cinematic letterbox wipe (dual inset from top & bottom) to reveal the hero
 * 5. Hero elements stagger entrance with elastic ease + blur clearing
 *
 * Plays once per session (sessionStorage).
 */
export function GSAPPageIntro() {
  const overlayRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const subtitleRef = useRef<HTMLDivElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);
  const lineBottomRef = useRef<HTMLDivElement>(null);
  const counterRef = useRef<HTMLDivElement>(null);
  const progressBarRef = useRef<HTMLDivElement>(null);
  const [shouldRender, setShouldRender] = useState(true);

  useGSAP(
    () => {
      if (!shouldRender || !overlayRef.current || !textRef.current) return;

      document.body.style.overflow = "hidden";

      const tl = gsap.timeline({
        onComplete: () => {
          document.body.style.overflow = "";
          setShouldRender(false);
        },
      });

      const finalText = "Tushar Deomare";
      const chars =
        "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%&";
      const textEl = textRef.current;

      // ── Phase 0: Professional counter 0 → 100 (top right) ──
      if (counterRef.current) {
        const counterEl = counterRef.current;
        const counterProxy = { value: 0 };
        const counterNumber = counterEl.querySelector("span:first-child");

        tl.fromTo(
          counterEl,
          { opacity: 0, y: -10 },
          { opacity: 1, y: 0, duration: 0.2, ease: "power2.out" },
          0
        ).to(
          counterProxy,
          {
            value: 100,
            duration: 1.2,
            ease: "power2.inOut",
            snap: { value: 1 },
            onUpdate: () => {
              if (counterNumber) {
                counterNumber.textContent = `${Math.round(counterProxy.value)}`;
              }
              // Sync progress bar
              if (progressBarRef.current) {
                gsap.set(progressBarRef.current, {
                  scaleX: counterProxy.value / 100,
                });
              }
            },
          },
          0
        ).to(
          counterEl,
          { opacity: 0, y: -5, duration: 0.25, ease: "power2.in" },
          1.15
        );
      }

      // ── Bottom progress bar animation ──
      if (progressBarRef.current) {
        tl.set(progressBarRef.current, { scaleX: 0 }, 0);
        tl.to(
          progressBarRef.current,
          { opacity: 0, duration: 0.2, ease: "power2.in" },
          1.15
        );
      }

      // ── Decorative lines grow (top + bottom, symmetric) ──
      // Enhanced with gradient and better timing
      if (lineRef.current) {
        tl.fromTo(
          lineRef.current,
          { scaleX: 0, opacity: 0 },
          { scaleX: 1, opacity: 1, duration: 0.8, ease: "power2.inOut" },
          0.4
        );
      }
      if (lineBottomRef.current) {
        tl.fromTo(
          lineBottomRef.current,
          { scaleX: 0, opacity: 0 },
          { scaleX: 1, opacity: 1, duration: 0.8, ease: "power2.inOut" },
          0.4
        );
      }

      // ── Phase 1: Scramble → Resolve ──
      const scrambleProxy = { value: 0 };

      // Initialize with random scrambled characters
      const initialScrambled = finalText
        .split("")
        .map((char) => {
          if (char === " ") return " ";
          return chars[Math.floor(Math.random() * chars.length)];
        })
        .join("");

      // Set initial scrambled text and make visible
      tl.set(textEl, { 
        opacity: 1, 
        textContent: initialScrambled 
      }, 1.0)
        .to(scrambleProxy, {
          value: 1,
          duration: 1.2,
          ease: "power2.in",
          onUpdate: () => {
            const progress = scrambleProxy.value;
            const revealed = Math.floor(progress * finalText.length);
            let display = "";
            for (let i = 0; i < finalText.length; i++) {
              if (finalText[i] === " ") {
                display += " ";
              } else if (i < revealed) {
                display += finalText[i];
              } else {
                display += chars[Math.floor(Math.random() * chars.length)];
              }
            }
            textEl.textContent = display;
          },
          onComplete: () => {
            // Ensure final text is set before SplitText
            textEl.textContent = finalText;
          },
        }, 1.1);

      // ── Phase 2: SplitText char scatter (the "fuzzy" detail) ──
      const phase2 = gsap.timeline({ paused: true });

      tl.add(() => {
        // Ensure text is set to finalText before splitting
        textEl.textContent = finalText;
        
        const split = new SplitText(textEl, {
          type: "chars",
          charsClass: "intro-char",
        });

        split.chars.forEach((char: Element) => {
          if (char instanceof HTMLElement) {
            char.style.display = "inline-block";
          }
        });

        // Breathing pulse from center
        phase2.to(split.chars, {
          scale: 1.04,
          duration: 0.35,
          stagger: { each: 0.012, from: "center" },
          ease: "power1.inOut",
          yoyo: true,
          repeat: 1,
        });

        // Scatter outward with random directions
        phase2.to(split.chars, {
          opacity: 0,
          y: () => gsap.utils.random(-50, 50),
          x: () => gsap.utils.random(-30, 30),
          rotateZ: () => gsap.utils.random(-20, 20),
          scale: 0.5,
          duration: 0.6,
          stagger: { each: 0.018, from: "edges" },
          ease: "power2.in",
          onComplete: () => {
            // Revert SplitText and immediately hide the text element
            // This prevents the stale static name from appearing
            split.revert();
            // Hide text element completely - no stale name visible
            gsap.set(textEl, { 
              opacity: 0,
              visibility: "hidden",
            });
          },
        });

        phase2.play();
      }, "+=0.2");

      // Reserve timeline space for phase2
      tl.to({}, { duration: 1.6 });

      // ── Phase 3: Subtitle fade ──
      if (subtitleRef.current) {
        tl.fromTo(
          subtitleRef.current,
          { opacity: 0, y: 12, letterSpacing: "0.3em" },
          {
            opacity: 1,
            y: 0,
            letterSpacing: "0.2em",
            duration: 0.5,
            ease: "smooth.out",
          },
          "-=1.0"
        ).to(
          subtitleRef.current,
          { opacity: 0, y: -8, duration: 0.3, ease: "power2.in" },
          "-=0.3"
        );
      }

      // ── Decorative lines shrink (both top + bottom) ──
      if (lineRef.current) {
        tl.to(lineRef.current, {
          scaleX: 0,
          opacity: 0,
          duration: 0.5,
          ease: "power2.inOut",
        }, "-=0.3");
      }
      if (lineBottomRef.current) {
        tl.to(lineBottomRef.current, {
          scaleX: 0,
          opacity: 0,
          duration: 0.5,
          ease: "power2.inOut",
        }, "-=0.5");
      }

      // ── Phase 4: Enhanced overlay wipe — cinematic letterbox (dual inset) ──
      // Dispatch event so the hero section starts its own GSAP entrance
      // during the wipe, creating a seamless layered reveal.
      tl.to(
        overlayRef.current,
        {
          clipPath: "inset(50% 0 50% 0)",
          duration: 0.9,
          ease: "power3.inOut",
          onStart: () => {
            window.dispatchEvent(new CustomEvent("gsap-intro-complete"));
          },
        },
        "-=0.1"
      );
    },
    { dependencies: [shouldRender] }
  );

  if (!shouldRender) return null;

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-[99999] flex flex-col items-center justify-center bg-background"
      style={{ clipPath: "inset(0 0 0 0)", willChange: "clip-path", contain: "layout style paint" }}
    >
      {/* Professional counter — top right corner */}
      <div
        ref={counterRef}
        className="absolute top-8 right-8 sm:top-12 sm:right-12 text-sm sm:text-base text-muted-foreground/60 font-mono select-none opacity-0"
        style={{ 
          willChange: "opacity, transform",
          letterSpacing: "0.1em",
        }}
        aria-hidden="true"
      >
        <span className="text-muted-foreground/40">0</span>
        <span className="mx-1 text-muted-foreground/30">/</span>
        <span className="text-muted-foreground/40">100</span>
      </div>

      {/* Corner bracket — top left */}
      <div 
        className="absolute top-8 left-8 sm:top-12 sm:left-12 w-12 h-12 sm:w-16 sm:h-16 border-t-2 border-l-2 border-primary/20"
        aria-hidden="true"
      />
      
      {/* Corner bracket — bottom right */}
      <div 
        className="absolute bottom-8 right-8 sm:bottom-12 sm:right-12 w-12 h-12 sm:w-16 sm:h-16 border-b-2 border-r-2 border-primary/20"
        aria-hidden="true"
      />

      {/* Main content container — centered with better spacing */}
      <div className="flex flex-col items-center justify-center relative">
        {/* Decorative line — top */}
        <div
          ref={lineRef}
          className="absolute w-32 sm:w-40 md:w-48 h-[1px] bg-gradient-to-r from-transparent via-primary/50 to-transparent"
          style={{ 
            top: "-4rem", 
            left: "50%", 
            transform: "translateX(-50%) scaleX(0)", 
            transformOrigin: "center",
            willChange: "transform"
          }}
          aria-hidden="true"
        />

        {/* Main name text — larger, more dramatic */}
        <div
          ref={textRef}
          className="text-5xl sm:text-6xl md:text-8xl lg:text-9xl font-extrabold text-foreground tracking-tighter opacity-0 select-none text-center leading-none"
          style={{ 
            letterSpacing: "-0.03em",
            willChange: "opacity, transform",
            fontFeatureSettings: '"liga" 1, "kern" 1',
          }}
          aria-hidden="true"
        />

        {/* Subtitle — better spacing and typography */}
        <div
          ref={subtitleRef}
          className="mt-6 sm:mt-8 text-xs sm:text-sm md:text-base text-muted-foreground/80 tracking-[0.3em] uppercase opacity-0 select-none text-center font-light"
          style={{ 
            willChange: "opacity, transform",
            letterSpacing: "0.25em",
          }}
          aria-hidden="true"
        >
          Software Engineer
        </div>

        {/* Decorative line — bottom */}
        <div
          ref={lineBottomRef}
          className="absolute w-32 sm:w-40 md:w-48 h-[1px] bg-gradient-to-r from-transparent via-primary/50 to-transparent"
          style={{ 
            bottom: "-4rem", 
            left: "50%", 
            transform: "translateX(-50%) scaleX(0)", 
            transformOrigin: "center",
            willChange: "transform"
          }}
          aria-hidden="true"
        />
      </div>

      {/* Bottom progress indicator — minimal, professional */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 w-32 h-[1px] bg-muted-foreground/10 overflow-hidden">
        <div 
          ref={progressBarRef}
          className="h-full bg-primary/30 origin-left"
          style={{ transform: "scaleX(0)", willChange: "transform" }}
          aria-hidden="true"
        />
      </div>
    </div>
  );
}
