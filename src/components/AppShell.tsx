// src/components/AppShell.tsx  (DESKTOP REDESIGN)
'use client'

import AppNav from '@/components/AppNav'

export default function AppShell({ children }: { children: React.ReactNode }) {
  return (
    // flex-row so sidebar sits LEFT of content on desktop
    <div className="flex h-screen bg-nova-bg overflow-hidden">
      <AppNav />

      {/* Main scrollable content */}
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        <main className="flex-1 overflow-y-auto">
          <div className="max-w-7xl mx-auto px-5 py-6 md:px-8 md:py-7
                          pb-28 lg:pb-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}
