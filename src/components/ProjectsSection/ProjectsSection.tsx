import { useState, useMemo, useCallback, memo } from "react";
import { useNavigate } from "react-router-dom";
import { selectTheme } from "@/store/hooks";
import { useAppSelector } from "@/store/hooks";
// @ts-ignore - interactive-card is a JS file without type definitions
import { InteractiveCard } from "../lightswind/interactive-card";
// @ts-ignore - button is a JS file without type definitions
import { Button } from "../lightswind/button";
import { Badge } from "../lightswind/badge";
import { ScrollReveal } from "../lightswind/scroll-reveal";
import { ArrowRight, Calendar, FolderKanban } from "lucide-react";

const CONTAINER_CLASSES =
  "min-h-screen flex flex-col justify-center !scroll-smooth transition-all duration-400 ease-in animate-fade-in-up";
const SECTION_CLASSES =
  "max-w-7xl mx-auto px-4 sm:px-6 py-12 sm:py-16 md:py-16 w-full !scroll-smooth";
const HEADER_CLASSES = "text-center mb-8 sm:mb-16";
const TITLE_WRAPPER_CLASSES = "mb-4 flex items-baseline justify-center gap-4";
const ICON_CLASSES =
  "w-10 h-10 md:w-12 md:h-12 lg:w-14 lg:h-14 text-primary flex-shrink-0 mt-1.5 md:mt-2 lg:mt-2.5";
const SUBTITLE_CLASSES = "text-lg font-bold";
const GRID_CLASSES =
  "grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 lg:gap-10 justify-items-center";
const CARD_WRAPPER_CLASSES = "w-full max-w-md project-card-wrapper group";

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

interface ProjectCardProps {
  project: (typeof PROJECTS_DATA)[number];
  isDarkMode: boolean;
  isHovered: boolean;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
  onNavigate: (route: string) => void;
}

const ProjectCard = memo(
  ({
    project,
    isDarkMode,
    isHovered,
    onMouseEnter,
    onMouseLeave,
    onNavigate,
  }: ProjectCardProps) => {
    // Pre-compute logo path based on theme
    const logoPath = useMemo(() => {
      const logoConfig = LOGO_PATHS[project.title as keyof typeof LOGO_PATHS];
      return logoConfig
        ? isDarkMode
          ? logoConfig.dark
          : logoConfig.light
        : "";
    }, [project.title, isDarkMode]);

    // Memoize image classes to prevent recalculation
    const imageContainerClasses = useMemo(
      () =>
        logoPath
          ? "bg-transparent h-[200px] sm:h-64 md:h-64"
          : "bg-background/50 h-52 sm:h-64",
      [logoPath]
    );

    const imageClasses = useMemo(
      () =>
        logoPath
          ? `w-full h-full max-w-full max-h-full sm:max-w-[80%] sm:max-h-[70%] md:max-w-[75%] md:max-h-[65%] object-contain px-4 py-2 sm:px-4 sm:py-4 md:px-4 md:py-4 transition-transform duration-300 ${
              isHovered ? "scale-110" : "scale-100"
            }`
          : `w-full h-full object-cover transition-transform duration-300 ${
              isHovered ? "scale-110" : "scale-100"
            }`,
      [logoPath, isHovered]
    );

    // Memoize title classes
    const titleClasses = useMemo(
      () =>
        `text-2xl sm:text-3xl font-bold leading-tight transition-colors duration-300 ${
          isHovered ? "text-primary" : "text-foreground"
        }`,
      [isHovered]
    );

    // Memoize arrow icon classes
    const arrowClasses = useMemo(
      () =>
        `w-4 h-4 transition-transform duration-300 ${
          isHovered ? "translate-x-1" : ""
        }`,
      [isHovered]
    );

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

    return (
      <div
        className={CARD_WRAPPER_CLASSES}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
      >
        <InteractiveCard
          className="h-full flex flex-col w-full overflow-hidden scroll-smooth"
          InteractiveColor="#07eae6ff"
          borderRadius="24px"
          rotationFactor={0.25}
          tailwindBgClass="bg-background/90 backdrop-blur-xl border border-border/60 shadow-xl hover:shadow-2xl transition-shadow duration-500"
        >
          {/* Image Section */}
          <div
            className={`relative w-full overflow-hidden flex items-center justify-center ${imageContainerClasses}`}
          >
            {logoPath ? (
              <img
                src={logoPath}
                alt={project.title}
                loading="lazy"
                decoding="async"
                className={imageClasses}
              />
            ) : null}

            {/* Status Badge */}
            <div className="absolute top-4 right-4 z-10 flex items-center gap-2">
              <Badge
                variant="success"
                size="sm"
                className="backdrop-blur-sm bg-green-500/90 text-white border-0 shadow-lg"
              >
                <span className="relative flex h-2 w-2 mr-1.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
                </span>
                {project.status}
              </Badge>
            </div>
          </div>

          {/* Content Section */}
          <div className="flex-1 flex flex-col p-6 sm:p-7 space-y-5">
            {/* Title and Date */}
            <div className="space-y-3">
              <h3 className={titleClasses}>{project.title}</h3>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Calendar className="w-4 h-4" />
                <span className="font-medium">{project.date}</span>
              </div>
            </div>

            {/* Description */}
            <p className="text-sm sm:text-base text-muted-foreground leading-relaxed flex-1 line-clamp-3">
              {project.subtitle}
            </p>

            {/* Technology Tags */}
            <div className="flex flex-wrap gap-2 pt-2">{technologyBadges}</div>

            {/* CTA Button */}
            <div className="pt-2">
              <Button
                variant="outline"
                size="lg"
                onClick={() => onNavigate(project.route)}
                className="cursor-pointer w-full group/btn relative overflow-hidden border-2 hover:border-primary transition-all duration-300"
              >
                <span className="relative z-10 flex items-center justify-center gap-2 font-semibold">
                  Explore Project ...
                  <ArrowRight className={arrowClasses} />
                </span>
              </Button>
            </div>
          </div>
        </InteractiveCard>
      </div>
    );
  },
  (prevProps, nextProps) => {
    // Custom comparison function for React.memo
    return (
      prevProps.project.id === nextProps.project.id &&
      prevProps.isDarkMode === nextProps.isDarkMode &&
      prevProps.isHovered === nextProps.isHovered &&
      prevProps.project.title === nextProps.project.title &&
      prevProps.project.subtitle === nextProps.project.subtitle &&
      prevProps.project.date === nextProps.project.date &&
      prevProps.project.route === nextProps.project.route &&
      prevProps.project.status === nextProps.project.status &&
      prevProps.project.technologies.length ===
        nextProps.project.technologies.length &&
      prevProps.project.technologies.every(
        (tech, idx) => tech === nextProps.project.technologies[idx]
      )
    );
  }
);

