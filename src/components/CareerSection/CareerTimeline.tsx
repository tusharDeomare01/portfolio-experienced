import { portfolioData } from "@/lib/portfolioData";
import { Briefcase, Copy, Check, Sparkles } from "lucide-react";
import { Timeline } from "../ui/timeline";
import { motion, useReducedMotion, useInView } from "framer-motion";
import { useMemo, memo, useCallback, useState, useRef, useEffect } from "react";
import { gsap, SplitText, useGSAP, ScrollTrigger } from "@/lib/gsap";

// Animation constants — hoisted to module scope
const ACHIEVEMENT_STAGGER = 0.08;
const ACHIEVEMENT_DURATION = 0.3;
const ACHIEVEMENT_EASE: [number, number, number, number] = [0.25, 0.46, 0.45, 0.94];

const TECH_STAGGER = 0.04;
const TECH_DURATION = 0.2;
const TECH_EASE: [number, number, number, number] = [0.25, 0.46, 0.45, 0.94];

// Pre-computed static animation props — never re-allocated
const NO_ANIMATION_PROPS = {
  initial: { opacity: 1 },
  animate: { opacity: 1 },
  transition: { duration: 0 },
} as const;

const NO_HOVER = {} as const;
const HOVER_SCALE = { scale: 1.15, rotate: 5 } as const;
const TAP_SCALE = { scale: 0.95 } as const;
const TECH_TAP = { scale: 0.98 } as const;

// Stable intersection observer options
const IN_VIEW_OPTIONS = {
  once: true,
  margin: "-50px" as const,
  amount: 0.2,
} as const;

// CSS containment styles — hoisted
const CONTAIN_LAYOUT_STYLE = { contain: "layout style" } as const;

