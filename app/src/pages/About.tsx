import { useEffect, useState } from 'react'
import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import { Calendar, MapPin, Target, Eye, Rocket } from 'lucide-react'
import { dataService } from '../services/dataService'
import type { AboutUsData, VisionData } from '../services/dataService'
import Lanyard from '../components/Lanyard/Lanyard'
import OurJourney from '../sections/FeaturedWork'

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
  const [visions, setVisions] = useState<VisionData | null>(null)
  const [missions, setMissions] = useState<VisionData | null>(null)
  const [goals, setGoals] = useState<VisionData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      dataService.getAboutUs(),
      dataService.getVisions(),
      dataService.getMissions(),
      dataService.getGoals(),
    ])
      .then(([a, v, m, g]) => {
        setAbout(a)
        setVisions(v)
        setMissions(m)
        setGoals(g)
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
        <div className="flex flex-col lg:flex-row items-center gap-12">
          <div className="flex-1 w-full">
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
              className="font-display text-[clamp(2.5rem,6vw,5rem)] leading-[1.05] text-text-primary"
            >
              {about?.headline}
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 24 }}
              animate={isHeroInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.2, ease }}
              className="text-lg text-text-secondary mt-6 leading-relaxed"
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
          </div>
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={isHeroInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.8, delay: 0.4, ease }}
            className="flex-1 w-full h-[600px] relative rounded-3xl overflow-hidden liquid-glass-card shadow-2xl border border-white/10"
          >
            <Lanyard position={[0, 0, 20]} gravity={[0, -40, 0]} />
          </motion.div>
        </div>
      </section>

      {/* Vision / Mission / Goals */}
      <section className="max-w-[1280px] mx-auto px-4 sm:px-6 py-16">
        <div className="text-center mb-12">
          <p className="font-mono text-xs tracking-[0.08em] uppercase text-accent-lime">
            {visions?.sectionLabel}
          </p>
          <h2 className="font-display text-[clamp(2rem,5vw,4rem)] leading-[1.05] text-text-primary mt-4">
            Vision, Mission & Goals
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <InfoCard icon={Eye} title={visions?.title || "Vision"} delay={0}>
            {visions?.bullets?.map((b, i) => (
              <p key={i} className="mb-2">
                {b}
              </p>
            ))}
          </InfoCard>
          <InfoCard icon={Target} title={missions?.title || "Mission"} delay={0.1}>
            {missions?.bullets?.map((b, i) => (
              <p key={i} className="mb-2">
                {b}
              </p>
            ))}
          </InfoCard>
          <InfoCard icon={Rocket} title={goals?.title || "Goals"} delay={0.2}>
            {goals?.bullets?.map((b, i) => (
              <p key={i} className="mb-2">
                {b}
              </p>
            ))}
          </InfoCard>
        </div>
      </section>

      {/* Journey */}
      <OurJourney />
    </div>
  )
}
