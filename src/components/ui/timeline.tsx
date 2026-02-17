import {
  useScroll,
  useTransform,
  motion,
  useInView,
} from "framer-motion";
import React, { useEffect, useRef, useState, useMemo } from "react";

interface TimelineEntry {
  title: string;
  content: React.ReactNode;
}

interface TimelineProps {
  data: TimelineEntry[];
  showHeader?: boolean;
  headerTitle?: string;
  headerSubtitle?: string;
}

interface TimelineItemProps {
  item: TimelineEntry;
  index: number;
}

// Static transition objects — hoisted to module scope (never re-allocated)
const ITEM_TRANSITION_BASE: [number, number, number, number] = [0.25, 0.46, 0.45, 0.94];
const HOVER_TRANSITION = { duration: 0.2 } as const;
const CARD_HOVER_TRANSITION = { duration: 0.2, ease: "easeOut" as const } as const;
const H3_HOVER = { scale: 1.02 } as const;
const CARD_HOVER = { y: -2 } as const;

// Hidden/visible states — hoisted
const ITEM_HIDDEN = { opacity: 0, y: 30 } as const;
const ITEM_VISIBLE = { opacity: 1, y: 0 } as const;

// CSS animation for dot pulse — replaces framer-motion infinite JS loop
// Each dot gets a CSS animation via animation-delay instead of 5 separate JS animation frames
const DOT_PULSE_STYLE = (index: number): React.CSSProperties => ({
  animationDelay: `${index * 150}ms`,
});

const TimelineItem = React.memo(({ item, index }: TimelineItemProps) => {
  const itemRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(itemRef, { once: true, margin: "-100px" });

  // Memoize transition with index-based delay (stable per item)
  const itemTransition = useMemo(
    () => ({ duration: 0.5, delay: index * 0.1, ease: ITEM_TRANSITION_BASE }),
    [index]
  );

  return (
    <motion.div
      ref={itemRef}
      initial={ITEM_HIDDEN}
      animate={isInView ? ITEM_VISIBLE : ITEM_HIDDEN}
      transition={itemTransition}
      className="flex justify-start pt-10 md:pt-32 md:gap-8 group"
    >
      <div className="sticky flex flex-col md:flex-row z-40 items-center top-32 self-start max-w-xs lg:max-w-sm md:w-full">
        <div className="h-12 w-12 absolute left-0 md:left-0 rounded-full bg-transparent flex items-center justify-center">
          {/* CSS-animated dot pulse — no JS animation loop, fully composited on GPU */}
          <div
            className="relative h-5 w-5 rounded-full bg-gradient-to-br from-primary via-blue-500 to-purple-500 border-2 border-white dark:border-neutral-900 shadow-lg shadow-primary/40 dark:shadow-primary/30 animate-timeline-dot-pulse"
            style={DOT_PULSE_STYLE(index)}
          >
            <div className="absolute inset-0 rounded-full bg-gradient-to-br from-white/30 to-transparent" />
          </div>
          {/* Subtle glow on hover only */}
          <div className="absolute inset-0 rounded-full bg-gradient-to-br from-primary/20 via-blue-500/20 to-purple-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-sm" />
        </div>
        {/* Date — no permanent willChange, framer handles it during hover */}
        <motion.h3
          className="hidden md:block text-base md:pl-24 md:text-3xl font-medium text-neutral-400 dark:text-neutral-500 group-hover:text-primary dark:group-hover:text-primary/90 transition-colors duration-300 tracking-tight"
          whileHover={H3_HOVER}
          transition={HOVER_TRANSITION}
        >
          {item.title}
        </motion.h3>
      </div>

      <div className="relative pl-16 pr-4 md:pl-4 w-full">
        {/* Mobile date */}
        <h3 className="md:hidden block text-lg mb-4 text-left font-medium text-neutral-500 dark:text-neutral-400">
          {item.title}
        </h3>
        {/* Card wrapper — no permanent willChange */}
        <motion.div
          className="relative"
          whileHover={CARD_HOVER}
          transition={CARD_HOVER_TRANSITION}
        >
          {/* Single-layer glassmorphism card — removed outer backdrop-blur-md layer
              (double backdrop-blur is extremely expensive on mobile GPU) */}
          <div className="relative bg-white/80 dark:bg-neutral-900/80 backdrop-blur-sm border border-neutral-200/60 dark:border-neutral-700/50 rounded-xl p-6 md:p-8 shadow-lg shadow-neutral-900/5 dark:shadow-black/20 group-hover:shadow-xl group-hover:shadow-primary/5 dark:group-hover:shadow-primary/10 transition-shadow duration-300 group-hover:border-primary/30 dark:group-hover:border-primary/40">
            {/* Subtle shine effect - only on hover */}
            <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            {item.content}
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
});

TimelineItem.displayName = "TimelineItem";

export const Timeline = React.memo(({
  data,
  showHeader = true,
  headerTitle = "Changelog from my journey",
  headerSubtitle = "I've been working on Aceternity for the past 2 years. Here's a timeline of my journey.",
}: TimelineProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState(0);

  // ResizeObserver — handles lazy-loaded content height changes correctly
  // (old approach: useEffect with [ref] only ran once at mount, getting wrong height)
  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const ro = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const h = entry.contentRect.height;
        setHeight(h);
      }
    });
    ro.observe(el);
    return () => { ro.disconnect(); };
  }, []);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start 10%", "end 50%"],
  });

  const heightTransform = useTransform(scrollYProgress, [0, 1], [0, height]);
  const opacityTransform = useTransform(scrollYProgress, [0, 0.1], [0, 1]);

  // Memoize height style to avoid object re-creation every render
  const lineContainerStyle = useMemo(
    () => ({ height: height + "px" }),
    [height]
  );

  // Memoize animated line style (stable — motion values are refs)
  const animatedLineStyle = useMemo(
    () => ({ height: heightTransform, opacity: opacityTransform }),
    [heightTransform, opacityTransform]
  );

  return (
    <div
      className="w-full bg-transparent font-sans md:px-10"
      ref={containerRef}
    >
      {showHeader && (
        <div className="max-w-7xl mx-auto py-20 px-4 md:px-8 lg:px-10">
          <h2 className="text-lg md:text-4xl mb-4 text-black dark:text-white max-w-4xl">
            {headerTitle}
          </h2>
          <p className="text-neutral-700 dark:text-neutral-300 text-sm md:text-base max-w-sm">
            {headerSubtitle}
          </p>
        </div>
      )}

      <div ref={ref} className="relative max-w-7xl mx-auto pb-20">
        {data.map((item, index) => (
          <TimelineItem key={index} item={item} index={index} />
        ))}
        <div
          style={lineContainerStyle}
          className="absolute md:left-6 left-6 top-0 overflow-hidden w-[2px] bg-neutral-200/50 dark:bg-neutral-700/50 rounded-full [mask-image:linear-gradient(to_bottom,transparent_0%,black_10%,black_90%,transparent_100%)]"
        >
          {/* Animated gradient line */}
          <motion.div
            style={animatedLineStyle}
            className="absolute inset-x-0 top-0 w-[2px] bg-gradient-to-t from-primary via-blue-500 to-purple-500 rounded-full will-change-[height,opacity]"
          />
        </div>
      </div>
    </div>
  );
});

Timeline.displayName = "Timeline";
