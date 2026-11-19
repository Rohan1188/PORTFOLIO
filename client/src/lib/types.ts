export type SkillItem = { name: string; level: number };
export type SkillGroup = { group: string; items: SkillItem[] };

export type Experience = {
  company: string;
  role: string;
  location: string;
  start: string;
  end: string;
  points: string[];
  tech: string[];
};

export type Education = {
  degree: string;
  institution: string;
  location: string;
  year: string;
  coursework: string;
  achievement: string;
};

export type Project = {
  image?: string;
  slug?: string;
  name: string;
  category: string;
  desc: string;
  long: string;
  tech: string[];
  github: string;
  demo: string;
};

export type ServiceItem = { title: string; desc: string };

export type Certification = {
  title: string;
  org: string;
  date: string;
  id: string;
  link: string;
};

export type BlogPost = {
  slug?: string;
  title: string;
  category: string;
  date: string;
  readTime: string;
  tags: string[];
  desc: string;
};

export type SiteConfig = {
  name: string;
  role: string;
  location: string;
  email: string;
  phone: string;
  roles: string[];
  cvUrl: string;
  bio: string[];
  heroIntro: string;
  footerBlurb: string;
  profileImage: string;
  profileCutout: string;
  footerTagline: string;
  heroBg: string;
  aboutHeadline: string;
  mission: string;
  vision: string;
  values: string[];
  showSkillLevels: boolean;
  homepage: Record<string, boolean>;
  theme: Record<string, any>;
  animation: Record<string, boolean>;
  loaded: boolean;
  githubUsername: string;
  socials: {
    github: string;
    linkedin: string;
    email: string;
  };
  skills: SkillGroup[];
  experience: Experience[];
  education: Education[];
  projects: Project[];
  projectCategories: string[];
  services: ServiceItem[];
  certs: Certification[];
  blog: BlogPost[];
  stats: { label: string; value: number; suffix?: string }[];
};
