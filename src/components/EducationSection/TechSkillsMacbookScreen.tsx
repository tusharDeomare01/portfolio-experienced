import { memo, useMemo } from "react";
import { useAppSelector } from "@/store/hooks";
import { selectTheme } from "@/store/hooks";

// Background styles — hoisted to module scope (allocated once)
const BG_STYLES = {
  dark: {
    background:
      "linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 50%, #0a0a0a 100%)",
  },
  light: {
    background:
      "linear-gradient(135deg, #f5f5f5 0%, #ffffff 50%, #f5f5f5 100%)",
  },
} as const;

// Animation style — hoisted to module scope
const SCROLL_ANIMATION_STYLE = {
  animation: "scrollTechSkills 30s linear infinite",
} as const;

const TechSkillsMacbookScreen = memo(
  ({
    skills,
    className = "",
  }: {
    skills: string[];
    className?: string;
  }) => {
    const theme = useAppSelector(selectTheme);
    const isDarkMode = theme === "dark";

    // Combine all skills into a single string (only recompute when skills change)
    const skillsText = useMemo(() => skills.join(" * "), [skills]);

    // Create loop copies — only recreate when skillsText or theme changes
    const loopCopies = useMemo(() => {
      const textClass = `font-bold text-base sm:text-lg md:text-xl lg:text-2xl ${
        isDarkMode ? "text-white" : "text-gray-900"
      }`;
      const starClass = `mx-2 sm:mx-3 md:mx-4 lg:mx-6 font-bold text-base sm:text-lg md:text-xl lg:text-2xl ${
        isDarkMode ? "text-primary/70" : "text-primary/80"
      }`;

      const copies = [];
      for (let i = 0; i < 6; i++) {
        copies.push(
          <span key={i} className="whitespace-nowrap inline-block">
            <span className={textClass}>{skillsText}</span>
            <span className={starClass}>*</span>
          </span>
        );
      }
      return copies;
    }, [skillsText, isDarkMode]);

    return (
      <div
        className={`w-full h-full flex items-center justify-center overflow-hidden ${className}`}
        style={isDarkMode ? BG_STYLES.dark : BG_STYLES.light}
      >
        <div
          className="flex items-center will-change-transform"
          style={SCROLL_ANIMATION_STYLE}
        >
          {loopCopies}
        </div>
      </div>
    );
  }
);

TechSkillsMacbookScreen.displayName = "TechSkillsMacbookScreen";

export default TechSkillsMacbookScreen;
