export interface AboutContent {
  sectionLabel: string;
  headline: string;
  description: string;
  foundedYear: string;
  location: string;
  country: string;
}

export interface Stat {
  value: string;
  label: string;
}

export interface Project {
  id: number;
  title: string;
  description: string;
  type: "figma" | "live";
  link: string;
  tags: string[];
  color: string;
}

export interface ProjectsContent {
  sectionLabel: string;
  headline: string;
  subtitle: string;
  stats: Stat[];
  projects: Project[];
}

export interface Service {
  icon: string;
  title: string;
  description: string;
  href: string;
}

export interface ServicesContent {
  sectionLabel: string;
  title: string;
  subtitle: string;
  services: Service[];
}

export interface PrincipleContent {
  sectionLabel: string;
  title: string;
  number: string;
  bullets: string[];
}

export interface JourneyMilestone {
  year: string;
  title: string;
  description: string;
}

export interface JourneyContent {
  sectionLabel: string;
  title: string;
  subtitle: string;
  milestones: JourneyMilestone[];
}

export interface TeamMember {
  name: string;
  role: string;
  initials: string;
  linkedIn: string;
  bio: string;
  skills: string[];
}

export interface TeamContent {
  sectionLabel: string;
  title: string;
  subtitle: string;
  members: TeamMember[];
}

export interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  author: string;
  date: string;
  tags: string[];
  coverImage: string;
  readTime: string;
}

export interface ContactItem {
  type: string;
  label: string;
  value: string;
  href: string;
  icon: string;
}

export interface SocialItem {
  platform: string;
  url: string;
  icon: string;
}

export interface ContactContent {
  sectionLabel: string;
  title: string;
  subtitle: string;
  tagline: string;
  contacts: ContactItem[];
  socials: SocialItem[];
}

export interface SiteContent {
  about: AboutContent;
  services: ServicesContent;
  projects: ProjectsContent;
  vision: PrincipleContent;
  mission: PrincipleContent;
  goals: PrincipleContent;
  journey: JourneyContent;
  team: TeamContent;
  blogPosts: BlogPost[];
  contact: ContactContent;
}
