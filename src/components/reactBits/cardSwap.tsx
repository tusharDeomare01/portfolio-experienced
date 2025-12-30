import React, { useState, useCallback, useMemo } from "react";

export interface CardSwapItem {
  id: string | number;
  title: string;
  content: React.ReactNode;
  icon?: React.ReactNode;
  color?: string;
}

export interface CardSwapProps {
  items: CardSwapItem[];
  defaultIndex?: number;
  autoRotate?: boolean;
  rotationInterval?: number;
  className?: string;
  cardClassName?: string;
  onCardChange?: (itemId: string | number) => void;
  enableHover?: boolean;
  transitionDuration?: number;
}

export const CardSwap: React.FC<CardSwapProps> = ({
  items,
  defaultIndex = 0,
  autoRotate = false,
  rotationInterval = 5000,
  className = "",
  cardClassName = "",
  onCardChange,
  enableHover = true,
}) => {
  const [activeIndex, setActiveIndex] = useState(defaultIndex);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const activeItem = useMemo(() => items[activeIndex], [items, activeIndex]);

  const handleCardClick = useCallback(
    (index: number) => {
      setActiveIndex(index);
      if (onCardChange) {
        onCardChange(items[index].id);
      }
    },
    [items, onCardChange]
  );

  React.useEffect(() => {
    if (!autoRotate) return;

    const interval = setInterval(() => {
      setActiveIndex((prev) => {
        const next = (prev + 1) % items.length;
        if (onCardChange) {
          onCardChange(items[next].id);
        }
        return next;
      });
    }, rotationInterval);

    return () => clearInterval(interval);
  }, [autoRotate, rotationInterval, items, onCardChange]);

  return (
    <div className={`relative ${className}`}>
      {/* Active Card Display */}
      <div className="relative mb-8 min-h-[400px] bg-transparent">
        <div
          key={activeItem.id}
          className={`w-full h-full bg-transparent ${cardClassName}`}
        >
          {activeItem.content}
        </div>
      </div>

      {/* Card Selector Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {items.map((item, index) => {
          const isActive = index === activeIndex;
          const isHovered = hoveredIndex === index;

          return (
            <button
              key={item.id}
              onClick={() => handleCardClick(index)}
              onMouseEnter={() => enableHover && setHoveredIndex(index)}
              onMouseLeave={() => enableHover && setHoveredIndex(null)}
              className={`
                relative p-4 rounded-xl border-2 transition-all duration-300
                ${
                  isActive
                    ? "border-primary shadow-lg shadow-primary/20"
                    : "border-border/50"
                }
                ${isHovered && !isActive ? "border-primary/50 shadow-md" : ""}
                bg-background/80 backdrop-blur-xl
                hover:bg-background/90
                cursor-pointer
                text-left
                overflow-hidden
                group
              `}
            >
              {/* Active indicator */}
              {isActive && (
                <div className="absolute top-0 left-0 right-0 h-1 bg-primary" />
              )}

              {/* Icon */}
              {item.icon && (
                <div
                  className={`
                    mb-3 transition-colors duration-300
                    ${isActive ? "text-primary" : "text-muted-foreground"}
                  `}
                >
                  {item.icon}
                </div>
              )}

              {/* Title */}
              <h3
                className={`
                  font-semibold text-sm transition-colors duration-300
                  ${isActive ? "text-foreground" : "text-muted-foreground"}
                `}
              >
                {item.title}
              </h3>

              {/* Hover gradient */}
              <div
                className={`
                  absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent
                  opacity-0 group-hover:opacity-100 transition-opacity duration-300
                  pointer-events-none
                `}
              />
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default CardSwap;
