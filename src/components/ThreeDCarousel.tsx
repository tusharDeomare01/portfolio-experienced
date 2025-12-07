"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "./lightswind/button";

export interface ThreeDCarouselItem {
  id: string;
  image: string;
  title?: string;
  description?: string;
}

interface ThreeDCarouselProps {
  items: ThreeDCarouselItem[];
  autoRotate?: boolean;
  rotateInterval?: number;
  className?: string;
  onItemClick?: (item: ThreeDCarouselItem) => void;
  pauseAutoRotate?: boolean;
}

export default function ThreeDCarousel({
  items,
  autoRotate = true,
  rotateInterval = 5000,
  className = "",
  onItemClick,
  pauseAutoRotate = false,
}: ThreeDCarouselProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isHovering, setIsHovering] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const carouselRef = useRef<HTMLDivElement>(null);
  const [isInView, setIsInView] = useState(false);

  // Detect mobile screen size
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Intersection Observer to detect when carousel is in view
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => setIsInView(entry.isIntersecting),
      { threshold: 0.2 }
    );
    if (carouselRef.current) {
      observer.observe(carouselRef.current);
    }
    return () => observer.disconnect();
  }, []);

  // Auto-rotate functionality
  useEffect(() => {
    if (autoRotate && isInView && !isHovering && !pauseAutoRotate && items.length > 1) {
      const interval = setInterval(() => {
        setActiveIndex((prev) => (prev + 1) % items.length);
      }, rotateInterval);
      return () => clearInterval(interval);
    }
  }, [autoRotate, isInView, isHovering, pauseAutoRotate, rotateInterval, items.length]);

  const goToNext = () => {
    setActiveIndex((prev) => (prev + 1) % items.length);
  };

  const goToPrevious = () => {
    setActiveIndex((prev) => (prev - 1 + items.length) % items.length);
  };

  const goToSlide = (index: number) => {
    setActiveIndex(index);
  };

  if (!items || items.length === 0) {
    return (
      <div className="flex items-center justify-center h-96 text-muted-foreground">
        <p>No achievements to display</p>
      </div>
    );
  }

  // Mobile: Simplified carousel, Desktop: Full 3D carousel
  const translateXMultiplier = isMobile ? 80 : 120;
  const translateZMultiplier = isMobile ? 50 : 100;
  const rotateYMultiplier = isMobile ? 8 : 15;
  const maxVisibleCards = isMobile ? 1 : 3;

  return (
    <div
      ref={carouselRef}
      className={`relative w-full ${isMobile ? "h-[400px]" : "h-[600px]"} flex items-center justify-center ${className}`}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      {/* 3D Carousel Container */}
      <div className={`relative w-full h-full ${isMobile ? "" : "perspective-1000"}`}>
        <AnimatePresence mode="wait">
          {items.map((item, index) => {
            const offset = index - activeIndex;
            const absOffset = Math.abs(offset);
            const isActive = index === activeIndex;

            // Mobile: Show only active card, Desktop: Show 3D effect
            if (isMobile && absOffset > 0) {
              return null;
            }

            // Calculate 3D transform values
            const translateX = offset * translateXMultiplier;
            const translateZ = -Math.abs(offset) * translateZMultiplier;
            const rotateY = isMobile ? 0 : offset * rotateYMultiplier;
            const scale = isActive ? 1 : 0.85;
            const opacity = absOffset > maxVisibleCards ? 0 : isActive ? 1 : 0.6;

            return (
              <motion.div
                key={item.id}
                className="absolute inset-0 flex items-center justify-center cursor-pointer"
                initial={false}
                animate={{
                  x: translateX,
                  z: translateZ,
                  rotateY: rotateY,
                  scale: scale,
                  opacity: opacity,
                }}
                transition={{
                  type: "spring",
                  stiffness: 300,
                  damping: 30,
                  mass: 0.8,
                }}
                style={{
                  transformStyle: "preserve-3d",
                  backfaceVisibility: "hidden",
                }}
                onClick={() => {
                  if (isActive && onItemClick) {
                    onItemClick(item);
                  } else if (!isActive) {
                    goToSlide(index);
                  }
                }}
              >
                <div
                  className={`relative ${isMobile ? "w-[280px] h-[350px]" : "w-[400px] h-[500px]"} rounded-2xl overflow-hidden shadow-2xl transition-all duration-300 ${
                    isActive
                      ? "ring-4 ring-primary/50 shadow-primary/20"
                      : "ring-2 ring-border/50"
                  } ${isActive && onItemClick ? "hover:scale-[1.02] cursor-pointer" : ""}`}
                >
                  <img
                    src={item.image}
                    alt={item.title || `Achievement ${index + 1}`}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src =
                        "https://images.pexels.com/photos/3184433/pexels-photo-3184433.jpeg?auto=compress&cs=tinysrgb&w=800";
                    }}
                  />
                  {(item.title || item.description) && (
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 via-black/70 to-transparent p-4 md:p-6">
                      {item.title && (
                        <h3 className={`${isMobile ? "text-lg" : "text-xl"} font-bold text-white mb-2`}>
                          {item.title}
                        </h3>
                      )}
                      {item.description && (
                        <p className={`${isMobile ? "text-xs" : "text-sm"} text-white/90 ${isMobile ? "line-clamp-1" : "line-clamp-2"}`}>
                          {item.description}
                        </p>
                      )}
                    </div>
                  )}
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {/* Navigation Arrows */}
      {items.length > 1 && (
        <>
          <Button
            variant="ghost"
            size="icon"
            onClick={goToPrevious}
            className={`absolute ${isMobile ? "left-2" : "left-4"} top-1/2 -translate-y-1/2 z-50 ${isMobile ? "h-10 w-10" : "h-12 w-12"} rounded-full bg-background/80 backdrop-blur-sm hover:bg-background shadow-lg`}
            aria-label="Previous achievement"
          >
            <ChevronLeft className={`${isMobile ? "h-5 w-5" : "h-6 w-6"}`} />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={goToNext}
            className={`absolute ${isMobile ? "right-2" : "right-4"} top-1/2 -translate-y-1/2 z-50 ${isMobile ? "h-10 w-10" : "h-12 w-12"} rounded-full bg-background/80 backdrop-blur-sm hover:bg-background shadow-lg`}
            aria-label="Next achievement"
          >
            <ChevronRight className={`${isMobile ? "h-5 w-5" : "h-6 w-6"}`} />
          </Button>
        </>
      )}

      {/* Dots Indicator */}
      {items.length > 1 && (
        <div className={`absolute ${isMobile ? "bottom-2" : "bottom-6"} left-1/2 -translate-x-1/2 flex gap-2 z-50`}>
          {items.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`transition-all duration-300 rounded-full ${
                index === activeIndex
                  ? `${isMobile ? "w-6 h-1.5" : "w-8 h-2"} bg-primary`
                  : `${isMobile ? "w-1.5 h-1.5" : "w-2 h-2"} bg-muted-foreground/50 hover:bg-muted-foreground`
              }`}
              aria-label={`Go to achievement ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
