import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router'
import { Calendar, Clock, ArrowRight, Tag } from 'lucide-react'
import { dataService } from '../services/dataService'
import type { BlogPost } from '../services/dataService'

const ease: [number, number, number, number] = [0.16, 1, 0.3, 1]

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
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="font-mono text-xs text-text-muted animate-pulse">Loading…</div>
      </div>
    )
  }

  return (
    <div className="pt-24 pb-20">
      <section className="max-w-[1280px] mx-auto px-4 sm:px-6 py-16 md:py-24">
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease }}
          className="font-mono text-xs tracking-[0.08em] uppercase text-accent-lime mb-4"
        >
          Insights & Updates
        </motion.p>
        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1, ease }}
          className="font-display text-[clamp(2.5rem,6vw,5rem)] leading-[1.05] text-text-primary max-w-4xl"
        >
          From the Blog
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2, ease }}
          className="text-lg text-text-secondary mt-6 max-w-2xl leading-relaxed"
        >
          Thoughts on design, development, and building digital products for Cambodia and beyond.
        </motion.p>
      </section>

      {/* Tags filter */}
      <section className="max-w-[1280px] mx-auto px-4 sm:px-6 pb-8">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.3, ease }}
          className="flex flex-wrap gap-2"
        >
          {allTags.map((tag) => (
            <button
              key={tag}
              onClick={() => setFilter(tag)}
              className={`px-3 py-1.5 rounded-full font-mono text-[0.65rem] tracking-wide transition-all ${
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((post, index) => (
            <motion.article
              key={post.slug}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ duration: 0.5, delay: index * 0.08, ease }}
            >
              <Link
                to={`/blog/${post.slug}`}
                className="group block liquid-glass-card rounded-2xl overflow-hidden hover:-translate-y-1 transition-transform h-full flex flex-col"
              >
                {post.coverImage && (
                  <div className="h-48 overflow-hidden">
                    <img
                      src={post.coverImage}
                      alt={post.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      loading="lazy"
                    />
                  </div>
                )}
                <div className="p-6 flex flex-col flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <span className="flex items-center gap-1 text-text-muted font-mono text-[0.6rem]">
                      <Calendar size={10} />
                      {post.date}
                    </span>
                    <span className="flex items-center gap-1 text-text-muted font-mono text-[0.6rem]">
                      <Clock size={10} />
                      {post.readTime}
                    </span>
                  </div>
                  <h3 className="font-display text-xl text-text-primary leading-snug mb-2 group-hover:text-accent-lime transition-colors">
                    {post.title}
                  </h3>
                  <p className="text-text-muted text-base leading-relaxed line-clamp-3 flex-1">
                    {post.excerpt}
                  </p>
                  <div className="flex flex-wrap gap-1.5 mt-4 pt-4 border-t border-white/5">
                    {post.tags.map((tag) => (
                      <span
                        key={tag}
                        className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md font-mono text-[0.6rem] tracking-wide text-text-muted border border-white/5 bg-white/[0.03]"
                      >
                        <Tag size={8} />
                        {tag}
                      </span>
                    ))}
                  </div>
                  <div className="flex items-center gap-1 mt-4 text-accent-lime font-mono text-xs group-hover:gap-2 transition-all">
                    Read More <ArrowRight size={12} />
                  </div>
                </div>
              </Link>
            </motion.article>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-20">
            <p className="text-text-muted font-mono text-sm">No posts found for this filter.</p>
          </div>
        )}
      </section>
    </div>
  )
}
