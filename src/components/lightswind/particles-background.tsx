import React, { useLayoutEffect, useEffect, useState, useRef, useCallback } from "react";

declare global {
  interface Window {
    particlesJS: any;
  }
}

// Page Visibility API hook for pausing animations when tab is not visible
const usePageVisibility = () => {
  const [isVisible, setIsVisible] = useState(() => {
    if (typeof document === "undefined") return true;
    return !document.hidden;
  });

  useEffect(() => {
    if (typeof document === "undefined") return;

    const handleVisibilityChange = () => {
      setIsVisible(!document.hidden);
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);

  return isVisible;
};

interface ParticlesBackgroundProps {
  colors?: string[];
  size?: number;
  countDesktop?: number;
  countTablet?: number;
  countMobile?: number;
  zIndex?: number;
  height?: string;
}

const ParticlesBackground: React.FC<ParticlesBackgroundProps> = ({
  colors = ["#ff223e", "#5d1eb2", "#ff7300"],
  size = 3,
  countDesktop = 60,
  countTablet = 50,
  countMobile = 40,
  zIndex = 0,
  height = "100vh",
}) => {
  const isPageVisible = usePageVisibility();
  const particlesInstanceRef = useRef<any>(null);

  // Initialize particles function - memoized with useCallback
  const initializeParticles = useCallback(() => {
    const particlesElement = document.getElementById("js-particles");
    if (particlesElement && window.particlesJS) {
      const getParticleCount = () => {
        const screenWidth = window.innerWidth;
        if (screenWidth > 1024) return countDesktop;
        if (screenWidth > 768) return countTablet;
        return countMobile;
      };

      const instance = window.particlesJS("js-particles", {
        particles: {
          number: {
            value: getParticleCount(),
          },
          color: {
            value: colors,
          },
          shape: {
            type: "circle",
          },
          opacity: {
            value: 1,
            random: false,
          },
          size: {
            value: size,
            random: true,
          },
          line_linked: {
            enable: false,
          },
          move: {
            enable: true,
            speed: 2,
            direction: "none",
            random: true,
            straight: false,
            out_mode: "out",
          },
        },
        interactivity: {
          detect_on: "canvas",
          events: {
            onhover: {
              enable: false,
            },
            onclick: {
              enable: false,
            },
            resize: true,
          },
        },
        retina_detect: true,
      });
      particlesInstanceRef.current = instance;
    }
  }, [colors, size, countDesktop, countTablet, countMobile]);

  // Load particles.js asynchronously with dynamic import
  useLayoutEffect(() => {
    // Check if particles.js is already loaded
    if (window.particlesJS) {
      initializeParticles();
      return;
    }

    // Load script asynchronously
    const script = document.createElement("script");
    script.src = "https://cdn.jsdelivr.net/particles.js/2.0.0/particles.min.js";
    script.async = true;
    script.defer = true;
    script.onload = () => {
      initializeParticles();
    };
    script.onerror = () => {
      if (import.meta.env.DEV) {
        console.warn("Failed to load particles.js");
      }
    };
    document.body.appendChild(script);

    return () => {
      // Cleanup: remove script if component unmounts before load
      if (script.parentNode) {
        document.body.removeChild(script);
      }
      // Pause particles when component unmounts
      if (particlesInstanceRef.current) {
        try {
          particlesInstanceRef.current.pauseAnimation();
        } catch (e) {
          // Ignore errors
        }
      }
    };
  }, [initializeParticles]);

  // Pause/resume particles based on page visibility
  useEffect(() => {
    if (!particlesInstanceRef.current) return;

    try {
      if (isPageVisible) {
        particlesInstanceRef.current.resumeAnimation?.();
      } else {
        particlesInstanceRef.current.pauseAnimation?.();
      }
    } catch (e) {
      // Ignore errors if methods don't exist
    }
  }, [isPageVisible]);

  return (
    <div
      id="js-particles"
      style={{
        width: "100%",
        height: height,
        position: "absolute",
        top: 0,
        left: 0,
        zIndex: zIndex,
        pointerEvents: "none",
      }}
    >
      <style>{`
        #js-particles canvas {
          position: absolute;
          width: 100%;
          height: 100%;
        }

        .particles-js-canvas-el {
          position: absolute;
        }

        .particles-js-canvas-el circle {
          fill: currentColor;
          filter: url(#glow);
        }
      `}</style>
      <svg xmlns="http://www.w3.org/2000/svg" version="1.1">
        <defs>
          <filter id="glow">
            <feGaussianBlur stdDeviation="3.5" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
      </svg>
    </div>
  );
};

export default ParticlesBackground;
