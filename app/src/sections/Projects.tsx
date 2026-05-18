import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { dataService } from '../services/dataService'
import type { ProjectsData } from '../services/dataService'
import { ProjectGrid } from '../components/ProjectCard/ProjectCard'
import { useScrollAnimation } from '../hooks/useScrollAnimation'
import { useAnimatedCounter } from '../hooks/useAnimatedCounter'

const ease: [number, number, number, number] = [0.16, 1, 0.3, 1]

function parseStatValue(value: string): { num: number; suffix: string } {
  const match = value.match(/^([0-9]+)(.*)$/)
  if (match) {
    return { num: parseInt(match[1], 10), suffix: match[2] }
  }
  return { num: 0, suffix: value }
}

function AnimatedStat({ value, label, delay }: { value: string; label: string; delay: number }) {
  const { num, suffix } = parseStatValue(value)
  const { value: animatedValue, ref } = useAnimatedCounter(num, 2000)

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay, ease }}
      className="text-center"
    >
      <div className="font-display text-3xl md:text-4xl text-accent-lime tabular-nums">
        {animatedValue}{suffix}
      </div>
      <div className="font-mono text-xs tracking-[0.08em] uppercase text-text-muted mt-1">{label}</div>
    </motion.div>
  )
}

export default function Projects() {
  const [data, setData] = useState<ProjectsData | null>(null)
  const { ref, isInView } = useScrollAnimation('-100px')

  useEffect(() => {
    dataService.getProjects().then(setData).catch(console.error)
  }, [])

  if (!data) return null

  return (
    <section id="work" className="w-full py-20 md:py-[140px] bg-transparent" ref={ref}>
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6">
        {/* Section Header */}
        <div className="text-center mb-12 md:mb-16">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, ease }}
            className="font-mono text-xs tracking-[0.08em] uppercase text-accent-lime"
          >
            {data.sectionLabel}
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.1, duration: 0.6, ease }}
            className="font-display text-[clamp(2rem,6vw,5rem)] leading-[1.05] text-text-primary mt-4"
          >
            {data.headline}
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.2, duration: 0.6, ease }}
            className="text-lg md:text-xl text-text-secondary mt-4 max-w-[560px] mx-auto"
          >
            {data.subtitle}
          </motion.p>
        </div>

        {/* Stats Row */}
        <div className="flex flex-wrap justify-center gap-8 md:gap-16 mb-16 md:mb-20">
          {data.stats.map((stat, i) => (
            <AnimatedStat
              key={stat.label}
              value={stat.value}
              label={stat.label}
              delay={0.3 + i * 0.1}
            />
          ))}
        </div>

        <ProjectGrid projects={data.projects} />
      </div>
    </section>
  )
}
