// src/app/dashboard/layout.tsx
'use client'
import AppShell from '@/components/AppShell'
export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return <AppShell>{children}</AppShell>
}
