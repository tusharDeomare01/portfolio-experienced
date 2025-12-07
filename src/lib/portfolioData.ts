/**
 * PORTFOLIO DATA FOR AI ASSISTANT
 *
 * Fill in all your information below. This data will be used by the AI Assistant
 * to answer questions about you, your experience, projects, and skills.
 *
 * Update this file with your actual information and the AI will use it to respond accurately.
 */

export interface PortfolioData {
  personalInfo: {
    name: string;
    pronouns?: string; // e.g., "She/Her", "He/Him", "They/Them"
    title: string;
    bio: string;
    email?: string;
    location?: string;
    website?: string;
    linkedin?: string;
    github?: string;
  };
  education: Array<{
    degree: string;
    institution: string;
    period: string; // e.g., "2016 - 2018"
    specialization?: string;
    achievements?: string[];
    description?: string;
    link?: string;
  }>;
  career: Array<{
    title: string;
    company: string;
    period: string; // e.g., "2024 - Present"
    description: string;
    achievements?: string[];
    technologies?: string[];
  }>;
  projects: Array<{
    name: string;
    period: string; // e.g., "2022 - Present"
    description: string;
    technologies?: string[];
    features?: string[];
    achievements?: string[];
    link?: string;
  }>;
  technicalSkills: {
    frontend?: Array<{ name: string; level?: number }>; // level: 0-100
    backend?: Array<{ name: string; level?: number }>;
    database?: Array<{ name: string; level?: number }>;
    cloud?: Array<{ name: string; level?: number }>;
    devops?: Array<{ name: string; level?: number }>;
    tools?: Array<{ name: string; level?: number }>;
    languages?: Array<{ name: string; level?: number }>;
  };
  softSkills: string[];
  certifications?: Array<{
    name: string;
    issuer: string;
    date?: string;
  }>;
  languages?: Array<{
    language: string;
    proficiency: string; // e.g., "Native", "Fluent", "Intermediate"
  }>;
}

// ============================================================================
// FILL IN YOUR INFORMATION BELOW
// ============================================================================

