import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router'
import { motion } from 'framer-motion'
import { ArrowLeft, Calendar, Clock, Tag, User } from 'lucide-react'
import { dataService } from '../services/dataService'
import type { BlogPost } from '../services/dataService'

const ease: [number, number, number, number] = [0.16, 1, 0.3, 1]

export default function BlogPost() {
  const { slug } = useParams<{ slug: string }>()
  const [post, setPost] = useState<BlogPost | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!slug) return
    dataService
      .getBlogPost(slug)
      .then(setPost)
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [slug])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-24">
        <div className="font-mono text-xs text-text-muted animate-pulse">Loading…</div>
      </div>
    )
  }

  if (!post) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-24 px-6">
        <div className="text-center space-y-4">
          <h1 className="font-display text-2xl text-text-primary">Post not found</h1>
          <p className="text-text-muted text-sm">The article you are looking for does not exist.</p>
          <Link
            to="/blog"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full liquid-glass-btn text-text-primary font-mono text-xs uppercase tracking-wide hover:text-accent-lime transition-colors"
          >
            <ArrowLeft size={14} />
            Back to Blog
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="pt-24 pb-20">
      <article className="max-w-[800px] mx-auto px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4, ease }}
        >
          <Link
            to="/blog"
            className="inline-flex items-center gap-2 text-text-muted hover:text-accent-lime transition-colors font-mono text-xs mb-8"
          >
            <ArrowLeft size={14} />
            Back to Blog
          </Link>
        </motion.div>

        {post.coverImage && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease }}
            className="w-full h-64 md:h-80 rounded-2xl overflow-hidden mb-8"
          >
            <img
              src={post.coverImage}
              alt={post.title}
              className="w-full h-full object-cover"
            />
          </motion.div>
        )}

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1, ease }}
        >
          <div className="flex flex-wrap items-center gap-4 mb-6">
            <span className="flex items-center gap-1.5 text-text-muted font-mono text-xs">
              <User size={12} />
              {post.author}
            </span>
            <span className="flex items-center gap-1.5 text-text-muted font-mono text-xs">
              <Calendar size={12} />
              {post.date}
            </span>
            <span className="flex items-center gap-1.5 text-text-muted font-mono text-xs">
              <Clock size={12} />
              {post.readTime}
            </span>
          </div>

          <h1 className="font-display text-[clamp(2rem,5vw,3.5rem)] leading-[1.05] text-text-primary mb-6">
            {post.title}
          </h1>

          <div className="flex flex-wrap gap-2 mb-10">
            {post.tags.map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full font-mono text-[0.65rem] tracking-wide text-accent-lime bg-accent-lime/10"
              >
                <Tag size={10} />
                {tag}
              </span>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2, ease }}
          className="prose prose-invert prose-lg max-w-none"
        >
          {post.content.split('\n\n').map((paragraph, i) => (
            <p key={i} className="text-text-secondary leading-relaxed mb-6">
              {paragraph}
            </p>
          ))}
        </motion.div>
      </article>
    </div>
  )
}
