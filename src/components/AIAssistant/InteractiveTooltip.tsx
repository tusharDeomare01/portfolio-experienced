"use client";

import { useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { hideTooltip, setUserInteracted } from "@/store/slices/chatSlice";
import { playNotificationSound, initializeAudioContext } from "@/lib/audioUtils";

interface InteractiveTooltipProps {
  message: string;
  onClose?: () => void;
}

export default function InteractiveTooltip({ message, onClose }: InteractiveTooltipProps) {
  const dispatch = useAppDispatch();
  const showTooltip = useAppSelector((state) => state.chat.showTooltip);
  const hasPlayedSound = useRef(false);

  const handleClose = () => {
    dispatch(hideTooltip());
    dispatch(setUserInteracted(true));
    hasPlayedSound.current = false;
    onClose?.();
  };

  // Play sound when tooltip appears
  useEffect(() => {
    if (showTooltip && !hasPlayedSound.current) {
      // Ensure audio context is initialized before playing sound
      // This handles cases where audio context wasn't preloaded or needs to be resumed
      const playSound = async () => {
        try {
          // Ensure audio context is ready (in case it wasn't preloaded)
          initializeAudioContext();
          // Small delay to ensure audio context is fully ready
          await new Promise(resolve => setTimeout(resolve, 50));
          await playNotificationSound();
          hasPlayedSound.current = true;
        } catch (error) {
          // Retry after a short delay if first attempt fails
          setTimeout(async () => {
            try {
              initializeAudioContext();
              await new Promise(resolve => setTimeout(resolve, 50));
              await playNotificationSound();
              hasPlayedSound.current = true;
            } catch (retryError) {
              console.debug('Could not play notification sound after retry:', retryError);
            }
          }, 300);
        }
      };
      
      // Small delay to ensure DOM is ready
      const timer = setTimeout(() => {
        playSound();
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [showTooltip]);

  // Auto-hide tooltip after 30 seconds if user doesn't interact
  useEffect(() => {
    if (!showTooltip) return;

    const autoHideTimer = setTimeout(() => {
      handleClose();
    }, 30000); // 30 seconds

    return () => clearTimeout(autoHideTimer);
  }, [showTooltip, handleClose]);

  if (!showTooltip) return null;

  return (
    <>
      <style>{`
        @keyframes subtle-pulse {
          0%, 100% {
            box-shadow: 0 0 0 0 rgba(var(--primary-rgb, 59, 130, 246), 0.4);
          }
          50% {
            box-shadow: 0 0 0 8px rgba(var(--primary-rgb, 59, 130, 246), 0);
          }
        }
      `}</style>
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, scale: 0.8, y: 10 }}
          animate={{ 
            opacity: 1, 
            scale: 1, 
            y: 0,
          }}
        exit={{ opacity: 0, scale: 0.8, y: 10 }}
        transition={{ type: "spring", stiffness: 300, damping: 25 }}
        className="fixed 
          bottom-24 right-2 
          sm:bottom-28 sm:right-4 
          md:bottom-24 md:right-20 
          z-[1000] 
          w-[calc(100vw-1rem)] 
          max-w-[280px] 
          sm:max-w-xs 
          md:max-w-sm
          mx-2 sm:mx-0
          pointer-events-auto"
      >
        <div className="relative bg-gradient-to-br from-background to-muted border-2 border-primary/50 rounded-xl shadow-2xl p-3 sm:p-4 backdrop-blur-xl" style={{ animation: 'subtle-pulse 2s ease-in-out infinite' }}>
          {/* Close button */}
          <button
            onClick={handleClose}
            className="absolute top-1.5 right-1.5 sm:top-2 sm:right-2 p-1.5 sm:p-1 rounded-full hover:bg-muted active:bg-muted transition-colors text-muted-foreground hover:text-foreground touch-manipulation"
            aria-label="Close tooltip"
            style={{ minWidth: '32px', minHeight: '32px' }}
          >
            <X className="h-4 w-4 sm:h-4 sm:w-4" />
          </button>

          {/* Message */}
          <div className="pr-8 sm:pr-6">
            <p className="text-xs sm:text-sm text-foreground leading-relaxed break-words">{message}</p>
          </div>

          {/* Animated indicator - hidden on very small screens */}
          <motion.div
            className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-0 h-0 border-l-6 sm:border-l-8 border-r-6 sm:border-r-8 border-t-6 sm:border-t-8 border-transparent border-t-primary/30"
            animate={{
              y: [0, -3, 0],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        </div>
      </motion.div>
    </AnimatePresence>
    </>
  );
}

