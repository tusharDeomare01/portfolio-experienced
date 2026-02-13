import { useEffect, useMemo, lazy, Suspense, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAppSelector } from "@/store/hooks";
import { gsap, SplitText, useGSAP } from "@/lib/gsap";
import { useGSAPRouteAnimation } from "@/hooks/useGSAPRouteAnimation";
import { useGSAPScrollRestoration } from "@/hooks/useGSAPScrollRestoration";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/lightswind/card";
import { Badge } from "@/components/lightswind/badge";
import { ShareButton } from "@/components/Share";
import { getCurrentUrl } from "@/lib/shareUtils";
import {
  ArrowLeft,
  Zap,
  Settings,
  Brain,
  FileText,
  Sparkles,
  Palette,
  Smartphone,
  Cpu,
  Wand2,
  Eye,
  MousePointerClick,
} from "lucide-react";
import { LogoLoop, type LogoItem } from "@/components/reactBits/logoLoop";
import {
  InteractiveGrid,
  type InteractiveGridItem,
} from "@/components/reactBits/interactiveGrid";

// Lazy load react-bits components for better performance
const LightRays = lazy(() => import("@/components/reactBits/lightRays"));

const Portfolio = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useAppSelector((state) => state.theme.theme);
  const isDarkMode = theme === "dark";
  const { saveScrollPosition } = useGSAPScrollRestoration();

  // GSAP refs
  const pageRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const techStackRef = useRef<HTMLDivElement>(null);
  const featuresRef = useRef<HTMLDivElement>(null);
  const summaryRef = useRef<HTMLDivElement>(null);

  // Technology logos with real CDN URLs, documentation links, and tooltips
  const techLogos: LogoItem[] = useMemo(
    () => [
      {
        src: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg",
        alt: "React",
        title: "React 19.1.1 - Click to visit documentation",
        href: "https://react.dev",
      },
      {
        src: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg",
        alt: "TypeScript",
        title: "TypeScript 5.8.3 - Click to visit documentation",
        href: "https://www.typescriptlang.org/docs",
      },
      {
        src: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/vitejs/vitejs-original.svg",
        alt: "Vite",
        title: "Vite 7.1.0 - Click to visit documentation",
        href: "https://vitejs.dev",
      },
      {
        src: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/tailwindcss/tailwindcss-original.svg",
        alt: "Tailwind CSS",
        title: "Tailwind CSS 4.1.11 - Click to visit documentation",
        href: "https://tailwindcss.com/docs",
      },
      {
        src: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/redux/redux-original.svg",
        alt: "Redux Toolkit",
        title: "Redux Toolkit + Persist - Click to visit documentation",
        href: "https://redux-toolkit.js.org",
      },
      {
        src: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg",
        alt: "Node.js",
        title: "Node.js Runtime - Click to visit documentation",
        href: "https://nodejs.org/docs",
      },
      {
        src: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/npm/npm-original-wordmark.svg",
        alt: "npm",
        title: "npm Package Manager - Click to visit documentation",
        href: "https://docs.npmjs.com",
      },
      {
        src: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/git/git-original.svg",
        alt: "Git",
        title: "Git Version Control - Click to visit documentation",
        href: "https://git-scm.com/doc",
      },
    ],
    []
  );

  // Key features
  const features = [
    {
      title: "AI-Powered Assistant",
      description:
        "Interactive AI assistant powered by GPT-4o that answers questions about your background, experience, and projects. Features streaming responses, chat history persistence, and multiple session management.",
      icon: Brain,
      color: "purple",
    },
    {
      title: "Advanced Animations",
      description:
        "Leveraged Framer Motion for complex animations including scroll-triggered reveals, drag-and-drop interactions, and smooth transitions. Includes 3D carousel effects and interactive UI elements.",
      icon: Sparkles,
      color: "pink",
    },
    {
      title: "3D Carousel Component",
      description:
        "Custom-built 3D carousel with perspective transforms, auto-rotation, and responsive design. Features intersection observer for performance optimization and mobile-friendly touch interactions.",
      icon: Eye,
      color: "teal",
    },
    {
      title: "Fall Beam Background",
      description:
        "Performance-optimized animated background with configurable beam count, colors, and animations. Includes mobile responsiveness and reduced motion support for accessibility.",
      icon: Wand2,
      color: "orange",
    },
    {
      title: "Smokey Cursor Effect",
      description:
        "WebGL-powered fluid smoke effect that follows cursor movement. Customizable intensity and color schemes with smooth performance optimizations.",
      icon: MousePointerClick,
      color: "green",
    },
    {
      title: "Rays Background",
      description:
        "Dynamic rays background component with conic gradients and CSS animations. Supports light/dark themes with customizable opacity and blur effects.",
      icon: Sparkles,
      color: "yellow",
    },
    {
      title: "Drag & Drop Projects",
      description:
        "Interactive project reordering with drag-and-drop functionality. Integrated with smooth scrolling to prevent conflicts during drag operations.",
      icon: Settings,
      color: "red",
    },
    {
      title: "Theme Toggle",
      description:
        "Seamless dark/light mode switching with persistent preferences. Available across all screen sizes with smooth transitions.",
      icon: Palette,
      color: "indigo",
    },
    {
      title: "Responsive Design",
      description:
        "Fully responsive layout optimized for mobile, tablet, and desktop. Adaptive components that adjust behavior and styling based on screen size.",
      icon: Smartphone,
      color: "cyan",
    },
    {
      title: "Project Detail Pages",
      description:
        "Dedicated routes for detailed project showcases with comprehensive information, tech stacks, features, and integrations. Similar structure to MarketJD page.",
      icon: FileText,
      color: "violet",
    },
    {
      title: "Achievements Section",
      description:
        "3D carousel showcase for career achievements with auto-rotation and navigation controls. Mobile-optimized with simplified 3D effects for better performance.",
      icon: Zap,
      color: "amber",
    },
  ];

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // ─────────────────────────────────────────────────────────────────────────────
  // GSAP PAGE ENTRANCE ANIMATIONS — ENHANCED CINEMATIC VERSION
  // ─────────────────────────────────────────────────────────────────────────────
  useGSAP(
    () => {
      const page = pageRef.current;
      if (!page) return;

      const mm = gsap.matchMedia();

      // ═══════════════════════════════════════════════════════════════════════
      // DESKTOP — Premium cinematic page entrance with dramatic effects
      // ═══════════════════════════════════════════════════════════════════════
      mm.add(
        "(min-width: 768px) and (prefers-reduced-motion: no-preference)",
        () => {
          const tl = gsap.timeline({
            defaults: { ease: "power3.out" },
          });

          // ─── PHASE 1: Hero section entrance — Multi-layer reveal ───
          const heroSection = heroRef.current;
          if (heroSection) {
            const logo = heroSection.querySelector(".hero-logo");
            const subtitle = heroSection.querySelector(".hero-subtitle");
            const badges = heroSection.querySelectorAll(".hero-badge");
            const description = heroSection.querySelector(".hero-description");

            // Logo: 3D flip with glow pulse
            if (logo) {
              gsap.set(logo, {
                opacity: 0,
                scale: 0.3,
                rotateY: -180,
                rotateZ: -15,
                transformPerspective: 1200,
                filter: "brightness(2)",
              });
              tl.to(
                logo,
                {
                  opacity: 1,
                  scale: 1,
                  rotateY: 0,
                  rotateZ: 0,
                  filter: "brightness(1)",
                  duration: 1.2,
                  ease: "elastic.out(1, 0.5)",
                },
                0
              );
            }

            // Title: SplitText chars with 3D wave
            if (titleRef.current) {
              const titleSplit = new SplitText(titleRef.current, {
                type: "chars",
                mask: "chars",
              });
              gsap.set(titleSplit.chars, {
                opacity: 0,
                y: 120,
                rotateX: -90,
                rotateY: gsap.utils.wrap([-20, 20, -15, 15, -10, 10]),
                scale: 0.5,
                transformPerspective: 1200,
                transformOrigin: "center bottom",
              });
              tl.to(
                titleSplit.chars,
                {
                  opacity: 1,
                  y: 0,
                  rotateX: 0,
                  rotateY: 0,
                  scale: 1,
                  duration: 1,
                  stagger: { each: 0.035, from: "start", ease: "power2.out" },
                  ease: "back.out(1.7)",
                },
                0.15
              );
            }

            // Subtitle: Slide from right with blur
            if (subtitle) {
              gsap.set(subtitle, {
                opacity: 0,
                x: 80,
                filter: "blur(10px)",
              });
              tl.to(
                subtitle,
                {
                  opacity: 1,
                  x: 0,
                  filter: "blur(0px)",
                  duration: 0.8,
                  ease: "power3.out",
                },
                0.5
              );
            }

            // Badges: Elastic cascade from different directions
            if (badges.length > 0) {
              badges.forEach((badge, i) => {
                const directions = [
                  { x: -40, y: 30, rotate: -15 },
                  { x: 0, y: 50, rotate: 0 },
                  { x: 40, y: 30, rotate: 15 },
                ];
                const dir = directions[i % directions.length];
                gsap.set(badge, {
                  opacity: 0,
                  scale: 0,
                  x: dir.x,
                  y: dir.y,
                  rotation: dir.rotate,
                });
              });
              tl.to(
                badges,
                {
                  opacity: 1,
                  scale: 1,
                  x: 0,
                  y: 0,
                  rotation: 0,
                  duration: 0.8,
                  stagger: 0.12,
                  ease: "elastic.out(1, 0.4)",
                },
                0.7
              );
            }

            // Description: Word-by-word reveal with SplitText
            if (description) {
              const descSplit = new SplitText(description, {
                type: "words",
                wordsClass: "gsap-word",
              });
              gsap.set(descSplit.words, {
                opacity: 0,
                y: 25,
                filter: "blur(4px)",
              });
              tl.to(
                descSplit.words,
                {
                  opacity: 1,
                  y: 0,
                  filter: "blur(0px)",
                  duration: 0.5,
                  stagger: 0.02,
                  ease: "power2.out",
                },
                1.0
              );
            }
          }

          // ─── PHASE 2: Tech Stack — Icon spring + content lift ───
          if (techStackRef.current) {
            const techIcon = techStackRef.current.querySelector(".section-icon");
            const techTitle = techStackRef.current.querySelector(".section-title");
            const techSubtitle = techStackRef.current.querySelector(".section-subtitle");
            const techContent = techStackRef.current.querySelector(".section-content");

            // Icon: Spring bounce
            if (techIcon) {
              gsap.set(techIcon, { scale: 0, rotation: -180 });
              gsap.to(techIcon, {
                scale: 1,
                rotation: 0,
                duration: 1,
                ease: "elastic.out(1, 0.4)",
                scrollTrigger: {
                  trigger: techStackRef.current,
                  start: "top 80%",
                  toggleActions: "play reverse play reverse",
                },
              });
            }

            // Title: Slide from left
            if (techTitle) {
              gsap.set(techTitle, { opacity: 0, x: -60, filter: "blur(8px)" });
              gsap.to(techTitle, {
                opacity: 1,
                x: 0,
                filter: "blur(0px)",
                duration: 0.8,
                ease: "power3.out",
                scrollTrigger: {
                  trigger: techStackRef.current,
                  start: "top 78%",
                  toggleActions: "play reverse play reverse",
                },
              });
            }

            // Subtitle: Fade up
            if (techSubtitle) {
              gsap.set(techSubtitle, { opacity: 0, y: 20 });
              gsap.to(techSubtitle, {
                opacity: 1,
                y: 0,
                duration: 0.6,
                ease: "power2.out",
                scrollTrigger: {
                  trigger: techStackRef.current,
                  start: "top 76%",
                  toggleActions: "play reverse play reverse",
                },
              });
            }

            // Content: 3D perspective lift
            if (techContent) {
              gsap.set(techContent, {
                opacity: 0,
                y: 80,
                scale: 0.9,
                rotateX: 20,
                transformPerspective: 1200,
                transformOrigin: "center top",
              });
              gsap.to(techContent, {
                opacity: 1,
                y: 0,
                scale: 1,
                rotateX: 0,
                duration: 1.2,
                ease: "power3.out",
                scrollTrigger: {
                  trigger: techStackRef.current,
                  start: "top 70%",
                  toggleActions: "play reverse play reverse",
                },
              });
            }
          }

          // ─── PHASE 3: Features — Grid reveal with stagger ───
          if (featuresRef.current) {
            const featIcon = featuresRef.current.querySelector(".section-icon");
            const featTitle = featuresRef.current.querySelector(".section-title");
            const featSubtitle = featuresRef.current.querySelector(".section-subtitle");
            const featContent = featuresRef.current.querySelector(".section-content");

            if (featIcon) {
              gsap.set(featIcon, { scale: 0, rotation: -180 });
              gsap.to(featIcon, {
                scale: 1,
                rotation: 0,
                duration: 1,
                ease: "elastic.out(1, 0.4)",
                scrollTrigger: {
                  trigger: featuresRef.current,
                  start: "top 80%",
                  toggleActions: "play reverse play reverse",
                },
              });
            }

            if (featTitle) {
              gsap.set(featTitle, { opacity: 0, x: -60, filter: "blur(8px)" });
              gsap.to(featTitle, {
                opacity: 1,
                x: 0,
                filter: "blur(0px)",
                duration: 0.8,
                ease: "power3.out",
                scrollTrigger: {
                  trigger: featuresRef.current,
                  start: "top 78%",
                  toggleActions: "play reverse play reverse",
                },
              });
            }

            if (featSubtitle) {
              gsap.set(featSubtitle, { opacity: 0, y: 20 });
              gsap.to(featSubtitle, {
                opacity: 1,
                y: 0,
                duration: 0.6,
                ease: "power2.out",
                scrollTrigger: {
                  trigger: featuresRef.current,
                  start: "top 76%",
                  toggleActions: "play reverse play reverse",
                },
              });
            }

            if (featContent) {
              gsap.set(featContent, {
                opacity: 0,
                y: 120,
                scale: 0.8,
                rotateX: 30,
                transformPerspective: 1500,
                transformOrigin: "center top",
              });
              gsap.to(featContent, {
                opacity: 1,
                y: 0,
                scale: 1,
                rotateX: 0,
                duration: 1.5,
                ease: "power3.out",
                scrollTrigger: {
                  trigger: featuresRef.current,
                  start: "top 70%",
                  toggleActions: "play reverse play reverse",
                },
              });
            }
          }

          // ─── PHASE 4: Summary — Cinematic card entrance ───
          if (summaryRef.current) {
            gsap.set(summaryRef.current, {
              opacity: 0,
              y: 100,
              scale: 0.85,
              rotateX: 20,
              transformPerspective: 1400,
              transformOrigin: "center top",
              boxShadow: "0 0 0 rgba(0,0,0,0)",
            });
            gsap.to(summaryRef.current, {
              opacity: 1,
              y: 0,
              scale: 1,
              rotateX: 0,
              boxShadow: "0 25px 50px -12px rgba(0,0,0,0.15)",
              duration: 1.4,
              ease: "power3.out",
              scrollTrigger: {
                trigger: summaryRef.current,
                start: "top 80%",
                toggleActions: "play reverse play reverse",
              },
            });

            // Summary cards stagger
            const summaryCards = summaryRef.current.querySelectorAll(".summary-card");
            if (summaryCards.length > 0) {
              gsap.set(summaryCards, {
                opacity: 0,
                y: 50,
                scale: 0.9,
              });
              gsap.to(summaryCards, {
                opacity: 1,
                y: 0,
                scale: 1,
                duration: 0.8,
                stagger: 0.15,
                ease: "back.out(1.4)",
                scrollTrigger: {
                  trigger: summaryRef.current,
                  start: "top 70%",
                  toggleActions: "play reverse play reverse",
                },
              });
            }
          }
        }
      );

      // ═══════════════════════════════════════════════════════════════════════
      // MOBILE — Simplified but still engaging animations
      // ═══════════════════════════════════════════════════════════════════════
      mm.add("(max-width: 767px)", () => {
        // Hero instant timeline
        const mobileTl = gsap.timeline();

        if (heroRef.current) {
          const logo = heroRef.current.querySelector(".hero-logo");
          const badges = heroRef.current.querySelectorAll(".hero-badge");

          if (logo) {
            gsap.set(logo, { opacity: 0, scale: 0.8, y: -20 });
            mobileTl.to(logo, { opacity: 1, scale: 1, y: 0, duration: 0.5 }, 0);
          }

          if (titleRef.current) {
            gsap.set(titleRef.current, { opacity: 0, y: 30 });
            mobileTl.to(titleRef.current, { opacity: 1, y: 0, duration: 0.5 }, 0.1);
          }

          if (badges.length > 0) {
            gsap.set(badges, { opacity: 0, scale: 0.8 });
            mobileTl.to(badges, { opacity: 1, scale: 1, duration: 0.4, stagger: 0.1 }, 0.3);
          }
        }

        // Scroll-triggered sections
        const sections = [techStackRef.current, featuresRef.current, summaryRef.current].filter(Boolean);
        sections.forEach((section) => {
          if (section) {
            gsap.set(section, { opacity: 0, y: 50 });
            gsap.to(section, {
              opacity: 1,
              y: 0,
              duration: 0.7,
              ease: "power2.out",
              scrollTrigger: {
                trigger: section,
                start: "top 85%",
                toggleActions: "play reverse play reverse",
              },
            });
          }
        });
      });

      // ═══════════════════════════════════════════════════════════════════════
      // REDUCED MOTION — Instant visibility
      // ═══════════════════════════════════════════════════════════════════════
      mm.add("(prefers-reduced-motion: reduce)", () => {
        const allSections = [heroRef.current, techStackRef.current, featuresRef.current, summaryRef.current].filter(Boolean);
        allSections.forEach((section) => {
          if (section) {
            gsap.set(section, { opacity: 1, clearProps: "all" });
          }
        });
      });
    },
    { scope: pageRef }
  );

  // ─────────────────────────────────────────────────────────────────────────────
  // ROUTE TRANSITION ANIMATIONS
  // ─────────────────────────────────────────────────────────────────────────────
  useGSAPRouteAnimation({
    containerRef: pageRef,
    transitionType: "home-to-project",
    enabled: location.state?.from !== undefined,
  });

  // Prepare InteractiveGrid items for features
  const interactiveGridItems: InteractiveGridItem[] = useMemo(
    () =>
      features.map((feature) => {
        const Icon = feature.icon;
        return {
          id: feature.title,
          title: feature.title,
          description: feature.description,
          icon: <Icon className="w-6 h-6" />,
          color: feature.color,
        };
      }),
    [features]
  );

  return (
    <div ref={pageRef} className="min-h-screen bg-transparent relative route-enter-content">
      <style>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>

      <div className="relative z-10 max-w-7xl mx-auto px-4 py-8 md:py-12">
        {/* Back Button and Share */}
        <div className="mb-8 flex items-center justify-between flex-wrap gap-3 sm:gap-4 route-enter-child">
          <button
            onClick={(e) => {
              e.preventDefault();
              const scrollY = saveScrollPosition();
              navigate("/", {
                state: {
                  scrollTo: "projects",
                  scrollY,
                  from: "home-to-project",
                },
              });
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
              title: "TechShowcase - Portfolio Website",
              description:
                "Modern, interactive portfolio website featuring smooth animations, AI-powered assistant, 3D carousel, and responsive design.",
              url: getCurrentUrl(),
            }}
            variant="outline"
            size="md"
            showLabel={true}
            position="bottom"
            className="shrink-0 cursor-pointer"
          />
        </div>

        {/* Hero Header */}
        <div ref={heroRef} className="mb-16 route-enter-child">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-6 mb-6">
            <div className="p-4 rounded-2xl bg-transparent flex items-center justify-center min-w-[120px] h-[120px] hero-logo">
              <img
                src={
                  isDarkMode
                    ? "/techshowcase-logo-dark.svg"
                    : "/techshowcase-logo-light.svg"
                }
                alt="TechShowcase Logo"
                className="h-16 w-auto object-contain"
              />
            </div>
            <div className="flex-1">
              <h1
                ref={titleRef}
                className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight mb-2"
              >
                TechShowcase
              </h1>
              <p className="text-lg text-muted-foreground mb-2 hero-subtitle">
                Modern Interactive Portfolio • React + TypeScript
              </p>
              <div className="flex flex-wrap gap-2 mt-4">
                <Badge variant="success" size="lg" className="hero-badge">
                  Live & Active
                </Badge>
                <Badge variant="info" size="lg" className="hero-badge">
                  2025 - Present
                </Badge>
                <Badge variant="default" size="lg" className="hero-badge">
                  Portfolio
                </Badge>
              </div>
            </div>
          </div>
          <p className="text-lg text-muted-foreground max-w-4xl hero-description">
            TechShowcase is a modern, interactive portfolio website showcasing
            professional experience, projects, and achievements. Features smooth
            animations, AI-powered assistant, 3D carousel effects, and
            responsive design. Built with React 19, TypeScript, Framer Motion,
            and cutting-edge UI libraries for an exceptional user experience.
          </p>
        </div>

        {/* Technology Stack - LogoLoop */}
        <div ref={techStackRef} className="mb-16 relative">
          {/* Futuristic Background Effect */}
          {!isDarkMode && (
            <Suspense fallback={null}>
              <div className="absolute inset-0 -z-10 opacity-10 pointer-events-none overflow-hidden rounded-3xl">
                <LightRays
                  raysOrigin="top-center"
                  raysColor="#07eae6"
                  raysSpeed={1}
                  lightSpread={12}
                  rayLength={0.7}
                  followMouse={true}
                  mouseInfluence={0.1}
                  className="w-full h-full"
                />
              </div>
            </Suspense>
          )}

          <div className="mb-6 relative z-10 section-header">
            <div className="mb-2 flex items-center gap-2">
              <div className="section-icon">
                <Cpu className="w-8 h-8 text-primary" />
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold section-title">Technology Stack</h2>
            </div>
            <p className="text-muted-foreground section-subtitle">
              Modern technologies powering this portfolio
            </p>
          </div>
          <div className="relative py-8 px-2 rounded-2xl bg-transparent z-10 section-content">
            <LogoLoop
              logos={techLogos}
              speed={80}
              direction="left"
              logoHeight={48}
              gap={48}
              pauseOnHover={true}
              fadeOut={true}
              scaleOnHover={true}
              className="w-full"
              ariaLabel="Technology stack logos"
            />
          </div>
        </div>

        {/* Key Features & Capabilities - InteractiveGrid */}
        <div ref={featuresRef} className="mb-16 relative">
          <div className="mb-6 section-header">
            <div className="mb-2 flex items-center gap-2">
              <div className="section-icon">
                <Zap className="w-8 h-8 text-primary" />
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold section-title">Key Features & Capabilities</h2>
            </div>
            <p className="text-muted-foreground section-subtitle">
              Major features and development achievements
            </p>
          </div>
          <div className="section-content">
            <InteractiveGrid
              items={interactiveGridItems}
              columns={2}
              enableHoverEffects={true}
              enableParticles={true}
              enableLightRays={true}
              className="w-full"
            />
          </div>
        </div>

        {/* Project Summary - Enhanced */}
        <div ref={summaryRef} className="mb-12">
          <Card className="backdrop-blur-xl bg-gradient-to-br from-primary/10 via-primary/5 to-transparent border-2 border-primary/20 hover:border-primary/40 transition-all duration-500">
            <CardHeader className="pb-4">
              <CardTitle className="text-2xl flex items-center gap-3">
                <div className="p-2 rounded-lg bg-primary/20">
                  <FileText className="w-6 h-6 text-primary" />
                </div>
                Project Summary
              </CardTitle>
              <CardDescription className="text-base">
                TechShowcase - Modern portfolio website with advanced features
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="p-4 rounded-lg bg-background/50 backdrop-blur-sm border border-border/50 hover:border-primary/50 transition-all duration-300 hover:shadow-lg summary-card">
                  <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                    Project Name
                  </h3>
                  <p className="text-foreground font-medium text-lg mb-1">
                    TechShowcase
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Interactive portfolio showcase
                  </p>
                </div>
                <div className="p-4 rounded-lg bg-background/50 backdrop-blur-sm border border-border/50 hover:border-primary/50 transition-all duration-300 hover:shadow-lg summary-card">
                  <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                    <div
                      className="w-2 h-2 rounded-full bg-primary animate-pulse"
                      style={{ animationDelay: "0.2s" }}
                    />
                    Duration
                  </h3>
                  <p className="text-foreground font-medium text-lg mb-1">
                    2025 - Present
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Continuous development & updates
                  </p>
                  <div className="mt-3 flex gap-2">
                    <Badge variant="info" size="sm">
                      Active Development
                    </Badge>
                    <Badge variant="outline" size="sm">
                      Ongoing
                    </Badge>
                  </div>
                </div>
                <div className="p-4 rounded-lg bg-background/50 backdrop-blur-sm border border-border/50 hover:border-primary/50 transition-all duration-300 hover:shadow-lg summary-card">
                  <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                    <div
                      className="w-2 h-2 rounded-full bg-primary animate-pulse"
                      style={{ animationDelay: "0.4s" }}
                    />
                    Status
                  </h3>
                  <Badge variant="success" size="lg" className="mb-3">
                    <span className="relative flex h-2 w-2 mr-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
                    </span>
                    Live & Active
                  </Badge>
                  <p className="text-sm text-muted-foreground">
                    Production environment
                  </p>
                  <p className="text-xs text-muted-foreground mt-2">
                    Modern portfolio platform
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Portfolio;
