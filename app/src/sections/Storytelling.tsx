import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, X } from 'lucide-react';
import { EASE_OUT_EXPO } from '@/lib/animation';
import Container from '@/components/Container';
import SectionHeader from '@/components/SectionHeader';

export default function Storytelling() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <section className="py-12 md:py-24 bg-transparent relative overflow-hidden">
      <Container>
        <SectionHeader
          label="STORYTELLING"
          title="Building the Digital Future of Cambodia"
          subtitle="Watch how we are transforming local businesses through innovative technology and a partnership-first approach."
        />

        <div className="mt-8 md:mt-16 max-w-4xl mx-auto relative group">
          {/* Video Thumbnail / Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: EASE_OUT_EXPO }}
            className="relative aspect-video rounded-3xl overflow-hidden liquid-glass-card cursor-pointer group shadow-2xl border border-white/10"
            onClick={() => setIsOpen(true)}
          >
            {/* Placeholder Thumbnail Background */}
            <div className="absolute inset-0 bg-gradient-to-br from-bg-surface via-bg-base to-bg-surface group-hover:scale-105 transition-transform duration-700">
              {/* Abstract decorative elements */}
              <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-accent-lime/10 rounded-full blur-[100px] animate-pulse" />
              <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-blue-500/10 rounded-full blur-[100px] animate-pulse delay-700" />
              
              {/* Overlay with some pattern or image placeholder */}
              <div className="absolute inset-0 opacity-30 mix-blend-overlay" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(255,255,255,0.05) 1px, transparent 0)', backgroundSize: '24px 24px' }} />
            </div>

            {/* Play Button Overlay */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="relative">
                {/* Outer Ring Animation */}
                <motion.div
                  animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0.2, 0.5] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                  className="absolute inset-[-20px] rounded-full border border-accent-lime/30"
                />
                <motion.div
                  animate={{ scale: [1, 1.4, 1], opacity: [0.3, 0, 0.3] }}
                  transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
                  className="absolute inset-[-40px] rounded-full border border-accent-lime/20"
                />
                
                <div className="w-20 h-20 rounded-full bg-accent-lime flex items-center justify-center shadow-[0_0_30px_rgba(200,241,53,0.4)] group-hover:scale-110 transition-transform duration-300">
                  <Play size={32} className="text-bg-base fill-bg-base ml-1" />
                </div>
              </div>
            </div>

            {/* Content Overlay */}
            <div className="absolute bottom-0 left-0 right-0 p-4 md:p-8 bg-gradient-to-t from-bg-base/90 to-transparent">
              <p className="font-small text-xs md:text-small text-accent-lime mb-1 md:mb-2 uppercase tracking-wider">WATCH OUR STORY</p>
              <h3 className="font-subheader text-lg md:text-subheader text-text-primary leading-tight">Experience our journey and vision in 2 minutes</h3>
            </div>
          </motion.div>
        </div>
      </Container>

      {/* Video Modal */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8 bg-bg-base/95 backdrop-blur-xl"
            onClick={() => setIsOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="relative w-full max-w-5xl aspect-video rounded-2xl overflow-hidden shadow-2xl border border-white/10"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Button */}
              <button
                className="absolute top-4 right-4 z-10 p-2 rounded-full bg-bg-base/50 text-white hover:bg-accent-lime hover:text-bg-base transition-colors"
                onClick={() => setIsOpen(false)}
              >
                <X size={24} />
              </button>

              {/* YouTube Embed */}
              <iframe
                className="w-full h-full"
                src="https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1" // Placeholder: Rick Astley for testing, or a better one
                title="Our Story Video"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
