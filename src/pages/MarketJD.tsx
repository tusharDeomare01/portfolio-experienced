import { useEffect, useMemo, lazy, Suspense, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAppSelector } from "@/store/hooks";
import { gsap, SplitText, useGSAP } from "@/lib/gsap";
import { useGSAPRouteAnimation } from "@/hooks/useGSAPRouteAnimation";
import { useGSAPScrollRestoration } from "@/hooks/useGSAPScrollRestoration";
import {
  ArrowLeft,
  Zap,
  Globe,
  BarChart3,
  Settings,
  Mail,
  Key,
  Webhook,
  Brain,
  FileText,
  TrendingUp,
  Activity,
  MessageSquare,
  // Calendar,
  Cpu,
  ExternalLink,
} from "lucide-react";
import { Badge } from "@/components/lightswind/badge";
import { ShareButton } from "@/components/Share";
import { getCurrentUrl } from "@/lib/shareUtils";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/lightswind/card";
import { LogoLoop, type LogoItem } from "@/components/reactBits/logoLoop";
import {
  InteractiveGrid,
  type InteractiveGridItem,
} from "@/components/reactBits/interactiveGrid";
import {
  AccordionTabs,
  type AccordionTabItem,
} from "@/components/reactBits/accordionTabs";

// Lazy load react-bits components for better performance
const LightRays = lazy(() => import("@/components/reactBits/lightRays"));

// Lazy load heavy components
const Shield = lazy(() =>
  import("lucide-react").then((mod) => ({ default: mod.Shield }))
);

