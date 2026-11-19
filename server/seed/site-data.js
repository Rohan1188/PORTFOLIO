// Generated from the original lib/data.ts. Used only by scripts/seed.js.


/**
 * SITE — the single place to edit every piece of content on the portfolio.
 * Update this object with your own details; no other file needs to change
 * for text/content updates.
 */
export const SITE = {
  name: "Rohan Kushwaha",
  role: "Manager at OS GROUP OF COMPANY, IT Head at NLCITS & Full-Stack Developer",
  location: "Nepal",
  email: "rohankushwaha1432@gmail.com",
  phone: "+977 9804230932",
  roles: [
    "IT Head & Manager at OS GROUP OF COMPANY.",
    "Full-Stack Developer.",
    "MERN Stack Developer.",
    "WordPress Developer.",
    "Python Developer.",
    "DevOps Engineer.",
    "AI/ML Enthusiast.",
  ],
  cvUrl: "/cv/rohan-kushwaha-cv.pdf",
  githubUsername: "Rohan1188",

  socials: {
    github: "https://github.com/Rohan1188",
    linkedin: "https://linkedin.com/in/rohan-kushwaha-393154279",
    email: "mailto:rohankushwaha1432@gmail.com",
  },

  stats: [
    { label: "Projects shipped", value: 14, suffix: "+" },
    { label: "Technologies", value: 15 },
    { label: "Certifications", value: 4 },
    { label: "Companies", value: 2 },
  ],

  skills: [
    {
      group: "Frontend",
      items: [
        { name: "HTML", level: 90 },
        { name: "CSS", level: 85 },
        { name: "JavaScript", level: 88 },
        { name: "React", level: 85 },
        { name: "WordPress", level: 82 },
      ],
    },
    {
      group: "Backend",
      items: [
        { name: "Node.js", level: 84 },
        { name: "Express.js", level: 82 },
        { name: "REST APIs", level: 85 },
        { name: "JWT Auth", level: 80 },
      ],
    },
    {
      group: "Database",
      items: [
        { name: "MongoDB", level: 82 },
        { name: "MySQL", level: 80 },
      ],
    },
    {
      group: "Programming Languages",
      items: [
        { name: "Java", level: 85 },
        { name: "Python", level: 83 },
        { name: "C", level: 75 },
        { name: "C# .NET", level: 70 },
        { name: "JavaScript", level: 88 },
      ],
    },
    {
      group: "Cloud & Systems",
      items: [
        { name: "AWS", level: 78 },
        { name: "Linux / Red Hat", level: 74 },
        { name: "Git & GitHub", level: 85 },
      ],
    },
    {
      group: "AI / ML",
      items: [
        { name: "Regression Modeling", level: 75 },
        { name: "Semantic Segmentation", level: 65 },
        { name: "Streamlit", level: 78 },
      ],
    },
  ],

  experience: [
    {
      company: "OS Group of Company",
      role: "Manager",
      location: "Nepal",
      start: "2026",
      end: "Present",
      points: [
        "Lead delivery of the OS Group CRM website end to end, from architecture through client rollout.",
        "Star Management Consultancy CRM handover and ongoing modifications, Leading Nepalliving Marketplace.",
        "Leading ZamZam Ridesharing App, and Many More and Coordinating between the client team and developers.",
        "Manage timelines and priorities across multiple concurrent client projects.",
        
      ],
      tech: ["React", "Node.js", "MongoDB", "Project Management"],
    },
    {
      company: "Nepal Living Connecting IT Solution (NLCITS)",
      role: "IT Head & Full-Stack Developer",
      location: "Nepal",
      start: "2025",
      end: "Present",
      points: [
        "Lead IT operations and development, working across MERN, WordPress, and Python stacks.",
        "Built and shipped the Old & New ZamZam websites, Nepal Living website, Relax Treatment website, an IT company website, Quick Jobs, and the SMCQA website.",
        "Delivered the ZamZam and Nepal Living mobile apps alongside the web platforms.",
        "Own deployment, hosting, and technical decisions for the company's full project portfolio.",
      ],
      tech: ["MERN", "WordPress", "Python", "MySQL", "AWS"],
    },
    {
      company: "AICTE - EduSkills",
      role: "Java Full-Stack Developer (Virtual Internship)",
      location: "Remote",
      start: "Jul 2025",
      end: "Sep 2025",
      points: [
        "Completed a 10-week virtual internship building end-to-end web applications with Java front-end and back-end technologies.",
        "Gained hands-on experience across the full software development lifecycle, from requirements to deployment.",
      ],
      tech: ["Java", "Spring", "SQL"],
    },
  ],

  education: [
    {
      degree: "B.Tech in Computer Science & Engineering",
      institution: "Kalinga Institute of Industrial Technology (KIIT)",
      location: "Bhubaneswar, Odisha, India",
      year: "2022 – 2026",
      coursework: "Data Structures, DBMS, Machine Learning, Web Technologies,etc.",
      achievement: "Batch 2022-2026, B.Tech in CSE",
    },
    {
      degree: "Higher Secondary School (Science)",
      institution: "National Infotech Secondary School",
      location: "Birgunj, Nepal",
      year: "2020 – 2022",
      coursework: "Physics, Chemistry, Mathematics, Computer Science",
      achievement: "Completed Higher Secondary, Science stream",
    },
  ],

  projectCategories: [
    "All",
    "Web Development",
    "Full Stack",
    "Mobile",
    "AI/ML",
    "Management Systems",
    "Other",
  ],

  projects: [
    {
      name: "OS Group CRM Website",
      category: "Management Systems",
      desc: "A CRM platform built for OS Group of Company to manage client and pipeline data.",
      long: "Led the build of OS Group's internal CRM from the ground up — data model, role-based access, and a dashboard for tracking client accounts and deals. Currently maintained and extended as the company's project list grows.",
      tech: ["React", "Node.js", "MongoDB"],
      github: "#",
      demo: "#",
    },
    {
      name: "Star Management Consultancy CRM Handover & Modifications",
      category: "Management Systems",
      desc: "Took over an existing CRM for a Qatar-based client and shipped ongoing feature modifications.",
      long: "Inherited an existing CRM codebase for a Qatar-based client, got up to speed on its architecture, and have been shipping modifications and fixes since — a good exercise in reading someone else's code carefully before changing it.",
      tech: ["MERN", "MySQL"],
      github: "#",
      demo: "#",
    },
    {
      name: " ZamZam Website",
      category: "Web Development",
      desc: "A full redesign and rebuild of the ZamZam website with a modern stack.",
      long: "Rebuilt ZamZam's web presence from scratch after the original site, addressing performance, mobile responsiveness, and content structure while keeping the migration smooth for the client's existing content.",
      tech: ["React", "WordPress", "MySQL"],
      github: "#",
      demo: "#",
    },
    {
      name: "Nepal Living Website",
      category: "Web Development",
      desc: "The main web platform for Nepal Living Connecting IT Solution.",
      long: "Built the company's own website — services, portfolio, and contact flows — as the front door for new client work alongside the internal app.",
      tech: ["React", "WordPress"],
      github: "#",
      demo: "#",
    },
    {
      name: "Relax Treatment Website",
      category: "Web Development",
      desc: "A booking-and-services website for a treatment/wellness business.",
      long: "Delivered a client-facing website for a treatment center, covering service listings, booking information, and a WordPress-based content workflow the client's team could manage themselves.",
      tech: ["WordPress", "CSS"],
      github: "#",
      demo: "#",
    },
    {
      name: "IT Company Website",
      category: "Web Development",
      desc: "A corporate website built for an IT services client.",
      long: "Designed and built a services-focused corporate website for an IT company client, with a component structure that made adding new service pages straightforward.",
      tech: ["React", "WordPress"],
      github: "#",
      demo: "#",
    },
    {
      name: "Quick Jobs",
      category: "Full Stack",
      desc: "A job-listing platform connecting employers and job seekers.",
      long: "Built a MERN-stack job board with employer postings, candidate applications, and search/filtering, aimed at making local hiring faster to navigate.",
      tech: ["MongoDB", "Express.js", "React", "Node.js"],
      github: "#",
      demo: "#",
    },
    {
      name: "SMCQA Website",
      category: "Web Development",
      desc: "A website built for the SMCQA organization.",
      long: "Delivered a full website build for SMCQA, covering information architecture, responsive layout, and content management setup.",
      tech: ["WordPress", "React"],
      github: "#",
      demo: "#",
    },
    {
      name: "ZamZam App",
      category: "Mobile",
      desc: "The mobile companion app for ZamZam, alongside the web platform.",
      long: "Extended ZamZam's presence to mobile, mirroring the core web experience and adding on-the-go conveniences for users.",
      tech: ["React Native", "REST APIs"],
      github: "#",
      demo: "#",
    },
    {
      name: "Nepal Living App",
      category: "Mobile",
      desc: "A mobile app extending Nepal Living Connecting IT Solution's services.",
      long: "Built a mobile app to extend NLCITS's services beyond the web, keeping the interface consistent with the company's website.",
      tech: ["React Native", "Node.js"],
      github: "#",
      demo: "#",
    },
    {
      name: "College Management System",
      category: "Full Stack",
      desc: "A full-stack college management system with role-based authentication.",
      long: "Developed a full-stack College Management System using the MERN stack with role-based authentication for Admin, Faculty, and Students — including student/faculty management, notices, timetable uploads, study materials, and secure JWT-based authentication.",
      tech: ["MongoDB", "Express.js", "React", "Node.js", "JWT"],
      github: "#",
      demo: "#",
    },
    {
      name: "AirWatch India",
      category: "AI/ML",
      desc: "Air Quality Index prediction and an interactive dashboard using machine learning.",
      long: "A machine-learning-based web application predicting Air Quality Index (AQI) using multiple regression models trained on pollutant data, with an interactive Streamlit dashboard for exploring forecasts.",
      tech: ["Python", "Streamlit", "scikit-learn"],
      github: "#",
      demo: "#",
    },
    {
      name: "Semantic Segmentation for Autonomous Driving",
      category: "AI/ML",
      desc: "Semantic segmentation on the CARLA simulation dataset for self-driving scenarios.",
      long: "Applied semantic segmentation techniques to the CARLA driving simulation dataset, training a model to detect and classify roads, vehicles, pedestrians, and other scene elements relevant to autonomous driving.",
      tech: ["Python", "PyTorch", "CARLA"],
      github: "#",
      demo: "#",
    },
  ],

  services: [
    { title: "Full-Stack Web Development", desc: "End-to-end MERN builds — from data model to a responsive, production-ready interface." },
    { title: "WordPress Development & Migration", desc: "Custom WordPress builds and migrations that keep content, SEO, and performance intact." },
    { title: "Python & Machine Learning Projects", desc: "Prediction models and data-driven dashboards, from regression to computer vision." },
    { title: "CRM & Business Management Systems", desc: "Internal tools and CRMs tailored to how a team actually works, with role-based access." },
    { title: "Java Enterprise Development", desc: "End-to-end Java applications, from front-end views to back-end services." },
    { title: "IT Management & Cloud Deployment", desc: "Hands-on IT leadership and AWS-based deployment for growing project portfolios." },
  ],

  certs: [
    { title: "AWS Academy Graduate — Cloud Architecting", org: "AWS Academy", date: "2025", id: "—", link: "#" },
    { title: "Red Hat System Administration I (RH124)", org: "Red Hat", date: "2025", id: "Ver. 9.3", link: "#" },
    { title: "OOP: Basics to Advance (Java OOP)", org: "Udemy", date: "2024", id: "—", link: "#" },
    { title: "Computer Network Fundamentals", org: "Udemy", date: "2024", id: "—", link: "#" },
  ],

  blog: [
    {
      title: "Building AirWatch India: predicting AQI with regression models",
      category: "AI/ML",
      date: "2026",
      readTime: "6 min",
      tags: ["python", "machine-learning"],
      desc: "How I turned pollutant data into a usable AQI forecast, and what I'd do differently with the regression pipeline next time.",
    },
    {
      title: "Semantic segmentation for self-driving cars, on a student setup",
      category: "AI/ML",
      date: "2026",
      readTime: "7 min",
      tags: ["carla", "computer-vision"],
      desc: "Notes on training a segmentation model against the CARLA dataset without a lab full of GPUs.",
    },
    {
      title: "What building a College Management System taught me about JWT auth",
      category: "Backend",
      date: "2025",
      readTime: "5 min",
      tags: ["mern", "jwt"],
      desc: "Role-based access sounds simple until you have three roles and one login form. Here's what actually worked.",
    },
    {
      title: "Migrating a legacy WordPress site without breaking client SEO",
      category: "WordPress",
      date: "2025",
      readTime: "6 min",
      tags: ["wordpress", "seo"],
      desc: "Lessons from rebuilding the ZamZam website while keeping the client's existing search rankings intact.",
    },
    {
      title: "Notes from a virtual internship: what actually transfers to real work",
      category: "Career",
      date: "2025",
      readTime: "4 min",
      tags: ["internship", "career"],
      desc: "What a 10-week Java full-stack internship prepared me for — and what only client work could teach.",
    },
    {
      title: "Handing over a CRM to a client team: what I'd do differently",
      category: "Management",
      date: "2025",
      readTime: "5 min",
      tags: ["crm", "handover"],
      desc: "Taking over the Qatar CRM taught me more about documentation than any of the code itself.",
    },
  ],
};

