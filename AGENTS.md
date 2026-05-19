<claude-mem-context>
# Memory Context

# [company_portfolio] recent context, 2026-05-18 9:05pm GMT+7

Legend: 🎯session 🔴bugfix 🟣feature 🔄refactor ✅change 🔵discovery ⚖️decision 🚨security_alert 🔐security_note
Format: ID TIME TYPE TITLE
Fetch details: get_observations([IDs]) | Search: mem-search skill

Stats: 50 obs (17,874t read) | 152,531t work | 88% savings

### May 12, 2026
S29 Build a Projects showcase section for the company portfolio (Vite + React + TypeScript) — populate `app/public/data/projects.json` with 10 company-built links (4 Figma prototypes + 6 live deployments) and integrate a supplied glassmorphism Bucket component as the visual centerpiece, following the codebase's liquid-glass / shadcn / framer-motion conventions. (May 12, 3:39 PM)
S30 Display projects in a morphing-card-stack layout with iframe live/Figma-embed previews on the company portfolio at /home/rayu/company_portfolio (May 12, 4:17 PM)
S31 Eliminate Figma 401 console errors and WebGL context warnings by redesigning the portfolio's project cards to stop auto-loading iframes (May 12, 4:33 PM)
S32 Debug Vite SyntaxError claiming UniverseCanvas.tsx does not provide a default export when imported by MainLayout.tsx (May 12, 4:52 PM)
### May 13, 2026
S33 Debug persistent "Uncaught SyntaxError: does not provide an export named 'default'" for UniverseCanvas.tsx imported by MainLayout.tsx (May 13, 11:24 AM)
S68 Design guidance .md files that rewrite three vague "cinematic" prompts into precise, codebase-aware specs for an implementation agent working on the company_portfolio website (May 13, 11:40 AM)
### May 18, 2026
S69 Author codebase-aware guidance .md files at docs/prompts/ that rewrite three vague "cinematic" website prompts into precise specs for a downstream AI implementation agent — without modifying any application code (May 18, 5:51 PM)
S70 Implement cinematic particles system based on 01-cinematic-particles.md prompt specification in the company_portfolio app (May 18, 6:00 PM)
S71 Restore accidentally discarded ProbeCursor component and supporting animation infrastructure (May 18, 8:25 PM)
534 8:37p 🔵 AtmosphericParticles.tsx component referenced in pointer.ts is missing
535 " 🟣 Created AtmosphericParticles canvas-based particle system component
536 " 🔵 AtmosphericParticles component not imported in MainLayout
537 " 🔵 MainLayout.tsx structure confirmed; AtmosphericParticles missing from imports
538 8:38p ✅ AtmosphericParticles integrated into MainLayout
540 " 🔵 Implementation Request Scope Confirmed
539 " 🔵 Vite production build succeeded with chunk size warnings
541 8:44p ⚖️ 3D Gallery Architecture Specification: Single Canvas with Scroll-Driven Camera
542 " 🟣 Implementation Started: Cinematic Particles System (Spec 01)
543 8:45p 🔵 Codebase Architecture: Routing, Data Structure, and R3F Pattern Reference
544 " ✅ Dependency Installation Started: 3D/Motion/Icon Libraries
545 " ✅ Created App-Level CLAUDE.md Documentation
546 " ✅ Dependencies Installed: 3D/Motion/Icon Libraries
547 " 🔵 SmoothScroller Lenis Integration: Missing lenisRef Export
548 8:46p ✅ Project Structure Created: Component and Utility Directories
549 " 🟣 Data Layer and Type System Implemented
550 8:48p ⚖️ Created Lenis Singleton Module for Cross-Component Access
551 " ✅ Updated SmoothScroller to Populate Lenis Singleton
552 " 🟣 Created Gallery Constants and Types Module
553 8:49p 🟣 Implemented CameraRig Component for Phase 2 (Camera Path + Progress)
554 " 🟣 Implemented Room Component for Phase 3 (Per-Room Staging)
555 8:50p 🟣 Implemented SceneAtmosphere Component for Phase 4 (Atmosphere Blending)
556 " 🟣 Implemented RoomHUD Component for Phase 5 (HUD Overlay + Project Content)
557 " 🟣 Implemented GalleryFallback Component for Phase 7 (Reduced-Motion/No-WebGL/Mobile)
558 " 🟣 Implemented Gallery.tsx Page Component (Phases 1–7 Integration)
559 8:51p ✅ Integrated Gallery Route into App.tsx Router Configuration
560 " 🔵 Production Build Successful: Gallery Implementation Complete
561 " 🔄 Cleaned Up Dead Code in Room.tsx
S72 Implement 3D Gallery feature (per-spec 02-3d-gallery-rooms.md) + document app stack in CLAUDE.md to reduce future token overhead (May 18, 8:51 PM)
562 8:56p 🔵 TypeScript type error in GlassCard component blocking Next.js build
563 " 🔴 Fixed TypeScript type error in GlassCard component by simplifying generic type approach
564 " 🔵 Next.js build compilation succeeds after GlassCard.tsx type fix
565 " 🔵 TypeScript infinite type recursion error in utils.ts cn function
566 " 🔴 Fixed TypeScript infinite recursion in cn utility by refactoring flatten implementation
567 8:57p 🔵 Next.js production build completes successfully after TypeScript fixes
568 " 🔵 ESLint linting passes without errors or warnings
569 8:58p 🔵 Implementation plan completed for 3D portfolio website foundation
570 " 🔵 Development server port 3000 is already in use
571 " 🔵 Development server port 3001 also already in use
572 " 🔵 Existing Next.js dev server already running on port 3002 blocking new server startup
573 " 🔵 Existing dev server on port 3002 is running and responsive
574 8:59p 🔵 Playwright not installed as project dependency despite being available globally
575 " 🔵 Playwright browser binaries not installed; missing WebKit executable
576 9:00p 🔵 Desktop viewport screenshot successfully captured from running application
577 " 🔵 Mobile viewport screenshot capture in progress using Chromium browser
578 " 🔵 Mobile viewport screenshot successfully captured using Chromium browser
579 9:01p 🔄 Remove Reveal animation wrappers from HomePage hero section
580 " 🔵 Playwright test framework installed but unconfigured
581 9:02p 🟣 Smoke test for homepage canvas rendering added
582 9:03p 🔴 Fixed Playwright test import path in smoke test
583 " 🔵 Playwright test package not accessible despite playwright CLI being available

Access 153k tokens of past work via get_observations([IDs]) or mem-search skill.
</claude-mem-context>