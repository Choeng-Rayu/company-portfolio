import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { EASE_OUT_EXPO } from '@/lib/animation';
import { Copy, Check, Mail, Phone } from 'lucide-react';
import { useScrollAnimation } from '../hooks/useScrollAnimation';
import { dataService } from '../services/dataService';


export default function Contact() {
  const { ref, isInView } = useScrollAnimation('-100px');
  const [copied, setCopied] = useState(false);
  const [contactData, setContactData] = useState<any>(null);

  useEffect(() => {
    dataService.getContact()
      .then(setContactData)
      .catch(() => {});
  }, []);

  const handleCopy = () => {
    const email = contactData?.contacts?.find((c: any) => c.type === 'email')?.value ?? '';
    if (email) {
      navigator.clipboard.writeText(email);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <section id="contact" className="w-full py-32 bg-transparent relative overflow-hidden" ref={ref}>
      {/* Subtle lime glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse 50% 30% at 50% 100%, rgba(200,241,53,0.05) 0%, transparent 70%)' }}
      />

      <div className="relative max-w-[720px] mx-auto px-6 text-center">
        <motion.p
          initial={{ opacity: 0, y: 16 }} animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, ease: EASE_OUT_EXPO }}
          className="font-mono text-xs tracking-[0.12em] uppercase text-accent-lime mb-4"
        >
          {contactData?.sectionLabel ?? "Let's Connect"}
        </motion.p>

        <motion.h2
          initial={{ opacity: 0, y: 20 }} animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.1, duration: 0.6, ease: EASE_OUT_EXPO }}
          className="font-display text-[clamp(2.5rem,5vw,4.5rem)] leading-[1.05] text-text-primary"
        >
          {contactData?.title ?? 'Ready to Build Something?'}
        </motion.h2>

        {contactData?.subtitle && (
          <motion.p
            initial={{ opacity: 0, y: 16 }} animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.15, duration: 0.6, ease: EASE_OUT_EXPO }}
            className="font-mono text-sm text-text-muted mt-3 max-w-md mx-auto leading-relaxed"
          >
            {contactData.subtitle}
          </motion.p>
        )}

        {/* CTA buttons */}
        <motion.div
          initial={{ opacity: 0, y: 16 }} animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.25, duration: 0.6, ease: EASE_OUT_EXPO }}
          className="flex flex-wrap justify-center gap-4 mt-10"
        >
          <a
            href="/contact"
            className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full liquid-glass-btn text-text-primary font-mono text-xs uppercase tracking-widest"
          >
            Start a Project
          </a>
          <a
            href="/contact"
            className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full liquid-glass-btn text-text-primary font-mono text-xs uppercase tracking-widest"
          >
            Book a Call
          </a>
        </motion.div>

        {/* Contact info pills */}
        {contactData?.contacts?.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }} animate={isInView ? { opacity: 1 } : {}}
            transition={{ delay: 0.4, duration: 0.6, ease: EASE_OUT_EXPO }}
            className="mt-10 flex flex-wrap justify-center gap-3"
          >
            {contactData.contacts.map((c: any) => (
              <a
                key={c.type}
                href={c.href}
                onClick={c.type === 'email' ? (e: React.MouseEvent) => { e.preventDefault(); handleCopy(); } : undefined}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full liquid-glass border border-white/10 font-mono text-xs text-text-secondary hover:text-accent-lime hover:border-accent-lime/30 transition-all group"
              >
                {c.type === 'email' ? <Mail size={13} /> : <Phone size={13} />}
                {c.value}
                {c.type === 'email' && (
                  <span className="opacity-0 group-hover:opacity-100 transition-opacity">
                    {copied ? <Check size={12} className="text-accent-lime" /> : <Copy size={12} />}
                  </span>
                )}
              </a>
            ))}
          </motion.div>
        )}

        {contactData?.tagline && (
          <motion.p
            initial={{ opacity: 0 }} animate={isInView ? { opacity: 1 } : {}}
            transition={{ delay: 0.5, duration: 0.6, ease: EASE_OUT_EXPO }}
            className="font-mono text-xs text-text-muted mt-6 opacity-60"
          >
            {contactData.tagline}
          </motion.p>
        )}
      </div>
    </section>
  );
}
