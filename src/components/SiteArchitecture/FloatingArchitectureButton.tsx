import { useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Network } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useAppSelector } from "@/store/hooks";
import { ScrollTrigger, useGSAP } from "@/lib/gsap";
import { useState } from "react";

export function FloatingArchitectureButton() {
  const navigate = useNavigate();
  const theme = useAppSelector((state) => state.theme.theme);
  const [isVisible, setIsVisible] = useState(false);
  const sentinelRef = useRef<HTMLDivElement>(null);

  // ScrollTrigger to control visibility (show after scrolling past hero)
  useGSAP(() => {
    ScrollTrigger.create({
      trigger: "#about",
      start: "top 80%",
      onEnter: () => { setIsVisible(true); },
      onLeaveBack: () => { setIsVisible(false); },
    });
  }, { scope: sentinelRef });

  return (
    <>
      {/* Invisible sentinel for GSAP scope */}
      <div ref={sentinelRef} className="hidden" />

      <AnimatePresence>
        {isVisible && (
          <motion.div
            data-site-architecture
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ type: "spring", stiffness: 260, damping: 20 }}
            className="
              cursor-pointer
              fixed z-[999]
              bottom-[148px] right-3
              sm:bottom-[164px] sm:right-4
              md:bottom-[104px] md:right-7
            "
          >
            <motion.button
              onClick={() => navigate("/sitemap")}
              className={`
                cursor-pointer
                relative
                h-14 w-14
                sm:h-16 sm:w-16
                rounded-full
                shadow-2xl
                border-[3px]
                flex items-center justify-center
                overflow-visible
                group
                transition-all duration-300
                touch-manipulation
                ${
                  theme === "dark"
                    ? "bg-black border-white"
                    : "bg-violet-500 border-violet-500"
                }
              `}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              aria-label="View Site Architecture"
            >
              {/* Subtle glow effect */}
              <motion.div
                className={`absolute inset-0 rounded-full blur-md ${
                  theme === "dark" ? "bg-white/10" : "bg-violet-400/20"
                }`}
                animate={{
                  scale: [1, 1.2, 1],
                  opacity: [0.3, 0.5, 0.3],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />

              {/* Network icon with animation */}
              <motion.div
                className="relative z-10"
                animate={{
                  scale: [1, 1.1, 1],
                  rotate: [0, 5, -5, 0],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              >
                <Network
                  className="h-6 w-6 sm:h-7 sm:w-7 group-hover:opacity-90 transition-colors drop-shadow-lg text-white"
                  strokeWidth={2}
                />
              </motion.div>

              {/* Subtle pulsing ring effect */}
              <motion.div
                className={`absolute inset-0 rounded-full border-2 ${
                  theme === "dark" ? "border-white/30" : "border-violet-400/40"
                }`}
                animate={{
                  scale: [1, 1.3, 1],
                  opacity: [0.4, 0, 0.4],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeOut",
                }}
              />

              {/* Tooltip - appears on hover */}
              <div className="cursor-pointer absolute -top-12 right-0 bg-foreground/90 text-background text-xs px-3 py-1.5 rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-50">
                Site Architecture
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-full w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-foreground/90" />
              </div>
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
