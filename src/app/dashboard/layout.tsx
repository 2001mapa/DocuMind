import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { LogOut } from 'lucide-react'
import { logout } from '@/app/(auth)/actions'
import { MobileNav } from './MobileNav'
import { SidebarNav } from './SidebarNav'

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser()

  if (authError || !user) {
    redirect('/login')
  }

  // Fetch token usage for today (or total depending on DB setup)
  const { data: usage } = await supabase
    .from('user_usage')
    .select('total_tokens')
    .eq('user_id', user.id)
    .single()

  const tokensUsed = usage?.total_tokens || 0

  return (
    <div className="flex min-h-screen w-full flex-col bg-muted/40">
      {/* Top Header */}
      <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-background/80 backdrop-blur-md px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6 py-4">
        <MobileNav />
        
        <div className="flex flex-1 items-center justify-between sm:justify-start gap-4 md:gap-8">
          <Link href="/dashboard" className="flex items-center gap-2.5 tracking-tight group" aria-label="DocuMind AI - Ir al panel principal">
            <div className="relative flex h-8 w-8 items-center justify-center overflow-hidden rounded-lg bg-primary text-primary-foreground shadow-sm group-hover:scale-105 transition-transform">
              <div className="absolute -left-2 -top-2 h-7 w-7 rounded-md border-[3px] border-primary-foreground/30" />
              <div className="absolute -bottom-2 -right-2 h-7 w-7 rounded-md border-[3px] border-primary-foreground/80" />
              <div className="absolute h-2 w-2 rounded-full bg-primary-foreground" />
            </div>
            <div className="flex items-baseline gap-1">
              <span className="font-bold text-lg">DocuMind</span>
              <span className="font-medium text-primary text-sm tracking-widest">AI</span>
            </div>
          </Link>
          <div className="ml-auto flex items-center gap-4">
            <Badge variant="secondary" className="hidden sm:flex font-mono">
              Tokens: {tokensUsed.toLocaleString()}
            </Badge>
            <div className="text-sm font-medium hidden md:block">
              {user.email}
            </div>
            <form action={logout}>
              <Button variant="ghost" size="icon" type="submit" title="Cerrar sesión">
                <LogOut className="h-5 w-5" />
                <span className="sr-only">Cerrar Sesión</span>
              </Button>
            </form>
          </div>
        </div>
      </header>

      <div className="flex flex-1 items-start w-full">
        {/* Sidebar Navigation */}
        <aside className="hidden w-64 flex-col border-r border-border/40 bg-background sm:flex min-h-[calc(100dvh-80px)] p-4">
          <SidebarNav />
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 w-full h-[calc(100dvh-64px)] sm:h-auto overflow-y-auto sm:overflow-visible">
          <div className="mx-auto w-full max-w-6xl p-0 sm:p-6 md:p-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}