ProjectCard.displayName = "ProjectCard";

// ============================================================================
// MAIN PROJECTS SECTION COMPONENT
// ============================================================================

const ProjectsSectionComponent = () => {
  const navigate = useNavigate();
  const [hoveredProject, setHoveredProject] = useState<number | null>(null);
  const theme = useAppSelector(selectTheme);

  // Memoize isDarkMode calculation
  const isDarkMode = useMemo(() => theme === "dark", [theme]);

  // Optimized navigation handler
  const handleNavigate = useCallback(
    (route: string) => {
      navigate(route);
    },
    [navigate]
  );

  // Optimized hover handlers with useCallback
  const createHoverHandlers = useCallback(
    (projectId: number) => ({
      onMouseEnter: () => setHoveredProject(projectId),
      onMouseLeave: () => setHoveredProject(null),
    }),
    []
  );

  // Memoize hover handlers for each project - only recreate when needed
  const projectHandlers = useMemo(
    () =>
      PROJECTS_DATA.reduce((acc, project) => {
        acc[project.id] = createHoverHandlers(project.id);
        return acc;
      }, {} as Record<number, { onMouseEnter: () => void; onMouseLeave: () => void }>),
    [createHoverHandlers]
  );

  // Memoize project cards to prevent unnecessary re-renders
  const projectCards = useMemo(
    () =>
      PROJECTS_DATA.map((project) => (
        <ProjectCard
          key={project.id}
          project={project}
          isDarkMode={isDarkMode}
          isHovered={hoveredProject === project.id}
          onMouseEnter={projectHandlers[project.id].onMouseEnter}
          onMouseLeave={projectHandlers[project.id].onMouseLeave}
          onNavigate={handleNavigate}
        />
      )),
    [isDarkMode, hoveredProject, projectHandlers, handleNavigate]
  );

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

        <div className={GRID_CLASSES}>{projectCards}</div>
      </section>
    </div>
  );
};

export const ProjectsSection = memo(ProjectsSectionComponent);
