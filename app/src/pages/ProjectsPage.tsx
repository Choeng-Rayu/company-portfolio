import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { dataService } from '../services/dataService'
import type { ProjectsData } from '../services/dataService'
import { ProjectGrid } from '../components/ProjectCard/ProjectCard'

const ease: [number, number, number, number] = [0.16, 1, 0.3, 1]

export default function ProjectsPage() {
  const [data, setData] = useState<ProjectsData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    dataService.getProjects().then(setData).catch(console.error).finally(() => setLoading(false))
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
              <div className="font-display text-3xl md:text-4xl text-accent-lime">{stat.value}</div>
              <div className="font-mono text-xs tracking-[0.08em] uppercase text-text-muted mt-1">{stat.label}</div>
            </div>
          ))}
        </motion.div>
      </section>

      <section className="max-w-[1280px] mx-auto px-4 sm:px-6 py-8">
        {data && <ProjectGrid projects={data.projects} />}
      </section>
    </div>
  )
}
