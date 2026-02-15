import { useEffect, useMemo, lazy, Suspense, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAppSelector } from "@/store/hooks";
import { gsap, SplitText, useGSAP } from "@/lib/gsap";
import { useGSAPRouteAnimation } from "@/hooks/useGSAPRouteAnimation";
import { useGSAPScrollRestoration } from "@/hooks/useGSAPScrollRestoration";
import {
  ArrowLeft,
  Zap,
  Database,
  FileText,
  TrendingUp,
  Activity,
  Cpu,
  Webhook,
  BarChart3,
  Server,
  Shield,
  Clock,
  Upload,
  Users,
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

const LineLeader = () => {
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
  const architectureRef = useRef<HTMLDivElement>(null);
  const featuresRef = useRef<HTMLDivElement>(null);
  const summaryRef = useRef<HTMLDivElement>(null);

  // Technology logos with real CDN URLs
  const techLogos: LogoItem[] = useMemo(
    () => [
      {
        src: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg",
        alt: "React",
        title: "React 18 - Click to visit documentation",
        href: "https://react.dev",
      },
      {
        src: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg",
        alt: "TypeScript",
        title: "TypeScript - Click to visit documentation",
        href: "https://www.typescriptlang.org/docs",
      },
      {
        src: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nextjs/nextjs-original.svg",
        alt: "Next.js",
        title: "Next.js - Click to visit documentation",
        href: "https://nextjs.org/docs",
      },
      {
        src: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mongodb/mongodb-original.svg",
        alt: "MongoDB",
        title: "MongoDB - Click to visit documentation",
        href: "https://www.mongodb.com/docs",
      },
      {
        src: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/amazonwebservices/amazonwebservices-original-wordmark.svg",
        alt: "AWS",
        title: "AWS S3 & Lambda - Click to visit documentation",
        href: "https://docs.aws.amazon.com",
      },
      {
        src: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg",
        alt: "Node.js",
        title: "Node.js Runtime - Click to visit documentation",
        href: "https://nodejs.org/docs",
      },
      // {
      //   src: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/express/express-original.svg",
      //   alt: "Express.js",
      //   title: "Express.js - Click to visit documentation",
      //   href: "https://expressjs.com",
      // },
      // {
      //   src: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/redis/redis-original.svg",
      //   alt: "Redis",
      //   title: "Redis - Click to visit documentation",
      //   href: "https://redis.io/docs",
      // },
    ],
    []
  );

  // Work area breakdown for accordion
  const workAreas = [
    {
      category: "Report Streaming Pipeline",
      items: [
        {
          name: "S3StreamingService",
          description:
            "Reusable service using @aws-sdk/lib-storage Upload with PassThrough streams to pipe CSV data directly to S3 in chunks with gzip compression",
        },
        {
          name: "ReportGenerationService",
          description:
            "Agenda.js-based job queue connected to MongoDB with configurable concurrency (default 10), 10-second polling interval, and 10-minute lock lifetime",
        },
        {
          name: "BillingReportAgingStreamingService",
          description:
            "MongoDB aggregation pipelines that compute center totals server-side, streaming person groups one at a time through Node.js Readable streams",
        },
        {
          name: "AgingReportStreamingCsvService",
          description:
            "Converts streaming aggregation output into CSV rows on-the-fly, piping directly to S3 instead of building the entire CSV in memory",
        },
        {
          name: "MemoryMonitor",
          description:
            "Diagnostic utility tracking process.memoryUsage() at checkpoints during report generation, logging heap usage deltas and elapsed time",
        },
        {
          name: "ReportEmailService",
          description:
            "Sends email notifications with S3 download links when async reports complete, using HTML templates",
        },
      ],
      icon: Upload,
      color: "purple",
    },
    {
      category: "Performance Optimization",
      items: [
        {
          name: "switchGroup Event Loop Fix",
          description:
            "Refactored group switching operations touching 80+ collections with async yielding patterns to keep server responsive. 516 lines of test coverage added.",
        },
        {
          name: "MongoDB 100MB Document Limit Fix",
          description:
            "Restructured aggregation pipelines using $unwind and $group stages to keep intermediate documents small during multi-org $lookup stages. 535 lines of test coverage.",
        },
        {
          name: "getPeopleCountForGroup Rewrite",
          description:
            "Rewrote people count calculation (530+ lines) with batched queries and early exits, replacing multiple sequential queries.",
        },
        {
          name: "Agenda Job Queue Tuning",
          description:
            "Configured concurrency to 10, high priority for report jobs, fixed defaultLockLimit to match maxConcurrency to prevent job starvation.",
        },
      ],
      icon: TrendingUp,
      color: "blue",
    },
    {
      category: "Data Pipelines & Exports",
      items: [
        {
          name: "Subsidy Data Export",
          description:
            "Scheduled export that extracts subsidy data from MongoDB, formats it, and uploads to S3 with timezone-aware timestamps per organization.",
        },
        {
          name: "Billing Plan Data Export",
          description:
            "S3-backed export for billing plan data with cron scheduling, report name prefixing, and environment configuration.",
        },
        {
          name: "Custom Report Builder",
          description:
            "View/edit functionality for saved custom reports — users save report configurations (filters, columns, date ranges) and revisit them later.",
        },
        {
          name: "Ledger Detail Report Rebuild",
          description:
            "913-line MongoDB aggregation pipeline performing all joins, filters, and grouping server-side with streaming to S3. Handles superadmin permissions and column selection.",
        },
      ],
      icon: Database,
      color: "green",
    },
    {
      category: "Billing, Scheduling & UI",
      items: [
        {
          name: "Invoice Display & Migration",
          description:
            "Fixed invoice display inconsistency, migrated from publication to Meteor.call for transaction tab data fetching with loading states and unit tests.",
        },
        {
          name: "Credit Memo Metadata",
          description:
            "Implemented updatedAt metadata field for credit memos with org-timezone-aware timestamps and Open Credit Importer updates.",
        },
        {
          name: "Calendar Optimization",
          description:
            "Removed unnecessary subscriptions from calendar page to reduce data transfer. Created optimized publication omitting unused fields from staff scheduling data.",
        },
        {
          name: "Deep Link Session Handling",
          description:
            "Fixed login route authorization, session value handling, and authenticated report download redirects across multi-tenant sessions.",
        },
        {
          name: "Data Importers",
          description:
            "Updated Family Importer lookup tables, relaxed phone validation (14+ format variants), built Grades Served Importer UI, and fixed Item Importer _id assignment.",
        },
      ],
      icon: Activity,
      color: "orange",
    },
  ];

  // Key features for interactive grid
  const features = [
    {
      title: "Report Streaming Architecture",
      description:
        "Replaced in-memory CSV generation with MongoDB aggregation pipelines, Node.js readable streams, and direct S3 uploads via @aws-sdk/lib-storage — eliminating server OOM crashes on large multi-org report exports with millions of invoice records.",
      icon: Server,
      color: "purple",
    },
    {
      title: "Agenda.js Job Queue",
      description:
        "Built ReportGenerationService with configurable concurrency (default 10), 10-second polling interval, 10-minute lock lifetime. Supports multiple report handlers via a Map, tracks job status, and handles failures gracefully.",
      icon: Clock,
      color: "blue",
    },
    {
      title: "Ledger Detail Pipeline",
      description:
        "913-line MongoDB aggregation pipeline performing all joins ($lookup), filters, and grouping server-side. Handles superadmin permissions, cash offset filters, and column selection within the pipeline — streaming results directly to S3.",
      icon: Database,
      color: "green",
    },
    {
      title: "Event Loop Optimization",
      description:
        "Refactored blocking operations across group switching (80+ collections), billing reports, and people count calculations with async yielding patterns — keeping the Node.js server responsive during heavy operations.",
      icon: Zap,
      color: "orange",
    },
    {
      title: "MongoDB 100MB Limit Fix",
      description:
        "Restructured aggregation pipelines to prevent the 100MB single-document limit error during $lookup stages on multi-org queries using $unwind and $group stages. 535 lines of test coverage added.",
      icon: Shield,
      color: "red",
    },
    {
      title: "S3 Streaming Service",
      description:
        "Reusable service using @aws-sdk/lib-storage Upload with PassThrough streams to pipe CSV data directly to S3 in chunks with gzip compression and unique key generation per report/org/user.",
      icon: Upload,
      color: "teal",
    },
    {
      title: "Data Export Automation",
      description:
        "Scheduled exports for subsidy and billing plan data from MongoDB to S3, with timezone-aware timestamps matching each organization's timezone and configurable cron schedules.",
      icon: BarChart3,
      color: "pink",
    },
    {
      title: "Multi-Tenant Features",
      description:
        "Deep link session handling, multisite selection menus, group propagation for new sites, white-labeled components respecting org-specific colors, and admin user workflow extensions.",
      icon: Users,
      color: "yellow",
    },
  ];

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
                  { x: -30, y: 40, rotate: -10 },
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

          // ─── Scroll-triggered section animation helper ───
          const animateSection = (
            ref: React.RefObject<HTMLDivElement | null>
          ) => {
            if (!ref.current) return;
            const el = ref.current;

            const icon = el.querySelector(".section-icon");
            const title = el.querySelector(".section-title");
            const subtitle = el.querySelector(".section-subtitle");
            const content = el.querySelector(".section-content");

            if (icon) {
              gsap.set(icon, { scale: 0, rotation: -180 });
              gsap.to(icon, {
                scale: 1,
                rotation: 0,
                duration: 1,
                ease: "elastic.out(1, 0.4)",
                scrollTrigger: {
                  trigger: el,
                  start: "top 80%",
                  toggleActions: "play reverse play reverse",
                },
              });
            }

            if (title) {
              gsap.set(title, { opacity: 0, x: -60, filter: "blur(8px)" });
              gsap.to(title, {
                opacity: 1,
                x: 0,
                filter: "blur(0px)",
                duration: 0.8,
                ease: "power3.out",
                scrollTrigger: {
                  trigger: el,
                  start: "top 78%",
                  toggleActions: "play reverse play reverse",
                },
              });
            }

            if (subtitle) {
              gsap.set(subtitle, { opacity: 0, y: 20 });
              gsap.to(subtitle, {
                opacity: 1,
                y: 0,
                duration: 0.6,
                ease: "power2.out",
                scrollTrigger: {
                  trigger: el,
                  start: "top 76%",
                  toggleActions: "play reverse play reverse",
                },
              });
            }

            if (content) {
              gsap.set(content, {
                opacity: 0,
                y: 100,
                scale: 0.85,
                rotateX: 25,
                transformPerspective: 1400,
                transformOrigin: "center top",
              });
              gsap.to(content, {
                opacity: 1,
                y: 0,
                scale: 1,
                rotateX: 0,
                duration: 1.4,
                ease: "power3.out",
                scrollTrigger: {
                  trigger: el,
                  start: "top 70%",
                  toggleActions: "play reverse play reverse",
                },
              });
            }
          };

          animateSection(techStackRef);
          animateSection(architectureRef);
          animateSection(featuresRef);

          // ─── Summary — Cinematic card entrance ───
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
          architectureRef.current,
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
          architectureRef.current,
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

  // Prepare AccordionTabs items for work areas
  const accordionTabItems: AccordionTabItem[] = useMemo(
    () =>
      workAreas.map((area) => {
        const Icon = area.icon;
        return {
          id: area.category,
          label: area.category,
          icon: <Icon className="w-4 h-4" />,
          color: area.color,
          badge: area.items.length,
          content: (
            <div className="space-y-3">
              {area.items.map((item, itemIdx) => (
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
    [workAreas]
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
              href="https://my.discoverchampions.momentpath.com/login/legacy"
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
                title: "LineLeader Manage - ChildCare SaaS Platform",
                description:
                  "Enterprise childcare SaaS platform with report streaming pipeline, MongoDB aggregation optimization, Agenda.js job queues, and multi-tenant architecture serving organizations with millions of records.",
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
                src={isDarkMode ? "/ll_brandmark.svg" : "/ll_brandmark.svg"}
                alt="LineLeader Logo"
                className="h-36 w-auto object-contain"
              />
            </div>
            <div className="flex-1">
              <h1
                ref={titleRef}
                className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight mb-2"
              >
                LineLeader
              </h1>
              <p className="text-lg text-muted-foreground mb-2 hero-subtitle">
                ChildCare SaaS Platform • Enterprise Full Stack Engineering
              </p>
              <div className="flex flex-wrap gap-2 mt-4">
                <a
                  href="https://my.discoverchampions.momentpath.com/login/legacy"
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
                  Mar 2025 - Present
                </Badge>
                <Badge variant="default" size="lg" className="hero-badge">
                  Production
                </Badge>
              </div>
            </div>
          </div>
          <p className="text-lg text-muted-foreground max-w-4xl hero-description">
            Architected core backend infrastructure for LineLeader Manage, a
            childcare SaaS platform by ChildcareCRM. Built a report streaming
            pipeline replacing in-memory CSV generation with MongoDB aggregation
            pipelines, Node.js readable streams, and direct S3 uploads —
            eliminating server OOM crashes. Optimized event loop blocking,
            MongoDB document limits, and Agenda.js job queue concurrency for
            organizations processing millions of invoice records.
          </p>
        </div>

        {/* Technology Stack - LogoLoop */}
        <div ref={techStackRef} className="mb-16 relative">
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
              Enterprise-grade technologies powering the platform
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

        {/* Architecture & Work Areas - AccordionTabs */}
        <div ref={architectureRef} className="mb-16 relative">
          <div className="mb-6 section-header">
            <div className="mb-2 flex items-center gap-2">
              <div className="section-icon">
                <Webhook className="w-8 h-8 text-primary" />
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold section-title">
                Architecture & Work Areas
              </h2>
            </div>
            <p className="text-muted-foreground section-subtitle">
              Core systems built across report streaming, performance
              optimization, and data pipelines
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
              Major engineering achievements and platform capabilities
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

        {/* Project Summary */}
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
                Enterprise childcare SaaS platform — backend engineering &
                architecture
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
                    LineLeader Manage
                  </p>
                  <p className="text-sm text-muted-foreground">
                    ChildCare SaaS Platform
                  </p>
                  <p className="text-xs text-muted-foreground mt-2 italic">
                    By ChildcareCRM
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
                    Mar 2025 - Present
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Continuous development & maintenance
                  </p>
                  <div className="mt-3 flex gap-2">
                    <Badge variant="info" size="sm">
                      48 Feature Tickets
                    </Badge>
                    <Badge variant="outline" size="sm">
                      29 Bug Fixes
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
                    href="https://my.discoverchampions.momentpath.com/login/legacy"
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
                    Enterprise-grade ChildCare SaaS
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

export default LineLeader;
