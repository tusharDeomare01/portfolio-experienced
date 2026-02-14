import { memo, useMemo } from "react";
import type { EdgeData } from "./siteArchitectureData";

// ─── Color mapping for SVG strokes ──────────────────────────────────────────

const STROKE_COLORS: Record<string, string> = {
  primary: "hsl(var(--primary))",
  violet: "#8b5cf6",
  blue: "#3b82f6",
  emerald: "#10b981",
  amber: "#f59e0b",
  rose: "#f43f5e",
  yellow: "#eab308",
  cyan: "#06b6d4",
  pink: "#ec4899",
};

interface SiteArchitectureEdgeProps {
  edge: EdgeData;
  isMobile: boolean;
}

const SiteArchitectureEdge = memo(({ edge, isMobile }: SiteArchitectureEdgeProps) => {
  const stroke = STROKE_COLORS[edge.color] || STROKE_COLORS.primary;

  const pathD = useMemo(() => {
    const { fromPoint, toPoint } = edge;

    if (isMobile) {
      // Vertical step connector for mobile
      const midY = (fromPoint.y + toPoint.y) / 2;
      return `M ${fromPoint.x} ${fromPoint.y} L ${fromPoint.x} ${midY} L ${toPoint.x} ${midY} L ${toPoint.x} ${toPoint.y}`;
    }

    // Desktop: smooth cubic bezier
    const dx = toPoint.x - fromPoint.x;
    const dy = toPoint.y - fromPoint.y;
    const controlOffsetY = Math.min(Math.abs(dy) * 0.5, 80);

    // If mostly vertical (parent directly above child), use vertical bezier
    if (Math.abs(dx) < 10) {
      return `M ${fromPoint.x} ${fromPoint.y} C ${fromPoint.x} ${fromPoint.y + controlOffsetY}, ${toPoint.x} ${toPoint.y - controlOffsetY}, ${toPoint.x} ${toPoint.y}`;
    }

    // Otherwise, S-curve
    return `M ${fromPoint.x} ${fromPoint.y} C ${fromPoint.x} ${fromPoint.y + controlOffsetY}, ${toPoint.x} ${toPoint.y - controlOffsetY}, ${toPoint.x} ${toPoint.y}`;
  }, [edge, isMobile]);

  return (
    <path
      className="arch-edge"
      data-edge-id={edge.id}
      d={pathD}
      fill="none"
      stroke={stroke}
      strokeWidth={isMobile ? 1.5 : 2}
      strokeOpacity={0.4}
      strokeLinecap="round"
    />
  );
});

SiteArchitectureEdge.displayName = "SiteArchitectureEdge";
export { SiteArchitectureEdge };
