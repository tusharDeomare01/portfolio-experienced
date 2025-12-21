import { useEffect, useRef, useState } from "react";
import { TypingText } from "../lightswind/typing-text";
import { Button } from "../lightswind/button";
import { ScrollReveal } from "../lightswind/scroll-reveal";
import { ArrowDown, Sparkles, Mail } from "lucide-react";

export const HeroSection = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [leftSectionVisible, setLeftSectionVisible] = useState(false);
  const [rightSectionVisible, setRightSectionVisible] = useState(false);
  const [hasHoveredEmail, setHasHoveredEmail] = useState(false);
  const [isEmailHovered, setIsEmailHovered] = useState(false);
  const heroRef = useRef<HTMLDivElement>(null);
  const leftSectionRef = useRef<HTMLDivElement>(null);
  const rightSectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Main hero section fade in - trigger immediately with triple RAF for ultra-smoothness
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setIsVisible(true);
        });
      });
    });

    // Intersection Observer for left section
    const leftObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            // Triple RAF for ultra-smooth animation trigger
            requestAnimationFrame(() => {
              requestAnimationFrame(() => {
                requestAnimationFrame(() => {
                  setLeftSectionVisible(true);
                });
              });
            });
            if (leftSectionRef.current) {
              leftObserver.unobserve(leftSectionRef.current);
            }
          }
        });
      },
      { threshold: 0.01, rootMargin: '0px 0px -20px 0px' }
    );

    // Intersection Observer for right section
    const rightObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            // Triple RAF for ultra-smooth animation trigger
            requestAnimationFrame(() => {
              requestAnimationFrame(() => {
                requestAnimationFrame(() => {
                  setRightSectionVisible(true);
                });
              });
            });
            if (rightSectionRef.current) {
              rightObserver.unobserve(rightSectionRef.current);
            }
          }
        });
      },
      { threshold: 0.01, rootMargin: '0px 0px -20px 0px' }
    );

    // Observe elements immediately - refs should be ready
    const observeTimer = setTimeout(() => {
      if (leftSectionRef.current) {
        leftObserver.observe(leftSectionRef.current);
      }
      if (rightSectionRef.current) {
        rightObserver.observe(rightSectionRef.current);
      }
    }, 50);

    return () => {
      clearTimeout(observeTimer);
      if (leftSectionRef.current) {
        leftObserver.unobserve(leftSectionRef.current);
      }
      if (rightSectionRef.current) {
        rightObserver.unobserve(rightSectionRef.current);
      }
    };
  }, []);

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      const offset = 80;
      const elementPosition = el.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
    }
  };

  return (
    <>
      <style>{`
        /* Premium easing curves - advanced spring physics */
        :root {
          --ease-out-ultra: cubic-bezier(0.19, 1, 0.22, 1);
          --ease-out-smooth: cubic-bezier(0.16, 1, 0.3, 1);
          --ease-out-spring: cubic-bezier(0.34, 1.56, 0.64, 1);
          --ease-out-spring-soft: cubic-bezier(0.25, 1.46, 0.45, 1);
          --ease-out-bounce: cubic-bezier(0.68, -0.55, 0.265, 1.55);
          --ease-out-fast: cubic-bezier(0.4, 0, 0.2, 1);
          --ease-in-out-smooth: cubic-bezier(0.4, 0, 0.2, 1);
        }

        /* Multi-step blur keyframes for ultra-smooth transitions */
        @keyframes blurFadeIn {
          0% {
            opacity: 0;
            filter: blur(8px);
          }
          40% {
            opacity: 0.6;
            filter: blur(4px);
          }
          70% {
            opacity: 0.85;
            filter: blur(2px);
          }
          100% {
            opacity: 1;
            filter: blur(0px);
          }
        }

        @keyframes slideUpSpring {
          0% {
            transform: translate3d(0, 50px, 0) scale(0.96);
            opacity: 0;
          }
          60% {
            transform: translate3d(0, -3px, 0) scale(1.01);
            opacity: 0.9;
          }
          100% {
            transform: translate3d(0, 0, 0) scale(1);
            opacity: 1;
          }
        }

        @keyframes slideUpSpringSmall {
          0% {
            transform: translate3d(0, 24px, 0) scale(0.94);
            opacity: 0;
          }
          50% {
            transform: translate3d(0, -2px, 0) scale(1.01);
            opacity: 0.8;
          }
          100% {
            transform: translate3d(0, 0, 0) scale(1);
            opacity: 1;
          }
        }

        @keyframes scaleRotateSpring {
          0% {
            transform: translate3d(0, 0, 0) scale(0.7) rotate(-3deg);
            opacity: 0;
          }
          50% {
            transform: translate3d(0, 0, 0) scale(1.05) rotate(1deg);
            opacity: 0.7;
          }
          100% {
            transform: translate3d(0, 0, 0) scale(1) rotate(0deg);
            opacity: 1;
          }
        }

        .hero-fade-in {
          opacity: 0;
          transition: opacity 1s var(--ease-out-ultra);
        }

        .hero-fade-in.visible {
          opacity: 1;
        }

        .hero-left-section {
          opacity: 0;
          transform: translate3d(0, 50px, 0) scale(0.96);
          filter: blur(8px);
          will-change: opacity, transform, filter;
          backface-visibility: hidden;
          perspective: 1000px;
          transform-origin: center center;
        }

        .hero-left-section.visible {
          animation: slideUpSpring 2.2s var(--ease-out-spring-soft) forwards,
                     blurFadeIn 2s var(--ease-out-smooth) forwards;
        }

        .hero-title {
          opacity: 0;
          transform: translate3d(0, 24px, 0) scale(0.94);
          filter: blur(6px);
          will-change: opacity, transform, filter;
          backface-visibility: hidden;
          transform-origin: left center;
        }

        .hero-title.visible {
          animation: slideUpSpringSmall 1.2s var(--ease-out-spring-soft) 0.15s forwards,
                     blurFadeIn 1s var(--ease-out-smooth) 0.2s forwards;
        }

        .hero-subtitle {
          opacity: 0;
          transform: translate3d(0, 22px, 0) scale(0.95);
          filter: blur(5px);
          will-change: opacity, transform, filter;
          backface-visibility: hidden;
          transform-origin: left center;
        }

        .hero-subtitle.visible {
          animation: slideUpSpringSmall 1.1s var(--ease-out-spring-soft) 0.45s forwards,
                     blurFadeIn 0.9s var(--ease-out-smooth) 0.5s forwards;
        }

        .hero-email {
          opacity: 0;
          transform: translate3d(0, 20px, 0) scale(0.96);
          filter: blur(5px);
          will-change: opacity, transform, filter;
          backface-visibility: hidden;
          transform-origin: left center;
        }

        .hero-email.visible {
          animation: slideUpSpringSmall 1s var(--ease-out-spring-soft) 0.6s forwards,
                     blurFadeIn 0.85s var(--ease-out-smooth) 0.65s forwards;
        }

        .hero-buttons {
          opacity: 0;
          transform: translate3d(0, 20px, 0) scale(0.96);
          filter: blur(5px);
          will-change: opacity, transform, filter;
          backface-visibility: hidden;
          transform-origin: left center;
        }

        .hero-buttons.visible {
          animation: slideUpSpringSmall 1s var(--ease-out-spring-soft) 0.7s forwards,
                     blurFadeIn 0.85s var(--ease-out-smooth) 0.75s forwards;
        }

        .hero-right-section {
          opacity: 0;
          transform: translate3d(0, 0, 0) scale(0.7) rotate(-3deg);
          filter: blur(12px);
          will-change: opacity, transform, filter;
          backface-visibility: hidden;
          perspective: 1000px;
          transform-origin: center center;
        }

        .hero-right-section.visible {
          animation: scaleRotateSpring 1.6s var(--ease-out-spring-soft) 0.35s forwards,
                     blurFadeIn 1.2s var(--ease-out-smooth) 0.4s forwards;
        }

        .hero-button-wrapper {
          will-change: transform;
          transition: transform 0.3s var(--ease-out-spring-soft);
          transform: translateZ(0);
          position: relative;
        }

        .hero-button-wrapper::before {
          content: '';
          position: absolute;
          inset: -2px;
          border-radius: inherit;
          opacity: 0;
          background: linear-gradient(135deg, rgba(236, 72, 153, 0.3), rgba(219, 39, 119, 0.3));
          filter: blur(8px);
          transition: opacity 0.3s var(--ease-out-smooth);
          z-index: -1;
        }

        .hero-button-wrapper:hover {
          transform: translateZ(0) scale(1.08) translateY(-2px);
        }

        .hero-button-wrapper:hover::before {
          opacity: 1;
        }

        .hero-button-wrapper:active {
          transform: translateZ(0) scale(0.96) translateY(0px);
        }

        .hero-email-link {
          will-change: transform;
          transition: transform 0.3s var(--ease-out-spring-soft);
          transform: translateZ(0);
          position: relative;
        }

        .hero-email-link:hover {
          transform: translateZ(0) scale(1.08) translateY(-1px);
        }

        .hero-email-link:active {
          transform: translateZ(0) scale(0.96);
        }

        /* Stagger animation for button children */
        .hero-buttons.visible .hero-button-wrapper {
          opacity: 0;
          transform: translate3d(0, 15px, 0) scale(0.98);
        }

        .hero-buttons.visible .hero-button-wrapper:nth-child(1) {
          animation: slideUpSpringSmall 0.8s var(--ease-out-spring-soft) 0.85s forwards;
        }

        .hero-buttons.visible .hero-button-wrapper:nth-child(2) {
          animation: slideUpSpringSmall 0.8s var(--ease-out-spring-soft) 0.95s forwards;
        }

        /* Optimize performance for animations */
        @media (prefers-reduced-motion: reduce) {
          .hero-left-section,
          .hero-title,
          .hero-subtitle,
          .hero-email,
          .hero-buttons,
          .hero-right-section {
            animation: none !important;
            transition: opacity 0.3s ease-out;
            transform: none !important;
            filter: none !important;
          }
        }
      `}</style>
      <div
        ref={heroRef}
        id="hero"
        className={`text-foreground bg-transparent flex flex-col md:flex-row 
        items-center justify-center max-w-7xl mx-auto w-full min-h-screen hero-fade-in ${isVisible ? "visible" : ""}`}
      >
        {/* Left Section */}
        <div
          ref={leftSectionRef}
          className={`flex-1 space-y-6 p-6 text-left md:text-left flex flex-col justify-center hero-left-section ${leftSectionVisible ? "visible" : ""}`}
        >
          <h1
            className={`text-3xl sm:text-3xl md:text-5xl font-bold hero-title ${leftSectionVisible ? "visible" : ""}`}
          >
            <TypingText
              delay={0.5}
              duration={2.5}
              fontSize="text-3xl sm:text-3xl md:text-5xl"
              fontWeight="font-extrabold"
              color="text-foreground"
              letterSpacing="tracking-wider"
              align="left"
            >
              Tushar Deomare
            </TypingText>
            <ScrollReveal
              size="sm"
              align="left"
              variant="accent"
              enableBlur={true}
              blurStrength={5}
              baseRotation={0}
              containerClassName="mt-1"
              textClassName="text-xs sm:text-sm text-pink-500 font-semibold block"
            >
              He / Him
            </ScrollReveal>
          </h1>

          {/* Key Highlight - Concise and Impactful */}
          <div
            className={`flex items-center gap-2 text-lg sm:text-xl md:text-2xl text-muted-foreground hero-subtitle ${leftSectionVisible ? "visible" : ""}`}
          >
            <Sparkles className="w-5 h-5 sm:w-6 sm:h-6 text-pink-500" />
            <ScrollReveal
              size="md"
              align="left"
              variant="muted"
              enableBlur={true}
              blurStrength={5}
              baseRotation={0}
              containerClassName="inline"
              textClassName="font-medium"
            >
              Building scalable solutions with 2+ years of expertise
            </ScrollReveal>
          </div>

          {/* Email Contact */}
          <div
            className={`flex items-center gap-2 mt-4 relative hero-email ${leftSectionVisible ? "visible" : ""}`}
          >
            <a
              href="mailto:tdeomare1@gmail.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hero-email-link flex items-center gap-2 text-sm sm:text-base text-muted-foreground hover:text-pink-500 transition-colors duration-300 group relative"
              onMouseEnter={() => {
                setHasHoveredEmail(true);
                setIsEmailHovered(true);
              }}
              onMouseLeave={() => setIsEmailHovered(false)}
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
                    ? (isEmailHovered ? 'opacity-100' : 'opacity-0')
                    : 'opacity-100'
                }`}
              >
                Click to compose email message
                <span className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-full w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900 dark:border-t-gray-100"></span>
              </span>
            </a>
          </div>

          {/* CTA Button */}
          <div
            className={`flex flex-wrap gap-4 mt-6 hero-buttons ${leftSectionVisible ? "visible" : ""}`}
          >
            <div className="hero-button-wrapper">
              <Button
                onClick={() => scrollToSection("projects")}
                className="bg-pink-500 hover:bg-pink-600 text-white font-semibold px-6 py-3 rounded-lg transition-all duration-300 flex items-center gap-2 group"
              >
                View My Work
                <ArrowDown className="w-4 h-4 group-hover:translate-y-1 transition-transform" />
              </Button>
            </div>
            <div className="hero-button-wrapper">
              <Button
                onClick={() => scrollToSection("contact")}
                variant="outline"
                className="border-2 border-pink-500 text-pink-500 hover:bg-pink-500 hover:text-pink-600 font-semibold px-6 py-3 rounded-lg transition-all duration-300"
              >
                Get In Touch
              </Button>
            </div>
          </div>
        </div>

        {/* Right Section */}
        <div
          ref={rightSectionRef}
          className={`flex-1 flex justify-center p-6 hero-right-section ${rightSectionVisible ? "visible" : ""}`}
        >
          <div className="w-64 h-64 rounded-full overflow-hidden shadow-lg">
            <img
              src="/Tushar_Deomare.jpg"
              alt="Tushar Deomare"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </div>
    </>
  );
};
