import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { chunkText, generateEmbedding } from '@/lib/ai/embeddings'
import { trackTokenUsage } from '@/lib/ai/telemetry'
// const pdfParse = require('pdf-parse')

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function POST(request: Request) {
  try {
    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json({ error: 'Falta GEMINI_API_KEY en variables de entorno' }, { status: 500 })
    }
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Límite Gratuito: Máximo 3 documentos por usuario para evitar llenar la DB
    const { count, error: countError } = await supabase
      .from('documents')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', user.id)

    if (count !== null && count >= 3) {
      return NextResponse.json({ 
        error: 'Límite de la versión gratuita alcanzado. Esta cuenta gratuita permite un máximo de 3 documentos.' 
      }, { status: 403 })
    }

    const formData = await request.formData()
    const file = formData.get('file') as File | null

    if (!file) {
      return NextResponse.json({ error: 'No se envió ningún archivo' }, { status: 400 })
    }

    if (file.type !== 'application/pdf') {
      return NextResponse.json({ error: 'Solo se permiten archivos PDF' }, { status: 400 })
    }

    if (file.size === 0 || file.size > 5 * 1024 * 1024) {
      return NextResponse.json({ error: 'El archivo debe ser mayor a 0 y menor a 5MB' }, { status: 400 })
    }

    // Convert file to buffer for pdf-parse
    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)

    // Validate magic bytes: real PDFs start with %PDF (0x25 0x50 0x44 0x46)
    const magicBytes = new Uint8Array(arrayBuffer.slice(0, 4))
    const isPDF = magicBytes[0] === 0x25 && magicBytes[1] === 0x50 && magicBytes[2] === 0x44 && magicBytes[3] === 0x46
    if (!isPDF) {
      return NextResponse.json({ error: 'El archivo no es un PDF válido' }, { status: 400 })
    }

    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const pdfParse = require('pdf-parse/lib/pdf-parse.js')
    const pdfData = await pdfParse(buffer)
    const text = pdfData.text
    const pageCount = pdfData.numpages || 1

    // Insert Document
    const { data: doc, error: docError } = await supabase
      .from('documents')
      .insert({
        user_id: user.id,
        title: file.name,
        file_size: file.size,
        page_count: pageCount
      })
      .select('id')
      .single()

    if (docError) {
      console.error(docError)
      return NextResponse.json({ error: 'Failed to create document record' }, { status: 500 })
    }

    // Chunk text
    const chunks = chunkText(text, 800, 100)
    let totalTokens = 0

    // Process embeddings in parallel batches for performance
    const embeddingsData: { document_id: string; content_chunk: string; page_number: number; embedding: number[] }[] = []
    const BATCH_SIZE = 10
    for (let i = 0; i < chunks.length; i += BATCH_SIZE) {
      const batch = chunks.slice(i, i + BATCH_SIZE)
      const batchEmbeddings = await Promise.all(batch.map(chunk => generateEmbedding(chunk)))
      batch.forEach((chunk, batchIdx) => {
        const globalIdx = i + batchIdx
        totalTokens += Math.ceil(chunk.length / 4)
        embeddingsData.push({
          document_id: doc.id,
          content_chunk: chunk,
          page_number: Math.floor((globalIdx / chunks.length) * pageCount) + 1,
          embedding: batchEmbeddings[batchIdx]
        })
      })
    }

    // Bulk Insert Embeddings
    const { error: embeddingsError } = await supabase
      .from('document_embeddings')
      .insert(embeddingsData)

    if (embeddingsError) {
      console.error(embeddingsError)
      return NextResponse.json({ error: 'Failed to store embeddings' }, { status: 500 })
    }

    // Update User Usage via Telemetry
    await trackTokenUsage(user.id, totalTokens, false)

    return NextResponse.json({ success: true, document_id: doc.id })
  } catch (error: unknown) {
    console.error('=== FATAL UPLOAD ERROR ===')
    console.error(error)
    
    let errorMessage = 'Error interno al procesar el PDF'
    if (error instanceof Error) {
      errorMessage = error.message
    } else if (typeof error === 'string') {
      errorMessage = error
    } else if (error && typeof error === 'object') {
      errorMessage = JSON.stringify(error)
    }
    
    return NextResponse.json(
      { error: `Error del servidor: ${errorMessage}` },
      { status: 500 }
    )
  }
}

