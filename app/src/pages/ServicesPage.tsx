import { useEffect, useState } from 'react'
import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import { Code, TrendingUp, Building2, Zap, ArrowRight, CheckCircle2 } from 'lucide-react'
import { dataService } from '../services/dataService'
import type { ServicesData } from '../services/dataService'

const ICON_MAP: Record<string, React.ComponentType<{ size?: number; className?: string }>> = {
  Code,
  TrendingUp,
  Building2,
  Zap,
}

const ease: [number, number, number, number] = [0.16, 1, 0.3, 1]

const PROCESS_STEPS = [
  { step: '01', title: 'Discovery', desc: 'We dive deep into your business, goals, and challenges.' },
  { step: '02', title: 'Strategy', desc: 'We craft a tailored digital roadmap aligned with your vision.' },
  { step: '03', title: 'Design', desc: 'We create intuitive, beautiful interfaces your users will love.' },
  { step: '04', title: 'Development', desc: 'We build robust, scalable solutions with modern tech.' },
  { step: '05', title: 'Launch', desc: 'We deploy, monitor, and ensure a smooth go-live.' },
  { step: '06', title: 'Support', desc: 'We provide ongoing maintenance, updates, and optimization.' },
]

export default function ServicesPage() {
  const [data, setData] = useState<ServicesData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    dataService
      .getServices()
      .then(setData)
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
          {data?.sectionLabel}
        </motion.p>
        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={isHeroInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.1, ease }}
          className="font-display text-[clamp(2.5rem,6vw,5rem)] leading-[1.05] text-text-primary max-w-4xl"
        >
          {data?.title}
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 24 }}
          animate={isHeroInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.2, ease }}
          className="text-lg text-text-secondary mt-6 max-w-2xl leading-relaxed"
        >
          {data?.subtitle}
        </motion.p>
      </section>

      {/* Services Grid */}
      <section className="max-w-[1280px] mx-auto px-4 sm:px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {data?.services.map((service, i) => {
            const Icon = ICON_MAP[service.icon] ?? Code
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-80px' }}
                transition={{ duration: 0.5, delay: i * 0.1, ease }}
                className="group liquid-glass-card p-8 rounded-2xl hover:-translate-y-1 transition-transform"
              >
                <div className="flex items-start justify-between mb-6">
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-accent-lime/10 text-accent-lime">
                    <Icon size={24} />
                  </div>
                  <ArrowRight
                    size={20}
                    className="text-text-muted group-hover:text-accent-lime group-hover:translate-x-1 transition-all"
                  />
                </div>
                <h3 className="font-display text-2xl text-text-primary mb-3">
                  {service.title}
                </h3>
                <p className="text-text-muted text-base leading-relaxed">{service.description}</p>
              </motion.div>
            )
          })}
        </div>
      </section>

      {/* Process */}
      <section className="max-w-[1280px] mx-auto px-4 sm:px-6 py-16">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.6, ease }}
          className="font-display text-[clamp(2rem,5vw,4rem)] leading-[1.05] text-text-primary mb-12"
        >
          How We Work
        </motion.h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {PROCESS_STEPS.map((step, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ duration: 0.5, delay: i * 0.08, ease }}
              className="liquid-glass-card p-6 rounded-xl relative overflow-hidden"
            >
              <span className="absolute top-4 right-4 font-display text-4xl text-white/5">
                {step.step}
              </span>
              <div className="flex items-center gap-3 mb-3">
                <CheckCircle2 size={18} className="text-accent-lime" />
                <h3 className="font-display text-lg text-text-primary">{step.title}</h3>
              </div>
              <p className="text-text-muted text-base">{step.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  )
}
