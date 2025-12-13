import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ThreeDCarousel from "../lightswind/ThreeDCarousel";
import type { ThreeDCarouselItem } from "../lightswind/ThreeDCarousel";
import { ScrollReveal } from "../lightswind/scroll-reveal";
import { Trophy, X } from "lucide-react";

export const AchievementsSection = () => {
  const [achievements] = useState<ThreeDCarouselItem[]>([
    {
      id: "1",
      image: "/image-1.png",
      title: "Above & Beyond Award Ceremony",
      description:
        "Receiving the prestigious 'Above & Beyond' award from Thinkitive, recognizing exceptional dedication and outstanding contributions to the company's success.",
    },
    {
      id: "2",
      image: "/image-2.png",
      title: "Thinkitive Above & Beyond Award 2024",
      description:
        "Honored with the 'Above & Beyond of the Year 2024' trophy, celebrating relentless effort and selfless dedication in driving innovation and excellence.",
    },
    {
      id: "3",
      image: "/image-3.png",
      title: "Recognition Certificate",
      description:
        "Certificate of recognition for transforming challenges into opportunities and playing a pivotal role in driving Thinkitive Inc. to new heights during their Glorious 10 Years celebration.",
    },
  ]);

  const [selectedAchievement, setSelectedAchievement] =
    useState<ThreeDCarouselItem | null>(null);

  const handleItemClick = (item: ThreeDCarouselItem) => {
    setSelectedAchievement(item);
  };

  const closeModal = useCallback(() => {
    setSelectedAchievement(null);
  }, []);

  // Handle ESC key to close modal and prevent body scroll
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && selectedAchievement) {
        closeModal();
      }
    };

    if (selectedAchievement) {
      document.addEventListener("keydown", handleEscape);
      // Prevent body scroll when modal is open
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [selectedAchievement, closeModal]);

  return (
    <motion.section
      id="achievements"
      className="text-foreground max-w-7xl mx-auto w-full px-4 sm:px-6 py-12 sm:py-16 md:py-20 min-h-screen flex flex-col justify-center"
      initial={{ opacity: 0, y: 50, filter: "blur(5px)" }}
      whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      transition={{ duration: 1.8, ease: "easeOut" }}
      viewport={{ once: true, amount: 0.2 }}
    >
      {/* Centered Heading */}
      <motion.div
        className="flex flex-col items-center justify-center mb-8 sm:mb-12"
        initial={{ opacity: 0, y: 20, scale: 0.95 }}
        whileInView={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        viewport={{ once: true }}
      >
        <div className="flex items-baseline justify-center gap-4 mb-3 sm:mb-4">
          <Trophy className="w-8 h-8 md:w-10 md:h-10 lg:w-12 lg:h-12 text-primary flex-shrink-0 mt-1 md:mt-1.5 lg:mt-2" />
          <ScrollReveal
            size="xl"
            align="center"
            variant="default"
            enableBlur={true}
            blurStrength={5}
            baseRotation={0}
          >
            Achievements
          </ScrollReveal>
        </div>
        <ScrollReveal
          size="sm"
          align="center"
          variant="muted"
          enableBlur={true}
          blurStrength={5}
          baseRotation={0}
          containerClassName="max-w-2xl px-4"
        >
          Showcasing career milestones, awards, and notable accomplishments
        </ScrollReveal>
      </motion.div>

      {/* 3D Carousel */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
        viewport={{ once: true }}
        className="w-full overflow-hidden"
      >
        <ThreeDCarousel
          items={achievements}
          autoRotate={true}
          rotateInterval={2500}
          onItemClick={handleItemClick}
          pauseAutoRotate={!!selectedAchievement}
        />
      </motion.div>

      {/* Detailed View Modal */}
      <AnimatePresence>
        {selectedAchievement && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="fixed inset-0 z-[100] bg-black/60 dark:bg-black/80 backdrop-blur-sm"
              onClick={closeModal}
            />

            {/* Modal Content */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{
                type: "spring",
                stiffness: 300,
                damping: 30,
                duration: 0.3,
              }}
              className="fixed inset-0 z-[101] flex items-center justify-center p-4 sm:p-6 md:p-8"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="relative w-full max-w-5xl max-h-[92vh] bg-background dark:bg-background rounded-xl shadow-2xl dark:shadow-black/50 overflow-hidden flex flex-col border border-border dark:border-border/50">
                {/* Close Button */}
                <button
                  onClick={closeModal}
                  className="absolute top-4 right-4 z-10 p-1.5 rounded-md bg-background/80 dark:bg-background/60 hover:bg-muted dark:hover:bg-muted/80 transition-colors duration-200 cursor-pointer border border-border/50 dark:border-border/30"
                  aria-label="Close modal"
                >
                  <X className="h-4 w-4 sm:h-5 sm:w-5 text-muted-foreground hover:text-foreground transition-colors" />
                </button>

                {/* Image Section */}
                <div className="relative w-full bg-gradient-to-b from-muted/40 via-muted/30 to-muted/40 dark:from-muted/30 dark:via-muted/20 dark:to-muted/30">
                  <div className="w-full h-[45vh] sm:h-[55vh] md:h-[60vh] flex items-center justify-center p-8 sm:p-12 md:p-16">
                    <motion.div
                      className="relative w-full h-full flex items-center justify-center"
                      initial={{ opacity: 0, scale: 0.98 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.4, ease: "easeOut" }}
                    >
                      <img
                        src={selectedAchievement.image}
                        alt={selectedAchievement.title || "Achievement"}
                        className="max-w-full max-h-full w-auto h-auto object-contain brightness-105 contrast-105 dark:brightness-100 dark:contrast-100 drop-shadow-2xl dark:drop-shadow-lg"
                        style={{
                          filter:
                            "brightness(1.05) contrast(1.05) saturate(1.02)",
                        }}
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src =
                            "https://images.pexels.com/photos/3184433/pexels-photo-3184433.jpeg?auto=compress&cs=tinysrgb&w=800";
                        }}
                      />
                    </motion.div>
                  </div>
                </div>

                {/* Content Section */}
                <div className="flex-1 overflow-y-auto px-6 sm:px-8 md:px-10 py-6 sm:py-8 bg-background">
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.15, duration: 0.3 }}
                    className="space-y-3 sm:space-y-4 max-w-3xl mx-auto"
                  >
                    {/* Title */}
                    {selectedAchievement.title && (
                      <h2 className="text-xl sm:text-2xl md:text-3xl font-semibold text-foreground leading-tight tracking-tight">
                        {selectedAchievement.title}
                      </h2>
                    )}

                    {/* Description */}
                    {selectedAchievement.description && (
                      <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                        {selectedAchievement.description}
                      </p>
                    )}
                  </motion.div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </motion.section>
  );
};
