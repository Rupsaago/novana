// src/app/layout.tsx
// ─────────────────────────────────────────────────────────────────────────────
// Root layout — wraps every page in the app.
// This is where we load fonts and set global HTML metadata.
// ─────────────────────────────────────────────────────────────────────────────

import type { Metadata } from 'next'
import { DM_Sans, Fraunces } from 'next/font/google'
import './globals.css'

// DM Sans — body text. Warm, rounded, very readable.
const dmSans = DM_Sans({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600'],
  variable: '--font-dm-sans',
  display: 'swap',
})

// Fraunces — display headings. Optical, editorial, distinctive.
const fraunces = Fraunces({
  subsets: ['latin'],
  weight: ['300', '400', '600'],
  variable: '--font-fraunces',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Novana — Know Your Body',
  description:
    'Track PMOS symptoms, discover patterns, and get gentle AI insights. ' +
    'Novana helps you understand your body — not diagnose it.',
  keywords: ['PMOS', 'PCOS', 'symptom tracker', 'hormonal health', 'women health'],
  openGraph: {
    title: 'Novana — Know Your Body',
    description: 'Track PMOS symptoms with AI-powered insights.',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${dmSans.variable} ${fraunces.variable}`}>
      {/*
        bg-nova-bg   → sets the warm parchment background on every page
        font-sans    → applies DM Sans as default body font
        text-nova-text → warm near-black text everywhere
        antialiased  → smoother font rendering
      */}
      <body className="bg-nova-bg font-sans text-nova-text antialiased">
        {children}
      </body>
    </html>
  )
}
