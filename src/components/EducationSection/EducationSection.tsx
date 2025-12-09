import { Card, CardHeader, CardTitle } from "../lightswind/card";
import ProfessionalProfile from "./SkillCategory";
import { motion } from "framer-motion";
import { ScrollReveal } from "../lightswind/scroll-reveal";
import { portfolioData } from "@/lib/portfolioData";
import { MapPin, GraduationCap } from "lucide-react";

export const EducationSection = () => {
  return (
    <motion.section
      id="education"
      className="text-foreground max-w-7xl mx-auto w-full px-6 py-12 sm:py-16 md:py-20 space-y-10 min-h-screen flex flex-col justify-center"
      initial={{ opacity: 0, y: 50, filter: "blur(5px)" }}
      whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      viewport={{ once: true, amount: 0.2 }}
    >
      {/* Education */}
      <div>
        <div className="flex items-baseline gap-4 mb-6">
          <GraduationCap className="w-8 h-8 md:w-10 md:h-10 lg:w-12 lg:h-12 text-primary flex-shrink-0 mt-1 md:mt-1.5 lg:mt-2" />
          <ScrollReveal
            size="xl"
            align="left"
            variant="default"
            enableBlur={true}
            staggerDelay={0.05}
          >
            Education
          </ScrollReveal>
        </div>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-1 gap-8"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          viewport={{ once: true }}
        >
          {portfolioData.education.map((edu, index) => (
            <Card key={index}>
              <CardHeader>
                <CardTitle>{edu.degree}</CardTitle>
                <p className="text-sm text-muted-foreground flex items-center gap-1">
                  <MapPin className="w-4 h-4" />
                  {edu.link ? (
                    <>
                      <a
                        href={edu.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:text-foreground hover:underline transition-colors"
                      >
                        {edu.institution}
                      </a>
                      <span> : {edu.period}</span>
                    </>
                  ) : (
                    <span>{edu.institution} : {edu.period}</span>
                  )}
                </p>
              </CardHeader>
              {/* <CardContent className="text-xs text-muted-foreground space-y-2">
                {edu.description && (
                  <p>{edu.description}</p>
                )}
                {edu.specialization && (
              <p>
                    Specialized in <strong>{edu.specialization}</strong>.
              </p>
                )}
                {edu.achievements && edu.achievements.length > 0 && (
              <ul className="list-disc list-inside space-y-1">
                    {edu.achievements.map((achievement, idx) => (
                      <li key={idx}>{achievement}</li>
                    ))}
              </ul>
                )}
            </CardContent> */}
            </Card>
          ))}
        </motion.div>
      </div>

      <ProfessionalProfile />
    </motion.section>
  );
};
