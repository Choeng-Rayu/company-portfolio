import Hero from '../sections/Hero'
import Services from '../sections/Services'
import VisionMissionGoals from '../sections/DesignNebula'
import OurJourney from '../sections/FeaturedWork'
import Projects from '../sections/Projects'
import Process from '../sections/Process'
import TechStack from '../sections/TechStack'
import Testimonials from '../sections/Testimonials'
import TestimonialMarquee from '@/components/TestimonialMarquee'

export default function Home() {
  return (
    <>
      <Hero />
      <Services />
      <VisionMissionGoals />
      <OurJourney />
      <Projects />
      <Process />
      
      <div className="py-20 relative z-10">
        <div className="max-w-7xl mx-auto px-6 mb-12">
          <p className="font-small text-small text-accent-lime uppercase tracking-widest">Client Reviews</p>
          <h2 className="font-header text-header text-text-primary mt-4">Built with Trust</h2>
        </div>
        <TestimonialMarquee />
      </div>

      <TechStack />
      <Testimonials />
    </>
  )
}
