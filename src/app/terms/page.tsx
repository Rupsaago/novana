// src/app/terms/page.tsx
import Link from 'next/link'

export default function TermsPage() {
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
            Terms of Service
          </h1>
          <p className="text-nova-muted text-sm">
            Last updated: May 2026
          </p>
        </div>

        {/* Intro */}
        <div className="card mb-6 bg-nova-purple/8 border-nova-purple/20">
          <p className="text-sm text-nova-muted leading-relaxed">
            <span className="font-medium text-nova-text">The short version:</span>{' '}
            Novana is a personal tracking tool, not a medical service. Use it to
            understand your own patterns — not as a substitute for medical care.
            Be respectful, don't misuse the platform, and your data is yours.
          </p>
        </div>

        {/* Sections */}
        <div className="space-y-8 text-nova-muted text-sm leading-relaxed">

          <section>
            <h2 className="font-display text-2xl text-nova-text mb-3">
              1. Acceptance of terms
            </h2>
            <p>
              By creating a Novana account and using the app, you agree to these
              Terms of Service and our{' '}
              <Link href="/privacy" className="text-nova-purple hover:underline">
                Privacy Policy
              </Link>. If you do not agree, please do not use Novana.
            </p>
          </section>

          <section>
            <h2 className="font-display text-2xl text-nova-text mb-3">
              2. What Novana is (and isn't)
            </h2>
            <div className="bg-nova-peach/15 border border-nova-peach/30 rounded-2xl px-5 py-4 mb-4">
              <p className="font-medium text-nova-text mb-2">⚠️ Important — please read this</p>
              <p className="leading-relaxed">
                Novana is a <strong className="text-nova-text">personal symptom tracking tool</strong>.
                It is <strong className="text-nova-text">not</strong> a medical device, clinical
                service, or substitute for professional healthcare. The AI-generated insights
                are observational pattern summaries only — they are not diagnoses, treatment
                recommendations, or medical opinions.
              </p>
            </div>
            <p>
              Always consult a qualified healthcare professional — such as your GP,
              endocrinologist, or gynaecologist — for any medical concerns related
              to PMOS or your health generally. Do not delay seeking medical advice
              because of anything you read in Novana.
            </p>
          </section>

          <section>
            <h2 className="font-display text-2xl text-nova-text mb-3">
              3. Your account
            </h2>
            <ul className="space-y-2 ml-4">
              <li className="flex items-start gap-2">
                <span className="text-nova-purple mt-0.5 shrink-0">✦</span>
                <span>You must be 13 or older to use Novana</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-nova-purple mt-0.5 shrink-0">✦</span>
                <span>You are responsible for keeping your password secure</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-nova-purple mt-0.5 shrink-0">✦</span>
                <span>You may only create one account per person</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-nova-purple mt-0.5 shrink-0">✦</span>
                <span>You must provide accurate information when signing up</span>
              </li>
            </ul>
          </section>

          <section>
            <h2 className="font-display text-2xl text-nova-text mb-3">
              4. Acceptable use
            </h2>
            <p className="mb-3">You agree not to:</p>
            <ul className="space-y-2 ml-4">
              <li className="flex items-start gap-2">
                <span className="text-nova-rose mt-0.5 shrink-0">✕</span>
                <span>Use Novana for any unlawful purpose</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-nova-rose mt-0.5 shrink-0">✕</span>
                <span>Attempt to access another user's data</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-nova-rose mt-0.5 shrink-0">✕</span>
                <span>Reverse-engineer, scrape, or abuse the API</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-nova-rose mt-0.5 shrink-0">✕</span>
                <span>Submit false or misleading information</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-nova-rose mt-0.5 shrink-0">✕</span>
                <span>Use the AI insights feature to generate harmful content</span>
              </li>
            </ul>
          </section>

          <section>
            <h2 className="font-display text-2xl text-nova-text mb-3">
              5. Your data & content
            </h2>
            <p className="mb-3">
              All symptom data, journal entries, and content you create in Novana
              belongs to <strong className="text-nova-text">you</strong>. We do not
              claim ownership over your personal data.
            </p>
            <p>
              By using the AI insights feature, you consent to your symptom data
              being sent to OpenAI's API to generate responses. Please see our{' '}
              <Link href="/privacy" className="text-nova-purple hover:underline">
                Privacy Policy
              </Link>{' '}
              for details on how third-party services handle your data.
            </p>
          </section>

          <section>
            <h2 className="font-display text-2xl text-nova-text mb-3">
              6. Availability & changes
            </h2>
            <p className="mb-3">
              Novana is provided as-is. We do our best to keep it running reliably
              but cannot guarantee 100% uptime. We may update, change, or discontinue
              features at any time.
            </p>
            <p>
              We may update these Terms from time to time. Continued use of Novana
              after changes are posted means you accept the updated Terms.
            </p>
          </section>

          <section>
            <h2 className="font-display text-2xl text-nova-text mb-3">
              7. Limitation of liability
            </h2>
            <p>
              To the maximum extent permitted by law, Novana and its creators are
              not liable for any damages arising from your use of the app, including
              any health decisions made based on app content. Novana is a personal
              tracking tool — all health decisions should be made with a qualified
              medical professional.
            </p>
          </section>

          <section>
            <h2 className="font-display text-2xl text-nova-text mb-3">
              8. Termination
            </h2>
            <p>
              You may delete your account at any time by contacting us. We reserve
              the right to suspend or terminate accounts that violate these Terms.
            </p>
          </section>

          <section>
            <h2 className="font-display text-2xl text-nova-text mb-3">
              9. Contact
            </h2>
            <p>
              Questions about these Terms? Contact us at:{' '}
              <span className="font-medium text-nova-text">
                [contact@novana.app — add your email here]
              </span>
            </p>
          </section>

        </div>

        {/* Footer nav */}
        <div className="mt-12 pt-8 border-t border-nova-border/40 flex flex-col sm:flex-row
                        items-center justify-between gap-4">
          <Link href="/privacy" className="text-sm text-nova-purple hover:underline">
            Read our Privacy Policy →
          </Link>
          <Link href="/" className="btn-primary text-sm px-6 py-2.5">
            Back to Novana
          </Link>
        </div>
      </div>
    </main>
  )
}
