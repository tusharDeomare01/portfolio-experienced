import { memo, useState, useEffect, useMemo, useCallback, useRef } from "react";
import { useAppSelector } from "@/store/hooks";
import { selectTheme } from "@/store/hooks";
import {
  Code2,
  Globe,
  Server,
  Database,
  Cloud,
  Wrench,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

interface SkillCategory {
  title: string;
  icon: React.ComponentType<{ className?: string }>;
  skills: string[];
  color: string;
  gradient: string;
}

interface TechSkillsPresentationProps {
  className?: string;
}

const SKILL_CATEGORIES: SkillCategory[] = [
  {
    title: "Languages",
    icon: Code2,
    skills: ["JavaScript", "TypeScript"],
    color: "blue",
    gradient: "from-blue-500/20 via-blue-600/10 to-transparent",
  },
  {
    title: "Frontend Technologies",
    icon: Globe,
    skills: [
      "HTML",
      "CSS",
      "ReactJS",
      "Next.js",
      "Redux Toolkit",
      "Redux Persist",
    ],
    color: "purple",
    gradient: "from-purple-500/20 via-purple-600/10 to-transparent",
  },
  {
    title: "Backend Technologies",
    icon: Server,
    skills: ["Node.js", "Express.js", "NestJS", "REST APIs", "GraphQL"],
    color: "green",
    gradient: "from-green-500/20 via-green-600/10 to-transparent",
  },
  {
    title: "Databases & Data Access",
    icon: Database,
    skills: ["MySQL", "MongoDB", "Prisma", "Mongoose"],
    color: "orange",
    gradient: "from-orange-500/20 via-orange-600/10 to-transparent",
  },
  {
    title: "DevOps & Cloud",
    icon: Cloud,
    skills: ["Docker", "Kubernetes", "YAML", "AWS"],
    color: "teal",
    gradient: "from-teal-500/20 via-teal-600/10 to-transparent",
  },
  {
    title: "Developer Tools",
    icon: Wrench,
    skills: ["Git", "GitHub", "Bitbucket", "Jira", "ClickUp"],
    color: "indigo",
    gradient: "from-indigo-500/20 via-indigo-600/10 to-transparent",
  },
];

const TRANSITION_DURATION = 150;
const AUTO_ADVANCE_INTERVAL = 4000;

// Memoize color classes - created once and reused
const COLOR_CLASSES = {
  dark: {
    blue: {
      bg: "bg-blue-500/15",
      border: "border-blue-400/40",
      text: "text-blue-300",
      badge: "bg-gradient-to-br from-blue-500/25 to-blue-600/15 text-blue-200 border-blue-400/50",
      iconBg: "bg-gradient-to-br from-blue-500/20 to-blue-600/10",
    },
    purple: {
      bg: "bg-purple-500/15",
      border: "border-purple-400/40",
      text: "text-purple-300",
      badge: "bg-gradient-to-br from-purple-500/25 to-purple-600/15 text-purple-200 border-purple-400/50",
      iconBg: "bg-gradient-to-br from-purple-500/20 to-purple-600/10",
    },
    green: {
      bg: "bg-green-500/15",
      border: "border-green-400/40",
      text: "text-green-300",
      badge: "bg-gradient-to-br from-green-500/25 to-green-600/15 text-green-200 border-green-400/50",
      iconBg: "bg-gradient-to-br from-green-500/20 to-green-600/10",
    },
    orange: {
      bg: "bg-orange-500/15",
      border: "border-orange-400/40",
      text: "text-orange-300",
      badge: "bg-gradient-to-br from-orange-500/25 to-orange-600/15 text-orange-200 border-orange-400/50",
      iconBg: "bg-gradient-to-br from-orange-500/20 to-orange-600/10",
    },
    teal: {
      bg: "bg-teal-500/15",
      border: "border-teal-400/40",
      text: "text-teal-300",
      badge: "bg-gradient-to-br from-teal-500/25 to-teal-600/15 text-teal-200 border-teal-400/50",
      iconBg: "bg-gradient-to-br from-teal-500/20 to-teal-600/10",
    },
    indigo: {
      bg: "bg-indigo-500/15",
      border: "border-indigo-400/40",
      text: "text-indigo-300",
      badge: "bg-gradient-to-br from-indigo-500/25 to-indigo-600/15 text-indigo-200 border-indigo-400/50",
      iconBg: "bg-gradient-to-br from-indigo-500/20 to-indigo-600/10",
    },
  },
  light: {
    blue: {
      bg: "bg-blue-50/80",
      border: "border-blue-500/60",
      text: "text-blue-600",
      badge: "bg-gradient-to-br from-blue-100/90 to-blue-200/80 text-blue-700 border-blue-500/60",
      iconBg: "bg-gradient-to-br from-blue-100/80 to-blue-200/60",
    },
    purple: {
      bg: "bg-purple-50/80",
      border: "border-purple-500/60",
      text: "text-purple-600",
      badge: "bg-gradient-to-br from-purple-100/90 to-purple-200/80 text-purple-700 border-purple-500/60",
      iconBg: "bg-gradient-to-br from-purple-100/80 to-purple-200/60",
    },
    green: {
      bg: "bg-green-50/80",
      border: "border-green-500/60",
      text: "text-green-600",
      badge: "bg-gradient-to-br from-green-100/90 to-green-200/80 text-green-700 border-green-500/60",
      iconBg: "bg-gradient-to-br from-green-100/80 to-green-200/60",
    },
    orange: {
      bg: "bg-orange-50/80",
      border: "border-orange-500/60",
      text: "text-orange-600",
      badge: "bg-gradient-to-br from-orange-100/90 to-orange-200/80 text-orange-700 border-orange-500/60",
      iconBg: "bg-gradient-to-br from-orange-100/80 to-orange-200/60",
    },
    teal: {
      bg: "bg-teal-50/80",
      border: "border-teal-500/60",
      text: "text-teal-600",
      badge: "bg-gradient-to-br from-teal-100/90 to-teal-200/80 text-teal-700 border-teal-500/60",
      iconBg: "bg-gradient-to-br from-teal-100/80 to-teal-200/60",
    },
    indigo: {
      bg: "bg-indigo-50/80",
      border: "border-indigo-500/60",
      text: "text-indigo-600",
      badge: "bg-gradient-to-br from-indigo-100/90 to-indigo-200/80 text-indigo-700 border-indigo-500/60",
      iconBg: "bg-gradient-to-br from-indigo-100/80 to-indigo-200/60",
    },
  },
} as const;

// Memoized background styles
const BACKGROUND_STYLES = {
  dark: {
    background: "radial-gradient(ellipse at center, #1a1a1a 0%, #0a0a0a 100%)",
  },
  light: {
    background: "radial-gradient(ellipse at center, #ffffff 0%, #f5f5f5 100%)",
  },
} as const;

// Memoized text shadow styles
const TEXT_SHADOW_STYLES = {
  dark: { textShadow: "0 2px 8px rgba(0,0,0,0.5)" },
  light: { textShadow: "0 2px 4px rgba(0,0,0,0.1)" },
} as const;

const TechSkillsPresentation = memo(
  ({ className = "" }: TechSkillsPresentationProps) => {
    const theme = useAppSelector(selectTheme);
    const isDarkMode = theme === "dark";
    const [currentSlide, setCurrentSlide] = useState(0);
    const [isHovered, setIsHovered] = useState(false);
    const [isTransitioning, setIsTransitioning] = useState(false);
    const intervalRef = useRef<number | null>(null);
    const transitionTimeoutRef = useRef<number | null>(null);

    // Get color classes based on theme
    const colorClasses = useMemo(
      () => (isDarkMode ? COLOR_CLASSES.dark : COLOR_CLASSES.light),
      [isDarkMode]
    );

    // Cleanup function for transitions
    const clearTransitionTimeout = useCallback(() => {
      if (transitionTimeoutRef.current !== null) {
        clearTimeout(transitionTimeoutRef.current);
        transitionTimeoutRef.current = null;
      }
    }, []);

    // Optimized slide change with single timeout
    const changeSlide = useCallback(
      (newIndex: number) => {
        if (newIndex === currentSlide || isTransitioning) return;
        
        clearTransitionTimeout();
        setIsTransitioning(true);
        
        transitionTimeoutRef.current = window.setTimeout(() => {
          setCurrentSlide(newIndex);
          setIsTransitioning(false);
          transitionTimeoutRef.current = null;
        }, TRANSITION_DURATION);
      },
      [currentSlide, isTransitioning, clearTransitionTimeout]
    );

    // Auto-advance slides
    useEffect(() => {
      if (isHovered || isTransitioning) {
        if (intervalRef.current !== null) {
          clearInterval(intervalRef.current);
          intervalRef.current = null;
        }
        return;
      }

      intervalRef.current = window.setInterval(() => {
        setIsTransitioning(true);
        transitionTimeoutRef.current = window.setTimeout(() => {
          setCurrentSlide((prev) => (prev + 1) % SKILL_CATEGORIES.length);
          setIsTransitioning(false);
          transitionTimeoutRef.current = null;
        }, TRANSITION_DURATION);
      }, AUTO_ADVANCE_INTERVAL);

      return () => {
        if (intervalRef.current !== null) {
          clearInterval(intervalRef.current);
          intervalRef.current = null;
        }
      };
    }, [isHovered, isTransitioning]);

    // Cleanup on unmount
    useEffect(() => {
      return () => {
        if (intervalRef.current !== null) {
          clearInterval(intervalRef.current);
        }
        clearTransitionTimeout();
      };
    }, [clearTransitionTimeout]);

    const nextSlide = useCallback(() => {
      const newIndex = (currentSlide + 1) % SKILL_CATEGORIES.length;
      changeSlide(newIndex);
    }, [currentSlide, changeSlide]);

    const prevSlide = useCallback(() => {
      const newIndex = (currentSlide - 1 + SKILL_CATEGORIES.length) % SKILL_CATEGORIES.length;
      changeSlide(newIndex);
    }, [currentSlide, changeSlide]);

    const currentCategory = SKILL_CATEGORIES[currentSlide];
    const Icon = currentCategory.icon;
    const colors = colorClasses[currentCategory.color as keyof typeof colorClasses];

    // Memoize handlers
    const handleMouseEnter = useCallback(() => setIsHovered(true), []);
    const handleMouseLeave = useCallback(() => setIsHovered(false), []);

    // Get memoized styles
    const backgroundStyle = isDarkMode ? BACKGROUND_STYLES.dark : BACKGROUND_STYLES.light;
    const textShadowStyle = isDarkMode ? TEXT_SHADOW_STYLES.dark : TEXT_SHADOW_STYLES.light;

    return (
      <div
        className={`w-full h-full flex flex-col items-center justify-center overflow-hidden relative ${className}`}
        style={backgroundStyle}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {/* Animated Background Gradient */}
        <div
          className={`absolute inset-0 bg-gradient-to-br ${currentCategory.gradient} ${
            isDarkMode ? "opacity-50" : "opacity-30"
          } transition-opacity duration-700`}
        />

        {/* Slide Content */}
        <div
          className={`w-full h-full flex flex-col items-center justify-center px-3 py-4 md:px-4 md:py-5 overflow-hidden relative z-10 transition-all duration-500 ease-out ${
            isTransitioning
              ? "opacity-0 translate-x-12"
              : "opacity-100 translate-x-0"
          }`}
        >
          {/* Category Icon & Title */}
          <div className="flex flex-col items-center justify-center mb-3 md:mb-4 w-full flex-shrink-0">
            <div
              className={`p-3 md:p-4 rounded-xl ${colors.iconBg} ${colors.border} border-2 mb-3 md:mb-4 shadow-2xl backdrop-blur-sm relative overflow-hidden group animate-icon-enter ${
                isDarkMode ? "shadow-blue-500/20" : "shadow-blue-200/40"
              }`}
            >
              <div
                className={`absolute inset-0 bg-gradient-to-br ${
                  isDarkMode
                    ? "from-white/10 to-transparent"
                    : "from-white/30 to-transparent"
                } opacity-0 group-hover:opacity-100 transition-opacity duration-300`}
              />
              <Icon
                className={`w-7 h-7 md:w-9 md:h-9 lg:w-10 lg:h-10 ${colors.text} relative z-10 drop-shadow-sm`}
              />
            </div>
            <h2
              className={`text-xl md:text-2xl lg:text-3xl font-extrabold ${
                isDarkMode ? "text-white" : "text-gray-900"
              } text-center mb-2 tracking-tight px-2 animate-title-enter`}
              style={textShadowStyle}
            >
              {currentCategory.title}
            </h2>
            <div
              className={`h-0.5 md:h-1 bg-gradient-to-r from-transparent via-current to-transparent ${colors.text} rounded-full mt-1 w-20 animate-line-enter ${
                isDarkMode ? "opacity-80" : "opacity-100"
              }`}
            />
          </div>

          {/* Skills Grid */}
          <div
            className="flex flex-wrap justify-center items-center gap-2 md:gap-2.5 lg:gap-3 w-full px-2 md:px-3 overflow-y-auto flex-1 min-h-0 max-h-full pb-2 animate-skills-enter"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            {currentCategory.skills.map((skill, index) => (
              <SkillBadge
                key={skill}
                skill={skill}
                index={index}
                colors={colors}
                isDarkMode={isDarkMode}
              />
            ))}
          </div>

          {/* Slide Counter */}
          <div
            className={`mt-3 md:mt-4 text-xs md:text-sm font-semibold flex-shrink-0 flex items-center gap-1.5 animate-counter-enter ${
              isDarkMode ? "text-gray-300" : "text-gray-600"
            }`}
          >
            <span
              className={`px-2 py-0.5 rounded-md ${colors.bg} ${colors.border} border`}
            >
              {currentSlide + 1}
            </span>
            <span>/</span>
            <span>{SKILL_CATEGORIES.length}</span>
          </div>
        </div>

        {/* Navigation Arrows */}
        <NavButton
          onClick={prevSlide}
          isDarkMode={isDarkMode}
          direction="left"
          ariaLabel="Previous slide"
        />
        <NavButton
          onClick={nextSlide}
          isDarkMode={isDarkMode}
          direction="right"
          ariaLabel="Next slide"
        />

        {/* Slide Indicators (Dots) */}
        <div className="mt-[1rem]">
          <SlideIndicators
            totalSlides={SKILL_CATEGORIES.length}
            currentSlide={currentSlide}
            onSlideClick={changeSlide}
            isDarkMode={isDarkMode}
            activeColors={colors}
          />
        </div>

        <style>{`
        .overflow-y-auto::-webkit-scrollbar {
          display: none;
        }
        
        @keyframes iconEnter {
          0% {
            opacity: 0;
            transform: scale(0) rotate(-180deg);
          }
          100% {
            opacity: 1;
            transform: scale(1) rotate(0deg);
          }
        }
        
        @keyframes titleEnter {
          0% {
            opacity: 0;
            transform: translateY(15px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes lineEnter {
          0% {
            width: 0;
            opacity: 0;
          }
          100% {
            width: 80px;
            opacity: 1;
          }
        }
        
        @keyframes skillsEnter {
          0% {
            opacity: 0;
          }
          100% {
            opacity: 1;
          }
        }
        
        @keyframes counterEnter {
          0% {
            opacity: 0;
            transform: scale(0.8);
          }
          100% {
            opacity: 1;
            transform: scale(1);
          }
        }
        
        @keyframes badgeEnter {
          0% {
            opacity: 0;
            transform: scale(0.7) translateY(15px);
          }
          100% {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }
        
        .animate-icon-enter {
          animation: iconEnter 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) 0.2s both;
        }
        
        .animate-title-enter {
          animation: titleEnter 0.5s ease-out 0.35s both;
        }
        
        .animate-line-enter {
          animation: lineEnter 0.6s ease-out 0.5s both;
        }
        
        .animate-skills-enter {
          animation: skillsEnter 0.5s ease-out 0.4s both;
        }
        
        .animate-counter-enter {
          animation: counterEnter 0.4s ease-out 0.9s both;
        }
        
        .animate-badge-enter {
          animation: badgeEnter 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) both;
        }
      `}</style>
      </div>
    );
  }
);

TechSkillsPresentation.displayName = "TechSkillsPresentation";

// Memoized Navigation Button Component
const NavButton = memo(
  ({
    onClick,
    isDarkMode,
    direction,
    ariaLabel,
  }: {
    onClick: () => void;
    isDarkMode: boolean;
    direction: "left" | "right";
    ariaLabel: string;
  }) => {
    const Icon = direction === "left" ? ChevronLeft : ChevronRight;
    const positionClass = direction === "left" ? "left-1 md:left-2" : "right-1 md:right-2";

    return (
      <button
        onClick={onClick}
        className={`absolute ${positionClass} top-1/2 -translate-y-1/2 p-2 md:p-2.5 rounded-full ${
          isDarkMode
            ? "bg-white/10 hover:bg-white/20"
            : "bg-gray-900/10 hover:bg-gray-900/20"
        } backdrop-blur-md transition-all duration-300 z-20 group cursor-pointer border-2 ${
          isDarkMode
            ? "border-white/20 hover:border-white/40"
            : "border-gray-700/30 hover:border-gray-700/50"
        } ${
          isDarkMode ? "shadow-xl hover:shadow-2xl" : "shadow-lg hover:shadow-xl"
        } hover:scale-110`}
        aria-label={ariaLabel}
      >
        <Icon
          className={`w-4 h-4 md:w-5 md:h-5 ${
            isDarkMode ? "text-white" : "text-gray-800"
          } transition-transform group-hover:scale-125 drop-shadow-sm`}
        />
      </button>
    );
  }
);

NavButton.displayName = "NavButton";

// Memoized Slide Indicators Component
const SlideIndicators = memo(
  ({
    totalSlides,
    currentSlide,
    onSlideClick,
    isDarkMode,
    activeColors,
  }: {
    totalSlides: number;
    currentSlide: number;
    onSlideClick: (index: number) => void;
    isDarkMode: boolean;
    activeColors: { bg: string; border: string; text: string; badge: string; iconBg: string };
  }) => {
    return (
      <div className="absolute bottom-2 md:bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5 md:gap-2 z-20">
        {Array.from({ length: totalSlides }, (_, index) => (
          <button
            key={index}
            onClick={() => onSlideClick(index)}
            className={`transition-all duration-300 rounded-full cursor-pointer ${
              index === currentSlide
                ? `w-8 h-2 md:w-10 md:h-2.5 ${activeColors.bg} ${activeColors.border} border-2 ${
                    isDarkMode ? "shadow-lg" : "shadow-md"
                  }`
                : `w-2 h-2 md:w-2.5 md:h-2.5 ${
                    isDarkMode
                      ? "bg-white/30 hover:bg-white/60"
                      : "bg-gray-400/60 hover:bg-gray-600"
                  } hover:scale-125`
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    );
  }
);

SlideIndicators.displayName = "SlideIndicators";

// Memoized Skill Badge Component
const SkillBadge = memo(
  ({
    skill,
    index,
    colors,
    isDarkMode,
  }: {
    skill: string;
    index: number;
    colors: { bg: string; border: string; text: string; badge: string; iconBg: string };
    isDarkMode: boolean;
  }) => {
    const badgeStyle = useMemo(
      () => ({ animationDelay: `${0.5 + index * 0.06}s` }),
      [index]
    );

    return (
      <div
        style={badgeStyle}
        className={`px-4 md:px-5 py-2 md:py-2.5 rounded-lg ${
          colors.badge
        } border-2 backdrop-blur-md font-bold text-xs md:text-sm lg:text-base cursor-pointer transition-all duration-300 ${
          isDarkMode ? "shadow-lg hover:shadow-2xl" : "shadow-md hover:shadow-lg"
        } relative overflow-hidden group animate-badge-enter hover:scale-105 hover:-translate-y-1 hover:rotate-1 ${
          isDarkMode ? "hover:brightness-125" : "hover:brightness-110"
        }`}
      >
        <div
          className={`absolute inset-0 bg-gradient-to-br ${
            isDarkMode
              ? "from-white/20 to-transparent"
              : "from-white/40 to-transparent"
          } opacity-0 group-hover:opacity-100 transition-opacity duration-300`}
        />
        <span className={`relative z-10 ${isDarkMode ? "" : "font-semibold"}`}>
          {skill}
        </span>
      </div>
    );
  }
);

SkillBadge.displayName = "SkillBadge";

export default TechSkillsPresentation;