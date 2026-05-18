import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { EASE_OUT_EXPO } from '@/lib/animation'
import PageLoader from '@/components/PageLoader'
import Container from '@/components/Container'
import { dataService } from '../services/dataService'
import type { ProjectsData } from '../services/dataService'
import { ProjectGrid } from '../components/ProjectCard/ProjectCard'
import WorkShowcase from '@/sections/WorkShowcase'

export default function ProjectsPage() {
  const [data, setData] = useState<ProjectsData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    dataService.getProjects().then(setData).catch(console.error).finally(() => setLoading(false))
  }, [])

  if (loading) {
    return <PageLoader />
  }

  return (
    <div className="pt-24 pb-20">
      <section className="py-16 md:py-24">
        <Container>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: EASE_OUT_EXPO }}
            className="font-mono text-xs tracking-[0.08em] uppercase text-accent-lime mb-4"
          >
            {data?.sectionLabel}
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1, ease: EASE_OUT_EXPO }}
            className="font-display text-[clamp(2.5rem,6vw,5rem)] leading-[1.05] text-text-primary max-w-4xl"
          >
            {data?.headline}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2, ease: EASE_OUT_EXPO }}
            className="text-lg text-text-secondary mt-6 max-w-2xl leading-relaxed"
          >
            {data?.subtitle}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3, ease: EASE_OUT_EXPO }}
            className="flex flex-wrap justify-start gap-8 md:gap-16 mt-10"
          >
            {data?.stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="font-display text-3xl md:text-4xl text-accent-lime">{stat.value}</div>
                <div className="font-mono text-xs tracking-[0.08em] uppercase text-text-muted mt-1">{stat.label}</div>
              </div>
            ))}
          </motion.div>
        </Container>
      </section>

      <WorkShowcase />

      <section className="py-8">
        <Container>
          {data && <ProjectGrid projects={data.projects} />}
        </Container>
      </section>
    </div>
  )
}
