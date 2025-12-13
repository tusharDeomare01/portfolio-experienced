import { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useAppSelector } from "@/store/hooks";
// @ts-ignore - interactive-card is a JS file without type definitions
import { InteractiveCard } from "../lightswind/interactive-card";
// @ts-ignore - button is a JS file without type definitions
import { Button } from "../lightswind/button";
import { Badge } from "../lightswind/badge";
import { ScrollReveal } from "../lightswind/scroll-reveal";
import { ArrowRight, Calendar, FolderKanban } from "lucide-react";

export const ProjectsSection = () => {
  const navigate = useNavigate();
  const [hoveredProject, setHoveredProject] = useState<number | null>(null);
  const theme = useAppSelector((state) => state.theme.theme);
  const isDarkMode = theme === "dark";

  const getLogoPath = (projectTitle: string) => {
    if (projectTitle === "MarketJD") {
      return isDarkMode
        ? "/logo-horizontal-dark.svg"
        : "/logo-horizontal-light.svg";
    } else if (projectTitle === "TechShowcase") {
      return isDarkMode
        ? "/techshowcase-logo-dark.svg"
        : "/techshowcase-logo-light.svg";
    }
    return "";
  };

  const [projects] = useState([
    {
      id: 1,
      title: "MarketJD",
      subtitle:
        "Comprehensive insights platform with 20+ third-party API integrations, advanced authentication, dynamic reporting, and AI-powered automation. Built with modern tech stack.",
      date: "2024 - Present",
      route: "/marketjd",
      image: "/logo-horizontal.svg", // This will be replaced dynamically
      technologies: [
        "Next.js",
        "React",
        "TypeScript",
        "Prisma",
        "Next-Auth",
        "Redux Toolkit",
        "Ant Design",
        "Chart.js",
        "MySQL",
        "Tailwind CSS",
      ],
      status: "Active",
    },
    {
      id: 2,
      title: "TechShowcase",
      subtitle:
        "Modern, interactive portfolio website featuring smooth animations, AI-powered assistant, 3D carousel, and responsive design. Built with React, TypeScript, Framer Motion, and advanced UI components.",
      date: "2025 - Present",
      route: "/portfolio",
      image: "/techshowcase-logo.svg", // This will be replaced dynamically
      technologies: ["React", "TypeScript", "Framer Motion", "Vite"],
      status: "Active",
    },
  ]);

  const handleMoreInfo = (route: string) => {
    navigate(route);
  };

  return (
    <motion.div
      id="projects"
      className="min-h-screen flex flex-col justify-center"
      initial={{ opacity: 0, y: 50, filter: "blur(5px)" }}
      whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      viewport={{ once: true, amount: 0.2 }}
    >
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-12 sm:py-16 md:py-16 w-full">
        <motion.div
          className="text-center mb-8 sm:mb-16"
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        >
          <div className="mb-4 flex items-baseline justify-center gap-4">
            <FolderKanban className="w-10 h-10 md:w-12 md:h-12 lg:w-14 lg:h-14 text-primary flex-shrink-0 mt-1.5 md:mt-2 lg:mt-2.5" />
            <ScrollReveal
              size="2xl"
              align="center"
              variant="default"
              enableBlur={true}
              blurStrength={20}
              baseRotation={0}
            >
              Projects
            </ScrollReveal>
          </div>
          <ScrollReveal
            size="sm"
            align="center"
            variant="muted"
            enableBlur={true}
            blurStrength={20}
            baseRotation={0}
          >
            Explore my latest work...
          </ScrollReveal>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 lg:gap-10 justify-items-center">
          {projects.map((project, index) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{
                duration: 0.6,
                delay: index * 0.15,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="w-full max-w-md project-card-wrapper group"
              onMouseEnter={() => setHoveredProject(project.id)}
              onMouseLeave={() => setHoveredProject(null)}
            >
              <InteractiveCard
                className="h-full flex flex-col w-full overflow-hidden"
                InteractiveColor="#07eae6ff"
                borderRadius="24px"
                rotationFactor={0.25}
                tailwindBgClass="bg-background/90 backdrop-blur-xl border border-border/60 shadow-xl hover:shadow-2xl transition-shadow duration-500"
              >
                {/* Image Section with Enhanced Overlay */}
                <div
                  className={`relative w-full overflow-hidden flex items-center justify-center ${
                    project.image.endsWith(".svg")
                      ? "bg-transparent h-[200px] sm:h-64 md:h-64"
                      : "bg-background/50 h-52 sm:h-64"
                  }`}
                >
                  {project.image.endsWith(".svg") ? (
                    <motion.img
                      src={getLogoPath(project.title)}
                      alt={project.title}
                      className="w-full h-full max-w-full max-h-full sm:max-w-[80%] sm:max-h-[70%] md:max-w-[75%] md:max-h-[65%] object-contain px-4 py-2 sm:px-4 sm:py-4 md:px-4 md:py-4"
                      animate={{
                        scale: hoveredProject === project.id ? 1.1 : 1,
                      }}
                      transition={{ duration: 0.6, ease: "easeOut" }}
                    />
                  ) : (
                    <motion.img
                      src={project.image}
                      alt={project.title}
                      className="w-full h-full object-cover"
                      animate={{
                        scale: hoveredProject === project.id ? 1.1 : 1,
                      }}
                      transition={{ duration: 0.6, ease: "easeOut" }}
                    />
                  )}
                  {/* Status Badge */}
                  <div className="absolute top-4 right-4 z-10">
                    <Badge
                      variant="success"
                      size="sm"
                      className="backdrop-blur-sm bg-green-500/90 text-white border-0 shadow-lg"
                    >
                      <span className="relative flex h-2 w-2 mr-1.5">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
                      </span>
                      {project.status}
                    </Badge>
                  </div>
                </div>

                {/* Content Section */}
                <div className="flex-1 flex flex-col p-6 sm:p-7 space-y-5">
                  {/* Title and Date */}
                  <div className="space-y-3">
                    <motion.h3
                      className="text-2xl sm:text-3xl font-bold text-foreground leading-tight"
                      animate={{
                        color:
                          hoveredProject === project.id
                            ? "hsl(var(--primary))"
                            : "hsl(var(--foreground))",
                      }}
                      transition={{ duration: 0.3 }}
                    >
                      {project.title}
                    </motion.h3>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Calendar className="w-4 h-4" />
                      <span className="font-medium">{project.date}</span>
                    </div>
                  </div>

                  {/* Description */}
                  <p className="text-sm sm:text-base text-muted-foreground leading-relaxed flex-1 line-clamp-3">
                    {project.subtitle}
                  </p>

                  {/* Technology Tags */}
                  <div className="flex flex-wrap gap-2 pt-2">
                    {project.technologies.map((tech, techIndex) => (
                      <motion.div
                        key={techIndex}
                        initial={{ opacity: 0, scale: 0.8 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: index * 0.15 + techIndex * 0.05 }}
                      >
                        <Badge
                          variant="outline"
                          size="sm"
                          className="text-xs font-medium hover:bg-primary/10 hover:border-primary/50 transition-colors cursor-default"
                        >
                          {tech}
                        </Badge>
                      </motion.div>
                    ))}
                  </div>

                  {/* CTA Button */}
                  <motion.div
                    className="pt-2"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Button
                      variant="outline"
                      size="lg"
                      onClick={() => handleMoreInfo(project.route)}
                      className="w-full group/btn relative overflow-hidden border-2 hover:border-primary transition-all duration-300"
                    >
                      <span className="relative z-10 flex items-center justify-center gap-2 font-semibold">
                        Explore Project ...
                        <motion.div
                          animate={{
                            x: hoveredProject === project.id ? 4 : 0,
                          }}
                          transition={{ duration: 0.3 }}
                        >
                          <ArrowRight className="w-4 h-4" />
                        </motion.div>
                      </span>
                      {/* Button Hover Effect */}
                      <motion.div
                        className="absolute inset-0 bg-primary"
                        initial={{ x: "-100%" }}
                        whileHover={{ x: 0 }}
                        transition={{ duration: 0.3 }}
                      />
                      <motion.span
                        className="absolute inset-0 flex items-center justify-center text-primary-foreground font-semibold"
                        initial={{ opacity: 0 }}
                        whileHover={{ opacity: 1 }}
                        transition={{ duration: 0.2, delay: 0.1 }}
                      >
                        <span className="flex items-center gap-2">
                          Explore Project
                          <ArrowRight className="w-4 h-4" />
                        </span>
                      </motion.span>
                    </Button>
                  </motion.div>
                </div>
              </InteractiveCard>
            </motion.div>
          ))}
        </div>
      </section>
    </motion.div>
  );
};
