import type { LucideIcon } from "lucide-react";
import {
  Home,
  User,
  GraduationCap,
  Briefcase,
  FolderKanban,
  Trophy,
  Mail,
  CreditCard,
  BarChart3,
  Code2,
  Sparkles,
} from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────

export type NodeType = "root" | "section" | "subpage";

export interface TreeNode {
  id: string;
  label: string;
  type: NodeType;
  icon: LucideIcon;
  color: string;
  href: string;
  isRoute: boolean;
  children: TreeNode[];
  description?: string;
  level: number;
}

export interface LayoutPosition {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface EdgeData {
  id: string;
  from: string;
  to: string;
  fromPoint: { x: number; y: number };
  toPoint: { x: number; y: number };
  color: string;
}

// ─── Node Color Map (Tailwind-friendly) ──────────────────────────────────────

export const NODE_COLORS: Record<string, { bg: string; border: string; text: string; glow: string }> = {
  primary: { bg: "bg-primary/10", border: "border-primary/40", text: "text-primary", glow: "shadow-primary/30" },
  violet:  { bg: "bg-violet-500/10", border: "border-violet-500/40", text: "text-violet-500", glow: "shadow-violet-500/30" },
  blue:    { bg: "bg-blue-500/10", border: "border-blue-500/40", text: "text-blue-500", glow: "shadow-blue-500/30" },
  emerald: { bg: "bg-emerald-500/10", border: "border-emerald-500/40", text: "text-emerald-500", glow: "shadow-emerald-500/30" },
  amber:   { bg: "bg-amber-500/10", border: "border-amber-500/40", text: "text-amber-500", glow: "shadow-amber-500/30" },
  rose:    { bg: "bg-rose-500/10", border: "border-rose-500/40", text: "text-rose-500", glow: "shadow-rose-500/30" },
  yellow:  { bg: "bg-yellow-500/10", border: "border-yellow-500/40", text: "text-yellow-500", glow: "shadow-yellow-500/30" },
  cyan:    { bg: "bg-cyan-500/10", border: "border-cyan-500/40", text: "text-cyan-500", glow: "shadow-cyan-500/30" },
  pink:    { bg: "bg-pink-500/10", border: "border-pink-500/40", text: "text-pink-500", glow: "shadow-pink-500/30" },
};

// ─── Section Definitions ─────────────────────────────────────────────────────

const SECTION_DEFS: Record<string, Omit<TreeNode, "children" | "level">> = {
  hero:         { id: "hero",         label: "Hero",         type: "section", icon: Sparkles,      color: "violet",  href: "#hero",         isRoute: false, description: "Landing section with name and CTA" },
  about:        { id: "about",        label: "About",        type: "section", icon: User,          color: "blue",    href: "#about",        isRoute: false, description: "Personal introduction" },
  education:    { id: "education",    label: "Education",    type: "section", icon: GraduationCap, color: "emerald", href: "#education",    isRoute: false, description: "Education background" },
  career:       { id: "career",       label: "Career",       type: "section", icon: Briefcase,     color: "amber",   href: "#career",       isRoute: false, description: "Professional timeline" },
  projects:     { id: "projects",     label: "Projects",     type: "section", icon: FolderKanban,  color: "rose",    href: "#projects",     isRoute: false, description: "Featured project showcase" },
  achievements: { id: "achievements", label: "Achievements", type: "section", icon: Trophy,        color: "yellow",  href: "#achievements", isRoute: false, description: "Awards and recognitions" },
  contact:      { id: "contact",      label: "Contact",      type: "section", icon: Mail,          color: "cyan",    href: "#contact",      isRoute: false, description: "Contact form" },
};

const SUB_PAGES: TreeNode[] = [
  { id: "marketjd",  label: "MarketJD",     type: "subpage", icon: BarChart3,   color: "rose", href: "/marketjd",  isRoute: true, children: [], level: 2, description: "SEO insights platform" },
  { id: "portfolio", label: "TechShowcase", type: "subpage", icon: Code2,       color: "rose", href: "/portfolio", isRoute: true, children: [], level: 2, description: "Portfolio website" },
];

const MY_CARD: TreeNode = {
  id: "lanyard", label: "My Card", type: "subpage", icon: CreditCard, color: "pink",
  href: "/lanyard", isRoute: true, children: [], level: 1,
  description: "Interactive 3D lanyard card",
};

// ─── Default Order ───────────────────────────────────────────────────────────

export const DEFAULT_SECTION_ORDER = [
  "hero", "about", "education", "career", "projects", "achievements", "contact",
];

// ─── Tree Builder ────────────────────────────────────────────────────────────

export function buildSiteTree(sectionOrder: string[] = DEFAULT_SECTION_ORDER): TreeNode {
  const orderedChildren: TreeNode[] = sectionOrder.map((id) => {
    const def = SECTION_DEFS[id];
    if (!def) return null;
    const children = id === "projects" ? [...SUB_PAGES] : [];
    return { ...def, children, level: 1 } as TreeNode;
  }).filter(Boolean) as TreeNode[];

  orderedChildren.push({ ...MY_CARD });

  return {
    id: "home",
    label: "Home",
    type: "root",
    icon: Home,
    color: "primary",
    href: "/",
    isRoute: true,
    children: orderedChildren,
    level: 0,
    description: "Portfolio root",
  };
}

// ─── Flatten tree for iteration ──────────────────────────────────────────────

export function flattenTree(tree: TreeNode): TreeNode[] {
  const nodes: TreeNode[] = [tree];
  for (const child of tree.children) {
    nodes.push(child);
    for (const grandchild of child.children) {
      nodes.push(grandchild);
    }
  }
  return nodes;
}
