import { useRef, useState, useEffect } from 'react';
import { motion, useInView } from 'framer-motion';
import { Copy, Check, Mail, Phone } from 'lucide-react';

const ease: [number, number, number, number] = [0.16, 1, 0.3, 1];

export default function Contact() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });
  const [copied, setCopied] = useState(false);
  const [contactData, setContactData] = useState<any>(null);

  useEffect(() => {
    fetch('/data/company_contact.json')
      .then((res) => res.json())
      .then(setContactData)
      .catch((err) => console.error('Failed to load contact data', err));
  }, []);


  const handleCopy = () => {
    const email = contactData?.contacts?.find((c: any) => c.type === 'email')?.value ?? '';
    if (email) {
      navigator.clipboard.writeText(email);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleScroll = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section
      id="contact"
      className="w-full py-[200px] bg-transparent relative overflow-hidden"
      ref={ref}
      style={{
        clipPath: 'polygon(0 80px, 100% 0, 100% 100%, 0 100%)',
        marginTop: '-80px',
        paddingTop: '280px',
      }}
    >
      {/* Accent glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse 60% 40% at 50% 0%, rgba(200,241,53,0.06) 0%, transparent 70%)',
        }}
      />

      <div className="relative max-w-[800px] mx-auto px-6 text-center">
          {/* Section label */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, ease }}
            className="font-mono text-xs tracking-[0.08em] uppercase text-accent-lime"
          >
            {contactData?.sectionLabel}
          </motion.p>

          {/* Title */}
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.1, duration: 0.6, ease }}
            className="font-display italic text-[clamp(2.5rem,5vw,5rem)] leading-[1.05] text-text-primary mt-4"
          >
            {contactData?.title}
          </motion.h2>

          {/* Subtitle */}
          {contactData?.subtitle && (
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.15, duration: 0.6, ease }}
              className="font-mono text-sm text-text-muted mt-2"
            >
              {contactData?.subtitle}
            </motion.p>
          )}

          {/* Action buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.3, duration: 0.6, ease }}
            className="flex flex-wrap justify-center gap-5 mt-12"
          >
            <a
              href="#"
              onClick={(e) => handleScroll(e, '#contact')}
              className="inline-flex items-center px-8 py-3.5 rounded-full liquid-glass-btn text-text-primary font-body text-base font-medium transition-all"
            >
              Start a Project
            </a>
            <a
              href="#"
              onClick={(e) => handleScroll(e, '#contact')}
              className="inline-flex items-center px-8 py-3.5 rounded-full liquid-glass-btn text-text-primary font-body text-base font-medium transition-all"
            >
              Book a Call →
            </a>
          </motion.div>

          {/* Contacts list */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ delay: 0.5, duration: 0.6, ease }}
            className="mt-8 flex flex-col items-center gap-4"
          >
            {contactData?.contacts?.map((c: any) => (
              <a
                key={c.type}
                href={c.href}
                className="font-mono text-sm text-text-secondary hover:text-accent-lime transition-colors inline-flex items-center gap-2 group"
                onClick={c.type === 'email' ? (e) => { e.preventDefault(); handleCopy(); } : undefined}
              >
                {c.type === 'email' ? <Mail size={14} /> : <Phone size={14} />}
                {c.value}
                {c.type === 'email' && (
                  <button
                    className="opacity-0 group-hover:opacity-100 transition-opacity"
                    aria-label="Copy email"
                  >
                    {copied ? <Check size={14} className="text-accent-lime" /> : <Copy size={14} />}
                  </button>
                )}
              </a>
            ))}
          </motion.div>

          {/* Tagline */}
          {contactData?.tagline && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={isInView ? { opacity: 1 } : {}}
              transition={{ delay: 0.6, duration: 0.6, ease }}
              className="font-mono text-sm text-text-muted mt-4"
            >
              {contactData?.tagline}
            </motion.p>
          )}
      </div>
    </section>
  );
}