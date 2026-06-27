import Link from 'next/link'
import Image from 'next/image'
import WaitlistForm from '@/components/WaitlistForm'

export default function LandingPage() {
  return (
    <div className="min-h-screen">
      {/* NAV */}
      <header className="sticky top-0 z-30 border-b border-nova-border/50"
              style={{ backdropFilter: 'blur(16px)', background: 'rgba(247,242,237,0.7)' }}>
        <div className="max-w-[1240px] mx-auto flex items-center justify-between px-6 py-4">
          <Link href="/" className="wordmark">novana</Link>
          <nav className="hidden md:flex gap-7 text-sm text-nova-muted">
            <a href="#how-it-works" className="hover:text-nova-text transition-colors">How it works</a>
            <a href="#features" className="hover:text-nova-text transition-colors">Why Novana</a>
            <Link href="/about" className="hover:text-nova-text transition-colors">Manifesto</Link>
          </nav>
          <div className="flex items-center gap-2.5">
            <Link href="/auth/login" className="btn-ghost text-sm px-4 py-2">Sign in</Link>
            <Link href="/onboarding" className="btn-primary text-sm px-4 py-2.5">Get started</Link>
          </div>
        </div>
      </header>

      {/* HERO */}
      <section className="relative max-w-[1240px] mx-auto px-6 pt-16 pb-20 grid md:grid-cols-[1.05fr_1fr] gap-14 items-center">
        <div className="absolute -inset-x-52 top-[-100px] h-[700px] -z-10 pointer-events-none"
             style={{ background: 'radial-gradient(50% 50% at 80% 30%, rgba(232,169,139,0.35) 0%, transparent 70%), radial-gradient(50% 50% at 15% 50%, rgba(168,158,208,0.30) 0%, transparent 70%)', filter: 'blur(20px)' }} />

        <div>
          <span className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full text-xs text-nova-muted border border-nova-border-soft"
                style={{ background: 'rgba(255,255,255,0.7)', backdropFilter: 'blur(10px)' }}>
            <span className="w-1.5 h-1.5 rounded-full bg-nova-peach" style={{ boxShadow: '0 0 0 4px rgba(232,169,139,0.2)' }} />
            The AI wellness companion for women
          </span>
          <h1 className="mt-6 font-display leading-[1.02] tracking-[-0.025em]">
            Understand your <em className="italic font-light text-nova-purple-dark">body.</em><br/>
            Honor your <em className="italic font-light text-nova-purple-dark">patterns.</em>
          </h1>
          <p className="mt-5 mb-8 text-lg leading-relaxed text-nova-muted max-w-[48ch]">
            A calm companion that helps you notice what your body has been quietly saying — through symptoms, cycles, and patterns. Private by design.
          </p>
          <div className="flex flex-wrap gap-3 items-center">
            <Link href="/onboarding" className="btn-primary px-5 py-3">Get started — free</Link>
          </div>
          <p className="disclaimer mt-7">This is not medical advice — Novana is a wellness journaling tool, not a diagnostic service.</p>
        </div>

        {/* Phone mockups */}
        <div className="hidden md:block relative h-[640px]">
          <div className="absolute left-0 top-5 w-[280px] h-[580px] rounded-[46px] p-2.5 animate-float"
               style={{ background: '#1a1416', boxShadow: '0 30px 80px rgba(74,63,102,0.28), 0 8px 24px rgba(47,42,40,0.10)' }}>
            <div className="w-full h-full rounded-[36px] overflow-hidden relative" style={{ background: '#F7F2ED' }}>
              {/* Notch */}
              <div className="absolute top-3 left-1/2 -translate-x-1/2 w-[100px] h-6 rounded-full z-10" style={{ background: '#1a1416' }} />
              {/* Hero banner */}
              <div style={{ height: 190, background: 'linear-gradient(160deg,rgba(74,63,102,0.72) 0%,rgba(123,111,168,0.38) 60%,transparent 100%), url(/images/sunset-water.jpg) center/cover', paddingTop: 56, paddingLeft: 20, paddingRight: 20, position: 'relative' }}>
                <div style={{ fontFamily: 'Georgia,serif', fontStyle: 'italic', color: '#fff', fontSize: 13, opacity: 0.9, marginBottom: 6 }}>novana</div>
                <div style={{ fontFamily: 'Georgia,serif', color: '#fff', fontSize: 18, fontWeight: 400, lineHeight: 1.15 }}>Good morning, Nova ✦</div>
                <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.7)', marginTop: 4 }}>Follicular · Day 8 of 28</div>
              </div>
              {/* Glance cards */}
              <div style={{ padding: '14px 14px 0' }}>
                <div style={{ background: '#fff', borderRadius: 16, padding: '12px 14px', marginBottom: 10, border: '1px solid #EFE6DF' }}>
                  <div style={{ fontSize: 9, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#6F6A66', marginBottom: 8 }}>Today at a glance</div>
                  {[['Mood','#7B6FA8','75%'],['Energy','#E8A98B','60%'],['Sleep','#8FA7C6','82%'],['Stress','#D28CA7','40%']].map(([l,c,w])=>(
                    <div key={l} style={{ display: 'grid', gridTemplateColumns: '42px 1fr 28px', gap: 6, alignItems: 'center', marginBottom: 6 }}>
                      <span style={{ fontSize: 9, color: '#6F6A66' }}>{l}</span>
                      <div style={{ height: 4, background: '#EFE6DF', borderRadius: 99 }}>
                        <div style={{ height: '100%', width: w, background: c, borderRadius: 99 }} />
                      </div>
                      <span style={{ fontSize: 9, color: c, textAlign: 'right', fontWeight: 600 }}>{parseInt(w)/10}</span>
                    </div>
                  ))}
                </div>
                <div style={{ background: 'linear-gradient(135deg,#2D2538,#4A3F66)', borderRadius: 14, padding: '12px 14px' }}>
                  <div style={{ fontSize: 9, color: 'rgba(255,255,255,0.55)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 6 }}>✦ AI insight</div>
                  <div style={{ fontFamily: 'Georgia,serif', color: '#fff', fontSize: 12, lineHeight: 1.35 }}>Sleep lifts on days you move.</div>
                  <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.6)', marginTop: 4, lineHeight: 1.4 }}>Spotted across 3 cycles.</div>
                </div>
              </div>
            </div>
          </div>
          <div className="absolute right-0 top-[60px] w-[280px] h-[580px] rounded-[46px] p-2.5 animate-float-slow"
               style={{ background: '#1a1416', boxShadow: '0 30px 80px rgba(74,63,102,0.28), 0 8px 24px rgba(47,42,40,0.10)' }}>
            <div className="w-full h-full rounded-[36px] overflow-hidden" style={{ background: '#1a1422' }}>
              {/* Notch */}
              <div className="absolute top-3 left-1/2 -translate-x-1/2 w-[100px] h-6 rounded-full z-10" style={{ background: '#1a1416' }} />
              {/* Today ritual header */}
              <div style={{ height: 160, background: 'linear-gradient(160deg,rgba(20,14,28,0.85) 0%,rgba(74,63,102,0.5) 100%), url(/images/sunset-clouds.jpg) center/cover', paddingTop: 56, paddingLeft: 20, paddingRight: 20 }}>
                <div style={{ fontFamily: 'Georgia,serif', color: '#fff', fontSize: 16, fontWeight: 400 }}>Today&apos;s ritual</div>
                <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.6)', marginTop: 4 }}>Log how you&apos;re arriving</div>
              </div>
              {/* Symptom sliders */}
              <div style={{ padding: '16px 16px 0' }}>
                {[['Mood','#7B6FA8','72%'],['Fatigue','#E8A98B','45%'],['Stress','#D28CA7','38%']].map(([l,c,w])=>(
                  <div key={l} style={{ marginBottom: 14 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                      <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.7)', fontWeight: 500 }}>{l}</span>
                      <span style={{ fontSize: 10, color: c, fontWeight: 600 }}>{parseInt(w)/10}/10</span>
                    </div>
                    <div style={{ height: 4, background: 'rgba(255,255,255,0.1)', borderRadius: 99 }}>
                      <div style={{ height: '100%', width: w, background: c, borderRadius: 99 }} />
                    </div>
                  </div>
                ))}
                <div style={{ marginTop: 18, background: 'linear-gradient(135deg,#7B6FA8,#D28CA7)', borderRadius: 99, padding: '10px 0', textAlign: 'center', fontSize: 11, color: '#fff', fontWeight: 600 }}>
                  Save Today&apos;s Log ♡
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>


      {/* FEATURES */}
      <section className="max-w-[1240px] mx-auto px-6 mt-20" id="features">
        <div className="text-center mb-12">
          <span className="eyebrow block mb-3">What Novana does</span>
          <h2>Quiet tools for noticing yourself.</h2>
          <p className="max-w-[56ch] mx-auto mt-3.5 text-nova-muted">No streaks. No metrics to beat. Just a soft, structured way to learn what your body has been trying to tell you.</p>
        </div>
        <div className="grid md:grid-cols-3 gap-5">
          {[
            { title: 'Daily symptom log', desc: 'Mood, sleep, stress, cramps, energy — slide-rate the day in under 60 seconds. Custom symptoms welcome.' },
            { title: 'AI pattern insights', desc: 'Gentle weekly observations. Where stress and sleep correlate. How mood shifts across cycle phases.' },
            { title: 'Cycle-aware tracking', desc: 'Follicular, ovulatory, luteal, menstrual — see how the same symptom feels different in each phase.' },
            { title: 'Calming journal', desc: 'A no-pressure writing space with mood and emotion tags. AI summarizes your week, not your worth.' },
            { title: 'Private by design', desc: 'End-to-end encryption on health data. You own your entries; export or delete anytime.' },
            { title: 'Soft, never prescriptive', desc: "Novana never diagnoses or recommends treatment. It reflects what you've noticed back to you." },
          ].map((f) => (
            <div key={f.title} className="card-warm border border-nova-border-soft p-7 rounded-3xl hover:-translate-y-0.5 transition-transform duration-200 hover:shadow-nova-sm">
              <div className="w-11 h-11 rounded-[14px] mb-4 flex items-center justify-center"
                   style={{ background: 'linear-gradient(135deg, #F1E0D2, #E8C9D4)', color: '#5A5080' }}>
                <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="9"/>
                  <circle cx="9" cy="9" r="1.5" fill="currentColor" stroke="none"/>
                  <circle cx="15" cy="9" r="1.5" fill="currentColor" stroke="none"/>
                  <path d="M8 14s1.5 2 4 2 4-2 4-2"/>
                </svg>
              </div>
              <h3 className="font-display text-[22px] mb-2">{f.title}</h3>
              <p className="text-nova-muted text-sm leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* SHOWCASE */}
      <section className="max-w-[1240px] mx-auto px-6 mt-20" id="how">
        <div className="relative rounded-[36px] overflow-hidden bg-mountains grain min-h-[460px] grid md:grid-cols-[1.1fr_1fr] items-center p-14 gap-10 text-white">
          <div className="absolute inset-0 pointer-events-none rounded-[36px]"
               style={{ background: 'linear-gradient(135deg, rgba(46,36,64,0.45) 0%, rgba(46,36,64,0.20) 50%, transparent 100%)' }} />
          <div className="relative z-10">
            <span className="chip" style={{ background: 'rgba(255,255,255,0.18)', borderColor: 'rgba(255,255,255,0.3)', color: '#fff' }}>
              <span className="w-1.5 h-1.5 rounded-full bg-white" /> AI Insights
            </span>
            <h2 className="mt-5 mb-4 text-white" style={{ fontSize: 'clamp(28px,3.5vw,44px)' }}>A second pair of eyes — gentle, never alarming.</h2>
            <p className="text-white/85 text-[15px] leading-relaxed">Once you&apos;ve logged for a week, Novana surfaces calm, educational observations: where your sleep and stress travel together, how energy shifts across the month, when your body asks for rest.</p>
            <ul className="mt-5 space-y-2.5 text-sm text-white/90 list-none pl-0">
              <li>· Correlations across mood, sleep, and stress</li>
              <li>· Cycle-phase comparisons, not cycle-phase rules</li>
              <li>· Weekly emotional-pattern summaries</li>
            </ul>
          </div>
          <div className="relative z-10 flex justify-center">
            <div className="glass p-5 max-w-[360px] w-full" style={{ color: '#2F2A28', background: 'rgba(253,250,247,0.88)' }}>
              <div className="flex items-center gap-2 mb-3.5">
                <div className="w-7 h-7 rounded-full bg-[#1a1416] flex items-center justify-center text-white text-xs">✦</div>
                <span className="font-semibold text-sm">Novana AI</span>
                <span className="ml-auto text-[11px] text-nova-muted">Updated 2h ago</span>
              </div>
              <h3 className="font-display text-[22px] mb-2">This week, your body asked for rest.</h3>
              <p className="text-sm leading-relaxed text-nova-muted mb-3.5">Sleep quality dipped on days stress crossed 6/10. Energy lifted on the two evenings you logged exercise.</p>
              <div className="flex gap-1.5 flex-wrap">
                <span className="pill">Sleep ↔ Stress</span>
                <span className="chip peach">Energy</span>
                <span className="chip rose">Cycle day 14</span>
              </div>
              <p className="disclaimer mt-3.5">Educational only — not medical advice.</p>
            </div>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="max-w-[1240px] mx-auto px-6 mt-20" id="how-it-works">
        <div className="text-center mb-12">
          <span className="eyebrow block mb-3">How it works</span>
          <h2>Three small acts of attention.</h2>
        </div>
        <div className="grid md:grid-cols-3 gap-5">
          {[
            { n: '01', t: 'Log how today feels.', d: 'Seven gentle sliders. No streaks. Miss a day and Novana never minds.' },
            { n: '02', t: 'Watch a week unfold.', d: 'Smooth charts. Cycle phases overlaid. Patterns become visible without effort.' },
            { n: '03', t: 'Receive a soft summary.', d: 'Each Sunday, a short observation. Curious, never clinical.' },
          ].map((s) => (
            <div key={s.n} className="card p-8">
              <div className="font-display text-[60px] leading-none mb-4" style={{ color: '#A89ED0' }}>{s.n}</div>
              <h3 className="font-display text-[24px] mb-2">{s.t}</h3>
              <p className="text-nova-muted text-sm leading-relaxed">{s.d}</p>
            </div>
          ))}
        </div>
      </section>


      {/* MANIFESTO */}
      <section className="max-w-[1240px] mx-auto px-6 mt-20" id="manifesto">
        <div className="rounded-[36px] overflow-hidden relative isolate min-h-[400px]">
          <Image src="/images/sunset-water.jpg" alt="" fill className="object-cover" style={{ zIndex: -2 }} />
          <div className="absolute inset-0" style={{ zIndex: -1, background: 'linear-gradient(135deg, rgba(20,14,28,0.78) 0%, rgba(46,36,64,0.55) 50%, rgba(74,63,102,0.3) 100%)' }} />
          <div className="relative z-10 p-10 md:p-20 grid md:grid-cols-2 gap-14 items-start text-white">
            <div className="md:sticky md:top-24">
              <span className="chip mb-4" style={{ background: 'rgba(255,255,255,0.18)', borderColor: 'rgba(255,255,255,0.3)', color: '#fff' }}>
                <span className="w-1.5 h-1.5 rounded-full" style={{ background: '#F4D6BD' }} /> Why Novana exists
              </span>
              <h2 className="mt-0 text-white" style={{ fontSize: 'clamp(34px,4vw,52px)', lineHeight: '1.05', letterSpacing: '-0.025em' }}>
                We built the app we wished <em className="italic" style={{ color: '#F4D6BD' }}>existed</em> when the doctors stopped listening.
              </h2>
            </div>
            <div className="space-y-6" style={{ color: 'rgba(255,255,255,0.88)', fontSize: '15px', lineHeight: '1.75' }}>
              <p className="font-display text-2xl md:text-3xl text-white leading-snug" style={{ fontFamily: 'var(--font-fraunces), Georgia, serif', fontWeight: 400, letterSpacing: '-0.01em' }}>
                I was 14 years old when I got diagnosed with PMOS.
              </p>
              <p>It was one of the most bittersweet moments of my life. On one hand I was relieved, because for years I had been told to ignore my symptoms and wait for my body to regulate on its own — which it never did. But on the other hand, getting diagnosed felt like a burden had been placed on me, making me feel like I&apos;d always have a disadvantage to everyone else.</p>
              <p>Since my diagnosis, I was pressured to start contraceptives. There was no official cure for PMOS, and the only thing that could control my symptoms was birth control. After turning 18 and moving across the country, I started thinking about the future, and started to worry about how I could ever go back to the body I had before contraceptives. One where I was always fatigued, overbleeding, and never felt confident about my body.</p>
              <p>Because of the weight that PMOS had on my life, I spent over two years researching it. Using my background in Computer Engineering, I built an AI model that identifies trends in people&apos;s symptoms and can make an assumption on whether or not they have PMOS. After all of this, I decided to put everything I learned into this app, so that other women can find the direction and guidance that led me astray for years.</p>
              <p>Novana is everything I learned, built into something I wish had existed when I was 14. It&apos;s not a diagnostic tool. It&apos;s not a replacement for your doctor. It&apos;s a place to finally feel like your body makes sense. It&apos;s to see your patterns, track your rhythms, and walk into every appointment with proof that I was never able to give growing up.</p>
              <p>PMOS turned out to be a gift, because it taught me how to care for my body, how to advocate for myself, and how to build something that might help women all over the world find the direction I spent years searching for.</p>
              <p className="pt-2 font-display text-lg" style={{ fontFamily: 'var(--font-fraunces), Georgia, serif', color: '#C4ADE8', fontWeight: 400 }}>
                That&apos;s why Novana exists. ♡
              </p>
              <div className="pt-6 border-t" style={{ borderColor: 'rgba(255,255,255,0.15)', marginTop: '8px' }}>
                <div className="font-medium text-white">— Rupsaa G.</div>
                <div className="text-xs mt-1" style={{ color: 'rgba(255,255,255,0.6)' }}>Founder · diagnosed at 14</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* PRIVACY PROMISE */}
      <section className="max-w-[1240px] mx-auto px-6 mt-14">
        <div className="grid md:grid-cols-3 gap-5">
          {[
            { t: 'End-to-end encrypted', d: "Symptoms, journal, cycle data — all encrypted on your device. Not even Novana can read them." },
            { t: 'Never sold. Never shared.', d: "No advertisers. No data brokers. No law-enforcement back doors. Femtech has a trust problem — we're going a different way." },
            { t: 'Yours to take or leave', d: "Export everything as a single file, anytime. Delete it all in one tap. Your account is yours, full stop." },
          ].map((p) => (
            <div key={p.t} className="card-warm border border-nova-border-soft rounded-3xl p-8">
              <div className="w-11 h-11 rounded-[14px] mb-4 flex items-center justify-center"
                   style={{ background: 'linear-gradient(135deg, #2D2538, #5A4A6E)', color: '#F4D6BD' }}>
                <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                </svg>
              </div>
              <h3 className="font-display text-[22px] mb-2">{p.t}</h3>
              <p className="text-nova-muted text-sm leading-relaxed">{p.d}</p>
            </div>
          ))}
        </div>
      </section>

      {/* PRICING */}
      <section className="max-w-[1240px] mx-auto px-6 mt-20 mb-20" id="pricing">
        <div className="text-center mb-12">
          <span className="eyebrow block mb-3">Pricing</span>
          <h2>Simple, transparent pricing.</h2>
          <p className="max-w-[56ch] mx-auto mt-3.5 text-nova-muted">Most of what makes Novana good costs you nothing. Premium is coming soon — join the waitlist to be first to know when it launches.</p>
        </div>
        <div className="grid md:grid-cols-2 gap-5 max-w-[920px] mx-auto">
          <div className="card-warm border-2 border-nova-border-soft rounded-[36px] p-10">
            <div className="flex items-center justify-between mb-3.5">
              <span className="font-display text-[24px]">Novana</span>
              <span className="text-[11px] tracking-[0.2em] uppercase text-nova-muted font-semibold">Forever free</span>
            </div>
            <div className="font-display text-[60px] leading-none tracking-[-0.03em] mb-3.5">$0
              <span className="text-base font-sans text-nova-muted ml-1.5">/ month</span>
            </div>
            <p className="text-nova-muted text-sm leading-relaxed mb-7">The full daily-life experience. No credit card. No streaks. No nudging you toward an upgrade.</p>
            <ul className="space-y-3 mb-7 text-sm">
              {['Daily symptom & mood log', 'Cycle tracking & phase predictions', 'Journal with mood tagging', '30-day history & weekly insights', '10 Ask Novana chats / month', 'Anonymous Circle community', 'Library (4 articles / month)'].map((item) => (
                <li key={item} className="flex items-start gap-2.5"><span className="text-nova-purple font-bold">✓</span> {item}</li>
              ))}
            </ul>
            <Link href="/onboarding" className="btn-soft w-full justify-center py-3.5">Start free</Link>
          </div>
          <div className="rounded-[36px] p-10 text-white relative overflow-hidden border"
               style={{ background: 'linear-gradient(160deg, #1a1422 0%, #2D2538 60%, #5A4A6E 100%)', borderColor: 'rgba(244,214,189,0.3)' }}>
            <div className="absolute top-[-60px] right-[-60px] w-[220px] h-[220px] rounded-full pointer-events-none"
                 style={{ background: 'radial-gradient(circle, rgba(232,169,139,0.4), transparent 70%)', filter: 'blur(20px)' }} />
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-3.5">
                <span className="font-display text-[24px] text-white">Novana <em className="italic" style={{ color: '#F4D6BD' }}>Bloom</em></span>
                <span className="text-[11px] tracking-[0.2em] uppercase font-semibold px-2.5 py-1 rounded-full"
                      style={{ color: '#F4D6BD', background: 'rgba(244,214,189,0.15)' }}>Premium</span>
              </div>
              <div className="font-display text-[60px] leading-none tracking-[-0.03em] text-white mb-3.5">$8
                <span className="text-base font-sans ml-1.5" style={{ color: 'rgba(255,255,255,0.6)' }}>/ month</span>
              </div>
              <p className="text-sm leading-relaxed mb-7" style={{ color: 'rgba(255,255,255,0.7)' }}>For when you want to go deeper. Especially useful around a diagnosis, fertility planning, or perimenopause.</p>
              <ul className="space-y-3 mb-7 text-sm">
                {['Everything in Free, plus:', 'Unlimited Ask Novana', 'AI Doctor Prep + provider PDF export', 'Monthly auto-reports, mailed to you', 'Wearable integrations (Apple, Oura, Fitbit, Whoop+)', 'Unlimited history + cross-cycle analytics', 'Partner share, expiring private links', 'Full Library & AI-summarized research'].map((item, i) => (
                  <li key={item} className="flex items-start gap-2.5" style={{ color: i === 0 ? 'rgba(255,255,255,0.92)' : 'rgba(255,255,255,0.85)' }}>
                    <span style={{ color: '#F4D6BD' }} className="font-bold">✓</span>
                    {i === 0 ? <b>{item}</b> : item}
                  </li>
                ))}
              </ul>
              <div style={{ borderTop: '1px solid rgba(255,255,255,0.12)', paddingTop: 24, marginTop: 4 }}>
                <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.7)', marginBottom: 14 }}>
                  Join the waitlist to be first to know when Premium launches.
                </p>
                <WaitlistForm feature="Premium" />
              </div>
            </div>
          </div>
        </div>
        <p className="text-center text-nova-muted text-sm mt-7 max-w-[56ch] mx-auto leading-relaxed">
          Free plan never expires. Premium subscribers fund the privacy &amp; engineering work that keeps Novana private by design.
        </p>
      </section>

      {/* CTA BAND */}
      <section className="max-w-[1240px] mx-auto px-6 mb-20">
        <div className="rounded-[36px] overflow-hidden relative text-center py-20 px-14 grain"
             style={{ background: 'radial-gradient(60% 50% at 50% 0%, #FBE2C8 0%, transparent 70%), linear-gradient(160deg, #C9B4D8 0%, #E8A98B 100%)' }}>
          <span className="eyebrow" style={{ color: '#5A5080', letterSpacing: '0.18em' }}>Begin</span>
          <h2 className="mt-2 mb-4">Start noticing yourself.</h2>
          <p className="max-w-[48ch] mx-auto mb-7 text-nova-muted">Two minutes to set up. No card, no email tricks, no streak guilt. Skip days. Come back when you want.</p>
          <div className="flex flex-wrap gap-3 justify-center">
            <Link href="/onboarding" className="btn-primary px-5 py-3">Create your free account</Link>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-nova-border/40">
        <div className="max-w-[1240px] mx-auto px-6 py-16 grid md:grid-cols-4 gap-10">
          <div>
            <Link href="/" className="wordmark" style={{ fontSize: '28px' }}>novana</Link>
            <p className="mt-3.5 text-sm text-nova-muted max-w-[32ch] leading-relaxed">A calm wellness companion for every woman — tracking cycles, symptoms, and emotional rhythms.</p>
            <p className="disclaimer mt-3.5">Novana is not a medical device. This is not medical advice.</p>
            <div style={{ marginTop: 18 }}>
              <p style={{ fontSize: 12, fontWeight: 600, color: 'var(--nova-text)', marginBottom: 4 }}>Early access</p>
              <WaitlistForm feature="General" />
            </div>
          </div>
          <div className="space-y-3">
            <h5 className="font-semibold text-sm">Product</h5>
            {[['How it works', '#how-it-works'], ['Features', '#features'], ['Get started', '/onboarding'], ['Sign in', '/auth/login']].map(([l, h]) => (
              <a key={l} href={h} className="block text-sm text-nova-muted hover:text-nova-text transition-colors">{l}</a>
            ))}
          </div>
          <div className="space-y-3">
            <h5 className="font-semibold text-sm">Company</h5>
            {[['Manifesto', '#manifesto'], ['Library', '/resources'], ['Circle', '/circle'], ['Pricing', '#pricing']].map(([l, h]) => (
              <a key={l} href={h} className="block text-sm text-nova-muted hover:text-nova-text transition-colors">{l}</a>
            ))}
          </div>
          <div className="space-y-3">
            <h5 className="font-semibold text-sm">Privacy &amp; Help</h5>
            {[['Our privacy promise', '/privacy'], ['Account settings', '/settings'], ['Sign in', '/auth/login']].map(([l, h]) => (
              <a key={l} href={h} className="block text-sm text-nova-muted hover:text-nova-text transition-colors">{l}</a>
            ))}
            <a href="mailto:rupsgos@gmail.com" className="block text-sm text-nova-muted hover:text-nova-text transition-colors">Contact us</a>
          </div>
        </div>
        <div className="border-t border-nova-border/30 px-6 py-5 max-w-[1240px] mx-auto flex justify-between text-xs text-nova-muted">
          <span>© 2026 Novana. All rights reserved.</span>
          <span>San Francisco, CA</span>
        </div>
      </footer>
    </div>
  )
}
