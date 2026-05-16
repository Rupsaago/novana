// src/components/AppShell.tsx
// ═══════════════════════════════════════════════════════════════════════════
// AppShell — wraps page content with AppNav and correct padding.
// Used in every dashboard layout file.
// On mobile adds bottom padding so content doesn't hide behind the tab bar.
// ═══════════════════════════════════════════════════════════════════════════

'use client'

import AppNav from '@/components/AppNav'

export default function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen bg-nova-bg overflow-hidden">
      <AppNav />

      {/* Main scrollable content area */}
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        <main className="flex-1 overflow-y-auto">
          <div className="max-w-4xl mx-auto px-5 py-6 md:px-10 md:py-8
                          pb-28 md:pb-8">
            {/*
              pb-28 on mobile = padding at the bottom so the last card
              doesn't sit right behind the tab bar.
              md:pb-8 = back to normal on desktop.
            */}
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}
