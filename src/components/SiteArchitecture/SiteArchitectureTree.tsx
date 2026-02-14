import { useRef, useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useIsMobile } from "@/components/hooks/use-mobile";
import { gsap, useGSAP } from "@/lib/gsap";
import {
  buildSiteTree,
  flattenTree,
  DEFAULT_SECTION_ORDER,
} from "./siteArchitectureData";
import type { TreeNode } from "./siteArchitectureData";
import { useSiteArchitectureLayout } from "./useSiteArchitectureLayout";
import { SiteArchitectureNode } from "./SiteArchitectureNode";
import { SiteArchitectureEdge } from "./SiteArchitectureEdge";

// ─── Legend Component ────────────────────────────────────────────────────────

function ArchitectureLegend() {
  return (
    <div className="arch-legend flex flex-wrap items-center justify-center gap-3 text-xs text-muted-foreground">
      <div className="flex items-center gap-1.5">
        <span className="w-3 h-3 rounded-full bg-primary/30 border border-primary/50" />
        <span>Root</span>
      </div>
      <div className="flex items-center gap-1.5">
        <span className="w-3 h-3 rounded-lg bg-blue-500/20 border border-blue-500/40" />
        <span>Section</span>
      </div>
      <div className="flex items-center gap-1.5">
        <span className="w-3 h-3 rounded-lg bg-rose-500/20 border border-rose-500/40" />
        <span>Sub-page</span>
      </div>
    </div>
  );
}

// ─── Main Tree Component ─────────────────────────────────────────────────────

