import { ScrollTimeline } from "../lightswind/scroll-timeline";
import { portfolioData } from "@/lib/portfolioData";
import { Briefcase } from "lucide-react";
import { ScrollReveal } from "../lightswind/scroll-reveal";

export const CareerTimeline = () => {
  // Build description with achievements and technologies if available
  const buildDescription = (career: typeof portfolioData.career[0]) => {
    let desc = career.description || "";
    
    if (career.achievements && career.achievements.length > 0) {
      const achievementsText = career.achievements.join(". ");
      desc = desc ? `${desc} ${achievementsText}.` : achievementsText;
    }
    
    if (career.technologies && career.technologies.length > 0) {
      const techText = `Technologies: ${career.technologies.join(", ")}.`;
      desc = desc ? `${desc} ${techText}` : techText;
    }
    
    return desc || "Professional experience in software development.";
  };

  // Map portfolioData career to ScrollTimeline events format
  const careerEvents = portfolioData.career.map((career) => ({
    year: career.period,
    title: career.title,
    subtitle: career.company,
    description: buildDescription(career),
  }));

  return (
    <div id="career" className="min-h-screen flex flex-col justify-center py-12 sm:py-16 md:py-20 px-4 sm:px-6">
      <div className="text-center mb-6 sm:mb-8">
        <div className="flex items-baseline justify-center gap-4 mb-4">
          <Briefcase className="w-8 h-8 md:w-10 md:h-10 lg:w-12 lg:h-12 text-primary flex-shrink-0 mt-1 md:mt-1.5 lg:mt-2" />
          <ScrollReveal
            size="xl"
            align="center"
            variant="default"
            enableBlur={true}
            staggerDelay={0.05}
          >
            Career Journey
          </ScrollReveal>
        </div>
        <ScrollReveal
          size="sm"
          align="center"
          variant="muted"
          enableBlur={true}
          staggerDelay={0.03}
          containerClassName="max-w-2xl mx-auto"
        >
          An evolving path of leadership, innovation, and impact
        </ScrollReveal>
      </div>
      <div className="[&_div.text-center]:hidden">
        <ScrollTimeline
          events={careerEvents}
          title=""
          subtitle=""
          animationOrder="staggered"
          cardAlignment="alternating"
          cardVariant="elevated"
          parallaxIntensity={0.15}
          revealAnimation="fade"
          progressIndicator={true}
          lineColor="bg-primary/20"
          activeColor="bg-primary"
          progressLineWidth={3}
          progressLineCap="round"
        />
      </div>
    </div>
  );
};
