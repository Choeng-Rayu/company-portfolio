import { create } from 'zustand'

interface NavLink {
  label: string
  href: string
  external?: boolean
}

interface AppState {
  // Navigation
  navLinks: NavLink[]
  mobileOpen: boolean
  setMobileOpen: (open: boolean) => void

  // Page transitions
  isTransitioning: boolean
  setTransitioning: (val: boolean) => void

  // Scroll
  scrollProgress: number
  setScrollProgress: (val: number) => void

  // Theme / UI
  showUniverse: boolean
  setShowUniverse: (val: boolean) => void
  showCursor: boolean
  setShowCursor: (val: boolean) => void
}

export const useAppStore = create<AppState>((set) => ({
  navLinks: [
    { label: 'Home', href: '/' },
    { label: 'About', href: '/about' },
    { label: 'Services', href: '/services' },
    { label: 'Work', href: '/work' },
    { label: 'Team', href: '/team' },
    { label: 'Blog', href: '/blog' },
    { label: 'Contact', href: '/contact' },
  ],
  mobileOpen: false,
  setMobileOpen: (open) => set({ mobileOpen: open }),

  isTransitioning: false,
  setTransitioning: (val) => set({ isTransitioning: val }),

  scrollProgress: 0,
  setScrollProgress: (val) => set({ scrollProgress: val }),

  showUniverse: true,
  setShowUniverse: (val) => set({ showUniverse: val }),
  showCursor: true,
  setShowCursor: (val) => set({ showCursor: val }),
}))
