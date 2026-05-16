// src/app/page.tsx
// ─────────────────────────────────────────────────────────────────────────────
// Novana Landing Page
//
// Sections:
//  1. Navbar
//  2. Hero
//  3. Features strip
//  4. How it works
//  5. Quote / testimonial
//  6. CTA
//  7. Footer
//
// This is a SERVER component (no 'use client') — good for SEO + performance.
// ─────────────────────────────────────────────────────────────────────────────

import Link from 'next/link'

// ── Small reusable sub-components (defined below the main export) ─────────────

function NavBar() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between
                    px-6 md:px-12 py-4
                    bg-nova-bg/80 backdrop-blur-md border-b border-nova-border/40">
      {/* Logo */}
      <Link href="/" className="flex items-center gap-2 group">
        {/* Small abstract "n" orb */}
        <span className="w-8 h-8 rounded-xl bg-nova-gradient flex items-center
                         justify-center text-white font-display text-sm font-semibold
                         shadow-nova-sm group-hover:scale-105 transition-transform">
          n
        </span>
        <span className="font-display text-xl text-nova-text tracking-tight">
          novana
        </span>
      </Link>

      {/* Nav links — hidden on mobile */}
      <div className="hidden md:flex items-center gap-8">
        <Link href="#features"
              className="text-sm text-nova-muted hover:text-nova-text transition-colors">
          Features
        </Link>
        <Link href="#how-it-works"
              className="text-sm text-nova-muted hover:text-nova-text transition-colors">
          How it works
        </Link>
        <Link href="#about"
              className="text-sm text-nova-muted hover:text-nova-text transition-colors">
          About PMOS
        </Link>
      </div>

      {/* Auth buttons */}
      <div className="flex items-center gap-3">
        <Link href="/auth/login" className="btn-ghost hidden md:inline-flex">
          Log in
        </Link>
        <Link href="/auth/signup" className="btn-primary">
          Get started
        </Link>
      </div>
    </nav>
  )
}

// ── Feature card data ─────────────────────────────────────────────────────────
const features = [
  {
    icon: '📈',
    color: 'bg-nova-purple/10 text-nova-purple',
    title: 'Track 8 symptoms daily',
    desc:  'Mood, fatigue, sleep, stress, acne, cramps, exercise, and cycle status — all in one 60-second daily check-in.',
  },
  {
    icon: '✨',
    color: 'bg-nova-peach/20 text-nova-peach',
    title: 'AI pattern insights',
    desc:  'Gentle, non-diagnostic summaries of what your body is telling you. Powered by GPT-4 with safety guardrails.',
  },
  {
    icon: '📊',
    color: 'bg-nova-sky/20 text-nova-sky',
    title: 'Beautiful trend charts',
    desc:  'See 30-day trends across every symptom. Spot correlations between sleep, mood, and flare-ups visually.',
  },
  {
    icon: '📓',
    color: 'bg-nova-rose/20 text-nova-rose',
    title: 'Private journal',
    desc:  'Write freely. AI summarises your emotional patterns over time — privately, securely, just for you.',
  },
]

// ── How it works steps ────────────────────────────────────────────────────────
const steps = [
  {
    num: '01',
    title: 'Log your day',
    desc:  'Takes under a minute. Slide your scores for 8 symptoms every day. No complicated forms.',
  },
  {
    num: '02',
    title: 'Watch patterns emerge',
    desc:  'Charts show you 30-day trends. See how your sleep affects your mood, or when cramps peak.',
  },
  {
    num: '03',
    title: 'Get AI clarity',
    desc:  'Ask for insights anytime. The AI notices correlations you might miss and explains them gently.',
  },
]

