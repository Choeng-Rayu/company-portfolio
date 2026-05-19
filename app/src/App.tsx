import { Suspense, lazy } from 'react'
import { Routes, Route, useLocation } from 'react-router'
import MainLayout from './layouts/MainLayout'
import ErrorBoundary from './components/ErrorBoundary'

// Lazy load pages for code splitting
const Home = lazy(() => import('./pages/Home'))
const About = lazy(() => import('./pages/About'))
const ServicesPage = lazy(() => import('./pages/ServicesPage'))
const ProjectsPage = lazy(() => import('./pages/ProjectsPage'))
const ProjectDetail = lazy(() => import('./pages/ProjectDetail'))
const ContactPage = lazy(() => import('./pages/ContactPage'))
const Blog = lazy(() => import('./pages/Blog'))
const BlogPost = lazy(() => import('./pages/BlogPost'))
const NotFound = lazy(() => import('./pages/NotFound'))

function PageLoader() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="flex flex-col items-center gap-3">
        <div className="w-8 h-8 border-2 border-accent-lime/20 border-t-accent-lime rounded-full animate-spin" />
        <span className="font-small text-small text-text-muted animate-pulse">Loading…</span>
      </div>
    </div>
  )
}

export default function App() {
  const location = useLocation()

  // Update document title based on route
  const titles: Record<string, string> = {
    '/': 'Universe Software — Digital Solutions for Cambodia',
    '/about': 'About — Universe Software',
    '/services': 'Services — Universe Software',
    '/work': 'Our Work — Universe Software',
    '/contact': 'Contact — Universe Software',
    '/blog': 'Blog — Universe Software',
  }

  const baseTitle = titles[location.pathname] ?? 'Universe Software'
  if (document.title !== baseTitle) {
    document.title = baseTitle
  }

  return (
    <ErrorBoundary>
      <MainLayout>
        <Suspense fallback={<PageLoader />}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/services" element={<ServicesPage />} />
            <Route path="/work" element={<ProjectsPage />} />
            <Route path="/work/:id" element={<ProjectDetail />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/blog/:slug" element={<BlogPost />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </MainLayout>
    </ErrorBoundary>
  )
}
