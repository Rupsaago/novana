import Link from 'next/link'
import Image from 'next/image'
import WaitlistFooterForm from '@/components/WaitlistFooterForm'

export default function LandingPage() {
  return (
    <div className="min-h-screen">
      {/* NAV */}
      <header className="sticky top-0 z-30 border-b border-nova-border/50"
              style={{ backdropFilter: 'blur(16px)', background: 'rgba(247,242,237,0.7)' }}>
        <div className="max-w-[1240px] mx-auto flex items-center justify-between px-6 py-4">
          <Link href="/" className="wordmark">novana</Link>
          <nav className="hidden md:flex gap-7 text-sm text-nova-muted">
            <a href="#features" className="hover:text-nova-text transition-colors">Features</a>
            <a href="#how" className="hover:text-nova-text transition-colors">How it works</a>
            <a href="#manifesto" className="hover:text-nova-text transition-colors">Manifesto</a>
            <a href="#pricing" className="hover:text-nova-text transition-colors">Pricing</a>
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
          <p className="mt-5 mb-8 text-lg leading-relaxed text-nova-muted max-w-[52ch]">
            A calm, intelligent companion that helps every woman — diagnosed, undiagnosed, or somewhere in between — notice what her body has been quietly saying. PMOS-aware. Cycle-aware. Always gentle.
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
              <div className="absolute top-3 left-1/2 -translate-x-1/2 w-[100px] h-6 rounded-full z-10" style={{ background: '#1a1416' }} />
              <div className="h-[200px] relative overflow-hidden sunset-horizon grain">
                <span className="absolute top-4 left-5 font-display italic text-white text-[18px] z-10">novana</span>
                <h4 className="absolute left-5 bottom-5 text-white font-display text-[22px] font-normal z-10" style={{ margin: 0, textShadow: '0 1px 8px rgba(0,0,0,0.2)' }}>Good morning, Nova</h4>
              </div>
              <div className="p-4">
                <div className="bg-white rounded-[18px] p-3.5 mb-3 border border-nova-border-soft shadow-nova-sm">
                  <div className="flex justify-between items-center text-xs font-semibold mb-2.5">
                    <span>Daily Symptom Log</span><span className="text-nova-muted font-normal">May 25</span>
                  </div>
                  {[{ w: '72%', c: '#7B6FA8' }, { w: '60%', c: '#E8A98B' }, { w: '50%', c: '#D28CA7' }, { w: '40%', c: '#8FA7C6' }].map((s, i) => (
                    <div key={i} className="grid grid-cols-[14px_1fr_30px] gap-2 items-center py-1">
                      <span className="w-3.5 h-3.5 rounded-full bg-nova-card" />
                      <div className="h-1 rounded-full bg-nova-card overflow-hidden">
                        <div className="h-full rounded-full" style={{ width: s.w, background: s.c }} />
                      </div>
                      <span className="text-[9px] text-nova-muted text-right">{parseInt(s.w) / 10}/10</span>
                    </div>
                  ))}
                  <div className="mt-1.5 text-center py-2 rounded-xl text-white text-xs font-medium" style={{ background: '#7B6FA8' }}>
                    Save today&apos;s log
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="absolute right-0 top-[60px] w-[280px] h-[580px] rounded-[46px] p-2.5 animate-float-slow"
               style={{ background: '#1a1416', boxShadow: '0 30px 80px rgba(74,63,102,0.28), 0 8px 24px rgba(47,42,40,0.10)' }}>
            <div className="w-full h-full rounded-[36px] overflow-hidden bg-water relative">
              <div className="absolute top-3 left-1/2 -translate-x-1/2 w-[100px] h-6 rounded-full z-10" style={{ background: '#1a1416' }} />
              <div className="pt-[60px] px-4 pb-4 h-full overflow-hidden">
                <div className="rounded-[18px] p-3.5 mb-3.5" style={{ background: 'rgba(43,35,56,0.78)', backdropFilter: 'blur(14px)', border: '1px solid rgba(255,255,255,0.08)' }}>
                  <span className="inline-flex items-center gap-1.5 rounded-full text-white text-[10px] px-2.5 py-1"
                        style={{ background: 'rgba(255,255,255,0.12)' }}>✦ AI insight</span>
                  <h6 className="font-display text-white text-[16px] font-normal mt-2.5 mb-1">Your patterns this week</h6>
                  <p className="text-[10px] leading-[1.5]" style={{ color: 'rgba(255,255,255,0.7)', margin: 0 }}>
                    Sleep quality tends to <span className="hl-rose">lift on days you exercise</span>. Stress runs <span className="hl-peach">higher mid-cycle</span> — gentle pacing may help.
                  </p>
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
            <div key={f.title} className="card-warm border border-nova-border-soft p-7 rounded-3xl hover:-translate-y-1 transition-transform duration-300 hover:shadow-nova">
              <div className="w-11 h-11 rounded-[14px] mb-4 flex items-center justify-center"
                   style={{ background: 'linear-gradient(135deg, #F1E0D2, #E8C9D4)', color: '#5A5080' }}>
                <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="9"/><path d="M8 14s1.5 2 4 2 4-2 4-2"/>
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
      <section className="max-w-[1240px] mx-auto px-6 mt-20">
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
          <div className="relative z-10 p-16 md:p-20 grid md:grid-cols-2 gap-14 items-center text-white">
            <div>
              <span className="chip mb-4" style={{ background: 'rgba(255,255,255,0.18)', borderColor: 'rgba(255,255,255,0.3)', color: '#fff' }}>
                <span className="w-1.5 h-1.5 rounded-full" style={{ background: '#F4D6BD' }} /> Why Novana exists
              </span>
              <h2 className="mt-0 text-white" style={{ fontSize: 'clamp(34px,4vw,52px)', lineHeight: '1.05', letterSpacing: '-0.025em' }}>
                We built the app we wished <em className="italic" style={{ color: '#F4D6BD' }}>existed</em> when the doctors stopped listening.
              </h2>
            </div>
            <div className="space-y-4 text-base leading-[1.7]" style={{ color: 'rgba(255,255,255,0.85)' }}>
              <p>It took six doctors and seven years before someone said the word <em className="italic" style={{ color: '#F4D6BD' }}>PMOS</em> out loud. By then I&apos;d been told it was stress, anxiety, weight, attitude — anything but a real condition with real research behind it.</p>
              <p>The apps that existed wanted to track me. Predict me. Sell me. None of them just <em className="italic" style={{ color: '#F4D6BD' }}>helped</em> me see what was happening — calmly, privately, in language a person could actually use.</p>
              <p>Novana is the version that finally does.</p>
              <div className="flex items-center gap-3.5 pt-5 border-t" style={{ borderColor: 'rgba(255,255,255,0.12)' }}>
                <div className="w-11 h-11 rounded-full flex-shrink-0" style={{ background: 'linear-gradient(135deg, #E8A98B, #D28CA7)' }} />
                <div>
                  <div className="font-medium text-white">— Asha M.</div>
                  <div className="text-xs" style={{ color: 'rgba(255,255,255,0.6)' }}>Founder · diagnosed at 28</div>
                </div>
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
          <h2>Free, <em className="italic text-nova-purple-dark">forever.</em></h2>
          <p className="max-w-[56ch] mx-auto mt-3.5 text-nova-muted">Most of what makes Novana good costs you nothing. Premium adds the things that take real engineering — auto-reports, advanced AI, wearable history, doctor exports.</p>
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
              <Link href="/onboarding" className="w-full justify-center py-3.5 rounded-full font-semibold text-sm inline-flex items-center"
                    style={{ background: 'linear-gradient(135deg, #F4D6BD, #E8A98B)', color: '#2F2A28' }}>
                Try Bloom — 14 days free
              </Link>
            </div>
          </div>
        </div>
        <p className="text-center text-nova-muted text-sm mt-7 max-w-[56ch] mx-auto leading-relaxed">
          Cancel anytime. Free plan never expires. Premium subscribers fund the privacy &amp; engineering work that makes the free plan possible.
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
              <p style={{ fontSize: 12, color: 'var(--nova-muted)', marginBottom: 0 }}>Be first to know when Novana opens to everyone.</p>
              <WaitlistFooterForm />
            </div>
          </div>
          <div className="space-y-3">
            <h5 className="font-semibold text-sm">Product</h5>
            {[['Dashboard', '/dashboard'], ['Today', '/today'], ['Ask Novana', '/ask'], ['Cycle', '/cycle'], ['Monthly Reports', '/reports'], ['Doctor Prep', '/doctor-prep']].map(([l, h]) => (
              <Link key={l} href={h} className="block text-sm text-nova-muted hover:text-nova-text transition-colors">{l}</Link>
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
            {[['Our privacy promise', '#manifesto'], ['Account settings', '/setttings'], ['Sign in', '/auth/login']].map(([l, h]) => (
              <a key={l} href={h} className="block text-sm text-nova-muted hover:text-nova-text transition-colors">{l}</a>
            ))}
            <a href="mailto:hello@novana.app" className="block text-sm text-nova-muted hover:text-nova-text transition-colors">Contact us</a>
          </div>
        </div>
        <div className="border-t border-nova-border/30 px-6 py-5 max-w-[1240px] mx-auto flex justify-between text-xs text-nova-muted">
          <span>© 2026 Novana, Inc. Made with quiet care.</span>
          <span>San Francisco, CA</span>
        </div>
      </footer>
    </div>
  )
}
