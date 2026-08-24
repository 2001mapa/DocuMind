import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ArrowLeft, Lock } from 'lucide-react'

export const metadata = {
  title: 'Política de Privacidad | DocuMind AI'
}

export default function PrivacyPage() {
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
          <Lock className="mr-2 h-4 w-4" /> Privacidad End-to-End
        </div>
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-8">Política de Privacidad</h1>
        <p className="text-muted-foreground mb-12">Última actualización: "24 de agosto de 2026"</p>

        <div className="prose prose-zinc dark:prose-invert max-w-none text-muted-foreground">
          <h2 className="text-foreground">Compromiso con su Privacidad</h2>
          <p>
            En DocuMind AI, consideramos que la privacidad de la información corporativa y personal es prioritaria. 
            Esta Política de Privacidad describe cómo recopilamos, utilizamos, procesamos y protegemos sus datos 
            cuando interactúa con nuestro software de análisis documental.
          </p>

          <h2 className="text-foreground">1. ¿Qué datos recopilamos?</h2>
          <ul>
            <li><strong>Datos de Identidad:</strong> Correo electrónico y credenciales de acceso.</li>
            <li><strong>Datos Documentales:</strong> Archivos PDF que usted sube deliberadamente al sistema.</li>
            <li><strong>Datos de Interacción (Logs):</strong> Consultas de texto realizadas al chat de IA, configuraciones y telemetría de uso.</li>
          </ul>

          <h2 className="text-foreground">2. Aislamiento Criptográfico y Almacenamiento</h2>
          <p>
            Toda la infraestructura de bases de datos está hospedada en entornos seguros (Supabase).
            Implementamos estrictas políticas de seguridad a nivel de fila (Row Level Security - RLS), asegurando 
            criptográficamente a nivel de base de datos que sus documentos y vectores (embeddings) solo sean accesibles por 
            la cuenta que los originó.
          </p>

          <h2 className="text-foreground">3. Procesamiento a través de Proveedores de IA</h2>
          <p>
            Para realizar el análisis semántico, fragmentos (chunks) estrictamente necesarios de sus documentos son
            enviados de manera encriptada vía API a nuestros proveedores de Modelos de Lenguaje (Google Gemini). 
            Mantenemos acuerdos de procesamiento de datos que <strong>prohíben categóricamente</strong> a estos proveedores 
            usar sus datos corporativos o el contenido de sus PDFs para entrenar sus propios modelos base públicos.
          </p>

          <h2 className="text-foreground">4. Retención de Datos</h2>
          <p>
            Usted tiene control autónomo de su información. Al presionar &quot;Eliminar Documento&quot;, destruimos instantáneamente 
            el archivo binario, los registros de chat asociados a este, y las representaciones matemáticas (vectores) 
            almacenadas en <code>pgvector</code>.
          </p>
        </div>
      </main>
    </div>
  )
}


