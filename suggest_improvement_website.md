# Website Content Improvement Suggestions

> **Focus:** Content-only recommendations to make the website more professional, credible, and reliable.  
> **Scope:** Text, data, messaging, and brand consistency.  
> **Date:** May 2026

---

## 1. CRITICAL: Brand Name Inconsistency

**Issue:** The company name appears as **"Chakrawal Digital"** in all copy but the logo `alt` text says **"Universe Software"** in both `Navbar.tsx` and `Footer.tsx`.

**Impact:** This destroys trust immediately. Visitors see one name in the text and another in the accessibility label / SEO.

**Suggested Fix:**
- Change `alt="Universe Software"` to `alt="Chakrawal Digital"` in:
  - `app/src/components/Navbar.tsx` (line 44)
  - `app/src/sections/Footer.tsx` (line 55)

---

## 2. CRITICAL: Date & Timeline Contradictions

**Issue:** Multiple conflicting dates across the site undermine credibility.

| Location | Claims |
|----------|--------|
| `about_us.json` | Founded **2023** |
| `company_contact.json` | "Serving local businesses ... since **2026**" |
| `Footer.tsx` | "© **2024** Chakrawal Digital" |
| `our_journey.json` | Milestones start at **2026** ("Planning & Team Formation") |

**Impact:** A visitor cannot tell if you are a 1-year-old startup, a 3-year-old company, or brand-new. The journey section makes it look like you have not actually built anything yet.

**Suggested Fix:**
1. **Pick one founding year** (recommend **2023** if true) and apply it everywhere.
2. Update `Footer.tsx` to "© 2026 Chakrawal Digital" (or make it dynamic).
3. Rewrite `company_contact.json` tagline to:  
   *"Based in Phnom Penh, Cambodia. Empowering local businesses with digital solutions since 2023."*
4. **Rewrite the entire Journey timeline** (see Section 4).

---

## 3. Hero / About Us Content (`about_us.json`)

**Current:**
> "Born in Cambodia. Built for Cambodia."  
> "Chakrawal Digital is a Cambodian technology startup helping local businesses modernize through software, automation, and digital solutions. We empower SMEs to move from manual operations to smarter, more efficient digital systems."

**Issues:**
- The headline is catchy but does not say *what you do*.
- The description is generic — it could describe any software agency in Southeast Asia.
- No differentiation, no proof points, no specific value proposition.

**Suggested Rewrite:**
```json
{
  "sectionLabel": "ABOUT US",
  "headline": "Cambodian Engineers Building Software for Cambodian Businesses.",
  "description": "We are a Phnom Penh-based software studio that designs, builds, and deploys custom digital systems for SMEs and government partners. From HR management platforms to provincial citizen portals, we turn complex operations into simple, reliable software.",
  "foundedYear": "2023",
  "location": "Phnom Penh",
  "country": "Cambodia"
}
```

**Why:** Specificity builds trust. Mentioning actual project types (HR, government portals) proves you have real experience.

---

## 4. Vision, Mission & Goals (`visions.json`, `missions.json`, `goals.json`)

**Current Issues:**
- Extremely generic corporate language ("trusted digital solution provider", "improve efficiency", "build reliable software").
- No measurable outcomes or differentiation.
- Goals still say "Launch first digital product" despite having 10 projects in the portfolio.

**Suggested Rewrites:**

**`visions.json`:**
```json
{
  "sectionLabel": "VISION",
  "title": "Our Vision",
  "number": "I",
  "bullets": [
    "Become Cambodia's most referenced software partner for SME digital transformation by 2028.",
    "Prove that locally built technology can outperform imported solutions on cost, speed, and cultural fit.",
    "Contribute to Cambodia's digital economy by training 100+ local developers through open-source and internship programs."
  ]
}
```

**`missions.json`:**
```json
{
  "sectionLabel": "MISSION",
  "title": "Our Mission",
  "number": "II",
  "bullets": [
    "Design software that fits Cambodian workflows — not force local businesses to adapt to foreign templates.",
    "Deliver production-ready systems within 6–10 weeks through rapid prototyping and agile sprints.",
    "Maintain every system we build with transparent pricing and response times under 24 hours."
  ]
}
```

**`goals.json`:**
```json
{
  "sectionLabel": "GOALS",
  "title": "Our Goals",
  "number": "III",
  "bullets": [
    "Ship 3 production SaaS products serving Cambodian SMEs by Q4 2026.",
    "Expand into ed-tech and gov-tech verticals with at least 2 active provincial partnerships.",
    "Grow the engineering team to 12 full-time developers while maintaining our sub-10-week delivery average.",
    "Open-source our internal component library and design system by mid-2027."
  ]
}
```

