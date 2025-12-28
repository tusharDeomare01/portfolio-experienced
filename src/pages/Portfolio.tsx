import { useEffect } from "react";
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
import { ScrollReveal } from "@/components/lightswind/scroll-reveal";
import { ShareButton } from "@/components/Share";
import { getCurrentUrl } from "@/lib/shareUtils";
// import { BackgroundSkeleton } from "@/components/Loading/LoadingComponents";
import {
  ArrowLeft,
  Code,
  Zap,
  Globe,
  Settings,
  Layers,
  Package,
  Brain,
  FileText,
  Sparkles,
  Palette,
  Smartphone,
  Cpu,
  Rocket,
  Wand2,
  Eye,
  MousePointerClick,
} from "lucide-react";

// const RaysBackground = lazy(
//   () => import("../components/lightswind/rays-background")
// );
// const FallBeamBackground = lazy(
//   () => import("../components/lightswind/fall-beam-background")
// );

const Portfolio = () => {
  const navigate = useNavigate();
  const theme = useAppSelector((state) => state.theme.theme);
  const isDarkMode = theme === "dark";

  // Tech stack based on package.json
  const techStack = {
    framework: {
      name: "React 19.1.1",
      description:
        "Latest React with concurrent features and improved performance",
      icon: Code,
    },
    language: {
      name: "TypeScript 5.8.3",
      description: "Type-safe JavaScript for robust development",
      icon: Code,
    },
    buildTool: {
      name: "Vite 7.1.0",
      description: "Next-generation frontend build tool with instant HMR",
      icon: Rocket,
    },
    animations: {
      name: "Framer Motion 12.23.12",
      description: "Production-ready motion library for React",
      icon: Sparkles,
    },
    uiLibrary: {
      name: "Lightswind 3.1.15",
      description: "Modern UI component library with advanced effects",
      icon: Palette,
    },
    stateManagement: {
      name: "Redux Toolkit + Persist",
      description: "Predictable state container with persistence",
      icon: Package,
    },
    routing: {
      name: "React Router DOM 7.9.6",
      description: "Declarative routing for React applications",
      icon: Globe,
    },
    styling: {
      name: "Tailwind CSS 4.1.11",
      description: "Utility-first CSS framework",
      icon: Layers,
    },
    ai: {
      name: "OpenAI API 6.9.1",
      description: "GPT-4o powered AI assistant integration",
      icon: Brain,
    },
  };

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

  // UI Components used
  const uiComponents = [
    "Card",
    "Badge",
    "Button",
    "ScrollArea",
    "Dialog",
    "Textarea",
    "Dock",
    "StripedBackground",
    "DragOrderList",
    "ThreeDCarousel",
  ];

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const colorMap: Record<string, { bg: string; text: string }> = {
    blue: { bg: "bg-blue-500/10", text: "text-blue-500" },
    purple: { bg: "bg-purple-500/10", text: "text-purple-500" },
    green: { bg: "bg-green-500/10", text: "text-green-500" },
    orange: { bg: "bg-orange-500/10", text: "text-orange-500" },
    pink: { bg: "bg-pink-500/10", text: "text-pink-500" },
    teal: { bg: "bg-teal-500/10", text: "text-teal-500" },
    yellow: { bg: "bg-yellow-500/10", text: "text-yellow-500" },
    red: { bg: "bg-red-500/10", text: "text-red-500" },
    indigo: { bg: "bg-indigo-500/10", text: "text-indigo-500" },
    cyan: { bg: "bg-cyan-500/10", text: "text-cyan-500" },
    violet: { bg: "bg-violet-500/10", text: "text-violet-500" },
    amber: { bg: "bg-amber-500/10", text: "text-amber-500" },
  };

  return (
    <div className="min-h-screen z-10 bg-transparent relative">
      {/* <FallBeamBackground className="fixed z-1" beamCount={3} /> */}
      {/* <Suspense fallback={<BackgroundSkeleton />}>
        <RaysBackground className="fixed z-0" />
      </Suspense> */}

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
            className="shrink-0 cursor-pointer "
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
                enableBlur={false}
                baseOpacity={0.1}
                blurStrength={0}
              >
                TechShowcase
              </ScrollReveal>
              <ScrollReveal
                size="md"
                align="left"
                variant="muted"
                enableBlur={false}
                containerClassName="mb-2"
                blurStrength={0}
                baseRotation={0}
                baseOpacity={0.1}
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
            enableBlur={false}
            containerClassName="max-w-4xl"
            blurStrength={0}
            baseRotation={0}
            baseOpacity={0.1}
          >
            TechShowcase is a modern, interactive portfolio website showcasing
            professional experience, projects, and achievements. Features smooth
            animations, AI-powered assistant, 3D carousel effects, and
            responsive design. Built with React 19, TypeScript, Framer Motion,
            and cutting-edge UI libraries for an exceptional user experience.
          </ScrollReveal>
        </div>

        {/* Tech Stack */}
        <div className="mb-16">
          <div className="mb-6">
            <div className="mb-2 flex items-center gap-2">
              <Cpu className="w-8 h-8 text-primary" />
              <ScrollReveal
                size="xl"
                align="left"
                variant="default"
                enableBlur={false}
                containerClassName="inline-block"
                blurStrength={0}
                baseRotation={0}
                baseOpacity={0.1}
              >
                Technology Stack
              </ScrollReveal>
            </div>
            <p className="text-lg font-bold">
              Modern technologies powering this portfolio
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {Object.entries(techStack).map(([key, tech]) => {
              const Icon = tech.icon;
              return (
                <div
                  key={key}
                  className="p-6 rounded-xl border bg-background/50 backdrop-blur-xl hover:bg-background/80 transition-all duration-300 hover:shadow-lg"
                >
                  <div className="flex items-start gap-4">
                    <div className="p-3 rounded-lg bg-primary/10">
                      <Icon className="w-6 h-6 text-primary" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-foreground mb-1">
                        {tech.name}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {tech.description}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Key Features */}
        <div className="mb-16">
          <div className="mb-6">
            <div className="mb-2 flex items-center gap-2">
              <Zap className="w-8 h-8 text-primary" />
              <ScrollReveal
                size="xl"
                align="left"
                variant="default"
                enableBlur={false}
                containerClassName="inline-block"
                blurStrength={0}
                baseRotation={0}
                baseOpacity={0.1}
              >
                Key Features & Capabilities
              </ScrollReveal>
            </div>
            <p className="text-lg font-bold">
              Major features and development achievements
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {features.map((feature, idx) => {
              const Icon = feature.icon;
              return (
                <div key={idx} className="group">
                  <Card className="backdrop-blur-xl bg-background/80 hover:bg-background/90 transition-all h-full border-2 hover:border-primary/50">
                    <CardHeader>
                      <div className="flex items-start gap-4">
                        <div
                          className={`p-3 rounded-xl ${
                            colorMap[feature.color]?.bg || "bg-primary/10"
                          } group-hover:scale-110 transition-transform`}
                        >
                          <Icon
                            className={`w-6 h-6 ${
                              colorMap[feature.color]?.text || "text-primary"
                            }`}
                          />
                        </div>
                        <div className="flex-1">
                          <CardTitle className="mb-2">
                            {feature.title}
                          </CardTitle>
                          <CardDescription className="text-sm leading-relaxed">
                            {feature.description}
                          </CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                  </Card>
                </div>
              );
            })}
          </div>
        </div>

        {/* UI Components */}
        <div className="mb-16">
          <Card className="backdrop-blur-xl bg-background/80">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Layers className="w-6 h-6 text-primary" />
                UI Components & Libraries
              </CardTitle>
              <CardDescription>
                Custom and third-party components used in the portfolio
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {uiComponents.map((component, idx) => (
                  <Badge
                    key={idx}
                    variant="outline"
                    className="justify-center py-2"
                  >
                    {component}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Project Summary */}
        <div className="mb-12">
          <Card className="backdrop-blur-xl bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20">
            <CardHeader>
              <CardTitle>Project Summary</CardTitle>
              <CardDescription>
                TechShowcase - Modern portfolio website with advanced features
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <h3 className="font-semibold text-foreground mb-2">
                    Project Name
                  </h3>
                  <p className="text-muted-foreground">TechShowcase</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Interactive portfolio showcase
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-2">
                    Duration
                  </h3>
                  <p className="text-muted-foreground">2025 - Present</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Continuous development & updates
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-2">Status</h3>
                  <Badge variant="success" size="lg">
                    Live & Active
                  </Badge>
                  <p className="text-sm text-muted-foreground mt-2">
                    Production environment
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
