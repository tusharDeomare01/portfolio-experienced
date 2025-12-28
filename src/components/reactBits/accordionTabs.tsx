import React, { useState, useCallback, useMemo } from 'react';

export interface AccordionTabItem {
  id: string | number;
  label: string;
  icon?: React.ReactNode;
  content: React.ReactNode;
  color?: string;
  badge?: string | number;
}

export interface AccordionTabsProps {
  items: AccordionTabItem[];
  defaultActiveId?: string | number;
  orientation?: 'horizontal' | 'vertical';
  className?: string;
  onTabChange?: (itemId: string | number) => void;
}

export const AccordionTabs: React.FC<AccordionTabsProps> = ({
  items,
  defaultActiveId,
  orientation = 'horizontal',
  className = '',
  onTabChange,
}) => {
  const [activeId, setActiveId] = useState<string | number>(
    defaultActiveId ?? items[0]?.id ?? ''
  );

  const handleTabClick = useCallback(
    (id: string | number) => {
      setActiveId(id);
      if (onTabChange) {
        onTabChange(id);
      }
    },
    [onTabChange]
  );

  const activeItem = useMemo(
    () => items.find((item) => item.id === activeId) ?? items[0],
    [items, activeId]
  );

  const colorMap: Record<string, { bg: string; text: string; border: string }> = {
    blue: { bg: 'bg-blue-500/10', text: 'text-blue-500', border: 'border-blue-500' },
    purple: { bg: 'bg-purple-500/10', text: 'text-purple-500', border: 'border-purple-500' },
    green: { bg: 'bg-green-500/10', text: 'text-green-500', border: 'border-green-500' },
    orange: { bg: 'bg-orange-500/10', text: 'text-orange-500', border: 'border-orange-500' },
    pink: { bg: 'bg-pink-500/10', text: 'text-pink-500', border: 'border-pink-500' },
    teal: { bg: 'bg-teal-500/10', text: 'text-teal-500', border: 'border-teal-500' },
    yellow: { bg: 'bg-yellow-500/10', text: 'text-yellow-500', border: 'border-yellow-500' },
    red: { bg: 'bg-red-500/10', text: 'text-red-500', border: 'border-red-500' },
  };

  const isHorizontal = orientation === 'horizontal';

  return (
    <div className={`relative ${className}`}>
      {/* Tabs Navigation */}
      <div
        className={`
          flex gap-2 mb-6 overflow-x-auto pb-2
          ${isHorizontal ? 'flex-row' : 'flex-col'}
          scrollbar-hide
        `}
        style={{
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
        }}
      >
        {items.map((item) => {
          const isActive = activeId === item.id;
          const colors = item.color ? colorMap[item.color] : { bg: 'bg-primary/10', text: 'text-primary', border: 'border-primary' };

          return (
            <button
              key={item.id}
              onClick={() => handleTabClick(item.id)}
              className={`
                relative flex items-center gap-2 px-4 py-3 rounded-lg
                font-medium text-sm transition-all duration-300 ease-out
                whitespace-nowrap
                ${isActive ? `${colors.bg} ${colors.text} border-2 ${colors.border} shadow-lg` : 'bg-transparent text-muted-foreground border-2 border-transparent hover:bg-background/50 hover:text-foreground'}
                hover:scale-105 active:scale-95
              `}
            >
              {item.icon && (
                <span className={isActive ? colors.text : 'text-muted-foreground transition-colors'}>
                  {item.icon}
                </span>
              )}
              <span>{item.label}</span>
              {item.badge && (
                <span
                  className={`
                    ml-auto px-2 py-0.5 rounded-full text-xs font-semibold transition-all
                    ${isActive ? 'bg-primary/20 text-primary scale-110' : 'bg-muted text-muted-foreground'}
                  `}
                >
                  {item.badge}
                </span>
              )}
              {/* Active Indicator */}
              {isActive && (
                <span
                  className={`absolute -bottom-0.5 left-1/2 -translate-x-1/2 w-1/2 h-0.5 ${colors.bg} rounded-full transition-all duration-300`}
                />
              )}
            </button>
          );
        })}
      </div>

      {/* Tab Content */}
      <div className="relative min-h-[400px]">
        <div
          key={activeId}
          className="w-full animate-fade-in"
          style={{
            animation: 'fadeIn 0.3s ease-out',
          }}
        >
          {activeItem?.content}
        </div>
      </div>

      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
};

export default AccordionTabs;
