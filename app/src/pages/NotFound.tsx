import { Link } from 'react-router'
import { motion } from 'framer-motion'
import { Home, ArrowLeft } from 'lucide-react'
import { EASE_OUT_EXPO } from '@/lib/animation'

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center px-6 pt-24 pb-20">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: EASE_OUT_EXPO }}
        className="text-center space-y-8 max-w-md"
      >
        <div className="relative">
          <h1 className="font-header text-header text-text-primary/10 select-none">
            404
          </h1>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="font-header text-header text-text-primary">Lost in Space</span>
          </div>
        </div>
        <p className="font-body text-body text-text-muted">
          The page you are looking for has drifted into the void. Let us get you back on course.
        </p>
        <div className="flex items-center justify-center gap-4">
          <button
            onClick={() => window.history.back()}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full liquid-glass-btn text-text-primary font-small text-small hover:text-accent-lime transition-colors"
          >
            <ArrowLeft size={14} />
            Go Back
          </button>
          <Link
            to="/"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full liquid-glass-btn text-text-primary font-small text-small hover:text-accent-lime transition-colors"
          >
            <Home size={14} />
            Home
          </Link>
        </div>
      </motion.div>
    </div>
  )
}