// Memoized Achievement Item Component
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
      if (prefersReducedMotion || !isInView) return NO_ANIMATION_PROPS;
      return {
        initial: { opacity: 0, x: -8, filter: "blur(4px)" },
        animate: { opacity: 1, x: 0, filter: "blur(0px)" },
        transition: {
          delay: index * ACHIEVEMENT_STAGGER,
          duration: ACHIEVEMENT_DURATION,
          ease: ACHIEVEMENT_EASE,
        },
      };
    }, [index, prefersReducedMotion, isInView]);

    return (
      <motion.div
        {...animationProps}
        className="flex items-start gap-3 group/achievement"
      >
        <div className="relative mt-0.5 flex-shrink-0">
          <motion.span
            className="relative w-5 h-5 rounded-full bg-gradient-to-br from-primary to-blue-500 flex items-center justify-center text-white text-[10px] font-semibold shadow-md shadow-primary/30 ring-1 ring-white/50 dark:ring-neutral-900/50 transition-all duration-200"
            aria-hidden="true"
            whileHover={prefersReducedMotion ? NO_HOVER : HOVER_SCALE}
            whileTap={prefersReducedMotion ? NO_HOVER : TAP_SCALE}
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
  (prev, next) =>
    prev.achievement === next.achievement &&
    prev.index === next.index &&
    prev.prefersReducedMotion === next.prefersReducedMotion &&
    prev.isInView === next.isInView
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
      } catch {
        // Fallback for older browsers — silently fail
      }
    }, [tech, copied]);

    useEffect(() => {
      return () => {
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
      };
    }, []);

    const animationProps = useMemo(() => {
      if (prefersReducedMotion || !isInView) {
        return {
          initial: { opacity: 1, scale: 1 },
          animate: { opacity: 1, scale: 1 },
          transition: { duration: 0 },
        };
      }
      return {
        initial: { opacity: 0, scale: 0.9, y: 4 },
        animate: { opacity: 1, scale: 1, y: 0 },
        transition: {
          delay: index * TECH_STAGGER,
          duration: TECH_DURATION,
          ease: TECH_EASE,
        },
      };
    }, [index, prefersReducedMotion, isInView]);

    const hoverProps = prefersReducedMotion
      ? NO_HOVER
      : { scale: 1.05, y: -2, transition: { duration: 0.2 } };

    const copyAnimation = copied
      ? { opacity: [1, 0.7, 1], scale: [1, 1.02, 1] }
      : NO_HOVER;

    return (
      <motion.button
        {...animationProps}
        whileHover={hoverProps}
        whileTap={prefersReducedMotion ? NO_HOVER : TECH_TAP}
        onClick={handleCopy}
        className="relative px-3 py-1.5 text-xs md:text-sm font-medium rounded-lg overflow-hidden group/tech focus:outline-none focus:ring-2 focus:ring-primary/50 focus:ring-offset-2 dark:focus:ring-offset-neutral-900 transition-all duration-200"
        style={CONTAIN_LAYOUT_STYLE}
        aria-label={`Technology: ${tech}. Click to copy.`}
        title={`Click to copy: ${tech}`}
      >
        {/* Gradient background with copy feedback */}
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
        {/* Border */}
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
  (prev, next) =>
    prev.tech === next.tech &&
    prev.index === next.index &&
    prev.prefersReducedMotion === next.prefersReducedMotion &&
    prev.isInView === next.isInView
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
        style={CONTAIN_LAYOUT_STYLE}
      >
        {/* Header Section */}
        <div className="space-y-2 pb-4 border-b border-neutral-200/60 dark:border-neutral-700/60">
          <motion.h4
            className="text-lg md:text-xl font-bold text-neutral-900 dark:text-neutral-100 tracking-tight"
            initial={prefersReducedMotion ? undefined : { opacity: 0, y: -4 }}
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
              initial={prefersReducedMotion ? undefined : { scale: 0 }}
              animate={
                isInView || prefersReducedMotion ? { scale: 1 } : { scale: 0 }
              }
              transition={{ delay: 0.1, duration: 0.2 }}
            />
            <motion.p
              className="text-sm md:text-base font-semibold text-primary dark:text-primary/90"
              initial={prefersReducedMotion ? undefined : { opacity: 0, x: -4 }}
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

        {/* Description */}
        {career.description && (
          <motion.p
            className="text-sm md:text-base leading-relaxed text-neutral-600 dark:text-neutral-400"
            initial={prefersReducedMotion ? undefined : { opacity: 0 }}
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
            initial={prefersReducedMotion ? undefined : { opacity: 0 }}
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
            initial={prefersReducedMotion ? undefined : { opacity: 0 }}
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
  (prev, next) =>
    prev.career === next.career &&
    prev.prefersReducedMotion === next.prefersReducedMotion
);

CareerContent.displayName = "CareerContent";

const CareerTimelineComponent = () => {
  const prefersReducedMotion = useReducedMotion();
  const sectionRef = useRef<HTMLElement>(null);
  const iconRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);

  useGSAP(
    () => {
      const section = sectionRef.current;
      if (!section) return;

      const mm = gsap.matchMedia();

      // ═══════════════════════════════════════════════════════════════════
      // DESKTOP: Orchestrated heading reveal, subtitle fade,
      // timeline wrapper entrance
      // ═══════════════════════════════════════════════════════════════════
      mm.add(
        "(min-width: 768px) and (prefers-reduced-motion: no-preference)",
        () => {
          const cleanups: (() => void)[] = [];

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

            const chars = headingSplit.chars;
            const len = chars.length;
            for (let i = 0; i < len; i++) {
              (chars[i] as HTMLElement).style.display = "inline-block";
            }

            gsap.set(chars, { yPercent: 120, opacity: 0 });

            gsap.to(chars, {
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
                onComplete: () => {
                  gsap.set(subtitle, { clearProps: "filter" });
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

          // ─── Tour event handlers ─────
          const handleTourStart = () => {
            for (let i = 0; i < exitScrollTriggers.length; i++) exitScrollTriggers[i].disable();
            if (header) {
              gsap.set(header, { yPercent: 0, opacity: 1, filter: "none", clearProps: "filter" });
            }
          };

          const handleTourEnd = () => {
            for (let i = 0; i < exitScrollTriggers.length; i++) exitScrollTriggers[i].enable();
          };

          window.addEventListener("tour-start", handleTourStart);
          window.addEventListener("tour-end", handleTourEnd);

          cleanups.push(() => {
            window.removeEventListener("tour-start", handleTourStart);
            window.removeEventListener("tour-end", handleTourEnd);
          });

          return () => {
            for (let i = 0; i < cleanups.length; i++) cleanups[i]();
          };
        }
      );

      // ═══════════════════════════════════════════════════════════════════
      // MOBILE: Premium entrance animations
      // ═══════════════════════════════════════════════════════════════════
      mm.add(
        "(max-width: 767px) and (prefers-reduced-motion: no-preference)",
        () => {
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

          // ─── Subtitle: Blur-to-focus ───
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

          // ─── Decorative line: scaleX grow from center ───
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
        const allEls = section.querySelectorAll<HTMLElement>(
          ".career-header, .career-subtitle, .career-decor-line, .career-timeline-wrap"
        );
        const len = allEls.length;
        for (let i = 0; i < len; i++) {
          gsap.set(allEls[i], { opacity: 1, clearProps: "transform,filter" });
        }
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

  // Memoized timeline data
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
      style={CONTAIN_LAYOUT_STYLE}
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
        style={CONTAIN_LAYOUT_STYLE}
      >
        <Timeline data={timelineData} showHeader={false} />
      </div>
    </section>
  );
};

export const CareerTimeline = memo(CareerTimelineComponent);
