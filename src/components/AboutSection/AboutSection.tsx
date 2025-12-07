import { Separator } from "../lightswind/separator";
import { motion } from "framer-motion";

export const AboutSection = () => {
  return (
    <motion.div
      id="about"
      className="text-foreground max-w-7xl mx-auto w-full px-6 py-12 sm:py-16 md:py-20 space-y-6 min-h-screen flex flex-col justify-center"
      initial={{ opacity: 0, y: 50, filter: "blur(5px)" }}
      whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      transition={{ duration: 1.8, ease: "easeOut" }}
      viewport={{ once: true, amount: 0.2 }}
    >
      <motion.h2
        className="text-3xl font-bold"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        viewport={{ once: true }}
      >
        About Me
      </motion.h2>
      
      <motion.div
        className="space-y-4 text-muted-foreground text-sm max-w-3xl leading-relaxed"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
        viewport={{ once: true }}
      >
        <p>
          I'm a developer who enjoys turning ideas into working software. 
          I focus on writing clean, maintainable code and building things that 
          people actually find useful.
        </p>
        <p>
          When I'm not coding, I'm usually learning something new or exploring 
          different ways to solve problems. I believe good software comes from 
          understanding the problem first, then finding the right solution—not 
          the other way around.
        </p>
        <p>
          I'm always open to interesting projects and conversations. If you'd 
          like to work together or just chat about technology, feel free to 
          reach out.
        </p>
      </motion.div>
      
      <Separator />
    </motion.div>
  );
};
