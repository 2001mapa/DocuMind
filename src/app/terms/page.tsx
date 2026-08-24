import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ArrowLeft, ShieldCheck } from 'lucide-react'

export const metadata = {
  title: 'Términos y Condiciones | DocuMind AI'
}

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-md">
        <div className="container mx-auto flex h-16 items-center px-4 sm:px-6">
          <Button variant="ghost" size="sm" render={<Link href="/" />} nativeButton={false} className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            Volver al inicio
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-4 sm:px-6 py-12 md:py-20 max-w-4xl">
        <div className="inline-flex items-center rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-sm font-medium text-primary mb-6">
          <ShieldCheck className="mr-2 h-4 w-4" /> Legal
        </div>
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-8">Términos y Condiciones</h1>
        <p className="text-muted-foreground mb-12">Última actualización: "24 de agosto de 2026"</p>

        <div className="prose prose-zinc dark:prose-invert max-w-none text-muted-foreground">
          <h2 className="text-foreground">1. Introducción</h2>
          <p>
            Bienvenido a DocuMind AI. Al acceder o utilizar nuestra plataforma de análisis de documentos
            mediante Inteligencia Artificial, usted acepta estar vinculado por estos Términos y Condiciones.
            Si no está de acuerdo con alguna parte de los términos, no podrá utilizar nuestros servicios.
          </p>

          <h2 className="text-foreground">2. Uso de la Inteligencia Artificial y Limitaciones</h2>
          <p>
            DocuMind AI emplea modelos avanzados de procesamiento de lenguaje natural (LLM) provistos por terceros
            (por ejemplo, Google Gemini) y tecnología RAG (Retrieval-Augmented Generation). Al utilizar nuestros servicios,
            usted reconoce que:
          </p>
          <ul>
            <li>La Inteligencia Artificial puede generar respuestas imprecisas o incompletas.</li>
            <li>Es su responsabilidad revisar y verificar la precisión de cualquier información generada, especialmente en escenarios legales, médicos o financieros críticos.</li>
            <li>No nos hacemos responsables por decisiones tomadas basándose en el output de nuestra plataforma.</li>
          </ul>

          <h2 className="text-foreground">3. Procesamiento de Datos y Propiedad Intelectual</h2>
          <p>
            Al cargar documentos (PDFs, textos, u otros formatos) a DocuMind AI, usted garantiza que tiene el derecho
            y la autorización legal para hacerlo. Usted mantiene todos los derechos de propiedad intelectual sobre sus documentos.
          </p>
          <p>
            Nos otorga una licencia limitada para almacenar, procesar, generar <em>embeddings vectoriales</em> y analizar sus datos
            exclusivamente para brindarle el servicio. En ningún caso utilizamos sus documentos privados para entrenar modelos base fundacionales (LLMs).
          </p>

          <h2 className="text-foreground">4. Telemetría y Límites de Consumo (Rate Limiting)</h2>
          <p>
            El servicio está sujeto a límites de uso para prevenir abusos. Monitoreamos activamente el volumen de peticiones y el 
            consumo de &quot;tokens&quot;. Nos reservamos el derecho de acelerar, pausar o suspender temporalmente el acceso si el sistema
            detecta un uso desproporcionado que afecte la estabilidad de la plataforma mediante nuestros mecanismos de <em>Rate Limiting</em>.
          </p>

          <h2 className="text-foreground">5. Terminación y Eliminación de Datos</h2>
          <p>
            Usted puede cerrar su cuenta en cualquier momento desde su panel de Configuración. Al hacerlo, se eliminarán
            permanentemente sus documentos originales, representaciones vectoriales en nuestra base de datos (PostgreSQL/pgvector) y su
            historial de chat. No existen copias ocultas una vez que confirma la eliminación.
          </p>
        </div>
      </main>
    </div>
  )
}


