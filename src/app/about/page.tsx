// src/app/about/page.tsx
// ═══════════════════════════════════════════════════════════════════════════
// About Novana — mission, founder story, and contact.
//
// HOW TO CUSTOMISE:
// Search for every [PLACEHOLDER] comment and replace with your real content.
// ═══════════════════════════════════════════════════════════════════════════

import Link from 'next/link'

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-nova-bg">

      {/* ── Top nav ───────────────────────────────────────────────────────── */}
      <nav className="flex items-center justify-between px-6 md:px-12 py-4
                      border-b border-nova-border/40 bg-nova-bg/80 backdrop-blur-md
                      sticky top-0 z-10">
        <Link href="/" className="flex items-center gap-2 group">
          <span className="w-8 h-8 rounded-xl bg-nova-gradient flex items-center
                           justify-center text-white font-display text-sm
                           group-hover:scale-105 transition-transform">
            n
          </span>
          <span className="font-display text-xl text-nova-text">novana</span>
        </Link>
        <div className="flex items-center gap-4">
          <Link href="/auth/login"
                className="text-sm text-nova-muted hover:text-nova-text transition-colors">
            Log in
          </Link>
          <Link href="/auth/signup" className="btn-primary text-sm px-5 py-2.5">
            Get started
          </Link>
        </div>
      </nav>

      <div className="max-w-3xl mx-auto px-6 py-12 md:py-20 space-y-20">

        {/* ── Hero ──────────────────────────────────────────────────────────── */}
        <section className="text-center space-y-6">
          <span className="pill inline-flex">About Novana</span>
          <h1 className="font-display text-5xl md:text-6xl text-nova-text
                         leading-tight tracking-tight">
            Built for bodies that{' '}
            <span className="gradient-text">deserve clarity</span>
          </h1>
          <p className="text-nova-muted text-lg leading-relaxed max-w-xl mx-auto">
            Novana started with a simple frustration — tracking PMOS symptoms
            shouldn't feel like a medical exam. It should feel like journaling.
          </p>
        </section>

        {/* ── Decorative divider ────────────────────────────────────────────── */}
        <div className="flex items-center gap-4">
          <div className="flex-1 h-px bg-nova-border/40" />
          <span className="text-nova-border text-lg">✦</span>
          <div className="flex-1 h-px bg-nova-border/40" />
        </div>

        {/* ── Mission ───────────────────────────────────────────────────────── */}
        <section className="space-y-6">
          <div>
            <span className="pill mb-3 inline-flex">Our mission</span>
            <h2 className="font-display text-3xl md:text-4xl text-nova-text mt-2">
              Know your body. Finally.
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-4">
            {[
              {
                icon:  '🔍',
                color: 'bg-nova-purple/10',
                title: 'Clarity over complexity',
                desc:  'PMOS affects millions of people yet most symptom tracking tools feel clinical and cold. We built something warm, simple, and human.',
              },
              {
                icon:  '🤝',
                color: 'bg-nova-peach/15',
                title: 'Patterns, not diagnoses',
                desc:  'Novana never tells you what you have. It helps you see what\'s happening — so you can have better conversations with your doctor.',
              },
              {
                icon:  '🔒',
                color: 'bg-nova-sky/15',
                title: 'Private by design',
                desc:  'Your health data is yours. We don\'t sell it, share it with advertisers, or use it for anything beyond running the app for you.',
              },
            ].map((item) => (
              <div key={item.title} className="card space-y-3">
                <div className={`w-10 h-10 rounded-2xl ${item.color} flex items-center
                                 justify-center text-xl`}>
                  {item.icon}
                </div>
                <h3 className="font-display text-lg text-nova-text">{item.title}</h3>
                <p className="text-nova-muted text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── PMOS callout ──────────────────────────────────────────────────── */}
        <section className="card bg-nova-gradient !p-8 md:!p-12 text-white rounded-4xl">
          <span className="inline-flex items-center gap-2 bg-white/20 text-white
                           text-xs font-medium px-3 py-1.5 rounded-full mb-6">
            ✦ Why PMOS?
          </span>
          <h2 className="font-display text-3xl md:text-4xl leading-tight mb-4">
            The name just changed.<br />The experience didn't.
          </h2>
          <p className="text-white/80 text-base leading-relaxed max-w-xl">
            PCOS was officially renamed{' '}
            <strong className="text-white">
              Polyendocrine Metabolic Ovarian Syndrome (PMOS)
            </strong>{' '}
            following a landmark global consensus — the most extensive disease-renaming
            process in history. The new name reflects that this is a whole-body
            hormonal condition. Novana is built around that full picture.
          </p>
        </section>

        {/* ── Founder ───────────────────────────────────────────────────────── */}
        <section className="space-y-6">
          <div>
            <span className="pill mb-3 inline-flex">Founder</span>
            <h2 className="font-display text-3xl md:text-4xl text-nova-text mt-2">
              The person behind Novana
            </h2>
          </div>

          <div className="card flex flex-col md:flex-row gap-6 md:gap-8 items-start">
            {/* Avatar placeholder — replace with a real photo later */}
            <div className="w-20 h-20 md:w-24 md:h-24 rounded-3xl bg-nova-gradient
                            flex items-center justify-center text-white font-display
                            text-3xl flex-shrink-0 shadow-nova">
              {/* [PLACEHOLDER] Replace this with your initial or a photo */}
              R
            </div>

            <div className="space-y-3 flex-1">
              {/* [PLACEHOLDER] Replace with your name */}
              <h3 className="font-display text-2xl text-nova-text">
                Rupsaa G.
              </h3>

              {/* [PLACEHOLDER] Replace with your title/role */}
              <p className="text-nova-purple text-sm font-medium">
                Founder & Builder
              </p>

              {/* [PLACEHOLDER] Replace with your story — 2-3 paragraphs */}
              <div className="space-y-3 text-nova-muted text-sm leading-relaxed">
                <p>
                  [Write your story here — why did you build Novana? What frustration
                  or experience led you to create it? This is where you connect with
                  your users on a personal level.]
                </p>
                <p>
                  [A second paragraph about your background, what you studied,
                  or what drives you to keep building this.]
                </p>
                <p>
                  [Optional: a closing line about your vision for Novana —
                  where you hope it goes.]
                </p>
              </div>

              {/* Social links — [PLACEHOLDER] add your real links */}
              <div className="flex items-center gap-3 pt-2">
                {/*
                  Uncomment and fill in your links:

                  <a href="https://twitter.com/yourhandle"
                     target="_blank" rel="noopener noreferrer"
                     className="text-xs text-nova-muted hover:text-nova-purple
                                transition-colors font-medium">
                    Twitter →
                  </a>
                  <a href="https://linkedin.com/in/yourprofile"
                     target="_blank" rel="noopener noreferrer"
                     className="text-xs text-nova-muted hover:text-nova-purple
                                transition-colors font-medium">
                    LinkedIn →
                  </a>
                */}
                <span className="text-xs text-nova-muted/50 italic">
                  Social links coming soon
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* ── Contact ───────────────────────────────────────────────────────── */}
        <section className="space-y-6">
          <div>
            <span className="pill mb-3 inline-flex">Get in touch</span>
            <h2 className="font-display text-3xl md:text-4xl text-nova-text mt-2">
              We'd love to hear from you
            </h2>
            <p className="text-nova-muted text-sm mt-2 leading-relaxed">
              Feedback, ideas, bug reports, or just want to say hi — all welcome.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            {/* Email */}
            <div className="card space-y-2 hover:-translate-y-0.5 transition-transform">
              <div className="w-10 h-10 rounded-2xl bg-nova-purple/10 flex items-center
                              justify-center text-xl">
                ✉️
              </div>
              <h3 className="font-display text-lg text-nova-text">Email us</h3>
              <p className="text-nova-muted text-sm">
                For general questions, feedback, or support.
              </p>
              {/* [PLACEHOLDER] Replace with your email */}
              <p className="text-nova-purple text-sm font-medium">
                [your@email.com]
              </p>
            </div>

            {/* Feedback */}
            <div className="card space-y-2 hover:-translate-y-0.5 transition-transform">
              <div className="w-10 h-10 rounded-2xl bg-nova-peach/20 flex items-center
                              justify-center text-xl">
                💡
              </div>
              <h3 className="font-display text-lg text-nova-text">Share feedback</h3>
              <p className="text-nova-muted text-sm">
                Found a bug or have a feature idea? We read everything.
              </p>
              {/* [PLACEHOLDER] Replace with your email or a feedback form link */}
              <p className="text-nova-purple text-sm font-medium">
                [your@email.com]
              </p>
            </div>
          </div>
        </section>

        {/* ── CTA ───────────────────────────────────────────────────────────── */}
        <section className="text-center space-y-6 py-8">
          <h2 className="font-display text-3xl md:text-4xl text-nova-text">
            Ready to start tracking?
          </h2>
          <p className="text-nova-muted text-sm">
            Free to use. Private by default. No medical jargon.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/auth/signup" className="btn-primary text-base px-8 py-4">
              Create free account →
            </Link>
            <Link href="/" className="btn-secondary text-base px-8 py-4">
              Learn more
            </Link>
          </div>
        </section>

        {/* ── Footer ────────────────────────────────────────────────────────── */}
        <div className="pt-8 border-t border-nova-border/40 flex flex-col sm:flex-row
                        items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="w-6 h-6 rounded-lg bg-nova-gradient flex items-center
                             justify-center text-white font-display text-xs">n</span>
            <span className="font-display text-nova-muted text-sm">novana</span>
          </div>
          <div className="flex items-center gap-6">
            <Link href="/privacy"
                  className="text-nova-muted/60 text-xs hover:text-nova-muted transition-colors">
              Privacy
            </Link>
            <Link href="/terms"
                  className="text-nova-muted/60 text-xs hover:text-nova-muted transition-colors">
              Terms
            </Link>
            <Link href="/"
                  className="text-nova-muted/60 text-xs hover:text-nova-muted transition-colors">
              Home
            </Link>
          </div>
        </div>

      </div>
    </main>
  )
}
