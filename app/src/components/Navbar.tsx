import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X } from 'lucide-react'
import { Link, useLocation } from 'react-router'
import { useAppStore } from '../store/useAppStore'

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const location = useLocation()
  const navLinks = useAppStore((s) => s.navLinks)

  const isHome = location.pathname === '/'

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    if (href.startsWith('/#') && isHome) {
      e.preventDefault()
      setMobileOpen(false)
      const id = href.replace('/#', '')
      const el = document.getElementById(id)
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' })
      }
    } else if (href.startsWith('/#') && !isHome) {
      // Navigate to home then scroll
      setMobileOpen(false)
    } else {
      setMobileOpen(false)
    }
  }

  const isActive = (href: string) => {
    if (href === '/') return location.pathname === '/'
    if (href.startsWith('/#')) return isHome && location.hash === href.replace('/', '')
    return location.pathname === href || location.pathname.startsWith(href + '/')
  }

  return (
    <>
      <nav className="fixed top-4 left-1/2 -translate-x-1/2 w-[96%] max-w-[1280px] z-50 h-20 flex items-center transition-all duration-300 liquid-glass-nav">
        <div className="w-full mx-auto px-6 flex items-center justify-between">
          <Link to="/" className="flex items-center">
            <img
              src="/images/company_log.png"
              alt="Chakrawal Digital"
              className="h-16 w-auto object-contain"
            />
          </Link>

            <div className="hidden md:flex items-center gap-8">
              {navLinks.map((link) => (
                <Link
                  key={link.label}
                  to={link.href}
                  onClick={(e) => handleNavClick(e, link.href)}
                  className={`relative font-small text-small font-light tracking-[0.08em] transition-colors group ${
                    isActive(link.href) ? 'text-accent-lime' : 'text-text-secondary hover:text-text-primary'
                  }`}
                >
                  {link.label}
                  <span
                    className={`absolute -bottom-1 left-0 w-full h-px bg-accent-lime transition-transform origin-left ${
                      isActive(link.href) ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'
                    }`}
                  />
                </Link>
              ))}
            </div>

            <Link
              to="/contact"
              className="hidden md:inline-flex items-center px-6 py-2.5 rounded-full liquid-glass-btn text-text-primary font-small text-small font-medium tracking-[0.02em] transition-all hover:text-accent-lime"
            >
              Start a Project
            </Link>

            <button
              onClick={() => setMobileOpen(true)}
              className="md:hidden p-2 text-text-primary"
              aria-label="Open menu"
            >
              <Menu size={24} />
            </button>
          </div>
        </nav>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-[100] bg-bg-base/80 backdrop-blur-2xl flex flex-col items-center justify-center"
          >
            <button
              onClick={() => setMobileOpen(false)}
              className="absolute top-5 right-6 p-2 text-text-primary"
              aria-label="Close menu"
            >
              <X size={24} />
            </button>

            <div className="flex flex-col items-center gap-8">
              {navLinks.map((link, i) => (
                <motion.div
                  key={link.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                  transition={{ delay: i * 0.08, duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                >
                  <Link
                    to={link.href}
                    onClick={(e) => handleNavClick(e, link.href)}
                    className={`font-subheader text-subheader transition-colors ${
                      isActive(link.href) ? 'text-accent-lime' : 'text-text-primary hover:text-accent-lime'
                    }`}
                  >
                    {link.label}
                  </Link>
                </motion.div>
              ))}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                transition={{ delay: 0.4, duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              >
                <Link
                  to="/contact"
                  onClick={() => setMobileOpen(false)}
                  className="mt-4 px-8 py-3 rounded-full liquid-glass-btn text-text-primary font-small text-small font-medium transition-all hover:text-accent-lime"
                >
                  Start a Project
                </Link>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