const MarketJD = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useAppSelector((state) => state.theme.theme);
  const isDarkMode = theme === "dark";
  const { saveScrollPosition } = useGSAPScrollRestoration();

  // GSAP refs
  const pageRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const techStackRef = useRef<HTMLDivElement>(null);
  const integrationsRef = useRef<HTMLDivElement>(null);
  const featuresRef = useRef<HTMLDivElement>(null);
  const summaryRef = useRef<HTMLDivElement>(null);

  // Technology logos with real CDN URLs, documentation links, and tooltips
  const techLogos: LogoItem[] = useMemo(
    () => [
      {
        src: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nextjs/nextjs-original.svg",
        alt: "Next.js",
        title: "Next.js 14.2.10 - Click to visit documentation",
        href: "https://nextjs.org/docs",
      },
      {
        src: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg",
        alt: "TypeScript",
        title: "TypeScript 5.1.6 - Click to visit documentation",
        href: "https://www.typescriptlang.org/docs",
      },
      {
        src: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg",
        alt: "React",
        title: "React 18.3.1 - Click to visit documentation",
        href: "https://react.dev",
      },
      {
        src: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/prisma/prisma-original.svg",
        alt: "Prisma",
        title: "Prisma 6.11.1 - Click to visit documentation",
        href: "https://www.prisma.io/docs",
      },
      {
        src: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/redux/redux-original.svg",
        alt: "Redux Toolkit",
        title: "Redux Toolkit + Persist - Click to visit documentation",
        href: "https://redux-toolkit.js.org",
      },
      {
        src: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/tailwindcss/tailwindcss-original.svg",
        alt: "Tailwind CSS",
        title: "Tailwind CSS 3.3.2 - Click to visit documentation",
        href: "https://tailwindcss.com/docs",
      },
      {
        src: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mysql/mysql-original.svg",
        alt: "MySQL",
        title: "MySQL Database - Click to visit documentation",
        href: "https://dev.mysql.com/doc",
      },
      {
        src: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/chartjs/chartjs-original.svg",
        alt: "Chart.js",
        title: "Chart.js 4.3.3 - Click to visit documentation",
        href: "https://www.chartjs.org/docs",
      },
      {
        src: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg",
        alt: "Node.js",
        title: "Node.js Runtime - Click to visit documentation",
        href: "https://nodejs.org/docs",
      },
      {
        src: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/npm/npm-original-wordmark.svg",
        alt: "npm",
        title: "npm Package Manager - Click to visit documentation",
        href: "https://docs.npmjs.com",
      },
    ],
    []
  );

  // Detailed integrations with descriptions
  const integrations = [
    {
      category: "Analytics & SEO",
      items: [
        {
          name: "Google Analytics Data API",
          description: "Real-time analytics data integration",
        },
        {
          name: "Google Search Console",
          description: "Search performance and indexing data",
        },
        {
          name: "Semrush API",
          description: "SEO insights and keyword research",
        },
        {
          name: "DataForSEO API",
          description: "Comprehensive SEO data aggregation",
        },
        {
          name: "Serp API",
          description: "Search engine results page monitoring",
        },
        {
          name: "Google PageSpeed API",
          description: "Performance metrics and optimization insights",
        },
      ],
      icon: TrendingUp,
      color: "blue",
    },
    {
      category: "Advertising & Marketing",
      items: [
        {
          name: "Google Ads API",
          description: "Campaign management and performance tracking",
        },
        {
          name: "Google Local Service Ads",
          description: "Local advertising campaign integration",
        },
        {
          name: "Facebook Ads API",
          description: "Social media advertising data",
        },
      ],
      icon: Activity,
      color: "purple",
    },
    {
      category: "Communication & CRM",
      items: [
        { name: "CallRail", description: "Call tracking and analytics" },
        { name: "Apexchat", description: "Live chat integration" },
        {
          name: "Salesforce x Litify API",
          description: "CRM and case management integration",
        },
        { name: "MyCase API", description: "Legal practice management system" },
        { name: "HubSpot API", description: "Marketing automation and CRM" },
      ],
      icon: MessageSquare,
      color: "green",
    },
    {
      category: "Data & Automation",
      items: [
        {
          name: "OpenAI",
          description: "AI-powered data evaluation and insights",
        },
        {
          name: "APIFY Crawler",
          description: "Web scraping and data extraction",
        },
        {
          name: "Juvoleads Webhook",
          description: "Lead generation webhook integration",
        },
        {
          name: "Geo Grid API",
          description: "Geographic data and mapping services",
        },
        { name: "Google Maps", description: "Location services and mapping" },
        {
          name: "Brand.dev API",
          description: "Brand monitoring and reputation management",
        },
      ],
      icon: Brain,
      color: "orange",
    },
  ];

  const features = [
    {
      title: "Production Record Sharing",
      description:
        "Secure email-based sharing system for production records with granular access control. Implemented role-based permissions ensuring users only see records they're authorized to view. Features include encrypted email delivery, audit trails, and expiration controls.",
      icon: Mail,
      color: "blue",
    },
    {
      title: "Advanced Authentication System",
      description:
        "Comprehensive auth solution using Next-Auth with OAuth2.0, JWT tokens, and session management. Includes role-based access control (RBAC), dynamic permissions, and view-level security. Supports multiple providers and custom authentication flows.",
      icon: Shield,
      color: "green",
    },
    {
      title: "Drag & Drop Dashboard Builder",
      description:
        "Interactive drag-and-drop interface built with @dnd-kit for custom report generation. Users can create personalized dashboards by arranging widgets, charts, and data visualizations. Supports real-time updates and persistent layouts.",
      icon: Settings,
      color: "purple",
    },
    {
      title: "Unified Analytics Dashboard",
      description:
        "Comprehensive dashboard aggregating data from 10+ third-party APIs without performance degradation. Features real-time data synchronization, caching strategies, and optimized rendering using React Window for large datasets.",
      icon: BarChart3,
      color: "orange",
    },
    {
      title: "AI-Powered Data Evaluation",
      description:
        "Intelligent automation using OpenAI for data analysis, pattern recognition, and insight generation. Processes large volumes of data to provide actionable recommendations and automated reporting.",
      icon: Brain,
      color: "pink",
    },
    {
      title: "Dynamic Visibility System",
      description:
        "Multi-dimensional visibility feature displaying SEO, Directory, Local, AI, and Social metrics for any domain. Real-time data aggregation from multiple sources with customizable views and export capabilities.",
      icon: Globe,
      color: "teal",
    },
    {
      title: "Advanced Reporting Engine",
      description:
        "Multiple report types with sharing functionality, PDF/Excel export, and scheduled delivery. Built with ExcelJS and html2pdf.js for professional document generation. Supports custom templates and branding.",
      icon: FileText,
      color: "yellow",
    },
    {
      title: "Granular Permission System",
      description:
        "Dynamic role-based access control with field-level permissions. Supports custom roles, permission inheritance, and fine-grained access management. Integrated with Next-Auth for secure authorization.",
      icon: Key,
      color: "red",
    },
  ];

  // const cronJobs = [
  //   {
  //     name: "Calls Cron",
  //     description: "Automated call tracking and analytics processing",
  //   },
  //   {
  //     name: "Contact Forms Cron",
  //     description: "Form submission processing and lead management",
  //   },
  //   {
  //     name: "Chats Cron",
  //     description: "Chat conversation data synchronization",
  //   },
  //   {
  //     name: "Off-Page SEO Cron",
  //     description: "Backlink monitoring and off-page SEO metrics",
  //   },
  //   {
  //     name: "Technical SEO Cron",
  //     description: "Technical SEO audits and monitoring",
  //   },
  //   {
  //     name: "Search Console Cron",
  //     description: "Search performance data aggregation",
  //   },
  //   { name: "MyCase Cron", description: "Legal case data synchronization" },
  //   {
  //     name: "Facebook Leads Cron",
  //     description: "Social media lead processing",
  //   },
  // ];

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // ─────────────────────────────────────────────────────────────────────────────
  // GSAP PAGE ENTRANCE ANIMATIONS — ENHANCED CINEMATIC VERSION
  // ─────────────────────────────────────────────────────────────────────────────
  useGSAP(
    () => {
      const page = pageRef.current;
      if (!page) return;

      const mm = gsap.matchMedia();

      // ═══════════════════════════════════════════════════════════════════════
      // DESKTOP — Premium cinematic page entrance with dramatic effects
      // ═══════════════════════════════════════════════════════════════════════
      mm.add(
        "(min-width: 768px) and (prefers-reduced-motion: no-preference)",
        () => {
          const tl = gsap.timeline({
            defaults: { ease: "power3.out" },
          });

          // ─── PHASE 1: Hero section entrance — Multi-layer reveal ───
          const heroSection = heroRef.current;
          if (heroSection) {
            const logo = heroSection.querySelector(".hero-logo");
            const subtitle = heroSection.querySelector(".hero-subtitle");
            const badges = heroSection.querySelectorAll(".hero-badge");
            const description = heroSection.querySelector(".hero-description");

            // Logo: 3D flip with glow pulse
            if (logo) {
              gsap.set(logo, {
                opacity: 0,
                scale: 0.3,
                rotateY: -180,
                rotateZ: -15,
                transformPerspective: 1200,
                filter: "brightness(2)",
              });
              tl.to(
                logo,
                {
                  opacity: 1,
                  scale: 1,
                  rotateY: 0,
                  rotateZ: 0,
                  filter: "brightness(1)",
                  duration: 1.2,
                  ease: "elastic.out(1, 0.5)",
                },
                0
              );
            }

            // Title: SplitText chars with 3D wave
            if (titleRef.current) {
              const titleSplit = new SplitText(titleRef.current, {
                type: "chars",
                mask: "chars",
              });
              gsap.set(titleSplit.chars, {
                opacity: 0,
                y: 120,
                rotateX: -90,
                rotateY: gsap.utils.wrap([-20, 20, -15, 15, -10, 10]),
                scale: 0.5,
                transformPerspective: 1200,
                transformOrigin: "center bottom",
              });
              tl.to(
                titleSplit.chars,
                {
                  opacity: 1,
                  y: 0,
                  rotateX: 0,
                  rotateY: 0,
                  scale: 1,
                  duration: 1,
                  stagger: { each: 0.04, from: "start", ease: "power2.out" },
                  ease: "back.out(1.7)",
                },
                0.15
              );
            }

            // Subtitle: Slide from right with blur
            if (subtitle) {
              gsap.set(subtitle, {
                opacity: 0,
                x: 80,
                filter: "blur(10px)",
              });
              tl.to(
                subtitle,
                {
                  opacity: 1,
                  x: 0,
                  filter: "blur(0px)",
                  duration: 0.8,
                  ease: "power3.out",
                },
                0.5
              );
            }

            // Badges: Elastic cascade from different directions
            if (badges.length > 0) {
              badges.forEach((badge, i) => {
                const directions = [
                  { x: -40, y: 30, rotate: -15 },
                  { x: 0, y: 50, rotate: 0 },
                  { x: 40, y: 30, rotate: 15 },
                ];
                const dir = directions[i % directions.length];
                gsap.set(badge, {
                  opacity: 0,
                  scale: 0,
                  x: dir.x,
                  y: dir.y,
                  rotation: dir.rotate,
                });
              });
              tl.to(
                badges,
                {
                  opacity: 1,
                  scale: 1,
                  x: 0,
                  y: 0,
                  rotation: 0,
                  duration: 0.8,
                  stagger: 0.12,
                  ease: "elastic.out(1, 0.4)",
                },
                0.7
              );
            }

            // Description: Word-by-word reveal with SplitText
            if (description) {
              const descSplit = new SplitText(description, {
                type: "words",
                wordsClass: "gsap-word",
              });
              gsap.set(descSplit.words, {
                opacity: 0,
                y: 25,
                filter: "blur(4px)",
              });
              tl.to(
                descSplit.words,
                {
                  opacity: 1,
                  y: 0,
                  filter: "blur(0px)",
                  duration: 0.5,
                  stagger: 0.02,
                  ease: "power2.out",
                },
                1.0
              );
            }
          }

          // ─── PHASE 2: Tech Stack — Icon spring + content lift ───
          if (techStackRef.current) {
            const techIcon =
              techStackRef.current.querySelector(".section-icon");
            const techTitle =
              techStackRef.current.querySelector(".section-title");
            const techSubtitle =
              techStackRef.current.querySelector(".section-subtitle");
            const techContent =
              techStackRef.current.querySelector(".section-content");

            // Icon: Spring bounce
            if (techIcon) {
              gsap.set(techIcon, { scale: 0, rotation: -180 });
              gsap.to(techIcon, {
                scale: 1,
                rotation: 0,
                duration: 1,
                ease: "elastic.out(1, 0.4)",
                scrollTrigger: {
                  trigger: techStackRef.current,
                  start: "top 80%",
                  toggleActions: "play reverse play reverse",
                },
              });
            }

            // Title: Slide from left
            if (techTitle) {
              gsap.set(techTitle, { opacity: 0, x: -60, filter: "blur(8px)" });
              gsap.to(techTitle, {
                opacity: 1,
                x: 0,
                filter: "blur(0px)",
                duration: 0.8,
                ease: "power3.out",
                scrollTrigger: {
                  trigger: techStackRef.current,
                  start: "top 78%",
                  toggleActions: "play reverse play reverse",
                },
              });
            }

            // Subtitle: Fade up
            if (techSubtitle) {
              gsap.set(techSubtitle, { opacity: 0, y: 20 });
              gsap.to(techSubtitle, {
                opacity: 1,
                y: 0,
                duration: 0.6,
                ease: "power2.out",
                scrollTrigger: {
                  trigger: techStackRef.current,
                  start: "top 76%",
                  toggleActions: "play reverse play reverse",
                },
              });
            }

            // Content: 3D perspective lift
            if (techContent) {
              gsap.set(techContent, {
                opacity: 0,
                y: 80,
                scale: 0.9,
                rotateX: 20,
                transformPerspective: 1200,
                transformOrigin: "center top",
              });
              gsap.to(techContent, {
                opacity: 1,
                y: 0,
                scale: 1,
                rotateX: 0,
                duration: 1.2,
                ease: "power3.out",
                scrollTrigger: {
                  trigger: techStackRef.current,
                  start: "top 70%",
                  toggleActions: "play reverse play reverse",
                },
              });
            }
          }

          // ─── PHASE 3: Integrations — Dramatic card reveal ───
          if (integrationsRef.current) {
            const intIcon =
              integrationsRef.current.querySelector(".section-icon");
            const intTitle =
              integrationsRef.current.querySelector(".section-title");
            const intSubtitle =
              integrationsRef.current.querySelector(".section-subtitle");
            const intContent =
              integrationsRef.current.querySelector(".section-content");

            if (intIcon) {
              gsap.set(intIcon, { scale: 0, rotation: -180 });
              gsap.to(intIcon, {
                scale: 1,
                rotation: 0,
                duration: 1,
                ease: "elastic.out(1, 0.4)",
                scrollTrigger: {
                  trigger: integrationsRef.current,
                  start: "top 80%",
                  toggleActions: "play reverse play reverse",
                },
              });
            }

            if (intTitle) {
              gsap.set(intTitle, { opacity: 0, x: -60, filter: "blur(8px)" });
              gsap.to(intTitle, {
                opacity: 1,
                x: 0,
                filter: "blur(0px)",
                duration: 0.8,
                ease: "power3.out",
                scrollTrigger: {
                  trigger: integrationsRef.current,
                  start: "top 78%",
                  toggleActions: "play reverse play reverse",
                },
              });
            }

            if (intSubtitle) {
              gsap.set(intSubtitle, { opacity: 0, y: 20 });
              gsap.to(intSubtitle, {
                opacity: 1,
                y: 0,
                duration: 0.6,
                ease: "power2.out",
                scrollTrigger: {
                  trigger: integrationsRef.current,
                  start: "top 76%",
                  toggleActions: "play reverse play reverse",
                },
              });
            }

            if (intContent) {
              gsap.set(intContent, {
                opacity: 0,
                y: 100,
                scale: 0.85,
                rotateX: 25,
                transformPerspective: 1400,
                transformOrigin: "center top",
              });
              gsap.to(intContent, {
                opacity: 1,
                y: 0,
                scale: 1,
                rotateX: 0,
                duration: 1.4,
                ease: "power3.out",
                scrollTrigger: {
                  trigger: integrationsRef.current,
                  start: "top 70%",
                  toggleActions: "play reverse play reverse",
                },
              });
            }
          }

          // ─── PHASE 4: Features — Grid reveal with stagger ───
          if (featuresRef.current) {
            const featIcon = featuresRef.current.querySelector(".section-icon");
            const featTitle =
              featuresRef.current.querySelector(".section-title");
            const featSubtitle =
              featuresRef.current.querySelector(".section-subtitle");
            const featContent =
              featuresRef.current.querySelector(".section-content");

            if (featIcon) {
              gsap.set(featIcon, { scale: 0, rotation: -180 });
              gsap.to(featIcon, {
                scale: 1,
                rotation: 0,
                duration: 1,
                ease: "elastic.out(1, 0.4)",
                scrollTrigger: {
                  trigger: featuresRef.current,
                  start: "top 80%",
                  toggleActions: "play reverse play reverse",
                },
              });
            }

            if (featTitle) {
              gsap.set(featTitle, { opacity: 0, x: -60, filter: "blur(8px)" });
              gsap.to(featTitle, {
                opacity: 1,
                x: 0,
                filter: "blur(0px)",
                duration: 0.8,
                ease: "power3.out",
                scrollTrigger: {
                  trigger: featuresRef.current,
                  start: "top 78%",
                  toggleActions: "play reverse play reverse",
                },
              });
            }

            if (featSubtitle) {
              gsap.set(featSubtitle, { opacity: 0, y: 20 });
              gsap.to(featSubtitle, {
                opacity: 1,
                y: 0,
                duration: 0.6,
                ease: "power2.out",
                scrollTrigger: {
                  trigger: featuresRef.current,
                  start: "top 76%",
                  toggleActions: "play reverse play reverse",
                },
              });
            }

            if (featContent) {
              gsap.set(featContent, {
                opacity: 0,
                y: 120,
                scale: 0.8,
                rotateX: 30,
                transformPerspective: 1500,
                transformOrigin: "center top",
              });
              gsap.to(featContent, {
                opacity: 1,
                y: 0,
                scale: 1,
                rotateX: 0,
                duration: 1.5,
                ease: "power3.out",
                scrollTrigger: {
                  trigger: featuresRef.current,
                  start: "top 70%",
                  toggleActions: "play reverse play reverse",
                },
              });
            }
          }

          // ─── PHASE 5: Summary — Cinematic card entrance ───
          if (summaryRef.current) {
            gsap.set(summaryRef.current, {
              opacity: 0,
              y: 100,
              scale: 0.85,
              rotateX: 20,
              transformPerspective: 1400,
              transformOrigin: "center top",
              boxShadow: "0 0 0 rgba(0,0,0,0)",
            });
            gsap.to(summaryRef.current, {
              opacity: 1,
              y: 0,
              scale: 1,
              rotateX: 0,
              boxShadow: "0 25px 50px -12px rgba(0,0,0,0.15)",
              duration: 1.4,
              ease: "power3.out",
              scrollTrigger: {
                trigger: summaryRef.current,
                start: "top 80%",
                toggleActions: "play reverse play reverse",
              },
            });

            // Summary cards stagger
            const summaryCards =
              summaryRef.current.querySelectorAll(".summary-card");
            if (summaryCards.length > 0) {
              gsap.set(summaryCards, {
                opacity: 0,
                y: 50,
                scale: 0.9,
              });
              gsap.to(summaryCards, {
                opacity: 1,
                y: 0,
                scale: 1,
                duration: 0.8,
                stagger: 0.15,
                ease: "back.out(1.4)",
                scrollTrigger: {
                  trigger: summaryRef.current,
                  start: "top 70%",
                  toggleActions: "play reverse play reverse",
                },
              });
            }
          }
        }
      );

      // ═══════════════════════════════════════════════════════════════════════
      // MOBILE — Simplified but still engaging animations
      // ═══════════════════════════════════════════════════════════════════════
      mm.add("(max-width: 767px)", () => {
        // Hero instant timeline
        const mobileTl = gsap.timeline();

        if (heroRef.current) {
          const logo = heroRef.current.querySelector(".hero-logo");
          const badges = heroRef.current.querySelectorAll(".hero-badge");

          if (logo) {
            gsap.set(logo, { opacity: 0, scale: 0.8, y: -20 });
            mobileTl.to(logo, { opacity: 1, scale: 1, y: 0, duration: 0.5 }, 0);
          }

          if (titleRef.current) {
            gsap.set(titleRef.current, { opacity: 0, y: 30 });
            mobileTl.to(
              titleRef.current,
              { opacity: 1, y: 0, duration: 0.5 },
              0.1
            );
          }

          if (badges.length > 0) {
            gsap.set(badges, { opacity: 0, scale: 0.8 });
            mobileTl.to(
              badges,
              { opacity: 1, scale: 1, duration: 0.4, stagger: 0.1 },
              0.3
            );
          }
        }

        // Scroll-triggered sections
        const sections = [
          techStackRef.current,
          integrationsRef.current,
          featuresRef.current,
          summaryRef.current,
        ].filter(Boolean);
        sections.forEach((section) => {
          if (section) {
            gsap.set(section, { opacity: 0, y: 50 });
            gsap.to(section, {
              opacity: 1,
              y: 0,
              duration: 0.7,
              ease: "power2.out",
              scrollTrigger: {
                trigger: section,
                start: "top 85%",
                toggleActions: "play reverse play reverse",
              },
            });
          }
        });
      });

      // ═══════════════════════════════════════════════════════════════════════
      // REDUCED MOTION — Instant visibility
      // ═══════════════════════════════════════════════════════════════════════
      mm.add("(prefers-reduced-motion: reduce)", () => {
        const allSections = [
          heroRef.current,
          techStackRef.current,
          integrationsRef.current,
          featuresRef.current,
          summaryRef.current,
        ].filter(Boolean);
        allSections.forEach((section) => {
          if (section) {
            gsap.set(section, { opacity: 1, clearProps: "all" });
          }
        });
      });
    },
    { scope: pageRef }
  );

  // ─────────────────────────────────────────────────────────────────────────────
  // ROUTE TRANSITION ANIMATIONS
  // ─────────────────────────────────────────────────────────────────────────────
  useGSAPRouteAnimation({
    containerRef: pageRef,
    transitionType: "home-to-project",
    enabled: location.state?.from !== undefined,
  });

  // Prepare InteractiveGrid items for features
  const interactiveGridItems: InteractiveGridItem[] = useMemo(
    () =>
      features.map((feature) => {
        const Icon = feature.icon;
        return {
          id: feature.title,
          title: feature.title,
          description: feature.description,
          icon: <Icon className="w-6 h-6" />,
          color: feature.color,
        };
      }),
    [features]
  );

  // Prepare AccordionTabs items for integrations
  const accordionTabItems: AccordionTabItem[] = useMemo(
    () =>
      integrations.map((integration) => {
        const Icon = integration.icon;
        return {
          id: integration.category,
          label: integration.category,
          icon: <Icon className="w-4 h-4" />,
          color: integration.color,
          badge: integration.items.length,
          content: (
            <div className="space-y-3">
              {integration.items.map((item, itemIdx) => (
                <div
                  key={itemIdx}
                  style={{
                    animation: `slideInLeft 0.4s ease-out ${
                      itemIdx * 0.05
                    }s both`,
                  }}
                  className="p-4 rounded-xl bg-background/50 backdrop-blur-sm border border-border/50 hover:border-primary/50 hover:bg-background/80 transition-all duration-300 group"
                >
                  <h4 className="font-semibold text-sm text-foreground mb-2 group-hover:text-primary transition-colors">
                    {item.name}
                  </h4>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {item.description}
                  </p>
                </div>
              ))}
            </div>
          ),
        };
      }),
    [integrations]
  );

  return (
    <div
      ref={pageRef}
      className="min-h-screen bg-transparent relative route-enter-content"
    >
      <style>{`
        @keyframes slideInLeft {
          from {
            opacity: 0;
            transform: translateX(-20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        .animate-fade-in-up {
          animation: fadeInUp 0.6s ease-out both;
        }
      `}</style>

      <div className="relative z-10 max-w-7xl mx-auto px-4 py-8 md:py-12">
        {/* Back Button and Share */}
        <div className="mb-8 flex items-center justify-between flex-wrap gap-3 sm:gap-4 route-enter-child">
          <button
            onClick={(e) => {
              e.preventDefault();
              const splitUrl = window.location.href.split("#");
              if (splitUrl?.includes("home")) {
                const scrollY = saveScrollPosition();
                navigate("/", {
                  state: {
                    scrollTo: "projects",
                    scrollY,
                    from: "home-to-project",
                  },
                });
              } else {
                navigate(-1);
              }
            }}
            className="cursor-pointer flex items-center gap-2 text-foreground hover:text-primary transition-colors group touch-manipulation"
          >
            <ArrowLeft
              size={20}
              className="group-hover:-translate-x-1 transition-transform"
            />
            <span className="text-sm sm:text-base">Back</span>
          </button>
          <div className="flex items-center gap-3">
            <a
              href="https://insightsjd.com/auth/signin/client"
              target="_blank"
              rel="noopener noreferrer"
              className="group/live inline-flex items-center gap-2 px-3 py-1.5 text-xs font-bold rounded-full bg-emerald-500/90 text-white hover:bg-emerald-600 hover:shadow-lg hover:shadow-emerald-500/25 hover:scale-105 transition-all duration-300 cursor-pointer backdrop-blur-md"
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
              </span>
              Production
              <ExternalLink className="w-3 h-3 opacity-70 group-hover/live:opacity-100 group-hover/live:translate-x-0.5 transition-all duration-200" />
            </a>
            <ShareButton
              shareData={{
                title: "MarketJD - SEO Insights Platform",
                description:
                  "Comprehensive SEO insights and analytics platform with 10+ third-party API integrations, advanced authentication, dynamic reporting, and AI-powered automation.",
                url: getCurrentUrl(),
              }}
              variant="outline"
              size="md"
              showLabel={true}
              position="bottom"
              className="shrink-0 cursor-pointer"
            />
          </div>
        </div>

        {/* Hero Header */}
        <div ref={heroRef} className="mb-16 route-enter-child">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-6 mb-6">
            <div className="p-4 rounded-2xl bg-transparent flex items-center justify-center min-w-[120px] h-[120px] hero-logo">
              <img
                src={
                  isDarkMode
                    ? "/logo-horizontal-dark.svg"
                    : "/logo-horizontal-light.svg"
                }
                alt="MarketJD Logo"
                className="h-16 w-auto object-contain"
              />
            </div>
            <div className="flex-1">
              <h1
                ref={titleRef}
                className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight mb-2"
              >
                MarketJD
              </h1>
              <p className="text-lg text-muted-foreground mb-2 hero-subtitle">
                SEO Admin Portal • Enterprise Platform
              </p>
              <div className="flex flex-wrap gap-2 mt-4">
                <a
                  href="https://insightsjd.com/auth/signin/client"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group/badge hero-badge"
                >
                  <Badge
                    variant="success"
                    size="lg"
                    className="cursor-pointer hover:shadow-lg hover:shadow-emerald-500/25 hover:scale-105 transition-all duration-300"
                  >
                    <span className="relative flex h-2 w-2 mr-1.5">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
                    </span>
                    Live & Active
                    <ExternalLink className="w-3 h-3 ml-1.5 opacity-0 group-hover/badge:opacity-100 transition-opacity duration-200" />
                  </Badge>
                </a>
                <Badge variant="info" size="lg" className="hero-badge">
                  2+ Years
                </Badge>
                <Badge variant="default" size="lg" className="hero-badge">
                  Production
                </Badge>
              </div>
            </div>
          </div>
          <p className="text-lg text-muted-foreground max-w-4xl hero-description">
            A comprehensive SEO insights and analytics platform with 10+
            third-party API integrations, advanced authentication, dynamic
            reporting, and AI-powered automation. Built with Next.js 14,
            TypeScript, Prisma, and modern best practices for enterprise-scale
            applications.
          </p>
        </div>

        {/* Technology Stack - LogoLoop with Futuristic Background */}
        <div ref={techStackRef} className="mb-16 relative">
          {/* Futuristic Background Effect */}
          {!isDarkMode && (
            <Suspense fallback={null}>
              <div className="absolute inset-0 -z-10 opacity-10 pointer-events-none overflow-hidden rounded-3xl">
                <LightRays
                  raysOrigin="top-center"
                  raysColor="#07eae6"
                  raysSpeed={1}
                  lightSpread={12}
                  rayLength={0.7}
                  followMouse={true}
                  mouseInfluence={0.1}
                  className="w-full h-full"
                />
              </div>
            </Suspense>
          )}

          <div className="mb-6 relative z-10 section-header">
            <div className="mb-2 flex items-center gap-2">
              <div className="section-icon">
                <Cpu className="w-8 h-8 text-primary" />
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold section-title">
                Technology Stack
              </h2>
            </div>
            <p className="text-muted-foreground section-subtitle">
              Modern, scalable technologies powering the platform
            </p>
          </div>
          <div className="relative py-8 px-2 rounded-2xl bg-transparent section-content">
            <LogoLoop
              logos={techLogos}
              speed={80}
              direction="left"
              logoHeight={48}
              gap={48}
              pauseOnHover={true}
              fadeOut={true}
              scaleOnHover={true}
              className="w-full"
              ariaLabel="Technology stack logos"
            />
          </div>
        </div>

        {/* Third-Party Integrations - AccordionTabs */}
        <div ref={integrationsRef} className="mb-16 relative">
          <div className="mb-6 section-header">
            <div className="mb-2 flex items-center gap-2">
              <div className="section-icon">
                <Webhook className="w-8 h-8 text-primary" />
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold section-title">
                Third-Party Integrations
              </h2>
            </div>
            <p className="text-muted-foreground section-subtitle">
              10+ seamless API integrations for comprehensive data insights
            </p>
          </div>
          <div className="section-content">
            <AccordionTabs
              items={accordionTabItems}
              defaultActiveId={accordionTabItems[0]?.id}
              orientation="horizontal"
              className="w-full"
            />
          </div>
        </div>

        {/* Key Features & Capabilities - InteractiveGrid */}
        <div ref={featuresRef} className="mb-16 relative">
          <div className="mb-6 section-header">
            <div className="mb-2 flex items-center gap-2">
              <div className="section-icon">
                <Zap className="w-8 h-8 text-primary" />
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold section-title">
                Key Features & Capabilities
              </h2>
            </div>
            <p className="text-muted-foreground section-subtitle">
              Major development achievements and platform capabilities
            </p>
          </div>
          <div className="section-content">
            <InteractiveGrid
              items={interactiveGridItems}
              columns={2}
              enableHoverEffects={true}
              enableParticles={true}
              enableLightRays={true}
              className="w-full"
            />
          </div>
        </div>

        {/* Automation & Cron Jobs - Enhanced */}
        {/* <div className="mb-16 relative">
          <div className="mb-6">
            <div className="mb-2 flex items-center gap-2">
              <Calendar className="w-8 h-8 text-primary" />
              <ScrollReveal
                size="xl"
                align="left"
                variant="default"
                containerClassName="inline-block"
                animation="slideLeft"
                delay={0.1}
              >
                Automated Background Jobs
              </ScrollReveal>
            </div>
            <ScrollReveal
              size="md"
              align="left"
              variant="muted"
              animation="fadeUp"
              delay={0.2}
            >
              8+ cron jobs handling data synchronization and processing
            </ScrollReveal>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {cronJobs.map((job, idx) => (
              <div
                key={idx}
                style={{
                  animation: `fadeInUp 0.6s ease-out ${idx * 0.1}s both`,
                }}
                className="group relative p-5 rounded-xl border-2 border-border/50 bg-background/50 backdrop-blur-xl hover:border-primary/50 hover:bg-background/80 transition-all duration-300 cursor-pointer hover:-translate-y-1 hover:shadow-lg"
              >
                <div className="flex items-start gap-3 mb-3">
                  <div className="p-2 rounded-lg bg-primary/10 group-hover:bg-primary/20 group-hover:scale-110 transition-all duration-300">
                    <Calendar className="w-4 h-4 text-primary" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-sm text-foreground mb-1 group-hover:text-primary transition-colors">
                      {job.name}
                    </h4>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      {job.description}
                    </p>
                  </div>
                </div>
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary/0 group-hover:bg-primary/50 transition-all duration-300 rounded-b-xl" />
              </div>
            ))}
          </div>
        </div> */}

        {/* Project Summary - Enhanced */}
        <div ref={summaryRef} className="mb-12">
          <Card className="backdrop-blur-xl bg-gradient-to-br from-primary/10 via-primary/5 to-transparent border-2 border-primary/20 hover:border-primary/40 transition-all duration-500">
            <CardHeader className="pb-4">
              <CardTitle className="text-2xl flex items-center gap-3">
                <div className="p-2 rounded-lg bg-primary/20">
                  <FileText className="w-6 h-6 text-primary" />
                </div>
                Project Summary
              </CardTitle>
              <CardDescription className="text-base">
                Comprehensive enterprise platform for SEO management
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="p-4 rounded-lg bg-background/50 backdrop-blur-sm border border-border/50 hover:border-primary/50 transition-all duration-300 hover:shadow-lg summary-card">
                  <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                    Project Name
                  </h3>
                  <p className="text-foreground font-medium text-lg mb-1">
                    MarketJD
                  </p>
                  <p className="text-sm text-muted-foreground">
                    SEO Admin Portal
                  </p>
                  <p className="text-xs text-muted-foreground mt-2 italic">
                    Previously: InsightsJD
                  </p>
                </div>
                <div className="p-4 rounded-lg bg-background/50 backdrop-blur-sm border border-border/50 hover:border-primary/50 transition-all duration-300 hover:shadow-lg summary-card">
                  <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                    <div
                      className="w-2 h-2 rounded-full bg-primary animate-pulse"
                      style={{ animationDelay: "0.2s" }}
                    />
                    Duration
                  </h3>
                  <p className="text-foreground font-medium text-lg mb-1">
                    2+ Years
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Continuous development & maintenance
                  </p>
                  <div className="mt-3 flex gap-2">
                    <Badge variant="info" size="sm">
                      Active Development
                    </Badge>
                    <Badge variant="outline" size="sm">
                      Ongoing
                    </Badge>
                  </div>
                </div>
                <div className="p-4 rounded-lg bg-background/50 backdrop-blur-sm border border-border/50 hover:border-primary/50 transition-all duration-300 hover:shadow-lg summary-card">
                  <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                    <div
                      className="w-2 h-2 rounded-full bg-primary animate-pulse"
                      style={{ animationDelay: "0.4s" }}
                    />
                    Status
                  </h3>
                  <a
                    href="https://insightsjd.com/auth/signin/client"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group/status inline-block mb-3"
                  >
                    <Badge
                      variant="success"
                      size="lg"
                      className="cursor-pointer hover:shadow-lg hover:shadow-emerald-500/25 hover:scale-105 transition-all duration-300"
                    >
                      <span className="relative flex h-2 w-2 mr-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
                      </span>
                      Live & Active
                      <ExternalLink className="w-3 h-3 ml-1.5 opacity-0 group-hover/status:opacity-100 transition-opacity duration-200" />
                    </Badge>
                  </a>
                  <p className="text-sm text-muted-foreground">
                    Production environment
                  </p>
                  <p className="text-xs text-muted-foreground mt-2">
                    Enterprise-grade platform
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default MarketJD;
