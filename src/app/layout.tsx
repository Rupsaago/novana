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
  metadataBase: new URL('https://novana.app'),
  title: 'Novana — Understand Your Body',
  description:
    'Track PMOS symptoms, discover patterns, and get gentle AI insights. ' +
    'Private by design.',
  keywords: ['PMOS', 'PCOS', 'symptom tracker', 'hormonal health', 'women health'],
  openGraph: {
    title: 'Novana — Understand Your Body',
    description: 'Track PMOS symptoms, discover patterns, and get gentle AI insights. Private by design.',
    type: 'website',
    images: [{ url: '/images/og-image.png', width: 1200, height: 630, alt: 'Novana' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Novana — Understand Your Body',
    description: 'Track PMOS symptoms, discover patterns, and get gentle AI insights. Private by design.',
    images: ['/images/og-image.png'],
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