export const portfolioData: PortfolioData = {
  personalInfo: {
    name: "Tushar Narayan Deomare",
    pronouns: "He/him",
    title: "Full-Stack Developer",
    bio: "Passionate Full-Stack Developer with 2+ years of expertise building scalable web applications using MERN Stack, Next.js, and NestJS. Specialized in developing enterprise-grade solutions with advanced authentication, real-time analytics, and AI-powered automation. Proven track record of delivering high-performance applications with 20+ third-party API integrations, dynamic reporting systems, and seamless user experiences. Recognized as 'Above and Beyond Developer' and selected for Tech Star Team at Thinkitive Technologies.",
    email: "tdeomare1@gmail.com",
    location: "Pandharpur",
    // website: "https://yourwebsite.com",
    // linkedin: "https://linkedin.com/in/yourprofile",
    // github: "https://github.com/yourusername",
  },

  education: [
    {
      degree: "B.TECH in Mechanical Engineering",
      institution: "Government College of Engineering, Karad",
      period: "2018 - 2022",
      specialization:
        "Mechanical Engineering with focus on Industrial Automation and CAD/CAM",
      // description: "Completed Bachelor's degree in Mechanical Engineering with strong foundation in engineering principles, design, and manufacturing processes. Developed expertise in computer-aided design, automation systems, and engineering problem-solving.",
      // achievements: [
      //   "Completed comprehensive coursework in Mechanical Engineering fundamentals",
      //   "Gained hands-on experience in CAD/CAM software and industrial automation",
      //   "Developed strong analytical and problem-solving skills applicable to software development",
      //   "Participated in technical projects and engineering workshops",
      // ],
      link: "https://gcekarad.ac.in/",
    },
    {
      degree: "HSC",
      institution: "K.B.P. Junior College, Pandharpur",
      period: "2017 - 2018",
      // description: "Completed Higher Secondary Certificate with focus on Science and Mathematics. Built strong foundation in logical reasoning, problem-solving, and analytical thinking that later transitioned into software development career.",
      // achievements: [
      //   "Completed Higher Secondary education with focus on Science stream",
      //   "Developed strong foundation in Mathematics and Physics",
      //   "Gained analytical thinking and problem-solving skills",
      // ],
      link: "https://www.kbpm.ac.in/",
    },
  ],

  career: [
    {
      title: "Software Engineer - E2",
      company: "Thinkitive Technologies Private Limited",
      period: "Jan 2025 - Jan 2026",
      description:
        "Working on enterprise-level applications, focusing on scalable web solutions and advanced React development. Contributing to complex projects with emphasis on code quality, performance optimization, and best practices.",
      achievements: [
        "Awarded as Above and Beyond developer",
        "Selected in Tech Star Team of Thinkitive",
      ],
      technologies: [
        "Next.js",
        "React",
        "TypeScript",
        "JavaScript",
        "Node.js",
        "Express.js",
        "REST API",
      ],
    },
    {
      title: "Software Engineer - E1",
      company: "Thinkitive Technologies Private Limited",
      period: "July 2024 - Jan 2025",
      description:
        "Developed and maintained full-stack web applications using modern JavaScript frameworks. Collaborated with cross-functional teams to deliver high-quality software solutions. Gained expertise in building responsive user interfaces and robust backend services.",
      achievements: [
        "Awarded as Above and Beyond developer",
        "Selected in Tech Star Team of Thinkitive",
      ],
      technologies: [
        "Next.js",
        "React",
        "TypeScript",
        "JavaScript",
        "Node.js",
        "Express.js",
        "REST API",
      ],
    },
    {
      title: "Software Engineer Trainee",
      company: "Thinkitive Technologies Private Limited",
      period: "Jan 2024 - July 2024",
      description:
        "Completed comprehensive training on MERN stack development. Successfully onboarded to live projects, learning industry best practices, version control, and collaborative development workflows. Built foundational skills in full-stack web development.",
      technologies: [
        "HTML",
        "CSS",
        "JavaScript",
        "TypeScript",
        "React.js",
        "Node.js",
        "Express.js",
        "MongoDB",
      ],
    },
    {
      title: "IT Trainee",
      company: "eHealthSystem Healthcare Ltd.",
      period: "Aug 2023 - Oct 2023",
      description:
        "Worked with a small team of 15 employees on healthcare application development. Converted Figma designs into static web pages using HTML, CSS, and JavaScript. Developed React.js applications with static data for pitching healthcare solutions to Government authorities. Created wireframes for various healthcare applications.",
      technologies: ["HTML", "CSS", "JavaScript", "React.js", "Figma"],
    },
    {
      title: "Program Analyst Trainee - Intern",
      company: "Cognizant",
      period: "Nov 2022 - Jun 2023",
      description:
        "Learned software testing fundamentals including Agile methodology, W model, and V model. Gained hands-on experience in smoke testing and regression testing. Developed understanding of software development lifecycle and quality assurance processes.",
      technologies: [
        "Software Testing",
        "Agile Methodology",
        "Smoke Testing",
        "Regression Testing",
      ],
    },
    // {
    //   title: "Lead Full-Stack Developer",
    //   company: "Skyline Interactive",
    //   period: "2016 - 2020",
    //   description: "Spearheaded the creation of immersive web applications using React, GraphQL, and Node.js for high-profile clients. Reduced application load times by 70% through advanced performance optimization. Introduced component-driven workflows that became the company's standard practice.",
    //   achievements: [
    //     "Reduced application load times by 70%",
    //     "Introduced component-driven workflows",
    //   ],
    //   technologies: ["React", "GraphQL", "Node.js", "Performance Optimization"],
    // },
    // {
    //   title: "Senior UI/UX Designer",
    //   company: "PixelForge Studios",
    //   period: "2012 - 2016",
    //   description: "Designed award-winning digital experiences for global brands, winning multiple Awwwards and Webby Awards. Championed user-centered design by integrating continuous feedback loops into every sprint. Collaborated with cross-functional teams to unify visual and interaction design.",
    //   achievements: [
    //     "Won multiple Awwwards and Webby Awards",
    //     "Championed user-centered design",
    //   ],
    //   technologies: ["UI/UX Design", "Design Systems", "User Research"],
    // },
    // {
    //   title: "Frontend Developer & Interaction Designer",
    //   company: "CreativeSpark Agency",
    //   period: "2008 - 2012",
    //   description: "Built responsive and interactive marketing websites during the rise of mobile-first design. Created high-conversion landing pages for major e-commerce campaigns. Developed custom animations that improved user engagement metrics by over 45%.",
    //   achievements: [
    //     "Improved user engagement metrics by over 45%",
    //   ],
    //   technologies: ["Frontend Development", "Responsive Design", "Animation"],
    // },
  ],

  projects: [
    {
      name: "MarketJD",
      period: "2024 - Present",
      description:
        "Comprehensive SEO insights and analytics platform with 20+ third-party API integrations, advanced authentication, dynamic reporting, and AI-powered automation. Built with Next.js 14, TypeScript, Prisma, and modern best practices for enterprise-scale applications.",
      technologies: [
        "Next.js",
        "TypeScript",
        "React",
        "Prisma",
        "Redux Toolkit + Persist",
        "Next-Auth",
        "Tailwind CSS",
        "Ant Design",
        "NextUI",
        "Chart.js",
      ],
      features: [
        "20+ third-party API integrations",
        "Advanced authentication (Next-Auth, OAuth2.0)",
        "AI-powered automation",
        "Drag & drop dashboard builder",
        "Dynamic reporting engine",
        "8+ automated cron jobs",
      ],
      achievements: [
        "SEO Admin Portal for enterprise clients",
        "Handles large-scale data processing",
        "Real-time analytics and reporting",
      ],
    },
    {
      name: "TechShowcase",
      period: "2025 - Present",
      description:
        "My small step which showcase my work, my expertise and my interests.",
      technologies: ["NextJS", "OpenAI", "ReactJS", "Redux"],
    },
    // {
    //   name: "AI-Powered Design Automation Platform",
    //   period: "2024",
    //   description:
    //     "AI-driven platform that automates design workflows for global e-commerce brands.",
    //   technologies: ["AI/ML", "Design Automation", "E-commerce"],
    // },
    // {
    //   name: "Enterprise Resource Planning (ERP) System",
    //   period: "2023",
    //   description: "Modular ERP system for manufacturing conglomerate.",
    //   technologies: ["ERP", "Manufacturing", "Enterprise Software"],
    // },
    // {
    //   name: "Blockchain-Based Supply Chain Tracker",
    //   period: "2022",
    //   description:
    //     "Transparent and tamper-proof supply chain tracking system using Hyperledger Fabric.",
    //   technologies: ["Blockchain", "Hyperledger Fabric", "Supply Chain"],
    // },
    // {
    //   name: "Global E-Learning Platform",
    //   period: "2021",
    //   description: "Comprehensive e-learning platform for global education.",
    //   technologies: ["E-Learning", "Education Technology"],
    // },
  ],

  technicalSkills: {
    frontend: [
      { name: "React.js / Next.js", level: 91 },
      { name: "TypeScript & JavaScript", level: 90 },
      { name: "HTML/CSS", level: 92 },
      { name: "Tailwind CSS", level: 88 },
    ],
    backend: [
      { name: "Node.js / Express", level: 90 },
      { name: "REST API", level: 92 },
      { name: "GraphQL", level: 85 },
    ],
    database: [
      { name: "MongoDB", level: 88 },
      { name: "PostgreSQL", level: 88 },
      { name: "MySQL", level: 85 },
      { name: "Prisma", level: 90 },
    ],
    cloud: [{ name: "AWS", level: 85 }],
    devops: [
      { name: "Docker", level: 80 },
      { name: "CI/CD", level: 85 },
    ],
    tools: [
      { name: "Git/GitHub", level: 95 },
      { name: "Jira", level: 90 },
    ],
    languages: [
      { name: "JavaScript", level: 95 },
      { name: "TypeScript", level: 92 },
    ],
  },

  softSkills: [
    "Leadership",
    "Problem Solving",
    "Agile Methodologies",
    "Mentorship",
    "Strategic Thinking",
    "Cross-Team Collaboration",
    "Communication",
    "Team Management",
  ],

  // certifications: [
  //   {
  //     name: "AWS Certified Solutions Architect",
  //     issuer: "Amazon Web Services",
  //     date: "2023",
  //   },
  // ],

  // languages: [
  //   {
  //     language: "English",
  //     proficiency: "Native",
  //   },
  //   {
  //     language: "Spanish",
  //     proficiency: "Fluent",
  //   },
  // ],
};
