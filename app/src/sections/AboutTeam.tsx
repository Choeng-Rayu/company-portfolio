import { motion } from 'framer-motion';
import { Linkedin, Mail, Sparkles, Code, Layout, ShieldCheck, Zap } from 'lucide-react';
import { EASE_OUT_EXPO } from '@/lib/animation';
import Container from '@/components/Container';
import SectionHeader from '@/components/SectionHeader';

interface TeamMember {
  name: string;
  role: string;
  initials: string;
  bio: string;
  skills: string[];
  icon: any;
}

const TEAM_MEMBERS: TeamMember[] = [
  {
    name: "Sok Dara",
    role: "Founder & Lead Strategist",
    initials: "SD",
    bio: "Visionary leader with 10+ years in digital transformation. Dedicated to building tech that empowers Cambodian SMEs.",
    skills: ["Strategy", "Product Design", "Leadership"],
    icon: ShieldCheck
  },
  {
    name: "Keo Sopheap",
    role: "Lead Full-Stack Developer",
    initials: "KS",
    bio: "Architect of complex systems. Specializes in scalable cloud infrastructure and performance-driven applications.",
    skills: ["React", "Node.js", "AWS"],
    icon: Code
  },
  {
    name: "Chan Rithy",
    role: "Senior UI/UX Designer",
    initials: "CR",
    bio: "Focuses on creating intuitive, culturally-resonant digital experiences that delight users and drive engagement.",
    skills: ["Figma", "Design Systems", "UX Research"],
    icon: Layout
  },
  {
    name: "Meas Sokhary",
    role: "Project Delivery Manager",
    initials: "MS",
    bio: "Ensures every project is delivered on time with impeccable quality. The bridge between business and technology.",
    skills: ["Agile", "Scrum", "Management"],
    icon: Zap
  }
];

function TeamMemberCard({ member, index }: { member: TeamMember; index: number }) {
  const bgGradient = `linear-gradient(135deg, hsl(${index * 90},70%,50%), hsl(${index * 90 + 40},70%,40%))`;
  const Icon = member.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.7, delay: index * 0.15, ease: EASE_OUT_EXPO }}
      className="group relative"
    >
      <div className="liquid-glass-card p-6 md:p-8 rounded-[2rem] flex flex-col h-full hover:-translate-y-2 transition-transform duration-500 border border-white/5">
        {/* Header Section */}
        <div className="flex items-start justify-between mb-6">
          <div
            className="w-20 h-20 rounded-2xl flex items-center justify-center text-white font-header text-2xl shadow-2xl group-hover:scale-110 group-hover:rotate-3 transition-transform duration-500"
            style={{ background: bgGradient }}
          >
            {member.initials}
          </div>
          <div className="w-10 h-10 rounded-full bg-accent-lime/10 flex items-center justify-center text-accent-lime">
            <Icon size={20} />
          </div>
        </div>

        {/* Info */}
        <div className="flex-1">
          <h4 className="font-header text-xl text-text-primary group-hover:text-accent-lime transition-colors duration-300">
            {member.name}
          </h4>
          <p className="font-small text-small text-accent-dim mt-1 uppercase tracking-wider">
            {member.role}
          </p>
          <p className="font-body text-body text-text-muted mt-4 leading-relaxed line-clamp-3 group-hover:line-clamp-none transition-all duration-300">
            {member.bio}
          </p>
        </div>
        
        {/* Skills */}
        <div className="flex flex-wrap gap-2 mt-6">
          {member.skills.map((skill) => (
            <span key={skill} className="px-3 py-1 rounded-full bg-white/5 border border-white/10 font-small text-[10px] text-text-secondary">
              {skill}
            </span>
          ))}
        </div>

        {/* Social Actions */}
        <div className="flex gap-3 mt-8 pt-6 border-t border-white/5">
          <a href="#" className="p-2.5 rounded-xl bg-white/5 text-text-muted hover:text-accent-lime hover:bg-accent-lime/10 transition-all duration-300">
            <Linkedin size={18} />
          </a>
          <a href="#" className="p-2.5 rounded-xl bg-white/5 text-text-muted hover:text-accent-lime hover:bg-accent-lime/10 transition-all duration-300">
            <Mail size={18} />
          </a>
        </div>
      </div>
    </motion.div>
  );
}

export default function AboutTeam() {
  return (
    <section className="py-12 md:py-32 bg-transparent relative">
      {/* Background Decorative Element */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-accent-lime/5 rounded-full blur-[160px] pointer-events-none" />

      <Container>
        <div className="mb-10 md:mb-20">
          <SectionHeader
            label="OUR TALENT"
            title="The Visionaries Behind Chakrawal"
            subtitle="Meet our diverse team of engineers and designers committed to transforming Cambodia's digital landscape."
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-10">
          {TEAM_MEMBERS.map((member, i) => (
            <TeamMemberCard key={member.name} member={member} index={i} />
          ))}
        </div>

        {/* Join Us CTA */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.6, ease: EASE_OUT_EXPO }}
          className="mt-16 md:mt-20 p-8 md:p-12 rounded-[2rem] md:rounded-[2.5rem] bg-bg-surface border border-white/5 text-center relative overflow-hidden group"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-accent-lime/5 via-transparent to-accent-lime/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
          
          <div className="relative z-10 max-w-2xl mx-auto">
            <div className="w-16 h-16 rounded-full bg-accent-lime/10 flex items-center justify-center text-accent-lime mx-auto mb-6">
              <Sparkles size={32} />
            </div>
            <h3 className="font-header text-3xl text-text-primary mb-4">Want to Join Our Mission?</h3>
            <p className="font-body text-body text-text-secondary mb-8">
              We're always looking for talented individuals who are passionate about building the future of technology in Cambodia.
            </p>
            <a 
              href="/contact" 
              className="inline-flex items-center px-10 py-4 rounded-full bg-accent-lime text-bg-base font-header font-bold hover:shadow-[0_0_30px_rgba(200,241,53,0.4)] transition-all duration-300 transform hover:scale-105 active:scale-95"
            >
              View Open Positions
            </a>
          </div>
        </motion.div>
      </Container>
    </section>
  );
}
