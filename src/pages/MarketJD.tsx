import { useEffect, useMemo, lazy, Suspense } from "react";
import { useNavigate } from "react-router-dom";
import { useAppSelector } from "@/store/hooks";
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
  Calendar,
  Cpu,
} from "lucide-react";
import { ScrollReveal } from "@/components/reactBits/scrollReveal";
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
import { InteractiveGrid, type InteractiveGridItem } from "@/components/reactBits/interactiveGrid";
import { AccordionTabs, type AccordionTabItem } from "@/components/reactBits/accordionTabs";

// Lazy load react-bits components for better performance
const LightRays = lazy(() => import("@/components/reactBits/lightRays"));

// Lazy load heavy components
const Shield = lazy(() => import("lucide-react").then((mod) => ({ default: mod.Shield })));

const MarketJD = () => {
  const navigate = useNavigate();
  const theme = useAppSelector((state) => state.theme.theme);
  const isDarkMode = theme === "dark";

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

  const cronJobs = [
    {
      name: "Calls Cron",
      description: "Automated call tracking and analytics processing",
    },
    {
      name: "Contact Forms Cron",
      description: "Form submission processing and lead management",
    },
    {
      name: "Chats Cron",
      description: "Chat conversation data synchronization",
    },
    {
      name: "Off-Page SEO Cron",
      description: "Backlink monitoring and off-page SEO metrics",
    },
    {
      name: "Technical SEO Cron",
      description: "Technical SEO audits and monitoring",
    },
    {
      name: "Search Console Cron",
      description: "Search performance data aggregation",
    },
    { name: "MyCase Cron", description: "Legal case data synchronization" },
    {
      name: "Facebook Leads Cron",
      description: "Social media lead processing",
    },
  ];

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

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
                    animation: `slideInLeft 0.4s ease-out ${itemIdx * 0.05}s both`,
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
    <div className="min-h-screen bg-transparent relative">
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
        <div className="mb-8 flex items-center justify-between flex-wrap gap-3 sm:gap-4">
          <button
            onClick={(e) => {
              e.preventDefault();
              const splitUrl = window.location.href.split("#");
              if (splitUrl?.includes("home")) {
                navigate("/");
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

        {/* Hero Header */}
        <div className="mb-16">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-6 mb-6">
            <div className="p-4 rounded-2xl bg-transparent flex items-center justify-center min-w-[120px] h-[120px]">
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
              <ScrollReveal
                size="2xl"
                align="left"
                variant="default"
                animation="fadeUp"
                stagger={true}
                delay={0.1}
              >
                MarketJD
              </ScrollReveal>
              <ScrollReveal
                size="md"
                align="left"
                variant="muted"
                containerClassName="mb-2"
                animation="fadeUp"
                delay={0.2}
              >
                SEO Admin Portal • Enterprise Platform
              </ScrollReveal>
              <div className="flex flex-wrap gap-2 mt-4">
                <Badge variant="success" size="lg">
                  Live & Active
                </Badge>
                <Badge variant="info" size="lg">
                  2+ Years
                </Badge>
                <Badge variant="default" size="lg">
                  Production
                </Badge>
              </div>
            </div>
          </div>
          <ScrollReveal
            size="md"
            align="left"
            variant="muted"
            containerClassName="max-w-4xl"
            animation="fadeUp"
            delay={0.3}
          >
            A comprehensive SEO insights and analytics platform with 10+
            third-party API integrations, advanced authentication, dynamic
            reporting, and AI-powered automation. Built with Next.js 14,
            TypeScript, Prisma, and modern best practices for enterprise-scale
            applications.
          </ScrollReveal>
        </div>

        {/* Technology Stack - LogoLoop with Futuristic Background */}
        <div className="mb-16 relative">
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
          
          <div className="mb-6 relative z-10">
            <div className="mb-2 flex items-center gap-2">
              <Cpu className="w-8 h-8 text-primary" />
              <ScrollReveal
                size="xl"
                align="left"
                variant="default"
                containerClassName="inline-block"
                animation="slideLeft"
                delay={0.1}
              >
                Technology Stack
              </ScrollReveal>
            </div>
            <ScrollReveal
              size="md"
              align="left"
              variant="muted"
              animation="fadeUp"
              delay={0.2}
            >
              Modern, scalable technologies powering the platform
            </ScrollReveal>
          </div>
          <div className="relative py-8 px-4 rounded-2xl bg-transparent">
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
        <div className="mb-16 relative">
          <div className="mb-6">
            <div className="mb-2 flex items-center gap-2">
              <Webhook className="w-8 h-8 text-primary" />
              <ScrollReveal
                size="xl"
                align="left"
                variant="default"
                containerClassName="inline-block"
                animation="slideLeft"
                delay={0.1}
              >
                Third-Party Integrations
              </ScrollReveal>
            </div>
            <ScrollReveal
              size="md"
              align="left"
              variant="muted"
              animation="fadeUp"
              delay={0.2}
            >
              10+ seamless API integrations for comprehensive data insights
            </ScrollReveal>
          </div>
          <AccordionTabs
            items={accordionTabItems}
            defaultActiveId={accordionTabItems[0]?.id}
            orientation="horizontal"
            className="w-full"
          />
        </div>

        {/* Key Features & Capabilities - InteractiveGrid */}
        <div className="mb-16 relative">
          <div className="mb-6">
            <div className="mb-2 flex items-center gap-2">
              <Zap className="w-8 h-8 text-primary" />
              <ScrollReveal
                size="xl"
                align="left"
                variant="default"
                containerClassName="inline-block"
                animation="slideLeft"
                delay={0.1}
              >
                Key Features & Capabilities
              </ScrollReveal>
            </div>
            <ScrollReveal
              size="md"
              align="left"
              variant="muted"
              animation="fadeUp"
              delay={0.2}
            >
              Major development achievements and platform capabilities
            </ScrollReveal>
          </div>
          <InteractiveGrid
            items={interactiveGridItems}
            columns={2}
            enableHoverEffects={true}
            enableParticles={true}
            enableLightRays={true}
            className="w-full"
          />
        </div>

        {/* Automation & Cron Jobs - Enhanced */}
        <div className="mb-16 relative">
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
        </div>

        {/* Project Summary - Enhanced */}
        <div className="mb-12">
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
                <div
                  style={{
                    animation: `fadeInUp 0.6s ease-out 0s both`,
                  }}
                  className="p-4 rounded-lg bg-background/50 backdrop-blur-sm border border-border/50 hover:border-primary/50 transition-all duration-300 hover:shadow-lg"
                >
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
                <div
                  style={{
                    animation: `fadeInUp 0.6s ease-out 0.1s both`,
                  }}
                  className="p-4 rounded-lg bg-background/50 backdrop-blur-sm border border-border/50 hover:border-primary/50 transition-all duration-300 hover:shadow-lg"
                >
                  <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-primary animate-pulse" style={{ animationDelay: '0.2s' }} />
                    Duration
                  </h3>
                  <p className="text-foreground font-medium text-lg mb-1">
                    2+ Years
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Continuous development & maintenance
                  </p>
                  <div className="mt-3 flex gap-2">
                    <Badge variant="info" size="sm">Active Development</Badge>
                    <Badge variant="outline" size="sm">Ongoing</Badge>
                  </div>
                </div>
                <div
                  style={{
                    animation: `fadeInUp 0.6s ease-out 0.2s both`,
                  }}
                  className="p-4 rounded-lg bg-background/50 backdrop-blur-sm border border-border/50 hover:border-primary/50 transition-all duration-300 hover:shadow-lg"
                >
                  <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-primary animate-pulse" style={{ animationDelay: '0.4s' }} />
                    Status
                  </h3>
                  <Badge variant="success" size="lg" className="mb-3">
                    <span className="relative flex h-2 w-2 mr-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
                    </span>
                    Live & Active
                  </Badge>
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