---

## 5. Our Journey / Timeline (`our_journey.json`)

**Current Issues:**
- All milestones are **future-dated** (2026–2030), which makes the company look like it has accomplished nothing.
- Milestones are vague one-liners ("Partner with Ministry of Interior", "Become market leader").
- No actual past achievements are listed.

**Suggested Rewrite (mix of past + near-future):**
```json
{
  "sectionLabel": "TIMELINE",
  "title": "Our Journey",
  "subtitle": "From a two-person team to a full-service software studio.",
  "milestones": [
    {
      "year": "2023",
      "title": "Founded in Phnom Penh",
      "description": "Started as a two-person development team focused on landing pages and small business websites."
    },
    {
      "year": "2024",
      "title": "First Major Client Partnership",
      "description": "Delivered the MR Training & Jobs Center website and began long-term collaboration on internal management systems."
    },
    {
      "year": "2025",
      "title": "Product Suite Expansion",
      "description": "Launched MR Labs, MR HRM, and VersionDragon — moving from websites to full-stack web applications."
    },
    {
      "year": "2026",
      "title": "Team & Capability Growth",
      "description": "Scaled to a 6-person team with dedicated design, frontend, backend, and project management capabilities."
    },
    {
      "year": "2027",
      "title": "SaaS & Provincial Expansion",
      "description": "Target: Launch first independent SaaS product and expand gov-tech partnerships beyond Phnom Penh."
    }
  ]
}
```

---

## 6. Services (`services.json` + `ServiceCard2.tsx`)

**Current Issues:**
- Subtitle "Tailored digital solutions for your business needs" is pure filler.
- Service descriptions are 1-sentence long and do not explain *how* or *for whom*.
- The `SERVICE_DETAILS` in `ServiceCard2.tsx` lists generic features that could apply to any dev shop.

**Suggested `services.json` Rewrite:**
```json
{
  "sectionLabel": "SERVICES",
  "title": "What We Build",
  "subtitle": "End-to-end software development for Cambodian SMEs, training centers, and government offices.",
  "services": [
    {
      "icon": "Code",
      "title": "Custom Software Development",
      "description": "Full-stack web applications built for your exact workflow. We handle architecture, UI/UX, development, and deployment — no templates, no forced adaptations.",
      "href": "#contact"
    },
    {
      "icon": "TrendingUp",
      "title": "Digital Transformation",
      "description": "Replace spreadsheets and paper processes with integrated digital systems. Typical clients reduce admin time by 40–60% within the first quarter.",
      "href": "#contact"
    },
    {
      "icon": "Building2",
      "title": "Business Management Systems",
      "description": "HR, inventory, lab, and operations platforms with role-based access, audit trails, and Khmer language support where needed.",
      "href": "#contact"
    },
    {
      "icon": "Zap",
      "title": "Workflow Automation",
      "description": "Automate repetitive tasks — payroll calculations, report generation, approval chains, and notifications — using serverless architectures that scale with your volume.",
      "href": "#contact"
    }
  ]
}
```

**Suggested `ServiceCard2.tsx` Updates:**
Replace generic features with specifics:

| Service | Current Feature | Better Feature |
|---------|----------------|----------------|
| Custom Software | "Scalable architecture design" | "Multi-tenant architecture with role-based access control" |
| Digital Transformation | "Reduce operational costs" | "Cut payroll processing from 3 days to 4 hours (proven with MR Training)" |
| Business Management | "CRM & customer engagement" | "Khmer-English bilingual interfaces with offline-ready PWA support" |
| Automation | "Save 20+ hours per week" | "Serverless automation that costs less than $20/month to run" |

---

## 7. Portfolio / Projects (`projects.json`)

**Current Issues:**
- Claims **"50+ Projects"** but lists only **10**. This looks dishonest.
- Claims **"3 Industries"** — for a company with 10 projects this is underwhelming.
- **"100% Local-First"** is confusing. Does it mean you only serve Cambodian clients? If so, say that clearly.
- Several descriptions lack business impact (what did the software *do* for the client?).

**Suggested Fix for Stats:**
```json
"stats": [
  { "value": "10", "label": "Production Systems" },
  { "value": "4", "label": "Active Clients" },
  { "value": "3", "label": "Verticals (Education / Gov / SaaS)" },
  { "value": "2", "label": "Years of Delivery" }
]
```

**Better yet**, use outcome-based stats if you can verify them:
```json
"stats": [
  { "value": "10+", "label": "Systems Delivered" },
  { "value": "60%", "label": "Avg. Admin Time Reduction" },
  { "value": "6", "label": "Week Avg. Delivery" },
  { "value": "24h", "label": "Support Response Time" }
]
```

