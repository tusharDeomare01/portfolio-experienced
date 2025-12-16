import { User } from "lucide-react";
import ScrollReveal from "../lightswind/scroll-reveal";

export const AboutSection = () => {
  return (
    <div
      id="about"
      className="text-foreground max-w-7xl mx-auto w-full px-4 sm:px-6 py-12 sm:py-16 md:py-20 space-y-4 sm:space-y-6 min-h-screen flex flex-col justify-center"
    >
      <div className="flex items-baseline gap-4 mb-2">
        <User className="w-8 h-8 md:w-10 md:h-10 lg:w-12 lg:h-12 text-primary flex-shrink-0 mt-1 md:mt-1.5 lg:mt-2" />
        <ScrollReveal
          size="xl"
          align="left"
          variant="default"
          enableBlur={true}
          blurStrength={5}
          baseRotation={0}
        >
          About Me
        </ScrollReveal>
      </div>

      <div className="space-y-3 sm:space-y-4 text-muted-foreground text-xs sm:text-sm max-w-3xl leading-relaxed">
        <ScrollReveal
          size="sm"
          align="left"
          variant="muted"
          enableBlur={true}
          blurStrength={5}
          baseRotation={0}
        >
          I'm a developer who enjoys turning ideas into working software. I
          focus on writing clean, maintainable code and building things that
          people actually find useful.
        </ScrollReveal>
        <ScrollReveal
          size="sm"
          align="left"
          variant="muted"
          enableBlur={true}
          blurStrength={5}
          baseRotation={0}
        >
          When I'm not coding, I'm usually learning something new or exploring
          different ways to solve problems. I believe good software comes from
          understanding the problem first, then finding the right solution—not
          the other way around.
        </ScrollReveal>
        <ScrollReveal
          size="sm"
          align="left"
          variant="muted"
          enableBlur={true}
          blurStrength={5}
          baseRotation={0}
        >
          I'm always open to interesting projects and conversations. If you'd
          like to work together or just chat about technology, feel free to
          reach out.
        </ScrollReveal>
      </div>
    </div>
  );
};
