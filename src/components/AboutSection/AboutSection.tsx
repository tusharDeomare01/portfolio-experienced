import { memo, useMemo } from "react";
import { User } from "lucide-react";
import ScrollReveal from "../lightswind/scroll-reveal";

// const PARAGRAPH_REVEAL_PROPS = {
//   size: "sm" as const,
//   align: "left" as const,
//   variant: "muted" as const,
//   enableBlur: true,
//   blurStrength: 5,
//   baseRotation: 0,
// } as const;

// Extract static text content to constants
const ABOUT_TEXTS = [
  "I'm a developer who enjoys turning ideas into working software. I focus on writing clean, maintainable code and building things that people actually find useful.",
  "When I'm not coding, I'm usually learning something new or exploring different ways to solve problems. I believe good software comes from understanding the problem first, then finding the right solution—not the other way around.",
  "I'm always open to interesting projects and conversations. If you'd like to work together or just chat about technology, feel free to reach out.",
] as const;

// Extract className strings to constants
const CONTAINER_CLASSES =
  "text-foreground max-w-7xl mx-auto w-full px-4 sm:px-6 py-12 sm:py-16 md:py-20 space-y-4 sm:space-y-6 min-h-screen flex flex-col justify-center";
const HEADER_CLASSES = "flex items-baseline gap-4 mb-2";
const ICON_CLASSES =
  "w-8 h-8 md:w-10 md:h-10 lg:w-12 lg:h-12 text-primary flex-shrink-0 mt-1 md:mt-1.5 lg:mt-2";
const CONTENT_CLASSES =
  "space-y-3 sm:space-y-4 text-muted-foreground text-xs sm:text-sm max-w-3xl leading-relaxed";

const AboutSectionComponent = () => {
  // Memoize paragraph elements to prevent recreation on re-renders
  const paragraphElements = useMemo(
    () =>
      ABOUT_TEXTS.map((text, index) => (
        // <ScrollReveal key={`paragraph-${index}`} {...PARAGRAPH_REVEAL_PROPS}>
        //   {text}
        // </ScrollReveal>
        <div key={`about-paragraph-${index}`} id={`${index}`} className="font-bold text-xl py-3">
          {text}
        </div>
      )),
    []
  );

  return (
    <div id="about" className={CONTAINER_CLASSES}>
      <div className={HEADER_CLASSES}>
        <User className={ICON_CLASSES} />
        <ScrollReveal
          size="xl"
          align="left"
          variant="default"
          enableBlur={false}
          baseOpacity={0.1}
          baseRotation={0}
          blurStrength={0}
        >
          About Me
        </ScrollReveal>
      </div>

      <div className={CONTENT_CLASSES}>{paragraphElements}</div>
    </div>
  );
};

// Memoize component to prevent unnecessary re-renders when parent updates
export const AboutSection = memo(AboutSectionComponent);
