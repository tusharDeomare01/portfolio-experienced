import { portfolioData } from "@/lib/portfolioData";
import { Briefcase, Copy, Check, Sparkles } from "lucide-react";
import { Timeline } from "../ui/timeline";
import { motion, useReducedMotion, useInView } from "framer-motion";
import { useMemo, memo, useCallback, useState, useRef, useEffect } from "react";
import { gsap, SplitText, useGSAP, ScrollTrigger } from "@/lib/gsap";

// Animation constants for consistency and performance
const ANIMATION_CONFIG = {
  achievement: {
    staggerDelay: 0.08,
    duration: 0.3,
    ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number],
  },
  technology: {
    staggerDelay: 0.04,
    duration: 0.2,
    ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number],
  },
} as const;

// Pre-computed animation props for reduced motion/no animation cases
const NO_ANIMATION_PROPS = {
  initial: { opacity: 1 },
  animate: { opacity: 1 },
  transition: { duration: 0 },
} as const;

const NO_HOVER_PROPS = {} as const;

// Stable intersection observer options
const IN_VIEW_OPTIONS = {
  once: true,
  margin: "-50px",
  amount: 0.2,
} as const;

// Memoized Achievement Item Component with enhanced interactions
const AchievementItem = memo(
  ({
    achievement,
    index,
    prefersReducedMotion,
    isInView,
  }: {
    achievement: string;
    index: number;
    prefersReducedMotion: boolean;
    isInView: boolean;
  }) => {
    const animationProps = useMemo(() => {
      if (prefersReducedMotion || !isInView) {
        return NO_ANIMATION_PROPS;
      }
      return {
        initial: { opacity: 0, x: -8, filter: "blur(4px)" },
        animate: { opacity: 1, x: 0, filter: "blur(0px)" },
        transition: {
          delay: index * ANIMATION_CONFIG.achievement.staggerDelay,
          duration: ANIMATION_CONFIG.achievement.duration,
          ease: ANIMATION_CONFIG.achievement.ease,
        },
      };
    }, [index, prefersReducedMotion, isInView]);

    const hoverProps = useMemo(
      () =>
        prefersReducedMotion ? NO_HOVER_PROPS : { scale: 1.15, rotate: 5 },
      [prefersReducedMotion]
    );

    const tapProps = useMemo(
      () => (prefersReducedMotion ? NO_HOVER_PROPS : { scale: 0.95 }),
      [prefersReducedMotion]
    );

    const willChange = useMemo(
      () =>
        prefersReducedMotion || !isInView
          ? "auto"
          : "transform, opacity, filter",
      [prefersReducedMotion, isInView]
    );

    return (
      <motion.div
        {...animationProps}
        className="flex items-start gap-3 group/achievement"
        style={{
          willChange,
          contain: "layout style paint",
        }}
      >
        <div className="relative mt-0.5 flex-shrink-0">
          <motion.span
            className="relative w-5 h-5 rounded-full bg-gradient-to-br from-primary to-blue-500 flex items-center justify-center text-white text-[10px] font-semibold shadow-md shadow-primary/30 ring-1 ring-white/50 dark:ring-neutral-900/50 transition-all duration-200"
            aria-hidden="true"
            whileHover={hoverProps}
            whileTap={tapProps}
          >
            <Sparkles className="w-3 h-3" />
          </motion.span>
        </div>
        <span className="flex-1 text-sm md:text-base text-neutral-700 dark:text-neutral-300 leading-relaxed group-hover/achievement:text-neutral-900 dark:group-hover/achievement:text-neutral-100 transition-colors duration-200">
          {achievement}
        </span>
      </motion.div>
    );
  },
  (prevProps, nextProps) =>
    prevProps.achievement === nextProps.achievement &&
    prevProps.index === nextProps.index &&
    prevProps.prefersReducedMotion === nextProps.prefersReducedMotion &&
    prevProps.isInView === nextProps.isInView
);

AchievementItem.displayName = "AchievementItem";

