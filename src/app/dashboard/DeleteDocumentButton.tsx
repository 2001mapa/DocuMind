'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Trash2, Loader2 } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { toast } from '@/components/ui/toast'

export function DeleteDocumentButton({ id }: { id: string }) {
  const [isDeleting, setIsDeleting] = useState(false)
  const router = useRouter()

  async function handleDelete() {
    if (!confirm('¿Estás seguro de que deseas eliminar este documento para liberar espacio?')) return
    
    setIsDeleting(true)
    try {
      const res = await fetch(`/api/documents/${id}`, { method: 'DELETE' })
      if (!res.ok) throw new Error('Error al eliminar')
      
      toast.success('Documento eliminado. Has liberado un espacio.')
      router.refresh()
    } catch (error) {
      console.error(error)
      toast.error('No se pudo eliminar el documento')
      setIsDeleting(false)
    }
  }

  return (
    <Button 
      variant="destructive" 
      size="sm" 
      className="px-3 rounded-md hover:scale-105 active:scale-95 transition-transform"
      onClick={handleDelete} 
      disabled={isDeleting}
      title="Eliminar documento"
    >
      {isDeleting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
    </Button>
  )
}
