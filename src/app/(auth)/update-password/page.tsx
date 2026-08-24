'use client'

import { useState } from 'react'
import { updatePassword } from '../actions'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { AlertCircle } from 'lucide-react'
import { Alert, AlertDescription } from '@/components/ui/alert'

export default function UpdatePasswordPage() {
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(formData: FormData) {
    const password = formData.get('password') as string
    const confirm = formData.get('confirm') as string

    if (password !== confirm) {
      setError('Las contraseñas no coinciden')
      return
    }

    setLoading(true)
    setError(null)
    try {
      const result = await updatePassword(formData)
      if (result?.error) {
        setError(result.error)
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <div className="w-full max-w-[400px] space-y-8">
        <div className="flex flex-col items-center justify-center space-y-3 text-center">
          <h1 className="text-2xl font-bold tracking-tight">Nueva contraseña</h1>
          <p className="text-sm text-muted-foreground">
            Ingresa tu nueva contraseña para actualizar tu cuenta
          </p>
        </div>

        {error && (
          <Alert variant="destructive" className="border-destructive/20 bg-destructive/10 text-destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <form action={handleSubmit} className="space-y-5">
          <div className="space-y-2">
            <label htmlFor="password" className="text-sm font-medium leading-none text-foreground">
              Nueva Contraseña
            </label>
            <Input id="password" name="password" type="password" required minLength={6} className="bg-background" />
          </div>
          <div className="space-y-2">
            <label htmlFor="confirm" className="text-sm font-medium leading-none text-foreground">
              Confirmar Nueva Contraseña
            </label>
            <Input id="confirm" name="confirm" type="password" required minLength={6} className="bg-background" />
          </div>
          <Button type="submit" className="w-full h-10 font-medium" disabled={loading}>
            {loading ? 'Actualizando...' : 'Actualizar contraseña'}
          </Button>
        </form>
      </div>
    </div>
  )
}
