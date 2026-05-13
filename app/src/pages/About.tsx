import { useEffect, useState } from 'react'
import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import { Calendar, MapPin, Target, Eye, Rocket, Award } from 'lucide-react'
import { dataService } from '../services/dataService'
import type { AboutUsData, VisionItem, JourneyData } from '../services/dataService'

const ease: [number, number, number, number] = [0.16, 1, 0.3, 1]

function InfoCard({ icon: Icon, title, children, delay = 0 }: any) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-80px' })
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 24 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay, ease }}
      className="liquid-glass-card p-8 rounded-2xl"
    >
      <div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-accent-lime/10 text-accent-lime mb-4">
        <Icon size={20} />
      </div>
      <h3 className="font-display text-xl text-text-primary mb-2">{title}</h3>
      <div className="text-text-muted text-base leading-relaxed">{children}</div>
    </motion.div>
  )
}

export default function About() {
  const [about, setAbout] = useState<AboutUsData | null>(null)
  const [visions, setVisions] = useState<VisionItem[]>([])
  const [missions, setMissions] = useState<VisionItem[]>([])
  const [goals, setGoals] = useState<VisionItem[]>([])
  const [journey, setJourney] = useState<JourneyData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      dataService.getAboutUs(),
      dataService.getVisions(),
      dataService.getMissions(),
      dataService.getGoals(),
      dataService.getJourney(),
    ])
      .then(([a, v, m, g, j]) => {
        setAbout(a)
        setVisions(v)
        setMissions(m)
        setGoals(g)
        setJourney(j)
      })
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  const heroRef = useRef(null)
  const isHeroInView = useInView(heroRef, { once: true })

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="font-mono text-xs text-text-muted animate-pulse">Loading…</div>
      </div>
    )
  }

  return (
    <div className="pt-24 pb-20">
      {/* Hero */}
      <section className="max-w-[1280px] mx-auto px-4 sm:px-6 py-16 md:py-24" ref={heroRef}>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={isHeroInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease }}
          className="font-mono text-xs tracking-[0.08em] uppercase text-accent-lime mb-4"
        >
          {about?.sectionLabel}
        </motion.p>
        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={isHeroInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.1, ease }}
          className="font-display text-[clamp(2.5rem,6vw,5rem)] leading-[1.05] text-text-primary max-w-4xl"
        >
          {about?.headline}
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 24 }}
          animate={isHeroInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.2, ease }}
          className="text-lg text-text-secondary mt-6 max-w-2xl leading-relaxed"
        >
          {about?.description}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={isHeroInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.3, ease }}
          className="flex flex-wrap gap-6 mt-10"
        >
          <div className="flex items-center gap-2 text-text-muted">
            <Calendar size={16} className="text-accent-lime" />
            <span className="font-mono text-xs">Founded {about?.foundedYear}</span>
          </div>
          <div className="flex items-center gap-2 text-text-muted">
            <MapPin size={16} className="text-accent-lime" />
            <span className="font-mono text-xs">
              {about?.location}, {about?.country}
            </span>
          </div>
        </motion.div>
      </section>

      {/* Vision / Mission / Goals */}
      <section className="max-w-[1280px] mx-auto px-4 sm:px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <InfoCard icon={Eye} title="Vision" delay={0}>
            {visions.map((v, i) => (
              <p key={i} className="mb-2">
                {v.description}
              </p>
            ))}
          </InfoCard>
          <InfoCard icon={Target} title="Mission" delay={0.1}>
            {missions.map((m, i) => (
              <p key={i} className="mb-2">
                {m.description}
              </p>
            ))}
          </InfoCard>
          <InfoCard icon={Rocket} title="Goals" delay={0.2}>
            {goals.map((g, i) => (
              <p key={i} className="mb-2">
                {g.description}
              </p>
            ))}
          </InfoCard>
        </div>
      </section>

      {/* Journey */}
      <section className="max-w-[1280px] mx-auto px-4 sm:px-6 py-16">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.6, ease }}
          className="font-display text-[clamp(2rem,5vw,4rem)] leading-[1.05] text-text-primary mb-12"
        >
          Our Journey
        </motion.h2>
        <div className="space-y-8">
          {journey?.milestones.map((m, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: i % 2 === 0 ? -30 : 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ duration: 0.6, delay: i * 0.1, ease }}
              className="flex gap-6 items-start"
            >
              <div className="flex-shrink-0 w-16 h-16 rounded-full liquid-glass-card flex items-center justify-center">
                <Award size={20} className="text-accent-lime" />
              </div>
              <div className="liquid-glass-card p-6 rounded-xl flex-1">
                <span className="font-mono text-xs text-accent-lime">{m.year}</span>
                <h3 className="font-display text-lg text-text-primary mt-1">{m.title}</h3>
                <p className="text-text-muted text-base mt-2">{m.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  )
}