**Suggested Project Description Improvements:**

| Project | Current | Suggested |
|---------|---------|-----------|
| **MR App** | "Mobile application prototype..." | "Training enrollment and job-matching mobile prototype. Designed for low-bandwidth environments with offline form submission." |
| **Super App** | "All-in-one super app prototype..." | **Remove or rename.** "Super App" is vague. What services? If it is internal, consider hiding it until it launches. |
| **Automata** | "Automation platform... built with modern web technologies and AI integrations" | "No-code workflow automation for repetitive office tasks. Trigger-based scheduling with Telegram and email notifications." |
| **Rithy Reach Portfolio** | "Personal portfolio website..." | **Consider removing.** A portfolio item that is itself a portfolio does not demonstrate client value. |

---

## 8. Team Page (`our_team.json`)

**Current Issues:**
- **Every LinkedIn URL is `https://linkedin.com`** — placeholder links look unprofessional and suggest the team profiles are fake.
- 6 executives for a startup with ~10 projects feels top-heavy (CEO, CMO, CTO, COO, CFO, PM).
- Bios use buzzwords ("visionary leader", "creative marketer", "passionate about clean code") without concrete accomplishments.

**Suggested Fixes:**
1. **Replace all LinkedIn placeholders** with real profiles or remove the links entirely until they are ready.
2. **Restructure roles** to look more believable for a 6-person studio:
   - Choeng Rayu — Founder & Lead Strategist
   - Rithi Reach — Lead Engineer
   - Yen Mara — Growth & Marketing Lead
   - Tep Somnang — Operations & Delivery Lead
   - Povpanha Ngovseng — Finance & Business Analyst
   - Prak Dararith — Project Coordinator

3. **Rewrite bios with specifics:**

**Example for Choeng Rayu:**
> "Founded Chakrawal Digital in 2023 after seeing local businesses struggle with off-the-shelf software that did not fit Cambodian workflows. Leads client strategy and manages partnerships with education and government sectors."

**Example for Rithi Reach:**
> "Architects the technical stack for all client projects. Specializes in React/TypeScript frontends and Node.js backends. Previously built internal tools for [specific if available] before joining full-time."

---

## 9. Testimonials (`Testimonials.tsx`)

**Current Issues:**
- Only **3 testimonials** from **2 clients** (2 from MR Training, 1 from Oddar Meanchey).
- Testimonials are decent but lack specific metrics.

**Suggested Improvements:**
1. **Add at least 1 more distinct client** if possible.
2. **Upgrade existing quotes with specifics:**

| Current | Improved |
|---------|----------|
| "Payroll used to take days. Now it takes hours." | "Payroll processing dropped from 3 days to under 4 hours. Error rate went to zero." |
| "elderly residents can navigate without help" | "Citizen inquiries through the website increased 3x in the first month after launch." |

3. **Add role clarity:** "Digital Transformation Lead" at a provincial government is unusual — verify if this is the real title or use "Director of Administration" or similar.

---

## 10. Tech Stack (`TechStack.tsx`)

**Current Issues:**
- Lists **TensorFlow, PyTorch, Kafka, Elasticsearch** but portfolio shows no AI/ML or data-streaming projects.
- Claiming to "master" a stack without proof weakens credibility.

**Suggested Fix:**
Align the tech stack with actual project evidence:

```typescript
const categories: TechCategory[] = [
  {
    label: 'Frontend',
    items: [
      { name: 'React' },
      { name: 'Next.js' },
      { name: 'TypeScript' },
      { name: 'Tailwind CSS' },
      { name: 'Framer Motion' },
    ],
  },
  {
    label: 'Backend & Database',
    items: [
      { name: 'Node.js' },
      { name: 'Python' },
      { name: 'PostgreSQL' },
      { name: 'MongoDB' },
      { name: 'Redis' },
    ],
  },
  {
    label: 'Cloud & DevOps',
    items: [
      { name: 'AWS' },
      { name: 'Vercel' },
      { name: 'Docker' },
      { name: 'CI/CD (GitHub Actions)' },
    ],
  },
  {
    label: 'Integrations',
    items: [
      { name: 'Telegram Bot API' },
      { name: 'ABA PayWay' },
      { name: 'Wing / TrueMoney' },
      { name: 'OpenAI API' },
    ],
  },
];
```

**Why:** Replacing aspirational tech (Kubernetes, Terraform) with tools you actually use (Vercel, Telegram API, local payment gateways) makes you look more honest and competent.

---

## 11. Contact Page (`company_contact.json` + `ContactPage.tsx`)

**Current Issues:**
- Social links in `company_contact.json` are all `"#"` placeholders.
- The `media_info.json` has real-looking URLs but `company_contact.json` does not use them.

