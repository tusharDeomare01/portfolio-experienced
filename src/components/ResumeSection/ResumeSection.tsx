import { useState, useMemo, useEffect, useCallback, useRef } from "react";
import { motion } from "framer-motion";
import { FileText, AlertCircle, RefreshCw } from "lucide-react";
import { Viewer, Worker } from "@react-pdf-viewer/core";
import { defaultLayoutPlugin } from "@react-pdf-viewer/default-layout";
import { ScrollReveal } from "../lightswind/scroll-reveal";
import { Card, CardContent } from "../lightswind/card";
import { BorderBeam } from "../lightswind/border-beam";
import { Button } from "../lightswind/button";
import { useIsMobile } from "../hooks/use-mobile";

// Import PDF viewer styles
import "@react-pdf-viewer/core/lib/styles/index.css";
import "@react-pdf-viewer/default-layout/lib/styles/index.css";

// Create plugin instance outside component to ensure it's truly stable
// This prevents React Strict Mode from causing cleanup issues
let globalPluginInstance: ReturnType<typeof defaultLayoutPlugin> | null = null;

const getPluginInstance = () => {
  if (!globalPluginInstance) {
    try {
      globalPluginInstance = defaultLayoutPlugin({
        sidebarTabs: (defaultTabs) => [
          defaultTabs[0], // Thumbnails tab
        ],
      });
    } catch (error) {
      globalPluginInstance = defaultLayoutPlugin();
    }
  }
  return globalPluginInstance;
};

