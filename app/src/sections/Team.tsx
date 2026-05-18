import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Linkedin, Mail, Sparkles } from 'lucide-react';
import { useScrollAnimation } from '../hooks/useScrollAnimation';

interface TeamMember {
  name: string;
  role: string;
  initials: string;
  linkedIn: string;
  bio?: string;
  skills?: string[];
}

interface TeamData {
  sectionLabel: string;
  title: string;
  subtitle: string;
  members: TeamMember[];
}

const ease: [number, number, number, number] = [0.16, 1, 0.3, 1];

function SkillTag({ skill, index }: { skill: string; index: number }) {
  const colors = ['#C8F135', '#3CB371', '#4477DD', '#E05A20', '#C8F135', '#3CB371'];
  const color = colors[index % colors.length];
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
  );
}

function TeamCard({ member, index, isInView }: { member: TeamMember; index: number; isInView: boolean }) {
  const bgGradient = `linear-gradient(135deg, hsl(${index * 60},70%,50%), hsl(${index * 60 + 30},70%,40%))`;

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ delay: 0.2 + index * 0.08, duration: 0.6, ease }}
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
          <h4 className="text-lg font-medium text-text-primary">{member.name}</h4>
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
            aria-label={`${member.name}'s LinkedIn`}
          >
            <Linkedin size={14} />
          </a>
        )}
        <a
          href={`mailto:${member.name.toLowerCase().replace(/\s+/g, '.')}@chakrawaldigital.com`}
          className="p-2 rounded-lg liquid-glass-btn text-text-muted hover:text-accent-lime transition-colors"
          aria-label={`Email ${member.name}`}
        >
          <Mail size={14} />
        </a>
      </div>
    </motion.div>
  );
}

export default function Team() {
  const { ref, isInView } = useScrollAnimation('-100px');
  const [data, setData] = useState<TeamData | null>(null);

  useEffect(() => {
    fetch('/data/our_team.json')
      .then((res) => res.json())
      .then((json) => setData(json))
      .catch((err) => console.error('Failed to load team data:', err));
  }, []);

  if (!data) {
    return null;
  }

  return (
    <section id="team" className="w-full py-[140px] bg-transparent" ref={ref}>
      <div className="max-w-[1280px] mx-auto px-6">
        {/* Section header */}
        <div className="text-center mb-16">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, ease }}
            className="font-mono text-xs uppercase text-accent-lime"
          >
            {data.sectionLabel}
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.1, duration: 0.6, ease }}
            className="font-display text-[clamp(2.5rem,5vw,5rem)] leading-[1.05] text-text-primary mt-4"
          >
            {data.title}
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.2, duration: 0.6, ease }}
            className="text-lg text-text-secondary mt-2"
          >
            {data.subtitle}
          </motion.p>
        </div>

        {/* Team grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {data.members.map((member, i) => (
            <TeamCard key={member.name} member={member} index={i} isInView={isInView} />
          ))}
        </div>
      </div>
    </section>
  );
}
