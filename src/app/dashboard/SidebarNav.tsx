'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { FileText, MessageSquare, Briefcase, Activity, Settings } from 'lucide-react'
import { cn } from '@/lib/utils'

const navItems = [
  { href: '/dashboard', label: 'Mis Documentos', icon: FileText, exact: true },
  { href: '/dashboard/chat', label: 'Chat Documental', icon: MessageSquare },
  { href: '/dashboard/cover-letter', label: 'Cartas de Presentación', icon: Briefcase },
  { href: '/dashboard/analytics', label: 'Telemetría y Costos', icon: Activity },
  { href: '/dashboard/settings', label: 'Configuración', icon: Settings },
]

export function SidebarNav() {
  const pathname = usePathname()

  return (
    <nav className="grid gap-2 text-sm font-medium">
      {navItems.map(({ href, label, icon: Icon, exact }) => {
        const isActive = exact ? pathname === href : pathname.startsWith(href)
        return (
          <Link
            key={href}
            href={href}
            aria-current={isActive ? 'page' : undefined}
            className={cn(
              'flex items-center gap-3 rounded-lg px-3 py-2 transition-all',
              isActive
                ? 'bg-primary/10 text-primary font-semibold'
                : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
            )}
          >
            <Icon className="h-4 w-4 shrink-0" aria-hidden="true" />
            {label}
          </Link>
        )
      })}
    </nav>
  )
}
