'use client'

import { useState, useEffect, useMemo } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card'
import { Loader2, FileSignature, Download, Sparkles, FileText } from 'lucide-react'
import { toast } from '@/components/ui/toast'

export default function CoverLetterPage() {
  const [documents, setDocuments] = useState<{id: string, title: string}[]>([])
  const [selectedDoc, setSelectedDoc] = useState<string>('')
  const [jobDescription, setJobDescription] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)
  const [coverLetter, setCoverLetter] = useState<string | null>(null)
  
  // Memoize to prevent re-creation on every render (fixes infinite useEffect loop)
  const supabase = useMemo(() => createClient(), [])

  useEffect(() => {
    let mounted = true
    async function fetchDocs() {
      const { data } = await supabase.from('documents').select('id, title').order('created_at', { ascending: false })
      if (mounted && data) setDocuments(data)
    }
    fetchDocs()
    return () => { mounted = false }
  }, [supabase])

  const handleGenerate = async () => {
    if (!selectedDoc || !jobDescription.trim()) return

    setIsGenerating(true)
    setCoverLetter(null)

    try {
      const response = await fetch('/api/cover-letter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ document_id: selectedDoc, jobDescription })
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.error || 'Error al generar la carta.')
      }

      const data = await response.json()
      setCoverLetter(data.coverLetter)
    } catch (error: unknown) {
      console.error(error)
      toast.error((error as Error).message || 'Error desconocido')
    } finally {
      setIsGenerating(false)
    }
  }

  const downloadPDF = async () => {
    if (!coverLetter) return
    const { default: jsPDF } = await import('jspdf')
    const doc = new jsPDF()
    doc.setFont("helvetica", "normal")
    doc.setFontSize(11)
    
    // Divide the text to fit within standard A4 margins
    const splitText = doc.splitTextToSize(coverLetter, 170)
    
    // Add text starting at x=20, y=20
    doc.text(splitText, 20, 20)
    
    doc.save('Carta_de_Presentacion.pdf')
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6 p-4 sm:p-0">
      <div className="flex items-center gap-3">
        <div className="h-10 w-10 bg-primary/10 rounded-lg flex items-center justify-center">
          <FileSignature className="h-6 w-6 text-primary" />
        </div>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Generador de Cartas</h1>
          <p className="text-sm text-muted-foreground">Adapta tu currículum a cualquier oferta al instante</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="flex flex-col">
          <CardHeader>
            <CardTitle className="text-lg">Configuración</CardTitle>
            <CardDescription>Selecciona tu CV y pega los detalles del empleo.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 flex-1">
            <div className="space-y-2">
              <label htmlFor="doc-select" className="text-sm font-medium">Documento CV Base</label>
              <Select value={selectedDoc} onValueChange={(val) => setSelectedDoc(val || '')}>
                <SelectTrigger id="doc-select">
                  <SelectValue placeholder="Elige un currículum..." />
                </SelectTrigger>
                <SelectContent>
                  {documents.map(doc => (
                    <SelectItem key={doc.id} value={doc.id}>{doc.title}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2 flex-1 flex flex-col">
              <label htmlFor="job-desc" className="text-sm font-medium">Descripción de la Oferta (URL o Texto)</label>
              <Textarea 
                id="job-desc"
                placeholder="Pega aquí los requisitos, responsabilidades y detalles clave del puesto..."
                className="flex-1 min-h-[200px] resize-none"
                value={jobDescription}
                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setJobDescription(e.target.value)}
              />
            </div>
          </CardContent>
          <CardFooter>
            <Button 
              className="w-full" 
              onClick={handleGenerate}
              disabled={!selectedDoc || !jobDescription.trim() || isGenerating}
            >
              {isGenerating ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Redactando Carta...
                </>
              ) : (
                <>
                  <Sparkles className="mr-2 h-4 w-4" />
                  Generar Carta Adaptada
                </>
              )}
            </Button>
          </CardFooter>
        </Card>

        <Card className="flex flex-col bg-muted/20">
          <CardHeader>
            <CardTitle className="text-lg">Resultado</CardTitle>
            <CardDescription>Tu carta lista para enviar aparecerá aquí.</CardDescription>
          </CardHeader>
          <CardContent className="flex-1 relative">
            {!coverLetter && !isGenerating && (
              <div className="absolute inset-0 flex flex-col items-center justify-center text-muted-foreground p-8 text-center opacity-50">
                <FileText className="h-12 w-12 mb-4" />
                <p className="text-sm">Completa la configuración y haz clic en generar para ver tu carta adaptada.</p>
              </div>
            )}
            {isGenerating && (
              <div className="absolute inset-0 flex flex-col items-center justify-center text-primary p-8 text-center">
                <Loader2 className="h-8 w-8 animate-spin mb-4" />
                <p className="text-sm font-medium animate-pulse">Analizando CV e identificando coincidencias clave con la oferta...</p>
              </div>
            )}
            {coverLetter && (
              <div className="whitespace-pre-wrap text-sm leading-relaxed p-4 bg-background border rounded-md h-full min-h-[300px] shadow-sm">
                {coverLetter}
              </div>
            )}
          </CardContent>
          {coverLetter && (
            <CardFooter>
              <Button variant="secondary" className="w-full" onClick={downloadPDF}>
                <Download className="mr-2 h-4 w-4" />
                Descargar en PDF
              </Button>
            </CardFooter>
          )}
        </Card>
      </div>
    </div>
  )
}


