import { Github, Linkedin, Twitter } from 'lucide-react';
import { useEffect, useState } from 'react';

const navLinks = [
  { label: 'Services', href: '#services' },
  { label: 'Work', href: '#work' },
  { label: 'Process', href: '#process' },
  { label: 'Team', href: '#team' },
  { label: 'Contact', href: '#contact' },
];

const socials = [
  { icon: Github, label: 'GitHub', href: '#' },
  { icon: Linkedin, label: 'LinkedIn', href: '#' },
  { icon: Twitter, label: 'Twitter', href: '#' },
];

export default function Footer() {
  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };
  const [aboutData, setAboutData] = useState<any>(null);

  useEffect(() => {
    fetch('/data/about_us.json')
      .then((res) => res.json())
      .then(setAboutData)
      .catch((err) => console.error('Failed to load about us data', err));
  }, []);

  return (
    <footer className="w-full py-12 border-t border-border-surface bg-transparent">
      <div className="max-w-[1280px] mx-auto px-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Logo */}
          <span className="font-mono text-sm tracking-[0.12em] uppercase text-text-primary">
            TOMNERB
          </span>

          {/* Nav links */}
          <nav className="flex flex-wrap justify-center gap-6">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={(e) => handleNavClick(e, link.href)}
                className="font-mono text-xs text-text-muted hover:text-text-secondary transition-colors uppercase tracking-[0.04em]"
              >
                {link.label}
              </a>
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
            &copy; {aboutData?.foundedYear || '2024'} TomNerb Digital Solutions. Engineered in {aboutData?.location || 'Phnom Penh'}{' '}
            <span role="img" aria-label="Cambodia">
              🇰🇭
            </span>{' '}
            ·{' '}
            <a href="#" onClick={(e) => e.preventDefault()} className="hover:text-text-secondary transition-colors">
              Privacy Policy
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}