// ── Main page export ──────────────────────────────────────────────────────────
export default function LandingPage() {
  return (
    <main className="min-h-screen bg-nova-bg overflow-x-hidden">
      <NavBar />

      {/* ── HERO ─────────────────────────────────────────────────────────── */}
      <section className="relative pt-32 pb-24 px-6 md:px-12 max-w-6xl mx-auto">
        {/* Decorative blobs — CSS-only, no JS */}
        <div className="absolute top-16 right-0 w-96 h-96 rounded-full
                        bg-nova-rose/20 blur-3xl pointer-events-none -z-10" />
        <div className="absolute bottom-0 left-0 w-80 h-80 rounded-full
                        bg-nova-purple/15 blur-3xl pointer-events-none -z-10" />
        <div className="absolute top-32 left-1/2 w-64 h-64 rounded-full
                        bg-nova-peach/20 blur-3xl pointer-events-none -z-10" />

        <div className="max-w-3xl">
          {/* Pill badge */}
          <div className="animate-fade-in opacity-0-start inline-flex items-center gap-2
                          bg-nova-purple/10 text-nova-purple text-xs font-medium
                          px-4 py-2 rounded-full mb-8 border border-nova-purple/20">
            <span className="w-1.5 h-1.5 rounded-full bg-nova-purple animate-pulse" />
            Designed for PMOS symptom tracking
          </div>

          {/* Main headline */}
          <h1 className="font-display text-5xl md:text-7xl text-nova-text
                         leading-[1.1] tracking-tight mb-6
                         animate-fade-up opacity-0-start">
            Know your body.{' '}
            <span className="gradient-text">Finally.</span>
          </h1>

          {/* Sub-headline */}
          <p className="text-nova-muted text-lg md:text-xl leading-relaxed mb-10 max-w-xl
                        animate-fade-up-200 opacity-0-start">
            Novana helps you track PMOS symptoms, discover hidden patterns, and
            get gentle AI insights — without the overwhelm or the medical jargon.
          </p>

          {/* CTA buttons */}
          <div className="flex flex-col sm:flex-row items-start gap-4
                          animate-fade-up-400 opacity-0-start">
            <Link href="/auth/signup" className="btn-primary text-base px-8 py-4">
              Start tracking free →
            </Link>
            <Link href="#how-it-works" className="btn-ghost text-base px-8 py-4">
              See how it works
            </Link>
          </div>

          {/* Social proof strip */}
          <p className="mt-8 text-nova-muted text-xs animate-fade-up-600 opacity-0-start">
            No credit card required · Private by default · Not medical advice
          </p>
        </div>

        {/* Hero card mock — a decorative dashboard preview */}
        <div className="mt-16 md:mt-0 md:absolute md:top-24 md:right-8
                        max-w-sm w-full animate-fade-in opacity-0-start">
          <HeroPreviewCard />
        </div>
      </section>

      {/* ── FEATURES ─────────────────────────────────────────────────────── */}
      <section id="features" className="py-24 px-6 md:px-12">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <span className="pill mb-4">Features</span>
            <h2 className="font-display text-4xl md:text-5xl text-nova-text mt-3">
              Everything you need to{' '}
              <span className="gradient-text">understand your cycle</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((f) => (
              <div key={f.title}
                   className="card group hover:-translate-y-1 transition-all duration-300">
                <div className={`w-12 h-12 rounded-2xl ${f.color} flex items-center
                                 justify-center text-2xl mb-4 group-hover:scale-105
                                 transition-transform duration-200`}>
                  {f.icon}
                </div>
                <h3 className="font-display text-lg text-nova-text mb-2">{f.title}</h3>
                <p className="text-nova-muted text-sm leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ─────────────────────────────────────────────────── */}
      <section id="how-it-works"
               className="py-24 px-6 md:px-12 bg-nova-card/50">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <span className="pill mb-4">How it works</span>
            <h2 className="font-display text-4xl md:text-5xl text-nova-text mt-3">
              Simple as a daily ritual
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {steps.map((s, i) => (
              <div key={s.num} className="relative">
                {/* Connector line between steps */}
                {i < steps.length - 1 && (
                  <div className="hidden md:block absolute top-6 left-full
                                  w-full h-px bg-nova-border z-0 -translate-x-4" />
                )}
                <div className="relative z-10">
                  <div className="font-display text-5xl text-nova-purple/20 mb-4">
                    {s.num}
                  </div>
                  <h3 className="font-display text-2xl text-nova-text mb-3">
                    {s.title}
                  </h3>
                  <p className="text-nova-muted text-sm leading-relaxed">{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── ABOUT PMOS CALLOUT ────────────────────────────────────────────── */}
      <section id="about" className="py-24 px-6 md:px-12">
        <div className="max-w-4xl mx-auto">
          <div className="card bg-nova-gradient p-10 md:p-16 text-white rounded-4xl">
            <span className="inline-flex items-center gap-2 bg-white/20 text-white
                             text-xs font-medium px-3 py-1.5 rounded-full mb-6">
              ✦ Did you know?
            </span>
            <h2 className="font-display text-3xl md:text-5xl leading-tight mb-6">
              PCOS was just officially renamed{' '}
              <span className="underline decoration-white/40">PMOS</span>
            </h2>
            <p className="text-white/80 text-base md:text-lg leading-relaxed mb-8 max-w-2xl">
              Polyendocrine Metabolic Ovarian Syndrome — the new name reflects that
              this is a whole-body hormonal condition, not just an ovarian issue.
              Novana is built around the full picture: metabolic, endocrine,
              reproductive, and psychological health together.
            </p>
            <Link href="/auth/signup"
                  className="inline-flex items-center gap-2 bg-white text-nova-purple
                             font-medium px-6 py-3 rounded-2xl text-sm
                             hover:bg-white/90 transition-colors">
              Start tracking →
            </Link>
          </div>
        </div>
      </section>

      {/* ── QUOTE ────────────────────────────────────────────────────────── */}
      <section className="py-16 px-6 md:px-12 bg-nova-card/50">
        <div className="max-w-3xl mx-auto text-center">
          <p className="font-display text-2xl md:text-3xl text-nova-text
                        leading-relaxed italic mb-6">
            "For the first time I could see that my worst fatigue days were
            always two days after bad sleep. It sounds obvious — but I needed
            to see it to believe it."
          </p>
          <p className="text-nova-muted text-sm">
            — Beta tester, diagnosed with PMOS in 2023
          </p>
        </div>
      </section>

      {/* ── FINAL CTA ────────────────────────────────────────────────────── */}
      <section className="py-24 px-6 md:px-12">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="font-display text-4xl md:text-5xl text-nova-text mb-6">
            Ready to listen to your body?
          </h2>
          <p className="text-nova-muted text-base mb-10 leading-relaxed">
            Join Novana for free. No credit card, no medical jargon, no overwhelm.
            Just clarity, one day at a time.
          </p>
          <Link href="/auth/signup" className="btn-primary text-base px-10 py-4">
            Create your free account →
          </Link>
          <p className="mt-6 text-nova-muted/60 text-xs">
            ⚠ This is not medical advice. Novana provides pattern insights only.
            Always consult a healthcare professional for medical decisions.
          </p>
        </div>
      </section>

      {/* ── FOOTER ───────────────────────────────────────────────────────── */}
      <footer className="border-t border-nova-border/40 py-10 px-6 md:px-12">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row
                        items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="w-6 h-6 rounded-lg bg-nova-gradient flex items-center
                             justify-center text-white font-display text-xs">
              n
            </span>
            <span className="font-display text-nova-muted text-sm">novana</span>
          </div>
          <p className="text-nova-muted/60 text-xs text-center">
            Not medical advice · Private by design · © {new Date().getFullYear()} Novana
          </p>
          <div className="flex items-center gap-6">
            <Link href="/privacy"
                  className="text-nova-muted/60 text-xs hover:text-nova-muted transition-colors">
              Privacy
            </Link>
            <Link href="/terms"
                  className="text-nova-muted/60 text-xs hover:text-nova-muted transition-colors">
              Terms
            </Link>
          </div>
        </div>
      </footer>
    </main>
  )
}

// ── Decorative hero preview card (not real data, just visual) ─────────────────
function HeroPreviewCard() {
  const symptoms = [
    { label: 'Mood',    val: 7,  color: 'bg-nova-purple' },
    { label: 'Fatigue', val: 4,  color: 'bg-nova-peach'  },
    { label: 'Sleep',   val: 8,  color: 'bg-nova-sky'    },
    { label: 'Stress',  val: 3,  color: 'bg-nova-rose'   },
  ]

  return (
    <div className="card animate-float shadow-nova-lg rounded-4xl p-6 max-w-xs ml-auto">
      {/* Card header */}
      <div className="flex items-center justify-between mb-5">
        <div>
          <p className="text-xs text-nova-muted">Today's check-in</p>
          <p className="font-display text-nova-text text-lg mt-0.5">
            Wednesday ✦
          </p>
        </div>
        <div className="w-10 h-10 rounded-2xl bg-nova-gradient flex items-center
                        justify-center text-white text-sm">
          ✓
        </div>
      </div>

      {/* Symptom bars */}
      <div className="space-y-3">
        {symptoms.map((s) => (
          <div key={s.label}>
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs text-nova-muted">{s.label}</span>
              <span className="text-xs font-medium text-nova-text">{s.val}/10</span>
            </div>
            <div className="h-2 rounded-full bg-nova-border">
              <div
                className={`h-2 rounded-full ${s.color}/70 transition-all duration-500`}
                style={{ width: `${s.val * 10}%` }}
              />
            </div>
          </div>
        ))}
      </div>

      {/* AI insight preview */}
      <div className="mt-5 bg-nova-purple/8 border border-nova-purple/20
                      rounded-2xl p-4">
        <p className="text-nova-purple text-xs font-medium mb-1">✨ AI insight</p>
        <p className="text-nova-muted text-xs leading-relaxed">
          Your mood tends to be highest on days when sleep is above 7h.
        </p>
      </div>
    </div>
  )
}
