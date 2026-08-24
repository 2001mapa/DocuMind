'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetTrigger, SheetTitle, SheetClose } from '@/components/ui/sheet'
import { FileText, MessageSquare, Briefcase, Activity, Settings, Menu } from 'lucide-react'

export function MobileNav() {
  return (
    <Sheet>
      <SheetTrigger render={
        <Button variant="outline" size="icon" className="sm:hidden shrink-0" />
      }>
        <Menu className="h-5 w-5" />
        <span className="sr-only">Toggle navigation menu</span>
      </SheetTrigger>
      <SheetContent side="left" className="sm:max-w-xs">
        <SheetTitle className="sr-only">Menu de navegación</SheetTitle>
        <nav className="grid gap-6 text-lg font-medium mt-6">
          <SheetClose render={
            <Link
              href="/dashboard"
              className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground"
            />
          }>
            <FileText className="h-5 w-5" />
            Mis Documentos
          </SheetClose>
          <SheetClose render={
            <Link
              href="/dashboard/chat"
              className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground"
            />
          }>
            <MessageSquare className="h-5 w-5" />
            Chat Documental
          </SheetClose>
          <SheetClose render={
            <Link
              href="/dashboard/cover-letter"
              className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground"
            />
          }>
            <Briefcase className="h-5 w-5" />
            Cartas de Presentación
          </SheetClose>
          <SheetClose render={
            <Link
              href="/dashboard/analytics"
              className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground"
            />
          }>
            <Activity className="h-5 w-5" />
            Telemetría y Costos
          </SheetClose>
          <SheetClose render={
            <Link
              href="/dashboard/settings"
              className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground"
            />
          }>
            <Settings className="h-5 w-5" />
            Configuración
          </SheetClose>
        </nav>
      </SheetContent>
    </Sheet>
  )
}
