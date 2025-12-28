import React, { useState, useCallback, useMemo } from 'react';
import { lazy, Suspense } from 'react';

// Lazy load heavy components
const LightRays = lazy(() => import('./lightRays'));
const Particles = lazy(() => import('./reactBitsParticles'));

export interface InteractiveGridItem {
  id: string | number;
  title: string;
  description: string;
  icon?: React.ReactNode;
  color?: string;
  content?: React.ReactNode;
}

export interface InteractiveGridProps {
  items: InteractiveGridItem[];
  columns?: 1 | 2 | 3 | 4;
  enableHoverEffects?: boolean;
  enableParticles?: boolean;
  enableLightRays?: boolean;
  className?: string;
  itemClassName?: string;
  onItemClick?: (item: InteractiveGridItem) => void;
}

export const InteractiveGrid: React.FC<InteractiveGridProps> = ({
  items,
  columns = 2,
  enableHoverEffects = true,
  enableParticles = true,
  enableLightRays = true,
  className = '',
  itemClassName = '',
  onItemClick,
}) => {
  const [hoveredId, setHoveredId] = useState<string | number | null>(null);
  const [selectedId, setSelectedId] = useState<string | number | null>(null);

  const handleMouseEnter = useCallback((id: string | number) => {
    setHoveredId(id);
  }, []);

  const handleMouseLeave = useCallback(() => {
    setHoveredId(null);
  }, []);

  const handleClick = useCallback(
    (item: InteractiveGridItem) => {
      setSelectedId(item.id);
      if (onItemClick) {
        onItemClick(item);
      }
    },
    [onItemClick]
  );

  const gridCols = useMemo(() => {
    const colsMap = { 1: 'grid-cols-1', 2: 'grid-cols-1 md:grid-cols-2', 3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3', 4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4' };
    return colsMap[columns];
  }, [columns]);

  const colorMap: Record<string, { bg: string; text: string; border: string; glow: string }> = {
    blue: { bg: 'bg-blue-500/10', text: 'text-blue-500', border: 'border-blue-500/20', glow: 'shadow-blue-500/20' },
    purple: { bg: 'bg-purple-500/10', text: 'text-purple-500', border: 'border-purple-500/20', glow: 'shadow-purple-500/20' },
    green: { bg: 'bg-green-500/10', text: 'text-green-500', border: 'border-green-500/20', glow: 'shadow-green-500/20' },
    orange: { bg: 'bg-orange-500/10', text: 'text-orange-500', border: 'border-orange-500/20', glow: 'shadow-orange-500/20' },
    pink: { bg: 'bg-pink-500/10', text: 'text-pink-500', border: 'border-pink-500/20', glow: 'shadow-pink-500/20' },
    teal: { bg: 'bg-teal-500/10', text: 'text-teal-500', border: 'border-teal-500/20', glow: 'shadow-teal-500/20' },
    yellow: { bg: 'bg-yellow-500/10', text: 'text-yellow-500', border: 'border-yellow-500/20', glow: 'shadow-yellow-500/20' },
    red: { bg: 'bg-red-500/10', text: 'text-red-500', border: 'border-red-500/20', glow: 'shadow-red-500/20' },
    indigo: { bg: 'bg-indigo-500/10', text: 'text-indigo-500', border: 'border-indigo-500/20', glow: 'shadow-indigo-500/20' },
    cyan: { bg: 'bg-cyan-500/10', text: 'text-cyan-500', border: 'border-cyan-500/20', glow: 'shadow-cyan-500/20' },
    violet: { bg: 'bg-violet-500/10', text: 'text-violet-500', border: 'border-violet-500/20', glow: 'shadow-violet-500/20' },
    amber: { bg: 'bg-amber-500/10', text: 'text-amber-500', border: 'border-amber-500/20', glow: 'shadow-amber-500/20' },
  };

  return (
    <div className={`relative ${className}`}>
      <div className={`grid ${gridCols} gap-6`}>
        {items.map((item, index) => {
          const isHovered = hoveredId === item.id;
          const isSelected = selectedId === item.id;
          const colors = (item.color && colorMap[item.color]) 
            ? colorMap[item.color] 
            : { bg: 'bg-primary/10', text: 'text-primary', border: 'border-primary/20', glow: 'shadow-primary/20' };

          return (
            <div
              key={item.id}
              style={{
                animation: `fadeInUp 0.6s ease-out ${index * 0.1}s both`,
              }}
              onMouseEnter={() => enableHoverEffects && handleMouseEnter(item.id)}
              onMouseLeave={() => enableHoverEffects && handleMouseLeave()}
              onClick={() => handleClick(item)}
              className={`
                relative group cursor-pointer
                ${itemClassName}
              `}
            >
              {/* Background Effects */}
              {enableHoverEffects && isHovered && (
                <>
                  {enableLightRays && (
                    <Suspense fallback={null}>
                      <div className="absolute inset-0 -z-10 opacity-20 pointer-events-none overflow-hidden rounded-2xl transition-opacity duration-500">
                        <LightRays
                          raysOrigin="top-center"
                          raysColor="#07eae6"
                          raysSpeed={1.5}
                          lightSpread={8}
                          rayLength={0.6}
                          followMouse={true}
                          mouseInfluence={0.15}
                          className="w-full h-full"
                        />
                      </div>
                    </Suspense>
                  )}
                  {enableParticles && (
                    <Suspense fallback={null}>
                      <div className="absolute inset-0 -z-10 opacity-30 pointer-events-none rounded-2xl overflow-hidden transition-opacity duration-500">
                        <Particles
                          particleCount={30}
                          particleSpread={6}
                          speed={0.1}
                          particleColors={['#07eae6', '#ffffff']}
                          moveParticlesOnHover={true}
                          alphaParticles={true}
                          particleBaseSize={60}
                          className="w-full h-full"
                        />
                      </div>
                    </Suspense>
                  )}
                </>
              )}

              {/* Card */}
              <div
                className={`
                  relative h-full p-6 rounded-2xl
                  bg-background/80 backdrop-blur-xl
                  border-2 transition-all duration-500 ease-out
                  ${isHovered ? `${colors.border} shadow-2xl ${colors.glow} scale-[1.02] -translate-y-1` : 'border-border/50 shadow-lg'}
                  ${isSelected ? 'ring-2 ring-primary ring-offset-2' : ''}
                  hover:border-primary/50
                `}
              >
                {/* Gradient Overlay on Hover */}
                {isHovered && (
                  <div
                    className={`absolute inset-0 bg-gradient-to-br ${colors.bg} opacity-50 rounded-2xl pointer-events-none transition-opacity duration-500`}
                  />
                )}

                {/* Content */}
                <div className="relative z-10">
                  {/* Icon */}
                  {item.icon && (
                    <div
                      className={`
                        inline-flex p-3 rounded-xl mb-4 transition-all duration-300
                        ${colors.bg}
                        ${isHovered ? 'scale-110 rotate-3' : ''}
                      `}
                    >
                      <div className={colors.text}>{item.icon}</div>
                    </div>
                  )}

                  {/* Title */}
                  <h3
                    className={`
                      text-xl font-bold mb-2 transition-colors duration-300
                      ${isHovered ? colors.text : 'text-foreground'}
                    `}
                  >
                    {item.title}
                  </h3>

                  {/* Description */}
                  <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                    {item.description}
                  </p>

                  {/* Custom Content */}
                  {item.content && (
                    <div className="mt-4">{item.content}</div>
                  )}

                  {/* Hover Indicator Bar */}
                  <div
                    className={`absolute bottom-0 left-0 right-0 h-1 ${colors.bg} rounded-b-2xl transition-all duration-300`}
                    style={{
                      transform: isHovered ? 'scaleX(1)' : 'scaleX(0)',
                      transformOrigin: 'left',
                    }}
                  />

                  {/* Corner Accent */}
                  {isHovered && (
                    <div
                      className={`absolute top-0 right-0 w-24 h-24 ${colors.bg} rounded-full blur-3xl opacity-50 transition-opacity duration-500`}
                    />
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <style>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
};

export default InteractiveGrid;
