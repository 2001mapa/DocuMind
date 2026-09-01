'use client'

import { useState } from 'react'
import Link from 'next/link'
import { login } from '../actions'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { AlertCircle, ChevronLeft } from 'lucide-react'
import { Alert, AlertDescription } from '@/components/ui/alert'

export default function LoginPage() {
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function handleLogin(formData: FormData) {
    setLoading(true)
    setError(null)
    try {
      const result = await login(formData)
      if (result?.error) {
        setError(result.error)
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4 relative">
      <Link 
        href="/" 
        className="absolute left-4 top-4 md:left-8 md:top-8 flex items-center text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
      >
        <ChevronLeft className="mr-2 h-4 w-4" />
        Volver al inicio
      </Link>
      <div className="w-full max-w-[400px] space-y-8">
        <div className="flex flex-col items-center justify-center space-y-3 text-center">
          <div className="relative flex h-12 w-12 items-center justify-center overflow-hidden rounded-xl bg-primary text-primary-foreground shadow-sm mb-2">
            <div className="absolute -left-3 -top-3 h-10 w-10 rounded-md border-[3px] border-primary-foreground/30" />
            <div className="absolute -bottom-3 -right-3 h-10 w-10 rounded-md border-[3px] border-primary-foreground/80" />
            <div className="absolute h-2.5 w-2.5 rounded-full bg-primary-foreground" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight">Bienvenido de nuevo</h1>
          <p className="text-sm text-muted-foreground">
            Ingresa tu correo y contraseña para acceder a DocuMind AI
          </p>
        </div>

        {error && (
          <Alert variant="destructive" className="border-destructive/20 bg-destructive/10 text-destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        
        <form action={handleLogin} className="space-y-5">
          <div className="space-y-2">
            <label htmlFor="email" className="text-sm font-medium leading-none text-foreground">
              Correo Electrónico
            </label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="nombre@empresa.com"
              required
              className="bg-background"
            />
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label htmlFor="password" className="text-sm font-medium leading-none text-foreground">
                Contraseña
              </label>
              <Link href="/forgot-password" className="text-xs font-medium text-primary hover:underline">
                ¿Olvidaste tu clave?
              </Link>
            </div>
            <Input id="password" name="password" type="password" required className="bg-background" />
          </div>
          <Button type="submit" className="w-full h-10 font-medium" disabled={loading}>
            {loading ? 'Iniciando sesión...' : 'Continuar con Email'}
          </Button>
        </form>

        <div className="text-center text-sm text-muted-foreground pt-4">
          ¿No tienes una cuenta?{' '}
          <Link href="/register" className="font-semibold text-primary hover:underline">
            Regístrate aquí
          </Link>
        </div>
      </div>
    </div>
  )
}
