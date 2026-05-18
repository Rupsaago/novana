// src/components/AppShell.tsx  (FINAL)
'use client'

import AppNav from '@/components/AppNav'

export default function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen overflow-hidden" style={{ background: '#F7F2ED' }}>
      <AppNav />
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        <main className="flex-1 overflow-y-auto">
          <div className="max-w-7xl mx-auto px-5 py-6 md:px-7 md:py-7 pb-28 lg:pb-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}
