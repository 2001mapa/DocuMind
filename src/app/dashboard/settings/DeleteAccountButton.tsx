'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { AlertTriangle } from 'lucide-react'
import { toast } from '@/components/ui/toast'

export function DeleteAccountButton() {
  const [open, setOpen] = useState(false)

  const handleDelete = () => {
    // TODO: Implement delete account API endpoint
    setOpen(false)
    toast.error('Esta funcionalidad estará disponible próximamente.')
  }

  return (
    <>
      <Button variant="destructive" onClick={() => setOpen(true)}>
        Eliminar Cuenta
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <div className="flex items-center gap-3 mb-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-destructive/10">
                <AlertTriangle className="h-5 w-5 text-destructive" />
              </div>
              <DialogTitle>¿Eliminar tu cuenta?</DialogTitle>
            </div>
            <DialogDescription>
              Esta acción es <strong>irreversible</strong>. Se eliminarán permanentemente todos tus documentos,
              embeddings vectoriales, historial de chat y datos de tu cuenta.
            </DialogDescription>
          </DialogHeader>
          <div className="flex gap-3 justify-end mt-4">
            <Button variant="outline" onClick={() => setOpen(false)}>Cancelar</Button>
            <Button variant="destructive" onClick={handleDelete}>Sí, eliminar todo</Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
