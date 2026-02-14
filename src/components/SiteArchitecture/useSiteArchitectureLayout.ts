import { useState, useEffect, useCallback, useRef } from "react";
import type { TreeNode, LayoutPosition, EdgeData } from "./siteArchitectureData";

// ─── Layout Config ───────────────────────────────────────────────────────────

interface LayoutConfig {
  nodeSize: { root: number; section: number; subpage: number };
  verticalGap: number;
  topPadding: number;
  minHorizontalSpacing: number;
}

const DESKTOP_CONFIG: LayoutConfig = {
  nodeSize: { root: 80, section: 64, subpage: 52 },
  verticalGap: 140,
  topPadding: 60,
  minHorizontalSpacing: 100,
};

const MOBILE_CONFIG: LayoutConfig = {
  nodeSize: { root: 64, section: 56, subpage: 48 },
  verticalGap: 16,
  topPadding: 24,
  minHorizontalSpacing: 0,
};

// ─── Desktop Layout ──────────────────────────────────────────────────────────

function computeDesktopLayout(
  tree: TreeNode,
  containerWidth: number,
  config: LayoutConfig
): { positions: Map<string, LayoutPosition>; edges: EdgeData[]; totalHeight: number } {
  const positions = new Map<string, LayoutPosition>();
  const edges: EdgeData[] = [];

  const rootSize = config.nodeSize.root;
  const rootX = containerWidth / 2;
  const rootY = config.topPadding + rootSize / 2;

  positions.set(tree.id, { x: rootX, y: rootY, width: rootSize, height: rootSize });

  // Level 1: distribute sections horizontally
  const level1Nodes = tree.children;
  const sectionSize = config.nodeSize.section;
  const level1Y = rootY + rootSize / 2 + config.verticalGap;

  // Calculate spacing — ensure nodes fit within container
  const totalNodesWidth = level1Nodes.length * sectionSize;
  const availableWidth = containerWidth - 80; // 40px padding each side
  const spacing = Math.max(
    config.minHorizontalSpacing,
    (availableWidth - totalNodesWidth) / (level1Nodes.length - 1 || 1)
  );
  const totalWidth = totalNodesWidth + spacing * (level1Nodes.length - 1);
  const startX = (containerWidth - totalWidth) / 2 + sectionSize / 2;

  level1Nodes.forEach((child, i) => {
    const size = child.type === "subpage" ? config.nodeSize.subpage : sectionSize;
    const childX = startX + i * (sectionSize + spacing);
    const childY = level1Y + size / 2;

    positions.set(child.id, { x: childX, y: childY, width: size, height: size });

    // Edge from root to child
    edges.push({
      id: `${tree.id}-${child.id}`,
      from: tree.id,
      to: child.id,
      fromPoint: { x: rootX, y: rootY + rootSize / 2 },
      toPoint: { x: childX, y: childY - size / 2 },
      color: child.color,
    });

    // Level 2: sub-pages below their parent
    if (child.children.length > 0) {
      const subSize = config.nodeSize.subpage;
      const level2Y = childY + size / 2 + config.verticalGap;
      const subSpacing = 140;
      const subTotalWidth = child.children.length * subSize + (child.children.length - 1) * subSpacing;
      const subStartX = childX - subTotalWidth / 2 + subSize / 2;

      child.children.forEach((sub, j) => {
        const subX = subStartX + j * (subSize + subSpacing);
        const subY = level2Y + subSize / 2;

        positions.set(sub.id, { x: subX, y: subY, width: subSize, height: subSize });

        edges.push({
          id: `${child.id}-${sub.id}`,
          from: child.id,
          to: sub.id,
          fromPoint: { x: childX, y: childY + size / 2 },
          toPoint: { x: subX, y: subY - subSize / 2 },
          color: sub.color,
        });
      });
    }
  });

  // Calculate total height
  let maxY = 0;
  positions.forEach((pos) => {
    const bottom = pos.y + pos.height / 2;
    if (bottom > maxY) maxY = bottom;
  });

  return { positions, edges, totalHeight: maxY + 60 };
}

// ─── Mobile Layout (vertical list) ──────────────────────────────────────────

function computeMobileLayout(
  tree: TreeNode,
  containerWidth: number,
  config: LayoutConfig
): { positions: Map<string, LayoutPosition>; edges: EdgeData[]; totalHeight: number } {
  const positions = new Map<string, LayoutPosition>();
  const edges: EdgeData[] = [];
  const levelIndent = 28;
  const padding = 16;
  let currentY = config.topPadding;

  function traverse(node: TreeNode, parentId: string | null) {
    const indent = node.level * levelIndent;
    const nodeHeight = config.nodeSize[node.type];
    const nodeWidth = containerWidth - indent - padding * 2;
    const x = indent + nodeWidth / 2 + padding;
    const y = currentY + nodeHeight / 2;

    positions.set(node.id, { x, y, width: nodeWidth, height: nodeHeight });

    if (parentId) {
      const parentPos = positions.get(parentId);
      if (parentPos) {
        edges.push({
          id: `${parentId}-${node.id}`,
          from: parentId,
          to: node.id,
          fromPoint: { x: parentPos.x - parentPos.width / 2 + 20, y: parentPos.y + parentPos.height / 2 },
          toPoint: { x: x - nodeWidth / 2 + 20, y: y - nodeHeight / 2 },
          color: node.color,
        });
      }
    }

    currentY += nodeHeight + config.verticalGap;

    for (const child of node.children) {
      traverse(child, node.id);
    }
  }

  traverse(tree, null);

  return { positions, edges, totalHeight: currentY + 40 };
}

// ─── Hook ────────────────────────────────────────────────────────────────────

export function useSiteArchitectureLayout(
  tree: TreeNode,
  containerRef: React.RefObject<HTMLDivElement | null>,
  isMobile: boolean
) {
  const [positions, setPositions] = useState<Map<string, LayoutPosition>>(new Map());
  const [edges, setEdges] = useState<EdgeData[]>([]);
  const [totalHeight, setTotalHeight] = useState(600);
  const [containerWidth, setContainerWidth] = useState(0);
  const observerRef = useRef<ResizeObserver | null>(null);

  const recalculate = useCallback(
    (width: number) => {
      if (width <= 0) return;
      const config = isMobile ? MOBILE_CONFIG : DESKTOP_CONFIG;
      const layout = isMobile
        ? computeMobileLayout(tree, width, config)
        : computeDesktopLayout(tree, width, config);

      setPositions(layout.positions);
      setEdges(layout.edges);
      setTotalHeight(layout.totalHeight);
    },
    [tree, isMobile]
  );

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const handleResize = (entries: ResizeObserverEntry[]) => {
      for (const entry of entries) {
        const width = entry.contentRect.width;
        setContainerWidth(width);
        recalculate(width);
      }
    };

    observerRef.current = new ResizeObserver(handleResize);
    observerRef.current.observe(el);

    // Initial calculation
    const width = el.getBoundingClientRect().width;
    setContainerWidth(width);
    recalculate(width);

    return () => {
      observerRef.current?.disconnect();
    };
  }, [containerRef, recalculate]);

  // Recalculate when tree changes (reorder)
  useEffect(() => {
    if (containerWidth > 0) {
      recalculate(containerWidth);
    }
  }, [tree, containerWidth, recalculate]);

  return { positions, edges, totalHeight };
}