export const ResumeSection = () => {
  const [pdfError, setPdfError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [viewerKey, setViewerKey] = useState(0); // Key for forcing re-render
  const [isAppFullscreen, setIsAppFullscreen] = useState(false);
  const isMobile = useIsMobile();
  const isMountedRef = useRef(true);

  // Track component mount state
  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  // Detect application-level fullscreen (from Header component)
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsAppFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);
    document.addEventListener("webkitfullscreenchange", handleFullscreenChange);
    document.addEventListener("mozfullscreenchange", handleFullscreenChange);
    document.addEventListener("MSFullscreenChange", handleFullscreenChange);

    // Initial check
    setIsAppFullscreen(!!document.fullscreenElement);

    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
      document.removeEventListener("webkitfullscreenchange", handleFullscreenChange);
      document.removeEventListener("mozfullscreenchange", handleFullscreenChange);
      document.removeEventListener("MSFullscreenChange", handleFullscreenChange);
    };
  }, []);

  // Helper function to exit application fullscreen
  const exitAppFullscreen = useCallback(async (): Promise<void> => {
    if (document.fullscreenElement) {
      try {
        if (document.exitFullscreen) {
          await document.exitFullscreen();
        } else if ((document as any).webkitExitFullscreen) {
          await (document as any).webkitExitFullscreen();
        } else if ((document as any).mozCancelFullScreen) {
          await (document as any).mozCancelFullScreen();
        } else if ((document as any).msExitFullscreen) {
          await (document as any).msExitFullscreen();
        }
      } catch (error) {
        // Silently handle errors - fullscreen might already be exiting
      }
    }
  }, []);

  // Get the stable plugin instance (created outside component)
  // Use only the defaultLayoutPlugin - it includes toolbar, zoom, search, print, download, fullscreen
  const plugins = useMemo(
    () => [getPluginInstance()],
    [] // Empty deps - plugin is module-level and stable
  );

  // Detect theme once on mount (no toggle/watch functionality)
  const theme = useMemo(
    () =>
      document.documentElement.classList.contains("dark") ? "dark" : "light",
    [] // Detect once, no updates
  );

  const handleDocumentLoad = useCallback(() => {
    if (isMountedRef.current) {
      setIsLoading(false);
      setPdfError(null);
    }
  }, []);

  // Handle errors from renderError callback
  const handleRenderError = useCallback((error: any) => {
    if (isMountedRef.current) {
      setIsLoading(false);
      const errorMessage =
        error?.message || "Failed to load PDF. Please check your connection.";
      setPdfError(errorMessage);
    }
  }, []);

  const handleRetry = useCallback(() => {
    setPdfError(null);
    setIsLoading(true);
    // Force re-render by changing key
    setViewerKey((prev) => prev + 1);
  }, []);

  // Intercept PDF viewer fullscreen button clicks when app is in fullscreen
  useEffect(() => {
    if (!isAppFullscreen) return; // Only intercept when app is in fullscreen

    const handleFullscreenButtonClick = (e: Event) => {
      const mouseEvent = e as MouseEvent;
      const target = mouseEvent.target as HTMLElement;
      
      // Check if clicked element is PDF viewer's fullscreen button
      const isFullscreenButton =
        target.closest('button[aria-label*="Full screen" i]') ||
        target.closest('button[aria-label*="fullscreen" i]') ||
        target.closest('[data-testid*="fullscreen" i]') ||
        target.closest('.rpv-full-screen-button') ||
        target.closest('button[title*="Full screen" i]') ||
        target.closest('button[title*="fullscreen" i]');

      if (isFullscreenButton) {
        e.preventDefault();
        e.stopPropagation();
        
        // Exit app fullscreen first, then trigger PDF viewer fullscreen
        void (async () => {
          await exitAppFullscreen();
          
          // Wait for fullscreen to exit and DOM to update
          await new Promise((resolve) => setTimeout(resolve, 150));
          
          // Then trigger PDF viewer fullscreen by clicking the button again
          const button = isFullscreenButton as HTMLButtonElement;
          if (button && !document.fullscreenElement) {
            // Use a small delay to ensure app fullscreen has fully exited
            setTimeout(() => {
              button.click();
            }, 100);
          }
        })();
      }
    };

    const container = document.querySelector('.resume-pdf-viewer');
    if (container) {
      // Use capture phase to catch the event before PDF viewer handles it
      container.addEventListener('click', handleFullscreenButtonClick, true);
      return () => {
        container.removeEventListener('click', handleFullscreenButtonClick, true);
      };
    }
  }, [isAppFullscreen, exitAppFullscreen]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ctrl/Cmd + F for search
      if ((e.ctrlKey || e.metaKey) && e.key === "f") {
        e.preventDefault();
        // Trigger search - the search plugin handles this
        const searchInput = document.querySelector(
          'input[placeholder*="Search"], input[type="search"]'
        ) as HTMLInputElement;
        if (searchInput) {
          searchInput.focus();
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Check if browser supports dvh units
  const supportsDvh = useMemo(() => {
    if (typeof window === 'undefined') return false;
    try {
      return CSS.supports('height', '100dvh');
    } catch {
      return false;
    }
  }, []);

  // Calculate responsive height based on mobile and fullscreen state
  const getViewerHeight = () => {
    if (isAppFullscreen) {
      // In fullscreen, use almost full viewport height
      return "calc(100vh - 80px)";
    }
    if (isMobile) {
      // Mobile: use dvh for better mobile browser support (accounts for browser UI)
      // Fallback to vh for browsers that don't support dvh
      return supportsDvh ? "calc(100dvh - 200px)" : "calc(100vh - 200px)";
    }
    // Desktop: more space for header and padding
    return "calc(100vh - 320px)";
  };

  const getMinHeight = () => {
    if (isAppFullscreen) {
      return "600px";
    }
    return isMobile ? "400px" : "600px";
  };

  const getMaxHeight = () => {
    if (isAppFullscreen) {
      return "100vh";
    }
    return isMobile ? "800px" : "900px";
  };

  return (
    <motion.section
      id="resume"
      className={`text-foreground max-w-4xl mx-auto w-full px-2 sm:px-4 md:px-6 py-8 sm:py-12 md:py-16 lg:py-20 min-h-screen flex flex-col justify-center overflow-x-hidden ${
        isAppFullscreen ? "app-fullscreen-resume" : ""
      }`}
      initial={{ opacity: 0, y: 50, filter: "blur(5px)" }}
      whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      viewport={{ once: true, amount: 0.2 }}
    >
      <motion.div
        className="text-center mb-6 sm:mb-8"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        viewport={{ once: true }}
      >
        {/* Header Section */}
        <div className="mb-2 sm:mb-3 flex items-baseline justify-center gap-2 sm:gap-4">
          <FileText className="w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10 lg:w-12 lg:h-12 text-primary flex-shrink-0 mt-1 md:mt-1.5 lg:mt-2" />
          <ScrollReveal
            size="xl"
            align="center"
            variant="default"
            enableBlur={true}
            blurStrength={5}
            baseRotation={0}
          >
            Resume
          </ScrollReveal>
        </div>

        <ScrollReveal
          size="sm"
          align="center"
          variant="muted"
          enableBlur={true}
          blurStrength={5}
          baseRotation={0}
          containerClassName="px-2 sm:px-0"
        >
          View and download my professional resume. Use the toolbar to zoom,
          search, print, or download the document.
        </ScrollReveal>
      </motion.div>

      {/* PDF Viewer Container */}
      <motion.div
        className="w-full"
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, ease: "easeOut", delay: 0.3 }}
        viewport={{ once: true }}
      >
        <Card className="backdrop-blur-xl bg-background/80 border-2 border-primary/20 hover:border-primary/40 transition-all duration-300 overflow-hidden">
          <BorderBeam />
          <CardContent className="p-0">
            {/* Loading State - Only show if PDF viewer hasn't loaded yet */}
            {isLoading && !pdfError && viewerKey === 0 && (
              <div className="flex items-center justify-center min-h-[400px] sm:min-h-[500px] md:min-h-[600px] bg-muted/20">
                <div className="text-center space-y-4">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
                  <p className="text-muted-foreground">Loading resume...</p>
                </div>
              </div>
            )}

            {/* Error State */}
            {pdfError && (
              <div className="flex flex-col items-center justify-center min-h-[400px] sm:min-h-[500px] md:min-h-[600px] bg-muted/20 p-8 space-y-4">
                <AlertCircle className="w-16 h-16 text-destructive" />
                <div className="text-center space-y-2">
                  <h3 className="text-lg font-semibold text-foreground">
                    Failed to Load Resume
                  </h3>
                  <p className="text-base sm:text-sm text-muted-foreground max-w-md">
                    {pdfError}
                  </p>
                </div>
                <Button
                  onClick={handleRetry}
                  variant="outline"
                  className="mt-4"
                  aria-label="Retry loading PDF"
                >
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Retry
                </Button>
              </div>
            )}

            {/* PDF Viewer - Always render container to avoid cleanup issues */}
            <div
              className={`w-full pdf-viewer-container resume-pdf-viewer ${
                isAppFullscreen ? "app-fullscreen-viewer" : ""
              }`}
              style={{
                height: getViewerHeight(),
                minHeight: getMinHeight(),
                maxHeight: getMaxHeight(),
                display: pdfError ? "none" : "block",
              }}
              role="region"
              aria-label="Resume PDF Viewer"
            >
              {plugins.length > 0 && isMountedRef.current && (
                <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.js">
                  <Viewer
                    key={`viewer-${viewerKey}`}
                    fileUrl="/Tushar_Deomare.pdf"
                    plugins={plugins}
                    onDocumentLoad={handleDocumentLoad}
                    theme={theme}
                    renderError={(error) => {
                      handleRenderError(error);
                      return (
                        <div className="flex flex-col items-center justify-center h-full p-8 space-y-4">
                          <AlertCircle className="w-16 h-16 text-destructive" />
                          <div className="text-center space-y-2">
                            <h3 className="text-lg font-semibold text-foreground">
                              Error Loading PDF
                            </h3>
                            <p className="text-base sm:text-sm text-muted-foreground max-w-md">
                              {error?.message ||
                                "An error occurred while loading the PDF."}
                            </p>
                          </div>
                          <Button
                            onClick={handleRetry}
                            variant="outline"
                            className="mt-4"
                            aria-label="Retry loading PDF"
                          >
                            <RefreshCw className="w-4 h-4 mr-2" />
                            Retry
                          </Button>
                        </div>
                      );
                    }}
                  />
                </Worker>
              )}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </motion.section>
  );
};
