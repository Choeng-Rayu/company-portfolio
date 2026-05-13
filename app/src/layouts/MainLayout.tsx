import { type ReactNode, useEffect } from 'react'
import { useLocation } from 'react-router'
import Navbar from '../components/Navbar'
import Footer from '../sections/Footer'
import ChatWidget from '../components/ChatWidget'
import UniverseCanvas from '../components/UniverseCanvas'
import HUD from '../components/HUD'
import GrainOverlay from '../components/GrainOverlay'
import ProbeCursor from '../components/ProbeCursor'
import SmoothScroller from '../components/SmoothScroller'
import PageTransition from '../components/PageTransition'
import { useAppStore } from '../store/useAppStore'

export default function MainLayout({ children }: { children: ReactNode }) {
  const location = useLocation()
  const showUniverse = useAppStore((s) => s.showUniverse)

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [location.pathname])

  return (
    <SmoothScroller>
      {showUniverse && <UniverseCanvas />}
      <HUD />
      <ProbeCursor />
      <GrainOverlay />
      <Navbar />

      <main className="relative z-10 bg-transparent text-text-primary overflow-visible min-h-screen">
        <PageTransition>{children}</PageTransition>
      </main>

      <Footer />
      <ChatWidget />
    </SmoothScroller>
  )
}
