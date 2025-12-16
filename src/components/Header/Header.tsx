import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import type { Variants, MotionProps } from "framer-motion";
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
  { name: "Home", href: "#hero" },
  { name: "About", href: "#about" },
  { name: "Education", href: "#education" },
  { name: "Career", href: "#career" },
  { name: "Projects", href: "#projects" },
  { name: "Achievements", href: "#achievements" },
  { name: "Contact", href: "#contact" },
];

export default function Header() {
  const theme = useAppSelector((state) => state.theme.theme);
  const dispatch = useAppDispatch();
  const [showHeader, setShowHeader] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
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

  // Scroll listener for hide/show header
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY > lastScrollY && currentScrollY > 80) {
        setShowHeader(false); // Scrolling down
      } else {
        setShowHeader(true); // Scrolling up
      }
      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [lastScrollY]);

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

  const handleScrollTo = (id: string) => {
    // Remove # if present and find the element
    const cleanId = id.replace("#", "");
    const el = document.getElementById(cleanId) || document.querySelector(id);
    if (el) {
      const offset = 80;
      const elementPosition = el.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
    }
    setIsMobileMenuOpen(false); // Close mobile menu on click
  };

  const toggleFullscreen = async () => {
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
      console.error("Error toggling fullscreen:", error);
    }
  };

  // ✅ Typed variants
  const menuVariants: Variants = {
    open: {
      clipPath: "circle(1200px at 90% 5%)",
      transition: {
        type: "spring",
        stiffness: 20,
        restDelta: 2,
      },
    },
    closed: {
      clipPath: "circle(20px at 90% 5%)",
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 40,
      },
    },
  };

  const listVariants: Variants = {
    open: {
      transition: { staggerChildren: 0.07, delayChildren: 0.2 },
    },
    closed: {
      transition: { staggerChildren: 0.05, staggerDirection: -1 },
    },
  };

  const itemVariants: Variants = {
    open: {
      y: 0,
      opacity: 1,
      transition: {
        y: { stiffness: 1000, velocity: -100 },
      },
    },
    closed: {
      y: 50,
      opacity: 0,
      transition: {
        y: { stiffness: 1000 },
      },
    },
  };

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
            >
              <BookCheckIcon />
            </a>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex flex-1 justify-center">
              <ul className="flex space-x-6">
                {navItems.map((item) => (
                  <motion.li
                    key={item.name}
                    className="relative group text-sm font-medium text-gray-600 
                    dark:text-gray-300 transition-colors"
                  >
                    <a
                      onClick={() => handleScrollTo(item.href)}
                      className="cursor-pointer hover:text-pink-800
                       dark:hover:text-pink-400"
                    >
                      {item.name}
                    </a>
                    <motion.span
                      className="absolute bottom-0 left-1/2 w-0 h-0.5 bg-blue-500 rounded-full"
                      initial={{ width: 0, x: "-50%" }}
                      whileHover={{ width: "100%" }}
                      transition={{ duration: 0.3 }}
                    />
                  </motion.li>
                ))}
              </ul>
            </nav>

            {/* Desktop Action Buttons */}
            <div className="hidden md:flex items-center gap-2">
              {/* Tour Restart Button */}
              {tour && (
                <motion.button
                  onClick={tour.startTour}
                  className="p-2 rounded-full text-sm font-semibold
                  hover:bg-pink-400 dark:hover:bg-pink-800 transition-colors"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  title="Start Tour"
                >
                  <HelpCircle
                    size={20}
                    className="text-gray-800 dark:text-white"
                  />
                </motion.button>
              )}

              {/* Fullscreen Toggle Button */}
              <motion.button
                onClick={toggleFullscreen}
                className="p-2 rounded-full text-sm font-semibold
                hover:bg-pink-400 dark:hover:bg-pink-800 transition-colors"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                title={isFullscreen ? "Exit Fullscreen" : "Enter Fullscreen"}
              >
                {isFullscreen ? (
                  <motion.div
                    key="minimize"
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.8, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Minimize2
                      size={20}
                      className="text-gray-800 dark:text-white"
                    />
                  </motion.div>
                ) : (
                  <motion.div
                    key="maximize"
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.8, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Maximize2
                      size={20}
                      className="text-gray-800 dark:text-white"
                    />
                  </motion.div>
                )}
              </motion.button>

              {/* Theme Toggle Button */}
              <motion.button
                onClick={() => dispatch(toggleTheme())}
                className="p-2 rounded-full text-sm font-semibold
                hover:bg-pink-400 dark:hover:bg-pink-800 transition-colors"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                {theme === "dark" ? (
                  <motion.div
                    key="moon"
                    initial={{ y: -20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: 20, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Moon size={20} className="text-gray-800 dark:text-white" />
                  </motion.div>
                ) : (
                  <motion.div
                    key="sun"
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: -20, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Sun size={20} className="text-gray-800 dark:text-white" />
                  </motion.div>
                )}
              </motion.button>
            </div>

            {/* Mobile Menu Button - Hamburger */}
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className="md:hidden text-gray-800 dark:text-white"
            >
              <Menu size={24} />
            </button>
          </div>

          {/* Mobile Sidebar */}

          {isMobileMenuOpen && (
            <motion.div
              {...({
                initial: "closed",
                animate: "open",
                exit: "closed",
                variants: menuVariants,
              } as MotionProps)}
              className="fixed inset-0 z-[9999] bg-background dark:bg-background-dark md:hidden flex flex-col items-center justify-center"
            >
              {/* Close Button inside the sidebar */}
              <motion.button
                onClick={() => setIsMobileMenuOpen(false)}
                className="absolute top-8 right-8 text-gray-800 dark:text-white"
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0, opacity: 0 }}
                transition={{ delay: 0.2 }}
              >
                <X size={32} />
              </motion.button>

              <motion.ul
                {...({
                  variants: listVariants,
                } as MotionProps)}
                className="flex flex-col items-center justify-center h-full space-y-8"
              >
                {navItems.map((item) => (
                  <motion.li
                    key={item.name}
                    {...({ variants: itemVariants } as MotionProps)}
                  >
                    <a
                      onClick={() => handleScrollTo(item.href)}
                      className="text-4xl font-bold text-gray-800 dark:text-white cursor-pointer"
                    >
                      {item.name}
                    </a>
                  </motion.li>
                ))}
                {/* Action Buttons in Mobile Menu */}
                <motion.li
                  {...({ variants: itemVariants } as MotionProps)}
                  className="mt-8 flex items-center gap-4 flex-wrap justify-center"
                >
                  {/* Tour Restart Button */}
                  {tour && (
                    <motion.button
                      onClick={() => {
                        tour.startTour();
                        setIsMobileMenuOpen(false);
                      }}
                      className="p-4 rounded-full text-sm font-semibold
                        hover:bg-pink-400 dark:hover:bg-pink-800 transition-colors
                        bg-gray-200 dark:bg-gray-800"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      title="Start Tour"
                    >
                      <HelpCircle
                        size={32}
                        className="text-gray-800 dark:text-white"
                      />
                    </motion.button>
                  )}

                  {/* Fullscreen Toggle */}
                  <motion.button
                    onClick={() => {
                      toggleFullscreen();
                      setIsMobileMenuOpen(false);
                    }}
                    className="p-4 rounded-full text-sm font-semibold
                      hover:bg-pink-400 dark:hover:bg-pink-800 transition-colors
                      bg-gray-200 dark:bg-gray-800"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    title={
                      isFullscreen ? "Exit Fullscreen" : "Enter Fullscreen"
                    }
                  >
                    {isFullscreen ? (
                      <motion.div
                        key="minimize"
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.8, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        <Minimize2
                          size={32}
                          className="text-gray-800 dark:text-white"
                        />
                      </motion.div>
                    ) : (
                      <motion.div
                        key="maximize"
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.8, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        <Maximize2
                          size={32}
                          className="text-gray-800 dark:text-white"
                        />
                      </motion.div>
                    )}
                  </motion.button>

                  {/* Theme Toggle */}
                  <motion.button
                    onClick={() => dispatch(toggleTheme())}
                    className="p-4 rounded-full text-sm font-semibold
                      hover:bg-pink-400 dark:hover:bg-pink-800 transition-colors
                      bg-gray-200 dark:bg-gray-800"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    {theme === "dark" ? (
                      <motion.div
                        key="moon"
                        initial={{ y: -20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: 20, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        <Moon
                          size={32}
                          className="text-gray-800 dark:text-white"
                        />
                      </motion.div>
                    ) : (
                      <motion.div
                        key="sun"
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: -20, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        <Sun
                          size={32}
                          className="text-gray-800 dark:text-white"
                        />
                      </motion.div>
                    )}
                  </motion.button>
                </motion.li>
              </motion.ul>
            </motion.div>
          )}
        </motion.header>
      )}
    </>
  );
}
