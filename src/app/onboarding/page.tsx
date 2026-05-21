'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'

const SCENES = [
  '/images/sunset-clouds.jpg',
  '/images/desert-dunes.jpg',
  '/images/sunset-mountains.jpg',
  '/images/sunset-water.jpg',
  '/images/sunset-clouds.jpg',
  '/images/desert-dunes.jpg',
  '/images/sunset-mountains.jpg',
]

const PURPOSES = [
  { val: 'cycle',    title: 'Cycle awareness',   desc: 'Understanding my rhythms' },
  { val: 'pcos',     title: 'PMOS support',       desc: 'Diagnosed or suspected' },
  { val: 'mood',     title: 'Mood & mind',        desc: 'Tracking emotional patterns' },
  { val: 'symptoms', title: 'Mystery symptoms',   desc: 'Something feels off' },
  { val: 'fertility',title: 'Fertility awareness',desc: 'Trying or curious' },
  { val: 'general',  title: 'General wellness',   desc: 'Just want to know my body' },
]

const SYMPTOMS = ['Mood', 'Fatigue', 'Sleep quality', 'Stress', 'Cramps', 'Acne / skin', 'Bloating', 'Headaches', 'Appetite', 'Libido', 'Exercise', 'Hair changes', 'Digestion', 'Anxiety', 'Focus']
const DEFAULT_SYMPTOMS = new Set(['Mood', 'Fatigue', 'Sleep quality', 'Stress', 'Cramps'])

const RITUALS = [
  { val: 'morning', title: 'Morning, with coffee',  desc: 'A two-minute check-in to set the tone' },
  { val: 'evening', title: 'Evening, before bed',   desc: 'Reflect on how today actually felt' },
  { val: 'both',    title: 'Both, gently',           desc: 'Morning intention, evening reflection' },
  { val: 'none',    title: 'No reminders, please',  desc: "I'll come when I want to" },
]

