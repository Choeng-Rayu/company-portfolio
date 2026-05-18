import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router'
import { motion } from 'framer-motion'
import { ArrowLeft, Calendar, Clock, Tag, User } from 'lucide-react'
import { dataService } from '../services/dataService'
import type { BlogPost } from '../services/dataService'
import { EASE_OUT_EXPO } from '@/lib/animation'
import PageLoader from '@/components/PageLoader'

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
    return <PageLoader />
  }

  if (!post) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-24 px-6">
        <div className="text-center space-y-4">
          <h1 className="font-subheader text-subheader text-text-primary">Post not found</h1>
          <p className="font-body text-body text-text-muted">The article you are looking for does not exist.</p>
          <Link
            to="/blog"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full liquid-glass-btn text-text-primary font-small text-small hover:text-accent-lime transition-colors"
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
          transition={{ duration: 0.4, ease: EASE_OUT_EXPO }}
        >
          <Link
            to="/blog"
            className="inline-flex items-center gap-2 text-text-muted hover:text-accent-lime transition-colors font-small text-small mb-8"
          >
            <ArrowLeft size={14} />
            Back to Blog
          </Link>
        </motion.div>

        {post.coverImage && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: EASE_OUT_EXPO }}
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
          transition={{ duration: 0.6, delay: 0.1, ease: EASE_OUT_EXPO }}
        >
          <div className="flex flex-wrap items-center gap-4 mb-6">
            <span className="flex items-center gap-1.5 text-text-muted font-small text-small">
              <User size={12} />
              {post.author}
            </span>
            <span className="flex items-center gap-1.5 text-text-muted font-small text-small">
              <Calendar size={12} />
              {post.date}
            </span>
            <span className="flex items-center gap-1.5 text-text-muted font-small text-small">
              <Clock size={12} />
              {post.readTime}
            </span>
          </div>

          <h1 className="font-header text-header text-text-primary mb-6">
            {post.title}
          </h1>

          <div className="flex flex-wrap gap-2 mb-10">
            {post.tags.map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full font-small text-small text-accent-lime bg-accent-lime/10"
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
          transition={{ duration: 0.6, delay: 0.2, ease: EASE_OUT_EXPO }}
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
