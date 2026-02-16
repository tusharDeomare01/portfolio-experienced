import { useState, useMemo, useCallback, memo, lazy, Suspense, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { selectTheme } from "@/store/hooks";
import { useAppSelector } from "@/store/hooks";
import { Button } from "../lightswind/button";
import { Badge } from "../lightswind/badge";
import {
  ArrowRight,
  Calendar,
  ExternalLink,
  FolderKanban,
  Globe,
  Sparkles,
} from "lucide-react";
import { useIsMobile } from "../hooks/use-mobile";
import { gsap, SplitText, useGSAP, ScrollTrigger } from "@/lib/gsap";

// Lazy load LightRays for performance
const LightRays = lazy(() => import("../reactBits/lightRays"));

// Static constants - moved outside to prevent recreation
const CONTAINER_CLASSES =
  "min-h-screen flex flex-col justify-center !scroll-smooth transition-all duration-400 ease-in animate-fade-in-up";
const SECTION_CLASSES =
  "max-w-7xl mx-auto px-4 sm:px-6 py-12 sm:py-16 md:py-20 w-full !scroll-smooth";
const HEADER_CLASSES = "text-center mb-12 sm:mb-16 md:mb-20";
const TITLE_WRAPPER_CLASSES = "mb-4 flex items-baseline justify-center gap-4";
const ICON_CLASSES =
  "w-10 h-10 md:w-12 md:h-12 lg:w-14 lg:h-14 text-primary flex-shrink-0 mt-1.5 md:mt-2 lg:mt-2.5";
const SUBTITLE_CLASSES = "text-lg font-bold text-muted-foreground";

// CSS keyframes removed — GSAP handles all project card reveals now

// Logo path mapping - pre-computed for performance
const LOGO_PATHS = {
  MarketJD: {
    dark: "/logo-horizontal-dark.svg",
    light: "/logo-horizontal-light.svg",
  },
  LineLeader: {
    dark: "/ll_brandmark.svg",
    light: "/ll_brandmark.svg",
  },
  TechShowcase: {
    dark: "/techshowcase-logo-dark.svg",
    light: "/techshowcase-logo-light.svg",
  },
} as const;

// Static projects data - moved outside to prevent recreation
const PROJECTS_DATA = [
  {
    id: 1,
    title: "MarketJD",
    subtitle:
      "Comprehensive insights platform with 10+ third-party API integrations, advanced authentication, dynamic reporting, and AI-powered automation. Built with modern tech stack.",
    date: "2024 - Present",
    route: "/marketjd",
    technologies: [
      "Next.js",
      "React",
      "TypeScript",
      "Prisma",
      "Next-Auth",
      "Redux Toolkit",
      "Ant Design",
      "Chart.js",
      "MySQL",
      "Tailwind CSS",
    ],
    status: "Active",
    liveUrl: "https://insightsjd.com/auth/signin/client",
  },
  {
    id: 2,
    title: "LineLeader",
    subtitle:
      "Architected report streaming pipeline, MongoDB aggregation optimization, and Agenda.js job queues for a childcare SaaS platform — eliminating server OOM crashes and improving report delivery for organizations with millions of records.",
    date: "Mar 2025 - Present",
    route: "/lineleader",
    technologies: [
      "React",
      "TypeScript",
      "Next.js",
      "MongoDB",
      "AWS S3",
      "AWS Lambda",
      "Agenda.js",
      "Node.js",
    ],
    status: "Active",
    liveUrl: "https://my.discoverchampions.momentpath.com/login/legacy",
  },
  {
    id: 3,
    title: "TechShowcase",
    subtitle:
      "Modern, interactive portfolio website featuring smooth animations, AI-powered assistant, 3D carousel, and responsive design. Built with React, TypeScript, Framer Motion, and advanced UI components.",
    date: "2025 - Present",
    route: "/portfolio",
    technologies: ["React", "TypeScript", "Framer Motion", "Vite"],
    status: "Active",
    badge: "Personal Project",
    liveUrl: "https://tushar-deomare-portfolio.vercel.app/",
  },
] as const;

// Pre-compute static class name combinations - created once, reused
const CLASS_NAMES = {
  logoContainerBase:
    "relative flex-shrink-0 rounded-xl overflow-hidden bg-gradient-to-br from-primary/10 via-background/50 to-background/30 border border-border/40 group-hover:border-primary/60 transition-all duration-500",
  contentBase: "relative flex flex-col gap-6 md:gap-8",
  cardBase:
    "relative group bg-background/80 backdrop-blur-xl border border-border/60 rounded-2xl sm:rounded-3xl overflow-hidden transition-all duration-500 ease-out project-card",
  gradientLeft:
    "absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none",
  gradientRight:
    "absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none",
  cornerLeft:
    "absolute top-0 left-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500",
  cornerRight:
    "absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500",
} as const;

interface ProjectItemProps {
  project: (typeof PROJECTS_DATA)[number];
  index: number;
  isDarkMode: boolean;
  isHovered: boolean;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
  onNavigate: (route: string) => void;
}

// Memoized status badge component - clickable production link
const StatusBadge = memo(
  ({ status, liveUrl }: { status: string; liveUrl: string }) => (
    <div className="absolute top-4 right-4 z-10">
      <a
        href={liveUrl}
        target="_blank"
        rel="noopener noreferrer"
        onClick={(e) => e.stopPropagation()}
        className="group/live"
      >
        <Badge
          variant="success"
          size="sm"
          className="backdrop-blur-md bg-green-500/90 text-white border-0 shadow-lg cursor-pointer hover:bg-green-600 hover:shadow-xl hover:scale-105 transition-all duration-300"
        >
          <span className="relative flex h-2 w-2 mr-1.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
          </span>
          {status}
          <ExternalLink className="w-3 h-3 ml-1.5 opacity-0 group-hover/live:opacity-100 transition-opacity duration-200" />
        </Badge>
      </a>
    </div>
  )
);
StatusBadge.displayName = "StatusBadge";

// Memoized logo display component
const ProjectLogo = memo(
  ({ logoPath, title }: { logoPath: string; title: string }) => (
    <>
      {logoPath ? (
        <div className="w-full h-full flex items-center justify-center p-6 sm:p-8">
          <img
            src={logoPath}
            alt={title}
            loading="lazy"
            decoding="async"
            className="w-full h-full object-contain max-w-full max-h-full transition-transform duration-300 group-hover:scale-105"
          />
        </div>
      ) : (
        <div className="w-full h-full flex items-center justify-center">
          <Sparkles className="w-16 h-16 text-primary/40" />
        </div>
      )}
    </>
  )
);
ProjectLogo.displayName = "ProjectLogo";

const ProjectItem = memo(
  ({
    project,
    index,
    isDarkMode,
    isHovered,
    onMouseEnter,
    onMouseLeave,
    onNavigate,
  }: ProjectItemProps) => {
    const isMobile = useIsMobile();
    const isEven = index % 2 === 0;

    // Pre-compute logo path based on theme
    const logoPath = useMemo(() => {
      const logoConfig = LOGO_PATHS[project.title as keyof typeof LOGO_PATHS];
      return logoConfig ? (isDarkMode ? logoConfig.dark : logoConfig.light) : "";
    }, [project.title, isDarkMode]);

    // Memoize technology badges to prevent recreation
    const technologyBadges = useMemo(
      () =>
        project.technologies.map((tech, techIndex) => (
          <Badge
            key={`${project.id}-tech-${techIndex}`}
            variant="outline"
            size="sm"
            className="text-xs font-medium hover:bg-primary/10 hover:border-primary/50 transition-colors cursor-default project-badge"
          >
            {tech}
          </Badge>
        )),
      [project.id, project.technologies]
    );

    // Memoize style objects - only recreate when dependencies change
    const containerStyle = useMemo(
      () => ({ animationDelay: `${index * 0.1}s` }),
      [index]
    );

    const cardStyle = useMemo(
      () => ({
        animationDelay: `${index * 0.1 + 0.1}s`,
        "--card-offset": isEven ? "-30px" : "30px",
      } as React.CSSProperties),
      [index, isEven]
    );

    // Pre-compute className strings based on state
    const cardClassName = useMemo(
      () =>
        `${CLASS_NAMES.cardBase} ${
          isHovered
            ? "shadow-2xl shadow-primary/20 scale-[1.02] border-primary/40"
            : "shadow-lg"
        }`,
      [isHovered]
    );

    const contentClassName = useMemo(
      () =>
        `${CLASS_NAMES.contentBase} p-6 sm:p-8 md:p-10 ${
          isMobile ? "" : isEven ? "md:flex-row" : "md:flex-row-reverse"
        }`,
      [isMobile, isEven]
    );

    const logoContainerClassName = useMemo(
      () =>
        `${CLASS_NAMES.logoContainerBase} ${
          isMobile
            ? "w-full h-48 sm:h-56"
            : "md:w-80 md:h-64 lg:w-96 lg:h-72"
        }`,
      [isMobile]
    );

    // Select pre-computed gradient class
    const gradientClassName = isEven ? CLASS_NAMES.gradientLeft : CLASS_NAMES.gradientRight;
    const cornerAccentClassName = isEven ? CLASS_NAMES.cornerLeft : CLASS_NAMES.cornerRight;

    // Memoize button click handler
    const handleButtonClick = useCallback(
      () => onNavigate(project.route),
      [onNavigate, project.route]
    );

    return (
      <div
        className="relative w-full mb-8 sm:mb-12 md:mb-16 project-item"
        data-index={index}
        style={containerStyle}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
      >
        {/* LightRays background effect on hover - only on desktop */}
        {!isMobile && isHovered && (
          <Suspense fallback={null}>
            <div className="absolute inset-0 -z-10 opacity-30 pointer-events-none overflow-hidden rounded-2xl">
              <LightRays
                raysOrigin={isEven ? "left" : "right"}
                raysColor="#07eae6"
                raysSpeed={1.5}
                lightSpread={8}
                rayLength={0.6}
                followMouse={true}
                mouseInfluence={0.15}
                noiseAmount={0}
                distortion={0.03}
                fadeDistance={8}
                className="w-full h-full"
              />
            </div>
          </Suspense>
        )}

        <div className={cardClassName} style={cardStyle}>
          {/* Gradient overlay on hover */}
          <div className={gradientClassName} />

          <div className={contentClassName}>
            {/* Logo/Image Section */}
            <div className={`${logoContainerClassName} project-logo-wrap`}>
              <ProjectLogo logoPath={logoPath} title={project.title} />
              <StatusBadge status={project.status} liveUrl={project.liveUrl} />
            </div>

            {/* Content Section */}
            <div className="flex-1 flex flex-col justify-between min-w-0 project-content">
              <div className="space-y-4 sm:space-y-5">
                {/* Title and Date */}
                <div className="space-y-3">
                  <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold leading-tight transition-all duration-300 group-hover:text-primary group-hover:translate-x-1 project-title">
                    {project.title}
                  </h3>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground project-date">
                    <Calendar className="w-4 h-4 flex-shrink-0" />
                    <span className="font-medium">{project.date}</span>
                    {"badge" in project && (
                      <Badge
                        variant="warning"
                        size="sm"
                        className="ml-1"
                      >
                        {project.badge}
                      </Badge>
                    )}
                  </div>
                </div>

                {/* Description */}
                <p className="text-sm sm:text-base text-muted-foreground leading-relaxed line-clamp-3 sm:line-clamp-none project-desc">
                  {project.subtitle}
                </p>

                {/* Technology Tags */}
                <div className="flex flex-wrap gap-2 pt-2 project-badges">
                  {technologyBadges}
                </div>
              </div>

              {/* CTA Buttons */}
              <div className="pt-4 sm:pt-6 flex flex-col sm:flex-row flex-wrap items-center gap-3 project-btn">
                <Button
                  variant="outline"
                  size="lg"
                  onClick={handleButtonClick}
                  className="cursor-pointer w-full sm:w-auto group/btn relative overflow-hidden border-2 hover:border-primary transition-all duration-300 bg-background/50 backdrop-blur-sm"
                >
                  <span className="relative z-10 flex items-center justify-center gap-2 font-semibold">
                    Explore Project
                    <ArrowRight
                      className={`w-4 h-4 transition-transform duration-200 ${
                        isHovered ? "translate-x-1" : "translate-x-0"
                      }`}
                    />
                  </span>
                  <div className="absolute inset-0 bg-primary/10 -translate-x-full group-hover/btn:translate-x-0 transition-transform duration-300" />
                </Button>
                <a
                  href={project.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="group/globe inline-flex items-center justify-center w-10 h-10 rounded-full border-2 border-border hover:border-emerald-500 hover:bg-emerald-500/10 transition-all duration-300 cursor-pointer"
                  aria-label="View live production site"
                >
                  <Globe className="w-4 h-4 text-muted-foreground group-hover/globe:text-emerald-500 transition-colors duration-200" />
                </a>
              </div>
            </div>
          </div>

          {/* Decorative corner accent */}
          <div className={cornerAccentClassName} />
        </div>

        {/* Timeline connector line (hidden on mobile) */}
        {!isMobile && index < PROJECTS_DATA.length - 1 && (
          <div className="absolute left-1/2 -translate-x-1/2 w-0.5 h-8 sm:h-12 bg-gradient-to-b from-primary/40 via-primary/20 to-transparent" />
        )}
      </div>
    );
  },
  (prevProps, nextProps) => {
    // Optimized comparison - only check what changes
    return (
      prevProps.project.id === nextProps.project.id &&
      prevProps.index === nextProps.index &&
      prevProps.isDarkMode === nextProps.isDarkMode &&
      prevProps.isHovered === nextProps.isHovered
    );
  }
);

ProjectItem.displayName = "ProjectItem";

// ============================================================================
// MAIN PROJECTS SECTION COMPONENT
// ============================================================================

const ProjectsSectionComponent = () => {
  const navigate = useNavigate();
  const [hoveredProject, setHoveredProject] = useState<number | null>(null);
  const theme = useAppSelector(selectTheme);
  const isMobile = useIsMobile();
  const sectionRef = useRef<HTMLDivElement>(null);
  const iconRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);

  // ═══════════════════════════════════════════════════════════════════
  // GSAP: ULTRA-DRAMATIC CINEMATIC ENTRANCE SYSTEM
  // Aggressive, jaw-dropping animations with maximum attention to detail
  // ═══════════════════════════════════════════════════════════════════
  useGSAP(
    () => {
      if (!sectionRef.current) return;

      const mm = gsap.matchMedia();

      // ═══════════════════════════════════════════════════════════════════
      // DESKTOP: CINEMATIC ORCHESTRATION
      // - Explosive icon entrance with dramatic overshoot
      // - 3D perspective card sweeps from far off-screen
      // - Staggered internal reveals with blur-to-sharp transitions
      // - Premium elastic/back easing throughout
      // ═══════════════════════════════════════════════════════════════════
      mm.add(
        "(min-width: 768px) and (prefers-reduced-motion: no-preference)",
        () => {
          const cleanups: (() => void)[] = [];
          const section = sectionRef.current!;

          // ─────────────────────────────────────────────────────────────
          // PHASE 1: HEADER EXPLOSION SEQUENCE
          // Icon bursts in → Chars cascade with 3D flip → Subtitle fades
          // ─────────────────────────────────────────────────────────────
          const headerTl = gsap.timeline({
            scrollTrigger: {
              trigger: section,
              start: "top 65%",
              toggleActions: "play none none reverse",
            },
          });

          // ─── Icon: Explosive scale + rotation burst ───────────────
          if (iconRef.current) {
            gsap.set(iconRef.current, {
              scale: 0,
              rotation: -540, // 1.5 full rotations
              opacity: 0,
              filter: "blur(20px)",
              transformOrigin: "center center",
            });

            headerTl.to(
              iconRef.current,
              {
                scale: 1.15, // Overshoot first
                rotation: 15,
                opacity: 1,
                filter: "blur(0px)",
                duration: 0.5,
                ease: "power4.out",
              },
              0
            );

            // Settle back with elastic bounce
            headerTl.to(
              iconRef.current,
              {
                scale: 1,
                rotation: 0,
                duration: 0.8,
                ease: "elastic.out(1.5, 0.4)", // Dramatic overshoot bounce
              },
              0.4
            );
          }

          // ─── Heading: 3D flip chars with perspective ──────────────
          if (headingRef.current && headingRef.current.textContent?.trim()) {
            const headingSplit = new SplitText(headingRef.current, {
              type: "chars",
              charsClass: "gsap-projects-char",
              mask: "chars",
            });

            headingSplit.chars.forEach((char: Element) => {
              const el = char as HTMLElement;
              el.style.display = "inline-block";
              el.style.transformStyle = "preserve-3d";
            });

            gsap.set(headingSplit.chars, {
              yPercent: 200,
              opacity: 0,
              rotateX: -90, // Flipped back in 3D
              rotateY: 25,
              scale: 0.5,
              filter: "blur(12px)",
              transformOrigin: "center bottom",
              transformPerspective: 600,
            });

            headerTl.to(
              headingSplit.chars,
              {
                yPercent: 0,
                opacity: 1,
                rotateX: 0,
                rotateY: 0,
                scale: 1,
                filter: "blur(0px)",
                stagger: {
                  each: 0.06,
                  from: "start",
                  ease: "power2.in", // Accelerating stagger
                },
                duration: 0.9,
                ease: "back.out(2)", // Strong overshoot
              },
              0.15
            );

            cleanups.push(() => headingSplit.revert());
          }

          // ─── Subtitle: Dramatic blur-to-sharp with scale ──────────
          const subtitle = section.querySelector<HTMLElement>(".projects-subtitle");
          if (subtitle) {
            gsap.set(subtitle, {
              y: 50,
              opacity: 0,
              filter: "blur(20px)",
              scale: 0.7,
              letterSpacing: "0.3em",
            });

            headerTl.to(
              subtitle,
              {
                y: 0,
                opacity: 1,
                filter: "blur(0px)",
                scale: 1,
                letterSpacing: "0em",
                duration: 0.8,
                ease: "power3.out",
              },
              0.5
            );
          }

          // ─── Timeline line: Draws from center outward ─────────────
          const timelineLine = section.querySelector<HTMLElement>(
            ".projects-timeline-line"
          );
          if (timelineLine) {
            gsap.set(timelineLine, {
              scaleY: 0,
              transformOrigin: "center center",
              opacity: 0,
              filter: "blur(4px)",
            });

            headerTl.to(
              timelineLine,
              {
                scaleY: 1,
                opacity: 1,
                filter: "blur(0px)",
                duration: 1.5,
                ease: "power2.inOut",
              },
              0.6
            );
          }

          // ─────────────────────────────────────────────────────────────
          // PHASE 2: CINEMATIC CARD ENTRANCES
          // Each card sweeps in from far off-screen with 3D rotation
          // Internal content cascades with staggered blur-to-focus
          // ─────────────────────────────────────────────────────────────
          const projectItems = section.querySelectorAll<HTMLElement>(".project-item");

          projectItems.forEach((item) => {
            const idx = parseInt(item.getAttribute("data-index") || "0", 10);
            const isEven = idx % 2 === 0;
            const card = item.querySelector<HTMLElement>(".project-card");
            const logoContainer = item.querySelector<HTMLElement>(".project-logo-wrap");
            const logoImg = logoContainer?.querySelector<HTMLElement>("img");
            const titleEl = item.querySelector<HTMLElement>(".project-title");
            const dateEl = item.querySelector<HTMLElement>(".project-date");
            const descEl = item.querySelector<HTMLElement>(".project-desc");
            const badgesWrap = item.querySelector<HTMLElement>(".project-badges");
            const btn = item.querySelector<HTMLElement>(".project-btn");

            if (!card) return;

            // ─── Card timeline with dramatic entrance ───────────────
            // toggleActions: "play reverse play reverse" = replay on every scroll enter
            const cardTl = gsap.timeline({
              scrollTrigger: {
                trigger: item,
                start: "top 75%",
                end: "top 20%",
                toggleActions: "play reverse play reverse",
                onEnter: () => {
                  gsap.set(card, { willChange: "transform, opacity, filter" });
                },
                onLeave: () => {
                  gsap.set(card, { willChange: "auto" });
                },
                onEnterBack: () => {
                  gsap.set(card, { willChange: "transform, opacity, filter" });
                },
                onLeaveBack: () => {
                  gsap.set(card, { willChange: "auto" });
                },
              },
            });

            // ─── Card: Ultra-dramatic 3D sweep ──────────────────────
            gsap.set(card, {
              transformPerspective: 1000,
              transformStyle: "preserve-3d",
              transformOrigin: isEven ? "right center" : "left center",
            });

            gsap.set(card, {
              x: isEven ? -350 : 350, // Far off-screen
              rotateY: isEven ? 45 : -45, // Heavy 3D rotation
              rotateX: 15,
              rotateZ: isEven ? -5 : 5,
              opacity: 0,
              scale: 0.6,
              filter: "blur(15px)",
            });

            // Phase 1: Sweep into view with rotation
            cardTl.to(
              card,
              {
                x: isEven ? 30 : -30, // Slight overshoot
                rotateY: isEven ? -8 : 8,
                rotateX: -3,
                rotateZ: 0,
                opacity: 1,
                scale: 1.02,
                filter: "blur(2px)",
                duration: 0.8,
                ease: "power3.out",
              },
              0
            );

            // Phase 2: Settle into final position with bounce
            cardTl.to(
              card,
              {
                x: 0,
                rotateY: 0,
                rotateX: 0,
                scale: 1,
                filter: "blur(0px)",
                duration: 0.6,
                ease: "elastic.out(1, 0.6)",
              },
              0.6
            );

            // ─── Logo: Scale + blur + 3D flip reveal ────────────────
            if (logoContainer) {
              gsap.set(logoContainer, {
                scale: 0.3,
                opacity: 0,
                rotateY: isEven ? -30 : 30,
                filter: "blur(20px)",
                transformPerspective: 800,
              });

              cardTl.to(
                logoContainer,
                {
                  scale: 1,
                  opacity: 1,
                  rotateY: 0,
                  filter: "blur(0px)",
                  duration: 0.9,
                  ease: "back.out(2.5)", // Strong overshoot
                },
                0.3
              );

              // Logo image parallax zoom
              if (logoImg) {
                gsap.set(logoImg, { scale: 1.3 });
                cardTl.to(
                  logoImg,
                  {
                    scale: 1,
                    duration: 1.2,
                    ease: "power2.out",
                  },
                  0.3
                );
              }
            }

            // ─── Title: Clip-path wipe with glow ────────────────────
            if (titleEl) {
              gsap.set(titleEl, {
                clipPath: isEven ? "inset(0 100% 0 0)" : "inset(0 0 0 100%)",
                opacity: 0,
                filter: "blur(8px)",
              });

              cardTl.to(
                titleEl,
                {
                  clipPath: "inset(0 0% 0 0%)",
                  opacity: 1,
                  filter: "blur(0px)",
                  duration: 0.7,
                  ease: "power3.inOut",
                },
                0.5
              );
            }

            // ─── Date: Pop in with scale bounce ─────────────────────
            if (dateEl) {
              gsap.set(dateEl, {
                y: 20,
                opacity: 0,
                scale: 0.8,
                filter: "blur(6px)",
              });

              cardTl.to(
                dateEl,
                {
                  y: 0,
                  opacity: 1,
                  scale: 1,
                  filter: "blur(0px)",
                  duration: 0.5,
                  ease: "back.out(3)", // Dramatic pop
                },
                0.7
              );
            }

            // ─── Description: Word-by-word fade (if SplitText available) ─
            if (descEl) {
              gsap.set(descEl, {
                y: 30,
                opacity: 0,
                filter: "blur(10px)",
              });

              cardTl.to(
                descEl,
                {
                  y: 0,
                  opacity: 1,
                  filter: "blur(0px)",
                  duration: 0.6,
                  ease: "power2.out",
                },
                0.8
              );
            }

            // ─── Badges: Explosive center-out wave with 3D tilt ─────
            if (badgesWrap) {
              const badges = badgesWrap.querySelectorAll<HTMLElement>(".project-badge");
              if (badges.length) {
                gsap.set(badges, {
                  scale: 0,
                  opacity: 0,
                  y: 20,
                  rotateX: -45,
                  filter: "blur(10px)",
                  transformPerspective: 400,
                });

                cardTl.to(
                  badges,
                  {
                    scale: 1,
                    opacity: 1,
                    y: 0,
                    rotateX: 0,
                    filter: "blur(0px)",
                    duration: 0.6,
                    ease: "back.out(2.5)",
                    stagger: {
                      each: 0.05,
                      from: "center",
                      ease: "power2.out",
                    },
                  },
                  0.9
                );
              }
            }

            // ─── CTA Button: Dramatic opposite slide with elastic ───
            if (btn) {
              gsap.set(btn, {
                x: isEven ? 150 : -150,
                opacity: 0,
                scale: 0.7,
                rotateY: isEven ? -20 : 20,
                filter: "blur(8px)",
                transformPerspective: 600,
              });

              cardTl.to(
                btn,
                {
                  x: 0,
                  opacity: 1,
                  scale: 1,
                  rotateY: 0,
                  filter: "blur(0px)",
                  duration: 0.8,
                  ease: "elastic.out(1.2, 0.5)",
                },
                1.0
              );
            }
          });

          // ─────────────────────────────────────────────────────────────
          // PHASE 3: SCROLL EXIT — Projects → Achievements transition
          // Content recedes with blur as user scrolls past
          // ─────────────────────────────────────────────────────────────
          const exitScrollTriggers: ScrollTrigger[] = [];
          const projectsContent = section.querySelector<HTMLElement>(".projects-header");
          if (projectsContent) {
            const exitTween = gsap.to(projectsContent, {
              yPercent: -15,
              opacity: 0,
              filter: "blur(6px)",
              scale: 0.95,
              scrollTrigger: {
                trigger: section,
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
            if (projectsContent) {
              gsap.set(projectsContent, { yPercent: 0, opacity: 1, filter: "none", scale: 1, clearProps: "filter" });
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
      // MOBILE: Premium entrances with internal content stagger
      // ═══════════════════════════════════════════════════════════════════
      mm.add(
        "(max-width: 767px) and (prefers-reduced-motion: no-preference)",
        () => {
          const section = sectionRef.current!;

          // ─── Header: Refined blur + scale with cleanup ───
          const header = section.querySelector<HTMLElement>(".projects-header");
          if (header) {
            gsap.fromTo(
              header,
              { opacity: 0, y: 40, scale: 0.92, filter: "blur(8px)" },
              {
                opacity: 1, y: 0, scale: 1, filter: "blur(0px)", duration: 0.7, ease: "back.out(1.5)",
                scrollTrigger: { trigger: header, start: "top 85%", toggleActions: "play reverse play reverse" },
                onComplete: () => { gsap.set(header, { clearProps: "filter,transform" }); },
              }
            );
          }

          // ─── Cards: Entrance + internal content stagger ───
          const projectItems = section.querySelectorAll<HTMLElement>(".project-item");
          projectItems.forEach((item) => {
            const card = item.querySelector<HTMLElement>(".project-card");
            if (!card) return;

            gsap.set(card, { transformPerspective: 800 });

            const cardTl = gsap.timeline({
              scrollTrigger: { trigger: item, start: "top 85%", toggleActions: "play reverse play reverse" },
            });

            // Card entrance
            gsap.set(card, { opacity: 0, y: 50, scale: 0.88, rotateX: 8, filter: "blur(6px)" });
            cardTl.to(card, {
              opacity: 1, y: 0, scale: 1, rotateX: 0, filter: "blur(0px)", duration: 0.7, ease: "back.out(1.5)",
              onComplete: () => { gsap.set(card, { clearProps: "filter,transform" }); },
            });

            // ─── Internal content stagger ───
            const logoWrap = item.querySelector<HTMLElement>(".project-logo-wrap");
            const title = item.querySelector<HTMLElement>(".project-title");
            const desc = item.querySelector<HTMLElement>(".project-desc");
            const badgesWrap = item.querySelector<HTMLElement>(".project-badges");
            const btn = item.querySelector<HTMLElement>(".project-btn");

            if (logoWrap) {
              gsap.set(logoWrap, { opacity: 0, scale: 0.9 });
              cardTl.to(logoWrap, { opacity: 1, scale: 1, duration: 0.4, ease: "smooth.out" }, 0.15);
            }
            if (title) {
              gsap.set(title, { opacity: 0, x: -20 });
              cardTl.to(title, { opacity: 1, x: 0, duration: 0.4, ease: "smooth.out" }, 0.2);
            }
            if (desc) {
              gsap.set(desc, { opacity: 0, y: 10 });
              cardTl.to(desc, { opacity: 1, y: 0, duration: 0.4, ease: "smooth.out" }, 0.3);
            }
            if (badgesWrap) {
              const badges = badgesWrap.querySelectorAll<HTMLElement>(".project-badge");
              if (badges.length) {
                gsap.set(badges, { opacity: 0, scale: 0.7 });
                cardTl.to(badges, {
                  opacity: 1, scale: 1, duration: 0.4, ease: "back.out(1.7)",
                  stagger: { each: 0.04, from: "start" },
                }, 0.35);
              }
            }
            if (btn) {
              gsap.set(btn, { opacity: 0, scale: 0.85 });
              cardTl.to(btn, {
                opacity: 1, scale: 1, duration: 0.5, ease: "back.out(1.7)", clearProps: "transform",
              }, 0.4);
            }
          });
        }
      );

      // ═══════════════════════════════════════════════════════════════════
      // REDUCED MOTION: Instant visibility, no animations
      // ═══════════════════════════════════════════════════════════════════
      mm.add("(prefers-reduced-motion: reduce)", () => {
        const allEls = sectionRef.current!.querySelectorAll<HTMLElement>(
          ".projects-header, .project-item, .project-card, .project-btn, .projects-subtitle, .project-logo-wrap, .project-title, .project-date, .project-desc, .project-badge"
        );
        allEls.forEach((el) => {
          gsap.set(el, {
            opacity: 1,
            clearProps: "transform,filter,clipPath,letterSpacing",
          });
        });
        if (iconRef.current) {
          gsap.set(iconRef.current, {
            opacity: 1,
            clearProps: "transform,filter",
          });
        }
      });
    },
    { scope: sectionRef }
  );

  // Memoize isDarkMode calculation
  const isDarkMode = useMemo(() => theme === "dark", [theme]);

  // Optimized navigation handler - stable reference
  const handleNavigate = useCallback(
    (route: string) => {
      navigate(route);
    },
    [navigate]
  );

  // Create stable hover handlers - memoized outside render loop
  const createHoverHandlers = useCallback(
    (projectId: number) => ({
      onMouseEnter: () => setHoveredProject(projectId),
      onMouseLeave: () => setHoveredProject(null),
    }),
    []
  );

  // Memoize project items with stable handlers
  const projectItems = useMemo(() => {
    return PROJECTS_DATA.map((project, index) => {
      const handlers = createHoverHandlers(project.id);
      return (
        <ProjectItem
          key={project.id}
          project={project}
          index={index}
          isDarkMode={isDarkMode}
          isHovered={hoveredProject === project.id}
          onMouseEnter={handlers.onMouseEnter}
          onMouseLeave={handlers.onMouseLeave}
          onNavigate={handleNavigate}
        />
      );
    });
  }, [isDarkMode, hoveredProject, createHoverHandlers, handleNavigate]);

  return (
    <div ref={sectionRef} id="projects" className={CONTAINER_CLASSES}>
      <section className={SECTION_CLASSES}>
        <div className={`${HEADER_CLASSES} projects-header`}>
          <div className={TITLE_WRAPPER_CLASSES}>
            <div ref={iconRef}>
              <FolderKanban className={ICON_CLASSES} />
            </div>
            <h2
              ref={headingRef}
              className="text-3xl md:text-4xl lg:text-5xl font-semibold text-foreground leading-relaxed"
            >
              Projects
            </h2>
          </div>
          <p className={`${SUBTITLE_CLASSES} projects-subtitle`}>
            Explore my latest work...
          </p>
        </div>

        {/* Projects List Container */}
        <div className="relative">
          {/* Vertical timeline line (hidden on mobile) */}
          {!isMobile && (
            <div className="hidden md:block absolute left-1/2 -translate-x-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-transparent via-primary/20 to-transparent projects-timeline-line" />
          )}

          {/* Projects List */}
          <div className="relative space-y-0">{projectItems}</div>
        </div>
      </section>
    </div>
  );
};

export const ProjectsSection = memo(ProjectsSectionComponent);