export default function OnboardingPage() {
  const router = useRouter()
  const [step, setStep]             = useState(0)
  const [purposes, setPurposes]     = useState<Set<string>>(new Set())
  const [cycleDate, setCycleDate]   = useState('')
  const [cycleLen, setCycleLen]     = useState('28')
  const [symptoms, setSymptoms]     = useState<Set<string>>(new Set(DEFAULT_SYMPTOMS))
  const [ritual, setRitual]         = useState('')
  const TOTAL = 7

  function next() { setStep((s) => Math.min(s + 1, TOTAL - 1)) }
  function back() { setStep((s) => Math.max(s - 1, 0)) }
  function togglePurpose(val: string) {
    setPurposes((prev) => { const n = new Set(prev); n.has(val) ? n.delete(val) : n.add(val); return n })
  }
  function toggleSymptom(val: string) {
    setSymptoms((prev) => { const n = new Set(prev); n.has(val) ? n.delete(val) : n.add(val); return n })
  }

  return (
    <div className="fixed inset-0 overflow-hidden" style={{ background: '#1a1422' }}>
      {/* Scenes */}
      {SCENES.map((src, i) => (
        <div key={i} className="absolute inset-0 transition-opacity duration-[1200ms]"
             style={{ opacity: step === i ? 1 : 0, zIndex: 0 }}>
          <Image src={src} alt="" fill className="object-cover"
                 style={{ filter: step === i ? 'scale(1)' : 'scale(1.05)', transition: 'transform 12s ease' }} />
          <div className="absolute inset-0"
               style={{ background: 'radial-gradient(60% 50% at 50% 100%, rgba(28,22,38,0.55) 0%, transparent 70%), linear-gradient(180deg, rgba(28,22,38,0.15) 0%, transparent 30%)' }} />
        </div>
      ))}

      {/* Orbs */}
      <span className="orb orb-pink animate-orb-drift" style={{ width: 120, height: 120, top: '18%', left: '14%', zIndex: 2 }} />
      <span className="orb orb-peach animate-orb-drift delay-2" style={{ width: 80, height: 80, bottom: '22%', right: '16%', zIndex: 2 }} />
      <span className="orb orb-lilac animate-orb-drift delay-3" style={{ width: 60, height: 60, top: '22%', right: '24%', zIndex: 2 }} />

      {/* Progress */}
      <div className="fixed top-7 left-1/2 -translate-x-1/2 flex gap-2 z-10">
        {Array.from({ length: TOTAL }).map((_, i) => (
          <span key={i} className="h-1 rounded-full transition-all duration-300"
                style={{
                  width: i === step ? 40 : 24,
                  background: i < step ? 'rgba(255,255,255,0.85)' : i === step ? '#fff' : 'rgba(255,255,255,0.25)',
                }} />
        ))}
      </div>

      {/* Panel */}
      <div className="fixed inset-0 flex items-center justify-center z-10 p-5">
        <div className="w-full max-w-[560px] rounded-[32px] p-11 text-white animate-fade-up"
             style={{ background: 'rgba(20,14,28,0.55)', backdropFilter: 'blur(36px) saturate(160%)', border: '1px solid rgba(255,255,255,0.10)', boxShadow: '0 30px 80px rgba(20,14,28,0.45), inset 0 1px 0 rgba(255,255,255,0.08)' }}>

          {/* Step 0: Welcome */}
          {step === 0 && (
            <div className="text-center">
              <div className="font-display italic text-[56px] text-white tracking-tight mb-4" style={{ textShadow: '0 4px 24px rgba(46,36,64,0.4)' }}>novana</div>
              <p className="font-display italic text-lg mb-7" style={{ color: 'rgba(255,255,255,0.7)' }}>Soft tracking for the body you actually live in.</p>
              <h2 className="text-white mb-3.5">Welcome, <em className="italic" style={{ color: '#F4D6BD' }}>love.</em></h2>
              <p className="mb-7">Let's set up a quiet, private space for you in about two minutes. No judgments, no streaks — just a soft place to notice yourself.</p>
              <button onClick={next} className="btn-step">Begin →</button>
            </div>
          )}

          {/* Step 1: Purpose */}
          {step === 1 && (
            <>
              <span className="block text-[11px] tracking-[0.22em] uppercase mb-3.5" style={{ color: 'rgba(255,255,255,0.65)' }}>About you · 1 of 6</span>
              <h2 className="text-white mb-2.5">What brings you to <em className="italic" style={{ color: '#F4D6BD' }}>Novana?</em></h2>
              <p className="mb-6">Choose any that feel true. We&apos;ll personalize what you see — and you can change this whenever.</p>
              <div className="grid grid-cols-2 gap-2.5 mb-7">
                {PURPOSES.map((p) => (
                  <button key={p.val} onClick={() => togglePurpose(p.val)}
                          className="p-3.5 rounded-2xl text-left flex items-center gap-2.5 transition-all duration-200"
                          style={{ background: purposes.has(p.val) ? 'rgba(232,169,139,0.20)' : 'rgba(255,255,255,0.06)', border: `1px solid ${purposes.has(p.val) ? 'rgba(232,169,139,0.6)' : 'rgba(255,255,255,0.10)'}`, boxShadow: purposes.has(p.val) ? '0 0 24px rgba(232,169,139,0.20)' : 'none' }}>
                    <span className="w-4 h-4 rounded-full flex-shrink-0 flex items-center justify-center"
                          style={{ border: `1.5px solid ${purposes.has(p.val) ? '#F4D6BD' : 'rgba(255,255,255,0.35)'}`, background: purposes.has(p.val) ? '#F4D6BD' : 'transparent' }}>
                      {purposes.has(p.val) && <span className="w-1.5 h-1.5 rounded-full bg-[#5A4A6E]" />}
                    </span>
                    <div>
                      <div className="font-semibold text-sm">{p.title}</div>
                      <div className="text-xs mt-0.5" style={{ color: 'rgba(255,255,255,0.6)' }}>{p.desc}</div>
                    </div>
                  </button>
                ))}
              </div>
              <div className="flex items-center justify-between"><button onClick={back} className="btn-back">← Back</button><button onClick={next} className="btn-step">Continue →</button></div>
            </>
          )}

          {/* Step 2: Cycle */}
          {step === 2 && (
            <>
              <span className="block text-[11px] tracking-[0.22em] uppercase mb-3.5" style={{ color: 'rgba(255,255,255,0.65)' }}>Your rhythm · 2 of 6</span>
              <h2 className="text-white mb-2.5">What does your <em className="italic" style={{ color: '#F4D6BD' }}>cycle</em> look like?</h2>
              <p className="mb-6">If you don&apos;t menstruate, are irregular, or aren&apos;t sure — skip this. We&apos;ll learn over time.</p>
              <div className="grid grid-cols-2 gap-3 mb-7">
                <div>
                  <span className="block text-[11px] tracking-[0.08em] uppercase mb-2" style={{ color: 'rgba(255,255,255,0.55)' }}>Last period started</span>
                  <input type="date" value={cycleDate} onChange={(e) => setCycleDate(e.target.value)}
                         className="w-full rounded-[14px] px-4 py-3.5 text-sm text-white focus:outline-none"
                         style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)', colorScheme: 'dark' }} />
                </div>
                <div>
                  <span className="block text-[11px] tracking-[0.08em] uppercase mb-2" style={{ color: 'rgba(255,255,255,0.55)' }}>Average cycle length</span>
                  <input type="number" value={cycleLen} onChange={(e) => setCycleLen(e.target.value)} placeholder="28" min="15" max="60"
                         className="w-full rounded-[14px] px-4 py-3.5 text-sm text-white focus:outline-none"
                         style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)' }} />
                </div>
              </div>
              <div className="flex items-center justify-between">
                <button onClick={back} className="btn-back">← Back</button>
                <div className="flex items-center gap-4">
                  <button onClick={next} className="text-xs underline" style={{ background: 'transparent', border: 'none', color: 'rgba(255,255,255,0.45)', cursor: 'pointer' }}>I&apos;d rather skip</button>
                  <button onClick={next} className="btn-step">Continue →</button>
                </div>
              </div>
            </>
          )}

          {/* Step 3: Symptoms */}
          {step === 3 && (
            <>
              <span className="block text-[11px] tracking-[0.22em] uppercase mb-3.5" style={{ color: 'rgba(255,255,255,0.65)' }}>What you track · 3 of 6</span>
              <h2 className="text-white mb-2.5">What feels worth <em className="italic" style={{ color: '#F4D6BD' }}>noticing?</em></h2>
              <p className="mb-5">Pick what matters to you. We&apos;ll add these to your daily check-in. Add more anytime.</p>
              <div className="flex flex-wrap gap-2 mb-7">
                {SYMPTOMS.map((s) => (
                  <button key={s} onClick={() => toggleSymptom(s)}
                          className="px-4 py-2 rounded-full text-sm transition-all duration-200"
                          style={{ background: symptoms.has(s) ? 'rgba(232,169,139,0.25)' : 'rgba(255,255,255,0.06)', border: `1px solid ${symptoms.has(s) ? 'rgba(232,169,139,0.7)' : 'rgba(255,255,255,0.15)'}`, color: symptoms.has(s) ? '#fff' : 'rgba(255,255,255,0.85)' }}>
                    {s}
                  </button>
                ))}
              </div>
              <div className="flex items-center justify-between"><button onClick={back} className="btn-back">← Back</button><button onClick={next} className="btn-step">Continue →</button></div>
            </>
          )}

          {/* Step 4: Ritual */}
          {step === 4 && (
            <>
              <span className="block text-[11px] tracking-[0.22em] uppercase mb-3.5" style={{ color: 'rgba(255,255,255,0.65)' }}>Your ritual · 4 of 6</span>
              <h2 className="text-white mb-2.5">When would you like to <em className="italic" style={{ color: '#F4D6BD' }}>check in?</em></h2>
              <p className="mb-5">A soft daily ritual makes patterns easier to see. You can miss days without guilt.</p>
              <div className="space-y-2.5 mb-7">
                {RITUALS.map((r) => (
                  <button key={r.val} onClick={() => setRitual(r.val)}
                          className="w-full p-3.5 rounded-2xl text-left flex items-center gap-2.5 transition-all duration-200"
                          style={{ background: ritual === r.val ? 'rgba(232,169,139,0.20)' : 'rgba(255,255,255,0.06)', border: `1px solid ${ritual === r.val ? 'rgba(232,169,139,0.6)' : 'rgba(255,255,255,0.10)'}` }}>
                    <span className="w-4 h-4 rounded-full flex-shrink-0 flex items-center justify-center"
                          style={{ border: `1.5px solid ${ritual === r.val ? '#F4D6BD' : 'rgba(255,255,255,0.35)'}`, background: ritual === r.val ? '#F4D6BD' : 'transparent' }}>
                      {ritual === r.val && <span className="w-1.5 h-1.5 rounded-full bg-[#5A4A6E]" />}
                    </span>
                    <div><div className="font-semibold text-sm">{r.title}</div><div className="text-xs mt-0.5" style={{ color: 'rgba(255,255,255,0.6)' }}>{r.desc}</div></div>
                  </button>
                ))}
              </div>
              <div className="flex items-center justify-between"><button onClick={back} className="btn-back">← Back</button><button onClick={next} className="btn-step">Continue →</button></div>
            </>
          )}

          {/* Step 5: Privacy */}
          {step === 5 && (
            <>
              <span className="block text-[11px] tracking-[0.22em] uppercase mb-3.5" style={{ color: 'rgba(255,255,255,0.65)' }}>Your data, your body · 5 of 6</span>
              <h2 className="text-white mb-2.5">This is <em className="italic" style={{ color: '#F4D6BD' }}>only yours.</em></h2>
              <p className="mb-5">Femtech has a trust problem. Novana is built differently. Here&apos;s how:</p>
              <ul className="space-y-3.5 mb-7">
                {[
                  { title: 'End-to-end encrypted', desc: "Your symptoms, journal, and cycle data are encrypted on your device. We can't read them." },
                  { title: 'Never sold. Never shared.', desc: "No advertisers. No data brokers. No law-enforcement back doors." },
                  { title: 'Yours to take or leave', desc: "Export everything as a single file, anytime. Delete it all in one tap." },
                ].map((item) => (
                  <li key={item.title} className="flex items-start gap-3.5 text-sm" style={{ color: 'rgba(255,255,255,0.8)' }}>
                    <div className="w-8 h-8 rounded-[10px] flex items-center justify-center flex-shrink-0"
                         style={{ background: 'rgba(244,214,189,0.15)', color: '#F4D6BD' }}>
                      <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="4" y="11" width="16" height="10" rx="2"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/>
                      </svg>
                    </div>
                    <div><b className="text-white font-semibold block mb-0.5">{item.title}</b>{item.desc}</div>
                  </li>
                ))}
              </ul>
              <div className="flex items-center justify-between"><button onClick={back} className="btn-back">← Back</button><button onClick={next} className="btn-step">I trust this →</button></div>
            </>
          )}

          {/* Step 6: Done */}
          {step === 6 && (
            <div className="text-center">
              <div className="text-[64px] mb-3.5">✿</div>
              <span className="block text-[11px] tracking-[0.22em] uppercase mb-3.5" style={{ color: 'rgba(255,255,255,0.65)' }}>You&apos;re in · 6 of 6</span>
              <h2 className="text-white mb-3">Your space is <em className="italic" style={{ color: '#F4D6BD' }}>ready.</em></h2>
              <p className="mb-7">Novana will get smarter the more you check in — but you&apos;ll get something gentle on day one.</p>
              <div className="mb-7 rounded-[20px] p-5 text-left"
                   style={{ background: '#15101a', border: '1px solid rgba(255,255,255,0.06)', boxShadow: '0 8px 24px rgba(21,16,26,0.35)' }}>
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-7 h-7 rounded-full flex items-center justify-center"
                       style={{ background: 'linear-gradient(135deg, #E8A98B, #D28CA7)' }}>
                    <span className="text-white text-[11px]">✦</span>
                  </div>
                  <span className="text-white font-medium text-sm">First insight</span>
                  <span className="ml-auto text-[11px] rounded-full px-2.5 py-1" style={{ background: 'rgba(255,255,255,0.10)', color: 'rgba(255,255,255,0.7)' }}>Today</span>
                </div>
                <h5 className="text-white font-display text-lg mb-2">You&apos;re here. That counts.</h5>
                <p className="text-sm leading-relaxed" style={{ color: 'rgba(255,255,255,0.7)' }}>Most patterns become visible after about a week of soft tracking. We&apos;ll meet you here — no streaks, no pressure. Just curiosity.</p>
              </div>
              <button onClick={() => router.push('/dashboard')} className="btn-step">Open Novana →</button>
            </div>
          )}
        </div>
      </div>

      <style>{`
        .btn-step {
          background: linear-gradient(135deg, #F4D6BD 0%, #E8A98B 100%);
          color: #2F2A28;
          border: none;
          padding: 14px 30px;
          border-radius: 999px;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          transition: all .2s ease;
          box-shadow: 0 8px 24px rgba(232,169,139,0.35);
        }
        .btn-step:hover { transform: translateY(-1px); box-shadow: 0 10px 30px rgba(232,169,139,0.45); }
        .btn-back {
          background: transparent;
          color: rgba(255,255,255,0.6);
          border: none;
          font-size: 13px;
          cursor: pointer;
          padding: 8px 12px;
          font-family: inherit;
        }
        .btn-back:hover { color: #fff; }
      `}</style>
    </div>
  )
}
