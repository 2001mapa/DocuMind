'use client'

import { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { UploadCloud, File, CheckCircle2, AlertCircle } from 'lucide-react'
import { toast } from '@/components/ui/toast'

export function UploadModal({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false)
  const [dragActive, setDragActive] = useState(false)
  const [file, setFile] = useState<File | null>(null)
  
  const [status, setStatus] = useState<'idle' | 'uploading' | 'processing' | 'success' | 'error'>('idle')
  const [progress, setProgress] = useState(0)
  const [message, setMessage] = useState('')
  
  const inputRef = useRef<HTMLInputElement>(null)
  const router = useRouter()

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true)
    } else if (e.type === 'dragleave') {
      setDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const droppedFile = e.dataTransfer.files[0]
      if (droppedFile.type === 'application/pdf') {
        setFile(droppedFile)
      } else {
        setStatus('error')
        setMessage('Solo se permiten archivos PDF.')
      }
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault()
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0])
    }
  }

  const handleUpload = async () => {
    if (!file) return

    setStatus('uploading')
    setProgress(25)
    setMessage('Subiendo archivo...')

    const formData = new FormData()
    formData.append('file', file)

    try {
      setStatus('processing')
      setProgress(50)
      setMessage('Extrayendo texto y generando vectores con Gemini...')

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        let errorMsg = 'Error al procesar el documento.'
        const text = await response.text()
        try {
          const json = JSON.parse(text)
          if (json.error) errorMsg = json.error
        } catch {
          // If it's not JSON, it might be an HTML error page (e.g. 413 Payload Too Large)
          errorMsg = `Error del servidor HTTP ${response.status}: ${response.statusText}`
          if (response.status === 413) errorMsg = 'El archivo es demasiado grande.'
          if (response.status === 429) errorMsg = 'Demasiadas peticiones. Intenta en un minuto.'
        }
        console.error('Detalle del error desde el servidor:', text)
        throw new Error(errorMsg)
      }

      setProgress(100)
      setStatus('success')
      setMessage('¡Documento indexado con éxito!')
      
      setTimeout(() => {
        setOpen(false)
        resetState()
        router.refresh() // Refresca el dashboard
      }, 2000)

    } catch (error: unknown) {
      console.error(error)
      setStatus('error')
      setMessage((error as Error).message || 'Error desconocido.')
      toast.error((error as Error).message || 'Error desconocido.')
    }
  }

  const resetState = () => {
    setFile(null)
    setStatus('idle')
    setProgress(0)
    setMessage('')
  }

  return (
    <Dialog open={open} onOpenChange={(val) => {
      setOpen(val)
      if (!val) resetState()
    }}>
      <DialogTrigger render={children as React.ReactElement} />
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Subir Nuevo Documento</DialogTitle>
          <DialogDescription>
            Sube un PDF para indexarlo en tu biblioteca vectorial.
          </DialogDescription>
        </DialogHeader>

        {status === 'idle' || status === 'error' ? (
          <div className="space-y-4">
            <div
              className={`border-2 border-dashed rounded-lg p-12 text-center transition-colors ${
                dragActive ? 'border-primary bg-primary/5' : 'border-muted-foreground/25'
              } ${file ? 'bg-muted/50 border-solid' : ''}`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              <input
                ref={inputRef}
                type="file"
                accept=".pdf"
                className="hidden"
                onChange={handleChange}
              />
              
              {file ? (
                <div className="flex flex-col items-center gap-2">
                  <File className="h-10 w-10 text-primary" />
                  <p className="font-medium text-sm">{file.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {(file.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                  <Button variant="outline" size="sm" className="mt-2" onClick={() => setFile(null)}>
                    Cambiar archivo
                  </Button>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-2">
                  <UploadCloud className="h-10 w-10 text-muted-foreground" />
                  <p className="text-sm font-medium">Arrastra y suelta tu PDF aquí</p>
                  <p className="text-xs text-muted-foreground mb-4">o haz clic para seleccionar</p>
                  <Button variant="secondary" size="sm" onClick={() => inputRef.current?.click()}>
                    Seleccionar Archivo
                  </Button>
                </div>
              )}
            </div>

            {status === 'error' && (
              <div className="flex items-center gap-2 text-destructive text-sm bg-destructive/10 p-3 rounded-md">
                <AlertCircle className="h-4 w-4" />
                {message}
              </div>
            )}

            <div className="flex justify-end gap-2">
              <Button variant="ghost" onClick={() => setOpen(false)}>Cancelar</Button>
              <Button onClick={handleUpload} disabled={!file}>Subir e Indexar</Button>
            </div>
          </div>
        ) : (
          <div className="py-12 flex flex-col items-center justify-center space-y-6 text-center">
            {status === 'success' ? (
              <CheckCircle2 className="h-16 w-16 text-green-500 animate-in zoom-in" />
            ) : (
              <div className="h-16 w-16 rounded-full border-4 border-primary border-t-transparent animate-spin" />
            )}
            
            <div className="space-y-2 w-full max-w-xs">
              <h3 className="font-medium text-lg">{status === 'success' ? '¡Completado!' : 'Procesando...'}</h3>
              <p className="text-sm text-muted-foreground">{message}</p>
              {status !== 'success' && <Progress value={progress} className="h-2 w-full" />}
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}



