import { ScrollTimeline } from "../lightswind/scroll-timeline";
import { portfolioData } from "@/lib/portfolioData";

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
    <div id="career" className="min-h-screen flex flex-col justify-center py-12 sm:py-16 md:py-20">
      <ScrollTimeline
        events={careerEvents}
        title="Career Journey"
        subtitle="An evolving path of leadership, innovation, and impact"
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
  );
};
