import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "../lightswind/card.tsx";
import { ScrollReveal } from "../lightswind/scroll-reveal";
import { CountUp } from "../lightswind/count-up.tsx";
import { Progress } from "../lightswind/progress.tsx";
import { Badge } from "../lightswind/badge.tsx";

export default function ProfessionalProfile() {
  return (
    <section
      id="skills"
      className="space-y-12"
    >
      {/* Skills Section */}
      <div className="your-child-class">
        <ScrollReveal
          size="xl"
          align="left"
          variant="default"
          enableBlur={true}
          blurStrength={5}
          baseRotation={0}
          containerClassName="mb-6"
        >
          Core Skills
        </ScrollReveal>
        <div className="grid grid-cols-1 md:grid-cols-1 gap-8">
          <Card>
            <CardHeader>
              <CardTitle>Technical Skills</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {[
                { name: "React.js / Next.js", level: 95 },
                { name: "Node.js / Express", level: 90 },
                { name: "TypeScript & JavaScript", level: 92 },
                { name: "Database (MongoDB / PostgreSQL)", level: 88 },
                { name: "Cloud (AWS / Azure)", level: 85 },
              ].map((skill, i) => (
                <div key={i}>
                  <div
                    className="flex items-center justify-between text-sm 
                  font-medium mb-1"
                  >
                    <span>{skill.name}</span>
                    <CountUp
                      className="text-md "
                      value={skill.level}
                      suffix="%"
                      duration={1.5}
                      decimals={0}
                      animationStyle="spring"
                      colorScheme="primary"
                    />
                  </div>
                  <Progress value={skill.level} />
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Soft Skills</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-wrap gap-2">
              {[
                "Leadership",
                "Problem Solving",
                "Agile Methodologies",
                "Mentorship",
                "Strategic Thinking",
                "Cross-Team Collaboration",
              ].map((skill, i) => (
                <div key={i}>
                  <Badge className="bg-pink-500">{skill}</Badge>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Rest of your component remains unchanged */}
    </section>
  );
}
