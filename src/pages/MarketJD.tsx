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
  Cpu,
  ExternalLink,
  Database,
  Server,
  Lock,
  Cloud,
  Layers,
  Search,
  Phone,
  MousePointerClick,
  Music,
  LayoutGrid,
  Filter,
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
  const aiSystemsRef = useRef<HTMLDivElement>(null);
  const dataPipelineRef = useRef<HTMLDivElement>(null);
  const databaseRef = useRef<HTMLDivElement>(null);
  const integrationsRef = useRef<HTMLDivElement>(null);
  const featuresRef = useRef<HTMLDivElement>(null);
  const authRef = useRef<HTMLDivElement>(null);
  const deploymentRef = useRef<HTMLDivElement>(null);
  const summaryRef = useRef<HTMLDivElement>(null);

  // ═══════════════════════════════════════════════════════════════════════════
  // DATA: Technology Stack
  // ═══════════════════════════════════════════════════════════════════════════
  const techLogos: LogoItem[] = useMemo(
    () => [
      {
        src: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nextjs/nextjs-original.svg",
        alt: "Next.js",
        title: "Next.js 14.2.10 (App Router) - Click to visit documentation",
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
        title: "Prisma 6.11.1 ORM (100 models, 202 migrations) - Click to visit documentation",
        href: "https://www.prisma.io/docs",
      },
      {
        src: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/redux/redux-original.svg",
        alt: "Redux Toolkit",
        title: "Redux Toolkit + redux-persist - Click to visit documentation",
        href: "https://redux-toolkit.js.org",
      },
      {
        src: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/tailwindcss/tailwindcss-original.svg",
        alt: "Tailwind CSS",
        title: "Tailwind CSS 3.3.2 + Ant Design - Click to visit documentation",
        href: "https://tailwindcss.com/docs",
      },
      {
        src: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mysql/mysql-original.svg",
        alt: "MySQL",
        title: "MySQL 8.0+ (100 models, 2400-line schema) - Click to visit documentation",
        href: "https://dev.mysql.com/doc",
      },
      {
        src: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg",
        alt: "Node.js",
        title: "Node.js (18 cron jobs, 272 API handlers) - Click to visit documentation",
        href: "https://nodejs.org/docs",
      },
      {
        src: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/docker/docker-original.svg",
        alt: "Docker",
        title: "Docker (multi-stage build, Node 20 Alpine) - Click to visit documentation",
        href: "https://docs.docker.com",
      },
      {
        src: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/openai/openai-original.svg",
        alt: "OpenAI",
        title: "OpenAI GPT-4o-mini + Fine-tuned models - Click to visit documentation",
        href: "https://platform.openai.com/docs",
      },
    ],
    []
  );

  // ═══════════════════════════════════════════════════════════════════════════
  // DATA: AI/ML Systems (AccordionTabs)
  // ═══════════════════════════════════════════════════════════════════════════
  const aiSystems = [
    {
      category: "AI-Powered Call Evaluation",
      items: [
        {
          name: "Dual Evaluation Architecture",
          description:
            "Two paths (automatic cron + manual UI) funnel into a single API endpoint (POST /api/ai/evaluate-call), ensuring one source of truth for evaluation logic.",
        },
        {
          name: "OpenAI Integration",
          description:
            "Model selection priority: query param (?model=base|fine) > fine-tuned env model > base model (gpt-4o-mini). Temperature: 0.2 for consistency. Response format: json_object. System prompt crafted as expert legal intake QA assistant with medical malpractice safeguards.",
        },
        {
          name: "JSON Repair Mechanism",
          description:
            "Custom repairJsonContent() handles OpenAI truncated responses — removes trailing partial properties via regex, balances unmatched braces/brackets, re-parses repaired JSON. Recovers ~95% of partial responses.",
        },
        {
          name: "Response Validation & Sanitization",
          description:
            "Qualification coercion (defaults to 'Qualified' if not explicit), outcome validation against 9-value whitelist (Accepted, Investigation, Referred Case, etc.), score/confidence clamping to 0-100, entity key whitelisting to prevent prompt injection, array slicing (max 10 items).",
        },
        {
          name: "Cost Tracking",
          description:
            "6-tier pricing table covering base + fine-tuned variants for gpt-4o-mini, gpt-4o, gpt-3.5-turbo. Per-evaluation cost: (prompt_tokens/1000)*input_price + (completion_tokens/1000)*output_price. Logged to evaluationCost table with Decimal(10,6) precision.",
        },
        {
          name: "3-Tier Rule Priority Engine",
          description:
            "Client-specific rules (localStorage) → Practice area rules (DB aiTemplate) → Global rules (aiTemplate.token_4st where website_id='GLOBAL'). Deduplication via Map with normalized (lowercase) keys.",
        },
      ],
      icon: Brain,
      color: "purple",
    },
    {
      category: "AssemblyAI Transcription",
      items: [
        {
          name: "99.4% Cost Reduction",
          description:
            "Replaced CallRail transcription ($0.065/min) with AssemblyAI ($0.00037/min) — a six-figure annual savings. Config: speaker_labels: true, speakers_expected: 2, sentiment_analysis: true, auto_highlights: true.",
        },
        {
          name: "Tier 1: GPT-4o Content Analysis",
          description:
            "Sends all utterances to GPT-4o with detailed rules for identifying Agent vs. Caller patterns. Agent indicators: 'Thank you for calling [firm]', professional language. Caller indicators: 'I need help', 'I was injured'. Returns confidence per assignment.",
        },
        {
          name: "Tier 2: Pattern Matching Fallback",
          description:
            "If GPT-4o fails, uses regex-based pattern matching: 42+ strong agent indicators (law office, how can I help, etc.) and 49+ strong caller indicators (starts with 'I', 'my', personal info patterns).",
        },
        {
          name: "Tier 3: Greeting-Based Fallback",
          description:
            "Finds who speaks the greeting in the first 5 utterances, assigns all other utterances inversely. Post-processing: validateAndCorrectUtterances() performs conversation flow analysis for edge cases.",
        },
        {
          name: "Metadata Extraction",
          description:
            "Duration, confidence score, processing time, sentiment, word count, speaker count, estimated cost per call — all persisted for audit and analytics.",
        },
      ],
      icon: Phone,
      color: "blue",
    },
    {
      category: "Fine-Tuning Pipeline",
      items: [
        {
          name: "Step 1: Export Training Data",
          description:
            "/api/export/finetune/calls/[websiteId] — exports as JSONL (one JSON per line). Filters: date range, duration, label requirements (outcome/casetype/both). Each record structured as OpenAI chat format: system prompt + user prompt (playbook + transcription) + assistant response.",
        },
        {
          name: "Step 2: Upload to OpenAI",
          description:
            "/api/openai/finetune/upload — validates JSONL format (rejects plain JSON), creates FormData with multipart encoding, POSTs to OpenAI Files API.",
        },
        {
          name: "Step 3: Create Fine-Tune Job",
          description:
            "/api/openai/finetune/create-job — default base model: gpt-4o-mini-2024-07-18, epochs: 'auto' (OpenAI determines optimal). Returns job object for monitoring. Per-client domain training on legal intake patterns.",
        },
      ],
      icon: Cpu,
      color: "orange",
    },
  ];

  // ═══════════════════════════════════════════════════════════════════════════
  // DATA: Data Pipeline Architecture (AccordionTabs)
  // ═══════════════════════════════════════════════════════════════════════════
  const dataPipeline = [
    {
      category: "CallRail Sync",
      items: [
        {
          name: "Core Pipeline (1,885 lines)",
          description:
            "CallRail v3 API, fetches 73 fields per call record. Pagination: 250 records/page with multi-page iteration, 30-day lookback window.",
        },
        {
          name: "Batch Processing",
          description:
            "Transcription: 5 concurrent AssemblyAI requests, 300s timeout per call. Evaluation: sequential processing with 120s timeout, builds playbook JSON from office locations, languages, practice areas.",
        },
        {
          name: "DB Upsert Strategy",
          description:
            "Batch 50 records, max 5 retries with 2s delay between retries. Company mapping: token extracted from CallRail script URLs for website-to-company matching.",
        },
      ],
      icon: Phone,
      color: "blue",
    },
    {
      category: "Facebook/Google Ads",
      items: [
        {
          name: "Facebook Graph API v21.0",
          description:
            "System user token. Rate limit monitoring via x-app-usage, x-page-usage, x-ad-account-usage headers.",
        },
        {
          name: "Adaptive Throttling",
          description:
            ">90% usage → 5s delay, >80% → 2s, >70% → 1s. Exponential backoff: base 2s, max 60s cap, 5 retry attempts. Concurrency: 5 concurrent requests per batch.",
        },
        {
          name: "Google Ads API",
          description:
            "Campaign management and performance tracking with OAuth2 consent flow, refresh tokens stored in googleAdsAccount table, customer ID via OAuth state parameter.",
        },
      ],
      icon: Activity,
      color: "purple",
    },
    {
      category: "CRM Sync",
      items: [
        {
          name: "MyCase Phone Normalization",
          description:
            "generatePhoneVariants() creates 13+ format variants per number: +18157661726, (815) 766-1726, 815-766-1726, 815.766.1726, +1 (815) 766-1726, etc.",
        },
        {
          name: "Lead Matching Priority",
          description:
            "Email → phone in calls → phone/email in forms → phone variants in chats. OAuth2 refresh token flow with token expiry email alerts.",
        },
        {
          name: "Litify/Salesforce Sync",
          description:
            "SOQL queries fetch litify_pm__Intake__c records with nested relationships (Settlement_Link, Attorney Fees). Cursor pagination via Salesforce nextRecordsUrl.",
        },
      ],
      icon: MessageSquare,
      color: "green",
    },
    {
      category: "Attribution & Analytics",
      items: [
        {
          name: "Investor Attribution",
          description:
            "Dual-rule system: Rule 1: signed leads (with conversion dates) → CEO. Rule 2: flags conversion-outside-investment-period leads for audit. Lead grouping by phone/email across calls+forms+chats into 7 categories.",
        },
        {
          name: "2-Phase Distribution Algorithm",
          description:
            "Phase 1: CEO gets signed leads + percentage allocation. Phase 2: non-CEO investors get sequential group assignment (highest percentage first, last gets all remaining). Swap mechanism for period-mismatched leads.",
        },
        {
          name: "Chat & Social Sync",
          description:
            "ApexChat API: 2,000 records/request with cursor pagination. Social media classification: 24 platform domains (Facebook, Instagram, TikTok, Reddit). Source attribution: UTM parameters > social domain matching > organic fallback.",
        },
        {
          name: "Other Crons (18 total)",
          description:
            "Contact forms (CallRail, 250/page), Google Search Console (OAuth2 service account, 15-day window), Facebook Leads (5 concurrent page loads), Off-Page SEO, Technical SEO (Semrush APIs).",
        },
      ],
      icon: TrendingUp,
      color: "orange",
    },
  ];

  // ═══════════════════════════════════════════════════════════════════════════
  // DATA: Database Architecture (InteractiveGrid)
  // ═══════════════════════════════════════════════════════════════════════════
  const databaseFeatures = [
    {
      title: "Polymorphic Lead Model",
      description:
        "4 separate tables instead of single-table inheritance: CallRecord (100+ fields), ApexChatData (144 fields), ContactForms (64+ fields), FacebookLead (34 fields). Each shares common fields (lead_status, lead_evaluation, caseType, investor_id, crm_data) but has provider-specific columns for independent schema evolution.",
      icon: Layers,
      color: "blue",
    },
    {
      title: "Multi-Tenancy Architecture",
      description:
        "All data scoped by website_id or company_id. 80+ client websites with isolated data. Ensures complete data separation across law firm clients while sharing the same database infrastructure.",
      icon: Globe,
      color: "purple",
    },
    {
      title: "3-Level RBAC Permission Hierarchy",
      description:
        "ClientUserRole → ClientUserRolePermission → ClientUserRolePermissionModule. Plus direct permission override: ClientUserPermission → ClientUserPermissionModule. Supports both template-based roles and individual user customization.",
      icon: Key,
      color: "green",
    },
    {
      title: "40+ JSON Fields",
      description:
        "Semi-structured data (tags, caseType arrays, crm_data objects, mycase_opened_date) enables flexibility without migrations. Queried via MySQL JSON_TABLE() with COLLATE utf8mb4_bin for case-sensitive extraction.",
      icon: Database,
      color: "orange",
    },
    {
      title: "Soft-Delete & Audit Pattern",
      description:
        "is_deleted Int @default(0) on 27 models preserves audit trail. AI Configuration Model serves as control plane: selected_model, continuous_evaluation_enabled, evaluation_progress (JSON), last_evaluated_call_time for cron resume.",
      icon: Shield,
      color: "teal",
    },
    {
      title: "Financial Tracking",
      description:
        "Investors + InvestmentPeriod models with Decimal(10,2) precision. EvaluationCost with Decimal(10,6) for micro-cost tracking per AI evaluation call.",
      icon: BarChart3,
      color: "yellow",
    },
    {
      title: "PPC Aggregate Queries (719 lines)",
      description:
        "Parallel execution: Google Ads API + 3 DB queries via Promise.all(). Case-insensitive campaign matching via Map(campaign.toLowerCase()). 4-level filtering: All → Qualified (tags/status) → Signed (conversion dates). Gzip compression for response payloads.",
      icon: TrendingUp,
      color: "pink",
    },
    {
      title: "Filter Optimization (26 → 7 queries)",
      description:
        "Optimized from 26+ separate queries to 7 using UNION ALL pattern. Each combines 7+ SELECT statements across tables. BigInt sanitization: MySQL COUNT returns BigInt — converted to Number for JSON serialization.",
      icon: Search,
      color: "red",
    },
  ];

  // ═══════════════════════════════════════════════════════════════════════════
  // DATA: Third-Party Integrations (AccordionTabs)
  // ═══════════════════════════════════════════════════════════════════════════
  const integrations = [
    {
      category: "Analytics & SEO",
      items: [
        {
          name: "Google Analytics Data API",
          description: "Real-time analytics data integration for traffic metrics and user behavior tracking",
        },
        {
          name: "Google Search Console",
          description: "OAuth2 service account, 15-day rolling window, search performance and indexing data",
        },
        {
          name: "Semrush API",
          description: "Off-page SEO (backlink monitoring) and Technical SEO (site audits) via dedicated cron jobs",
        },
        {
          name: "DataForSEO API",
          description: "Comprehensive SEO data aggregation across search engines",
        },
        {
          name: "Serp API",
          description: "Search engine results page monitoring and rank tracking",
        },
        {
          name: "Google PageSpeed API",
          description: "Performance metrics (LCP, FID, CLS) and optimization insights per client domain",
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
          description: "OAuth2 consent flow, refresh tokens in DB, campaign management with customer ID via state parameter",
        },
        {
          name: "Google Local Service Ads",
          description: "Local advertising campaign integration for law firm lead generation",
        },
        {
          name: "Facebook Ads API (Graph v21.0)",
          description: "System user token, rate limit monitoring (x-app-usage headers), adaptive throttling with exponential backoff",
        },
        {
          name: "Facebook Leads API",
          description: "Page access tokens, 5 concurrent page loads, social media lead processing pipeline",
        },
      ],
      icon: Activity,
      color: "purple",
    },
    {
      category: "Communication & CRM",
      items: [
        {
          name: "CallRail v3 API",
          description: "73 fields per call, 250/page pagination, 30-day lookback. Script URL token extraction for company mapping",
        },
        {
          name: "ApexChat API",
          description: "2,000 records/request with cursor pagination, 24 social platform domain classification",
        },
        {
          name: "Salesforce x Litify API",
          description: "SOQL queries for litify_pm__Intake__c with nested Settlement_Link/Attorney Fees relationships, cursor pagination",
        },
        {
          name: "MyCase API",
          description: "OAuth2 with refresh token flow, phone normalization (13+ variants via generatePhoneVariants()), token expiry email alerts",
        },
        {
          name: "HubSpot API",
          description: "Marketing automation and CRM integration for lead tracking",
        },
      ],
      icon: MessageSquare,
      color: "green",
    },
    {
      category: "AI & Automation",
      items: [
        {
          name: "OpenAI API (GPT-4o-mini + Fine-tuned)",
          description: "Dual eval architecture, JSON repair, 6-tier cost tracking, 3-tier rule priority engine. Fine-tuning pipeline: JSONL export → upload → job creation",
        },
        {
          name: "AssemblyAI",
          description: "Speaker diarization with 3-tier assignment (GPT-4o → 91-pattern regex → greeting fallback). 99.4% cost reduction vs CallRail transcription",
        },
        {
          name: "APIFY Crawler",
          description: "Web scraping and data extraction for competitor analysis",
        },
        {
          name: "SendGrid",
          description: "Template-based email delivery with idempotency checks. Event-driven alerts: BELOW/ABOVE/CHANGE/PERIOD_END conditions with cooldown logic",
        },
        {
          name: "Juvoleads Webhook",
          description: "Lead generation webhook integration for inbound lead capture",
        },
        {
          name: "Geo Grid API + Google Maps",
          description: "Geographic data, mapping services, and location-based analytics",
        },
      ],
      icon: Brain,
      color: "orange",
    },
  ];

  // ═══════════════════════════════════════════════════════════════════════════
  // DATA: Frontend Features & UX (InteractiveGrid)
  // ═══════════════════════════════════════════════════════════════════════════
  const features = [
    {
      title: "Cross-Page Filter Synchronization",
      description:
        "allLeadsFilterSlice in Redux + redux-persist: complex multi-page filter state management storing date ranges, global filters, and per-page filters (calls, forms, chats, fb). Value transformation dictionaries handle lead status differences between chat outcomes and call statuses. Persisted to SessionStorage for tab persistence.",
      icon: Filter,
      color: "blue",
    },
    {
      title: "Custom Fuzzy Search Engine",
      description:
        "Levenshtein distance algorithm for typo-tolerant search with O(n*m) DP matrix. Similarity score: 1 - (distance / maxLength), threshold 0.6. 4-tier priority: exact match (1.0) > prefix match (0.9) > partial match (0.8) > fuzzy match. findMatches() identifies matched character indices for UI highlighting.",
      icon: Search,
      color: "purple",
    },
    {
      title: "Sidebar Search with Smart Suggestions",
      description:
        "Composes multiple custom hooks: useFuzzySearch, useSearchHistory, useUsageStats. Keyboard navigation: ArrowUp/Down + Enter for result selection. Search history persisted in localStorage with recent query tracking. Route recommendations based on current page and usage frequency. Category filtering by permission-based categories.",
      icon: Settings,
      color: "green",
    },
    {
      title: "Drag-and-Drop Filters",
      description:
        "Built with dnd-kit sortable with pointer sensor (8px activation threshold). Reorderable filter items with add/remove and multi-value selection. Visual drag handle with grab cursor for intuitive UX.",
      icon: MousePointerClick,
      color: "orange",
    },
    {
      title: "Custom Audio Player",
      description:
        "Drag-to-scrub progress bar with pointer event handling. Skip forward/backward 10 seconds. Speaker percentage visualization (Agent blue vs. Caller orange). Recording fetch from CallRail API with loading/error states and playback controls.",
      icon: Music,
      color: "pink",
    },
    {
      title: "Responsive Dashboard Builder",
      description:
        "react-grid-layout + react-dnd for drop-zone grid. Drop components: Leads, Text Editor, Traffic charts. Dynamic layout constraints based on component content (card count adjusts minW/minH). Multi-page support with per-page component arrays. 10-column grid with 100px row height.",
      icon: LayoutGrid,
      color: "teal",
    },
    {
      title: "PPC Aggregate Results Display",
      description:
        "Multi-dimensional data: campaigns × months × years. Dynamic column generation per year with drill-down links. Campaign card sidebar with year badges and metric summaries. Month filtering by current date (future months hidden).",
      icon: BarChart3,
      color: "yellow",
    },
    {
      title: "AI Evaluation Display",
      description:
        "Multi-model tabs: Fine-tuned vs. Base model side-by-side comparison. Color-coded scores: green (80+), orange (50-79), red (<50). Expandable sections: reasons, insights, recommendations, entities, next steps. Requalify action button for re-evaluation with model selection.",
      icon: Brain,
      color: "red",
    },
  ];

  // ═══════════════════════════════════════════════════════════════════════════
  // DATA: Auth & Security (InteractiveGrid)
  // ═══════════════════════════════════════════════════════════════════════════
  const authFeatures = [
    {
      title: "NextAuth.js v4 — 3 User Types",
      description:
        "Credentials Provider with custom authorize callback. 3 user types: user (admin), website (site-level), client_user (client portal). Session callback enriches from DB on every refresh for instant permission propagation. transformClientUserPermissions() normalizes permission structure for client users.",
      icon: Lock,
      color: "blue",
    },
    {
      title: "Google Ads OAuth2 Flow",
      description:
        "Init endpoint generates consent URL with access_type: 'offline' for refresh tokens. Callback exchanges auth code for tokens, stores refresh token in googleAdsAccount table. Customer ID passed as OAuth state parameter for post-callback validation.",
      icon: Key,
      color: "purple",
    },
    {
      title: "Route Protection & RBAC",
      description:
        "middleware.ts with selective route matchers (not blanket protection). Protects /pages/* and specific API routes. Role-based access implemented downstream in individual components. 3-level permission hierarchy with direct override support.",
      icon: Shield,
      color: "green",
    },
    {
      title: "Production Record Sharing",
      description:
        "Secure email-based sharing system for production records with granular access control. Encrypted email delivery via SendGrid, audit trails for compliance, and configurable expiration controls. Users only see records they're authorized to view.",
      icon: Mail,
      color: "orange",
    },
  ];

  // ═══════════════════════════════════════════════════════════════════════════
  // DATA: Deployment & Infrastructure (InteractiveGrid)
  // ═══════════════════════════════════════════════════════════════════════════
  const deploymentFeatures = [
    {
      title: "Docker Multi-Stage Build",
      description:
        "Stage 1 (deps): Install production deps + Prisma generate (cached layer). Stage 2 (builder): Full deps + Next.js build with standalone output. Stage 3 (runtime): Node 20 Alpine, copies only necessary artifacts, runs as non-root node user for security.",
      icon: Cloud,
      color: "blue",
    },
    {
      title: "Health Probes for Zero-Downtime",
      description:
        "Liveness: GET /api/health — process alive check (always 200). Readiness: GET /api/health/ready — executes SELECT 1 against MySQL, returns 503 if DB unreachable. Environment: UV_THREADPOOL_SIZE=16 for CPU-intensive cron operations.",
      icon: Server,
      color: "green",
    },
    {
      title: "Event-Driven Alert System",
      description:
        "Not scheduled — triggered by metric updates via POST /api/alerts/evaluate. Rule conditions: BELOW, ABOVE, CHANGE (delta-based), PERIOD_END. Cooldown logic: ONCE_PER_DAY or ONCE_PER_MONTH prevents notification spam.",
      icon: Mail,
      color: "purple",
    },
    {
      title: "Email Delivery Pipeline",
      description:
        "SendGrid primary delivery with template selection priority: DB system template → built-in template (emailTemplates.ts). Idempotency check prevents duplicate sends. Alert emails include metric tables with highlighted triggered values. Click tracking disabled for security.",
      icon: Globe,
      color: "orange",
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

      // Helper: Animate a section (icon spring + title slide + subtitle fade + content 3D lift)
      const animateSection = (
        ref: React.RefObject<HTMLDivElement | null>,
        contentPerspective = 1200,
        contentDuration = 1.2
      ) => {
        if (!ref.current) return;
        const sectionIcon = ref.current.querySelector(".section-icon");
        const sectionTitle = ref.current.querySelector(".section-title");
        const sectionSubtitle = ref.current.querySelector(".section-subtitle");
        const sectionContent = ref.current.querySelector(".section-content");

        if (sectionIcon) {
          gsap.set(sectionIcon, { scale: 0, rotation: -180 });
          gsap.to(sectionIcon, {
            scale: 1,
            rotation: 0,
            duration: 1,
            ease: "elastic.out(1, 0.4)",
            scrollTrigger: {
              trigger: ref.current,
              start: "top 80%",
              toggleActions: "play reverse play reverse",
            },
          });
        }

        if (sectionTitle) {
          gsap.set(sectionTitle, { opacity: 0, x: -60, filter: "blur(8px)" });
          gsap.to(sectionTitle, {
            opacity: 1,
            x: 0,
            filter: "blur(0px)",
            duration: 0.8,
            ease: "power3.out",
            scrollTrigger: {
              trigger: ref.current,
              start: "top 78%",
              toggleActions: "play reverse play reverse",
            },
          });
        }

        if (sectionSubtitle) {
          gsap.set(sectionSubtitle, { opacity: 0, y: 20 });
          gsap.to(sectionSubtitle, {
            opacity: 1,
            y: 0,
            duration: 0.6,
            ease: "power2.out",
            scrollTrigger: {
              trigger: ref.current,
              start: "top 76%",
              toggleActions: "play reverse play reverse",
            },
          });
        }

        if (sectionContent) {
          gsap.set(sectionContent, {
            opacity: 0,
            y: 80,
            scale: 0.9,
            rotateX: 20,
            transformPerspective: contentPerspective,
            transformOrigin: "center top",
          });
          gsap.to(sectionContent, {
            opacity: 1,
            y: 0,
            scale: 1,
            rotateX: 0,
            duration: contentDuration,
            ease: "power3.out",
            scrollTrigger: {
              trigger: ref.current,
              start: "top 70%",
              toggleActions: "play reverse play reverse",
            },
          });
        }
      };

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

          // ─── Sections: Reusable animation pattern ───
          animateSection(techStackRef);
          animateSection(aiSystemsRef, 1400, 1.4);
          animateSection(dataPipelineRef, 1400, 1.4);
          animateSection(databaseRef, 1500, 1.5);
          animateSection(integrationsRef, 1400, 1.4);
          animateSection(featuresRef, 1500, 1.5);
          animateSection(authRef, 1400, 1.4);
          animateSection(deploymentRef, 1400, 1.4);

          // ─── Summary: Cinematic card entrance ───
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
          aiSystemsRef.current,
          dataPipelineRef.current,
          databaseRef.current,
          integrationsRef.current,
          featuresRef.current,
          authRef.current,
          deploymentRef.current,
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
          aiSystemsRef.current,
          dataPipelineRef.current,
          databaseRef.current,
          integrationsRef.current,
          featuresRef.current,
          authRef.current,
          deploymentRef.current,
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

  // ─────────────────────────────────────────────────────────────────────────────
  // MEMOIZED UI DATA
  // ─────────────────────────────────────────────────────────────────────────────

  // Helper to build AccordionTab items from category data
  const buildAccordionItems = (
    data: Array<{
      category: string;
      items: Array<{ name: string; description: string }>;
      icon: React.ComponentType<{ className?: string }>;
      color: string;
    }>
  ): AccordionTabItem[] =>
    data.map((group) => {
      const Icon = group.icon;
      return {
        id: group.category,
        label: group.category,
        icon: <Icon className="w-4 h-4" />,
        color: group.color,
        badge: group.items.length,
        content: (
          <div className="space-y-3">
            {group.items.map((item, idx) => (
              <div
                key={idx}
                style={{
                  animation: `slideInLeft 0.4s ease-out ${idx * 0.05}s both`,
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
    });

  // Helper to build InteractiveGrid items from feature data
  const buildGridItems = (
    data: Array<{
      title: string;
      description: string;
      icon: React.ComponentType<{ className?: string }>;
      color: string;
    }>
  ): InteractiveGridItem[] =>
    data.map((feature) => {
      const Icon = feature.icon;
      return {
        id: feature.title,
        title: feature.title,
        description: feature.description,
        icon: <Icon className="w-6 h-6" />,
        color: feature.color,
      };
    });

  const aiSystemsAccordion = useMemo(() => buildAccordionItems(aiSystems), [aiSystems]);
  const dataPipelineAccordion = useMemo(() => buildAccordionItems(dataPipeline), [dataPipeline]);
  const integrationsAccordion = useMemo(() => buildAccordionItems(integrations), [integrations]);
  const databaseGrid = useMemo(() => buildGridItems(databaseFeatures), [databaseFeatures]);
  const featuresGrid = useMemo(() => buildGridItems(features), [features]);
  const authGrid = useMemo(() => buildGridItems(authFeatures), [authFeatures]);
  const deploymentGrid = useMemo(() => buildGridItems(deploymentFeatures), [deploymentFeatures]);

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
                title: "MarketJD - Enterprise SaaS Platform",
                description:
                  "Full-stack enterprise SaaS platform for SEO, PPC campaigns, multi-channel leads, and AI-powered call evaluation across 80+ law firm clients.",
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
                Enterprise SaaS Platform • 80+ Law Firm Clients
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
            A full-stack enterprise SaaS platform built from scratch for managing
            SEO, PPC campaigns, multi-channel leads, and AI-powered call
            evaluation across 80+ law firm clients. Built with Next.js 14 (App
            Router), MySQL via Prisma ORM (100 models, 202 migrations), Redux
            Toolkit, Ant Design + Tailwind CSS, and Docker for deployment.
            Features 272 API handlers, 18 background cron jobs, and 20+
            third-party API integrations.
          </p>
        </div>

        {/* ════════════════════════════════════════════════════════════════════
            SECTION 1: Technology Stack — LogoLoop
        ════════════════════════════════════════════════════════════════════ */}
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
              Next.js 14 • TypeScript • Prisma ORM • MySQL • Redux • Docker • OpenAI
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

        {/* ════════════════════════════════════════════════════════════════════
            SECTION 2: AI/ML Systems — AccordionTabs
        ════════════════════════════════════════════════════════════════════ */}
        <div ref={aiSystemsRef} className="mb-16 relative">
          <div className="mb-6 section-header">
            <div className="mb-2 flex items-center gap-2">
              <div className="section-icon">
                <Brain className="w-8 h-8 text-primary" />
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold section-title">
                AI/ML Systems
              </h2>
            </div>
            <p className="text-muted-foreground section-subtitle">
              OpenAI GPT-4o evaluation pipeline, AssemblyAI transcription with 3-tier speaker diarization, and per-client fine-tuning
            </p>
          </div>
          <div className="section-content">
            <AccordionTabs
              items={aiSystemsAccordion}
              defaultActiveId={aiSystemsAccordion[0]?.id}
              orientation="horizontal"
              className="w-full"
            />
          </div>
        </div>

        {/* ════════════════════════════════════════════════════════════════════
            SECTION 3: Data Pipeline Architecture — AccordionTabs
        ════════════════════════════════════════════════════════════════════ */}
        <div ref={dataPipelineRef} className="mb-16 relative">
          <div className="mb-6 section-header">
            <div className="mb-2 flex items-center gap-2">
              <div className="section-icon">
                <Server className="w-8 h-8 text-primary" />
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold section-title">
                Data Pipeline Architecture
              </h2>
            </div>
            <p className="text-muted-foreground section-subtitle">
              18 automated cron jobs — CallRail, Facebook Ads, CRM sync, investor attribution, and multi-channel analytics
            </p>
          </div>
          <div className="section-content">
            <AccordionTabs
              items={dataPipelineAccordion}
              defaultActiveId={dataPipelineAccordion[0]?.id}
              orientation="horizontal"
              className="w-full"
            />
          </div>
        </div>

        {/* ════════════════════════════════════════════════════════════════════
            SECTION 4: Database Architecture — InteractiveGrid
        ════════════════════════════════════════════════════════════════════ */}
        <div ref={databaseRef} className="mb-16 relative">
          <div className="mb-6 section-header">
            <div className="mb-2 flex items-center gap-2">
              <div className="section-icon">
                <Database className="w-8 h-8 text-primary" />
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold section-title">
                Database Architecture
              </h2>
            </div>
            <p className="text-muted-foreground section-subtitle">
              100 Prisma models, 2,400-line schema, 202 migrations — polymorphic leads, 3-level RBAC, 40+ JSON fields
            </p>
          </div>
          <div className="section-content">
            <InteractiveGrid
              items={databaseGrid}
              columns={2}
              enableHoverEffects={true}
              enableParticles={true}
              enableLightRays={true}
              className="w-full"
            />
          </div>
        </div>

        {/* ════════════════════════════════════════════════════════════════════
            SECTION 5: Third-Party Integrations — AccordionTabs
        ════════════════════════════════════════════════════════════════════ */}
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
              20+ seamless API integrations — analytics, advertising, CRM, AI, and automation
            </p>
          </div>
          <div className="section-content">
            <AccordionTabs
              items={integrationsAccordion}
              defaultActiveId={integrationsAccordion[0]?.id}
              orientation="horizontal"
              className="w-full"
            />
          </div>
        </div>

        {/* ════════════════════════════════════════════════════════════════════
            SECTION 6: Frontend Features & UX — InteractiveGrid
        ════════════════════════════════════════════════════════════════════ */}
        <div ref={featuresRef} className="mb-16 relative">
          <div className="mb-6 section-header">
            <div className="mb-2 flex items-center gap-2">
              <div className="section-icon">
                <Zap className="w-8 h-8 text-primary" />
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold section-title">
                Frontend Features & UX
              </h2>
            </div>
            <p className="text-muted-foreground section-subtitle">
              Cross-page filter sync, fuzzy search engine, drag-and-drop, custom audio player, and dashboard builder
            </p>
          </div>
          <div className="section-content">
            <InteractiveGrid
              items={featuresGrid}
              columns={2}
              enableHoverEffects={true}
              enableParticles={true}
              enableLightRays={true}
              className="w-full"
            />
          </div>
        </div>

        {/* ════════════════════════════════════════════════════════════════════
            SECTION 7: Auth & Security — InteractiveGrid
        ════════════════════════════════════════════════════════════════════ */}
        <div ref={authRef} className="mb-16 relative">
          <div className="mb-6 section-header">
            <div className="mb-2 flex items-center gap-2">
              <div className="section-icon">
                <Suspense fallback={<Lock className="w-8 h-8 text-primary" />}>
                  <Shield className="w-8 h-8 text-primary" />
                </Suspense>
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold section-title">
                Authentication & Security
              </h2>
            </div>
            <p className="text-muted-foreground section-subtitle">
              NextAuth.js v4 with 3 user types, Google Ads OAuth2, selective route protection, and secure record sharing
            </p>
          </div>
          <div className="section-content">
            <InteractiveGrid
              items={authGrid}
              columns={2}
              enableHoverEffects={true}
              enableParticles={true}
              enableLightRays={true}
              className="w-full"
            />
          </div>
        </div>

        {/* ════════════════════════════════════════════════════════════════════
            SECTION 8: Deployment & Infrastructure — InteractiveGrid
        ════════════════════════════════════════════════════════════════════ */}
        <div ref={deploymentRef} className="mb-16 relative">
          <div className="mb-6 section-header">
            <div className="mb-2 flex items-center gap-2">
              <div className="section-icon">
                <Cloud className="w-8 h-8 text-primary" />
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold section-title">
                Deployment & Infrastructure
              </h2>
            </div>
            <p className="text-muted-foreground section-subtitle">
              Docker multi-stage build, health probes for zero-downtime, event-driven alerts, and SendGrid email pipeline
            </p>
          </div>
          <div className="section-content">
            <InteractiveGrid
              items={deploymentGrid}
              columns={2}
              enableHoverEffects={true}
              enableParticles={true}
              enableLightRays={true}
              className="w-full"
            />
          </div>
        </div>

        {/* ════════════════════════════════════════════════════════════════════
            SECTION 9: Project Summary — Card
        ════════════════════════════════════════════════════════════════════ */}
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
                Full-stack enterprise SaaS platform — SEO, PPC, multi-channel leads & AI-powered call evaluation
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
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
                    Clients
                  </h3>
                  <p className="text-foreground font-medium text-lg mb-1">
                    80+ Law Firms
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Multi-tenant data isolation
                  </p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    <Badge variant="info" size="sm">
                      20+ Integrations
                    </Badge>
                    <Badge variant="outline" size="sm">
                      3-Level RBAC
                    </Badge>
                  </div>
                </div>
                <div className="p-4 rounded-lg bg-background/50 backdrop-blur-sm border border-border/50 hover:border-primary/50 transition-all duration-300 hover:shadow-lg summary-card">
                  <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                    <div
                      className="w-2 h-2 rounded-full bg-primary animate-pulse"
                      style={{ animationDelay: "0.3s" }}
                    />
                    Duration
                  </h3>
                  <p className="text-foreground font-medium text-lg mb-1">
                    2+ Years
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Continuous development & maintenance
                  </p>
                  <div className="mt-3 flex flex-wrap gap-2">
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
