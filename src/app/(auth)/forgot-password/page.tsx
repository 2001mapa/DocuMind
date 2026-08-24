'use client'

import { useState } from 'react'
import Link from 'next/link'
import { resetPassword } from '../actions'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { AlertCircle, CheckCircle2 } from 'lucide-react'
import { Alert, AlertDescription } from '@/components/ui/alert'

export default function ForgotPasswordPage() {
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(formData: FormData) {
    setLoading(true)
    setError(null)
    setSuccess(null)
    try {
      const result = await resetPassword(formData)
      if (result?.error) {
        setError(result.error)
      } else if (result?.success) {
        setSuccess(result.success)
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <div className="w-full max-w-[400px] space-y-8">
        <div className="flex flex-col items-center justify-center space-y-3 text-center">
          <div className="relative flex h-12 w-12 items-center justify-center overflow-hidden rounded-xl bg-primary text-primary-foreground shadow-sm mb-2">
            <div className="absolute h-2.5 w-2.5 rounded-full bg-primary-foreground" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight">Recuperar contraseña</h1>
          <p className="text-sm text-muted-foreground">
            Ingresa tu correo para recibir un enlace seguro
          </p>
        </div>

        {error && (
          <Alert variant="destructive" className="border-destructive/20 bg-destructive/10 text-destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        
        {success && (
          <Alert className="border-primary/20 bg-primary/10 text-primary">
            <CheckCircle2 className="h-4 w-4" />
            <AlertDescription>{success}</AlertDescription>
          </Alert>
        )}

        <form action={handleSubmit} className="space-y-5">
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
          <Button type="submit" className="w-full h-10 font-medium" disabled={loading || !!success}>
            {loading ? 'Enviando enlace...' : 'Enviar enlace de recuperación'}
          </Button>
        </form>

        <div className="text-center text-sm text-muted-foreground pt-4">
          <Link href="/login" className="font-semibold text-primary hover:underline">
            Volver a inicio de sesión
          </Link>
        </div>
      </div>
    </div>
  )
}
