import { memo, useMemo } from "react";
import { useAppSelector } from "@/store/hooks";
import { selectTheme } from "@/store/hooks";

interface TechSkillsMacbookScreenProps {
  skills: string[];
  className?: string;
}

const TechSkillsMacbookScreen = memo(
  ({ skills, className = "" }: TechSkillsMacbookScreenProps) => {
    const theme = useAppSelector(selectTheme);
    const isDarkMode = theme === "dark";

    // Combine all skills into a single array with stars
    const skillsText = useMemo(() => {
      return skills.join(" * ");
    }, [skills]);

    // Create multiple copies for seamless loop (need enough copies for smooth scrolling)
    const loopCopies = useMemo(() => {
      return Array.from({ length: 6 }, (_, i) => (
        <span key={i} className="whitespace-nowrap inline-block">
          <span
            className={`font-bold text-base sm:text-lg md:text-xl lg:text-2xl ${
              isDarkMode ? "text-white" : "text-gray-900"
            }`}
          >
            {skillsText}
          </span>
          <span
            className={`mx-2 sm:mx-3 md:mx-4 lg:mx-6 font-bold text-base sm:text-lg md:text-xl lg:text-2xl ${
              isDarkMode ? "text-primary/70" : "text-primary/80"
            }`}
          >
            *
          </span>
        </span>
      ));
    }, [skillsText, isDarkMode]);

    return (
      <div
        className={`w-full h-full flex items-center justify-center overflow-hidden ${className}`}
        style={{
          background: isDarkMode
            ? "linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 50%, #0a0a0a 100%)"
            : "linear-gradient(135deg, #f5f5f5 0%, #ffffff 50%, #f5f5f5 100%)",
        }}
      >
        <div
          className="flex items-center will-change-transform"
          style={{
            animation: "scrollTechSkills 30s linear infinite",
          }}
        >
          {loopCopies}
        </div>
        <style>{`
          @keyframes scrollTechSkills {
            0% {
              transform: translateX(0);
            }
            100% {
              transform: translateX(-16.666%);
            }
          }
          @media (prefers-reduced-motion: reduce) {
            .animate-scroll-tech-skills,
            [style*="scrollTechSkills"] {
              animation: none !important;
            }
          }
          @media (max-width: 640px) {
            @keyframes scrollTechSkills {
              0% {
                transform: translateX(0);
              }
              100% {
                transform: translateX(-16.666%);
              }
            }
          }
        `}</style>
      </div>
    );
  }
);

TechSkillsMacbookScreen.displayName = "TechSkillsMacbookScreen";

export default TechSkillsMacbookScreen;
