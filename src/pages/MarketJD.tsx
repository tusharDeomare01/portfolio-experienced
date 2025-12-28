import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAppSelector } from "@/store/hooks";
import {
  ArrowLeft,
  Code,
  Database,
  Shield,
  Zap,
  Globe,
  BarChart3,
  Settings,
  Mail,
  Key,
  Layers,
  Package,
  Webhook,
  Brain,
  FileText,
  TrendingUp,
  Activity,
  MessageSquare,
  Calendar,
  Cpu,
} from "lucide-react";
import ScrollReveal from "@/components/lightswind/scroll-reveal";
import { Badge } from "@/components/lightswind/badge";
import { ShareButton } from "@/components/Share";
import { getCurrentUrl } from "@/lib/shareUtils";
// import { BackgroundSkeleton } from "@/components/Loading/LoadingComponents";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/lightswind/card";

// const RaysBackground = lazy(
//   () => import("../components/lightswind/rays-background")
// );
// const FallBeamBackground = lazy(
//   () => import("../components/lightswind/fall-beam-background")
// );

const MarketJD = () => {
  const navigate = useNavigate();
  const theme = useAppSelector((state) => state.theme.theme);
  const isDarkMode = theme === "dark";

  // Updated tech stack based on actual package.json
  const techStack = {
    framework: {
      name: "Next.js 14.2.10",
      description:
        "React framework with App Router, Server Components, and API Routes",
      icon: Code,
    },
    language: {
      name: "TypeScript 5.1.6",
      description: "Type-safe JavaScript for better developer experience",
      icon: Code,
    },
    ui: {
      name: "React 18.3.1",
      description: "Modern React with concurrent features and hooks",
      icon: Layers,
    },
    database: {
      name: "Prisma 6.11.1",
      description: "Next-generation ORM with type-safe database access",
      icon: Database,
    },
    stateManagement: {
      name: "Redux Toolkit + Persist",
      description: "Predictable state container with persistence layer",
      icon: Package,
    },
    auth: {
      name: "Next-Auth 4.24.7",
      description: "Complete authentication solution for Next.js",
      icon: Shield,
    },
    styling: {
      name: "Tailwind CSS 3.3.2",
      description: "Utility-first CSS framework for rapid UI development",
      icon: Layers,
    },
    uiLibraries: {
      name: "Ant Design + NextUI",
      description: "Enterprise-grade UI component libraries",
      icon: Package,
    },
    charts: {
      name: "Chart.js 4.3.3",
      description: "Powerful charting library for data visualization",
      icon: BarChart3,
    },
  };

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
        "Comprehensive dashboard aggregating data from 20+ third-party APIs without performance degradation. Features real-time data synchronization, caching strategies, and optimized rendering using React Window for large datasets.",
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

  const colorMap: Record<string, { bg: string; text: string }> = {
    blue: { bg: "bg-blue-500/10", text: "text-blue-500" },
    purple: { bg: "bg-purple-500/10", text: "text-purple-500" },
    green: { bg: "bg-green-500/10", text: "text-green-500" },
    orange: { bg: "bg-orange-500/10", text: "text-orange-500" },
    pink: { bg: "bg-pink-500/10", text: "text-pink-500" },
    teal: { bg: "bg-teal-500/10", text: "text-teal-500" },
    yellow: { bg: "bg-yellow-500/10", text: "text-yellow-500" },
    red: { bg: "bg-red-500/10", text: "text-red-500" },
  };

  return (
    <div className="min-h-screen bg-transparent relative">
      {/* <FallBeamBackground className="fixed z-1" beamCount={3} /> */}
      {/* <Suspense fallback={<BackgroundSkeleton />}>
        <RaysBackground className="fixed z-0" />
      </Suspense> */}

      <div className="relative z-10 max-w-7xl mx-auto px-4 py-8 md:py-12">
        {/* Back Button and Share */}
        <div className="mb-8 flex items-center justify-between flex-wrap gap-3 sm:gap-4">
          <button
            onClick={() => navigate(-1)}
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
                "Comprehensive SEO insights and analytics platform with 20+ third-party API integrations, advanced authentication, dynamic reporting, and AI-powered automation.",
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
                enableBlur={false}
                baseOpacity={0.1}
                baseRotation={0}
                blurStrength={0}
              >
                MarketJD
              </ScrollReveal>
              <ScrollReveal
                size="md"
                align="left"
                variant="muted"
                enableBlur={false}
                containerClassName="mb-2"
                blurStrength={0}
                baseRotation={0}
                baseOpacity={0.1}
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
            enableBlur={false}
            containerClassName="max-w-4xl"
            blurStrength={0}
            baseRotation={0}
            baseOpacity={0.1}
          >
            A comprehensive SEO insights and analytics platform with 20+
            third-party API integrations, advanced authentication, dynamic
            reporting, and AI-powered automation. Built with Next.js 14,
            TypeScript, Prisma, and modern best practices for enterprise-scale
            applications.
          </ScrollReveal>
        </div>

        {/* Tech Stack */}
        <div className="mb-16">
          <div className="mb-6">
            <div className="mb-2 flex items-center gap-2">
              <Cpu className="w-8 h-8 text-primary" />
              <ScrollReveal
                size="xl"
                align="left"
                variant="default"
                enableBlur={false}
                containerClassName="inline-block"
                blurStrength={0}
                baseRotation={0}
                baseOpacity={0.1}
              >
                Technology Stack
              </ScrollReveal>
            </div>
            <p className="text-lg font-bold">
              Modern, scalable technologies powering the platform
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {Object.entries(techStack).map(([key, tech]) => {
              const Icon = tech.icon;
              return (
                <div
                  key={key}
                  className="p-6 rounded-xl border bg-transparent backdrop-blur-xl hover:bg-background/80 transition-all duration-300 hover:shadow-lg"
                >
                  <div className="flex items-start gap-4">
                    <div className="p-3 rounded-lg bg-primary/10">
                      <Icon className="w-6 h-6 text-primary" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-foreground mb-1">
                        {tech.name}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {tech.description}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* API Integrations */}
        <div className="mb-16">
          <div className="mb-6">
            <div className="mb-2 flex items-center gap-2">
              <Webhook className="w-8 h-8 text-primary" />
              <ScrollReveal
                size="xl"
                align="left"
                variant="default"
                enableBlur={false}
                containerClassName="inline-block"
                blurStrength={0}
                baseRotation={0}
                baseOpacity={0.1}
              >
                Third-Party Integrations
              </ScrollReveal>
            </div>
            <p className="text-lg font-bold">
              10+ seamless API integrations for comprehensive data insights
            </p>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {integrations.map((integration, idx) => {
              const Icon = integration.icon;
              return (
                <div key={idx}>
                  <Card className="backdrop-blur-xl bg-transparent hover:bg-background/90 transition-all h-full">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-3">
                        <div
                          className={`p-2 rounded-lg ${
                            colorMap[integration.color]?.bg || "bg-primary/10"
                          }`}
                        >
                          <Icon
                            className={`w-6 h-6 ${
                              colorMap[integration.color]?.text ||
                              "text-primary"
                            }`}
                          />
                        </div>
                        {integration.category}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {integration.items.map((item, itemIdx) => (
                          <div
                            key={itemIdx}
                            className="p-3 rounded-lg bg-transparent border border-border/50"
                          >
                            <div className="flex items-start justify-between gap-2">
                              <div className="flex-1">
                                <h4 className="font-semibold text-sm text-foreground mb-1">
                                  {item.name}
                                </h4>
                                <p className="text-xs text-muted-foreground">
                                  {item.description}
                                </p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              );
            })}
          </div>
        </div>

        {/* Key Features */}
        <div className="mb-16">
          <div className="mb-6">
            <div className="mb-2 flex items-center gap-2">
              <Zap className="w-8 h-8 text-primary" />
              <ScrollReveal
                size="xl"
                align="left"
                variant="default"
                enableBlur={false}
                containerClassName="inline-block"
                blurStrength={0}
                baseRotation={0}
                baseOpacity={0.1}
              >
                Key Features & Capabilities
              </ScrollReveal>
            </div>
            <p className="text-lg font-bold">
              Major development achievements and platform capabilities
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {features.map((feature, idx) => {
              const Icon = feature.icon;
              return (
                <div key={idx} className="group">
                  <Card className="backdrop-blur-xl bg-transparent hover:bg-background/90 transition-all h-full border-2 hover:border-primary/50">
                    <CardHeader>
                      <div className="flex items-start gap-4">
                        <div
                          className={`p-3 rounded-xl ${
                            colorMap[feature.color]?.bg || "bg-primary/10"
                          } group-hover:scale-110 transition-transform`}
                        >
                          <Icon
                            className={`w-6 h-6 ${
                              colorMap[feature.color]?.text || "text-primary"
                            }`}
                          />
                        </div>
                        <div className="flex-1">
                          <CardTitle className="mb-2">
                            {feature.title}
                          </CardTitle>
                          <CardDescription className="text-sm leading-relaxed">
                            {feature.description}
                          </CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                  </Card>
                </div>
              );
            })}
          </div>
        </div>

        {/* Automation & Cron Jobs */}
        <div className="mb-16">
          <Card className="backdrop-blur-xl bg-transparent">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="w-6 h-6 text-primary" />
                Automated Background Jobs
              </CardTitle>
              <CardDescription>
                8+ cron jobs handling data synchronization and processing
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {cronJobs.map((job, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-lg border bg-transparent hover:bg-background/80 transition-colors"
                  >
                    <h4 className="font-semibold text-sm text-foreground mb-1">
                      {job.name}
                    </h4>
                    <p className="text-xs text-muted-foreground">
                      {job.description}
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Additional Technologies */}
        <div className="mb-16">
          <Card className="backdrop-blur-xl bg-transparent">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="w-6 h-6 text-primary" />
                Additional Technologies & Tools
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 ">
                {[
                  "Ant Design",
                  "NextUI",
                  "Chart.js",
                  "React DnD Kit",
                  "Formik",
                  "Yup",
                  "ExcelJS",
                  "html2pdf.js",
                  "Jodit Editor",
                  "React Window",
                  "React Grid Layout",
                  "SendGrid",
                  "Mailgun",
                  "Nodemailer",
                  "Moment.js",
                  "Day.js",
                  "Date-fns",
                  "Axios",
                  "Crypto-js",
                  "UUID",
                  "Howler.js",
                  "React Toastify",
                  "File Saver",
                ].map((tech, idx) => (
                  <Badge
                    key={idx}
                    variant="outline"
                    className="justify-center py-2 hover:bg-background/80"
                  >
                    {tech}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Project Summary */}
        <div className="mb-12">
          <Card className="backdrop-blur-xl hover:bg-background/80 bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20">
            <CardHeader>
              <CardTitle>Project Summary</CardTitle>
              <CardDescription>
                Comprehensive enterprise platform for SEO management
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <h3 className="font-semibold text-foreground mb-2">
                    Project Name
                  </h3>
                  <p className="text-muted-foreground">
                    MarketJD (SEO Admin Portal)
                  </p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Previously: InsightsJD
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-2">
                    Duration
                  </h3>
                  <p className="text-muted-foreground">2+ Years</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Continuous development & maintenance
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-2">Status</h3>
                  <Badge variant="success" size="lg">
                    Live & Active
                  </Badge>
                  <p className="text-sm text-muted-foreground mt-2">
                    Production environment
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
