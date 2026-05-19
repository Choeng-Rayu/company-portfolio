/**
 * ServicesNexus
 * ─────────────
 * A 3D Scrolling Nexus, scoped to /services only.
 *
 *  Desktop (≥ 1024px):
 *    • Pinned split-screen.
 *    • Left column: bold category title + description, cross-faded between stages.
 *    • Right column: 3D-perspective service cards that stagger in (y / opacity / rotationX),
 *      tied to scroll progress via ScrollTrigger scrub.
 *    • Hover lifts the card in 3D space with a soft elastic spring + glow.
 *
 *  Mobile (< 1024px):
 *    • Pinning disabled. Vertical stacked timeline.
 *    • Each card fades + slightly scales up as it enters the viewport.
 */

import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import {
  ShoppingBag,
  Smartphone,
  Settings,
  Bot,
  Workflow,
  Layout,
  PenTool,
  Palette,
  Component,
  Box,
  Sparkles,
  Award,
  Brush,
  Presentation,
  Video,
  Image as ImageIcon,
  Mail,
  FileText,
  Megaphone,
  Search,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

/* ──────────────────────────────────────────────────────────────────────────
 * Content matrix
 * ──────────────────────────────────────────────────────────────────────── */

interface ServiceItem {
  title: string;
  blurb: string;
  Icon: LucideIcon;
}

interface Category {
  id: string;
  number: string;
  title: string;
  description: string;
  accent: string;
  services: ServiceItem[];
}

const CATEGORIES: Category[] = [
  {
    id: 'custom-software',
    number: '01',
    title: 'Custom Software & Automation',
    description:
      'Bespoke systems and intelligent workflows engineered to scale with your operation.',
    accent: '#C8F135', // accent-lime — primary brand
    services: [
      {
        title: 'Build E-commerce Websites',
        blurb:
          'Storefronts that load fast, convert higher, and integrate with local payment rails.',
        Icon: ShoppingBag,
      },
      {
        title: 'Build Mobile Apps',
        blurb: 'iOS, Android, and PWA experiences crafted for your end users.',
        Icon: Smartphone,
      },
      {
        title: 'System Management',
        blurb:
          'Operational dashboards with role-based control, audit trails, and bilingual UI.',
        Icon: Settings,
      },
      {
        title: 'Auto-reply Bots (Telegram)',
        blurb:
          'Conversational interfaces that handle tickets, orders, and FAQs around the clock.',
        Icon: Bot,
      },
      {
        title: 'Workflow Automations',
        blurb: 'Stitch tools, trigger flows, and remove the manual middle.',
        Icon: Workflow,
      },
    ],
  },
  {
    id: 'design',
    number: '02',
    title: 'Digital Product & Design',
    description:
      'Interfaces that feel inevitable — research-led, system-driven, beautifully detailed.',
    accent: '#A8E635', // a softer, brand-aligned green
    services: [
      {
        title: 'Websites & Landing Pages',
        blurb: 'High-conversion pages tuned for your campaigns and audiences.',
        Icon: Layout,
      },
      {
        title: 'Wireframes',
        blurb: 'Architecture before aesthetics — flows that map to real user goals.',
        Icon: PenTool,
      },
      {
        title: 'UX/UI Design',
        blurb: 'Polished interfaces grounded in usability, accessibility, and craft.',
        Icon: Palette,
      },
      {
        title: 'Design Systems',
        blurb: 'Token-based, scalable component libraries your engineers will love.',
        Icon: Component,
      },
      {
        title: '3D Animation',
        blurb: 'Cinematic web moments built with WebGL and code-driven motion.',
        Icon: Box,
      },
    ],
  },
  {
    id: 'brand',
    number: '03',
    title: 'Brand & Creative Strategy',
    description:
      'A clear voice and a sharp identity, applied consistently across every touchpoint.',
    accent: '#E5E5EA', // cool neutral, sits well against bg-base
    services: [
      {
        title: 'Brand Strategy & Identity',
        blurb: 'Positioning, voice, and visual systems that define your category.',
        Icon: Sparkles,
      },
      {
        title: 'Brand Collateral',
        blurb:
          'Print, digital, and motion assets that travel anywhere your brand goes.',
        Icon: Award,
      },
      {
        title: 'Graphic Design',
        blurb: 'Layouts, posters, and visuals built to stop the scroll.',
        Icon: Brush,
      },
      {
        title: 'Slide Decks',
        blurb: 'Investor-ready presentations engineered for narrative and clarity.',
        Icon: Presentation,
      },
      {
        title: 'Video Editing',
        blurb: 'Story-first cuts, motion graphics, and ad-ready output.',
        Icon: Video,
      },
    ],
  },
  {
    id: 'marketing',
    number: '04',
    title: 'Marketing & Campaigns',
    description:
      'Demand engines that put the right message in front of the right audience at the right cost.',
    accent: '#8FAF20', // accent-dim — earthy counterpart of accent-lime
    services: [
      {
        title: 'Digital Ad Banners',
        blurb: 'Static and motion creatives optimized per channel and audience.',
        Icon: ImageIcon,
      },
      {
        title: 'Email Automation',
        blurb: 'Lifecycle flows that nurture leads from sign-up to revenue.',
        Icon: Mail,
      },
      {
        title: 'Content & Copywriting',
        blurb: 'Words that rank, persuade, and reflect your brand voice.',
        Icon: FileText,
      },
      {
        title: 'Advertising Campaigns',
        blurb: 'End-to-end paid strategy across Meta, Google, and TikTok.',
        Icon: Megaphone,
      },
      {
        title: 'Keyword Research',
        blurb: 'SEO foundations that compound traffic over time.',
        Icon: Search,
      },
    ],
  },
];

const INACTIVE_DOT = 'rgba(255, 255, 255, 0.16)';

/* ──────────────────────────────────────────────────────────────────────────
 * Hover spring (3D lift) — shared by desktop & mobile
 * ──────────────────────────────────────────────────────────────────────── */

const onCardEnter = (e: React.MouseEvent<HTMLElement>) => {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const accent = e.currentTarget.dataset.accent ?? '#C8F135';
  gsap.to(e.currentTarget, {
    y: -10,
    rotationX: 6,
    rotationY: -3,
    scale: 1.025,
    duration: 0.55,
    ease: 'elastic.out(1, 0.55)',
    boxShadow: `0 28px 60px rgba(0,0,0,0.55), 0 0 0 1px ${accent}33, 0 0 40px ${accent}22`,
    overwrite: 'auto',
  });
};

const onCardLeave = (e: React.MouseEvent<HTMLElement>) => {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  gsap.to(e.currentTarget, {
    y: 0,
    rotationX: 0,
    rotationY: 0,
    scale: 1,
    duration: 0.5,
    ease: 'expo.out',
    boxShadow: '0 10px 40px rgba(0,0,0,0.45)',
    overwrite: 'auto',
  });
};

/* ──────────────────────────────────────────────────────────────────────────
 * Component
 * ──────────────────────────────────────────────────────────────────────── */

export default function ServicesNexus() {
  const sectionRef = useRef<HTMLElement>(null);
  // Initialize from window so first paint matches reality (no SSR in this Vite app).
  const [isDesktop, setIsDesktop] = useState(() =>
    typeof window !== 'undefined'
      ? window.matchMedia('(min-width: 1024px)').matches
      : true,
  );

  useEffect(() => {
    const mq = window.matchMedia('(min-width: 1024px)');
    const update = () => setIsDesktop(mq.matches);
    update();
    mq.addEventListener('change', update);
    return () => mq.removeEventListener('change', update);
  }, []);

  useLayoutEffect(() => {
    if (!sectionRef.current) return;

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const refreshTimers: number[] = [];

    const ctx = gsap.context(() => {
      const root = sectionRef.current!;

      /* ── Desktop: pinned 3D nexus ───────────────────────────────────── */
      if (isDesktop && !reduceMotion) {
        const stages = gsap.utils.toArray<HTMLElement>('[data-stage]', root);
        const headers = gsap.utils.toArray<HTMLElement>('[data-header]', root);
        const dots = gsap.utils.toArray<HTMLElement>('[data-stage-dot]', root);
        if (stages.length === 0) return;

        // ── Initial states ───────────────────────────────────────────────
        stages.forEach((s, i) => {
          const cards = s.querySelectorAll<HTMLElement>('.svc-card');
          if (i === 0) {
            gsap.set(s, { autoAlpha: 1, y: 0 });
            gsap.set(cards, { y: 0, opacity: 1, rotationX: 0 });
          } else {
            gsap.set(s, { autoAlpha: 0, y: 40 });
            gsap.set(cards, { y: 120, opacity: 0, rotationX: -45 });
          }
        });
        headers.forEach((h, i) => {
          gsap.set(h, { autoAlpha: i === 0 ? 1 : 0, y: i === 0 ? 0 : 32 });
        });
        dots.forEach((d, i) => {
          gsap.set(d, {
            backgroundColor: i === 0 ? d.dataset.accent ?? '#C8F135' : INACTIVE_DOT,
          });
        });

        // ── Pinned timeline: handles only the (n-1) transitions ──────────
        const transitions = stages.length - 1; // 4 stages → 3 transitions
        const tl = gsap.timeline({
          defaults: { ease: 'expo.out' },
          scrollTrigger: {
            trigger: '.nexus-pin',
            start: 'top top',
            end: () => `+=${transitions * window.innerHeight * 1.1}`,
            pin: true,
            pinSpacing: true,
            pinType: 'fixed',
            anticipatePin: 1,
            scrub: 2.2, // Increased for a more "elastic" and smooth transition
            invalidateOnRefresh: true,
          },
        });

        // ── On-mount entrance for stage-0 cards ──────────────────────────
        const stage0Cards = stages[0].querySelectorAll<HTMLElement>('.svc-card');
        gsap.from(stage0Cards, {
          y: 80,
          opacity: 0,
          rotationX: -30,
          duration: 0.9,
          stagger: 0.08,
          ease: 'expo.out',
          delay: 0.45, // wait for PageTransition fade-in to settle
        });

        for (let i = 1; i < stages.length; i++) {
          const start = i - 1; // each transition is 1 timeline unit
          const prev = stages[i - 1];
          const prevCards = prev.querySelectorAll<HTMLElement>('.svc-card');
          const cur = stages[i];
          const curCards = cur.querySelectorAll<HTMLElement>('.svc-card');
          const curIcons = cur.querySelectorAll<HTMLElement>('.svc-card-icon');

          // 1. Previous Stage Exits
          // Move previous stage up and out quickly
          tl.to(prev, { autoAlpha: 0, y: -40, duration: 0.4 }, start);
          tl.to(prevCards, { 
            y: -60, 
            opacity: 0, 
            rotationX: 20, 
            duration: 0.4, 
            stagger: 0.03 
          }, start);
          tl.to(headers[i - 1], { autoAlpha: 0, y: -20, duration: 0.3 }, start);
          tl.to(dots[i - 1], { backgroundColor: INACTIVE_DOT, duration: 0.3 }, start);

          // 2. Current Stage Enters
          // Start bringing in the new stage as the old one is fading out
          tl.to(cur, { autoAlpha: 1, y: 0, duration: 0.4 }, start + 0.2);
          tl.to(headers[i], { autoAlpha: 1, y: 0, duration: 0.4 }, start + 0.2);
          tl.to(
            dots[i],
            { backgroundColor: dots[i].dataset.accent ?? '#C8F135', duration: 0.3 },
            start + 0.2,
          );

          // Cards arrive with a slight delay for clarity
          tl.to(
            curCards,
            { y: 0, opacity: 1, rotationX: 0, duration: 0.6, stagger: 0.06 },
            start + 0.3,
          );

          // Subtle parallax on icons
          tl.to(curIcons, { y: -16, ease: 'none', duration: 0.6 }, start + 0.4);
        }
      }

      /* ── Mobile / reduced-motion: stacked vertical timeline ─────────── */
      if (!isDesktop && !reduceMotion) {
        gsap.utils.toArray<HTMLElement>('.svc-card', root).forEach((card) => {
          gsap.fromTo(
            card,
            { opacity: 0, y: 50, scale: 0.96 },
            {
              opacity: 1,
              y: 0,
              scale: 1,
              duration: 0.7,
              ease: 'expo.out',
              scrollTrigger: {
                trigger: card,
                start: 'top 88%',
                toggleActions: 'play none none reverse',
              },
            },
          );
        });

        gsap.utils.toArray<HTMLElement>('.svc-cat-mobile-header', root).forEach((h) => {
          gsap.fromTo(
            h,
            { opacity: 0, x: -28 },
            {
              opacity: 1,
              x: 0,
              duration: 0.6,
              ease: 'expo.out',
              scrollTrigger: {
                trigger: h,
                start: 'top 90%',
                toggleActions: 'play none none reverse',
              },
            },
          );
        });
      }
    }, sectionRef);

    /*
     * Robust refresh strategy.
     */
    const onLoad = () => ScrollTrigger.refresh();
    if (document.readyState === 'complete') {
      window.setTimeout(onLoad, 50);
    } else {
      window.addEventListener('load', onLoad, { once: true });
    }

    return () => {
      window.removeEventListener('load', onLoad);
      ctx.revert();
    };
  }, [isDesktop]);

  return (
    <section
      ref={sectionRef}
      id="services-nexus"
      className="relative w-full"
      style={{ background: 'transparent' }}
    >
      {/* ── Section heading ─────────────────────────────────────────── */}
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 pt-12 sm:pt-20 pb-6 sm:pb-8 text-center flex flex-col items-center">
        <p className="font-small text-small text-accent-lime tracking-widest">
          SERVICES NEXUS
        </p>
        <h2 className="font-header text-header text-text-primary mt-4">
          A 3D atlas of what we build.
        </h2>
        <p className="font-body text-body text-text-secondary mt-3 max-w-[640px] mx-auto">
          Scroll through four orbits of capability. Each card is a discipline we deliver
          as a single, integrated team.
        </p>
      </div>

      {/* ── Desktop: pinned top-header + 3-column grid ────────────────────────────── */}
      <div className="hidden lg:block">
        <div className="nexus-pin relative h-screen w-full">
          {/* Match Navbar width: w-[96%] max-w-[1280px] */}
          <div className="absolute inset-0 flex flex-col items-center px-6 py-12 w-[96%] max-w-[1280px] mx-auto">
            {/* Top: centered category headers */}
            <aside className="relative w-full h-[140px] flex items-center justify-center text-center mb-2">
              <div className="relative w-full">
                {CATEGORIES.map((cat) => (
                  <div
                    key={cat.id}
                    data-header
                    className="absolute inset-0 flex flex-col items-center justify-center will-change-transform"
                  >
                    <p
                      className="font-small text-small tracking-[0.25em]"
                      style={{ color: cat.accent }}
                    >
                      {cat.number} / {String(CATEGORIES.length).padStart(2, '0')}
                    </p>
                    <h3
                      className="font-header text-text-primary mt-3 leading-[0.95]"
                      style={{ fontSize: 'clamp(1.75rem, 3vw, 2.75rem)' }}
                    >
                      {cat.title}
                    </h3>
                    <p className="font-body text-body text-text-secondary mt-3 max-w-[640px] mx-auto leading-relaxed">
                      {cat.description}
                    </p>
                    <div
                      className="mt-4 h-[2px] w-12 rounded-full mx-auto"
                      style={{ background: cat.accent }}
                    />
                  </div>
                ))}
              </div>
            </aside>

            {/* Bottom: 3D perspective container with 3-column grid */}
            <div
              className="relative w-full flex-1"
              style={{ perspective: '1500px', perspectiveOrigin: '50% 25%' }}
            >
              <div className="relative w-full h-full">
                {CATEGORIES.map((cat) => (
                  <div
                    key={cat.id}
                    data-stage
                    className="absolute inset-0 grid grid-cols-3 gap-4 xl:gap-6 content-center"
                    style={{ transformStyle: 'preserve-3d' }}
                  >
                    {cat.services.map((svc, idx) => {
                      const Icon = svc.Icon;
                      // Logic for centering remainders in a 3-column grid
                      const isLastRow = idx >= Math.floor(cat.services.length / 3) * 3;
                      const remainder = cat.services.length % 3;
                      const isCenteredInLast = isLastRow && remainder > 0;

                      return (
                        <article
                          key={svc.title}
                          data-accent={cat.accent}
                          className={[
                            'svc-card group relative liquid-glass-card rounded-2xl p-5 xl:p-6 cursor-pointer will-change-transform',
                            'w-full h-[240px] flex flex-col justify-start pt-10', 
                            isCenteredInLast && remainder === 1 ? 'col-start-2' : '',
                            isCenteredInLast && remainder === 2 && idx === cat.services.length - 2 ? 'col-start-1 col-end-2 translate-x-1/2' : '',
                            isCenteredInLast && remainder === 2 && idx === cat.services.length - 1 ? 'col-start-3 col-end-4 -translate-x-1/2' : '',
                          ].join(' ')}
                          style={{ transformStyle: 'preserve-3d' }}
                          onMouseEnter={onCardEnter}
                          onMouseLeave={onCardLeave}
                        >
                          <div
                            className="svc-card-icon mb-8 inline-flex h-10 w-10 items-center justify-center rounded-xl will-change-transform"
                            style={{
                              background: `${cat.accent}1A`,
                              border: `1px solid ${cat.accent}55`,
                              color: cat.accent,
                              transform: 'translateZ(30px)',
                            }}
                          >
                            <Icon size={20} strokeWidth={1.6} />
                          </div>
                          <h4
                            className="font-subheader text-[1.1rem] xl:text-[1.2rem] text-text-primary leading-snug mt-1"
                            style={{ transform: 'translateZ(15px)' }}
                          >
                            {svc.title}
                          </h4>
                          <p
                            className="font-body text-[0.9rem] text-text-secondary mt-3 leading-relaxed line-clamp-2"
                            style={{ transform: 'translateZ(10px)' }}
                          >
                            {svc.blurb}
                          </p>

                          {/* Hover sheen */}
                          <div
                            className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                            style={{
                              background: `radial-gradient(80% 60% at 50% 0%, ${cat.accent}22, transparent 70%)`,
                            }}
                          />
                        </article>
                      );
                    })}
                  </div>
                ))}
              </div>

              {/* Stage indicator dots - Centered */}
              <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                {CATEGORIES.map((cat) => (
                  <span
                    key={cat.id}
                    data-stage-dot
                    data-accent={cat.accent}
                    className="h-1 w-10 rounded-full"
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Mobile: stacked vertical timeline ───────────────────────── */}
      <div className="lg:hidden">
        <div className="max-w-[720px] mx-auto px-4 sm:px-6 pb-24">
          {CATEGORIES.map((cat) => (
            <div key={cat.id} className="mb-10 last:mb-0">
              <div className="svc-cat-mobile-header mb-4 text-center flex flex-col items-center will-change-transform">
                <p
                  className="font-small text-small tracking-[0.22em]"
                  style={{ color: cat.accent }}
                >
                  {cat.number} / {String(CATEGORIES.length).padStart(2, '0')}
                </p>
                <h3
                  className="font-header text-text-primary mt-2 leading-tight"
                  style={{ fontSize: 'clamp(1.75rem, 6vw, 2.5rem)' }}
                >
                  {cat.title}
                </h3>
                <p className="font-body text-body text-text-secondary mt-2 leading-relaxed mx-auto">
                  {cat.description}
                </p>
                <div
                  className="mt-4 h-[2px] w-12 rounded-full mx-auto"
                  style={{ background: cat.accent }}
                />
              </div>

              <div className="space-y-4">
                {cat.services.map((svc) => {
                  const Icon = svc.Icon;
                  return (
                    <article
                      key={svc.title}
                      data-accent={cat.accent}
                      className="svc-card liquid-glass-card rounded-2xl p-5 will-change-transform"
                      onMouseEnter={onCardEnter}
                      onMouseLeave={onCardLeave}
                    >
                      <div className="flex items-start gap-4">
                        <div
                          className="svc-card-icon flex-shrink-0 inline-flex h-11 w-11 items-center justify-center rounded-xl"
                          style={{
                            background: `${cat.accent}1A`,
                            border: `1px solid ${cat.accent}55`,
                            color: cat.accent,
                          }}
                        >
                          <Icon size={20} strokeWidth={1.6} />
                        </div>
                        <div className="min-w-0">
                          <h4 className="font-subheader text-subheader text-text-primary leading-snug mt-2">
                            {svc.title}
                          </h4>
                          <p className="font-body text-body text-text-secondary mt-3 leading-relaxed">
                            {svc.blurb}
                          </p>
                        </div>
                      </div>
                    </article>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