// Enhanced Technology Badge with copy functionality
const TechnologyBadge = memo(
  ({
    tech,
    index,
    prefersReducedMotion,
    isInView,
  }: {
    tech: string;
    index: number;
    prefersReducedMotion: boolean;
    isInView: boolean;
  }) => {
    const [copied, setCopied] = useState(false);
    const timeoutRef = useRef<ReturnType<typeof setTimeout>>(null);

    const handleCopy = useCallback(async () => {
      if (copied) return;

      try {
        await navigator.clipboard.writeText(tech);
        setCopied(true);

        if (timeoutRef.current) clearTimeout(timeoutRef.current);
        timeoutRef.current = setTimeout(() => setCopied(false), 2000);
      } catch (err) {
        // Fallback for older browsers
        console.warn("Failed to copy:", err);
      }
    }, [tech, copied]);

    useEffect(() => {
      return () => {
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
        }
      };
    }, []);

    const animationProps = useMemo(() => {
      if (prefersReducedMotion || !isInView) {
        return {
          initial: { opacity: 1, scale: 1 },
          animate: { opacity: 1, scale: 1 },
          transition: { duration: 0 },
          whileHover: NO_HOVER_PROPS,
        };
      }
      return {
        initial: { opacity: 0, scale: 0.9, y: 4 },
        animate: { opacity: 1, scale: 1, y: 0 },
        transition: {
          delay: index * ANIMATION_CONFIG.technology.staggerDelay,
          duration: ANIMATION_CONFIG.technology.duration,
          ease: ANIMATION_CONFIG.technology.ease,
        },
        whileHover: prefersReducedMotion
          ? NO_HOVER_PROPS
          : {
              scale: 1.05,
              y: -2,
              transition: { duration: 0.2 },
            },
        whileTap: prefersReducedMotion ? NO_HOVER_PROPS : { scale: 0.98 },
      };
    }, [index, prefersReducedMotion, isInView]);

    const willChange = useMemo(
      () => (prefersReducedMotion || !isInView ? "auto" : "transform, opacity"),
      [prefersReducedMotion, isInView]
    );

    const copyAnimation = useMemo(
      () =>
        copied
          ? {
              opacity: [1, 0.7, 1],
              scale: [1, 1.02, 1],
            }
          : {},
      [copied]
    );

    return (
      <motion.button
        {...animationProps}
        onClick={handleCopy}
        className="relative px-3 py-1.5 text-xs md:text-sm font-medium rounded-lg overflow-hidden group/tech focus:outline-none focus:ring-2 focus:ring-primary/50 focus:ring-offset-2 dark:focus:ring-offset-neutral-900 transition-all duration-200"
        style={{
          willChange,
          contain: "layout style paint",
        }}
        aria-label={`Technology: ${tech}. Click to copy.`}
        title={`Click to copy: ${tech}`}
      >
        {/* Optimized gradient background with enhanced copy feedback */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-primary/10 via-blue-500/10 to-purple-500/10 dark:from-primary/20 dark:via-blue-500/20 dark:to-purple-500/20 rounded-lg"
          animate={copyAnimation}
          transition={{ duration: 0.4, ease: "easeInOut" }}
        />
        {/* Success indicator overlay */}
        {copied && (
          <motion.div
            className="absolute inset-0 bg-green-500/20 dark:bg-green-500/30 rounded-lg"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          />
        )}
        {/* Border with enhanced hover state */}
        <div className="absolute inset-0 rounded-lg border border-primary/20 dark:border-primary/30 group-hover/tech:border-primary/50 dark:group-hover/tech:border-primary/60 transition-all duration-200" />
        {/* Text with icon indicator */}
        <span className="relative flex items-center gap-1.5 text-neutral-700 dark:text-neutral-300 group-hover/tech:text-primary dark:group-hover/tech:text-primary transition-colors duration-200">
          {tech}
          <motion.span
            initial={false}
            animate={{ scale: copied ? 1 : 0, opacity: copied ? 1 : 0 }}
            transition={{ duration: 0.2 }}
            className="inline-flex"
          >
            {copied ? (
              <Check className="w-3 h-3 text-green-500" />
            ) : (
              <Copy className="w-3 h-3 opacity-0 group-hover/tech:opacity-100 transition-opacity duration-200" />
            )}
          </motion.span>
        </span>
      </motion.button>
    );
  },
  (prevProps, nextProps) =>
    prevProps.tech === nextProps.tech &&
    prevProps.index === nextProps.index &&
    prevProps.prefersReducedMotion === nextProps.prefersReducedMotion &&
    prevProps.isInView === nextProps.isInView
);

