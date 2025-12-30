import { memo, useMemo } from "react";
import { ScrollReveal } from "../lightswind/scroll-reveal";
import { Badge } from "../lightswind/badge.tsx";
import { MacbookScroll } from "../ui/macbook-scroll";
import TechSkillsPresentation from "./TechSkillsPresentation";
import { Users } from "lucide-react";

const SOFT_SKILLS = [
  "Leadership",
  "Problem Solving",
  "Agile Methodologies",
  "Mentorship",
  "Strategic Thinking",
  "Cross-Team Collaboration",
] as const;

function ProfessionalProfile() {
  // Memoize badge components to prevent re-renders
  const softSkillBadges = useMemo(
    () =>
      SOFT_SKILLS.map((skill) => (
        <div key={skill} title={skill}>
          <Badge
            variant="default"
            size="lg"
            className="text-sm font-semibold bg-gradient-to-r from-pink-500/90 to-purple-500/90 text-white border-0 hover:from-pink-500 hover:to-purple-500 hover:scale-110 hover:shadow-lg transition-all duration-300 cursor-default"
          >
            {skill}
          </Badge>
        </div>
      )),
    []
  );

  // Memoize MacbookScroll title to prevent re-creation
  const macbookTitle = useMemo(
    () => (
      <span>
        Skills & Technologies <br /> Transforming Ideas into Reality
      </span>
    ),
    []
  );
  return (
    <section id="skills" className="space-y-12 mt-8 mb-10 !scroll-smooth">
      {/* Soft Skills Section */}
      <div className="space-y-6">
        <div className="flex items-center gap-3 mb-4">
          <h3 className="text-2xl md:text-3xl font-bold text-foreground">
            Soft Skills
          </h3>
          <div className="flex-1 h-px bg-gradient-to-r from-border via-primary/30 to-transparent" />
        </div>

        <div className="flex flex-wrap gap-3">
          {softSkillBadges}
        </div>
      </div>
      {/* Header */}
      <div className="flex items-baseline gap-4 mb-8">
        <Users className="w-8 h-8 md:w-10 md:h-10 lg:w-12 lg:h-12 text-primary flex-shrink-0 mt-1 md:mt-1.5 lg:mt-2" />
        <ScrollReveal
          size="xl"
          align="left"
          variant="default"
          enableBlur={false}
          baseOpacity={0.1}
          baseRotation={0}
          blurStrength={0}
          threshold={0.2}
        >
          Technical Skills
        </ScrollReveal>
      </div>

      {/* MacbookScroll with Tech Skills Presentation */}
      <div className="mb-24 -mx-4 sm:-mx-6 md:mx-0 sm:h-[80vh] md:h-[180vh] lg:h-[180vh] xl:h-[180vh]">
        <MacbookScroll title={macbookTitle} showGradient={false}>
          <TechSkillsPresentation />
        </MacbookScroll>
      </div>
    </section>
  );
}

export default memo(ProfessionalProfile);
