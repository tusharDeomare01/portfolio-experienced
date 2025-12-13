import { useRef, useState, useEffect } from "react";
import {
  motion,
  AnimatePresence,
  useMotionValue,
  useDragControls,
} from "framer-motion";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  openChat,
  closeChat,
  showTooltip,
  setUserInteracted,
  setLastInteractivePromptTime,
  markAsRead,
} from "@/store/slices/chatSlice";
import ChatInterface from "./ChatInterface";
import InteractiveTooltip from "./InteractiveTooltip";
import { Sparkles } from "lucide-react";
import { initializeAudioContext } from "@/lib/audioUtils";
import {
  resetPageTitle,
  updatePageTitle,
  requestNotificationPermission,
  getNotificationPreferences,
} from "@/lib/notificationUtils";

export default function AIAssistant() {
  const dispatch = useAppDispatch();
  const isOpen = useAppSelector((state) => state.chat.isOpen);
  const isFullscreen = useAppSelector((state) => state.chat.isFullscreen);
  const theme = useAppSelector((state) => state.theme.theme);
  const showTooltipState = useAppSelector((state) => state.chat.showTooltip);
  const userInteracted = useAppSelector((state) => state.chat.userInteracted);
  const unreadCount = useAppSelector((state) => state.chat.unreadCount);
  const widgetRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const tooltipShownRef = useRef(false);
  const dragControls = useDragControls();

  const x = useMotionValue(0);
  const y = useMotionValue(0);

  // Reset position when fullscreen changes
  useEffect(() => {
    if (isFullscreen) {
      x.set(0);
      y.set(0);
    }
  }, [isFullscreen, x, y]);

  // Hide tooltip when chat opens
  useEffect(() => {
    if (isOpen && showTooltipState) {
      dispatch(setUserInteracted(true));
    }
  }, [isOpen, showTooltipState, dispatch]);

  // Initialize audio context early (at app start) to preload audio
  useEffect(() => {
    // Try to initialize audio context immediately on app start
    // This preloads the audio context in the background
    initializeAudioContext();

    // Also initialize on user interaction (for browsers that require it)
    const handleUserInteraction = () => {
      initializeAudioContext();
      // Request notification permission on first interaction
      requestNotificationPermission().catch(() => {
        // Silently fail if permission cannot be requested
      });
    };

    // Listen for various user interaction events
    window.addEventListener("click", handleUserInteraction, { once: true });
    window.addEventListener("touchstart", handleUserInteraction, {
      once: true,
    });
    window.addEventListener("keydown", handleUserInteraction, { once: true });

    return () => {
      window.removeEventListener("click", handleUserInteraction);
      window.removeEventListener("touchstart", handleUserInteraction);
      window.removeEventListener("keydown", handleUserInteraction);
    };
  }, []);

  // Update page title based on unread count
  useEffect(() => {
    const prefs = getNotificationPreferences();
    if (!isOpen && unreadCount > 0 && prefs.pageTitleNotifications) {
      updatePageTitle(unreadCount);
    } else if (isOpen || unreadCount === 0) {
      resetPageTitle();
    }
  }, [isOpen, unreadCount]);

  // Cleanup page title on unmount
  useEffect(() => {
    return () => {
      resetPageTitle();
    };
  }, []);

  // Show tooltip on initial page load (after 8 seconds)
  useEffect(() => {
    if (tooltipShownRef.current || userInteracted || isOpen || showTooltipState)
      return;

    // Check if we should show tooltip based on localStorage
    const lastShown = localStorage.getItem("aiAssistantTooltipLastShown");
    const now = Date.now();
    const oneDay = 24 * 60 * 60 * 1000; // 24 hours

    // Show tooltip if:
    // 1. Never shown before, OR
    // 2. Last shown more than 24 hours ago
    const shouldShow = !lastShown || now - parseInt(lastShown) > oneDay;

    if (shouldShow) {
      // Ensure audio context is initialized before showing tooltip
      // This preloads audio during the 8 second delay
      initializeAudioContext();

      // Wait 8 seconds for page to be fully loaded and audio to be preloaded
      const timer = setTimeout(() => {
        // Only show if chat is not open and user hasn't interacted
        if (!isOpen && !userInteracted && !showTooltipState) {
          dispatch(showTooltip());
          localStorage.setItem("aiAssistantTooltipLastShown", now.toString());
          tooltipShownRef.current = true;
        }
      }, 8000); // 8 seconds - allows time for audio preloading

      return () => clearTimeout(timer);
    }
  }, [dispatch, isOpen, userInteracted, showTooltipState]);

  // Auto-hide tooltip after 30 seconds and schedule interactive prompt
  useEffect(() => {
    if (!showTooltipState || userInteracted || isOpen) return;

    const timer = setTimeout(() => {
      // If tooltip is still showing and user hasn't interacted, hide it
      // and schedule a re-trigger for when chat opens
      if (showTooltipState && !userInteracted && !isOpen) {
        dispatch(setLastInteractivePromptTime(Date.now()));
        // Tooltip will be hidden when user opens chat or after timeout
      }
    }, 30000); // 30 seconds

    return () => clearTimeout(timer);
  }, [showTooltipState, userInteracted, isOpen, dispatch]);

  const handleToggle = () => {
    if (isOpen) {
      dispatch(closeChat());
    } else {
      dispatch(openChat());
      dispatch(markAsRead());
      dispatch(setUserInteracted(true));
      resetPageTitle();
      // Reset position when opening
      x.set(0);
      y.set(0);
    }
  };

  const handleDragStart = () => {
    setIsDragging(true);
  };

  const handleDragEnd = () => {
    setIsDragging(false);
  };

  // Calculate drag constraints - relative to initial position (0,0)
  const getDragConstraints = () => {
    if (typeof window === "undefined" || isFullscreen) return false;

    // Responsive widget dimensions
    const isMobile = window.innerWidth < 640; // sm breakpoint
    const widgetWidth = isMobile ? window.innerWidth - 16 : 384; // w-96 = 384px on desktop
    const widgetHeight = isMobile ? window.innerHeight - 128 : 600; // h-[600px] on desktop
    const padding = isMobile ? 8 : 20; // Safe padding from edges

    // Calculate max drag distance from initial position
    // Initial position varies by screen size
    const initialRight = isMobile ? 8 : 16; // right-2 (8px) on mobile, right-4 (16px) on desktop
    const initialBottom = isMobile ? 80 : 112; // bottom-20 (80px) on mobile, bottom-28 (112px) on desktop

    const maxLeft = -(window.innerWidth - widgetWidth - padding - initialRight);
    const maxRight = window.innerWidth - widgetWidth - padding - initialRight;
    const maxTop = -(
      window.innerHeight -
      widgetHeight -
      padding -
      initialBottom
    );
    const maxBottom =
      window.innerHeight - widgetHeight - padding - initialBottom;

    return {
      left: maxLeft,
      right: maxRight,
      top: maxTop,
      bottom: maxBottom,
    };
  };

  const dragEnabled = !isFullscreen && isOpen;

  const handleTooltipClose = () => {
    // Tooltip close is handled by InteractiveTooltip component
  };

  return (
    <>
      {/* Interactive Tooltip */}
      {!isOpen && (
        <InteractiveTooltip
          message="Hey! I am Tushar's personal AI assistant. How can I help you?"
          onClose={handleTooltipClose}
        />
      )}

      {/* Floating Button */}
      <AnimatePresence>
        {!isOpen && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ type: "spring", stiffness: 260, damping: 20 }}
            className="
        fixed z-[999]
        bottom-20 right-3     /* Mobile: 80px from bottom, 12px from right */
        sm:bottom-22 sm:right-4 /* Small screens: 88px from bottom, 16px from right */
        md:bottom-7 md:right-7  /* Medium and up: 28px from bottom, 28px from right */
      "
          >
            <motion.button
              onClick={handleToggle}
              data-ai-assistant
              className={`
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
                    : "bg-pink-500 border-pink-500"
                }
              `}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              {/* Subtle glow effect */}
              <motion.div
                className={`absolute inset-0 rounded-full blur-md ${
                  theme === "dark" ? "bg-white/10" : "bg-pink-400/20"
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

              {/* Sparkles icon with animation */}
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
                <Sparkles
                  className={`h-6 w-6 sm:h-7 sm:w-7 group-hover:opacity-90 transition-colors drop-shadow-lg ${
                    theme === "dark" ? "text-white" : "text-white"
                  }`}
                  strokeWidth={2}
                />
              </motion.div>

              {/* Unread badge */}
              {unreadCount > 0 && getNotificationPreferences().badgeEnabled && (
                <motion.div
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0, opacity: 0 }}
                  className="absolute -top-1 -right-1 z-20 bg-red-500 text-white text-xs font-bold rounded-full min-w-[20px] h-5 flex items-center justify-center px-1.5 shadow-lg border-2 border-background"
                >
                  {unreadCount > 99 ? "99+" : unreadCount}
                </motion.div>
              )}

              {/* Subtle pulsing ring effect */}
              <motion.div
                className={`absolute inset-0 rounded-full border-2 ${
                  theme === "dark" ? "border-white/30" : "border-pink-400/40"
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

              {/* Tooltip text */}
              <motion.div
                className="absolute -top-12 right-0 bg-foreground/90 text-background text-xs px-3 py-1.5 rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-50"
                initial={{ opacity: 0, y: 5 }}
                whileHover={{ opacity: 1, y: 0 }}
              >
                AI Assistant
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-full w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-foreground/90" />
              </motion.div>
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Chat Widget */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            ref={widgetRef}
            drag={dragEnabled}
            dragMomentum={false}
            dragConstraints={getDragConstraints()}
            dragElastic={0.05}
            dragControls={dragControls}
            dragListener={false}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{
              opacity: 1,
              scale: 1,
            }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ duration: 0.2 }}
            style={{
              cursor: dragEnabled
                ? isDragging
                  ? "grabbing"
                  : "default"
                : "default",
              x: dragEnabled ? x : 0,
              y: dragEnabled ? y : 0,
              touchAction: dragEnabled ? "none" : "auto",
            }}
            className={`${
              isFullscreen
                ? "fixed inset-2 sm:inset-4 z-[19999]"
                : "fixed bottom-20 right-2 sm:bottom-28 sm:right-4 w-[calc(100vw-1rem)] sm:w-96 h-[calc(100vh-6rem)] sm:h-[600px] max-w-sm sm:max-w-none z-[19999] flex flex-col"
            } flex flex-col`}
          >
            <ChatInterface
              isFullscreen={isFullscreen}
              dragEnabled={dragEnabled}
              dragControls={dragControls}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
