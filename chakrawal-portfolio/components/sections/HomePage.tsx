import Image from "next/image";
import { ArrowRight, CalendarDays, Check, ExternalLink } from "lucide-react";
import type { CSSProperties } from "react";
import { AtmosphericParticles } from "@/components/three/AtmosphericParticles";
import { HeroVisual } from "@/components/three/HeroVisual";
import { PortfolioOrbit } from "@/components/three/PortfolioOrbit";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { GlassCard } from "@/components/ui/GlassCard";
import { Icon } from "@/components/ui/Icon";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeader } from "@/components/ui/SectionHeader";
import type {
  BlogPost,
  PrincipleContent,
  Project,
  SiteContent,
  TeamMember,
} from "@/types/content";

const projectImages = [
  "/images/project-greenroute.jpg",
  "/images/project-medconnect.jpg",
  "/images/project-payflow.jpg",
  "/images/moon-website.png",
  "/images/planet-nexus.png",
  "/images/planet-terra.png",
];

const teamImages = [
  "/images/team-sokha.jpg",
  "/images/team-rithy.jpg",
  "/images/team-sophea.jpg",
  "/images/team-channary.jpg",
];

function SiteNav() {
  const links = [
    ["Services", "#services"],
    ["Portfolio", "#portfolio"],
    ["Journey", "#journey"],
    ["Team", "#team"],
    ["Contact", "#contact"],
  ];

  return (
    <header className="site-nav">
      <a className="brand-mark" href="#top" aria-label="Chakrawal Digital home">
        <Image src="/images/company_log.png" alt="" width={36} height={36} priority />
        <span>Chakrawal</span>
      </a>
      <nav aria-label="Primary navigation">
        {links.map(([label, href]) => (
          <a key={href} href={href}>
            {label}
          </a>
        ))}
      </nav>
      <ButtonLink href="#contact" variant="secondary" className="nav-cta">
        Start a project
      </ButtonLink>
    </header>
  );
}

function HeroSection({ content }: { content: SiteContent }) {
  return (
    <section id="top" className="hero-section">
      <HeroVisual />
      <div className="hero-grid shell">
        <div className="hero-copy">
          <p className="eyebrow">Phnom Penh software studio</p>
          <h1>{content.about.headline}</h1>
          <p className="hero-lede">{content.about.description}</p>
          <div className="hero-actions">
            <ButtonLink href="#portfolio">Explore our work</ButtonLink>
            <ButtonLink href="#contact" variant="ghost">
              Talk to us
            </ButtonLink>
          </div>
        </div>
        <div className="hero-panel">
          <div className="status-row">
            <span className="status-dot" />
            Serving SMEs and government partners
          </div>
          <div className="hero-stats">
            {content.projects.stats.map((stat) => (
              <div key={stat.label}>
                <strong>{stat.value}</strong>
                <span>{stat.label}</span>
              </div>
            ))}
          </div>
          <p>
            Founded in {content.about.foundedYear} in {content.about.location}, {content.about.country}.
            Built for local workflows, fast delivery, and long-term support.
          </p>
        </div>
      </div>
    </section>
  );
}

