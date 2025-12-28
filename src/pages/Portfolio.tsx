import { useEffect, useMemo, lazy, Suspense } from "react";
import { useNavigate } from "react-router-dom";
import { useAppSelector } from "@/store/hooks";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/lightswind/card";
import { Badge } from "@/components/lightswind/badge";
import { ScrollReveal } from "@/components/reactBits/scrollReveal";
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
  const theme = useAppSelector((state) => state.theme.theme);
  const isDarkMode = theme === "dark";

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
    <div className="min-h-screen bg-transparent relative">
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
        <div className="mb-8 flex items-center justify-between flex-wrap gap-3 sm:gap-4">
          <button
            onClick={(e) => {
              e.preventDefault();
              const splitUrl = window.location.href.split("#");
              if (splitUrl?.includes("home")) {
                navigate("/");
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
        <div className="mb-16">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-6 mb-6">
            <div className="p-4 rounded-2xl bg-transparent flex items-center justify-center min-w-[120px] h-[120px]">
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
              <ScrollReveal
                size="2xl"
                align="left"
                variant="default"
                animation="fadeUp"
                stagger={true}
                delay={0.1}
              >
                TechShowcase
              </ScrollReveal>
              <ScrollReveal
                size="md"
                align="left"
                variant="muted"
                containerClassName="mb-2"
                animation="fadeUp"
                delay={0.2}
              >
                Modern Interactive Portfolio • React + TypeScript
              </ScrollReveal>
              <div className="flex flex-wrap gap-2 mt-4">
                <Badge variant="success" size="lg">
                  Live & Active
                </Badge>
                <Badge variant="info" size="lg">
                  2025 - Present
                </Badge>
                <Badge variant="default" size="lg">
                  Portfolio
                </Badge>
              </div>
            </div>
          </div>
          <ScrollReveal
            size="md"
            align="left"
            variant="muted"
            containerClassName="max-w-4xl"
            animation="fadeUp"
            delay={0.3}
          >
            TechShowcase is a modern, interactive portfolio website showcasing
            professional experience, projects, and achievements. Features smooth
            animations, AI-powered assistant, 3D carousel effects, and
            responsive design. Built with React 19, TypeScript, Framer Motion,
            and cutting-edge UI libraries for an exceptional user experience.
          </ScrollReveal>
        </div>

        {/* Technology Stack - LogoLoop */}
        <div className="mb-16 relative">
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

          <div className="mb-6 relative z-10">
            <div className="mb-2 flex items-center gap-2">
              <Cpu className="w-8 h-8 text-primary" />
              <ScrollReveal
                size="xl"
                align="left"
                variant="default"
                containerClassName="inline-block"
                animation="slideLeft"
                delay={0.1}
              >
                Technology Stack
              </ScrollReveal>
            </div>
            <ScrollReveal
              size="md"
              align="left"
              variant="muted"
              animation="fadeUp"
              delay={0.2}
            >
              Modern technologies powering this portfolio
            </ScrollReveal>
          </div>
          <div className="relative py-8 px-4 rounded-2xl bg-transparent z-10">
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
        <div className="mb-16 relative">
          <div className="mb-6">
            <div className="mb-2 flex items-center gap-2">
              <Zap className="w-8 h-8 text-primary" />
              <ScrollReveal
                size="xl"
                align="left"
                variant="default"
                containerClassName="inline-block"
                animation="slideLeft"
                delay={0.1}
              >
                Key Features & Capabilities
              </ScrollReveal>
            </div>
            <ScrollReveal
              size="md"
              align="left"
              variant="muted"
              animation="fadeUp"
              delay={0.2}
            >
              Major features and development achievements
            </ScrollReveal>
          </div>
          <InteractiveGrid
            items={interactiveGridItems}
            columns={2}
            enableHoverEffects={true}
            enableParticles={true}
            enableLightRays={true}
            className="w-full"
          />
        </div>

        {/* Project Summary - Enhanced */}
        <div className="mb-12">
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
                <div
                  style={{
                    animation: `fadeInUp 0.6s ease-out 0s both`,
                  }}
                  className="p-4 rounded-lg bg-background/50 backdrop-blur-sm border border-border/50 hover:border-primary/50 transition-all duration-300 hover:shadow-lg"
                >
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
                <div
                  style={{
                    animation: `fadeInUp 0.6s ease-out 0.1s both`,
                  }}
                  className="p-4 rounded-lg bg-background/50 backdrop-blur-sm border border-border/50 hover:border-primary/50 transition-all duration-300 hover:shadow-lg"
                >
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
                <div
                  style={{
                    animation: `fadeInUp 0.6s ease-out 0.2s both`,
                  }}
                  className="p-4 rounded-lg bg-background/50 backdrop-blur-sm border border-border/50 hover:border-primary/50 transition-all duration-300 hover:shadow-lg"
                >
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
