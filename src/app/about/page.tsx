'use client'

import Link from 'next/link'

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-nova-bg">
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
        <Link href="/" className="text-sm text-nova-muted hover:text-nova-text transition-colors">
          ← Back to home
        </Link>
      </nav>

      <div className="max-w-2xl mx-auto px-6 py-12 md:py-16">
        <div className="mb-10">
          <span className="inline-flex items-center gap-1 text-xs font-medium px-3 py-1
                           rounded-full bg-nova-purple/10 text-nova-purple mb-4">
            Our story
          </span>
          <h1 className="font-display text-4xl md:text-5xl text-nova-text mt-3 mb-4">
            Why Novana exists
          </h1>
        </div>

        <div className="card space-y-6 text-nova-muted leading-relaxed">
          <p className="font-display text-2xl md:text-3xl text-nova-text leading-snug">
            I was 14 years old when I got diagnosed with PMOS.
          </p>

          <p className="text-sm md:text-base">
            It was one of the most bittersweet moments of my life. On one hand I was
            relieved, because for years I had been told to ignore my symptoms and wait
            for my body to regulate on its own, which it never did. But on the other
            hand, getting diagnosed felt like a burden had been placed on me, making me
            feel like I&apos;d always have a disadvantage to everyone else.
          </p>

          <p className="text-sm md:text-base">
            Since my diagnosis, I was pressured to start contraceptives. There was no
            official cure for PMOS, and the only thing that could control my symptoms
            was birth control. After turning 18 and moving across the country, I started
            thinking about the future, and started to worry about how I could ever go
            back to the body I had before contraceptives. One where I was always fatigued,
            overbleeding, and never felt confident about my body.
          </p>

          <p className="text-sm md:text-base">
            Because of the weight that PMOS had on my life, I spent over two years
            researching it. Using my background in Computer Engineering, I built an AI
            model that identifies trends in people&apos;s symptoms and can make an assumption
            on whether or not they have PMOS. After all of this, I decided to put
            everything I learned into this app, so that other women can find the
            direction and guidance that led me astray for years.
          </p>

          <p className="text-sm md:text-base">
            Novana is everything I learned, built into something I wish had existed when
            I was 14. It&apos;s not a diagnostic tool. It&apos;s not a replacement for your doctor.
            It&apos;s a place to finally feel like your body makes sense. It&apos;s to see your
            patterns, track your rhythms, and walk into every appointment with proof that
            I was never able to give growing up.
          </p>

          <p className="text-sm md:text-base">
            PMOS turned out to be a gift, because it taught me how to care for my body,
            how to advocate for myself, and how to build something that might help women
            all over the world find the direction I spent years searching for.
          </p>

          <p className="font-display text-lg text-nova-text">
            That&apos;s why Novana exists. ♡
          </p>

          <div className="pt-6 border-t border-nova-border/40">
            <p className="font-display text-lg text-nova-text">— Rupsaa G., Founder</p>
            <p className="text-sm text-nova-muted italic mt-1">
              Diagnosed at 14. Building at 18.
            </p>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-nova-border/40 flex flex-col sm:flex-row
                        items-center justify-between gap-4">
          <Link href="/auth/signup" className="btn-primary text-sm px-6 py-2.5">
            Join Novana →
          </Link>
          <div className="flex items-center gap-6">
            <Link href="/privacy" className="text-nova-muted/60 text-xs hover:text-nova-muted transition-colors">
              Privacy
            </Link>
            <Link href="/terms" className="text-nova-muted/60 text-xs hover:text-nova-muted transition-colors">
              Terms
            </Link>
          </div>
        </div>
      </div>
    </main>
  )
}
