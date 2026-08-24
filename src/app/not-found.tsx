import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { FileQuestion } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background text-center p-6">
      <div className="space-y-6 max-w-md">
        <div className="flex justify-center">
          <div className="relative flex h-20 w-20 items-center justify-center rounded-2xl bg-muted">
            <FileQuestion className="h-10 w-10 text-muted-foreground" />
          </div>
        </div>
        <div className="space-y-2">
          <h1 className="text-4xl font-bold tracking-tight">404</h1>
          <p className="text-xl font-medium text-foreground">Página no encontrada</p>
          <p className="text-muted-foreground text-sm">
            La página que buscas no existe o fue movida a otra ubicación.
          </p>
        </div>
        <div className="flex gap-3 justify-center">
          <Button render={<Link href="/dashboard" />} nativeButton={false}>
            Ir al Dashboard
          </Button>
          <Button variant="outline" render={<Link href="/" />} nativeButton={false}>
            Volver al inicio
          </Button>
        </div>
      </div>
    </div>
  )
}
