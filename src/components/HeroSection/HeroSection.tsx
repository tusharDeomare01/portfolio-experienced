import { motion } from "framer-motion";
import { TypingText } from "../lightswind/typing-text";
import { Button } from "../lightswind/button";
import { ScrollReveal } from "../lightswind/scroll-reveal";
import { ArrowDown, Sparkles, Mail } from "lucide-react";

export const HeroSection = () => {
  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      const offset = 80;
      const elementPosition = el.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
    }
  };

  return (
    <motion.div
      id="hero"
      className="text-foreground bg-transparent flex flex-col md:flex-row 
      items-center justify-center max-w-7xl mx-auto w-full min-h-screen"
      initial={{ opacity: 0 }}
      animate={{
        opacity: 1,
        transition: {
          // acts like staggerChildren / delayChildren
          delayChildren: 0.3,
          staggerChildren: 0.2,
        },
      }}
    >
      {/* Left Section */}
      <motion.div
        className="flex-1 space-y-6 p-6 text-left md:text-left flex flex-col justify-center"
        initial={{ opacity: 0, y: 50, filter: "blur(5px)" }}
        whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
        transition={{ duration: 1.8, ease: "easeOut" }}
        viewport={{ once: true, amount: 0.2 }}
      >
        <motion.h1
          className="text-3xl sm:text-3xl md:text-5xl font-bold"
          initial={{ opacity: 0, y: 20, filter: "blur(4px)" }}
          animate={{
            opacity: 1,
            y: 0,
            filter: "blur(0px)",
            transition: { duration: 0.8, ease: "easeOut" },
          }}
        >
          <TypingText
            delay={0.5}
            duration={2.5}
            fontSize="text-3xl sm:text-3xl md:text-5xl"
            fontWeight="font-extrabold"
            color="text-foreground"
            letterSpacing="tracking-wider"
            align="left"
          >
            Tushar Deomare
          </TypingText>
          <ScrollReveal
            size="sm"
            align="left"
            variant="accent"
            enableBlur={true}
            blurStrength={5}
            baseRotation={0}
            containerClassName="mt-1"
            textClassName="text-xs sm:text-sm text-pink-500 font-semibold block"
          >
            He / Him
          </ScrollReveal>
        </motion.h1>

        {/* Key Highlight - Concise and Impactful */}
        <motion.div
          className="flex items-center gap-2 text-lg sm:text-xl md:text-2xl text-muted-foreground"
          initial={{ opacity: 0, y: 20, filter: "blur(4px)" }}
          animate={{
            opacity: 1,
            y: 0,
            filter: "blur(0px)",
            transition: { duration: 0.8, ease: "easeOut", delay: 0.3 },
          }}
        >
          <Sparkles className="w-5 h-5 sm:w-6 sm:h-6 text-pink-500" />
          <ScrollReveal
            size="md"
            align="left"
            variant="muted"
            enableBlur={true}
            blurStrength={5}
            baseRotation={0}
            containerClassName="inline"
            textClassName="font-medium"
          >
            Building scalable solutions with 2+ years of expertise
          </ScrollReveal>
        </motion.div>

        {/* Email Contact */}
        <motion.div
          className="flex items-center gap-2 mt-4 relative"
          initial={{ opacity: 0, y: 20, filter: "blur(4px)" }}
          animate={{
            opacity: 1,
            y: 0,
            filter: "blur(0px)",
            transition: { duration: 0.8, ease: "easeOut", delay: 0.4 },
          }}
        >
          <motion.a
            href="mailto:tdeomare1@gmail.com"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-sm sm:text-base text-muted-foreground hover:text-pink-500 transition-colors duration-300 group relative"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Mail className="w-4 h-4 group-hover:rotate-12 transition-transform duration-300" />
            <span className="font-medium relative">
              tdeomare1@gmail.com
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-pink-500 transition-all duration-300 group-hover:w-full"></span>
            </span>
            {/* Tooltip */}
            <span className="absolute -top-10 left-1/2 -translate-x-1/2 bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 text-xs px-3 py-1.5 rounded-md opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-300 whitespace-nowrap z-10 shadow-lg">
              Click to compose email message
              <span className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-full w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900 dark:border-t-gray-100"></span>
            </span>
          </motion.a>
        </motion.div>

        {/* CTA Button */}
        <motion.div
          className="flex flex-wrap gap-4 mt-6"
          initial={{ opacity: 0, y: 20, filter: "blur(4px)" }}
          animate={{
            opacity: 1,
            y: 0,
            filter: "blur(0px)",
            transition: { duration: 0.8, ease: "easeOut", delay: 0.5 },
          }}
        >
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button
              onClick={() => scrollToSection("projects")}
              className="bg-pink-500 hover:bg-pink-600 text-white font-semibold px-6 py-3 rounded-lg transition-all duration-300 flex items-center gap-2 group"
            >
              View My Work
              <ArrowDown className="w-4 h-4 group-hover:translate-y-1 transition-transform" />
            </Button>
          </motion.div>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button
              onClick={() => scrollToSection("contact")}
              variant="outline"
              className="border-2 border-pink-500 text-pink-500 hover:bg-pink-500 hover:text-pink-600 font-semibold px-6 py-3 rounded-lg transition-all duration-300"
            >
              Get In Touch
            </Button>
          </motion.div>
        </motion.div>
      </motion.div>

      {/* Right Section */}
      <motion.div
        className="flex-1 flex justify-center p-6"
        initial={{ opacity: 0, scale: 0.8, filter: "blur(10px)" }}
        animate={{
          opacity: 1,
          scale: 1,
          filter: "blur(0px)",
        }}
        transition={{ delay: 0.5, duration: 1.2, ease: "easeOut" }}
      >
        <div className="w-64 h-64 rounded-full overflow-hidden shadow-lg">
          <img
            src="/Tushar_Deomare.jpg"
            alt="Tushar Deomare"
            className="w-full h-full object-cover"
          />
        </div>
      </motion.div>
    </motion.div>
  );
};
