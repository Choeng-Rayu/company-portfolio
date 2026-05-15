// Updated: 2026-05-15 11:48 - Liquid glass theme
import { motion } from 'framer-motion';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';

const PLANET_COLORS = [
  { from: '#2E8B57', to: '#3CB371' },
  { from: '#C1440E', to: '#E05A20' },
  { from: '#B0B8C8', to: '#D8E0F0' },
  { from: '#2255BB', to: '#4477DD' },
];

const SERVICE_DETAILS = {
  'Custom Software Development': {
    features: ['End-to-end custom application development', 'Scalable architecture design', 'API integration & microservices', 'Cloud-native solutions'],
    benefits: ['Perfectly aligned with your workflow', 'Full ownership of source code', 'Flexible and maintainable codebase'],
  },
  'Digital Transformation for SMEs': {
    features: ['Process digitization & automation', 'Legacy system modernization', 'Cloud migration strategies', 'Digital workflow optimization'],
    benefits: ['Reduce operational costs', 'Improve efficiency by 40-60%', 'Real-time business insights'],
  },
  'Business Management Systems': {
    features: ['Inventory & supply chain management', 'CRM & customer engagement', 'Financial tracking & reporting', 'Multi-user role management'],
    benefits: ['Centralized business operations', 'Data-driven decision making', 'Seamless team collaboration'],
  },
  'Automation Tools': {
    features: ['Workflow automation & RPA', 'Data processing pipelines', 'Scheduled task management', 'Integration with existing tools'],
    benefits: ['Save 20+ hours per week', 'Eliminate human errors', 'Focus on strategic work'],
  },
};

const ICON_MAP: Record<string, string> = {
  Code: 'M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z',
  TrendingUp: 'M13 7h8m0 0v8m0-8l-8 8-4-4-6 6',
  Building2: 'M6 22V4a2 2 0 012-2h8a2 2 0 012 2v18zM6 12H4a2 2 0 00-2 2v6a2 2 0 002 2h2M18 9h2a2 2 0 012 2v9a2 2 0 01-2 2h-2M10 6h4M10 10h4M10 14h4M10 18h4',
  Zap: 'M13 2L3 14h9l-1 8 10-12h-9l1-8z',
};

export default function ServiceCard({ service, index, onClose }: { service: any; index: number; onClose: () => void }) {
  const color = PLANET_COLORS[index % PLANET_COLORS.length];
  const details = SERVICE_DETAILS[service.title as keyof typeof SERVICE_DETAILS] || SERVICE_DETAILS['Custom Software Development'];
  const iconPath = ICON_MAP[service.icon] || ICON_MAP['Code'];
  const isMobile = window.innerWidth < 768;

  const modalContent = (
    <motion.div key="service-modal" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-[999999] flex items-center justify-center p-4"
      onClick={onClose}>
      <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" />
      <motion.div initial={{ scale: 0.9, y: 40 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 40 }}
        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
        className="liquid-glass-card relative w-full max-w-[900px]"
        style={{ padding: isMobile ? '32px 24px' : '48px 40px', boxShadow: `0 8px 32px rgba(0, 0, 0, 0.4), 0 0 0 1px ${color.from}20, inset 0 0 80px ${color.from}08` }}
        onClick={(e) => e.stopPropagation()}>
        
        <button onClick={onClose} 
          className="liquid-glass-btn absolute top-5 right-5 p-2.5 z-10 transition-all"
          style={{ border: `1px solid ${color.from}`, color: color.from }}
          onMouseEnter={(e) => { e.currentTarget.style.background = color.from; e.currentTarget.style.color = '#000'; }}
          onMouseLeave={(e) => { e.currentTarget.style.background = ''; e.currentTarget.style.color = color.from; }}>
          <X size={24} />
        </button>

        <div className="flex items-center gap-5 mb-8">
          <div className="liquid-glass w-20 h-20 rounded-2xl flex items-center justify-center"
            style={{ boxShadow: `0 4px 16px ${color.from}20, inset 0 0 20px ${color.from}10`, border: `1px solid ${color.from}30` }}>
            <svg viewBox="0 0 24 24" fill="none" stroke={color.from} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" 
              className="w-10 h-10" style={{ filter: `drop-shadow(0 0 8px ${color.from}60)` }}>
              <path d={iconPath} />
            </svg>
          </div>
          <div className="flex-1">
            <p className="font-mono text-sm uppercase tracking-widest font-semibold mb-2" style={{ color: color.from }}>
              Service {String(index + 1).padStart(2, '0')}
            </p>
            <h2 className={`${isMobile ? 'text-3xl' : 'text-4xl'} font-bold text-white leading-tight`}>
              {service.title}
            </h2>
          </div>
        </div>

        <p className="text-lg text-gray-300 leading-relaxed mb-9 pl-5" style={{ borderLeft: `4px solid ${color.from}` }}>
          {service.description}
        </p>

        <div className={`grid ${isMobile ? 'grid-cols-1' : 'grid-cols-2'} gap-8 mb-9`}>
          <div>
            <h3 className="font-mono text-sm uppercase tracking-wider font-bold mb-5 flex items-center gap-3" style={{ color: color.from }}>
              <span className="w-8 h-0.5" style={{ background: color.from }} />
              Key Features
            </h3>
            <ul className="space-y-3.5">
              {details.features.map((feature, i) => (
                <li key={i} className="flex items-start gap-3.5 text-sm text-gray-200">
                  <span className="w-2 h-2 rounded-full mt-1.5 flex-shrink-0" 
                    style={{ background: color.from, boxShadow: `0 0 12px ${color.from}` }} />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-mono text-sm uppercase tracking-wider font-bold mb-5 flex items-center gap-3" style={{ color: color.from }}>
              <span className="w-8 h-0.5" style={{ background: color.from }} />
              Benefits
            </h3>
            <ul className="space-y-3.5">
              {details.benefits.map((benefit, i) => (
                <li key={i} className="flex items-start gap-3.5 text-sm text-gray-200">
                  <svg viewBox="0 0 24 24" fill="none" stroke={color.from} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" 
                    className="w-[18px] h-[18px] mt-0.5 flex-shrink-0">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  <span>{benefit}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="flex gap-4 pt-8 border-t border-white/8 flex-wrap">
          <button className="liquid-glass-btn flex-1 min-w-[200px] px-8 py-4 rounded-xl text-base font-semibold text-white transition-all"
            style={{ background: `linear-gradient(135deg, ${color.from}, ${color.to})`, boxShadow: `0 4px 20px ${color.from}40, inset 0 1px 0 rgba(255,255,255,0.2)` }}
            onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = `0 8px 28px ${color.from}50, inset 0 1px 0 rgba(255,255,255,0.2)`; }}
            onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = `0 4px 20px ${color.from}40, inset 0 1px 0 rgba(255,255,255,0.2)`; }}>
            Get Started
          </button>
          <button className="liquid-glass-btn flex-1 min-w-[200px] px-8 py-4 rounded-xl text-base font-semibold transition-all"
            style={{ color: color.from, border: `1px solid ${color.from}40` }}
            onMouseEnter={(e) => { e.currentTarget.style.background = `${color.from}15`; e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.borderColor = color.from; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = ''; e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.borderColor = `${color.from}40`; }}>
            Learn More
          </button>
        </div>
      </motion.div>
    </motion.div>
  );

  return createPortal(modalContent, document.body);
}
