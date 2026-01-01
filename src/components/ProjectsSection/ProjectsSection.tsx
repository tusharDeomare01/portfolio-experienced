import { useState, useMemo, useCallback, memo, lazy, Suspense } from "react";
import { useNavigate } from "react-router-dom";
import { selectTheme } from "@/store/hooks";
import { useAppSelector } from "@/store/hooks";
import { Button } from "../lightswind/button";
import { Badge } from "../lightswind/badge";
import { ScrollReveal } from "../lightswind/scroll-reveal";
import {
  ArrowRight,
  Calendar,
  FolderKanban,
  Sparkles,
} from "lucide-react";
import { useIsMobile } from "../hooks/use-mobile";

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

// Static CSS styles - created once, never recreated
const PROJECT_STYLES = `
  @keyframes projectItemEnter {
    0% {
      opacity: 0;
      transform: translateY(50px);
    }
    100% {
      opacity: 1;
      transform: translateY(0);
    }
  }
  
  @keyframes projectCardEnter {
    0% {
      opacity: 0;
      transform: translateX(var(--card-offset, 0));
    }
    100% {
      opacity: 1;
      transform: translateX(0);
    }
  }
  
  .animate-project-item-enter {
    animation: projectItemEnter 0.6s ease-out both;
  }
  
  .animate-project-card-enter {
    animation: projectCardEnter 0.5s ease-out both;
  }
`;

// Logo path mapping - pre-computed for performance
const LOGO_PATHS = {
  MarketJD: {
    dark: "/logo-horizontal-dark.svg",
    light: "/logo-horizontal-light.svg",
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
  },
  {
    id: 2,
    title: "TechShowcase",
    subtitle:
      "Modern, interactive portfolio website featuring smooth animations, AI-powered assistant, 3D carousel, and responsive design. Built with React, TypeScript, Framer Motion, and advanced UI components.",
    date: "2025 - Present",
    route: "/portfolio",
    technologies: ["React", "TypeScript", "Framer Motion", "Vite"],
    status: "Active",
  },
] as const;

// Pre-compute static class name combinations - created once, reused
const CLASS_NAMES = {
  logoContainerBase:
    "relative flex-shrink-0 rounded-xl overflow-hidden bg-gradient-to-br from-primary/10 via-background/50 to-background/30 border border-border/40 group-hover:border-primary/60 transition-all duration-500",
  contentBase: "relative flex flex-col gap-6 md:gap-8",
  cardBase:
    "relative group bg-background/80 backdrop-blur-xl border border-border/60 rounded-2xl sm:rounded-3xl overflow-hidden transition-all duration-500 ease-out animate-project-card-enter",
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

// Memoized status badge component - prevents recreation
const StatusBadge = memo(({ status }: { status: string }) => (
  <div className="absolute top-4 right-4 z-10">
    <Badge
      variant="success"
      size="sm"
      className="backdrop-blur-md bg-green-500/90 text-white border-0 shadow-lg"
    >
      <span className="relative flex h-2 w-2 mr-1.5">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
        <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
      </span>
      {status}
    </Badge>
  </div>
));
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
            className="text-xs font-medium hover:bg-primary/10 hover:border-primary/50 transition-colors cursor-default"
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
        className="relative w-full mb-8 sm:mb-12 md:mb-16 animate-project-item-enter"
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
            <div className={logoContainerClassName}>
              <ProjectLogo logoPath={logoPath} title={project.title} />
              <StatusBadge status={project.status} />
            </div>

            {/* Content Section */}
            <div className="flex-1 flex flex-col justify-between min-w-0">
              <div className="space-y-4 sm:space-y-5">
                {/* Title and Date */}
                <div className="space-y-3">
                  <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold leading-tight transition-all duration-300 group-hover:text-primary group-hover:translate-x-1">
                    {project.title}
                  </h3>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Calendar className="w-4 h-4 flex-shrink-0" />
                    <span className="font-medium">{project.date}</span>
                  </div>
                </div>

                {/* Description */}
                <p className="text-sm sm:text-base text-muted-foreground leading-relaxed line-clamp-3 sm:line-clamp-none">
                  {project.subtitle}
                </p>

                {/* Technology Tags */}
                <div className="flex flex-wrap gap-2 pt-2">
                  {technologyBadges}
                </div>
              </div>

              {/* CTA Button */}
              <div className="pt-4 sm:pt-6">
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
                  {/* Button hover effect */}
                  <div className="absolute inset-0 bg-primary/10 -translate-x-full group-hover/btn:translate-x-0 transition-transform duration-300" />
                </Button>
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
    <div id="projects" className={CONTAINER_CLASSES}>
      <section className={SECTION_CLASSES}>
        <div className={HEADER_CLASSES}>
          <div className={TITLE_WRAPPER_CLASSES}>
            <FolderKanban className={ICON_CLASSES} />
            <ScrollReveal
              size="xl"
              align="center"
              variant="default"
              enableBlur={false}
              baseOpacity={0.1}
              baseRotation={0}
              blurStrength={0}
            >
              Projects
            </ScrollReveal>
          </div>
          <p className={SUBTITLE_CLASSES}>Explore my latest work...</p>
        </div>

        {/* Projects List Container */}
        <div className="relative">
          {/* Vertical timeline line (hidden on mobile) */}
          {!isMobile && (
            <div className="hidden md:block absolute left-1/2 -translate-x-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-transparent via-primary/20 to-transparent" />
          )}

          {/* Projects List */}
          <div className="relative space-y-0">{projectItems}</div>
        </div>
      </section>
      <style>{PROJECT_STYLES}</style>
    </div>
  );
};

export const ProjectsSection = memo(ProjectsSectionComponent);