import { memo, useRef } from "react";
import { Card, CardHeader, CardTitle } from "../lightswind/card";
import ProfessionalProfile from "./SkillCategory";
import { portfolioData } from "@/lib/portfolioData";
import { MapPin, GraduationCap } from "lucide-react";
import { gsap, SplitText, useGSAP, ScrollTrigger } from "@/lib/gsap";

const EducationSectionComponent = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const iconRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);

  useGSAP(
    () => {
      if (!sectionRef.current) return;

      const mm = gsap.matchMedia();

      // ═══════════════════════════════════════════════════════════════════
      // DESKTOP: 3D perspective card lifts, orchestrated heading,
      // decorative line grow
      // ═══════════════════════════════════════════════════════════════════
      mm.add(
        "(min-width: 768px) and (prefers-reduced-motion: no-preference)",
        () => {
          const cleanups: (() => void)[] = [];
          const section = sectionRef.current!;

          // ─── Heading orchestration: Icon spring + SplitText chars ───
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
                start: "top 78%",
                end: "top 55%",
                scrub: 1,
              },
            });
          }

          if (
            headingRef.current &&
            headingRef.current.textContent?.trim()
          ) {
            const headingSplit = new SplitText(headingRef.current, {
              type: "chars",
              charsClass: "gsap-edu-heading-char",
              mask: "chars",
            });

            headingSplit.chars.forEach((char: Element) => {
              (char as HTMLElement).style.display = "inline-block";
            });

            gsap.set(headingSplit.chars, { yPercent: 120, opacity: 0 });

            gsap.to(headingSplit.chars, {
              yPercent: 0,
              opacity: 1,
              stagger: { each: 0.04, from: "start" },
              duration: 0.8,
              ease: "smooth.out",
              scrollTrigger: {
                trigger: section,
                start: "top 75%",
                end: "top 48%",
                scrub: 1,
              },
            });

            cleanups.push(() => headingSplit.revert());
          }

          // ─── Decorative gradient line grows from left ──────────────
          const decorLine =
            section.querySelector<HTMLElement>(".edu-decor-line");
          if (decorLine) {
            gsap.set(decorLine, {
              scaleX: 0,
              transformOrigin: "left center",
            });

            gsap.to(decorLine, {
              scaleX: 1,
              duration: 0.6,
              ease: "smooth.out",
              scrollTrigger: {
                trigger: section,
                start: "top 70%",
                end: "top 45%",
                scrub: 1,
              },
            });
          }

          // ─── Education cards: 3D perspective lift ──────────────────
          // Each card starts tilted back as if lying on a table,
          // then lifts to face the viewer on scroll
          const eduCards =
            section.querySelectorAll<HTMLElement>(".edu-card");

          eduCards.forEach((card, i) => {
            gsap.set(card, {
              transformPerspective: 1000,
              transformOrigin: "center bottom",
              willChange: "transform, opacity",
            });

            gsap.fromTo(
              card,
              {
                rotateX: -12,
                rotateY: i % 2 === 0 ? -3 : 3,
                y: 70,
                scale: 0.92,
                opacity: 0,
              },
              {
                rotateX: 0,
                rotateY: 0,
                y: 0,
                scale: 1,
                opacity: 1,
                duration: 1,
                ease: "smooth.out",
                scrollTrigger: {
                  trigger: card,
                  start: "top 92%",
                  end: "top 58%",
                  scrub: 1,
                  onLeave: () =>
                    gsap.set(card, { willChange: "auto" }),
                  onEnterBack: () =>
                    gsap.set(card, {
                      willChange: "transform, opacity",
                    }),
                },
              }
            );

            // Card inner content stagger (title + details)
            const cardInner = card.querySelectorAll<HTMLElement>(
              ".edu-card-title, .edu-card-detail"
            );
            if (cardInner.length) {
              gsap.fromTo(
                cardInner,
                { y: 15, opacity: 0 },
                {
                  y: 0,
                  opacity: 1,
                  stagger: 0.08,
                  duration: 0.5,
                  ease: "smooth.out",
                  scrollTrigger: {
                    trigger: card,
                    start: "top 85%",
                    end: "top 55%",
                    scrub: 1,
                  },
                }
              );
            }
          });

          // ─── Scroll exit: Education → Career transition ────────
          // The edu-top area (heading + cards) recedes as user scrolls
          // past, creating depth handoff to the Career section below
          const exitScrollTriggers: ScrollTrigger[] = [];
          const eduTop =
            section.querySelector<HTMLElement>(".edu-top-content");
          if (eduTop) {
            const exitTween = gsap.to(eduTop, {
              yPercent: -10,
              opacity: 0.12,
              filter: "blur(3px)",
              ease: "none",
              scrollTrigger: {
                trigger: eduTop,
                start: "bottom 60%",
                end: "bottom 5%",
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
            if (eduTop) {
              gsap.set(eduTop, { yPercent: 0, opacity: 1, filter: "none", clearProps: "filter" });
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

          // ─── Heading group: clipPath reveal from bottom ───
          const headingGroup = section.querySelector<HTMLElement>(".edu-heading-group");
          if (headingGroup) {
            gsap.fromTo(
              headingGroup,
              { clipPath: "inset(100% 0 0 0)", opacity: 1 },
              {
                clipPath: "inset(0% 0 0 0)", duration: 0.5, ease: "reveal",
                scrollTrigger: { trigger: headingGroup, start: "top 90%", toggleActions: "play reverse play reverse" },
                onComplete: () => { gsap.set(headingGroup, { clearProps: "clipPath" }); },
              }
            );
          }

          // ─── Decorative line: scaleX grow from left (was not animated) ───
          const decorLine = section.querySelector<HTMLElement>(".edu-decor-line");
          if (decorLine) {
            gsap.fromTo(
              decorLine,
              { scaleX: 0, transformOrigin: "left center" },
              {
                scaleX: 1, duration: 0.5, ease: "smooth.out",
                scrollTrigger: { trigger: decorLine, start: "top 92%", toggleActions: "play reverse play reverse" },
              }
            );
          }

          // ─── Cards: Alternate slide direction with light rotateY ───
          const eduCards = section.querySelectorAll<HTMLElement>(".edu-card");
          eduCards.forEach((card, i) => {
            const isOdd = i % 2 !== 0;
            gsap.fromTo(
              card,
              {
                opacity: 0, x: isOdd ? 30 : -30, rotateY: isOdd ? 5 : -5,
                filter: "blur(3px)", transformPerspective: 800,
              },
              {
                opacity: 1, x: 0, rotateY: 0, filter: "blur(0px)", duration: 0.6, ease: "smooth.out",
                scrollTrigger: { trigger: card, start: "top 90%", toggleActions: "play reverse play reverse" },
                onComplete: () => { gsap.set(card, { clearProps: "filter,transform" }); },
              }
            );
          });
        }
      );

      // ═══════════════════════════════════════════════════════════════════
      // REDUCED MOTION: Instant visibility
      // ═══════════════════════════════════════════════════════════════════
      mm.add("(prefers-reduced-motion: reduce)", () => {
        const allEls = sectionRef.current!.querySelectorAll<HTMLElement>(
          ".edu-heading-group, .edu-card, .edu-decor-line"
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

  return (
    <section
      ref={sectionRef}
      id="education"
      className="text-foreground max-w-7xl mx-auto w-full px-4 sm:px-6 py-12 sm:py-16 md:py-20 space-y-6 sm:space-y-10 min-h-screen flex flex-col justify-center"
    >
      {/* Education */}
      <div className="edu-top-content">
        <div className="edu-heading-group flex items-baseline gap-4 mb-6">
          <div ref={iconRef}>
            <GraduationCap className="w-8 h-8 md:w-10 md:h-10 lg:w-12 lg:h-12 text-primary flex-shrink-0 mt-1 md:mt-1.5 lg:mt-2" />
          </div>
          <h2
            ref={headingRef}
            className="text-3xl md:text-4xl lg:text-5xl font-semibold text-foreground leading-relaxed"
          >
            Education
          </h2>
        </div>

        {/* Decorative gradient line */}
        <div className="edu-decor-line h-px mb-8 bg-gradient-to-r from-primary/60 via-primary/20 to-transparent" />

        <div className="grid grid-cols-1 md:grid-cols-1 gap-4 sm:gap-8">
          {portfolioData.education.map((edu, index) => (
            <Card key={index} className="edu-card">
              <CardHeader>
                <CardTitle className="edu-card-title">
                  {edu.degree}
                </CardTitle>
                <p className="edu-card-detail text-sm text-muted-foreground flex items-center gap-1">
                  <MapPin className="w-4 h-4" />
                  {edu.link ? (
                    <>
                      <a
                        href={edu.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:text-foreground hover:underline transition-colors"
                      >
                        {edu.institution}
                      </a>
                      <span> : {edu.period}</span>
                    </>
                  ) : (
                    <span>
                      {edu.institution} : {edu.period}
                    </span>
                  )}
                </p>
              </CardHeader>
            </Card>
          ))}
        </div>
      </div>

      <ProfessionalProfile />
    </section>
  );
};

export const EducationSection = memo(EducationSectionComponent);
