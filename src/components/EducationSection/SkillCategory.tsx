import { memo, useMemo, useState, useCallback } from "react";
import { motion } from "framer-motion";
import { ScrollReveal } from "../lightswind/scroll-reveal";
import { Badge } from "../lightswind/badge.tsx";
import CardSwap, { type CardSwapItem } from "../reactBits/cardSwap";
import FluidSkillDisplay from "./FluidSkillDisplay";
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
  skills: string[];
  color: string;
}

// Color themes for each category
const CATEGORY_COLORS = [
  "blue",
  "purple",
  "green",
  "orange",
  "teal",
  "indigo",
] as const;

const SOFT_SKILLS = [
  "Leadership",
  "Problem Solving",
  "Agile Methodologies",
  "Mentorship",
  "Strategic Thinking",
  "Cross-Team Collaboration",
] as const;

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

const badgeVariants = {
  hidden: {
    opacity: 0,
    scale: 0.8,
    y: 20,
  },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      type: "spring" as const,
      stiffness: 200,
      damping: 20,
    },
  },
};

const softSkillsContainerVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.1,
    },
  },
};


function ProfessionalProfile() {
  const skillCategories: SkillCategory[] = useMemo(
    () => [
      {
        title: "Languages",
        icon: Code2,
        skills: ["JavaScript", "TypeScript"],
        color: CATEGORY_COLORS[0],
      },
      {
        title: "Frontend Technologies",
        icon: Globe,
        skills: [
          "React.js",
          "Next.js",
          "HTML / CSS",
          "Redux Toolkit",
          "Redux Persist",
        ],
        color: CATEGORY_COLORS[1],
      },
      {
        title: "Backend Technologies",
        icon: Server,
        skills: [
          "Node.js",
          "Express.js",
          "NestJS",
          "REST APIs",
          "GraphQL",
        ],
        color: CATEGORY_COLORS[2],
      },
      {
        title: "Databases & Data Access",
        icon: Database,
        skills: ["MySQL", "MongoDB", "Prisma", "Mongoose"],
        color: CATEGORY_COLORS[3],
      },
      {
        title: "DevOps & Cloud",
        icon: Cloud,
        skills: ["Docker", "Kubernetes", "AWS", "YAML"],
        color: CATEGORY_COLORS[4],
      },
      {
        title: "Developer Tools",
        icon: Wrench,
        skills: ["Git / GitHub", "Bitbucket", "Jira", "ClickUp"],
        color: CATEGORY_COLORS[5],
      },
    ],
    []
  );

  const [activeCategoryId, setActiveCategoryId] = useState<string | number>(
    skillCategories[0].title
  );

  // Transform categories into CardSwap format
  const cardSwapItems: CardSwapItem[] = useMemo(
    () =>
      skillCategories.map((category) => {
        const Icon = category.icon;
        return {
          id: category.title,
          title: category.title,
          icon: <Icon className="w-6 h-6" />,
          color: category.color,
          content: (
            <FluidSkillDisplay
              category={category}
              isActive={activeCategoryId === category.title}
            />
          ),
        };
      }),
    [skillCategories, activeCategoryId]
  );

  const handleCategoryChange = useCallback((categoryId: string | number) => {
    setActiveCategoryId(categoryId);
  }, []);

  return (
    <motion.section
      id="skills"
      className="space-y-12 mt-8 !scroll-smooth"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.1 }}
      variants={containerVariants}
    >
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

      {/* Fluid Skill Clusters with CardSwap Navigation */}
      <CardSwap
        items={cardSwapItems}
        defaultIndex={0}
        onCardChange={handleCategoryChange}
        enableHover={true}
        transitionDuration={0.8}
        className="mb-12"
      />

      {/* Soft Skills Section */}
      <motion.div
        className="space-y-6"
        variants={softSkillsContainerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
      >
        <div className="flex items-center gap-3 mb-4">
          <h3 className="text-2xl md:text-3xl font-bold text-foreground">
            Soft Skills
          </h3>
          <div className="flex-1 h-px bg-gradient-to-r from-border via-primary/30 to-transparent" />
        </div>

        <div className="flex flex-wrap gap-3">
          {SOFT_SKILLS.map((skill) => (
            <motion.div key={skill} variants={badgeVariants}>
              <Badge
                variant="default"
                size="lg"
                className="text-sm font-semibold bg-gradient-to-r from-pink-500/90 to-purple-500/90 text-white border-0 hover:from-pink-500 hover:to-purple-500 hover:scale-110 hover:shadow-lg transition-all duration-300 cursor-default"
              >
                {skill}
              </Badge>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </motion.section>
  );
}

export default memo(ProfessionalProfile);
