import Hero from '../sections/Hero'
import Marquee from '../sections/Marquee'
import Services from '../sections/Services'
import VisionMissionGoals from '../sections/DesignNebula'
import OurJourney from '../sections/FeaturedWork'
import Projects from '../sections/Projects'
import Process from '../sections/Process'
import TechStack from '../sections/TechStack'
import Team from '../sections/Team'
import Testimonials from '../sections/Testimonials'

export default function Home() {
  return (
    <>
      <Hero />
      <Marquee />
      <Services />
      <VisionMissionGoals />
      <OurJourney />
      <Projects />
      <Process />
      <TechStack />
      <Team />
      <Testimonials />
    </>
  )
}
