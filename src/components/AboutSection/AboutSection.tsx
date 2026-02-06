import { memo, useRef } from "react";
import { User } from "lucide-react";
import { gsap, SplitText, useGSAP, ScrollTrigger } from "@/lib/gsap";

const ABOUT_TEXTS = [
  "I'm a developer who enjoys turning ideas into working software. I focus on writing clean, maintainable code and building things that people actually find useful.",
  "When I'm not coding, I'm usually learning something new or exploring different ways to solve problems. I believe good software comes from understanding the problem first, then finding the right solution—not the other way around.",
  "I'm always open to interesting projects and conversations. If you'd like to work together or just chat about technology, feel free to reach out.",
] as const;

const CONTAINER_CLASSES =
  "text-foreground max-w-7xl mx-auto w-full px-4 sm:px-6 py-12 sm:py-16 md:py-20 space-y-8 sm:space-y-10 min-h-screen flex flex-col justify-center";
const HEADER_CLASSES = "flex items-center gap-4 mb-4";
const ICON_CLASSES =
  "w-8 h-8 md:w-10 md:h-10 lg:w-12 lg:h-12 text-primary flex-shrink-0";
const CONTENT_CLASSES =
  "space-y-6 sm:space-y-8 text-muted-foreground max-w-3xl";

const AboutSectionComponent = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const iconRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);

  useGSAP(
    () => {
      if (!sectionRef.current) return;

      const mm = gsap.matchMedia();

      // ═══════════════════════════════════════════════════════════════════
      // DESKTOP: Word-by-word opacity scrub on paragraphs,
      // orchestrated heading reveal with icon
      // ═══════════════════════════════════════════════════════════════════
      mm.add(
        "(min-width: 768px) and (prefers-reduced-motion: no-preference)",
        () => {
          const cleanups: (() => void)[] = [];

          // ─── Heading: Icon scale-in + text masked word reveal ──────
          if (iconRef.current) {
            gsap.set(iconRef.current, { scale: 0, rotation: -180, opacity: 0 });

            gsap.to(iconRef.current, {
              scale: 1,
              rotation: 0,
              opacity: 1,
              duration: 0.6,
              ease: "spring",
              scrollTrigger: {
                trigger: sectionRef.current,
                start: "top 75%",
                end: "top 50%",
                scrub: 1,
              },
            });
          }

          if (headingRef.current && headingRef.current.textContent?.trim()) {
            const headingSplit = new SplitText(headingRef.current, {
              type: "chars",
              charsClass: "gsap-heading-char",
              mask: "chars",
            });

            headingSplit.chars.forEach((char: Element) => {
              (char as HTMLElement).style.display = "inline-block";
            });

            gsap.set(headingSplit.chars, { yPercent: 110, opacity: 0 });

            gsap.to(headingSplit.chars, {
              yPercent: 0,
              opacity: 1,
              stagger: { each: 0.04, from: "start" },
              duration: 0.8,
              ease: "smooth.out",
              scrollTrigger: {
                trigger: sectionRef.current,
                start: "top 72%",
                end: "top 45%",
                scrub: 1,
              },
            });

            cleanups.push(() => headingSplit.revert());
          }

          // ─── Paragraphs: Word-by-word opacity scrub ─────────────
          // Each word starts dim and lights up as user scrolls through,
          // creating a "reading spotlight" effect
          const paragraphs = sectionRef.current!.querySelectorAll<HTMLElement>(
            ".about-paragraph"
          );

          paragraphs.forEach((p) => {
            if (!p.textContent?.trim()) return;

            const split = new SplitText(p, {
              type: "words",
              wordsClass: "gsap-dim-word",
            });

            split.words.forEach((word: Element) => {
              (word as HTMLElement).style.display = "inline-block";
            });

            // All words start dim
            gsap.set(split.words, { opacity: 0.15 });

            // Words light up one by one as user scrolls
            gsap.to(split.words, {
              opacity: 1,
              stagger: 0.1,
              ease: "none",
              scrollTrigger: {
                trigger: p,
                start: "top 80%",
                end: "bottom 30%",
                scrub: true,
              },
            });

            cleanups.push(() => split.revert());
          });

          // ─── Scroll exit: About → Education transition ─────────
          // Content recedes with subtle scale + blur as user scrolls past,
          // creating depth-of-field handoff to the next section
          const section = sectionRef.current!;
          const contentWrapper = section.querySelector<HTMLElement>(".about-content");
          const headingWrapper = section.querySelector<HTMLElement>(".about-heading");

          // Store ScrollTrigger instances so we can kill them during Tour
          const exitScrollTriggers: ScrollTrigger[] = [];

          if (contentWrapper) {
            const contentTween = gsap.to(contentWrapper, {
              yPercent: -12,
              opacity: 0.15,
              filter: "blur(3px)",
              ease: "none",
              scrollTrigger: {
                trigger: section,
                start: "bottom 65%",
                end: "bottom 10%",
                scrub: true,
              },
            });
            if (contentTween.scrollTrigger) {
              exitScrollTriggers.push(contentTween.scrollTrigger);
            }
          }

          if (headingWrapper) {
            const headingTween = gsap.to(headingWrapper, {
              yPercent: -20,
              opacity: 0,
              filter: "blur(2px)",
              ease: "none",
              scrollTrigger: {
                trigger: section,
                start: "bottom 70%",
                end: "bottom 15%",
                scrub: true,
              },
            });
            if (headingTween.scrollTrigger) {
              exitScrollTriggers.push(headingTween.scrollTrigger);
            }
          }

          // ─── Tour event handlers: Disable exit animations during tour ─────
          const handleTourStart = () => {
            exitScrollTriggers.forEach((st) => st.disable());
            // Reset elements to fully visible state
            if (contentWrapper) {
              gsap.set(contentWrapper, { yPercent: 0, opacity: 1, filter: "none", clearProps: "filter" });
            }
            if (headingWrapper) {
              gsap.set(headingWrapper, { yPercent: 0, opacity: 1, filter: "none", clearProps: "filter" });
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
      // MOBILE: Simple fade-in cascade
      // ═══════════════════════════════════════════════════════════════════
      mm.add(
        "(max-width: 767px) and (prefers-reduced-motion: no-preference)",
        () => {
          const allEls = sectionRef.current!.querySelectorAll<HTMLElement>(
            ".about-paragraph, .about-heading"
          );

          allEls.forEach((el, i) => {
            gsap.fromTo(
              el,
              { opacity: 0, y: 25 },
              {
                opacity: 1,
                y: 0,
                duration: 0.6,
                ease: "smooth.out",
                scrollTrigger: {
                  trigger: el,
                  start: "top 88%",
                  toggleActions: "play reverse play reverse",
                },
                delay: i * 0.08,
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
          ".about-paragraph, .about-heading, .about-icon"
        );
        allEls.forEach((el) => {
          gsap.set(el, { opacity: 1, clearProps: "transform,filter" });
        });
        if (iconRef.current) {
          gsap.set(iconRef.current, { opacity: 1, clearProps: "transform" });
        }
      });
    },
    { scope: sectionRef }
  );

  return (
    <div ref={sectionRef} id="about" className={CONTAINER_CLASSES}>
      <div className={`${HEADER_CLASSES} about-heading`}>
        <div ref={iconRef} className="about-icon">
          <User className={ICON_CLASSES} />
        </div>
        <h2
          ref={headingRef}
          className="text-3xl md:text-4xl lg:text-5xl font-semibold text-foreground leading-relaxed"
        >
          About Me
        </h2>
      </div>

      <div className={`${CONTENT_CLASSES} about-content`}>
        {ABOUT_TEXTS.map((text, index) => (
          <p
            key={`about-paragraph-${index}`}
            className="about-paragraph font-bold text-xl py-3 leading-relaxed"
          >
            {text}
          </p>
        ))}
      </div>
    </div>
  );
};

export const AboutSection = memo(AboutSectionComponent);
