import { useEffect, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Figma, Globe, ExternalLink, X, Eye, AlertCircle, Loader2 } from 'lucide-react';
import projectsData from '../../public/data/projects.json';
import { useScrollAnimation } from '../hooks/useScrollAnimation';

interface Project {
  id: number;
  title: string;
  description: string;
  type: 'figma' | 'live';
  link: string;
  tags: string[];
  color: string;
}

interface ProjectStats {
  value: string;
  label: string;
}

interface ProjectsData {
  sectionLabel: string;
  headline: string;
  subtitle: string;
  stats: ProjectStats[];
  projects: Project[];
}

const ease: [number, number, number, number] = [0.16, 1, 0.3, 1];
const popEase: [number, number, number, number] = [0.455, 0.03, 0.515, 0.955];

function getFigmaEmbedUrl(figmaUrl: string): string {
  return `https://www.figma.com/embed?embed_host=share&url=${encodeURIComponent(figmaUrl)}`;
}

/* ── Preview Modal ─────────────────────────────────────────── */
function PreviewModal({
  project,
  onClose,
}: {
  project: Project;
  onClose: () => void;
}) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const isFigma = project.type === 'figma';
  const previewSrc = isFigma ? getFigmaEmbedUrl(project.link) : project.link;

  const handleLoad = useCallback(() => setLoading(false), []);
  const handleError = useCallback(() => {
    setError(true);
    setLoading(false);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-8"
      onClick={onClose}
    >
      <div className="absolute inset-0 bg-bg-base/90 backdrop-blur-lg" />

      <motion.div
        initial={{ scale: 0.92, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.92, y: 20 }}
        transition={{ type: 'spring', stiffness: 300, damping: 28 }}
        className="relative w-full max-w-5xl h-[80vh] liquid-glass-card overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-5 py-4 border-b border-white/10 flex-shrink-0">
          <div className="flex items-center gap-3 min-w-0">
            <span
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full font-mono text-[0.6rem] tracking-wide border flex-shrink-0"
              style={{
                background: `${project.color}20`,
                borderColor: `${project.color}50`,
                color: project.color,
              }}
            >
              {isFigma ? <Figma size={10} /> : <Globe size={10} />}
              {isFigma ? 'Figma' : 'Live'}
            </span>
            <h3 className="font-display text-lg text-text-primary truncate">
              {project.title}
            </h3>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            <a
              href={project.link}
              target="_blank"
              rel="noopener noreferrer"
              className="liquid-glass-btn flex items-center gap-1.5 px-3 py-1.5 font-mono text-xs text-text-muted hover:text-accent-lime"
              onClick={(e) => e.stopPropagation()}
            >
              <ExternalLink size={12} />
              Open
            </a>
            <button
              onClick={onClose}
              className="liquid-glass-btn p-2 text-text-muted hover:text-text-primary"
            >
              <X size={16} />
            </button>
          </div>
        </div>

        <div className="flex-1 relative bg-bg-base">
          {loading && !error && (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 z-10">
              <Loader2 size={24} className="text-accent-lime animate-spin" />
              <span className="font-mono text-xs text-text-muted">Loading preview…</span>
            </div>
          )}

          {error && (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 z-10">
              <AlertCircle size={28} className="text-text-muted" />
              <span className="font-mono text-xs text-text-muted">Preview unavailable</span>
              <span className="text-xs text-text-muted/60 max-w-xs text-center">
                This site blocks iframe embedding.
                <br />
                Click "Open" to view it directly.
              </span>
            </div>
          )}

          <iframe
            src={previewSrc}
            title={project.title}
            className="w-full h-full border-0"
            sandbox="allow-scripts allow-same-origin allow-popups allow-forms"
            onLoad={handleLoad}
            onError={handleError}
          />
        </div>
      </motion.div>
    </motion.div>
  );
}

