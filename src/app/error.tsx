'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { AlertTriangle } from 'lucide-react'

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  const router = useRouter()
  
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background text-center p-6">
      <div className="space-y-6 max-w-md">
        <div className="flex justify-center">
          <div className="relative flex h-20 w-20 items-center justify-center rounded-2xl bg-destructive/10">
            <AlertTriangle className="h-10 w-10 text-destructive" />
          </div>
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-bold tracking-tight">Algo salió mal</h2>
          <p className="text-muted-foreground text-sm">
            Ocurrió un error inesperado. Puedes intentar de nuevo o volver al inicio.
          </p>
        </div>
        <div className="flex gap-3 justify-center">
          <Button onClick={reset}>Intentar de nuevo</Button>
          <Button variant="outline" onClick={() => router.push('/dashboard')}>
            Ir al Dashboard
          </Button>
        </div>
      </div>
    </div>
  )
}
