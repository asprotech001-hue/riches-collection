import React, { useState } from 'react'
import {
  Rocket, Globe, MessageSquare, Monitor, Code2, Database,
  ArrowUpRight, Phone, Mail, MapPin, Menu, X,
} from 'lucide-react'

/* =========================================================================
   1. EDIT THESE — the only things you'll usually need to change
   ========================================================================= */

const WHATSAPP_NUMBER = '233246573300'
const PHONE_1 = '024 657 3300'
const PHONE_2 = '050 946 6256'
const EMAIL = 'asprotech001@gmail.com'
const LOCATION = 'Cape Coast, Central Region'

// One card per service. Add, remove, or edit freely — nothing else needs to change.
const SERVICES = [
  {
    code: 'SPEC_01',
    icon: Rocket,
    title: 'Business Landing Pages',
    desc: 'High-converting, single-page sites built to turn casual visitors into paying customers.',
  },
  {
    code: 'SPEC_02',
    icon: Globe,
    title: 'Business Websites',
    desc: 'Custom multi-page sites structured for speed, clarity, and search visibility.',
  },
  {
    code: 'SPEC_03',
    icon: MessageSquare,
    title: 'WhatsApp Automation',
    desc: 'Order flows that route straight into WhatsApp — no forms, no friction, no lost leads.',
  },
  {
    code: 'SPEC_04',
    icon: Monitor,
    title: 'PC Installs & Upgrades',
    desc: 'Hardware and software tuned for heavy-duty programming and everyday student setups.',
  },
  {
    code: 'SPEC_05',
    icon: Code2,
    title: 'Application Services',
    desc: 'Custom web and mobile applications built around specific local market problems.',
  },
  {
    code: 'SPEC_06',
    icon: Database,
    title: 'Database Setup & Management',
    desc: 'Secure, well-structured data infrastructure using Supabase, SQL, and cloud services.',
  },
]

// One entry per client quote. Empty for now — the section further down
// only renders once this has entries, so nothing awkward shows on launch.
// Add real ones like this once you have them:
// { quote: 'Exact words from the client, kept short.', name: 'Riche', business: "Riche's Collection" }
const TESTIMONIALS = []

// One card per project you want to show off. Paste the real deployed URL
// into `url` for each — links open in a NEW TAB (target="_blank" below),
// so visitors never actually leave the Seyon site, just get a second tab.
// Add as many objects here as you like; the grid lays them out automatically.
const PORTFOLIO = [
  {
    name: "Riche's Collection",
    kind: 'E-commerce storefront',
    note: 'A tailored menswear landing page with a live product catalog and WhatsApp checkout.',
    url: 'https://riches-collection.vercel.app', // <-- paste the live Riche's Collection URL here
  },
  // {
  //   name: 'Next Project Name',
  //   kind: 'e.g. Business website',
  //   note: 'One or two sentences describing what it does.',
  //   url: 'https://the-live-url.vercel.app',
  // },
]

/* =========================================================================
   2. COLORS — pulled straight from the ElSeyOn brand flyer
   ========================================================================= */
const BONE = '#FAF7EF'   // canvas
const NAVY = '#0B1A4A'   // headings, dark sections — "the architect's ink"
const INK = '#22252B'    // body copy
const ORANGE = '#F15A24' // the one accent color, used sparingly and deliberately

/* =========================================================================
   3. BLUEPRINT MOTIFS — the visual signature, used throughout the page
   ========================================================================= */

// An architectural dimension line: tick — line — tick, with a label
// centered above it. Used as a divider between sections, echoing a
// technical drawing rather than a plain <hr>.
function DimensionLine({ label, className = '' }) {
  return (
    <div className={`flex flex-col items-center ${className}`}>
      {label && (
        <span
          className="text-[10px] uppercase tracking-[0.25em] mb-2"
          style={{ color: `${NAVY}99`, fontFamily: 'IBM Plex Mono, monospace' }}
        >
          {label}
        </span>
      )}
      <svg width="120" height="10" viewBox="0 0 120 10">
        <line x1="0" y1="5" x2="120" y2="5" stroke={`${NAVY}40`} strokeWidth="1" />
        <line x1="0" y1="0" x2="0" y2="10" stroke={`${NAVY}40`} strokeWidth="1" />
        <line x1="120" y1="0" x2="120" y2="10" stroke={`${NAVY}40`} strokeWidth="1" />
      </svg>
    </div>
  )
}

