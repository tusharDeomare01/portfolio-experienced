import { memo, useCallback, useMemo } from "react";
import { ExternalLink } from "lucide-react";
import type { TreeNode, LayoutPosition } from "./siteArchitectureData";
import { NODE_COLORS } from "./siteArchitectureData";
import { cn } from "@/lib/utils";

interface SiteArchitectureNodeProps {
  node: TreeNode;
  position: LayoutPosition;
  isMobile: boolean;
  onNavigate: (node: TreeNode) => void;
}

const SiteArchitectureNode = memo(
  ({
    node,
    position,
    isMobile,
    onNavigate,
  }: SiteArchitectureNodeProps) => {
    const Icon = node.icon;
    const colors = NODE_COLORS[node.color] || NODE_COLORS.primary;

    const handleClick = useCallback(() => {
      onNavigate(node);
    }, [onNavigate, node]);

    const style = useMemo(
      () => ({
        position: "absolute" as const,
        left: position.x - position.width / 2,
        top: position.y - position.height / 2,
        width: position.width,
        height: position.height,
      }),
      [position]
    );

    // ─── Root Node ───────────────────────────────────────────────────
    if (node.type === "root") {
      return (
        <button
          data-node-id={node.id}
          data-node-type={node.type}
          className={cn(
            "arch-node arch-node-root",
            "rounded-full border-2 backdrop-blur-xl cursor-pointer",
            "flex items-center justify-center",
            "bg-primary/15 border-primary/50",
            "hover:border-primary hover:shadow-lg hover:shadow-primary/20",
            "transition-colors duration-200",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
          )}
          style={style}
          onClick={handleClick}
          title={node.description}
          aria-label={`Navigate to ${node.label}`}
        >
          {/* Glow ring */}
          <div className="absolute inset-0 rounded-full border border-primary/20 arch-glow-ring" />
          <Icon size={isMobile ? 24 : 32} className="text-primary" />
        </button>
      );
    }

    // ─── Mobile: Full-width row layout ───────────────────────────────
    if (isMobile) {
      return (
        <button
          data-node-id={node.id}
          data-node-type={node.type}
          className={cn(
            "arch-node",
            "absolute flex items-center gap-3 rounded-xl border backdrop-blur-xl cursor-pointer",
            "bg-background/80",
            colors.border,
            "hover:shadow-md",
            "transition-colors duration-200",
            node.type === "subpage" && "opacity-90",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          )}
          style={style}
          onClick={handleClick}
          aria-label={`Navigate to ${node.label}`}
        >
          {/* Icon circle */}
          <div
            className={cn(
              "flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center ml-2",
              colors.bg
            )}
          >
            <Icon size={18} className={colors.text} />
          </div>

          {/* Label + description */}
          <div className="flex-1 text-left min-w-0 py-2">
            <div className="flex items-center gap-1.5">
              <span className="text-sm font-semibold text-foreground truncate">{node.label}</span>
              {node.isRoute && node.type === "subpage" && (
                <ExternalLink size={12} className="text-muted-foreground flex-shrink-0" />
              )}
            </div>
            {node.description && (
              <p className="text-xs text-muted-foreground truncate">{node.description}</p>
            )}
          </div>
        </button>
      );
    }

    // ─── Desktop: Circular/Square icon node ──────────────────────────
    const isSubpage = node.type === "subpage";

    return (
      <div
        data-node-id={node.id}
        data-node-type={node.type}
        className="arch-node absolute flex flex-col items-center"
        style={{
          left: position.x - position.width / 2,
          top: position.y - position.height / 2,
          width: position.width,
        }}
      >
        {/* Node circle */}
        <button
          className={cn(
            "rounded-xl border-2 backdrop-blur-xl cursor-pointer",
            "flex items-center justify-center",
            colors.bg,
            colors.border,
            "hover:shadow-lg",
            `hover:${colors.glow}`,
            "transition-all duration-200",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2",
            isSubpage ? "w-11 h-11" : "w-14 h-14"
          )}
          onClick={handleClick}
          title={node.description}
          aria-label={`Navigate to ${node.label}`}
        >
          <Icon size={isSubpage ? 18 : 22} className={colors.text} />
          {isSubpage && (
            <ExternalLink size={10} className="absolute -top-1 -right-1 text-muted-foreground bg-background rounded-full p-0.5" />
          )}
        </button>

        {/* Label below */}
        <span
          className={cn(
            "arch-node-label mt-2 text-center font-medium leading-tight whitespace-nowrap",
            isSubpage ? "text-[10px] text-muted-foreground" : "text-xs text-foreground"
          )}
        >
          {node.label}
        </span>
      </div>
    );
  }
);

SiteArchitectureNode.displayName = "SiteArchitectureNode";
export { SiteArchitectureNode };
