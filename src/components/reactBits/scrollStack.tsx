import React, { useRef, useEffect, useState, useCallback } from "react";
import { motion } from "framer-motion";

export interface ScrollStackItem {
  id: string | number;
  content: React.ReactNode;
  title?: string;
}

export interface ScrollStackProps {
  items: ScrollStackItem[];
  gap?: number;
  stickyIndex?: number;
  className?: string;
  itemClassName?: string;
  onItemVisible?: (itemId: string | number) => void;
  enableParallax?: boolean;
  parallaxSpeed?: number;
}

export const ScrollStack: React.FC<ScrollStackProps> = ({
  items,
  gap = 24,
  stickyIndex = 0,
  className = "",
  itemClassName = "",
  onItemVisible,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [, setVisibleItems] = useState<Set<string | number>>(new Set());

  const handleIntersection = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && entry.target.getAttribute("data-item-id")) {
          const itemId = entry.target.getAttribute("data-item-id")!;
          setVisibleItems((prev) => {
            const next = new Set(prev);
            next.add(itemId);
            return next;
          });
          if (onItemVisible) {
            onItemVisible(itemId);
          }
        }
      });
    },
    [onItemVisible]
  );

  useEffect(() => {
    const observer = new IntersectionObserver(handleIntersection, {
      threshold: 0.1,
      rootMargin: "-50px",
    });

    const elements = containerRef.current?.querySelectorAll("[data-item-id]");
    elements?.forEach((el) => observer.observe(el));

    return () => {
      elements?.forEach((el) => observer.unobserve(el));
    };
  }, [handleIntersection, items]);

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      {items.map((item, index) => {
        const isSticky = index === stickyIndex;

        return (
          <motion.div
            key={item.id}
            data-item-id={item.id}
            className={`${
              isSticky ? "sticky top-0 z-10" : "relative"
            } ${itemClassName}`}
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{
              duration: 0.6,
              delay: index * 0.1,
              ease: [0.16, 1, 0.3, 1],
            }}
          >
            <div style={{ marginBottom: index < items.length - 1 ? gap : 0 }}>
              {item.content}
            </div>
          </motion.div>
        );
      })}
    </div>
  );
};

export default ScrollStack;