// Faint graph-paper grid, laid behind the hero — the "blueprint" surface.
function BlueprintGrid() {
  return (
    <div
      className="absolute inset-0 pointer-events-none"
      style={{
        backgroundImage: `
          linear-gradient(${BONE}14 1px, transparent 1px),
          linear-gradient(90deg, ${BONE}14 1px, transparent 1px)
        `,
        backgroundSize: '32px 32px',
      }}
    />
  )
}

// A card with architectural corner brackets instead of a plain border —
// like a region marked out on a blueprint or spec sheet.
function SpecCard({ children, className = '' }) {
  const bracket = 'absolute w-4 h-4 border-current'
  return (
    <div className={`relative p-6 ${className}`} style={{ color: `${NAVY}30` }}>
      <span className={`${bracket} top-0 left-0 border-t-2 border-l-2`} />
      <span className={`${bracket} top-0 right-0 border-t-2 border-r-2`} />
      <span className={`${bracket} bottom-0 left-0 border-b-2 border-l-2`} />
      <span className={`${bracket} bottom-0 right-0 border-b-2 border-r-2`} />
      <div style={{ color: INK }}>{children}</div>
    </div>
  )
}

/* =========================================================================
   4. THE PAGE
   ========================================================================= */
export default function App() {
  const [menuOpen, setMenuOpen] = useState(false)

  const handleContact = (serviceName = 'General Inquiry') => {
    const message = `Hello ElSeyOn! I'm interested in "${serviceName}". I'd like to talk about building this for my business.`
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`, '_blank')
  }

  return (
    <div style={{ backgroundColor: BONE, color: INK }} className="min-h-screen font-sans">

      {/* ---------- NAV ---------- */}
      <nav className="sticky top-0 z-30 border-b px-6 py-4 flex items-center justify-between backdrop-blur-md"
           style={{ backgroundColor: `${BONE}E6`, borderColor: `${NAVY}1A` }}>
        <div className="flex items-center gap-2.5">
          <img src="/logo-mark.png" alt="Seyon logo" className="w-9 h-9 rounded-md object-cover" />
          <div className="leading-none">
            <span className="block font-semibold tracking-[0.15em] text-sm" style={{ color: NAVY, fontFamily: 'Fraunces, serif' }}>
              SEYON
            </span>
            <span className="block text-[9px] uppercase tracking-[0.2em] mt-0.5" style={{ color: `${INK}80` }}>
              Technology Solutions
            </span>
          </div>
        </div>

        <div className="hidden md:flex items-center gap-8 text-sm font-medium" style={{ color: INK }}>
          <a href="#services" className="hover:opacity-60 transition-opacity">Services</a>
          <a href="#why" className="hover:opacity-60 transition-opacity">Why Seyon</a>
          <a href="#work" className="hover:opacity-60 transition-opacity">Work</a>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => handleContact()}
            className="hidden sm:inline-flex px-4 py-2 text-xs font-bold rounded-sm"
            style={{ backgroundColor: ORANGE, color: '#fff' }}
          >
            Get Started
          </button>
          <button className="md:hidden" onClick={() => setMenuOpen((v) => !v)} style={{ color: NAVY }}>
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>

        {menuOpen && (
          <div className="absolute top-full left-0 right-0 md:hidden flex flex-col gap-4 px-6 py-6 border-b text-sm font-medium"
               style={{ backgroundColor: BONE, borderColor: `${NAVY}1A`, color: INK }}>
            <a href="#services" onClick={() => setMenuOpen(false)}>Services</a>
            <a href="#why" onClick={() => setMenuOpen(false)}>Why Seyon</a>
            <a href="#work" onClick={() => setMenuOpen(false)}>Work</a>
            <button
              onClick={() => { setMenuOpen(false); handleContact() }}
              className="px-4 py-2.5 text-xs font-bold rounded-sm w-fit"
              style={{ backgroundColor: ORANGE, color: '#fff' }}
            >
              Get Started
            </button>
          </div>
        )}
      </nav>

      {/* ---------- HERO ---------- */}
      <header className="relative overflow-hidden" style={{ backgroundColor: NAVY }}>
        <BlueprintGrid />
        <div className="relative max-w-6xl mx-auto px-6 py-20 md:py-28 grid md:grid-cols-12 gap-12 items-center">

          <div className="md:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border" style={{ borderColor: `${ORANGE}55` }}>
              <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: ORANGE }} />
              <span className="text-[10px] uppercase tracking-[0.25em] font-semibold" style={{ color: `${BONE}CC`, fontFamily: 'IBM Plex Mono, monospace' }}>
                The Digital Business Architect
              </span>
            </div>

            <h1 className="text-4xl md:text-6xl leading-[1.1]" style={{ color: BONE, fontFamily: 'Fraunces, serif', fontWeight: 500 }}>
              Thinking of how to grow your{' '}
              <span style={{ textDecoration: 'underline', textDecorationColor: ORANGE, textDecorationStyle: 'wavy', textUnderlineOffset: '8px' }}>
                campus business
              </span>{' '}
              digitally?
            </h1>

            <p className="text-base max-w-lg leading-relaxed" style={{ color: `${BONE}B3` }}>
              We help student entrepreneurs and regional businesses scale using
              high-performing landing pages, dependable systems, and WhatsApp
              order flows that turn visitors into customers.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 pt-2">
              <button
                onClick={() => handleContact('Launch Project')}
                className="px-6 py-3.5 text-xs font-bold rounded-sm flex items-center justify-center gap-2"
                style={{ backgroundColor: ORANGE, color: '#fff' }}
              >
                Let's build your business <ArrowUpRight size={14} />
              </button>
              <a
                href="#services"
                className="px-6 py-3.5 text-xs font-bold rounded-sm flex items-center justify-center border"
                style={{ borderColor: `${BONE}40`, color: BONE }}
              >
                Explore Services
              </a>
            </div>
          </div>

          {/* Portfolio mockup card — Live Iframe Preview */}
          <div className="md:col-span-5">
            <div className="rounded-lg p-6 space-y-5" style={{ backgroundColor: BONE }}>
              <div className="flex items-center justify-between pb-4 border-b" style={{ borderColor: `${NAVY}1A` }}>
                <div className="flex flex-col">
                  <span className="text-[10px] font-bold uppercase tracking-widest" style={{ color: `${INK}70`, fontFamily: 'IBM Plex Mono, monospace' }}>
                    Live System Preview
                  </span>
                  <span className="text-[11px]" style={{ color: NAVY, fontFamily: 'Fraunces, serif' }}>
                    Riche's Collection
                  </span>
                </div>
                <span className="text-[10px] px-2 py-1 rounded-sm font-semibold animate-pulse" style={{ backgroundColor: '#DCEFD1', color: '#276B1F' }}>
                  Interactive Live
                </span>
              </div>

              {/* The Live Sandbox Environment */}
              <div className="rounded-md border overflow-hidden relative group" style={{ borderColor: `${NAVY}14` }}>
                {/* 
                  We lock the height to 320px, set custom scrolling, and use a sandbox 
                  attribute to ensure security while keeping basic functionality active.
                */}
                <iframe
                  src="https://riches-collection.vercel.app"
                  title="Riche's Collection Live Preview"
                  className="w-full h-[320px] border-0 bg-white"
                  sandbox="allow-scripts allow-same-origin allow-forms"
                  loading="lazy"
                />
                
                {/* Subtle overlay hint that vanishes on hover */}
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 to-transparent p-3 pt-10 text-center pointer-events-none group-hover:opacity-0 transition-opacity duration-300">
                  <span className="text-[10px] text-white tracking-widest uppercase font-semibold">
                    Scroll & Click to Test Live Store
                  </span>
                </div>
              </div>

              <p className="text-[11px] italic text-center" style={{ color: `${INK}80` }}>
                "We build systems that don't just look pretty — they drive real sales."
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* ---------- WHY US ---------- */}
      <section id="why" className="px-6 py-20">
        <div className="max-w-5xl mx-auto">
          <div className="flex justify-center mb-12">
            <DimensionLine label="Why Seyon" />
          </div>
          <div className="grid md:grid-cols-3 gap-10">
            <ValueProp
              title="Lightning-Fast Pages"
              desc="Optimized React and Vite code, built to load instantly even on slow campus wifi or mobile data."
            />
            <ValueProp
              title="Free Hosting Included"
              desc="No ongoing hosting bills. We deploy your site to global edge servers at no extra cost to you."
            />
            <ValueProp
              title="WhatsApp Ordering Flows"
              desc="Customers pick what they want and press one button — the order lands straight in your chat."
            />
          </div>
        </div>
      </section>

      {/* ---------- SERVICES ---------- */}
      <section id="services" className="px-6 py-20" style={{ backgroundColor: '#F2EDE1' }}>
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-[10px] uppercase tracking-[0.25em]" style={{ color: ORANGE, fontFamily: 'IBM Plex Mono, monospace' }}>
              Service Matrix
            </span>
            <h2 className="text-3xl sm:text-4xl mt-3" style={{ color: NAVY, fontFamily: 'Fraunces, serif' }}>
              Everything to claim your digital space
            </h2>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {SERVICES.map((s) => {
              const Icon = s.icon
              return (
                <SpecCard key={s.code}>
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-2.5 rounded-sm" style={{ backgroundColor: `${NAVY}0D` }}>
                      <Icon size={20} style={{ color: NAVY }} />
                    </div>
                    <span className="text-[9px] tracking-widest" style={{ color: `${INK}55`, fontFamily: 'IBM Plex Mono, monospace' }}>
                      {s.code}
                    </span>
                  </div>
                  <h3 className="text-lg mb-2" style={{ color: NAVY, fontFamily: 'Fraunces, serif' }}>{s.title}</h3>
                  <p className="text-sm leading-relaxed mb-5" style={{ color: `${INK}99` }}>{s.desc}</p>
                  <button
                    onClick={() => handleContact(s.title)}
                    className="flex items-center gap-1.5 text-xs font-bold"
                    style={{ color: ORANGE }}
                  >
                    Inquire details <ArrowUpRight size={13} />
                  </button>
                </SpecCard>
              )
            })}
          </div>
        </div>
      </section>

      {/* ---------- PORTFOLIO ---------- */}
      <section id="work" className="px-6 py-20">
        <div className="max-w-5xl mx-auto">
          <div className="flex justify-center mb-12">
            <DimensionLine label="Live Systems" />
          </div>

          <div className="grid sm:grid-cols-2 gap-6">
            {PORTFOLIO.map((p) => (
              <a
                key={p.name}
                href={p.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group block rounded-md p-6 border transition-colors"
                style={{ borderColor: `${NAVY}1A` }}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-[10px] uppercase tracking-widest" style={{ color: `${INK}70`, fontFamily: 'IBM Plex Mono, monospace' }}>
                      {p.kind}
                    </span>
                    <h3 className="text-xl mt-1" style={{ color: NAVY, fontFamily: 'Fraunces, serif' }}>{p.name}</h3>
                  </div>
                  <ArrowUpRight size={18} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" style={{ color: ORANGE }} />
                </div>
                <p className="text-sm mt-3 leading-relaxed" style={{ color: `${INK}99` }}>{p.note}</p>
              </a>
            ))}

            {/* Placeholder card so the grid never looks empty as you add more work */}
            <div className="rounded-md p-6 border border-dashed flex items-center justify-center text-center"
                 style={{ borderColor: `${NAVY}33`, color: `${INK}55` }}>
              <p className="text-sm">Your next project goes here.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ---------- TESTIMONIALS ---------- */}
      {/* Renders nothing at all until TESTIMONIALS (top of file) has entries */}
      {TESTIMONIALS.length > 0 && (
        <section className="px-6 py-20" style={{ backgroundColor: '#F2EDE1' }}>
          <div className="max-w-5xl mx-auto">
            <div className="flex justify-center mb-12">
              <DimensionLine label="What Clients Say" />
            </div>
            <div className={`grid gap-6 ${TESTIMONIALS.length > 1 ? 'sm:grid-cols-2' : 'max-w-xl mx-auto'}`}>
              {TESTIMONIALS.map((t, i) => (
                <SpecCard key={i}>
                  <p className="text-base leading-relaxed" style={{ color: NAVY, fontFamily: 'Fraunces, serif', fontStyle: 'italic' }}>
                    "{t.quote}"
                  </p>
                  <p className="text-xs mt-5 uppercase tracking-widest" style={{ color: `${INK}70`, fontFamily: 'IBM Plex Mono, monospace' }}>
                    {t.name} — {t.business}
                  </p>
                </SpecCard>
              ))}
            </div>
          </div>
        </section>
      )}
       {/* ---------- FLEXIBLE INVESTMENT & PAY-AS-YOU-GO SECTION ---------- */}
      <section id="estimate" className="px-6 py-20 relative overflow-hidden" style={{ backgroundColor: '#fdfbfa' }}>
        <div className="max-w-4xl mx-auto">
          
          <div className="text-center mb-16">
            <span className="text-[10px] uppercase tracking-[0.25em] font-mono-blueprint" style={{ color: ORANGE }}>
              Section 02 // Financial Blueprint
            </span>
            <h2 className="text-3xl sm:text-4xl mt-3 font-fraunces" style={{ color: NAVY }}>
              Flexible, Negotiable, and Pay-As-You-Go
            </h2>
            <p className="text-sm mt-3 text-slate-500 max-w-lg mx-auto">
              We don't believe in locking down campus startups or local businesses with rigid, intimidating costs. Our investment structure adapts perfectly to your exact development phase.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 items-stretch">
            {/* Pay As You Go Info Card */}
            <div className="rounded-lg p-8 border shadow-sm relative overflow-hidden flex flex-col justify-between bg-white" style={{ borderColor: `${NAVY}1A` }}>
              <div className="space-y-4">
                <span className="text-[9px] tracking-widest font-mono-blueprint uppercase" style={{ color: ORANGE }}>
                  Phase-Based Commitment
                </span>
                <h3 className="text-2xl font-fraunces" style={{ color: NAVY }}>
                  Pay-As-You-Go Model
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Break your project down into independent, digestible milestones. You only fund the active stage of development (e.g., initial wireframe design, core functional build, or final launch setup). If you need to pause or pivot, your budget pauses with you. No high upfront liabilities.
                </p>
              </div>
              <div className="mt-8 pt-4 border-t flex items-center justify-between" style={{ borderColor: `${NAVY}10` }}>
                <span className="text-xs font-mono-blueprint text-slate-500">Risk-Free Pipeline</span>
                <span className="font-bold text-xs font-mono-blueprint" style={{ color: ORANGE }}>0% Static Overhead</span>
              </div>
            </div>

            {/* Fully Negotiable Info Card */}
            <div className="rounded-lg p-8 border shadow-sm relative overflow-hidden flex flex-col justify-between bg-white" style={{ borderColor: `${NAVY}1A` }}>
              <div className="space-y-4">
                <span className="text-[9px] tracking-widest font-mono-blueprint uppercase text-slate-500">
                  Tailored Budgets
                </span>
                <h3 className="text-2xl font-fraunces" style={{ color: NAVY }}>
                  100% Negotiable Tiers
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Every business has a unique baseline. Whether you are a small local shop, a growing student ecosystem, or an enterprise looking to optimize automation, we sit down with you to adapt our code solutions to what you can comfortably invest. We design around your budget, not the other way around.
                </p>
              </div>
              <div className="mt-8 pt-4 border-t flex items-center justify-between" style={{ borderColor: `${NAVY}10` }}>
                <span className="text-xs font-mono-blueprint text-slate-500">Adaptive Specs</span>
                <span className="font-bold text-xs font-mono-blueprint" style={{ color: 'emerald-600' }}>Built For Local Scale</span>
              </div>
            </div>
          </div>

          {/* Process Roadmap */}
          <div className="mt-12 rounded-lg p-8 border text-center bg-transparent" style={{ borderColor: `${NAVY}1A`, backgroundColor: `${BONE}40` }}>
            <h3 className="text-lg font-bold font-fraunces mb-6" style={{ color: NAVY }}>How It Works</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 text-left">
              <div className="space-y-2">
                <span className="text-xs font-bold font-mono-blueprint" style={{ color: ORANGE }}>01 // Pitch Your Idea</span>
                <p className="text-xs text-slate-500">Share your digital goals with us on WhatsApp or in person in Cape Coast.</p>
              </div>
              <div className="space-y-2">
                <span className="text-xs font-bold font-mono-blueprint" style={{ color: NAVY }}>02 // Adapt the Scope</span>
                <p className="text-xs text-slate-500">We negotiate features and define customizable milestone tiers to match your budget.</p>
              </div>
              <div className="space-y-2">
                <span className="text-xs font-bold font-mono-blueprint" style={{ color: NAVY }}>03 // Pay as we Build</span>
                <p className="text-xs text-slate-500">We start coding immediately. Pay sequentially only as each milestone is completed and verified.</p>
              </div>
            </div>
            
            <button
              onClick={() => handleContact("Negotiable Investment Discovery")}
              className="mt-10 inline-flex items-center gap-2 py-3.5 px-8 rounded-sm font-mono-blueprint text-xs font-bold text-white transition-transform active:scale-[0.98] uppercase tracking-wider"
              style={{ backgroundColor: ORANGE }}
            >
              Start Free Discovery Chat
            </button>
          </div>

        </div>
      </section>

      {/* ---------- FOOTER ---------- */}
      <footer className="px-6 py-16" style={{ backgroundColor: NAVY, color: BONE }}>
        <div className="max-w-6xl mx-auto grid md:grid-cols-12 gap-10">
          <div className="md:col-span-5 space-y-3">
            <div className="flex items-center gap-3">
              <img src="/logo-mark.png" alt="Seyon logo" className="w-10 h-10 rounded-md object-cover" />
              <h3 className="text-2xl" style={{ fontFamily: 'Fraunces, serif' }}>ElSeyOn</h3>
            </div>
            <p className="text-sm max-w-xs leading-relaxed" style={{ color: `${BONE}99` }}>
              Building ideas. Creating solutions. Top-tier digital architecture
              for regional and campus enterprises.
            </p>
            <p className="text-[10px] uppercase tracking-widest" style={{ color: `${ORANGE}CC`, fontFamily: 'IBM Plex Mono, monospace' }}>
              Founder &amp; Chief Architect: Asey
            </p>
          </div>

          <div className="md:col-span-7 space-y-6">
            <h4 className="text-xs font-bold uppercase tracking-widest" style={{ color: ORANGE }}>Connect Directly</h4>
            <div className="grid sm:grid-cols-2 gap-4 text-sm" style={{ color: `${BONE}CC` }}>
              <a href={`tel:${PHONE_1.replace(/\s/g, '')}`} className="flex items-center gap-2 hover:opacity-75 transition-opacity">
                <Phone size={14} /> {PHONE_1}
              </a>
              <a href={`tel:${PHONE_2.replace(/\s/g, '')}`} className="flex items-center gap-2 hover:opacity-75 transition-opacity">
                <Phone size={14} /> {PHONE_2}
              </a>
              <a href={`mailto:${EMAIL}`} className="flex items-center gap-2 hover:opacity-75 transition-opacity sm:col-span-2">
                <Mail size={14} /> {EMAIL}
              </a>
              <div className="flex items-center gap-2 sm:col-span-2" style={{ color: `${BONE}80` }}>
                <MapPin size={14} /> {LOCATION}
              </div>
            </div>

            <div className="pt-6 border-t text-[11px] flex flex-col sm:flex-row justify-between items-center gap-3"
                 style={{ borderColor: `${BONE}1A`, color: `${BONE}66` }}>
              <p>© {new Date().getFullYear()} ElSeyOn. All rights reserved.</p>
              <p style={{ fontFamily: 'IBM Plex Mono, monospace' }}>Built by Seyon, on Seyon's own stack.</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

function ValueProp({ title, desc }) {
  return (
    <div>
      <div className="w-2 h-2 rounded-full mb-4" style={{ backgroundColor: ORANGE }} />
      <h3 className="text-lg mb-2" style={{ color: NAVY, fontFamily: 'Fraunces, serif' }}>{title}</h3>
      <p className="text-sm leading-relaxed" style={{ color: `${INK}99` }}>{desc}</p>
    </div>
  )
}
