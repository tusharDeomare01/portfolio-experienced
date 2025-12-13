import { motion } from "framer-motion";
import { User } from "lucide-react";
import ScrollReveal from "../lightswind/scroll-reveal";

export const AboutSection = () => {
  return (
    <motion.div
      id="about"
      className="text-foreground max-w-7xl mx-auto w-full px-4 sm:px-6 py-12 sm:py-16 md:py-20 space-y-4 sm:space-y-6 min-h-screen flex flex-col justify-center"
      initial={{ opacity: 0, y: 50, filter: "blur(5px)" }}
      whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      transition={{ duration: 1.8, ease: "easeOut" }}
      viewport={{ once: true, amount: 0.2 }}
    >
      <div className="flex items-baseline gap-4 mb-2">
        <User className="w-8 h-8 md:w-10 md:h-10 lg:w-12 lg:h-12 text-primary flex-shrink-0 mt-1 md:mt-1.5 lg:mt-2" />
        <ScrollReveal
          size="xl"
          align="left"
          variant="default"
          enableBlur={true}
          staggerDelay={0.05}
        >
          About Me
        </ScrollReveal>
      </div>

      <motion.div
        className="space-y-3 sm:space-y-4 text-muted-foreground text-xs sm:text-sm max-w-3xl leading-relaxed"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
        viewport={{ once: true }}
      >
        <ScrollReveal
          size="sm"
          align="left"
          variant="muted"
          enableBlur={true}
          staggerDelay={0.03}
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
          staggerDelay={0.03}
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
          staggerDelay={0.03}
        >
          I'm always open to interesting projects and conversations. If you'd
          like to work together or just chat about technology, feel free to
          reach out.
        </ScrollReveal>
      </motion.div>
    </motion.div>
  );
};