TechnologyBadge.displayName = "TechnologyBadge";

// Memoized Career Content Component with viewport detection
const CareerContent = memo(
  ({
    career,
    prefersReducedMotion,
  }: {
    career: (typeof portfolioData.career)[0];
    prefersReducedMotion: boolean;
  }) => {
    const contentRef = useRef<HTMLDivElement>(null);
    const isInView = useInView(contentRef, IN_VIEW_OPTIONS);

    return (
      <div
        ref={contentRef}
        className="space-y-5"
        style={{ contain: "layout style" }}
      >
        {/* Header Section with enhanced styling */}
        <div className="space-y-2 pb-4 border-b border-neutral-200/60 dark:border-neutral-700/60">
          <motion.h4
            className="text-lg md:text-xl font-bold text-neutral-900 dark:text-neutral-100 tracking-tight"
            initial={prefersReducedMotion ? {} : { opacity: 0, y: -4 }}
            animate={
              isInView || prefersReducedMotion
                ? { opacity: 1, y: 0 }
                : { opacity: 0, y: -4 }
            }
            transition={{ duration: 0.3 }}
          >
            {career.title}
          </motion.h4>
          <div className="flex items-center gap-2">
            <motion.div
              className="h-1.5 w-1.5 rounded-full bg-primary/70 dark:bg-primary/80"
              aria-hidden="true"
              initial={prefersReducedMotion ? {} : { scale: 0 }}
              animate={
                isInView || prefersReducedMotion ? { scale: 1 } : { scale: 0 }
              }
              transition={{ delay: 0.1, duration: 0.2 }}
            />
            <motion.p
              className="text-sm md:text-base font-semibold text-primary dark:text-primary/90"
              initial={prefersReducedMotion ? {} : { opacity: 0, x: -4 }}
              animate={
                isInView || prefersReducedMotion
                  ? { opacity: 1, x: 0 }
                  : { opacity: 0, x: -4 }
              }
              transition={{ delay: 0.15, duration: 0.3 }}
            >
              {career.company}
            </motion.p>
          </div>
        </div>

        {/* Description with fade-in */}
        {career.description && (
          <motion.p
            className="text-sm md:text-base leading-relaxed text-neutral-600 dark:text-neutral-400"
            initial={prefersReducedMotion ? {} : { opacity: 0 }}
            animate={
              isInView || prefersReducedMotion ? { opacity: 1 } : { opacity: 0 }
            }
            transition={{ delay: 0.2, duration: 0.4 }}
          >
            {career.description}
          </motion.p>
        )}

        {/* Achievements */}
        {career.achievements && career.achievements.length > 0 && (
          <motion.div
            className="space-y-2.5 pt-1"
            initial={prefersReducedMotion ? {} : { opacity: 0 }}
            animate={
              isInView || prefersReducedMotion ? { opacity: 1 } : { opacity: 0 }
            }
            transition={{ delay: 0.25, duration: 0.3 }}
          >
            <div className="flex items-center gap-2 mb-2">
              <div
                className="h-px w-6 bg-primary/40 dark:bg-primary/50 rounded-full"
                aria-hidden="true"
              />
              <p className="text-xs md:text-sm font-semibold text-neutral-700 dark:text-neutral-300 uppercase tracking-wide">
                Achievements
              </p>
            </div>
            <div
              className="space-y-2.5 pl-1"
              role="list"
              aria-label="Career achievements"
            >
              {career.achievements.map((achievement, idx) => (
                <AchievementItem
                  key={`${career.company}-achievement-${idx}`}
                  achievement={achievement}
                  index={idx}
                  prefersReducedMotion={prefersReducedMotion}
                  isInView={isInView}
                />
              ))}
            </div>
          </motion.div>
        )}

        {/* Technologies */}
        {career.technologies && career.technologies.length > 0 && (
          <motion.div
            className="pt-1"
            initial={prefersReducedMotion ? {} : { opacity: 0 }}
            animate={
              isInView || prefersReducedMotion ? { opacity: 1 } : { opacity: 0 }
            }
            transition={{ delay: 0.3, duration: 0.3 }}
          >
            <div className="flex items-center gap-2 mb-3">
              <div
                className="h-px w-6 bg-primary/40 dark:bg-primary/50 rounded-full"
                aria-hidden="true"
              />
              <p className="text-xs md:text-sm font-semibold text-neutral-700 dark:text-neutral-300 uppercase tracking-wide">
                Technologies
              </p>
            </div>
            <div
              className="flex flex-wrap gap-2"
              role="list"
              aria-label="Technologies used"
            >
              {career.technologies.map((tech, idx) => (
                <TechnologyBadge
                  key={`${career.company}-tech-${idx}`}
                  tech={tech}
                  index={idx}
                  prefersReducedMotion={prefersReducedMotion}
                  isInView={isInView}
                />
              ))}
            </div>
          </motion.div>
        )}
      </div>
    );
  },
  (prevProps, nextProps) =>
    prevProps.career === nextProps.career &&
    prevProps.prefersReducedMotion === nextProps.prefersReducedMotion
);

