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
import {
  Code2,
  Globe,
  Server,
  Database,
  Cloud,
  Wrench,
  Users,
} from "lucide-react";

interface SkillCategory {
  title: string;
  icon: React.ComponentType<{ className?: string }>;
  skills: Array<{ name: string; level: number }>;
}

export default function ProfessionalProfile() {
  const skillCategories: SkillCategory[] = [
    {
      title: "Languages",
      icon: Code2,
      skills: [
        { name: "JavaScript", level: 95 },
        { name: "TypeScript", level: 92 },
      ],
    },
    {
      title: "Frontend Technologies",
      icon: Globe,
      skills: [
        { name: "React.js", level: 95 },
        { name: "Next.js", level: 91 },
        { name: "HTML / CSS", level: 92 },
        { name: "Redux Toolkit", level: 88 },
        { name: "Redux Persist", level: 85 },
      ],
    },
    {
      title: "Backend Technologies",
      icon: Server,
      skills: [
        { name: "Node.js", level: 90 },
        { name: "Express.js", level: 90 },
        { name: "NestJS", level: 85 },
        { name: "REST APIs", level: 92 },
        { name: "GraphQL", level: 85 },
      ],
    },
    {
      title: "Databases & Data Access",
      icon: Database,
      skills: [
        { name: "MySQL", level: 88 },
        { name: "MongoDB", level: 88 },
        { name: "Prisma", level: 90 },
        { name: "Mongoose", level: 85 },
      ],
    },
    {
      title: "DevOps & Cloud",
      icon: Cloud,
      skills: [
        { name: "Docker", level: 85 },
        { name: "Kubernetes", level: 80 },
        { name: "AWS", level: 85 },
        { name: "YAML", level: 88 },
      ],
    },
    {
      title: "Developer Tools",
      icon: Wrench,
      skills: [
        { name: "Git / GitHub", level: 95 },
        { name: "Bitbucket", level: 90 },
        { name: "Jira", level: 90 },
        { name: "ClickUp", level: 88 },
      ],
    },
  ];

  return (
    <section id="skills" className="space-y-8 mt-8">
      <div className="flex items-baseline gap-4 mb-6">
        <Users className="w-8 h-8 md:w-10 md:h-10 lg:w-12 lg:h-12 text-primary flex-shrink-0 mt-1 md:mt-1.5 lg:mt-2" />
        <ScrollReveal
          size="xl"
          align="left"
          variant="default"
          enableBlur={false}
          blurStrength={0}
          baseRotation={0}
        >
          Technical Skills
        </ScrollReveal>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
        {skillCategories.map((category) => {
          const Icon = category.icon;
          return (
            <Card
              key={category.title}
              className="transition-shadow duration-300 hover:shadow-lg"
            >
              <CardHeader>
                <div className="flex items-center gap-3">
                  <Icon className="w-5 h-5 text-primary" />
                  <CardTitle className="text-lg">{category.title}</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {category.skills.map((skill) => (
                  <div key={skill.name} className="space-y-2">
                    <div className="flex items-center justify-between text-sm font-medium">
                      <span className="text-foreground">{skill.name}</span>
                      <CountUp
                        className="text-sm font-semibold text-muted-foreground"
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
          );
        })}
      </div>

      {/* Soft Skills */}
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
    </section>
  );
}
