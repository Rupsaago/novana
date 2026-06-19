// src/app/privacy/page.tsx
import Link from 'next/link'

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-nova-bg">

      {/* Top nav */}
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
        <Link href="/" className="text-sm text-nova-muted hover:text-nova-text
                                  transition-colors">
          ← Back to home
        </Link>
      </nav>

      {/* Content */}
      <div className="max-w-2xl mx-auto px-6 py-12 md:py-16">

        {/* Header */}
        <div className="mb-10">
          <span className="pill mb-4 inline-flex">Legal</span>
          <h1 className="font-display text-4xl md:text-5xl text-nova-text mt-3 mb-4">
            Privacy Policy
          </h1>
          <p className="text-nova-muted text-sm">
            Last updated: June 2026
          </p>
        </div>

        {/* Intro */}
        <div className="card mb-6 bg-nova-purple/8 border-nova-purple/20">
          <p className="text-sm text-nova-muted leading-relaxed">
            <span className="font-medium text-nova-text">The short version:</span>{' '}
            Novana is a personal symptom tracking tool. Your health data belongs to you.
            We don't sell it, share it with advertisers, or use it for anything other
            than running the app for you. This page explains exactly how we handle your data.
          </p>
        </div>

        {/* Sections */}
        <div className="space-y-8 text-nova-muted text-sm leading-relaxed">

          <section>
            <h2 className="font-display text-2xl text-nova-text mb-3">
              1. What data we collect
            </h2>
            <p className="mb-3">When you use Novana, we collect:</p>
            <ul className="space-y-2 ml-4">
              <li className="flex items-start gap-2">
                <span className="text-nova-purple mt-0.5 shrink-0">✦</span>
                <span><strong className="text-nova-text">Account info</strong> — your name and email address when you sign up.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-nova-purple mt-0.5 shrink-0">✦</span>
                <span><strong className="text-nova-text">Symptom data</strong> — the scores you log daily (mood, fatigue, sleep, stress, acne, cramps, exercise, cycle status) and any optional notes.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-nova-purple mt-0.5 shrink-0">✦</span>
                <span><strong className="text-nova-text">Journal entries</strong> — any free-text entries you write in the journal section.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-nova-purple mt-0.5 shrink-0">✦</span>
                <span><strong className="text-nova-text">Usage data</strong> — basic technical logs (e.g. error logs) needed to keep the app running. We do not use analytics trackers or advertising pixels.</span>
              </li>
            </ul>
          </section>

          <section>
            <h2 className="font-display text-2xl text-nova-text mb-3">
              2. How we use your data
            </h2>
            <p className="mb-3">Your data is used only to:</p>
            <ul className="space-y-2 ml-4">
              <li className="flex items-start gap-2">
                <span className="text-nova-purple mt-0.5 shrink-0">✦</span>
                <span>Display your symptom history, charts, and trends back to you</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-nova-purple mt-0.5 shrink-0">✦</span>
                <span>Generate AI-powered pattern insights using OpenAI's API (your data is sent to OpenAI's servers to produce insights — see Section 4)</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-nova-purple mt-0.5 shrink-0">✦</span>
                <span>Maintain your account and authenticate you securely</span>
              </li>
            </ul>
            <p className="mt-3">
              We do <strong className="text-nova-text">not</strong> use your data for advertising,
              sell it to third parties, or share it with anyone except as described in Section 4.
            </p>
          </section>

          <section>
            <h2 className="font-display text-2xl text-nova-text mb-3">
              3. Data storage & security
            </h2>
            <p className="mb-3">
              Your data is stored securely using{' '}
              <strong className="text-nova-text">Supabase</strong>, a hosted database
              platform with row-level security — meaning your data is isolated from
              other users at the database level. Connections are encrypted via HTTPS/TLS.
            </p>
            <p>
              While we take reasonable steps to protect your data, no system is
              completely secure. We recommend using a strong, unique password for
              your Novana account.
            </p>
          </section>

          <section>
            <h2 className="font-display text-2xl text-nova-text mb-3">
              4. Third-party services
            </h2>
            <p className="mb-3">Novana uses the following third-party services:</p>
            <ul className="space-y-3 ml-4">
              <li className="flex items-start gap-2">
                <span className="text-nova-purple mt-0.5 shrink-0">✦</span>
                <div>
                  <strong className="text-nova-text">Supabase</strong> — database and authentication.
                  Your account and symptom data is stored on Supabase servers.
                  See <a href="https://supabase.com/privacy" target="_blank" rel="noopener noreferrer"
                         className="text-nova-purple underline">Supabase's privacy policy</a>.
                </div>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-nova-purple mt-0.5 shrink-0">✦</span>
                <div>
                  <strong className="text-nova-text">OpenAI</strong> — when you request AI insights
                  or journal summaries, your symptom data and journal text is sent to OpenAI's API
                  to generate a response. OpenAI may retain this data per their own data policies.
                  See <a href="https://openai.com/privacy" target="_blank" rel="noopener noreferrer"
                         className="text-nova-purple underline">OpenAI's privacy policy</a>.
                </div>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-nova-purple mt-0.5 shrink-0">✦</span>
                <div>
                  <strong className="text-nova-text">Vercel</strong> — hosting and deployment.
                  See <a href="https://vercel.com/legal/privacy-policy" target="_blank"
                         rel="noopener noreferrer" className="text-nova-purple underline">
                    Vercel's privacy policy
                  </a>.
                </div>
              </li>
            </ul>
          </section>

          <section>
            <h2 className="font-display text-2xl text-nova-text mb-3">
              5. Your rights
            </h2>
            <p className="mb-3">You have the right to:</p>
            <ul className="space-y-2 ml-4">
              <li className="flex items-start gap-2">
                <span className="text-nova-purple mt-0.5 shrink-0">✦</span>
                <span><strong className="text-nova-text">Access</strong> your data at any time through the app</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-nova-purple mt-0.5 shrink-0">✦</span>
                <span><strong className="text-nova-text">Delete</strong> your account and all associated data by contacting us</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-nova-purple mt-0.5 shrink-0">✦</span>
                <span><strong className="text-nova-text">Export</strong> your data — contact us and we will provide it in a readable format</span>
              </li>
            </ul>
          </section>

          <section>
            <h2 className="font-display text-2xl text-nova-text mb-3">
              6. Medical disclaimer
            </h2>
            <div className="bg-nova-peach/15 border border-nova-peach/30 rounded-2xl px-5 py-4">
              <p className="leading-relaxed">
                <strong className="text-nova-text">Novana is not a medical device or service.</strong>{' '}
                The app provides personal pattern tracking and AI-generated observations only.
                Nothing in Novana constitutes medical advice, diagnosis, or treatment.
                Always consult a qualified healthcare professional regarding any health concerns,
                especially those related to PMOS or hormonal health.
              </p>
            </div>
          </section>

          <section>
            <h2 className="font-display text-2xl text-nova-text mb-3">
              7. Contact
            </h2>
            <p>
              If you have any questions about this privacy policy or your data,
              please contact us at:{' '}
              <a href="mailto:rupsgos@gmail.com" className="font-medium text-nova-purple hover:underline">
                rupsgos@gmail.com
              </a>
            </p>
          </section>

        </div>

        {/* Footer nav */}
        <div className="mt-12 pt-8 border-t border-nova-border/40 flex flex-col sm:flex-row
                        items-center justify-between gap-4">
          <Link href="/terms" className="text-sm text-nova-purple hover:underline">
            Read our Terms of Service →
          </Link>
          <Link href="/" className="btn-primary text-sm px-6 py-2.5">
            Back to Novana
          </Link>
        </div>
      </div>
    </main>
  )
}
