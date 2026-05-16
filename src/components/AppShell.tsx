// src/components/AppShell.tsx
'use client'

import AppNav from '@/components/AppNav'

export default function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col min-h-screen bg-nova-bg">
      <AppNav />
      <main className="flex-1 overflow-y-auto">
        <div className="max-w-4xl mx-auto px-5 py-6 md:px-10 md:py-8 pb-28">
          {children}
        </div>
      </main>
    </div>
  )
}