**Suggested Fix for `company_contact.json`:**
```json
{
  "sectionLabel": "CONTACT",
  "title": "Let's Work Together.",
  "subtitle": "Tell us what you are building. We will respond within 24 hours with a clear plan and timeline.",
  "tagline": "Based in Phnom Penh, Cambodia. Serving SMEs and government partners since 2023.",
  "contacts": [
    {
      "type": "email",
      "label": "Email",
      "value": "info@chakrawaldigital.com",
      "href": "mailto:info@chakrawaldigital.com",
      "icon": "Mail"
    },
    {
      "type": "phone",
      "label": "Phone",
      "value": "+855 969 983 479",
      "href": "tel:+855969983479",
      "icon": "Phone"
    },
    {
      "type": "location",
      "label": "Location",
      "value": "Phnom Penh, Cambodia",
      "href": "#",
      "icon": "MapPin"
    }
  ],
  "socials": [
    { "platform": "LinkedIn", "url": "https://linkedin.com/company/chakrawaldigital", "icon": "Linkedin" },
    { "platform": "Telegram", "url": "https://t.me/chakrawaldigital", "icon": "MessageCircle" },
    { "platform": "GitHub", "url": "https://github.com/chakrawaldigital", "icon": "Github" }
  ]
}
```

---

## 12. Blog Content (`blog_posts.json`)

**Current State:** Surprisingly strong. Articles are detailed, relevant, and well-structured.

**Minor Improvements:**
1. **Fix author consistency:** Some posts list "Dev Team" or "Design Team" — use real names (Choeng Rayu, Rithi Reach, Yen Mara) to build personal credibility.
2. **Date realism:** Posts dated May 2026 and April 2026 are technically in the future or very recent. Ensure they do not look auto-generated.
3. **Add 1–2 client case study posts** (e.g., "How MR Training Cut Payroll Time by 90%") to bridge blog authority with portfolio proof.

---

## 13. Footer (`Footer.tsx`)

**Current Issues:**
- "© 2024 Chakrawal Digital" — 2 years out of date.
- "Universe Software" alt text on logo (see Section 1).

**Suggested Fix:**
```tsx
<p className="font-mono text-[0.65rem] text-text-muted text-center mt-4">
  © {new Date().getFullYear()} Chakrawal Digital. Built in Phnom Penh, Cambodia.
</p>
```

---

## 14. Section Numbering (`06 — SERVICES`, `07 — TEAM`, etc.)

**Issue:** The numbered prefixes ("05 — TIMELINE", "06 — SERVICES", "07 — TEAM", "08 — CONTACT") feel arbitrary. They imply a 10-step program or course, which does not fit a services company.

**Suggested Fix:** Remove the numbers. Use clean labels:
- "TIMELINE" → "OUR JOURNEY"
- "SERVICES" → "SERVICES"
- "TEAM" → "OUR TEAM"
- "CONTACT" → "GET IN TOUCH"

---

## 15. Work Showcase (`WorkShowcase.tsx`)

**Issue:** Uses generic Unsplash stock photos of office spaces and laptops. None of these images are your actual work.

**Suggested Fix:** Replace with:
- Actual screenshots of MR Labs, MR HRM, VersionDragon, etc.
- Or remove the scroll-scrub section entirely and replace with a client logo strip or case-study cards.

---

## Summary: Priority Ranking

| Priority | Fix | Files |
|----------|-----|-------|
| 🔴 **P0** | Fix "Universe Software" → "Chakrawal Digital" | `Navbar.tsx`, `Footer.tsx` |
| 🔴 **P0** | Fix date contradictions (2023 vs 2024 vs 2026) | `about_us.json`, `Footer.tsx`, `company_contact.json` |
| 🔴 **P0** | Replace placeholder LinkedIn URLs | `our_team.json` |
| 🟡 **P1** | Rewrite Vision / Mission / Goals with specifics | `visions.json`, `missions.json`, `goals.json` |
| 🟡 **P1** | Rewrite Journey timeline with real past milestones | `our_journey.json` |
| 🟡 **P1** | Fix misleading stats (50+ Projects → 10 Systems) | `projects.json` |
| 🟡 **P1** | Align Tech Stack with actual project evidence | `TechStack.tsx` |
| 🟢 **P2** | Improve service descriptions and modal details | `services.json`, `ServiceCard2.tsx` |
| 🟢 **P2** | Add outcome metrics to testimonials | `Testimonials.tsx` |
| 🟢 **P2** | Remove section number prefixes | Multiple JSON files |
| 🟢 **P2** | Replace Unsplash images with real project shots | `WorkShowcase.tsx` |
