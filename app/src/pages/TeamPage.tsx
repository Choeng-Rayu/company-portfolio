import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Linkedin, Mail, Award, Users } from 'lucide-react'
import { dataService } from '../services/dataService'
import type { TeamData, TeamMember } from '../services/dataService'

const ease: [number, number, number, number] = [0.16, 1, 0.3, 1]

function TeamCard({ member, index }: { member: TeamMember; index: number }) {
  const bgGradient = `linear-gradient(135deg, hsl(${index * 60},70%,50%), hsl(${index * 60 + 30},70%,40%))`

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.6, delay: index * 0.1, ease }}
      className="liquid-glass-card p-8 rounded-2xl text-center group hover:-translate-y-1 transition-transform"
    >
      <div
        className="w-20 h-20 rounded-full mx-auto mb-4 flex items-center justify-center text-white font-display text-2xl"
        style={{ background: bgGradient }}
      >
        {member.initials}
      </div>
      <h3 className="font-display text-xl text-text-primary">{member.name}</h3>
      <p className="font-mono text-xs text-accent-lime mt-1">{member.role}</p>
      {member.bio && (
        <p className="text-text-muted text-base mt-4 leading-relaxed">{member.bio}</p>
      )}
      {member.skills && (
        <div className="flex flex-wrap justify-center gap-1.5 mt-4">
          {member.skills.map((skill) => (
            <span
              key={skill}
              className="px-2 py-0.5 rounded-md font-mono text-[0.6rem] tracking-wide text-text-muted border border-white/5 bg-white/[0.03]"
            >
              {skill}
            </span>
          ))}
        </div>
      )}
      <div className="flex items-center justify-center gap-3 mt-6">
        {member.linkedIn && (
          <a
            href={member.linkedIn}
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 rounded-full liquid-glass-btn text-text-muted hover:text-accent-lime transition-colors"
          >
            <Linkedin size={16} />
          </a>
        )}
        <a
          href={`mailto:${member.name.toLowerCase().replace(/\s+/g, '.')}@tomnerb.com`}
          className="p-2 rounded-full liquid-glass-btn text-text-muted hover:text-accent-lime transition-colors"
        >
          <Mail size={16} />
        </a>
      </div>
    </motion.div>
  )
}

export default function TeamPage() {
  const [data, setData] = useState<TeamData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    dataService
      .getTeam()
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
          {data?.title}
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
          className="flex flex-wrap gap-8 mt-10"
        >
          <div className="flex items-center gap-2 text-text-muted">
            <Users size={16} className="text-accent-lime" />
            <span className="font-mono text-xs">{data?.members.length} Members</span>
          </div>
          <div className="flex items-center gap-2 text-text-muted">
            <Award size={16} className="text-accent-lime" />
            <span className="font-mono text-xs">Expert Team</span>
          </div>
        </motion.div>
      </section>

      <section className="max-w-[1280px] mx-auto px-4 sm:px-6 py-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {data?.members.map((member, index) => (
            <TeamCard key={member.name} member={member} index={index} />
          ))}
        </div>
      </section>
    </div>
  )
}
