import Navbar from '../components/Navbar'
import ProbeCursor from '../components/ProbeCursor'
import GrainOverlay from '../components/GrainOverlay'
import ChatWidget from '../components/ChatWidget'
import UniverseCanvas from '../components/UniverseCanvas'
import HUD from '../components/HUD'
import SmoothScroller from '../components/SmoothScroller'

import Hero from '../sections/Hero'
import Marquee from '../sections/Marquee'
import Services from '../sections/Services'
import VisionMissionGoals from '../sections/DesignNebula'
import OurJourney from '../sections/FeaturedWork'
import Process from '../sections/Process'
import TechStack from '../sections/TechStack'
import Team from '../sections/Team'
import Testimonials from '../sections/Testimonials'
import Contact from '../sections/Contact'
import Footer from '../sections/Footer'

export default function Home() {
  return (
    <SmoothScroller>
      {/* 3D Background Layer */}
      <UniverseCanvas />
      
      {/* Fixed UI Overlays */}
      <HUD />
      <ProbeCursor />
      <GrainOverlay />
      <Navbar />

      {/* Scrollable Content Layer (Overlay) */}
      <main className="relative z-10 bg-transparent text-text-primary overflow-visible">
        <Hero />
        <Marquee />
        <Services />
        <VisionMissionGoals />
        <OurJourney />
        <Process />
        <TechStack />
        <Team />
        <Testimonials />
        <Contact />
      </main>

      <Footer />
      <ChatWidget />
    </SmoothScroller>
  )
}
