import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ThreeDCarousel from "@/components/lightswind/ThreeDCarousel";
import type { ThreeDCarouselItem } from "@/components/lightswind/ThreeDCarousel";
import { ScrollReveal } from "../lightswind/scroll-reveal";
import { Trophy, X, ChevronLeft, ChevronRight, ZoomIn, ZoomOut, Loader2 } from "lucide-react";

export const AchievementsSection = () => {
  const [achievements] = useState<ThreeDCarouselItem[]>([
    {
      id: "2025-1",
      image: "/2025-image-2.jpg",
      title: "Star Performer Award Ceremony 2025",
      description:
        "Receiving the prestigious 'Star Performer of the Year' award at the award ceremony, recognizing exceptional performance and outstanding contributions as Software Engineer 2. This momentous occasion celebrates dedication, excellence, and the significant impact made throughout 2025.",
    },
    {
      id: "2025-2",
      image: "/2025-image-3.png",
      title: "Thinkitive Star Performance Trophy 2025",
      description:
        "Honored with the golden 'Star Performance' trophy from Thinkitive for 2025, awarded in recognition of exceptional achievements as Software Engineer 2. This prestigious award symbolizes outstanding dedication, innovation, and excellence that has significantly contributed to the company's success.",
    },
    {
      id: "2025-3",
      image: "/2025-image-5.jpg",
      title: "Star Performer of the Year Certificate 2025",
      description:
        "Certificate of recognition as 'Star Performer of the Year 2025' from Thinkitive Inc., presented in recognition of extraordinary dedication, unmatched excellence, and unwavering passion as Software Engineer 2. This award acknowledges the exceptional contributions that have shaped Thinkitive Inc.'s success in 2025, coinciding with their Emerging 11 Years anniversary celebration.",
    },
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
  const [currentIndex, setCurrentIndex] = useState(0);
  const [imageLoading, setImageLoading] = useState(true);
  const [imageZoomed, setImageZoomed] = useState(false);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  const modalRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);

  const minSwipeDistance = 50;

  const handleItemClick = (item: ThreeDCarouselItem) => {
    const index = achievements.findIndex((a) => a.id === item.id);
    setCurrentIndex(index >= 0 ? index : 0);
    setSelectedAchievement(item);
    setImageLoading(true);
    setImageZoomed(false);
    // Store the previously focused element
    previousFocusRef.current = document.activeElement as HTMLElement;
  };

  const closeModal = useCallback(() => {
    setSelectedAchievement(null);
    setImageZoomed(false);
    // Restore focus to the previously focused element
    if (previousFocusRef.current) {
      previousFocusRef.current.focus();
    }
  }, []);

  const goToNext = useCallback(() => {
    if (!selectedAchievement) return;
    const nextIndex = (currentIndex + 1) % achievements.length;
    setCurrentIndex(nextIndex);
    setSelectedAchievement(achievements[nextIndex]);
    setImageLoading(true);
    setImageZoomed(false);
  }, [currentIndex, achievements, selectedAchievement]);

  const goToPrevious = useCallback(() => {
    if (!selectedAchievement) return;
    const prevIndex = (currentIndex - 1 + achievements.length) % achievements.length;
    setCurrentIndex(prevIndex);
    setSelectedAchievement(achievements[prevIndex]);
    setImageLoading(true);
    setImageZoomed(false);
  }, [currentIndex, achievements, selectedAchievement]);

  const toggleZoom = useCallback(() => {
    setImageZoomed((prev) => !prev);
  }, []);

  // Touch handlers for swipe gestures
  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe && achievements.length > 1) {
      goToNext();
    }
    if (isRightSwipe && achievements.length > 1) {
      goToPrevious();
    }
  };

  // Preload images for smoother experience
  useEffect(() => {
    achievements.forEach((achievement) => {
      const img = new Image();
      img.src = achievement.image;
    });
  }, [achievements]);

  // Handle keyboard navigation and ESC key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!selectedAchievement) return;

      switch (e.key) {
        case "Escape":
          closeModal();
          break;
        case "ArrowLeft":
          e.preventDefault();
          goToPrevious();
          break;
        case "ArrowRight":
          e.preventDefault();
          goToNext();
          break;
      }
    };

    if (selectedAchievement) {
      document.addEventListener("keydown", handleKeyDown);
      // Prevent body scroll when modal is open
      document.body.style.overflow = "hidden";
      // Focus trap: focus the modal container
      if (modalRef.current) {
        modalRef.current.focus();
      }
    }

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "unset";
    };
  }, [selectedAchievement, closeModal, goToNext, goToPrevious]);

  return (
    <motion.section
      id="achievements"
      className="text-foreground max-w-7xl mx-auto w-full px-6 py-12 sm:py-16 md:py-20 min-h-screen flex flex-col justify-center"
      initial={{ opacity: 0, y: 50, filter: "blur(5px)" }}
      whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      transition={{ duration: 1.8, ease: "easeOut" }}
      viewport={{ once: true, amount: 0.2 }}
    >
      {/* Centered Heading */}
      <div className="flex flex-col items-center justify-center mb-8 sm:mb-12">
        <div className="flex items-baseline justify-center gap-4 mb-3 sm:mb-4">
          <Trophy className="w-8 h-8 md:w-10 md:h-10 lg:w-12 lg:h-12 text-primary flex-shrink-0 mt-1 md:mt-1.5 lg:mt-2" />
          <ScrollReveal
            size="xl"
            align="center"
            variant="default"
            enableBlur={false}
            baseOpacity={0.1}
            baseRotation={0}
            blurStrength={0}
          >
            Achievements
          </ScrollReveal>
        </div>
        <p className="text-lg font-bold">
          Showcasing career milestones, awards, and notable accomplishments
        </p>
      </div>

      {/* 3D Carousel */}
      <div
        className="w-full overflow-hidden opacity-0
             transition-all duration-400 ease-in
             animate-fade-in-up"
      >
        <ThreeDCarousel
          items={achievements}
          autoRotate={true}
          rotateInterval={2500}
          onItemClick={handleItemClick}
          pauseAutoRotate={!!selectedAchievement}
        />
      </div>

      {/* Detailed View Modal */}
      <AnimatePresence>
        {selectedAchievement && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-[100] bg-black/60 dark:bg-black/80 backdrop-blur-sm"
              onClick={closeModal}
              aria-hidden="true"
            />

            {/* Modal Content */}
            <div
              ref={modalRef}
              tabIndex={-1}
              className="fixed inset-0 z-[101] flex items-center justify-center p-4 sm:p-6 md:p-8"
              onClick={(e) => e.stopPropagation()}
              role="dialog"
              aria-modal="true"
              aria-labelledby="achievement-modal-title"
              aria-describedby="achievement-modal-description"
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
                className="relative w-full max-w-5xl max-h-[92vh] bg-background dark:bg-background rounded-xl shadow-2xl dark:shadow-black/50 overflow-hidden flex flex-col border border-border dark:border-border/50"
                onTouchStart={onTouchStart}
                onTouchMove={onTouchMove}
                onTouchEnd={onTouchEnd}
              >
                {/* Header with Close Button and Progress */}
                <div className="absolute top-0 left-0 right-0 z-20 flex items-center justify-between p-4 bg-gradient-to-b from-background/95 via-background/80 to-transparent">
                  {/* Progress Indicator */}
                  {achievements.length > 1 && (
                    <div className="flex items-center gap-2 text-xs sm:text-sm text-muted-foreground">
                      <span className="font-medium">
                        {currentIndex + 1} / {achievements.length}
                      </span>
                      <div className="flex gap-1.5">
                        {achievements.map((_, index) => (
                          <div
                            key={index}
                            className={`h-1 rounded-full transition-all duration-300 ${
                              index === currentIndex
                                ? "w-6 bg-primary"
                                : "w-1.5 bg-muted-foreground/30"
                            }`}
                            aria-hidden="true"
                          />
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Close Button */}
                  <button
                    onClick={closeModal}
                    className="ml-auto p-2 rounded-md bg-background/80 dark:bg-background/60 hover:bg-muted dark:hover:bg-muted/80 transition-colors duration-200 cursor-pointer border border-border/50 dark:border-border/30 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                    aria-label="Close modal"
                  >
                    <X className="h-4 w-4 sm:h-5 sm:w-5 text-muted-foreground hover:text-foreground transition-colors" />
                  </button>
                </div>

                {/* Navigation Arrows */}
                {achievements.length > 1 && (
                  <>
                    <button
                      onClick={goToPrevious}
                      className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 z-20 p-2 sm:p-3 rounded-full bg-background/90 dark:bg-background/80 backdrop-blur-sm hover:bg-background dark:hover:bg-background/90 transition-all duration-200 shadow-lg border border-border/50 dark:border-border/30 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                      aria-label="Previous achievement"
                    >
                      <ChevronLeft className="h-5 w-5 sm:h-6 sm:w-6 text-foreground" />
                    </button>
                    <button
                      onClick={goToNext}
                      className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 z-20 p-2 sm:p-3 rounded-full bg-background/90 dark:bg-background/80 backdrop-blur-sm hover:bg-background dark:hover:bg-background/90 transition-all duration-200 shadow-lg border border-border/50 dark:border-border/30 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                      aria-label="Next achievement"
                    >
                      <ChevronRight className="h-5 w-5 sm:h-6 sm:w-6 text-foreground" />
                    </button>
                  </>
                )}

                {/* Image Section */}
                <div className="relative w-full bg-gradient-to-b from-muted/40 via-muted/30 to-muted/40 dark:from-muted/30 dark:via-muted/20 dark:to-muted/30">
                  <div className="w-full h-[45vh] sm:h-[55vh] md:h-[60vh] flex items-center justify-center p-8 sm:p-12 md:p-16 relative">
                    {/* Loading Skeleton */}
                    {imageLoading && (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-16 h-16 border-4 border-primary/20 border-t-primary rounded-full animate-spin">
                          <Loader2 className="w-8 h-8 text-primary animate-spin" />
                        </div>
                      </div>
                    )}

                    {/* Image Container */}
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: imageLoading ? 0 : 1, scale: 1 }}
                      transition={{ duration: 0.3 }}
                      className={`group relative w-full h-full flex items-center justify-center ${
                        imageZoomed ? "cursor-zoom-out" : "cursor-zoom-in"
                      }`}
                      onClick={toggleZoom}
                    >
                      <img
                        ref={imageRef}
                        src={selectedAchievement.image}
                        alt={selectedAchievement.title || "Achievement"}
                        className={`max-w-full max-h-full w-auto h-auto object-contain brightness-105 contrast-105 dark:brightness-100 dark:contrast-100 drop-shadow-2xl dark:drop-shadow-lg transition-transform duration-300 ${
                          imageZoomed
                            ? "scale-150 sm:scale-125"
                            : "scale-100"
                        }`}
                        style={{
                          filter:
                            "brightness(1.05) contrast(1.05) saturate(1.02)",
                        }}
                        onLoad={() => setImageLoading(false)}
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src =
                            "https://images.pexels.com/photos/3184433/pexels-photo-3184433.jpeg?auto=compress&cs=tinysrgb&w=800";
                          setImageLoading(false);
                        }}
                      />

                      {/* Zoom Indicator */}
                      <div className="absolute bottom-4 right-4 p-2 rounded-md bg-background/80 dark:bg-background/60 backdrop-blur-sm border border-border/50 dark:border-border/30 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                        {imageZoomed ? (
                          <ZoomOut className="h-4 w-4 text-muted-foreground" />
                        ) : (
                          <ZoomIn className="h-4 w-4 text-muted-foreground" />
                        )}
                      </div>
                    </motion.div>
                  </div>
                </div>

                {/* Content Section */}
                <div className="flex-1 overflow-y-auto px-6 sm:px-8 md:px-10 py-6 sm:py-8 bg-background" style={{ scrollbarWidth: 'thin' }}>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2, duration: 0.3 }}
                    className="space-y-3 sm:space-y-4 max-w-3xl mx-auto"
                  >
                    {/* Title */}
                    {selectedAchievement.title && (
                      <h2
                        id="achievement-modal-title"
                        className="text-xl sm:text-2xl md:text-3xl font-semibold text-foreground leading-tight tracking-tight"
                      >
                        {selectedAchievement.title}
                      </h2>
                    )}

                    {/* Description */}
                    {selectedAchievement.description && (
                      <p
                        id="achievement-modal-description"
                        className="text-sm sm:text-base text-muted-foreground leading-relaxed"
                      >
                        {selectedAchievement.description}
                      </p>
                    )}

                    {/* Keyboard Hint */}
                    {achievements.length > 1 && (
                      <p className="text-xs text-muted-foreground/70 pt-2 border-t border-border/50">
                        Use arrow keys or swipe to navigate • Click image to zoom
                      </p>
                    )}
                  </motion.div>
                </div>
              </motion.div>
            </div>
          </>
        )}
      </AnimatePresence>
    </motion.section>
  );
};
