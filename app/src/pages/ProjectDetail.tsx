import { useEffect, useState } from 'react'
import { useParams, Link, useNavigate } from 'react-router'
import { motion } from 'framer-motion'
import { ArrowLeft, ExternalLink, Figma, Globe, AlertCircle } from 'lucide-react'
import { dataService } from '../services/dataService'
import type { Project, ProjectsData } from '../services/dataService'
import { EASE_OUT_EXPO } from '@/lib/animation'
import PageLoader from '@/components/PageLoader'

function getFigmaEmbedUrl(figmaUrl: string): string {
  return `https://www.figma.com/embed?embed_host=share&url=${encodeURIComponent(figmaUrl)}`
}

export default function ProjectDetail() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [project, setProject] = useState<Project | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  useEffect(() => {
    dataService
      .getProjects()
      .then((data: ProjectsData) => {
        const found = data.projects.find((p) => p.id === Number(id))
        if (found) {
          setProject(found)
        } else {
          setError(true)
        }
      })
      .catch(() => setError(true))
      .finally(() => setLoading(false))
  }, [id])

  if (loading) {
    return <PageLoader />
  }

  if (error || !project) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-24 px-6">
        <div className="text-center space-y-4">
          <AlertCircle size={40} className="text-text-muted mx-auto" />
          <h1 className="font-subheader text-subheader text-text-primary">Project not found</h1>
          <p className="font-body text-body text-text-muted">The project you are looking for does not exist.</p>
          <Link
            to="/work"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full liquid-glass-btn text-text-primary font-small text-small hover:text-accent-lime transition-colors"
          >
            <ArrowLeft size={14} />
            Back to Work
          </Link>
        </div>
      </div>
    )
  }

  const isFigma = project.type === 'figma'
  const previewSrc = isFigma ? getFigmaEmbedUrl(project.link) : project.link

  return (
    <div className="pt-24 pb-20">
      <section className="max-w-[1280px] mx-auto px-4 sm:px-6 py-8">
        <motion.button
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4, ease: EASE_OUT_EXPO }}
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 text-text-muted hover:text-accent-lime transition-colors font-small text-small mb-8"
        >
          <ArrowLeft size={14} />
          Back
        </motion.button>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: EASE_OUT_EXPO }}
        >
          <div className="flex items-center gap-3 mb-4">
            <span
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full font-small text-small border"
              style={{
                background: `${project.color}15`,
                borderColor: `${project.color}40`,
                color: project.color,
              }}
            >
              {isFigma ? <Figma size={10} /> : <Globe size={10} />}
              {isFigma ? 'Figma Prototype' : 'Live Site'}
            </span>
            <div className="flex flex-wrap gap-1.5">
              {project.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-2 py-0.5 rounded-md font-small text-small text-text-muted border border-white/5 bg-white/[0.03]"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
          <h1 className="font-header text-header text-text-primary">
            {project.title}
          </h1>
          <p className="text-text-secondary mt-4 max-w-2xl leading-relaxed">{project.description}</p>

          <a
            href={project.link}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 mt-6 px-6 py-3 rounded-full liquid-glass-btn text-text-primary font-small text-small hover:text-accent-lime transition-colors"
          >
            <ExternalLink size={14} />
            {isFigma ? 'Open in Figma' : 'Visit Live Site'}
          </a>
        </motion.div>
      </section>

      {/* Preview */}
      <section className="max-w-[1280px] mx-auto px-4 sm:px-6 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2, ease: EASE_OUT_EXPO }}
          className="w-full h-[60vh] liquid-glass-card overflow-hidden rounded-2xl"
        >
          <iframe
            src={previewSrc}
            title={project.title}
            className="w-full h-full border-0"
            sandbox="allow-scripts allow-same-origin allow-popups allow-forms"
          />
        </motion.div>
      </section>
    </div>
  )
}
