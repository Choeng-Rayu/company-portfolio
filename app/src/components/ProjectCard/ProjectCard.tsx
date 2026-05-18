import { motion } from 'framer-motion'
import { Link } from 'react-router'
import { Figma, Globe, ExternalLink, Eye, ArrowUpRight } from 'lucide-react'
import { EASE_OUT_EXPO } from '@/lib/animation'
import { TiltCard } from '../TiltCard'
import type { Project } from '../../services/dataService'

function ProjectInitial({ title, color }: { title: string; color: string }) {
  const initial = title.charAt(0).toUpperCase()
  return (
    <div
      className="w-8 h-8 rounded-lg flex items-center justify-center font-small text-small font-bold flex-shrink-0"
      style={{
        background: `${color}18`,
        color,
        border: `1px solid ${color}33`,
      }}
    >
      {initial}
    </div>
  )
}

export function ProjectCard({ project, index }: { project: Project; index: number }) {
  const isFigma = project.type === 'figma'
  const TypeIcon = isFigma ? Figma : Globe
  const typeLabel = isFigma ? 'Figma' : 'Live'

  return (
    <motion.div
      initial={{ opacity: 0, y: 40, scale: 0.95 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.5, delay: index * 0.1, ease: EASE_OUT_EXPO }}
      className="h-full"
    >
      <TiltCard className="group liquid-glass-card rounded-2xl flex flex-col h-full w-full overflow-hidden hover:border-white/20 transition-all duration-500 group-hover:shadow-[0_0_20px_rgba(200,241,53,0.15)] group-hover:border-accent-lime/20 relative">
        {/* Wireframe materialization overlay */}
        <motion.div
          className="absolute inset-0 rounded-2xl z-[30] pointer-events-none"
          initial={{ opacity: 1 }}
          whileInView={{ opacity: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.5, delay: index * 0.1 + 0.25, ease: EASE_OUT_EXPO }}
          style={{
            background: 'transparent',
            border: `1px solid ${project.color}`,
          }}
        />

        {/* Scanline effect */}
        <div
          className="absolute inset-0 z-[25] pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl"
          style={{
            background: `repeating-linear-gradient(0deg, transparent, transparent 1px, rgba(200,241,53,0.03) 1px, rgba(200,241,53,0.03) 2px)`,
          }}
        />

        {/* Top accent gradient bar */}
        <div
          className="h-1 w-full shrink-0 transition-all duration-500 group-hover:h-1.5"
          style={{
            background: `linear-gradient(90deg, ${project.color} 0%, ${project.color}88 100%)`,
          }}
        />

        <div className="flex flex-col flex-1 p-5 gap-4 relative z-20">
          {/* Header row */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ProjectInitial title={project.title} color={project.color} />
              <span
                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full font-small text-small border"
                style={{
                  background: `${project.color}15`,
                  borderColor: `${project.color}40`,
                  color: project.color,
                }}
              >
                <TypeIcon size={10} />
                {typeLabel}
              </span>
            </div>
            <Link
              to={`/work/${project.id}`}
              className="liquid-glass-btn flex items-center gap-1.5 px-3 py-1.5 font-small text-small text-text-muted hover:text-accent-lime transition-colors"
            >
              <Eye size={12} />
              View
            </Link>
          </div>

          <h3 className="font-subheader text-subheader text-text-primary leading-snug group-hover:text-accent-lime transition-colors duration-300">
            {project.title}
          </h3>

          <p className="font-body text-body text-text-muted leading-relaxed flex-1">
            {project.description}
          </p>

          {/* Tags */}
          <div className="flex flex-wrap gap-1.5">
            {project.tags.map((tag) => (
              <span
                key={tag}
                className="px-2 py-0.5 rounded-md font-small text-small text-text-muted border border-white/5 bg-white/[0.03]"
              >
                {tag}
              </span>
            ))}
          </div>

          {/* CTA */}
          <a
            href={project.link}
            target="_blank"
            rel="noopener noreferrer"
            className="pt-4 border-t border-white/5 flex items-center justify-between group/link"
          >
            <span className="font-small text-small text-text-muted group-hover/link:text-accent-lime transition-colors">
              {isFigma ? 'Open Prototype' : 'Visit Live Site'}
            </span>
            <div className="flex items-center gap-1">
              <ExternalLink size={12} className="text-text-muted group-hover/link:text-accent-lime transition-colors" />
              <ArrowUpRight size={12} className="text-text-muted group-hover/link:text-accent-lime transition-colors opacity-0 group-hover/link:opacity-100 -translate-x-1 group-hover/link:translate-x-0 transition-all" />
            </div>
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
