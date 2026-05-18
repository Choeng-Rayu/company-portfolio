import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router'
import { dataService } from '../services/dataService'
import type { BlogPost } from '../services/dataService'
import { EASE_OUT_EXPO } from '@/lib/animation'
import PageLoader from '@/components/PageLoader'
import CardFlip from '@/components/ui/flip-card'

export default function Blog() {
  const [posts, setPosts] = useState<BlogPost[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('All')

  useEffect(() => {
    dataService
      .getBlogPosts()
      .then(setPosts)
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  const allTags = ['All', ...Array.from(new Set(posts.flatMap((p) => p.tags)))]
  const filtered = filter === 'All' ? posts : posts.filter((p) => p.tags.includes(filter))

  if (loading) {
    return <PageLoader />
  }

  return (
    <div className="pt-24 pb-20">
      <section className="max-w-[1280px] mx-auto px-4 sm:px-6 py-16 md:py-24">
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: EASE_OUT_EXPO }}
          className="font-small text-small text-accent-lime mb-4"
        >
          Insights & Updates
        </motion.p>
        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1, ease: EASE_OUT_EXPO }}
          className="font-header text-header text-text-primary max-w-4xl"
        >
          From the Blog
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2, ease: EASE_OUT_EXPO }}
          className="font-body text-body text-text-secondary mt-6 max-w-2xl leading-relaxed"
        >
          Thoughts on design, development, and building digital products for Cambodia and beyond.
        </motion.p>
      </section>

      {/* Tags filter */}
      <section className="max-w-[1280px] mx-auto px-4 sm:px-6 pb-8">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.3, ease: EASE_OUT_EXPO }}
          className="flex flex-wrap gap-2"
        >
          {allTags.map((tag) => (
            <button
              key={tag}
              onClick={() => setFilter(tag)}
              className={`px-3 py-1.5 rounded-full font-small text-small tracking-wide transition-all ${
                filter === tag
                  ? 'bg-accent-lime text-bg-base'
                  : 'liquid-glass-btn text-text-muted hover:text-text-primary'
              }`}
            >
              {tag}
            </button>
          ))}
        </motion.div>
      </section>

      {/* Posts Grid */}
      <section className="max-w-[1280px] mx-auto px-4 sm:px-6 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 place-items-center">
          {filtered.map((post, index) => (
            <motion.article
              key={post.slug}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ duration: 0.5, delay: index * 0.08, ease: EASE_OUT_EXPO }}
              className="w-full flex justify-center"
            >
              <Link to={`/blog/${post.slug}`} className="block w-full max-w-[300px]">
                <CardFlip 
                  title={post.title}
                  subtitle={`${post.date} · ${post.readTime}`}
                  description={post.excerpt}
                  features={post.tags.slice(0, 4)}
                  color="#ccff00"
                  image={post.coverImage}
                />
              </Link>
            </motion.article>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-20">
            <p className="text-text-muted font-small text-small">No posts found for this filter.</p>
          </div>
        )}
      </section>
    </div>
  )
}
