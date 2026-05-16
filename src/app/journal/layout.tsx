// src/app/journal/layout.tsx
'use client'
import AppShell from '@/components/AppShell'
export default function JournalLayout({ children }: { children: React.ReactNode }) {
  return <AppShell>{children}</AppShell>
}
