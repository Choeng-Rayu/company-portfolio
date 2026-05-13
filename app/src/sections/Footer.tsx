import { Github, Linkedin, Twitter } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router'

const pageLinks = [
  { label: 'Home', href: '/' },
  { label: 'About', href: '/about' },
  { label: 'Services', href: '/services' },
  { label: 'Work', href: '/work' },
  { label: 'Team', href: '/team' },
  { label: 'Blog', href: '/blog' },
  { label: 'Contact', href: '/contact' },
]

const socials = [
  { icon: Github, label: 'GitHub', href: '#' },
  { icon: Linkedin, label: 'LinkedIn', href: '#' },
  { icon: Twitter, label: 'Twitter', href: '#' },
]

export default function Footer() {
  const [aboutData, setAboutData] = useState<any>(null)
  const location = useLocation()
  const isHome = location.pathname === '/'

  useEffect(() => {
    fetch('/data/about_us.json')
      .then((res) => res.json())
      .then(setAboutData)
      .catch((err) => console.error('Failed to load about us data', err))
  }, [])

  const handleScroll = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    if (href.startsWith('/#') && isHome) {
      e.preventDefault()
      const id = href.replace('/#', '')
      const el = document.getElementById(id)
      if (el) el.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <footer className="w-full py-12 border-t border-border-surface bg-transparent">
      <div className="max-w-[1280px] mx-auto px-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Logo */}
          <Link
            to="/"
            className="flex items-center hover:opacity-80 transition-opacity"
          >
            <img
              src="/images/company_log.png"
              alt="Universe Software"
              className="h-7 w-auto object-contain"
            />
          </Link>

          {/* Nav links */}
          <nav className="flex flex-wrap justify-center gap-6">
            {pageLinks.map((link) => (
              <Link
                key={link.label}
                to={link.href}
                onClick={(e) => handleScroll(e, link.href)}
                className="font-mono text-xs text-text-muted hover:text-text-secondary transition-colors uppercase tracking-[0.04em]"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Social icons */}
          <div className="flex items-center gap-4">
            {socials.map((social) => (
              <a
                key={social.label}
                href={social.href}
                onClick={(e) => e.preventDefault()}
                className="text-text-muted hover:text-accent-lime transition-colors"
                aria-label={social.label}
              >
                <social.icon size={20} />
              </a>
            ))}
          </div>
        </div>

        {/* Bottom row */}
        <div className="text-center mt-6">
          <p className="font-mono text-[0.7rem] text-text-muted">
            &copy; {aboutData?.foundedYear || '2024'} TomNerb Digital Solutions. Engineered in{' '}
            {aboutData?.location || 'Phnom Penh'}{' '}
            <span role="img" aria-label="Cambodia">
              🇰🇭
            </span>{' '}
            ·{' '}
            <Link to="/" className="hover:text-text-secondary transition-colors">
              Privacy Policy
            </Link>
          </p>
        </div>
      </div>
    </footer>
  )
}
