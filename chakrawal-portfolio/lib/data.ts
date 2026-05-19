import about from "@/public/data/about_us.json";
import blogPosts from "@/public/data/blog_posts.json";
import contact from "@/public/data/company_contact.json";
import goals from "@/public/data/goals.json";
import journey from "@/public/data/our_journey.json";
import projects from "@/public/data/projects.json";
import services from "@/public/data/services.json";
import team from "@/public/data/our_team.json";
import mission from "@/public/data/missions.json";
import vision from "@/public/data/visions.json";
import type { SiteContent } from "@/types/content";

export function getSiteContent(): SiteContent {
  return {
    about,
    services,
    projects,
    vision,
    mission,
    goals,
    journey,
    team,
    blogPosts,
    contact,
  } as SiteContent;
}
