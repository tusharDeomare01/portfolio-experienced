import { useEffect, useState, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useThrottleRAF } from "@/hooks/useThrottle";
import { selectTheme } from "@/store/hooks";
import { gsap } from "@/lib/gsap";
import {
  Menu,
  X,
  Sun,
  Moon,
  BookCheckIcon,
  Maximize2,
  Minimize2,
  HelpCircle,
} from "lucide-react";
import { BorderBeam } from "../lightswind/border-beam";
import { useAppSelector, useAppDispatch } from "@/store/hooks";
import { toggleTheme } from "@/store/slices/themeSlice";
import { useTourContext } from "../Tour/TourContext";

const navItems = [
  { name: "Home", href: "#hero", isRoute: false },
  { name: "About", href: "#about", isRoute: false },
  { name: "Education", href: "#education", isRoute: false },
  { name: "Career", href: "#career", isRoute: false },
  { name: "Projects", href: "#projects", isRoute: false },
  { name: "Achievements", href: "#achievements", isRoute: false },
  { name: "My Card", href: "/lanyard", isRoute: true },
  { name: "Contact", href: "#contact", isRoute: false },
];

export default function Header() {
  const navigate = useNavigate();
  // ROOT CAUSE FIX: Ensure theme has a fallback value in case Redux Persist hasn't hydrated
  // In production, Redux Persist hydration might be delayed, causing undefined theme
  const theme = useAppSelector(selectTheme) || 'dark'; // Default to dark theme
  const dispatch = useAppDispatch();
  const [showHeader, setShowHeader] = useState(true);
  const lastScrollYRef = useRef(0);
  const isInitialMountRef = useRef(true); // Track initial mount to prevent immediate hide
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Tour context - wrapped in try-catch in case TourProvider is not available
  let tour: ReturnType<typeof useTourContext> | null = null;
  try {
    tour = useTourContext();
  } catch {
    // TourProvider not available, tour will be null
  }

  // Apply theme on mount (in case Redux Persist hasn't hydrated yet)
  useEffect(() => {
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [theme]);

  // Initialize scroll position on mount
  useEffect(() => {
    // Set initial scroll position to prevent false positives
    lastScrollYRef.current = window.scrollY;
    // Mark initial mount as complete after a short delay
    const timer = setTimeout(() => {
      isInitialMountRef.current = false;
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  // Scroll listener for hide/show header - optimized with throttled handler
  const handleScroll = useThrottleRAF(() => {
    // Don't hide header during initial mount to prevent production rendering issues
    if (isInitialMountRef.current) {
      return;
    }

    const currentScrollY = window.scrollY;
    const lastScrollY = lastScrollYRef.current;

    if (currentScrollY > lastScrollY && currentScrollY > 80) {
      setShowHeader(false); // Scrolling down
    } else {
      setShowHeader(true); // Scrolling up
    }
    lastScrollYRef.current = currentScrollY;
  });

  useEffect(() => {
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [handleScroll]);

  // Fullscreen change listener
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);
    document.addEventListener("webkitfullscreenchange", handleFullscreenChange);
    document.addEventListener("mozfullscreenchange", handleFullscreenChange);
    document.addEventListener("MSFullscreenChange", handleFullscreenChange);

    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
      document.removeEventListener(
        "webkitfullscreenchange",
        handleFullscreenChange
      );
      document.removeEventListener(
        "mozfullscreenchange",
        handleFullscreenChange
      );
      document.removeEventListener(
        "MSFullscreenChange",
        handleFullscreenChange
      );
    };
  }, []);

  const handleScrollTo = useCallback((href: string, isRoute: boolean = false) => {
    if (isRoute) {
      // Handle route navigation
      navigate(href);
      setIsMobileMenuOpen(false);
      return;
    }

    // Handle scroll navigation for hash links — use GSAP ScrollToPlugin
    // so scroll animation coordinates with ScrollTrigger (native scrollTo conflicts)
    const cleanId = href.replace("#", "");
    const el = document.getElementById(cleanId) || document.querySelector(href);
    if (el) {
      gsap.to(window, {
        scrollTo: { y: el, offsetY: 80 },
        duration: 1,
        ease: "power2.inOut",
      });
    }
    setIsMobileMenuOpen(false); // Close mobile menu on click
  }, [navigate]);

  const toggleFullscreen = useCallback(async () => {
    try {
      if (!document.fullscreenElement) {
        // Enter fullscreen
        const element = document.documentElement;
        if (element.requestFullscreen) {
          await element.requestFullscreen();
        } else if ((element as any).webkitRequestFullscreen) {
          // Safari
          await (element as any).webkitRequestFullscreen();
        } else if ((element as any).mozRequestFullScreen) {
          // Firefox
          await (element as any).mozRequestFullScreen();
        } else if ((element as any).msRequestFullscreen) {
          // IE/Edge
          await (element as any).msRequestFullscreen();
        }
      } else {
        // Exit fullscreen
        if (document.exitFullscreen) {
          await document.exitFullscreen();
        } else if ((document as any).webkitExitFullscreen) {
          await (document as any).webkitExitFullscreen();
        } else if ((document as any).mozCancelFullScreen) {
          await (document as any).mozCancelFullScreen();
        } else if ((document as any).msExitFullscreen) {
          await (document as any).msExitFullscreen();
        }
      }
    } catch (error) {
      if (import.meta.env.DEV) {
        console.error("Error toggling fullscreen:", error);
      }
    }
  }, []);

  const handleThemeToggle = useCallback(() => {
    dispatch(toggleTheme());
  }, [dispatch]);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMobileMenuOpen]);

  const handleMobileMenuOpen = useCallback(() => {
    setIsMobileMenuOpen(true);
  }, []);

  const handleMobileMenuClose = useCallback(() => {
    setIsMobileMenuOpen(false);
  }, []);

  const handleTourStart = useCallback(() => {
    if (tour) {
      tour.startTour();
      setIsMobileMenuOpen(false);
    }
  }, [tour]);

  return (
    <>
      {showHeader && (
        <motion.header
          initial={{ y: -100, top: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -100, opacity: 0, transition: { duration: 0.4 } }}
          transition={{ duration: 0.2, ease: "easeOut" }}
          className="fixed top-0 left-0 right-0 z-[9999] flex justify-center px-4"
        >
          <div
            className="border border-gray-100 dark:border-gray-900 backdrop-blur-xl
            w-full xl:max-w-6xl rounded-full
            flex items-center justify-between px-6 py-3
            transition-all duration-300"
          >
            <BorderBeam />

            {/* Logo / Brand */}
            <a
              onClick={() => handleScrollTo("#hero")}
              className="cursor-pointer font-bold text-lg text-gray-800 dark:text-white"
              aria-label="Go to home"
            >
              <BookCheckIcon />
            </a>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex flex-1 justify-center">
              <ul className="flex space-x-6">
                {navItems.map((item) => (
                  <li
                    key={item.name}
                    className="relative group text-sm font-medium text-gray-600 
                    dark:text-gray-300 transition-colors"
                  >
                    <a
                      onClick={() => handleScrollTo(item.href, item.isRoute)}
                      className="cursor-pointer hover:text-pink-800
                       dark:hover:text-pink-400"
                      data-my-card={item.name === "My Card" ? "true" : undefined}
                    >
                      {item.name}
                    </a>
                    <span className="absolute bottom-0 left-1/2 w-0 h-0.5 bg-blue-500 rounded-full -translate-x-1/2 transition-all duration-300 group-hover:w-full" />
                  </li>
                ))}
              </ul>
            </nav>

            {/* Desktop Action Buttons */}
            <div className="hidden md:flex items-center gap-2">
              {/* Tour Restart Button */}
              {tour && (
                <button
                  onClick={tour.startTour}
                  className="cursor-pointer p-2 rounded-full text-sm font-semibold hover:bg-pink-400 dark:hover:bg-pink-800 transition-all duration-200 hover:scale-110 active:scale-90"
                  title="Start Tour"
                >
                  <HelpCircle
                    size={20}
                    className="text-gray-800 dark:text-white"
                  />
                </button>
              )}

              {/* Fullscreen Toggle Button */}
              <button
                onClick={toggleFullscreen}
                className="cursor-pointer p-2 rounded-full text-sm font-semibold hover:bg-pink-400 dark:hover:bg-pink-800 transition-all duration-200 hover:scale-110 active:scale-90"
                title={isFullscreen ? "Exit Fullscreen" : "Enter Fullscreen"}
              >
                {isFullscreen ? (
                  <div key="minimize" className="animate-scale-fade-in">
                    <Minimize2
                      size={20}
                      className="text-gray-800 dark:text-white"
                    />
                  </div>
                ) : (
                  <div key="maximize" className="animate-scale-fade-in">
                    <Maximize2
                      size={20}
                      className="text-gray-800 dark:text-white"
                    />
                  </div>
                )}
              </button>

              {/* Theme Toggle Button */}
              <button
                onClick={handleThemeToggle}
                title="Toggle Theme"
                className="cursor-pointer p-2 rounded-full text-sm font-semibold hover:bg-pink-400 dark:hover:bg-pink-800 transition-all duration-200 hover:scale-110 active:scale-90"
              >
                {theme === "dark" ? (
                  <div key="moon" className="animate-slide-fade-down">
                    <Moon size={20} className="text-gray-800 dark:text-white" />
                  </div>
                ) : (
                  <div key="sun" className="animate-slide-fade-up">
                    <Sun size={20} className="text-gray-800 dark:text-white" />
                  </div>
                )}
              </button>
            </div>

            {/* Mobile Menu Button - Hamburger */}
            <button
              onClick={handleMobileMenuOpen}
              className="md:hidden text-gray-800 dark:text-white"
              aria-label="Open menu"
            >
              <Menu size={24} />
            </button>
          </div>

          {/* Mobile Sidebar */}
          {isMobileMenuOpen && (
            <div 
              className="fixed inset-0 z-[9999] bg-background/95 dark:bg-background-dark/95 backdrop-blur-md md:hidden flex flex-col items-center justify-center animate-menu-open"
              onClick={handleMobileMenuClose}
            >
              {/* Backdrop overlay for better visual separation */}
              <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/50 to-background/80 dark:via-background-dark/50 dark:to-background-dark/80" />
              
              {/* Close Button inside the sidebar */}
              <button
                onClick={handleMobileMenuClose}
                className="absolute top-8 right-8 z-10 text-gray-800 dark:text-white animate-scale-fade-delayed p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-800 transition-all duration-200 hover:scale-110 active:scale-90"
                aria-label="Close menu"
              >
                <X size={32} />
              </button>

              {/* Menu Content Container */}
              <div 
                className="relative z-10 w-full flex flex-col items-center justify-center animate-menu-content"
                onClick={(e) => e.stopPropagation()}
              >
                <ul className="flex flex-col items-center justify-center space-y-6 animate-stagger-fade-in">
                  {navItems.map((item) => (
                    <li key={item.name} className="mobile-menu-item">
                      <a
                        onClick={() => handleScrollTo(item.href, item.isRoute)}
                        className="text-4xl font-bold text-gray-800 dark:text-white cursor-pointer px-4 py-2 rounded-lg transition-all duration-300"
                        data-my-card={item.name === "My Card" ? "true" : undefined}
                      >
                        {item.name}
                      </a>
                    </li>
                  ))}
                </ul>
                
                {/* Action Buttons in Mobile Menu */}
                <div className="mt-12 flex items-center gap-4 flex-wrap justify-center mobile-menu-actions">
                  {/* Tour Restart Button */}
                  {tour && (
                    <button
                      onClick={handleTourStart}
                      className="p-4 rounded-full text-sm font-semibold hover:bg-pink-400 dark:hover:bg-pink-800 bg-gray-200 dark:bg-gray-800 transition-all duration-200 hover:scale-110 active:scale-90"
                      title="Start Tour"
                    >
                      <HelpCircle
                        size={32}
                        className="text-gray-800 dark:text-white"
                      />
                    </button>
                  )}

                  {/* Fullscreen Toggle */}
                  <button
                    onClick={() => {
                      toggleFullscreen();
                      handleMobileMenuClose();
                    }}
                    className="p-4 rounded-full text-sm font-semibold hover:bg-pink-400 dark:hover:bg-pink-800 bg-gray-200 dark:bg-gray-800 transition-all duration-200 hover:scale-110 active:scale-90"
                    title={
                      isFullscreen ? "Exit Fullscreen" : "Enter Fullscreen"
                    }
                  >
                    {isFullscreen ? (
                      <div key="minimize" className="animate-scale-fade-in">
                        <Minimize2
                          size={32}
                          className="text-gray-800 dark:text-white"
                        />
                      </div>
                    ) : (
                      <div key="maximize" className="animate-scale-fade-in">
                        <Maximize2
                          size={32}
                          className="text-gray-800 dark:text-white"
                        />
                      </div>
                    )}
                  </button>

                  {/* Theme Toggle */}
                  <button
                    onClick={handleThemeToggle}
                    className="p-4 rounded-full text-sm font-semibold hover:bg-pink-400 dark:hover:bg-pink-800 bg-gray-200 dark:bg-gray-800 transition-all duration-200 hover:scale-110 active:scale-90"
                  >
                    {theme === "dark" ? (
                      <div key="moon" className="animate-slide-fade-down">
                        <Moon
                          size={32}
                          className="text-gray-800 dark:text-white"
                        />
                      </div>
                    ) : (
                      <div key="sun" className="animate-slide-fade-up">
                        <Sun
                          size={32}
                          className="text-gray-800 dark:text-white"
                        />
                      </div>
                    )}
                  </button>
                </div>
              </div>
            </div>
          )}
        </motion.header>
      )}
    </>
  );
}
