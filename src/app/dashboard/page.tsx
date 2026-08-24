import { createClient } from '@/lib/supabase/server'
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card'
import { UploadCloud, FileText, ShieldCheck } from 'lucide-react'
import { UploadModal } from '@/components/upload/UploadModal'
import Link from 'next/link'
import { DeleteDocumentButton } from './DeleteDocumentButton'

export default async function DashboardPage() {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    return <div>No autorizado</div>
  }

  // Obtener documentos del usuario
  const { data: documents } = await supabase
    .from('documents')
    .select('id, title, page_count, file_size, created_at')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  const hasDocuments = documents && documents.length > 0

  return (
    <div className="space-y-8 p-4 sm:p-0">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h1 className="text-3xl font-bold tracking-tight">Mis Documentos</h1>
        <UploadModal>
          <Button className="hover:scale-105 active:scale-95 transition-transform shadow-sm">
            <UploadCloud className="mr-2 h-4 w-4" />
            Subir PDF
          </Button>
        </UploadModal>
      </div>

      {/* Documents List / Empty State */}
      <section>
        
        {hasDocuments ? (
          <>
            <h2 className="text-lg font-medium mb-4 tracking-tight">Tus Archivos</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {documents.map((doc) => (
                <Card key={doc.id} className="flex flex-col">
                  <CardHeader>
                    <CardTitle className="text-base truncate font-medium" title={doc.title}>
                      {doc.title}
                    </CardTitle>
                    <CardDescription className="font-mono text-xs mt-1">
                      {doc.page_count} páginas • {(doc.file_size / 1024 / 1024).toFixed(2)} MB
                    </CardDescription>
                  </CardHeader>
                  <CardFooter className="mt-auto pt-4 flex gap-2">
                    <Link href="/dashboard/chat" className="flex-1">
                      <Button variant="outline" size="sm" className="w-full rounded-md hover:scale-105 active:scale-95 transition-transform">
                        Analizar en Chat
                      </Button>
                    </Link>
                    <DeleteDocumentButton id={doc.id} />
                  </CardFooter>
                </Card>
              ))}
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border/60 bg-muted/20 p-8 sm:p-12 text-center animate-in fade-in-50">
            <div className="mx-auto flex max-w-lg flex-col items-center justify-center text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 mb-6">
                <FileText className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-bold tracking-tight">Bienvenido a DocuMind AI</h3>
              <p className="mb-8 mt-2 text-muted-foreground">
                Tu plataforma segura de RAG Corporativo. Sigue estos 3 simples pasos para comenzar a extraer valor de tus documentos con Inteligencia Artificial.
              </p>
              
              <div className="grid grid-cols-1 gap-4 w-full text-left mb-8">
                <div className="flex items-start gap-3 p-4 rounded-lg bg-background border border-border/40 shadow-sm">
                  <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center text-primary text-xs font-bold shrink-0 mt-0.5">1</div>
                  <div>
                    <h4 className="font-medium">Sube tus PDFs</h4>
                    <p className="text-sm text-muted-foreground mt-1">Haz clic en el botón superior derecho para procesar y vectorizar tus archivos de forma segura.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-4 rounded-lg bg-background border border-border/40 shadow-sm">
                  <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center text-primary text-xs font-bold shrink-0 mt-0.5">2</div>
                  <div>
                    <h4 className="font-medium">Ve al Chat Documental</h4>
                    <p className="text-sm text-muted-foreground mt-1">Nuestra IA Gemini analizará tus vectores y responderá citando la fuente exacta.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-4 rounded-lg bg-background border border-border/40 shadow-sm">
                  <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center text-primary text-xs font-bold shrink-0 mt-0.5">3</div>
                  <div>
                    <h4 className="font-medium">Monitorea tus recursos</h4>
                    <p className="text-sm text-muted-foreground mt-1">Revisa la pestaña de Telemetría para controlar tu consumo de tokens y costos.</p>
                  </div>
                </div>
              </div>

              <UploadModal>
                <Button className="hover:scale-105 active:scale-95 transition-transform shadow-sm px-8">
                  <UploadCloud className="mr-2 h-4 w-4" />
                  Subir mi primer PDF
                </Button>
              </UploadModal>
            </div>
          </div>
        )}
      </section>
    </div>
  )
}

