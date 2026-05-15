import { motion } from 'framer-motion'
import { Link } from 'react-router'
import { Figma, Globe, ExternalLink, Eye } from 'lucide-react'
import { TiltCard } from '../TiltCard'
import type { Project } from '../../services/dataService'

const ease: [number, number, number, number] = [0.16, 1, 0.3, 1]

export function ProjectCard({ project, index }: { project: Project; index: number }) {
  const isFigma = project.type === 'figma'
  const TypeIcon = isFigma ? Figma : Globe
  const typeLabel = isFigma ? 'Figma Prototype' : 'Live Site'

  return (
    <motion.div
      initial={{ opacity: 0, y: 30, scale: 0.95 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.5, delay: index * 0.08, ease }}
      className="h-full"
    >
      <TiltCard className="group liquid-glass-card rounded-2xl flex flex-col h-full w-full">
        <div className="h-1 w-full shrink-0" style={{ backgroundColor: project.color }} />
        <div className="flex flex-col flex-1 p-5 gap-4 relative z-20">
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

          <h3 className="font-display text-xl text-text-primary leading-snug">{project.title}</h3>

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
            <ExternalLink size={12} className="text-text-muted group-hover/link:text-accent-lime transition-colors" />
          </a>
        </div>
      </TiltCard>
    </motion.div>
  )
}

export function ProjectGrid({ projects }: { projects: Project[] }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
      {projects.map((project, index) => (
        <ProjectCard key={project.id} project={project} index={index} />
      ))}
    </div>
  )
}
