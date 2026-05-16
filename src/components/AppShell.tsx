// src/components/AppShell.tsx
'use client'

import AppNav from '@/components/AppNav'

export default function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-nova-bg">
      {/* Sidebar slots in here on desktop, invisible on mobile */}
      <AppNav />

      {/* Main content — full width on mobile, fills remaining space on desktop */}
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        <main className="flex-1 overflow-y-auto min-h-screen">
          <div className="max-w-4xl mx-auto px-5 py-6 md:px-10 md:py-8 pb-28 lg:pb-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}