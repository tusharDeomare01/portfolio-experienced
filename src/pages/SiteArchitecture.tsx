import { useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { gsap, SplitText, useGSAP } from "@/lib/gsap";
import { useGSAPRouteAnimation } from "@/hooks/useGSAPRouteAnimation";
import { useGSAPScrollRestoration } from "@/hooks/useGSAPScrollRestoration";
import { ArrowLeft, Network } from "lucide-react";
import { ShareButton } from "@/components/Share";
import { getCurrentUrl } from "@/lib/shareUtils";
import { SiteArchitectureTree } from "@/components/SiteArchitecture/SiteArchitectureTree";

const SiteArchitecture = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { saveScrollPosition } = useGSAPScrollRestoration();

  const pageRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const iconRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // ─── GSAP Page Entrance Animations ─────────────────────────────────
  useGSAP(
    () => {
      const page = pageRef.current;
      if (!page) return;

      const mm = gsap.matchMedia();

      // ═══ DESKTOP ═══════════════════════════════════════════════════
      mm.add(
        "(min-width: 768px) and (prefers-reduced-motion: no-preference)",
        () => {
          const cleanups: (() => void)[] = [];
          const tl = gsap.timeline({ delay: 0.15 });

          // Icon: spin-in with elastic
          if (iconRef.current) {
            gsap.set(iconRef.current, {
              scale: 0,
              rotation: -360,
              opacity: 0,
              filter: "blur(12px)",
            });
            tl.to(
              iconRef.current,
              {
                scale: 1.1,
                rotation: 10,
                opacity: 1,
                filter: "blur(0px)",
                duration: 0.5,
                ease: "power4.out",
              },
              0
            );
            tl.to(
              iconRef.current,
              {
                scale: 1,
                rotation: 0,
                duration: 0.7,
                ease: "elastic.out(1.5, 0.4)",
              },
              0.4
            );
          }

          // Title: SplitText 3D char wave
          if (titleRef.current && titleRef.current.textContent?.trim()) {
            const titleSplit = new SplitText(titleRef.current, {
              type: "chars",
              mask: "chars",
            });

            titleSplit.chars.forEach((char: Element) => {
              (char as HTMLElement).style.display = "inline-block";
              (char as HTMLElement).style.transformStyle = "preserve-3d";
            });

            gsap.set(titleSplit.chars, {
              yPercent: 200,
              opacity: 0,
              rotateX: -90,
              rotateY: gsap.utils.wrap([-20, 20, -15, 15]),
              scale: 0.5,
              transformPerspective: 1200,
              transformOrigin: "center bottom",
            });

            tl.to(
              titleSplit.chars,
              {
                yPercent: 0,
                opacity: 1,
                rotateX: 0,
                rotateY: 0,
                scale: 1,
                duration: 0.9,
                stagger: { each: 0.03, from: "start", ease: "power2.out" },
                ease: "back.out(1.7)",
              },
              0.15
            );

            cleanups.push(() => {
              titleSplit.revert();
            });
          }

          // Subtitle: blur-to-focus + scale
          if (subtitleRef.current) {
            gsap.set(subtitleRef.current, {
              y: 30,
              opacity: 0,
              filter: "blur(12px)",
              scale: 0.85,
            });
            tl.to(
              subtitleRef.current,
              {
                y: 0,
                opacity: 1,
                filter: "blur(0px)",
                scale: 1,
                duration: 0.7,
                ease: "power3.out",
              },
              0.5
            );
          }

          return () => {
            cleanups.forEach((fn) => fn());
          };
        }
      );

      // ═══ MOBILE ════════════════════════════════════════════════════
      mm.add(
        "(max-width: 767px) and (prefers-reduced-motion: no-preference)",
        () => {
          const tl = gsap.timeline({ delay: 0.1 });

          // Icon: spin-in
          if (iconRef.current) {
            gsap.set(iconRef.current, { scale: 0, rotation: -90, opacity: 0 });
            tl.to(
              iconRef.current,
              {
                scale: 1,
                rotation: 0,
                opacity: 1,
                duration: 0.6,
                ease: "spring",
              },
              0
            );
          }

          // Title: clipPath reveal
          if (titleRef.current) {
            gsap.set(titleRef.current, {
              clipPath: "inset(0 100% 0 0)",
              opacity: 0,
            });
            tl.to(
              titleRef.current,
              {
                clipPath: "inset(0 0% 0 0)",
                opacity: 1,
                duration: 0.6,
                ease: "power3.inOut",
                onComplete: () => {
                  gsap.set(titleRef.current, { clearProps: "clipPath" });
                },
              },
              0.15
            );
          }

          // Subtitle: blur-to-focus
          if (subtitleRef.current) {
            gsap.set(subtitleRef.current, {
              opacity: 0,
              filter: "blur(6px)",
              y: 10,
            });
            tl.to(
              subtitleRef.current,
              {
                opacity: 1,
                filter: "blur(0px)",
                y: 0,
                duration: 0.5,
                ease: "smooth.out",
                onComplete: () => {
                  gsap.set(subtitleRef.current, { clearProps: "filter" });
                },
              },
              0.4
            );
          }
        }
      );

      // ═══ REDUCED MOTION ════════════════════════════════════════════
      mm.add("(prefers-reduced-motion: reduce)", () => {
        [iconRef.current, titleRef.current, subtitleRef.current].forEach(
          (el) => {
            if (el)
              gsap.set(el, {
                opacity: 1,
                clearProps: "transform,filter,clipPath",
              });
          }
        );
      });
    },
    { scope: pageRef }
  );

  // Route transition animation
  useGSAPRouteAnimation({
    containerRef: pageRef,
    transitionType: "home-to-project",
    enabled: location.state?.from !== undefined,
  });

  return (
    <div
      ref={pageRef}
      className="min-h-screen bg-transparent relative route-enter-content"
    >
      <div className="relative z-10 max-w-7xl mx-auto px-4 py-8 md:py-12">
        {/* Back Button and Share */}
        <div className="mb-8 flex items-center justify-between flex-wrap gap-3 sm:gap-4 route-enter-child">
          <button
            onClick={(e) => {
              e.preventDefault();
              const splitUrl = window.location.href.split("#");
              if (splitUrl?.includes("home")) {
                const scrollY = saveScrollPosition();
                navigate("/", {
                  state: {
                    scrollTo: "home",
                    scrollY,
                    from: "home-to-home",
                  },
                });
              } else {
                navigate(-1);
              }
            }}
            className="cursor-pointer flex items-center gap-2 text-foreground hover:text-primary transition-colors group touch-manipulation"
          >
            <ArrowLeft
              size={20}
              className="group-hover:-translate-x-1 transition-transform"
            />
            <span className="text-sm sm:text-base">Back</span>
          </button>
          <ShareButton
            shareData={{
              title: "Site Architecture - Tushar Deomare's Portfolio",
              description:
                "Interactive site architecture visualizer with drag-and-drop reordering and GSAP animations.",
              url: getCurrentUrl(),
            }}
            variant="outline"
            size="md"
            showLabel={true}
            position="bottom"
            className="shrink-0 cursor-pointer"
          />
        </div>

        {/* Page Header */}
        <div className="mb-10 md:mb-14 text-center route-enter-child">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div ref={iconRef}>
              <Network className="w-8 h-8 md:w-10 md:h-10 text-primary" />
            </div>
            <h1
              ref={titleRef}
              className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground"
            >
              Site Architecture
            </h1>
          </div>
          <p
            ref={subtitleRef}
            className="text-base md:text-lg text-muted-foreground max-w-2xl mx-auto"
          >
            Interactive visualization of the portfolio's page hierarchy. Click
            nodes to navigate.
          </p>
        </div>

        {/* Tree Visualizer */}
        <div className="route-enter-child">
          <SiteArchitectureTree />
        </div>
      </div>
    </div>
  );
};

export default SiteArchitecture;
