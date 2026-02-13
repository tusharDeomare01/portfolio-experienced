import { useRef, useState, useCallback, memo } from "react";
import { gsap, SplitText, useGSAP } from "@/lib/gsap";
import { Button } from "../lightswind/button";
import { FileText, Sparkles, Mail } from "lucide-react";

const RESUME_FILE_PATH = "/Tushar_Deomare.pdf";

const HeroSectionComponent = () => {
  const [hasHoveredEmail, setHasHoveredEmail] = useState(false);
  const [isEmailHovered, setIsEmailHovered] = useState(false);

  // Scene refs
  const heroRef = useRef<HTMLDivElement>(null);
  const leftRef = useRef<HTMLDivElement>(null);

  // Element refs
  const nameRef = useRef<HTMLSpanElement>(null);
  const pronounRef = useRef<HTMLParagraphElement>(null);
  const subtitleRef = useRef<HTMLDivElement>(null);
  const emailRef = useRef<HTMLDivElement>(null);
  const buttonsRef = useRef<HTMLDivElement>(null);
  const buttonWrapperRef = useRef<HTMLDivElement>(null);
  const imageWrapperRef = useRef<HTMLDivElement>(null);
  const sparkleRef = useRef<HTMLSpanElement>(null);

  // Decorative refs
  const accentLineRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);

  // ─── Shared play-after-intro logic ───
  // Reusable helper: plays timeline after GSAPPageIntro completes
  const setupPlayTrigger = (
    tl: gsap.core.Timeline,
    cleanups: (() => void)[]
  ) => {
    let hasPlayed = false;
    const play = () => {
      if (hasPlayed) return;
      hasPlayed = true;
      tl.play();
    };

    if (
      typeof window !== "undefined" &&
      sessionStorage.getItem("gsap-hero-revealed") === "true"
    ) {
      requestAnimationFrame(() => play());
    } else {
      window.addEventListener("gsap-intro-complete", play);
      const fallback = setTimeout(play, 500);
      cleanups.push(() => {
        window.removeEventListener("gsap-intro-complete", play);
        clearTimeout(fallback);
      });
    }

    tl.eventCallback("onComplete", () => {
      if (typeof window !== "undefined") {
        sessionStorage.setItem("gsap-hero-revealed", "true");
      }
    });
  };

  useGSAP(
    () => {
      if (!heroRef.current) return;

      const mm = gsap.matchMedia();

      // ═══════════════════════════════════════════════════════════════════
      // DESKTOP (≥1024px): Full cinematic entrance with SplitText
      // ═══════════════════════════════════════════════════════════════════
      mm.add(
        "(min-width: 1024px) and (prefers-reduced-motion: no-preference)",
        () => {
          const cleanups: (() => void)[] = [];

          const tl = gsap.timeline({
            paused: true,
            defaults: { ease: "power3.out" },
          });

          // ─── PHASE 1: Image — Opacity + y with soft scale ───
          if (imageWrapperRef.current) {
            gsap.set(imageWrapperRef.current, {
              opacity: 0,
              y: 60,
              scale: 0.9,
            });
            tl.to(
              imageWrapperRef.current,
              {
                opacity: 1,
                y: 0,
                scale: 1,
                duration: 1.1,
                ease: "power3.out",
                clearProps: "transform",
              },
              0
            );
          }

          // ─── PHASE 2: Name — SplitText chars with 3D wave ───
          let nameSplit: SplitText | null = null;
          if (nameRef.current && nameRef.current.textContent?.trim()) {
            nameSplit = new SplitText(nameRef.current, {
              type: "chars",
              mask: "chars",
            });
            gsap.set(nameSplit.chars, {
              opacity: 0,
              y: 120,
              rotateX: -90,
              rotateY: gsap.utils.wrap([-20, 20, -15, 15, -10, 10]),
              scale: 0.5,
              transformPerspective: 1200,
              transformOrigin: "center bottom",
            });
            tl.to(
              nameSplit.chars,
              {
                opacity: 1,
                y: 0,
                rotateX: 0,
                rotateY: 0,
                scale: 1,
                duration: 1,
                stagger: { each: 0.04, from: "center", ease: "power2.out" },
                ease: "back.out(1.7)",
              },
              0.15
            );
            cleanups.push(() => nameSplit!.revert());
          } else if (nameRef.current) {
            gsap.set(nameRef.current, { opacity: 0, y: 50 });
            tl.to(nameRef.current, { opacity: 1, y: 0, duration: 0.8 }, 0.15);
          }

          // ─── PHASE 3: Pronoun — Slide from left with blur clearing ───
          if (pronounRef.current) {
            gsap.set(pronounRef.current, {
              opacity: 0,
              x: -40,
              filter: "blur(4px)",
            });
            tl.to(
              pronounRef.current,
              {
                opacity: 1,
                x: 0,
                filter: "blur(0px)",
                duration: 0.6,
                ease: "power3.out",
                clearProps: "filter",
              },
              0.5
            );
          }

          // ─── PHASE 4: Accent line — Draws from left ───
          if (accentLineRef.current) {
            gsap.set(accentLineRef.current, {
              scaleX: 0,
              opacity: 0,
              transformOrigin: "left center",
            });
            tl.to(
              accentLineRef.current,
              { scaleX: 1, opacity: 1, duration: 0.7, ease: "power2.inOut" },
              0.6
            );
          }

          // ─── PHASE 5: Sparkle icon — Elastic spin-in ───
          if (sparkleRef.current) {
            gsap.set(sparkleRef.current, {
              opacity: 0,
              scale: 0,
              rotation: -180,
            });
            tl.to(
              sparkleRef.current,
              {
                opacity: 1,
                scale: 1,
                rotation: 0,
                duration: 0.8,
                ease: "elastic.out(1, 0.4)",
              },
              0.7
            );
          }

          // ─── PHASE 6: Subtitle — Blur-to-focus with y shift ───
          if (subtitleRef.current) {
            gsap.set(subtitleRef.current, {
              opacity: 0,
              y: 25,
              filter: "blur(3px)",
            });
            tl.to(
              subtitleRef.current,
              {
                opacity: 1,
                y: 0,
                filter: "blur(0px)",
                duration: 0.6,
                ease: "power2.out",
                clearProps: "filter",
              },
              0.85
            );
          }

          // ─── PHASE 7: Email — Slide from left with blur ───
          if (emailRef.current) {
            gsap.set(emailRef.current, {
              opacity: 0,
              x: -30,
              filter: "blur(3px)",
            });
            tl.to(
              emailRef.current,
              {
                opacity: 1,
                x: 0,
                filter: "blur(0px)",
                duration: 0.6,
                ease: "power3.out",
                clearProps: "filter",
              },
              0.95
            );
          }

          // ─── PHASE 8: CTA button — Elastic cascade ───
          if (buttonsRef.current) {
            gsap.set(buttonsRef.current, {
              opacity: 0,
              scale: 0,
              y: 30,
              rotation: -15,
            });
            tl.to(
              buttonsRef.current,
              {
                opacity: 1,
                scale: 1,
                y: 0,
                rotation: 0,
                duration: 0.8,
                ease: "elastic.out(1, 0.4)",
                clearProps: "transform",
              },
              1.05
            );
          }

          // ─── Idle: Image float + sparkle slow spin ───
          let floatTween: gsap.core.Tween | null = null;
          let sparkleTween: gsap.core.Tween | null = null;

          if (imageWrapperRef.current) {
            floatTween = gsap.to(imageWrapperRef.current, {
              y: -10,
              duration: 3,
              repeat: -1,
              yoyo: true,
              ease: "sine.inOut",
              paused: true,
            });
            cleanups.push(() => floatTween?.kill());
          }

          if (sparkleRef.current) {
            sparkleTween = gsap.to(sparkleRef.current, {
              rotation: "+=360",
              duration: 8,
              repeat: -1,
              ease: "none",
              paused: true,
            });
            cleanups.push(() => sparkleTween?.kill());
          }

          tl.call(() => {
            floatTween?.play();
            sparkleTween?.play();
          });

          // ─── Play after intro overlay ───
          setupPlayTrigger(tl, cleanups);

          // ─── CTA button: Magnetic hover ───
          if (buttonWrapperRef.current) {
            const btn = buttonWrapperRef.current;
            const xTo = gsap.quickTo(btn, "x", {
              duration: 0.4,
              ease: "power3",
            });
            const yTo = gsap.quickTo(btn, "y", {
              duration: 0.4,
              ease: "power3",
            });

            const handleBtnMove = (e: MouseEvent) => {
              const rect = btn.getBoundingClientRect();
              xTo((e.clientX - (rect.left + rect.width / 2)) * 0.35);
              yTo((e.clientY - (rect.top + rect.height / 2)) * 0.35);
            };

            const handleBtnEnter = () => {
              gsap.to(btn, {
                scale: 1.08,
                duration: 0.3,
                ease: "power2.out",
              });
            };

            const handleBtnLeave = () => {
              gsap.to(btn, {
                x: 0,
                y: 0,
                scale: 1,
                duration: 1,
                ease: "elastic.out(1.1, 0.4)",
              });
            };

            btn.addEventListener("mousemove", handleBtnMove);
            btn.addEventListener("mouseenter", handleBtnEnter);
            btn.addEventListener("mouseleave", handleBtnLeave);
            cleanups.push(() => {
              btn.removeEventListener("mousemove", handleBtnMove);
              btn.removeEventListener("mouseenter", handleBtnEnter);
              btn.removeEventListener("mouseleave", handleBtnLeave);
              gsap.killTweensOf(btn, "x,y,scale");
              gsap.set(btn, { clearProps: "x,y,scale" });
            });
          }

          // ═══════════════════════════════════════════════════════════
          // SCROLL EXIT: Parallax with subtle 3D perspective
          // ═══════════════════════════════════════════════════════════
          const hero = heroRef.current!;

          // Left text — parallax up + subtle fade at end
          if (leftRef.current) {
            gsap.to(leftRef.current, {
              yPercent: -18,
              ease: "none",
              scrollTrigger: {
                trigger: hero,
                start: "top top",
                end: "bottom top",
                scrub: 1,
              },
            });
          }

          // Right image — slower parallax with slight scale
          const rightSection = hero.querySelector(".hero-right-section");
          if (rightSection) {
            gsap.to(rightSection, {
              yPercent: -10,
              scale: 0.96,
              ease: "none",
              scrollTrigger: {
                trigger: hero,
                start: "top top",
                end: "bottom top",
                scrub: 1.5,
              },
            });
          }

          return () => cleanups.forEach((fn) => fn());
        }
      );

      // ═══════════════════════════════════════════════════════════════════
      // TABLET (768-1023px): Refined entrance — no SplitText, clipPath
      // ═══════════════════════════════════════════════════════════════════
      mm.add(
        "(min-width: 768px) and (max-width: 1023px) and (prefers-reduced-motion: no-preference)",
        () => {
          const cleanups: (() => void)[] = [];

          const tl = gsap.timeline({
            paused: true,
            defaults: { ease: "smooth.out" },
          });

          // ─── Image: Opacity + y + soft scale ───
          if (imageWrapperRef.current) {
            gsap.set(imageWrapperRef.current, {
              opacity: 0,
              y: 40,
              scale: 0.92,
            });
            tl.to(
              imageWrapperRef.current,
              {
                opacity: 1,
                y: 0,
                scale: 1,
                duration: 0.8,
                ease: "power3.out",
                clearProps: "transform",
              },
              0
            );
          }

          // ─── Name: clipPath reveal from bottom ───
          if (nameRef.current) {
            gsap.set(nameRef.current, {
              clipPath: "inset(100% 0 0 0)",
              opacity: 1,
            });
            tl.to(
              nameRef.current,
              {
                clipPath: "inset(0% 0 0 0)",
                duration: 0.7,
                ease: "reveal",
                clearProps: "clipPath",
              },
              0.1
            );
          }

          // ─── Pronoun: Slide from left ───
          if (pronounRef.current) {
            gsap.set(pronounRef.current, {
              opacity: 0,
              x: -30,
              filter: "blur(3px)",
            });
            tl.to(
              pronounRef.current,
              {
                opacity: 1,
                x: 0,
                filter: "blur(0px)",
                duration: 0.5,
                clearProps: "filter",
              },
              0.35
            );
          }

          // ─── Accent line: scaleX draw from left ───
          if (accentLineRef.current) {
            gsap.set(accentLineRef.current, {
              scaleX: 0,
              opacity: 0,
              transformOrigin: "left center",
            });
            tl.to(
              accentLineRef.current,
              { scaleX: 1, opacity: 1, duration: 0.6, ease: "power2.inOut" },
              0.45
            );
          }

          // ─── Sparkle: Spin-in with spring ───
          if (sparkleRef.current) {
            gsap.set(sparkleRef.current, {
              opacity: 0,
              scale: 0,
              rotation: -120,
            });
            tl.to(
              sparkleRef.current,
              {
                opacity: 1,
                scale: 1,
                rotation: 0,
                duration: 0.6,
                ease: "elastic.out(1, 0.5)",
              },
              0.55
            );
          }

          // ─── Subtitle: Blur-to-focus ───
          if (subtitleRef.current) {
            gsap.set(subtitleRef.current, {
              opacity: 0,
              y: 20,
              filter: "blur(3px)",
            });
            tl.to(
              subtitleRef.current,
              {
                opacity: 1,
                y: 0,
                filter: "blur(0px)",
                duration: 0.5,
                clearProps: "filter",
              },
              0.65
            );
          }

          // ─── Email: Slide from left ───
          if (emailRef.current) {
            gsap.set(emailRef.current, {
              opacity: 0,
              x: -25,
              filter: "blur(2px)",
            });
            tl.to(
              emailRef.current,
              {
                opacity: 1,
                x: 0,
                filter: "blur(0px)",
                duration: 0.5,
                clearProps: "filter",
              },
              0.75
            );
          }

          // ─── CTA button: Scale bounce ───
          if (buttonsRef.current) {
            gsap.set(buttonsRef.current, {
              opacity: 0,
              scale: 0.85,
              y: 20,
            });
            tl.to(
              buttonsRef.current,
              {
                opacity: 1,
                scale: 1,
                y: 0,
                duration: 0.6,
                ease: "back.out(1.7)",
                clearProps: "transform",
              },
              0.85
            );
          }

          // ─── Idle: Image float + sparkle spin ───
          let floatTween: gsap.core.Tween | null = null;
          let sparkleTween: gsap.core.Tween | null = null;

          if (imageWrapperRef.current) {
            floatTween = gsap.to(imageWrapperRef.current, {
              y: -8,
              duration: 3,
              repeat: -1,
              yoyo: true,
              ease: "sine.inOut",
              paused: true,
            });
            cleanups.push(() => floatTween?.kill());
          }

          if (sparkleRef.current) {
            sparkleTween = gsap.to(sparkleRef.current, {
              rotation: "+=360",
              duration: 10,
              repeat: -1,
              ease: "none",
              paused: true,
            });
            cleanups.push(() => sparkleTween?.kill());
          }

          tl.call(() => {
            floatTween?.play();
            sparkleTween?.play();
          });

          // ─── Play after intro overlay ───
          setupPlayTrigger(tl, cleanups);

          // ─── CTA button: Magnetic hover (lighter intensity for tablet) ───
          if (buttonWrapperRef.current) {
            const btn = buttonWrapperRef.current;
            const xTo = gsap.quickTo(btn, "x", {
              duration: 0.4,
              ease: "power3",
            });
            const yTo = gsap.quickTo(btn, "y", {
              duration: 0.4,
              ease: "power3",
            });

            const handleBtnMove = (e: MouseEvent) => {
              const rect = btn.getBoundingClientRect();
              xTo((e.clientX - (rect.left + rect.width / 2)) * 0.25);
              yTo((e.clientY - (rect.top + rect.height / 2)) * 0.25);
            };

            const handleBtnEnter = () => {
              gsap.to(btn, {
                scale: 1.05,
                duration: 0.3,
                ease: "power2.out",
              });
            };

            const handleBtnLeave = () => {
              gsap.to(btn, {
                x: 0,
                y: 0,
                scale: 1,
                duration: 0.8,
                ease: "elastic.out(1.1, 0.4)",
              });
            };

            btn.addEventListener("mousemove", handleBtnMove);
            btn.addEventListener("mouseenter", handleBtnEnter);
            btn.addEventListener("mouseleave", handleBtnLeave);
            cleanups.push(() => {
              btn.removeEventListener("mousemove", handleBtnMove);
              btn.removeEventListener("mouseenter", handleBtnEnter);
              btn.removeEventListener("mouseleave", handleBtnLeave);
              gsap.killTweensOf(btn, "x,y,scale");
              gsap.set(btn, { clearProps: "x,y,scale" });
            });
          }

          // ─── Scroll exit: Parallax ───
          const hero = heroRef.current!;

          if (leftRef.current) {
            gsap.to(leftRef.current, {
              yPercent: -12,
              ease: "none",
              scrollTrigger: {
                trigger: hero,
                start: "top top",
                end: "bottom top",
                scrub: 1,
              },
            });
          }

          const rightSection = hero.querySelector(".hero-right-section");
          if (rightSection) {
            gsap.to(rightSection, {
              yPercent: -8,
              ease: "none",
              scrollTrigger: {
                trigger: hero,
                start: "top top",
                end: "bottom top",
                scrub: 1.5,
              },
            });
          }

          return () => cleanups.forEach((fn) => fn());
        }
      );

      // ═══════════════════════════════════════════════════════════════════
      // MOBILE (<768px): Premium entrance — no SplitText, GPU-friendly
      // ═══════════════════════════════════════════════════════════════════
      mm.add(
        "(max-width: 767px) and (prefers-reduced-motion: no-preference)",
        () => {
          const cleanups: (() => void)[] = [];

          const mobileTl = gsap.timeline({
            paused: true,
            defaults: { ease: "smooth.out" },
          });

          // ─── Image: Scale-up with soft blur clearing ───
          if (imageWrapperRef.current) {
            gsap.set(imageWrapperRef.current, {
              opacity: 0,
              scale: 0.92,
              filter: "blur(4px)",
            });
            mobileTl.to(
              imageWrapperRef.current,
              {
                opacity: 1,
                scale: 1,
                filter: "blur(0px)",
                duration: 0.6,
                clearProps: "filter,transform",
              },
              0
            );
          }

          // ─── Name: clipPath reveal from bottom (premium wipe) ───
          if (nameRef.current) {
            gsap.set(nameRef.current, {
              clipPath: "inset(100% 0 0 0)",
              opacity: 1,
            });
            mobileTl.to(
              nameRef.current,
              {
                clipPath: "inset(0% 0 0 0)",
                duration: 0.5,
                ease: "reveal",
                clearProps: "clipPath",
              },
              0.1
            );
          }

          // ─── Pronoun: Slide from left ───
          if (pronounRef.current) {
            gsap.set(pronounRef.current, { opacity: 0, x: -20 });
            mobileTl.to(
              pronounRef.current,
              { opacity: 1, x: 0, duration: 0.4 },
              0.25
            );
          }

          // ─── Accent line: scaleX draw ───
          if (accentLineRef.current) {
            gsap.set(accentLineRef.current, {
              scaleX: 0,
              opacity: 0,
              transformOrigin: "left center",
            });
            mobileTl.to(
              accentLineRef.current,
              { scaleX: 1, opacity: 1, duration: 0.5 },
              0.3
            );
          }

          // ─── Sparkle: Scale + rotation spin-in ───
          if (sparkleRef.current) {
            gsap.set(sparkleRef.current, {
              opacity: 0,
              scale: 0,
              rotation: -90,
            });
            mobileTl.to(
              sparkleRef.current,
              {
                opacity: 1,
                scale: 1,
                rotation: 0,
                duration: 0.5,
                ease: "spring",
              },
              0.35
            );
          }

          // ─── Subtitle: Blur-to-focus ───
          if (subtitleRef.current) {
            gsap.set(subtitleRef.current, {
              opacity: 0,
              y: 15,
              filter: "blur(3px)",
            });
            mobileTl.to(
              subtitleRef.current,
              {
                opacity: 1,
                y: 0,
                filter: "blur(0px)",
                duration: 0.5,
                clearProps: "filter",
              },
              0.4
            );
          }

          // ─── Email: Slide from left ───
          if (emailRef.current) {
            gsap.set(emailRef.current, { opacity: 0, x: -15 });
            mobileTl.to(
              emailRef.current,
              { opacity: 1, x: 0, duration: 0.4 },
              0.5
            );
          }

          // ─── CTA buttons: Scale bounce ───
          if (buttonsRef.current) {
            gsap.set(buttonsRef.current, { opacity: 0, scale: 0.9 });
            mobileTl.to(
              buttonsRef.current,
              {
                opacity: 1,
                scale: 1,
                duration: 0.5,
                ease: "back.out(1.7)",
                clearProps: "transform",
              },
              0.55
            );
          }

          // ─── Idle: Sparkle slow spin after entrance ───
          let sparkleTween: gsap.core.Tween | null = null;
          if (sparkleRef.current) {
            sparkleTween = gsap.to(sparkleRef.current, {
              rotation: "+=360",
              duration: 12,
              repeat: -1,
              ease: "none",
              paused: true,
            });
            cleanups.push(() => sparkleTween?.kill());
          }

          mobileTl.call(() => {
            sparkleTween?.play();
          });

          // ─── Play logic ───
          setupPlayTrigger(mobileTl, cleanups);

          return () => cleanups.forEach((fn) => fn());
        }
      );

      // ═══════════════════════════════════════════════════════════════════
      // REDUCED MOTION: Instant visibility
      // ═══════════════════════════════════════════════════════════════════
      mm.add("(prefers-reduced-motion: reduce)", () => {
        let hasShown = false;
        const show = () => {
          if (hasShown) return;
          hasShown = true;
          const refs = [
            nameRef,
            pronounRef,
            subtitleRef,
            emailRef,
            buttonsRef,
            imageWrapperRef,
            glowRef,
            accentLineRef,
            sparkleRef,
          ];
          refs.forEach((ref) => {
            if (ref.current) {
              gsap.set(ref.current, { opacity: 1, clearProps: "transform" });
            }
          });
          if (typeof window !== "undefined") {
            sessionStorage.setItem("gsap-hero-revealed", "true");
          }
        };

        if (
          typeof window !== "undefined" &&
          sessionStorage.getItem("gsap-hero-revealed") === "true"
        ) {
          requestAnimationFrame(() => show());
        } else {
          window.addEventListener("gsap-intro-complete", show);
          const fallback = setTimeout(show, 100);
          return () => {
            window.removeEventListener("gsap-intro-complete", show);
            clearTimeout(fallback);
          };
        }

        return () => {
          window.removeEventListener("gsap-intro-complete", show);
        };
      });
    },
    { scope: heroRef }
  );

  const handleResumeView = useCallback(() => {
    window.open(RESUME_FILE_PATH, "_blank");
  }, []);

  const handleEmailMouseEnter = useCallback(() => {
    setHasHoveredEmail(true);
    setIsEmailHovered(true);
  }, []);

  const handleEmailMouseLeave = useCallback(() => {
    setIsEmailHovered(false);
  }, []);

  return (
    <div
      ref={heroRef}
      id="hero"
      className="text-foreground bg-transparent flex flex-col md:flex-row items-center justify-center max-w-7xl mx-auto w-full min-h-screen"
    >
      {/* Left Section */}
      <div
        ref={leftRef}
        className="flex-1 space-y-6 p-6 text-left md:text-left flex flex-col justify-center hero-left-section"
      >
        <h1 className="text-3xl sm:text-3xl md:text-5xl font-bold">
          <span
            ref={nameRef}
            className="text-3xl sm:text-3xl md:text-5xl font-extrabold tracking-wider text-foreground inline-block"
          >
            Tushar Deomare
          </span>

          <p
            ref={pronounRef}
            className="text-xs sm:text-sm text-pink-500 font-semibold block"
          >
            He / Him
          </p>
        </h1>

        {/* Accent line */}
        <div
          ref={accentLineRef}
          className="h-[2px] w-20 bg-gradient-to-r from-pink-500 to-purple-500/50 origin-left"
        />

        {/* Key Highlight */}
        <div
          ref={subtitleRef}
          className="flex items-center gap-2 text-lg sm:text-xl md:text-2xl text-muted-foreground"
        >
          <span ref={sparkleRef} className="inline-block">
            <Sparkles className="w-5 h-5 sm:w-6 sm:h-6 text-pink-500" />
          </span>
          <div className="p-1">
            Building scalable solutions with 2+ years of expertise
          </div>
        </div>

        {/* Email Contact */}
        <div ref={emailRef} className="flex items-center gap-2 mt-4 relative">
          <a
            href="mailto:tdeomare1@gmail.com"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-sm sm:text-base text-muted-foreground hover:text-pink-500 transition-colors duration-300 group relative"
            onMouseEnter={handleEmailMouseEnter}
            onMouseLeave={handleEmailMouseLeave}
          >
            <Mail className="w-4 h-4 group-hover:rotate-12 transition-transform duration-300" />
            <span className="font-medium relative">
              tdeomare1@gmail.com
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-pink-500 transition-all duration-300 group-hover:w-full"></span>
            </span>
            {/* Tooltip */}
            <span
              className={`absolute -top-10 left-1/2 -translate-x-1/2 bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 text-xs px-3 py-1.5 rounded-md pointer-events-none transition-opacity duration-300 whitespace-nowrap z-10 shadow-lg ${
                hasHoveredEmail
                  ? isEmailHovered
                    ? "opacity-100"
                    : "opacity-0"
                  : "opacity-100"
              }`}
            >
              Click to compose email message
              <span className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-full w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900 dark:border-t-gray-100"></span>
            </span>
          </a>
        </div>

        {/* CTA Button */}
        <div ref={buttonsRef} className="flex flex-wrap gap-4 mt-6">
          <div ref={buttonWrapperRef} className="will-change-transform">
            <Button
              onClick={handleResumeView}
              className="bg-pink-500 hover:bg-pink-600 cursor-pointer text-white font-semibold px-6 py-3 rounded-lg transition-all duration-300 flex items-center gap-2 group"
            >
              My Resume
              <FileText className="w-4 h-4 group-hover:translate-y-1 transition-transform" />
            </Button>
          </div>
        </div>
      </div>

      {/* Right Section */}
      <div className="flex-1 flex justify-center p-6 hero-right-section">
        <div className="relative">
          {/* Gradient glow ring — behind image */}
          <div
            // ref={glowRef}
            className="absolute -inset-8 rounded-full -z-10"
            // style={{
            //   background:
            //     "conic-gradient(from 0deg, rgba(236,72,153,0.3), rgba(168,85,247,0.25), rgba(59,130,246,0.2), rgba(236,72,153,0.3))",
            //   filter: "blur(40px)",
            // }}
          />
          {/* Profile image */}
          <div
            ref={imageWrapperRef}
            className="w-64 h-64 rounded-full overflow-hidden shadow-lg"
          >
            <img
              src="/Tushar_Deomare.jpg"
              alt="Tushar Deomare"
              className="w-full h-full object-cover"
              loading="eager"
              fetchPriority="high"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export const HeroSection = memo(HeroSectionComponent);
