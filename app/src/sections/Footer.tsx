import { Facebook, Linkedin, Twitter, Instagram, MessageCircle, Github, ArrowUpRight } from 'lucide-react'
import { Link } from 'react-router'

const pageLinks = [
  { label: 'Home', href: '/' },
  { label: 'About', href: '/about' },
  { label: 'Services', href: '/services' },
  { label: 'Work', href: '/work' },
  { label: 'Blog', href: '/blog' },
  { label: 'Contact', href: '/contact' },
]

const socials = [
  { icon: Facebook, label: 'Facebook', href: 'https://facebook.com/chakrawaldigital' },
  { icon: Linkedin, label: 'LinkedIn', href: 'https://linkedin.com/company/chakrawaldigital' },
  { icon: MessageCircle, label: 'Telegram', href: 'https://t.me/chakrawaldigital' },
  { icon: Twitter, label: 'X', href: 'https://x.com/chakrawaldigital' },
  { icon: Instagram, label: 'Instagram', href: 'https://instagram.com/chakrawaldigital' },
  { icon: Github, label: 'GitHub', href: 'https://github.com/chakrawaldigital' },
]

export default function Footer() {
  return (
    <footer className="relative z-10 w-full bg-[#0A0A0B] border-t border-white/10">
      {/* CTA Section */}
      <div className="max-w-[1280px] mx-auto px-6 py-20 text-center">
        <p className="font-mono text-xs text-accent-lime uppercase tracking-widest mb-4">
          Ready to launch?
        </p>
        <h2 className="font-display text-5xl md:text-7xl lg:text-8xl font-bold text-white leading-none mb-6">
          LET'S WORK<br />
          <span className="text-accent-lime">TOGETHER</span>
        </h2>
        <p className="text-text-muted text-base md:text-lg max-w-xl mx-auto mb-10">
          Have a project in mind? We'd love to hear about it. Let's build something extraordinary.
        </p>
        <Link
          to="/contact"
          className="inline-flex items-center gap-2 bg-accent-lime text-black font-mono text-sm font-bold px-8 py-4 rounded-full hover:bg-white transition-colors duration-200"
        >
          Start a Project <ArrowUpRight size={16} />
        </Link>
      </div>

      {/* Divider */}
      <div className="border-t border-white/10" />

      {/* Bottom bar */}
      <div className="max-w-[1280px] mx-auto px-6 py-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Logo */}
          <Link to="/" className="flex items-center hover:opacity-80 transition-opacity">
            <img
              src="/images/company_log.png"
              alt="Chakrawal Digital"
              className="h-7 w-auto object-contain"
            />
          </Link>

          {/* Nav links */}
          <nav className="flex flex-wrap justify-center gap-5">
            {pageLinks.map((link) => (
              <Link
                key={link.label}
                to={link.href}
                className="font-mono text-xs text-text-muted hover:text-white transition-colors uppercase tracking-[0.04em]"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Socials */}
          <div className="flex items-center gap-4">
            {socials.map((social) => (
              <a
                key={social.label}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-text-muted hover:text-accent-lime transition-colors"
                aria-label={social.label}
              >
                <social.icon size={18} />
              </a>
            ))}
          </div>
        </div>

        <p className="font-mono text-[0.65rem] text-text-muted text-center mt-4">
          © {new Date().getFullYear()} Chakrawal Digital. Built in Phnom Penh, Cambodia. ·{' '}
          <Link to="/" className="hover:text-white transition-colors">Privacy Policy</Link>
        </p>
      </div>
    </footer>
  )
}
