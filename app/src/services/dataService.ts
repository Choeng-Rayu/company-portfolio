const BASE = '/data'

async function fetchJson<T>(path: string): Promise<T> {
  const res = await fetch(`${BASE}${path}`)
  if (!res.ok) throw new Error(`Failed to load ${path}: ${res.status}`)
  return res.json() as Promise<T>
}

export interface AboutUsData {
  sectionLabel: string
  headline: string
  description: string
  foundedYear: string
  location: string
  country: string
}

export interface ContactData {
  sectionLabel: string
  title: string
  subtitle: string
  contacts: { type: string; label: string; value: string; icon: string }[]
  socials: { platform: string; url: string; icon: string }[]
}

interface ServiceItem {
  icon: string
  title: string
  description: string
  href: string
}

export interface ServicesData {
  sectionLabel: string
  title: string
  subtitle: string
  services: ServiceItem[]
}

export interface Project {
  id: number
  title: string
  description: string
  type: 'figma' | 'live'
  link: string
  tags: string[]
  color: string
  fullDescription?: string
  features?: string[]
  technologies?: string[]
  gallery?: string[]
}

export interface ProjectsData {
  sectionLabel: string
  headline: string
  subtitle: string
  stats: { value: string; label: string }[]
  projects: Project[]
}

export interface TeamMember {
  name: string
  role: string
  initials: string
  linkedIn: string
  bio?: string
  skills?: string[]
}

export interface TeamData {
  sectionLabel: string
  title: string
  subtitle: string
  members: TeamMember[]
}

interface JourneyItem {
  year: string
  title: string
  description: string
  planet: string
}

export interface JourneyData {
  sectionLabel: string
  title: string
  subtitle: string
  milestones: JourneyItem[]
}

export interface VisionData {
  sectionLabel: string
  title: string
  number: string
  bullets: string[]
}

export interface BlogPost {
  slug: string
  title: string
  excerpt: string
  content: string
  author: string
  date: string
  tags: string[]
  coverImage?: string
  readTime: string
}

export interface MediaInfo {
  platform: string
  url: string
  icon: string
}

export const dataService = {
  getAboutUs: () => fetchJson<AboutUsData>('/about_us.json'),
  getContact: () => fetchJson<ContactData>('/company_contact.json'),
  getServices: () => fetchJson<ServicesData>('/services.json'),
  getProjects: () => fetchJson<ProjectsData>('/projects.json'),
  getTeam: () => fetchJson<TeamData>('/our_team.json'),
  getJourney: () => fetchJson<JourneyData>('/our_journey.json'),
  getGoals: () => fetchJson<VisionData>('/goals.json'),
  getMissions: () => fetchJson<VisionData>('/missions.json'),
  getVisions: () => fetchJson<VisionData>('/visions.json'),
  getBlogPosts: () => fetchJson<BlogPost[]>('/blog_posts.json'),
  getMediaInfo: () => fetchJson<MediaInfo[]>('/media_info.json'),
  getBlogPost: async (slug: string) => {
    const posts = await fetchJson<BlogPost[]>('/blog_posts.json')
    return posts.find((p) => p.slug === slug) ?? null
  },
}
