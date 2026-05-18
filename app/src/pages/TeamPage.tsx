import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Linkedin, Mail, Sparkles, Users, Award } from 'lucide-react'
import { dataService } from '../services/dataService'
import type { TeamData, TeamMember } from '../services/dataService'

const ease: [number, number, number, number] = [0.16, 1, 0.3, 1]

function SkillTag({ skill, index }: { skill: string; index: number }) {
  const colors = ['#C8F135', '#3CB371', '#4477DD', '#E05A20', '#C8F135', '#3CB371']
  const color = colors[index % colors.length]
  return (
    <span
      className="px-2.5 py-1 rounded-md font-mono text-[0.6rem] tracking-wide border"
      style={{
        background: `${color}10`,
        borderColor: `${color}25`,
        color,
      }}
    >
      {skill}
    </span>
  )
}

function TeamCard({ member, index }: { member: TeamMember; index: number }) {
  const bgGradient = `linear-gradient(135deg, hsl(${index * 60},70%,50%), hsl(${index * 60 + 30},70%,40%))`

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.6, delay: index * 0.1, ease }}
      className="liquid-glass-card p-6 rounded-2xl group hover:-translate-y-1 transition-transform duration-300"
    >
      {/* Header */}
      <div className="flex items-center gap-4 mb-4">
        <div
          className="w-14 h-14 rounded-xl flex items-center justify-center text-white font-display text-lg font-bold flex-shrink-0"
          style={{ background: bgGradient }}
        >
          {member.initials}
        </div>
        <div>
          <h3 className="font-display text-lg text-text-primary">{member.name}</h3>
          <p className="font-mono text-xs text-accent-lime">{member.role}</p>
        </div>
      </div>

      {/* Bio */}
      {member.bio && (
        <p className="text-sm text-text-muted leading-relaxed mb-4">
          {member.bio}
        </p>
      )}

      {/* Skills */}
      {member.skills && member.skills.length > 0 && (
        <div className="mb-4">
          <div className="flex items-center gap-1.5 mb-2">
            <Sparkles size={12} className="text-accent-lime" />
            <span className="font-mono text-[0.6rem] uppercase tracking-wide text-text-muted">Talents</span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {member.skills.map((skill, i) => (
              <SkillTag key={skill} skill={skill} index={i} />
            ))}
          </div>
        </div>
      )}

      {/* Social links */}
      <div className="flex items-center gap-2 pt-3 border-t border-white/5">
        {member.linkedIn && (
          <a
            href={member.linkedIn}
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 rounded-lg liquid-glass-btn text-text-muted hover:text-accent-lime transition-colors"
          >
            <Linkedin size={14} />
          </a>
        )}
        <a
          href={`mailto:${member.name.toLowerCase().replace(/\s+/g, '.')}@chakrawaldigital.com`}
          className="p-2 rounded-lg liquid-glass-btn text-text-muted hover:text-accent-lime transition-colors"
        >
          <Mail size={14} />
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
        <div className="font-mono text-xs text-text-muted animate-pulse">Loading...</div>
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
