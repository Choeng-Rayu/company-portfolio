import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router'
import { Figma, Globe, ExternalLink, Eye } from 'lucide-react'
import { dataService } from '../services/dataService'
import type { ProjectsData, Project } from '../services/dataService'

const ease: [number, number, number, number] = [0.16, 1, 0.3, 1]

function ProjectCard({ project, index }: { project: Project; index: number }) {
  const isFigma = project.type === 'figma'
  const TypeIcon = isFigma ? Figma : Globe
  const typeLabel = isFigma ? 'Figma Prototype' : 'Live Site'

  return (
    <motion.div
      initial={{ opacity: 0, y: 30, scale: 0.95 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.5, delay: index * 0.08, ease }}
      className="group liquid-glass-card rounded-2xl overflow-hidden flex flex-col hover:-translate-y-1 transition-transform"
    >
      <div className="h-1 w-full" style={{ backgroundColor: project.color }} />
      <div className="flex flex-col flex-1 p-5 gap-4">
        <div className="flex items-center justify-between">
          <span
            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full font-mono text-[0.6rem] tracking-wide border"
            style={{
              background: `${project.color}15`,
              borderColor: `${project.color}40`,
              color: project.color,
            }}
          >
            <TypeIcon size={10} />
            {typeLabel}
          </span>
          <Link
            to={`/work/${project.id}`}
            className="liquid-glass-btn flex items-center gap-1.5 px-3 py-1.5 font-mono text-[0.65rem] tracking-wide text-text-muted hover:text-accent-lime"
          >
            <Eye size={12} />
            Details
          </Link>
        </div>
        <h3 className="font-display text-xl text-text-primary leading-snug">
          {project.title}
        </h3>
        <p className="text-base text-text-muted leading-relaxed line-clamp-3 flex-1">
          {project.description}
        </p>
        <div className="flex flex-wrap gap-1.5">
          {project.tags.map((tag) => (
            <span
              key={tag}
              className="px-2 py-0.5 rounded-md font-mono text-[0.6rem] tracking-wide text-text-muted border border-white/5 bg-white/[0.03]"
            >
              {tag}
            </span>
          ))}
        </div>
        <a
          href={project.link}
          target="_blank"
          rel="noopener noreferrer"
          className="pt-4 border-t border-white/5 flex items-center justify-between group/link"
        >
          <span className="font-mono text-xs text-text-muted group-hover/link:text-accent-lime transition-colors">
            {isFigma ? 'Open in Figma' : 'Visit Site'}
          </span>
          <ExternalLink
            size={12}
            className="text-text-muted group-hover/link:text-accent-lime transition-colors"
          />
        </a>
      </div>
    </motion.div>
  )
}

export default function ProjectsPage() {
  const [data, setData] = useState<ProjectsData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    dataService
      .getProjects()
      .then(setData)
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="font-mono text-xs text-text-muted animate-pulse">Loading…</div>
      </div>
    )
  }

  return (
    <div className="pt-24 pb-20">
      <section className="max-w-[1280px] mx-auto px-4 sm:px-6 py-16 md:py-24">
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease }}
          className="font-mono text-xs tracking-[0.08em] uppercase text-accent-lime mb-4"
        >
          {data?.sectionLabel}
        </motion.p>
        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1, ease }}
          className="font-display text-[clamp(2.5rem,6vw,5rem)] leading-[1.05] text-text-primary max-w-4xl"
        >
          {data?.headline}
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2, ease }}
          className="text-lg text-text-secondary mt-6 max-w-2xl leading-relaxed"
        >
          {data?.subtitle}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3, ease }}
          className="flex flex-wrap justify-start gap-8 md:gap-16 mt-10"
        >
          {data?.stats.map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="font-display text-3xl md:text-4xl text-accent-lime">
                {stat.value}
              </div>
              <div className="font-mono text-xs tracking-[0.08em] uppercase text-text-muted mt-1">
                {stat.label}
              </div>
            </div>
          ))}
        </motion.div>
      </section>

      <section className="max-w-[1280px] mx-auto px-4 sm:px-6 py-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {data?.projects.map((project, index) => (
            <ProjectCard key={project.id} project={project} index={index} />
          ))}
        </div>
      </section>
    </div>
  )
}
