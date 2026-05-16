// src/app/journal/layout.tsx  (NEW)
'use client'

import MobileNav from '@/components/MobileNav'

export default function JournalLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex h-screen bg-nova-bg overflow-hidden">
      <MobileNav />
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        <main className="flex-1 overflow-y-auto">
          <div className="max-w-4xl mx-auto px-6 py-8 md:px-10">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}