/* ── Project Card ──────────────────────────────────────────── */
function ProjectCard({
  project,
  index,
  onPreview,
}: {
  project: Project;
  index: number;
  onPreview: (p: Project) => void;
}) {
  const isFigma = project.type === 'figma';
  const TypeIcon = isFigma ? Figma : Globe;
  const typeLabel = isFigma ? 'Figma Prototype' : 'Live Site';

  return (
    <motion.div
      initial={{ opacity: 0, y: 30, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{
        duration: 0.5,
        delay: 0.4 + index * 0.08,
        ease: popEase,
      }}
      className="group relative liquid-glass-card rounded-2xl overflow-hidden flex flex-col hover:-translate-y-1"
    >
      {/* Color accent bar */}
      <div
        className="h-1 w-full flex-shrink-0"
        style={{ backgroundColor: project.color }}
      />

      <div className="flex flex-col flex-1 p-5 gap-4">
        {/* Header row: icon + type badge */}
        <div className="flex items-center justify-between">
          <span
            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full font-mono text-[0.6rem] tracking-wide border"
            style={{
              background: `${project.color}15`,
              borderColor: `${project.color}40`,
              color: project.color,
            }}
          >
            <TypeIcon size={10} />
            {typeLabel}
          </span>

          <button
            onClick={(e) => {
              e.stopPropagation();
              onPreview(project);
            }}
            className="liquid-glass-btn flex items-center gap-1.5 px-3 py-1.5 font-mono text-[0.65rem] tracking-wide text-text-muted hover:text-accent-lime"
          >
            <Eye size={12} />
            Preview
          </button>
        </div>

        {/* Title */}
        <h3 className="font-display text-xl text-text-primary leading-snug">
          {project.title}
        </h3>

        {/* Description */}
        <p className="text-base text-text-muted leading-relaxed line-clamp-3 flex-1">
          {project.description}
        </p>

        {/* Tags */}
        <div className="flex flex-wrap gap-1.5">
          {project.tags.map((tag) => (
            <span
              key={tag}
              className="px-2 py-0.5 rounded-md font-mono text-[0.6rem] tracking-wide text-text-muted border border-white/5 bg-white/[0.03]"
            >
              {tag}
            </span>
          ))}
        </div>

        {/* Link */}
        <a
          href={project.link}
          target="_blank"
          rel="noopener noreferrer"
          className="pt-4 border-t border-white/5 flex items-center justify-between group/link"
        >
          <span className="font-mono text-xs text-text-muted group-hover/link:text-accent-lime transition-colors">
            {isFigma ? 'Open in Figma' : 'Visit Site'}
          </span>
          <ExternalLink
            size={12}
            className="text-text-muted group-hover/link:text-accent-lime transition-colors"
          />
        </a>
      </div>
    </motion.div>
  );
}

/* ── Main Section ──────────────────────────────────────────── */
export default function Projects() {
  const [data] = useState<ProjectsData>(projectsData as ProjectsData);
  const [previewProject, setPreviewProject] = useState<Project | null>(null);
  const { ref, isInView } = useScrollAnimation('-100px');

  /* Lock body scroll when modal is open */
  useEffect(() => {
    if (previewProject) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [previewProject]);

  if (!data) return null;

  return (
    <section id="work" className="w-full py-20 md:py-[140px] bg-transparent" ref={ref}>
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6">
        {/* Section Header */}
        <div className="text-center mb-12 md:mb-16">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, ease }}
            className="font-mono text-xs tracking-[0.08em] uppercase text-accent-lime"
          >
            {data.sectionLabel}
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.1, duration: 0.6, ease }}
            className="font-display text-[clamp(2rem,6vw,5rem)] leading-[1.05] text-text-primary mt-4"
          >
            {data.headline}
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.2, duration: 0.6, ease }}
            className="text-lg md:text-xl text-text-secondary mt-4 max-w-[560px] mx-auto"
          >
            {data.subtitle}
          </motion.p>
        </div>

        {/* Stats Row */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.3, duration: 0.6, ease }}
          className="flex flex-wrap justify-center gap-8 md:gap-16 mb-16 md:mb-20"
        >
          {data.stats.map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="font-display text-3xl md:text-4xl text-accent-lime">
                {stat.value}
              </div>
              <div className="font-mono text-xs tracking-[0.08em] uppercase text-text-muted mt-1">
                {stat.label}
              </div>
            </div>
          ))}
        </motion.div>

        {/* Project Grid — Bucket Style */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {data.projects.map((project, index) => (
            <ProjectCard
              key={project.id}
              project={project}
              index={index}
              onPreview={setPreviewProject}
            />
          ))}
        </div>
      </div>

      {/* Preview Modal */}
      <AnimatePresence>
        {previewProject && (
          <PreviewModal
            project={previewProject}
            onClose={() => setPreviewProject(null)}
          />
        )}
      </AnimatePresence>
    </section>
  );
}
