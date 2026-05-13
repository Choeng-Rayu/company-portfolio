import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Copy, Check, Mail, Phone, MapPin, Send, MessageSquare } from 'lucide-react'
import { dataService } from '../services/dataService'
import type { ContactData } from '../services/dataService'

const ease: [number, number, number, number] = [0.16, 1, 0.3, 1]

const ICON_MAP: Record<string, React.ComponentType<{ size?: number; className?: string }>> = {
  Mail,
  Phone,
  MapPin,
}

export default function ContactPage() {
  const [data, setData] = useState<ContactData | null>(null)
  const [loading, setLoading] = useState(true)
  const [copied, setCopied] = useState(false)
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' })
  const [submitted, setSubmitted] = useState(false)

  useEffect(() => {
    dataService
      .getContact()
      .then(setData)
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
      </section>

      <section className="max-w-[1280px] mx-auto px-4 sm:px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2, ease }}
            className="space-y-6"
          >
            <h2 className="font-display text-2xl text-text-primary mb-6">
              Get in Touch
            </h2>
            {data?.contacts.map((contact, i) => {
              const Icon = ICON_MAP[contact.icon] ?? Mail
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.3 + i * 0.1, ease }}
                  className="liquid-glass-card p-6 rounded-xl flex items-center gap-4"
                >
                  <div className="w-10 h-10 rounded-full bg-accent-lime/10 flex items-center justify-center text-accent-lime flex-shrink-0">
                    <Icon size={18} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-mono text-[0.65rem] uppercase tracking-wide text-text-muted">
                      {contact.label}
                    </p>
                    <p className="text-text-primary text-sm truncate">{contact.value}</p>
                  </div>
                  {contact.type === 'email' && (
                    <button
                      onClick={handleCopy}
                      className="p-2 rounded-full liquid-glass-btn text-text-muted hover:text-accent-lime transition-colors flex-shrink-0"
                      title="Copy email"
                    >
                      {copied ? <Check size={14} /> : <Copy size={14} />}
                    </button>
                  )}
                </motion.div>
              )
            })}

            {/* Socials */}
            <div className="pt-4">
              <p className="font-mono text-xs uppercase tracking-wide text-text-muted mb-4">
                Follow Us
              </p>
              <div className="flex gap-3">
                {data?.socials.map((social, i) => (
                  <a
                    key={i}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 rounded-full liquid-glass-btn font-mono text-xs text-text-muted hover:text-accent-lime transition-colors"
                  >
                    {social.platform}
                  </a>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.3, ease }}
            className="liquid-glass-card p-8 rounded-2xl"
          >
            <div className="flex items-center gap-3 mb-6">
              <MessageSquare size={20} className="text-accent-lime" />
              <h2 className="font-display text-xl text-text-primary">Send a Message</h2>
            </div>
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
          </motion.div>
        </div>
      </section>
    </div>
  )
}
