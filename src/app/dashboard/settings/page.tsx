import { createClient } from '@/lib/supabase/server'
import { DeleteAccountButton } from './DeleteAccountButton'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

export default async function SettingsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  return (
    <div className="space-y-8 p-4 sm:p-0">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Configuración</h1>
        <p className="text-muted-foreground mt-2">Administra tu perfil, preferencias de cuenta y suscripción.</p>
      </div>

      <div className="grid gap-8 max-w-4xl">
        {/* Profile Settings */}
        <Card className="border-border/40 shadow-sm">
          <CardHeader>
            <CardTitle>Perfil de Usuario</CardTitle>
            <CardDescription>Información básica de tu cuenta.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium leading-none">Correo Electrónico</label>
              <Input id="email" value={user?.email || ''} disabled className="bg-muted/50 max-w-md" />
            </div>
            <div className="space-y-2">
              <label htmlFor="name" className="text-sm font-medium leading-none">Nombre Completo</label>
              <Input id="name" placeholder="Tu nombre" className="max-w-md bg-background" />
            </div>
            <Button className="mt-2 font-medium">Guardar Cambios</Button>
          </CardContent>
        </Card>

        {/* Danger Zone */}
        <div className="mt-4">
          <h2 className="text-xl font-bold tracking-tight mb-4 text-destructive">Zona de Peligro</h2>
          <div className="p-6 rounded-xl border border-destructive/20 bg-destructive/5 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h3 className="font-semibold text-foreground">Eliminar mi cuenta y datos</h3>
              <p className="text-sm text-muted-foreground mt-1">
                Esta acción es irreversible. Se eliminarán permanentemente tus vectores, PDFs subidos, historial de chat y tu suscripción activa.
              </p>
            </div>
            <DeleteAccountButton />
          </div>
        </div>
      </div>
    </div>
  )
}
