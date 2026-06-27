// src/components/AppShell.tsx
'use client'

import AppNav from '@/components/AppNav'

export default function AppShell({ children }: { children: React.ReactNode }) {
  return (
    // Sidebar = #F7F2ED, Dashboard bg = #EFE8E1 (slightly darker/warmer)
    <div className="flex h-screen overflow-hidden" style={{ background: '#EFE8E1' }}>
      <AppNav />
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        <main className="flex-1 overflow-y-auto">
          <div className="max-w-7xl mx-auto px-5 pt-2 md:px-7 md:pt-3
                          pb-28 lg:pb-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}