CareerContent.displayName = "CareerContent";

const CareerTimelineComponent = () => {
  const prefersReducedMotion = useReducedMotion();
  const sectionRef = useRef<HTMLElement>(null);
  const iconRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);

  useGSAP(
    () => {
      if (!sectionRef.current) return;

      const mm = gsap.matchMedia();

      // ═══════════════════════════════════════════════════════════════════
      // DESKTOP: Orchestrated heading reveal, subtitle fade,
      // timeline wrapper entrance
      // ═══════════════════════════════════════════════════════════════════
      mm.add(
        "(min-width: 768px) and (prefers-reduced-motion: no-preference)",
        () => {
          const cleanups: (() => void)[] = [];
          const section = sectionRef.current!;

          // ─── Icon spring entrance ─────────────────────────────────
          if (iconRef.current) {
            gsap.set(iconRef.current, {
              scale: 0,
              rotation: -180,
              opacity: 0,
            });

            gsap.to(iconRef.current, {
              scale: 1,
              rotation: 0,
              opacity: 1,
              duration: 0.6,
              ease: "spring",
              scrollTrigger: {
                trigger: section,
                start: "top 80%",
                end: "top 58%",
                scrub: 1,
              },
            });
          }

          // ─── Heading: SplitText chars masked reveal ───────────────
          if (
            headingRef.current &&
            headingRef.current.textContent?.trim()
          ) {
            const headingSplit = new SplitText(headingRef.current, {
              type: "chars",
              charsClass: "gsap-career-heading-char",
              mask: "chars",
            });

            headingSplit.chars.forEach((char: Element) => {
              (char as HTMLElement).style.display = "inline-block";
            });

            gsap.set(headingSplit.chars, { yPercent: 120, opacity: 0 });

            gsap.to(headingSplit.chars, {
              yPercent: 0,
              opacity: 1,
              stagger: { each: 0.03, from: "start" },
              duration: 0.7,
              ease: "smooth.out",
              scrollTrigger: {
                trigger: section,
                start: "top 77%",
                end: "top 50%",
                scrub: 1,
              },
            });

            cleanups.push(() => headingSplit.revert());
          }

          // ─── Subtitle: Fade + slide up ────────────────────────────
          const subtitle =
            section.querySelector<HTMLElement>(".career-subtitle");
          if (subtitle) {
            gsap.fromTo(
              subtitle,
              { y: 20, opacity: 0, filter: "blur(4px)" },
              {
                y: 0,
                opacity: 1,
                filter: "blur(0px)",
                duration: 0.6,
                ease: "smooth.out",
                scrollTrigger: {
                  trigger: section,
                  start: "top 72%",
                  end: "top 48%",
                  scrub: 1,
                },
              }
            );
          }

          // ─── Decorative line: Grows from center ───────────────────
          const decorLine =
            section.querySelector<HTMLElement>(".career-decor-line");
          if (decorLine) {
            gsap.set(decorLine, {
              scaleX: 0,
              transformOrigin: "center center",
            });

            gsap.to(decorLine, {
              scaleX: 1,
              duration: 0.5,
              ease: "smooth.out",
              scrollTrigger: {
                trigger: section,
                start: "top 68%",
                end: "top 45%",
                scrub: 1,
              },
            });
          }

          // ─── Timeline wrapper: Scale-in entrance ──────────────────
          const timelineWrap =
            section.querySelector<HTMLElement>(".career-timeline-wrap");
          if (timelineWrap) {
            gsap.fromTo(
              timelineWrap,
              { y: 50, opacity: 0, scale: 0.97 },
              {
                y: 0,
                opacity: 1,
                scale: 1,
                duration: 0.8,
                ease: "smooth.out",
                scrollTrigger: {
                  trigger: timelineWrap,
                  start: "top 92%",
                  end: "top 62%",
                  scrub: 1,
                },
              }
            );
          }

          // ─── Scroll exit: Career → Projects transition ─────────
          // Header recedes with blur as user scrolls past the section
          const exitScrollTriggers: ScrollTrigger[] = [];
          const header =
            section.querySelector<HTMLElement>(".career-header");
          if (header) {
            const exitTween = gsap.to(header, {
              yPercent: -15,
              opacity: 0,
              filter: "blur(3px)",
              ease: "none",
              scrollTrigger: {
                trigger: section,
                start: "bottom 65%",
                end: "bottom 10%",
                scrub: true,
              },
            });
            if (exitTween.scrollTrigger) {
              exitScrollTriggers.push(exitTween.scrollTrigger);
            }
          }

          // ─── Tour event handlers: Disable exit animations during tour ─────
          const handleTourStart = () => {
            exitScrollTriggers.forEach((st) => st.disable());
            if (header) {
              gsap.set(header, { yPercent: 0, opacity: 1, filter: "none", clearProps: "filter" });
            }
          };

          const handleTourEnd = () => {
            exitScrollTriggers.forEach((st) => st.enable());
          };

          window.addEventListener("tour-start", handleTourStart);
          window.addEventListener("tour-end", handleTourEnd);

          cleanups.push(() => {
            window.removeEventListener("tour-start", handleTourStart);
            window.removeEventListener("tour-end", handleTourEnd);
          });

          return () => cleanups.forEach((fn) => fn());
        }
      );

      // ═══════════════════════════════════════════════════════════════════
      // MOBILE: Premium entrance animations
      // ═══════════════════════════════════════════════════════════════════
      mm.add(
        "(max-width: 767px) and (prefers-reduced-motion: no-preference)",
        () => {
          const section = sectionRef.current!;

          // ─── Icon: Spin-in with spring ───
          if (iconRef.current) {
            gsap.fromTo(
              iconRef.current,
              { opacity: 0, rotation: -90, scale: 0.5 },
              {
                opacity: 1, rotation: 0, scale: 1, duration: 0.5, ease: "spring",
                scrollTrigger: { trigger: section, start: "top 88%", toggleActions: "play reverse play reverse" },
                clearProps: "transform",
              }
            );
          }

          // ─── Header: clipPath reveal from bottom ───
          const header = section.querySelector<HTMLElement>(".career-header");
          if (header) {
            gsap.fromTo(
              header,
              { clipPath: "inset(100% 0 0 0)", opacity: 1 },
              {
                clipPath: "inset(0% 0 0 0)", duration: 0.5, ease: "reveal",
                scrollTrigger: { trigger: header, start: "top 88%", toggleActions: "play reverse play reverse" },
                onComplete: () => { gsap.set(header, { clearProps: "clipPath" }); },
              }
            );
          }

          // ─── Subtitle: Blur-to-focus (was missing on mobile) ───
          const subtitle = section.querySelector<HTMLElement>(".career-subtitle");
          if (subtitle) {
            gsap.fromTo(
              subtitle,
              { opacity: 0, filter: "blur(3px)" },
              {
                opacity: 1, filter: "blur(0px)", duration: 0.5, ease: "smooth.out",
                scrollTrigger: { trigger: subtitle, start: "top 90%", toggleActions: "play reverse play reverse" },
                onComplete: () => { gsap.set(subtitle, { clearProps: "filter" }); },
              }
            );
          }

          // ─── Decorative line: scaleX grow from center (was missing) ───
          const decorLine = section.querySelector<HTMLElement>(".career-decor-line");
          if (decorLine) {
            gsap.fromTo(
              decorLine,
              { scaleX: 0, transformOrigin: "center center" },
              {
                scaleX: 1, duration: 0.5, ease: "smooth.out",
                scrollTrigger: { trigger: decorLine, start: "top 92%", toggleActions: "play reverse play reverse" },
              }
            );
          }

          // ─── Timeline wrapper: Scale-up with blur clearing ───
          const timelineWrap = section.querySelector<HTMLElement>(".career-timeline-wrap");
          if (timelineWrap) {
            gsap.fromTo(
              timelineWrap,
              { opacity: 0, scale: 0.92, filter: "blur(3px)" },
              {
                opacity: 1, scale: 1, filter: "blur(0px)", duration: 0.6, ease: "smooth.out",
                scrollTrigger: { trigger: timelineWrap, start: "top 90%", toggleActions: "play reverse play reverse" },
                onComplete: () => { gsap.set(timelineWrap, { clearProps: "filter,transform" }); },
              }
            );
          }
        }
      );

      // ═══════════════════════════════════════════════════════════════════
      // REDUCED MOTION: Instant visibility
      // ═══════════════════════════════════════════════════════════════════
      mm.add("(prefers-reduced-motion: reduce)", () => {
        const allEls = sectionRef.current!.querySelectorAll<HTMLElement>(
          ".career-header, .career-subtitle, .career-decor-line, .career-timeline-wrap"
        );
        allEls.forEach((el) => {
          gsap.set(el, { opacity: 1, clearProps: "transform,filter" });
        });
        if (iconRef.current) {
          gsap.set(iconRef.current, {
            opacity: 1,
            clearProps: "transform",
          });
        }
      });
    },
    { scope: sectionRef }
  );

  // Memoized timeline data to prevent unnecessary recalculations
  const timelineData = useMemo(() => {
    return portfolioData.career.map((career, idx) => ({
      title: career.period,
      content: (
        <CareerContent
          career={career}
          prefersReducedMotion={!!prefersReducedMotion}
        />
      ),
      key: `${career.company}-${career.period}-${idx}`,
    }));
  }, [prefersReducedMotion]);

  return (
    <section
      ref={sectionRef}
      id="career"
      className="min-h-screen flex flex-col justify-center py-12 sm:py-16 md:py-20 px-4 sm:px-6 lg:px-8"
      aria-label="Career timeline"
      style={{ contain: "layout style" }}
    >
      <div className="career-header text-center mb-6 sm:mb-8">
        <div className="flex items-baseline justify-center gap-4 mb-4">
          <div ref={iconRef}>
            <Briefcase className="w-8 h-8 md:w-10 md:h-10 lg:w-12 lg:h-12 text-primary flex-shrink-0 mt-1 md:mt-1.5 lg:mt-2" />
          </div>
          <h2
            ref={headingRef}
            className="text-3xl md:text-4xl lg:text-5xl font-semibold text-foreground leading-relaxed"
          >
            Career Journey
          </h2>
        </div>
        <p className="career-subtitle text-lg font-bold">
          An evolving path of leadership, innovation, and impact
        </p>
        {/* Decorative line grows from center */}
        <div className="career-decor-line mx-auto mt-4 h-px w-48 bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
      </div>
      <div
        className="career-timeline-wrap relative w-full overflow-clip"
        style={{ contain: "layout style" }}
      >
        <Timeline data={timelineData} showHeader={false} />
      </div>
    </section>
  );
};

export const CareerTimeline = memo(CareerTimelineComponent);