function ServicesSection({ content }: { content: SiteContent }) {
  return (
    <section id="services" className="page-section shell">
      <Reveal>
        <SectionHeader
          eyebrow={content.services.sectionLabel}
          title={content.services.title}
          subtitle={content.services.subtitle}
        />
      </Reveal>
      <div className="service-grid">
        {content.services.services.map((service, index) => (
          <Reveal key={service.title} delay={index * 0.06}>
            <GlassCard className="service-card">
              <span className="icon-box">
                <Icon name={service.icon} />
              </span>
              <h3>{service.title}</h3>
              <p>{service.description}</p>
              <a href={service.href} className="text-link">
                Discuss this service <ArrowRight aria-hidden="true" size={16} />
              </a>
            </GlassCard>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

function ProjectCard({ project, index }: { project: Project; index: number }) {
  return (
    <GlassCard
      as="article"
      className="project-card"
      style={{ "--project-color": project.color } as CSSProperties}
    >
      <div className="project-image">
        <Image
          src={projectImages[index % projectImages.length]}
          alt=""
          fill
          sizes="(min-width: 960px) 33vw, 100vw"
        />
      </div>
      <div className="project-card-body">
        <div className="project-meta">
          <span>{project.type === "live" ? "Live system" : "Prototype"}</span>
          <span>{String(project.id).padStart(2, "0")}</span>
        </div>
        <h3>{project.title}</h3>
        <p>{project.description}</p>
        <div className="tag-row">
          {project.tags.map((tag) => (
            <span key={tag}>{tag}</span>
          ))}
        </div>
        <a href={project.link} target="_blank" rel="noreferrer" className="text-link">
          View {project.type === "live" ? "live" : "prototype"} <ExternalLink aria-hidden="true" size={16} />
        </a>
      </div>
    </GlassCard>
  );
}

function PortfolioSection({ content }: { content: SiteContent }) {
  return (
    <section id="portfolio" className="page-section portfolio-section">
      <div className="shell portfolio-layout">
        <Reveal>
          <SectionHeader
            eyebrow={content.projects.sectionLabel}
            title={content.projects.headline}
            subtitle={content.projects.subtitle}
          />
        </Reveal>
        <Reveal className="portfolio-visual-wrap" delay={0.08}>
          <PortfolioOrbit projects={content.projects.projects} />
        </Reveal>
      </div>
      <div className="shell project-grid">
        {content.projects.projects.map((project, index) => (
          <Reveal key={project.id} delay={(index % 3) * 0.06}>
            <ProjectCard project={project} index={index} />
          </Reveal>
        ))}
      </div>
    </section>
  );
}

function PrincipleCard({ item }: { item: PrincipleContent }) {
  return (
    <GlassCard className="principle-card">
      <span>{item.number}</span>
      <p className="eyebrow">{item.sectionLabel}</p>
      <h3>{item.title}</h3>
      <ul>
        {item.bullets.map((bullet) => (
          <li key={bullet}>
            <Check aria-hidden="true" size={17} />
            {bullet}
          </li>
        ))}
      </ul>
    </GlassCard>
  );
}

function PrinciplesSection({ content }: { content: SiteContent }) {
  return (
    <section className="page-section shell">
      <Reveal>
        <SectionHeader
          eyebrow="OPERATING SYSTEM"
          title="Local insight, production discipline."
          subtitle="A clear product philosophy guides every client engagement, from discovery to support."
          align="center"
        />
      </Reveal>
      <div className="principle-grid">
        {[content.vision, content.mission, content.goals].map((item, index) => (
          <Reveal key={item.title} delay={index * 0.08}>
            <PrincipleCard item={item} />
          </Reveal>
        ))}
      </div>
    </section>
  );
}

function JourneySection({ content }: { content: SiteContent }) {
  return (
    <section id="journey" className="page-section shell journey-section">
      <Reveal>
        <SectionHeader
          eyebrow={content.journey.sectionLabel}
          title={content.journey.title}
          subtitle={content.journey.subtitle}
        />
      </Reveal>
      <div className="timeline">
        {content.journey.milestones.map((milestone, index) => (
          <Reveal key={milestone.year} delay={index * 0.06}>
            <GlassCard className="timeline-item">
              <span>{milestone.year}</span>
              <div>
                <h3>{milestone.title}</h3>
                <p>{milestone.description}</p>
              </div>
            </GlassCard>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

function TeamCard({ member, index }: { member: TeamMember; index: number }) {
  const image = teamImages[index % teamImages.length];

  return (
    <GlassCard className="team-card">
      <div className="team-avatar">
        {index < teamImages.length ? (
          <Image src={image} alt="" fill sizes="96px" />
        ) : (
          <span>{member.initials}</span>
        )}
      </div>
      <h3>{member.name}</h3>
      <p className="team-role">{member.role}</p>
      <p>{member.bio}</p>
      <div className="tag-row">
        {member.skills.slice(0, 4).map((skill) => (
          <span key={skill}>{skill}</span>
        ))}
      </div>
      <a href={member.linkedIn} target="_blank" rel="noreferrer" className="text-link">
        LinkedIn <ExternalLink aria-hidden="true" size={16} />
      </a>
    </GlassCard>
  );
}

function TeamSection({ content }: { content: SiteContent }) {
  return (
    <section id="team" className="page-section shell">
      <Reveal>
        <SectionHeader
          eyebrow={content.team.sectionLabel}
          title={content.team.title}
          subtitle={content.team.subtitle}
        />
      </Reveal>
      <div className="team-grid">
        {content.team.members.map((member, index) => (
          <Reveal key={member.name} delay={(index % 3) * 0.06}>
            <TeamCard member={member} index={index} />
          </Reveal>
        ))}
      </div>
    </section>
  );
}

function BlogCard({ post }: { post: BlogPost }) {
  return (
    <GlassCard as="article" className="blog-card">
      <div className="blog-image">
        <Image src={post.coverImage} alt="" fill sizes="(min-width: 960px) 33vw, 100vw" />
      </div>
      <div className="blog-body">
        <p className="blog-meta">
          <CalendarDays aria-hidden="true" size={15} />
          {post.date} / {post.readTime}
        </p>
        <h3>{post.title}</h3>
        <p>{post.excerpt}</p>
        <div className="tag-row">
          {post.tags.slice(0, 3).map((tag) => (
            <span key={tag}>{tag}</span>
          ))}
        </div>
      </div>
    </GlassCard>
  );
}

function BlogSection({ content }: { content: SiteContent }) {
  const posts = content.blogPosts.slice(0, 3);

  return (
    <section className="page-section shell">
      <Reveal>
        <SectionHeader
          eyebrow="INSIGHTS"
          title="Thinking from the studio."
          subtitle="A few notes on Cambodia's digital transformation, product delivery, and design systems."
        />
      </Reveal>
      <div className="blog-grid">
        {posts.map((post, index) => (
          <Reveal key={post.slug} delay={index * 0.06}>
            <BlogCard post={post} />
          </Reveal>
        ))}
      </div>
    </section>
  );
}

function ContactSection({ content }: { content: SiteContent }) {
  return (
    <section id="contact" className="page-section contact-section">
      <div className="shell contact-grid">
        <Reveal>
          <div>
            <p className="eyebrow">{content.contact.sectionLabel}</p>
            <h2>{content.contact.title}</h2>
            <p>{content.contact.subtitle}</p>
            <p className="contact-tagline">{content.contact.tagline}</p>
          </div>
        </Reveal>
        <Reveal delay={0.12}>
          <GlassCard className="contact-card">
            {content.contact.contacts.map((item) => (
              <a key={item.label} href={item.href} className="contact-row">
                <span className="icon-box">
                  <Icon name={item.icon} />
                </span>
                <span>
                  <small>{item.label}</small>
                  {item.value}
                </span>
              </a>
            ))}
            <div className="social-row">
              {content.contact.socials.map((social) => (
                <a key={social.platform} href={social.url} target="_blank" rel="noreferrer" aria-label={social.platform}>
                  <Icon name={social.icon} />
                </a>
              ))}
            </div>
          </GlassCard>
        </Reveal>
      </div>
    </section>
  );
}

function SiteFooter() {
  return (
    <footer className="site-footer shell">
      <span>Chakrawal Digital</span>
      <span>Built in Phnom Penh for businesses ready to modernize.</span>
    </footer>
  );
}

export function HomePage({ content }: { content: SiteContent }) {
  return (
    <>
      <AtmosphericParticles />
      <SiteNav />
      <main>
        <HeroSection content={content} />
        <ServicesSection content={content} />
        <PortfolioSection content={content} />
        <PrinciplesSection content={content} />
        <JourneySection content={content} />
        <TeamSection content={content} />
        <BlogSection content={content} />
        <ContactSection content={content} />
      </main>
      <SiteFooter />
    </>
  );
}
