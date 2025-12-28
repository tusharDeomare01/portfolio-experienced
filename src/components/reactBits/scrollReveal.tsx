import React, { useRef, useEffect, useState, useMemo } from 'react';

export interface ScrollRevealProps {
  children: React.ReactNode;
  /** Custom container className */
  containerClassName?: string;
  /** Animation type */
  animation?: 'fadeUp' | 'fadeIn' | 'slideLeft' | 'slideRight' | 'scale' | 'rotate';
  /** Animation delay in seconds */
  delay?: number;
  /** Animation duration in seconds */
  duration?: number;
  /** Viewport threshold (0-1) */
  threshold?: number;
  /** Text size variant */
  size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  /** Text alignment */
  align?: 'left' | 'center' | 'right';
  /** Color variant */
  variant?: 'default' | 'muted' | 'accent' | 'primary';
  /** Enable stagger effect for text */
  stagger?: boolean;
}

const sizeClasses = {
  sm: 'text-lg md:text-xl',
  md: 'text-xl md:text-2xl lg:text-3xl',
  lg: 'text-2xl md:text-3xl lg:text-4xl xl:text-5xl',
  xl: 'text-3xl md:text-4xl lg:text-5xl xl:text-6xl',
  '2xl': 'text-4xl md:text-5xl lg:text-6xl xl:text-7xl',
};

const alignClasses = {
  left: 'text-left',
  center: 'text-center',
  right: 'text-right',
};

const variantClasses = {
  default: 'text-foreground',
  muted: 'text-muted-foreground',
  accent: 'text-accent-foreground',
  primary: 'text-primary',
};

const animationClasses = {
  fadeUp: 'animate-fade-up',
  fadeIn: 'animate-fade-in',
  slideLeft: 'animate-slide-left',
  slideRight: 'animate-slide-right',
  scale: 'animate-scale-in',
  rotate: 'animate-rotate-in',
};

export const ScrollReveal: React.FC<ScrollRevealProps> = ({
  children,
  containerClassName = '',
  animation = 'fadeUp',
  delay = 0,
  duration = 0.6,
  threshold = 0.1,
  size = 'lg',
  align = 'left',
  variant = 'default',
  stagger = false,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [hasAnimated, setHasAnimated] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !hasAnimated) {
            setIsVisible(true);
            setHasAnimated(true);
          }
        });
      },
      {
        threshold,
        rootMargin: '-50px',
      }
    );

    const currentRef = containerRef.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, [threshold, hasAnimated]);

  const textContent = useMemo(() => {
    if (typeof children === 'string') {
      return children;
    }
    return null;
  }, [children]);

  const animationStyle = useMemo(
    () => ({
      animationDelay: `${delay}s`,
      animationDuration: `${duration}s`,
      animationFillMode: 'both' as const,
    }),
    [delay, duration]
  );

  const baseClasses = useMemo(
    () =>
      `${sizeClasses[size]} ${alignClasses[align]} ${variantClasses[variant]} ${containerClassName}`,
    [size, align, variant, containerClassName]
  );

  if (stagger && textContent) {
    const words = textContent.split(/(\s+)/);
    return (
      <div ref={containerRef} className={baseClasses}>
        <span className="inline-block">
          {words.map((word, index) => (
            <span
              key={index}
              className={`inline-block ${isVisible ? animationClasses[animation] : 'opacity-0'}`}
              style={{
                ...animationStyle,
                animationDelay: `${delay + index * 0.05}s`,
              }}
            >
              {word}
            </span>
          ))}
        </span>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className={`${baseClasses} ${isVisible ? animationClasses[animation] : 'opacity-0'}`}
      style={animationStyle}
    >
      {children}
      <style>{`
        @keyframes fade-up {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes fade-in {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        @keyframes slide-left {
          from {
            opacity: 0;
            transform: translateX(-30px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        @keyframes slide-right {
          from {
            opacity: 0;
            transform: translateX(30px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        @keyframes scale-in {
          from {
            opacity: 0;
            transform: scale(0.9);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        @keyframes rotate-in {
          from {
            opacity: 0;
            transform: rotate(-5deg) scale(0.95);
          }
          to {
            opacity: 1;
            transform: rotate(0deg) scale(1);
          }
        }
        .animate-fade-up {
          animation-name: fade-up;
          animation-timing-function: cubic-bezier(0.16, 1, 0.3, 1);
        }
        .animate-fade-in {
          animation-name: fade-in;
          animation-timing-function: ease-out;
        }
        .animate-slide-left {
          animation-name: slide-left;
          animation-timing-function: cubic-bezier(0.16, 1, 0.3, 1);
        }
        .animate-slide-right {
          animation-name: slide-right;
          animation-timing-function: cubic-bezier(0.16, 1, 0.3, 1);
        }
        .animate-scale-in {
          animation-name: scale-in;
          animation-timing-function: cubic-bezier(0.16, 1, 0.3, 1);
        }
        .animate-rotate-in {
          animation-name: rotate-in;
          animation-timing-function: cubic-bezier(0.16, 1, 0.3, 1);
        }
      `}</style>
    </div>
  );
};

export default ScrollReveal;

