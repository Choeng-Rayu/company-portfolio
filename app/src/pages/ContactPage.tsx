import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Copy, Check, Mail, Phone, MapPin, Send, MessageSquare, Facebook, Linkedin, Github, Twitter, Instagram, MessageCircle, ArrowUpRight, Clock, Globe } from 'lucide-react'
import { dataService } from '../services/dataService'
import type { ContactData, MediaInfo } from '../services/dataService'
import Folder from '../components/Folder/Folder'
import { EASE_OUT_EXPO } from '@/lib/animation'
import PageLoader from '@/components/PageLoader'

const ICON_MAP: Record<string, React.ComponentType<{ size?: number; className?: string }>> = {
  Mail,
  Phone,
  MapPin,
}

const MEDIA_ICONS: Record<string, React.ComponentType<{ size?: number; className?: string }>> = {
  Facebook,
  Linkedin,
  Github,
  Twitter,
  Instagram,
  MessageCircle,
}

export default function ContactPage() {
  const [data, setData] = useState<ContactData | null>(null)
  const [mediaInfo, setMediaInfo] = useState<MediaInfo[] | null>(null)
  const [loading, setLoading] = useState(true)
  const [copied, setCopied] = useState(false)
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' })
  const [submitted, setSubmitted] = useState(false)

  useEffect(() => {
    Promise.all([
      dataService.getContact(),
      dataService.getMediaInfo()
    ])
      .then(([contactData, mediaData]) => {
        setData(contactData)
        setMediaInfo(mediaData)
      })
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  const handleCopy = () => {
    const email = data?.contacts?.find((c) => c.type === 'email')?.value ?? ''
    if (email) {
      navigator.clipboard.writeText(email)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitted(true)
    setTimeout(() => {
      setSubmitted(false)
      setForm({ name: '', email: '', subject: '', message: '' })
    }, 3000)
  }

  if (loading) {
    return <PageLoader />
  }

  return (
    <div className="pt-24 pb-20">
      {/* Header */}
      <section className="max-w-[1280px] mx-auto px-4 sm:px-6 py-16 md:py-24">
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
          {data?.title}
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2, ease: EASE_OUT_EXPO }}
          className="text-lg text-text-secondary mt-6 max-w-2xl leading-relaxed"
        >
          {data?.subtitle}
        </motion.p>
      </section>

      {/* Contact Grid */}
      <section className="max-w-[1280px] mx-auto px-4 sm:px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          {/* Left: Contact Info + Socials */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2, ease: EASE_OUT_EXPO }}
            className="lg:col-span-2 space-y-6"
          >
            {/* Contact Cards */}
            <div className="space-y-4">
              {data?.contacts.map((contact, i) => {
                const Icon = ICON_MAP[contact.icon] ?? Mail
                return (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.3 + i * 0.1, ease: EASE_OUT_EXPO }}
                    className="liquid-glass-card p-5 rounded-xl flex items-center gap-4"
                  >
                    <div className="w-11 h-11 rounded-xl bg-accent-lime/10 flex items-center justify-center text-accent-lime flex-shrink-0">
                      <Icon size={18} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-mono text-[0.6rem] uppercase tracking-wide text-text-muted">
                        {contact.label}
                      </p>
                      <p className="text-text-primary text-sm truncate">{contact.value}</p>
                    </div>
                    {contact.type === 'email' && (
                      <button
                        onClick={handleCopy}
                        className="p-2 rounded-lg liquid-glass-btn text-text-muted hover:text-accent-lime transition-colors flex-shrink-0"
                        title="Copy email"
                      >
                        {copied ? <Check size={14} /> : <Copy size={14} />}
                      </button>
                    )}
                  </motion.div>
                )
              })}
            </div>

            {/* Working Hours */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.6, ease: EASE_OUT_EXPO }}
              className="liquid-glass-card p-5 rounded-xl"
            >
              <div className="flex items-center gap-2 mb-3">
                <Clock size={16} className="text-accent-lime" />
                <span className="font-mono text-xs text-text-muted uppercase tracking-wide">Working Hours</span>
              </div>
              <div className="space-y-1.5">
                <div className="flex justify-between text-sm">
                  <span className="text-text-muted">Monday – Friday</span>
                  <span className="text-text-primary">8:00 AM – 6:00 PM</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-text-muted">Saturday</span>
                  <span className="text-text-primary">9:00 AM – 1:00 PM</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-text-muted">Sunday</span>
                  <span className="text-text-primary">Closed</span>
                </div>
              </div>
            </motion.div>

            {/* Response Time */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.7, ease: EASE_OUT_EXPO }}
              className="liquid-glass-card p-5 rounded-xl"
            >
              <div className="flex items-center gap-2 mb-2">
                <Globe size={16} className="text-accent-lime" />
                <span className="font-mono text-xs text-text-muted uppercase tracking-wide">Response Time</span>
              </div>
              <p className="text-sm text-text-secondary leading-relaxed">
                We typically respond within <span className="text-accent-lime font-medium">24 hours</span> on business days. For urgent inquiries, reach out via Telegram for faster replies.
              </p>
            </motion.div>

            {/* Socials */}
            <div className="pt-2">
              <p className="font-mono text-xs uppercase tracking-wide text-text-muted mb-4">
                Follow Us
              </p>
              <div className="flex flex-wrap gap-3">
                {mediaInfo?.map((media, i) => {
                  const Icon = MEDIA_ICONS[media.icon] || Facebook
                  return (
                    <motion.a
                      key={i}
                      href={media.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.8 + i * 0.05, duration: 0.4, ease: EASE_OUT_EXPO }}
                      className="flex items-center gap-2.5 px-4 py-2.5 rounded-xl liquid-glass-btn hover:border-white/15 transition-all group"
                      title={media.platform}
                    >
                      <Icon size={16} className="text-text-muted group-hover:text-accent-lime transition-colors" />
                      <span className="font-mono text-xs text-text-muted group-hover:text-text-primary transition-colors">
                        {media.platform}
                      </span>
                    </motion.a>
                  )
                }) || []}
              </div>
            </div>

            {/* 3D Folder Socials (visual accent) */}
            <div className="pt-2">
              <p className="font-mono text-xs uppercase tracking-wide text-text-muted mb-4">
                Connect With Us
              </p>
              <div className="flex pl-4 h-24">
                <Folder
                  size={0.8}
                  color="#C8F135"
                  items={mediaInfo?.map((media, i) => {
                    const Icon = MEDIA_ICONS[media.icon] || Facebook
                    return (
                      <a
                        key={i}
                        href={media.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full h-full flex items-center justify-center text-gray-800 hover:text-accent-lime transition-colors"
                        title={media.platform}
                      >
                        <Icon size={24} />
                      </a>
                    )
                  }) || []}
                />
              </div>
            </div>
          </motion.div>

          {/* Right: Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.3, ease: EASE_OUT_EXPO }}
            className="lg:col-span-3 liquid-glass-card p-8 rounded-2xl"
          >
            <div className="flex items-center gap-3 mb-2">
              <MessageSquare size={20} className="text-accent-lime" />
              <h2 className="font-display text-xl text-text-primary">Send a Message</h2>
            </div>
            <p className="text-sm text-text-muted mb-6">
              Tell us about your project, your timeline, and your goals. We will get back to you with a plan.
            </p>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-mono text-[0.65rem] uppercase tracking-wide text-text-muted mb-1.5">
                    Name
                  </label>
                  <input
                    type="text"
                    required
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-text-primary text-sm placeholder:text-text-muted/50 focus:outline-none focus:border-accent-lime/50 transition-colors"
                    placeholder="Your name"
                  />
                </div>
                <div>
                  <label className="block font-mono text-[0.65rem] uppercase tracking-wide text-text-muted mb-1.5">
                    Email
                  </label>
                  <input
                    type="email"
                    required
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-text-primary text-sm placeholder:text-text-muted/50 focus:outline-none focus:border-accent-lime/50 transition-colors"
                    placeholder="you@company.com"
                  />
                </div>
              </div>
              <div>
                <label className="block font-mono text-[0.65rem] uppercase tracking-wide text-text-muted mb-1.5">
                  Subject
                </label>
                <input
                  type="text"
                  required
                  value={form.subject}
                  onChange={(e) => setForm({ ...form, subject: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-text-primary text-sm placeholder:text-text-muted/50 focus:outline-none focus:border-accent-lime/50 transition-colors"
                  placeholder="Project inquiry"
                />
              </div>
              <div>
                <label className="block font-mono text-[0.65rem] uppercase tracking-wide text-text-muted mb-1.5">
                  Message
                </label>
                <textarea
                  required
                  rows={5}
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-text-primary text-sm placeholder:text-text-muted/50 focus:outline-none focus:border-accent-lime/50 transition-colors resize-none"
                  placeholder="Tell us about your project..."
                />
              </div>
              <button
                type="submit"
                disabled={submitted}
                className="w-full inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full liquid-glass-btn text-text-primary font-mono text-xs uppercase tracking-wide hover:text-accent-lime transition-colors disabled:opacity-50"
              >
                <Send size={14} />
                {submitted ? 'Message Sent!' : 'Send Message'}
              </button>
            </form>

            {/* Trust badges */}
            <div className="mt-8 pt-6 border-t border-white/5">
              <p className="font-mono text-[0.6rem] uppercase tracking-wide text-text-muted mb-3">
                Trusted by businesses across Cambodia
              </p>
              <div className="flex flex-wrap gap-2">
                {['MR Training', 'Oddar Meanchey Gov', 'InnoLab', 'VersionDragon'].map((client) => (
                  <span
                    key={client}
                    className="px-3 py-1.5 rounded-lg font-mono text-[0.65rem] text-text-muted border border-white/5 bg-white/[0.03]"
                  >
                    {client}
                  </span>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="max-w-[1280px] mx-auto px-4 sm:px-6 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5, ease: EASE_OUT_EXPO }}
          className="liquid-glass-card rounded-2xl p-8 md:p-12 text-center relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-64 h-64 rounded-full blur-[100px] opacity-[0.06] pointer-events-none bg-accent-lime" />
          <h3 className="font-display text-2xl md:text-3xl text-text-primary mb-3 relative z-10">
            Prefer to chat directly?
          </h3>
          <p className="text-text-muted max-w-md mx-auto mb-6 relative z-10">
            Schedule a free 30-minute consultation. We will discuss your project and give you honest advice — no pressure, no obligation.
          </p>
          <a
            href="https://t.me/chakrawaldigital"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-accent-lime text-black font-mono text-xs font-bold uppercase tracking-wide hover:bg-white transition-colors relative z-10"
          >
            <MessageCircle size={14} />
            Chat on Telegram
            <ArrowUpRight size={14} />
          </a>
        </motion.div>
      </section>
    </div>
  )
}
