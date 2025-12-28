import React, { useState, useCallback, useMemo, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Badge } from '../lightswind/badge';
import ClickSpark from '../reactBits/clickSpark';
import FluidSkillParticles from './FluidSkillParticles';
import { cn } from '../../lib/utils';
import { useIsMobile } from '../hooks/use-mobile';

interface Category {
  title: string;
  icon: React.ComponentType<{ className?: string }>;
  skills: string[];
  color: string;
}

interface FluidSkillDisplayProps {
  category: Category;
  isActive: boolean;
  onSkillHover?: (skill: string | null) => void;
}

const FluidSkillDisplay: React.FC<FluidSkillDisplayProps> = ({
  category,
  isActive,
  onSkillHover,
}) => {
  const isMobile = useIsMobile();
  const containerRef = useRef<HTMLDivElement>(null);
  const [mousePosition, setMousePosition] = useState<{ x: number; y: number } | null>(null);
  const [hoveredSkill, setHoveredSkill] = useState<string | null>(null);
  const [webglError, setWebglError] = useState<Error | null>(null);
  const [isWebglReady, setIsWebglReady] = useState(false);
  const [showFallback, setShowFallback] = useState(false);

  // Convert skills to particle format
  const skillParticles = useMemo(() => {
    return category.skills.map((skill, index) => ({
      id: `skill-${index}`,
      name: skill,
      color: getCategoryColor(category.color),
    }));
  }, [category.skills, category.color]);

  // Calculate attraction point (center of container)
  const attractionPoint = useMemo(() => {
    if (!isActive) return null;
    return {
      x: 0,
      y: 0,
      z: 0,
      strength: 1.0,
      color: hexToRgb(getCategoryColor(category.color)),
    };
  }, [isActive, category.color]);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (isMobile) return;
    setMousePosition({ x: e.clientX, y: e.clientY });
  }, [isMobile]);

  const handleMouseLeave = useCallback(() => {
    setMousePosition(null);
  }, []);

  const handleWebglError = useCallback((error: Error) => {
    setWebglError(error);
    setShowFallback(true);
    if (process.env.NODE_ENV === 'development') {
      console.warn('WebGL error in FluidSkillDisplay:', error);
    }
  }, []);

  const handleWebglReady = useCallback(() => {
    setIsWebglReady(true);
    setShowFallback(false);
  }, []);

  // Show fallback after timeout if WebGL not ready
  useEffect(() => {
    if (!isActive) return;
    
    const timeout = setTimeout(() => {
      if (!isWebglReady && !webglError) {
        setShowFallback(true);
      }
    }, 2000); // 2 second timeout

    return () => clearTimeout(timeout);
  }, [isActive, isWebglReady, webglError]);

  // Get category color
  function getCategoryColor(colorName: string): string {
    const colorMap: Record<string, string> = {
      blue: '#3b82f6',
      purple: '#a855f7',
      green: '#10b981',
      orange: '#f97316',
      teal: '#14b8a6',
      indigo: '#6366f1',
    };
    return colorMap[colorName] || colorMap.blue;
  }

  function hexToRgb(hex: string): [number, number, number] {
    hex = hex.replace(/^#/, '');
    if (hex.length === 3) {
      hex = hex.split('').map(c => c + c).join('');
    }
    const int = parseInt(hex, 16);
    return [
      ((int >> 16) & 255) / 255,
      ((int >> 8) & 255) / 255,
      (int & 255) / 255,
    ];
  }

  // Fallback UI - Static skill display
  const renderFallbackUI = () => {
    const skillCount = skillParticles.length;
    const angleStep = (Math.PI * 2) / skillCount;
    const radius = isMobile ? 100 : 150;

    return (
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="relative w-full h-full">
          {skillParticles.map((skill, index) => {
            const angle = index * angleStep;
            const x = Math.cos(angle) * radius;
            const y = Math.sin(angle) * radius;
            
            return (
              <motion.div
                key={skill.id}
                className="absolute pointer-events-auto"
                style={{
                  left: '50%',
                  top: '50%',
                }}
                initial={{ opacity: 0, scale: 0 }}
                animate={isActive ? {
                  opacity: 1,
                  scale: hoveredSkill === skill.id ? 1.15 : 1,
                  x: x,
                  y: y,
                } : {
                  opacity: 0,
                  scale: 0,
                  x: 0,
                  y: 0,
                }}
                transition={{
                  opacity: { duration: 0.4, delay: index * 0.05 },
                  scale: { duration: 0.2, type: "spring", stiffness: 400, damping: 25 },
                  x: { type: "spring", stiffness: 50, damping: 20, delay: index * 0.05 },
                  y: { type: "spring", stiffness: 50, damping: 20, delay: index * 0.05 },
                }}
                onMouseEnter={() => {
                  setHoveredSkill(skill.id);
                  onSkillHover?.(skill.name);
                }}
                onMouseLeave={() => {
                  setHoveredSkill(null);
                  onSkillHover?.(null);
                }}
              >
                <ClickSpark
                  sparkColor={getCategoryColor(category.color)}
                  sparkSize={6}
                  sparkRadius={15}
                  sparkCount={6}
                  duration={300}
                >
                  <Badge
                    variant="outline"
                    size="lg"
                    className={cn(
                      "text-xs md:text-sm font-medium cursor-pointer transition-all duration-300",
                      "hover:shadow-lg whitespace-nowrap",
                      hoveredSkill === skill.id && "ring-2 ring-offset-2"
                    )}
                    style={{
                      borderColor: getCategoryColor(category.color),
                      backgroundColor: hoveredSkill === skill.id
                        ? `${getCategoryColor(category.color)}20`
                        : "transparent",
                      color: getCategoryColor(category.color),
                      boxShadow: hoveredSkill === skill.id
                        ? `0 0 20px ${getCategoryColor(category.color)}40`
                        : "none",
                    }}
                  >
                    {skill.name}
                  </Badge>
                </ClickSpark>
              </motion.div>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div
      ref={containerRef}
      className={cn(
        "relative w-full flex items-center justify-center overflow-hidden",
        "bg-transparent",
        isMobile ? "h-[400px]" : "h-[600px]"
      )}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {/* WebGL Particle System */}
      <div className={cn(
        "absolute inset-0 transition-opacity duration-300",
        isActive && !showFallback && isWebglReady ? "opacity-100" : "opacity-0 pointer-events-none"
      )}>
        <FluidSkillParticles
          skills={skillParticles}
          attractionPoint={attractionPoint}
          mousePosition={isActive ? mousePosition : null}
          onError={handleWebglError}
          onReady={handleWebglReady}
        />
      </div>

      {/* Fallback UI - Shows when WebGL fails or during loading */}
      {(showFallback || webglError || !isWebglReady) && (
        <div className={cn(
          "absolute inset-0 transition-opacity duration-300",
          isActive ? "opacity-100" : "opacity-0"
        )}>
          {renderFallbackUI()}
        </div>
      )}

      {/* Category Icon - Center */}
      <motion.div
        className="absolute z-10 pointer-events-none"
        initial={{ scale: 0, opacity: 0 }}
        animate={isActive ? { scale: 1, opacity: 1 } : { scale: 0.8, opacity: 0.3 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      >
        <motion.div
          className={cn(
            "relative p-4 md:p-6 rounded-full",
            "bg-background/80 backdrop-blur-xl",
            "border-2 shadow-2xl",
            "flex items-center justify-center"
          )}
          style={{
            borderColor: getCategoryColor(category.color),
            boxShadow: `0 0 40px ${getCategoryColor(category.color)}40`,
          }}
          animate={isActive ? {
            scale: [1, 1.05, 1],
            boxShadow: [
              `0 0 40px ${getCategoryColor(category.color)}40`,
              `0 0 60px ${getCategoryColor(category.color)}60`,
              `0 0 40px ${getCategoryColor(category.color)}40`,
            ],
          } : {}}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          <div style={{ color: getCategoryColor(category.color) }}>
            <category.icon className={cn("w-8 h-8", !isMobile && "md:w-12 md:h-12")} />
          </div>
        </motion.div>
      </motion.div>

      {/* Skill Labels - Floating around particles (only when WebGL is active) */}
      {!showFallback && !webglError && isWebglReady && (
        <div className={cn(
          "absolute inset-0 z-20 pointer-events-none overflow-hidden",
          "transition-opacity duration-300",
          isActive ? "opacity-100" : "opacity-0"
        )}>
          <AnimatePresence>
            {skillParticles.map((skill, index) => {
              const angle = (index / skillParticles.length) * Math.PI * 2;
              const baseRadius = isMobile ? 100 : 150;
              const radiusVariation = Math.sin(index * 0.7) * 30;
              const radius = baseRadius + radiusVariation;
              const x = Math.cos(angle) * radius;
              const y = Math.sin(angle) * radius;
              
              return (
                <motion.div
                  key={skill.id}
                  className="absolute pointer-events-auto"
                  style={{
                    left: '50%',
                    top: '50%',
                  }}
                  initial={{ opacity: 0, scale: 0, x: 0, y: 0 }}
                  animate={isActive ? { 
                    opacity: 1, 
                    scale: hoveredSkill === skill.id ? 1.15 : 1,
                    x: x,
                    y: y,
                  } : {
                    opacity: 0,
                    scale: 0,
                    x: 0,
                    y: 0,
                  }}
                  exit={{ opacity: 0, scale: 0 }}
                  transition={{
                    opacity: { duration: 0.4, delay: index * 0.05 },
                    scale: { duration: 0.2, type: "spring", stiffness: 400, damping: 25 },
                    x: { 
                      type: "spring", 
                      stiffness: 50, 
                      damping: 20,
                      delay: index * 0.05,
                    },
                    y: { 
                      type: "spring", 
                      stiffness: 50, 
                      damping: 20,
                      delay: index * 0.05,
                    },
                  }}
                  onMouseEnter={() => {
                    setHoveredSkill(skill.id);
                    onSkillHover?.(skill.name);
                  }}
                  onMouseLeave={() => {
                    setHoveredSkill(null);
                    onSkillHover?.(null);
                  }}
                >
                  <ClickSpark
                    sparkColor={getCategoryColor(category.color)}
                    sparkSize={6}
                    sparkRadius={15}
                    sparkCount={6}
                    duration={300}
                  >
                    <Badge
                      variant="outline"
                      size="lg"
                      className={cn(
                        "text-xs md:text-sm font-medium cursor-pointer transition-all duration-300",
                        "hover:shadow-lg whitespace-nowrap",
                        hoveredSkill === skill.id && "ring-2 ring-offset-2"
                      )}
                      style={{
                        borderColor: getCategoryColor(category.color),
                        backgroundColor: hoveredSkill === skill.id
                          ? `${getCategoryColor(category.color)}20`
                          : "transparent",
                        color: getCategoryColor(category.color),
                        boxShadow: hoveredSkill === skill.id
                          ? `0 0 20px ${getCategoryColor(category.color)}40`
                          : "none",
                      }}
                    >
                      {skill.name}
                    </Badge>
                  </ClickSpark>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
};

export default FluidSkillDisplay;
