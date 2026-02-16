import { memo, useMemo, useRef } from "react";
import { Badge } from "../lightswind/badge.tsx";
import { MacbookScroll } from "../ui/macbook-scroll";
import TechSkillsPresentation from "./TechSkillsPresentation";
import { Users } from "lucide-react";
import { gsap, SplitText, useGSAP } from "@/lib/gsap";

const SOFT_SKILLS = [
  "Leadership",
  "Problem Solving",
  "Agile Methodologies",
  "Mentorship",
  "Strategic Thinking",
  "Cross-Team Collaboration",
] as const;

function ProfessionalProfileComponent() {
  const sectionRef = useRef<HTMLElement>(null);
  const techIconRef = useRef<HTMLDivElement>(null);
  const techHeadingRef = useRef<HTMLHeadingElement>(null);

  useGSAP(
    () => {
      if (!sectionRef.current) return;

      const mm = gsap.matchMedia();

      // ═══════════════════════════════════════════════════════════════════
      // DESKTOP: Badge wave from center, heading orchestration,
      // decorative line grow
      // ═══════════════════════════════════════════════════════════════════
      mm.add(
        "(min-width: 768px) and (prefers-reduced-motion: no-preference)",
        () => {
          const cleanups: (() => void)[] = [];
          const section = sectionRef.current!;

          // ─── Soft Skills heading slide-in ──────────────────────────
          const softHeading =
            section.querySelector<HTMLElement>(".skills-soft-heading");
          if (softHeading && softHeading.textContent?.trim()) {
            const softSplit = new SplitText(softHeading, {
              type: "words",
              mask: "words",
            });

            gsap.set(softSplit.words, { yPercent: 110 });

            gsap.to(softSplit.words, {
              yPercent: 0,
              stagger: 0.04,
              duration: 0.6,
              ease: "smooth.out",
              scrollTrigger: {
                trigger: softHeading,
                start: "top 88%",
                end: "top 62%",
                scrub: 1,
              },
            });

            cleanups.push(() => softSplit.revert());
          }

          // ─── Soft Skills decorative line grows ─────────────────────
          const softLine =
            section.querySelector<HTMLElement>(".skills-soft-line");
          if (softLine) {
            gsap.set(softLine, {
              scaleX: 0,
              transformOrigin: "left center",
            });

            gsap.to(softLine, {
              scaleX: 1,
              duration: 0.5,
              ease: "smooth.out",
              scrollTrigger: {
                trigger: softLine,
                start: "top 88%",
                end: "top 65%",
                scrub: 1,
              },
            });
          }

          // ─── Soft Skills badges: Wave from center outward ──────────
          // Badges emanate from center with blur-to-focus + scale + 3D tilt
          const badges =
            section.querySelectorAll<HTMLElement>(".skills-badge");

          if (badges.length) {
            gsap.set(badges, { transformPerspective: 600 });

            gsap.fromTo(
              badges,
              {
                y: 20,
                opacity: 0,
                scale: 0.8,
                rotateX: -12,
                filter: "blur(4px)",
              },
              {
                y: 0,
                opacity: 1,
                scale: 1,
                rotateX: 0,
                filter: "blur(0px)",
                stagger: {
                  each: 0.03,
                  from: "center",
                  grid: "auto",
                  ease: "power2.out",
                },
                duration: 0.6,
                ease: "smooth.out",
                scrollTrigger: {
                  trigger: section.querySelector(".skills-badges-wrap"),
                  start: "top 88%",
                  end: "top 55%",
                  scrub: 1,
                },
              }
            );
          }

          // ─── Technical Skills heading: Icon spring + chars reveal ───
          if (techIconRef.current) {
            gsap.set(techIconRef.current, {
              scale: 0,
              rotation: -180,
              opacity: 0,
            });

            gsap.to(techIconRef.current, {
              scale: 1,
              rotation: 0,
              opacity: 1,
              duration: 0.6,
              ease: "spring",
              scrollTrigger: {
                trigger: techIconRef.current,
                start: "top 88%",
                end: "top 65%",
                scrub: 1,
              },
            });
          }

          if (
            techHeadingRef.current &&
            techHeadingRef.current.textContent?.trim()
          ) {
            const techSplit = new SplitText(techHeadingRef.current, {
              type: "chars",
              charsClass: "gsap-tech-heading-char",
              mask: "chars",
            });

            techSplit.chars.forEach((char: Element) => {
              (char as HTMLElement).style.display = "inline-block";
            });

            gsap.set(techSplit.chars, { yPercent: 120, opacity: 0 });

            gsap.to(techSplit.chars, {
              yPercent: 0,
              opacity: 1,
              stagger: { each: 0.03, from: "start" },
              duration: 0.7,
              ease: "smooth.out",
              scrollTrigger: {
                trigger: techHeadingRef.current,
                start: "top 85%",
                end: "top 58%",
                scrub: 1,
              },
            });

            cleanups.push(() => techSplit.revert());
          }

          // ─── MacBook wrapper: Subtle scale-in entrance ─────────────
          const macbookWrap =
            section.querySelector<HTMLElement>(".skills-macbook-wrap");
          if (macbookWrap) {
            gsap.fromTo(
              macbookWrap,
              { y: 40, opacity: 0, scale: 0.96 },
              {
                y: 0,
                opacity: 1,
                scale: 1,
                duration: 0.8,
                ease: "smooth.out",
                scrollTrigger: {
                  trigger: macbookWrap,
                  start: "top 92%",
                  end: "top 60%",
                  scrub: 1,
                },
              }
            );
          }

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

          // ─── Soft heading: clipPath reveal from left ───
          const softHeading = section.querySelector<HTMLElement>(".skills-soft-heading");
          if (softHeading) {
            gsap.fromTo(
              softHeading,
              { clipPath: "inset(0 100% 0 0)", opacity: 1 },
              {
                clipPath: "inset(0 0% 0 0)", duration: 0.5, ease: "reveal",
                scrollTrigger: { trigger: softHeading, start: "top 90%", toggleActions: "play none none none" },
                onComplete: () => { gsap.set(softHeading, { clearProps: "clipPath" }); },
              }
            );
          }

          // ─── Decorative line: scaleX grow (was missing on mobile) ───
          const softLine = section.querySelector<HTMLElement>(".skills-soft-line");
          if (softLine) {
            gsap.fromTo(
              softLine,
              { scaleX: 0, transformOrigin: "left center" },
              {
                scaleX: 1, duration: 0.5, ease: "smooth.out",
                scrollTrigger: { trigger: softLine, start: "top 92%", toggleActions: "play none none none" },
              }
            );
          }

          // ─── Badges: Staggered pop-in with scale + rotation jitter ───
          const badges = section.querySelectorAll<HTMLElement>(".skills-badge");
          if (badges.length) {
            gsap.fromTo(
              badges,
              { opacity: 0, scale: 0.6, rotation: () => gsap.utils.random(-8, 8) },
              {
                opacity: 1, scale: 1, rotation: 0, duration: 0.5, ease: "back.out(1.7)",
                stagger: { each: 0.06, from: "start" },
                scrollTrigger: { trigger: section.querySelector(".skills-badges-wrap"), start: "top 90%", toggleActions: "play none none none" },
                onComplete: () => { gsap.set(badges, { clearProps: "transform" }); },
              }
            );
          }

          // ─── Tech icon: Spin-in with spring ───
          if (techIconRef.current) {
            gsap.fromTo(
              techIconRef.current,
              { opacity: 0, rotation: -90, scale: 0.5 },
              {
                opacity: 1, rotation: 0, scale: 1, duration: 0.5, ease: "spring",
                scrollTrigger: { trigger: techIconRef.current, start: "top 90%", toggleActions: "play none none none" },
                clearProps: "transform",
              }
            );
          }

          // ─── Tech heading group: Slide from left ───
          const techGroup = section.querySelector<HTMLElement>(".skills-tech-heading-group");
          if (techGroup) {
            gsap.fromTo(
              techGroup,
              { opacity: 0, x: -25 },
              {
                opacity: 1, x: 0, duration: 0.5, ease: "smooth.out",
                scrollTrigger: { trigger: techGroup, start: "top 90%", toggleActions: "play none none none" },
              }
            );
          }

          // ─── MacBook wrapper: Scale-up with blur clearing ───
          const macbookWrap = section.querySelector<HTMLElement>(".skills-macbook-wrap");
          if (macbookWrap) {
            gsap.fromTo(
              macbookWrap,
              { opacity: 0, scale: 0.85, filter: "blur(4px)" },
              {
                opacity: 1, scale: 1, filter: "blur(0px)", duration: 0.7, ease: "smooth.out",
                scrollTrigger: { trigger: macbookWrap, start: "top 92%", toggleActions: "play none none none" },
                onComplete: () => { gsap.set(macbookWrap, { clearProps: "filter,transform" }); },
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
          ".skills-badge, .skills-soft-heading, .skills-soft-line, .skills-tech-heading-group, .skills-macbook-wrap"
        );
        allEls.forEach((el) => {
          gsap.set(el, { opacity: 1, clearProps: "transform,filter" });
        });
        if (techIconRef.current) {
          gsap.set(techIconRef.current, {
            opacity: 1,
            clearProps: "transform",
          });
        }
      });
    },
    { scope: sectionRef }
  );

  // Memoize MacbookScroll title to prevent re-creation
  const macbookTitle = useMemo(
    () => (
      <span>
        Skills & Technologies <br /> Transforming Ideas into Reality
      </span>
    ),
    []
  );

  return (
    <section ref={sectionRef} id="skills" className="space-y-12 mt-8 mb-10">
      {/* Soft Skills Section */}
      <div className="space-y-6">
        <div className="flex items-center gap-3 mb-4">
          <h3 className="skills-soft-heading text-2xl md:text-3xl font-bold text-foreground">
            Soft Skills
          </h3>
          <div className="skills-soft-line flex-1 h-px bg-gradient-to-r from-border via-primary/30 to-transparent" />
        </div>

        <div className="skills-badges-wrap flex flex-wrap gap-3">
          {SOFT_SKILLS.map((skill) => (
            <div key={skill} title={skill} className="skills-badge">
              <Badge
                variant="default"
                size="lg"
                className="text-sm font-semibold bg-gradient-to-r from-pink-500/90 to-purple-500/90 text-white border-0 hover:from-pink-500 hover:to-purple-500 hover:scale-110 hover:shadow-lg transition-[transform,box-shadow] duration-300 cursor-default"
              >
                {skill}
              </Badge>
            </div>
          ))}
        </div>
      </div>

      {/* Technical Skills Header */}
      <div className="skills-tech-heading-group flex items-baseline gap-4 mb-8">
        <div ref={techIconRef}>
          <Users className="w-8 h-8 md:w-10 md:h-10 lg:w-12 lg:h-12 text-primary flex-shrink-0 mt-1 md:mt-1.5 lg:mt-2" />
        </div>
        <h2
          ref={techHeadingRef}
          className="text-3xl md:text-4xl lg:text-5xl font-semibold text-foreground leading-relaxed"
        >
          Technical Skills
        </h2>
      </div>

      {/* MacbookScroll with Tech Skills Presentation */}
      <div className="skills-macbook-wrap mb-24 -mx-4 sm:-mx-6 md:mx-0 sm:h-[80vh] md:h-[180vh] lg:h-[180vh] xl:h-[180vh]">
        <MacbookScroll title={macbookTitle} showGradient={false}>
          <TechSkillsPresentation />
        </MacbookScroll>
      </div>
    </section>
  );
}

export default memo(ProfessionalProfileComponent);