export function SiteArchitectureTree() {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const containerRef = useRef<HTMLDivElement>(null);
  const treeAreaRef = useRef<HTMLDivElement>(null);

  const tree = useMemo(() => buildSiteTree(DEFAULT_SECTION_ORDER), []);
  const allNodes = useMemo(() => flattenTree(tree), [tree]);

  const { positions, edges, totalHeight } = useSiteArchitectureLayout(
    tree,
    treeAreaRef,
    isMobile
  );

  // ─── Navigation handler ────────────────────────────────────────────
  const handleNavigate = useCallback(
    (node: TreeNode) => {
      if (node.isRoute) {
        navigate(node.href);
      } else {
        // Navigate home with scroll target
        const sectionId = node.href.replace("#", "");
        navigate("/", { state: { scrollTo: sectionId } });
      }
    },
    [navigate]
  );

  // ─── GSAP Entrance Animations ──────────────────────────────────────
  useGSAP(
    () => {
      if (!containerRef.current || positions.size === 0) return;

      const mm = gsap.matchMedia();

      // ═══ DESKTOP ENTRANCE ══════════════════════════════════════════
      mm.add(
        "(min-width: 768px) and (prefers-reduced-motion: no-preference)",
        () => {
          const container = containerRef.current!;
          const tl = gsap.timeline({ delay: 0.2 });

          // Root node: explosive entrance
          const rootNode = container.querySelector<HTMLElement>('[data-node-type="root"]');
          if (rootNode) {
            gsap.set(rootNode, { scale: 0, opacity: 0, rotation: -180 });
            tl.to(rootNode, {
              scale: 1,
              opacity: 1,
              rotation: 0,
              duration: 1,
              ease: "elastic.out(1, 0.5)",
            }, 0);

            // Root glow pulse (infinite)
            const glowRing = rootNode.querySelector<HTMLElement>(".arch-glow-ring");
            if (glowRing) {
              tl.fromTo(
                glowRing,
                { opacity: 0, scale: 0.8 },
                { opacity: 1, scale: 1.15, duration: 0.6, ease: "power2.out" },
                0.3
              );
              // Idle pulse
              gsap.to(glowRing, {
                scale: 1.25,
                opacity: 0.5,
                repeat: -1,
                yoyo: true,
                duration: 2,
                ease: "sine.inOut",
                delay: 1.5,
              });
            }
          }

          // Section nodes: cascade from root
          const sectionNodes = container.querySelectorAll<HTMLElement>('[data-node-type="section"]');
          gsap.set(sectionNodes, {
            scale: 0,
            opacity: 0,
            y: -30,
          });
          tl.to(sectionNodes, {
            scale: 1,
            opacity: 1,
            y: 0,
            duration: 0.6,
            stagger: 0.07,
            ease: "back.out(1.4)",
          }, 0.5);

          // Edges: draw in
          const edgePaths = container.querySelectorAll<SVGPathElement>(".arch-edge");
          edgePaths.forEach((path) => {
            const length = path.getTotalLength();
            gsap.set(path, {
              strokeDasharray: length,
              strokeDashoffset: length,
            });
          });
          tl.to(edgePaths, {
            strokeDashoffset: 0,
            duration: 0.6,
            stagger: 0.06,
            ease: "smooth.out",
          }, 0.6);

          // Subpage nodes: pop in after edges
          const subpageNodes = container.querySelectorAll<HTMLElement>('[data-node-type="subpage"]');
          if (subpageNodes.length) {
            gsap.set(subpageNodes, { scale: 0, opacity: 0 });
            tl.to(subpageNodes, {
              scale: 1,
              opacity: 1,
              duration: 0.5,
              stagger: 0.08,
              ease: "elastic.out(1, 0.4)",
            }, 1.2);
          }

          // Legend: slide up
          const legend = container.querySelector<HTMLElement>(".arch-legend");
          if (legend) {
            gsap.set(legend, { y: 20, opacity: 0 });
            tl.to(legend, { y: 0, opacity: 1, duration: 0.5, ease: "power3.out" }, 1.6);
          }

          // ─── Node hover effects ────────────────────────────────────
          const allInteractiveNodes = container.querySelectorAll<HTMLElement>(".arch-node button");
          allInteractiveNodes.forEach((node) => {
            const handleEnter = () => {
              gsap.to(node, {
                scale: 1.08,
                y: -3,
                duration: 0.3,
                ease: "power2.out",
              });
            };
            const handleLeave = () => {
              gsap.to(node, {
                scale: 1,
                y: 0,
                duration: 0.5,
                ease: "elastic.out(1, 0.4)",
              });
            };
            node.addEventListener("mouseenter", handleEnter);
            node.addEventListener("mouseleave", handleLeave);
          });
        }
      );

      // ═══ MOBILE ENTRANCE ═══════════════════════════════════════════
      mm.add(
        "(max-width: 767px) and (prefers-reduced-motion: no-preference)",
        () => {
          const container = containerRef.current!;
          const mobileNodes = container.querySelectorAll<HTMLElement>(".arch-node");
          const edgePaths = container.querySelectorAll<SVGPathElement>(".arch-edge");

          // Nodes: stagger slide from left + blur clear
          gsap.set(mobileNodes, { opacity: 0, x: -30, filter: "blur(4px)" });
          gsap.to(mobileNodes, {
            opacity: 1,
            x: 0,
            filter: "blur(0px)",
            duration: 0.5,
            stagger: 0.06,
            ease: "smooth.out",
            delay: 0.3,
            onComplete: () => {
              gsap.set(mobileNodes, { clearProps: "filter,transform" });
            },
          });

          // Edges: draw
          edgePaths.forEach((path) => {
            const length = path.getTotalLength();
            gsap.set(path, { strokeDasharray: length, strokeDashoffset: length });
          });
          gsap.to(edgePaths, {
            strokeDashoffset: 0,
            duration: 0.4,
            stagger: 0.04,
            ease: "smooth.out",
            delay: 0.5,
          });

          // Legend
          const legend = container.querySelector<HTMLElement>(".arch-legend");
          if (legend) {
            gsap.set(legend, { opacity: 0 });
            gsap.to(legend, { opacity: 1, duration: 0.4, delay: 1 });
          }
        }
      );

      // ═══ REDUCED MOTION ════════════════════════════════════════════
      mm.add("(prefers-reduced-motion: reduce)", () => {
        const container = containerRef.current!;
        const allEls = container.querySelectorAll<HTMLElement>(
          ".arch-node, .arch-legend"
        );
        allEls.forEach((el) => {
          gsap.set(el, { opacity: 1, clearProps: "transform,filter" });
        });
        const edgePaths = container.querySelectorAll<SVGPathElement>(".arch-edge");
        edgePaths.forEach((path) => {
          gsap.set(path, { clearProps: "strokeDasharray,strokeDashoffset" });
        });
      });
    },
    { scope: containerRef, dependencies: [positions.size] }
  );

  // ─── Render ────────────────────────────────────────────────────────
  return (
    <div ref={containerRef} className="w-full">
      {/* Tree visualization area */}
      <div
        ref={treeAreaRef}
        className="relative w-full overflow-visible"
        style={{ height: totalHeight || 600 }}
      >
        {/* SVG layer for edges */}
        <svg
          className="absolute inset-0 w-full h-full pointer-events-none"
          style={{ height: totalHeight }}
        >
          {edges.map((edge) => (
            <SiteArchitectureEdge key={edge.id} edge={edge} isMobile={isMobile} />
          ))}
        </svg>

        {/* HTML layer for nodes */}
        {allNodes.map((node) => {
          const pos = positions.get(node.id);
          if (!pos) return null;

          return (
            <SiteArchitectureNode
              key={node.id}
              node={node}
              position={pos}
              isMobile={isMobile}
              onNavigate={handleNavigate}
            />
          );
        })}
      </div>

      {/* Legend */}
      <div className="mt-8">
        <ArchitectureLegend />
      </div>
    </div>
  );
}
