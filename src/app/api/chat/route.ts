import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { generateEmbedding } from '@/lib/ai/embeddings'
import { trackTokenUsage } from '@/lib/ai/telemetry'
import { GoogleGenerativeAI } from '@google/generative-ai'

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!)

export async function POST(request: Request) {
  try {
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { message, document_id } = await request.json()

    // Sanitize and limit input to prevent prompt injection
    const safeMessage = String(message || '').slice(0, 2000).trim()
    if (!safeMessage) {
      return NextResponse.json({ error: 'Message required' }, { status: 400 })
    }

    // 1. Generate embedding for the question
    const queryEmbedding = await generateEmbedding(safeMessage)

    // 2. Search for similar documents
    const matchThreshold = 0.3
    // Fetch more if we need to filter by document_id in memory (since RPC doesn't accept document_id)
    const matchCount = document_id && document_id !== 'all' ? 10 : 4

    const { data: matches, error: matchError } = await supabase.rpc('match_documents', {
      query_embedding: queryEmbedding,
      match_threshold: matchThreshold,
      match_count: matchCount
    })

    if (matchError) {
      console.error(matchError)
      return NextResponse.json({ error: 'Error matching documents' }, { status: 500 })
    }

    // Filter by document_id if provided
    let finalMatches = matches || []
    if (document_id && document_id !== 'all') {
      finalMatches = finalMatches.filter((m: unknown) => (m as {document_id: string}).document_id === document_id)
    }
    finalMatches = finalMatches.slice(0, 4)

    // 3. Get Document Titles
    const docIds = [...new Set(finalMatches.map((m: unknown) => (m as {document_id: string}).document_id))]
    const docTitles: Record<string, string> = {}
    if (docIds.length > 0) {
      const { data: docs } = await supabase.from('documents').select('id, title').in('id', docIds)
      if (docs) {
        docs.forEach(d => { docTitles[d.id] = d.title })
      }
    }

    // 4. Build Context
    let contextText = ''
    const sources = []
    
    for (const match of finalMatches) {
      const title = docTitles[match.document_id] || 'Documento Desconocido'
      contextText += `\n--- Fuente: ${title} - Pág. ${match.page_number} ---\n${match.content_chunk}\n`
      sources.push({
        title,
        page: match.page_number,
        content: match.content_chunk,
        similarity: match.similarity
      })
    }

    // 5. Build prompt (user input is delimited to prevent injection)
    const prompt = `Eres un asistente experto para DocuMind AI. Responde a la pregunta basándote ESTRICTAMENTE en el contexto proporcionado.
Si la respuesta no se encuentra en el contexto, indica claramente que no tienes información suficiente en los documentos disponibles. NO ALUCINES.
Cuando proporciones información extraída del contexto, SIEMPRE CITA LA FUENTE al final de la oración usando el formato exacto: [Fuente: NombreDocumento.pdf - Pág. X].

CONTEXTO RECUPERADO:
${contextText}

PREGUNTA DEL USUARIO:
<user_input>${safeMessage}</user_input>`

    // 6. Generate Content Stream
    const model = genAI.getGenerativeModel({ model: 'gemini-3.6-flash' })
    const result = await model.generateContentStream(prompt)

    const encoder = new TextEncoder()
    const stream = new ReadableStream({
      async start(controller) {
        let responseLength = 0
        try {
          for await (const chunk of result.stream) {
            const chunkText = chunk.text()
            if (chunkText) {
              responseLength += chunkText.length
              controller.enqueue(encoder.encode(chunkText))
            }
          }
        } catch (err) {
          console.error("Streaming error:", err)
        } finally {
          controller.close()
          // Update User Usage via Telemetry
          const estimatedTokens = Math.ceil((prompt.length + responseLength) / 4)
          trackTokenUsage(user.id, estimatedTokens, true).catch(console.error)
        }
      }
    })

    // Pass sources in header
    const headers = new Headers()
    headers.set('Content-Type', 'text/plain; charset=utf-8')
    headers.set('x-sources', encodeURIComponent(JSON.stringify(sources)))

    return new NextResponse(stream, { headers })

  } catch (error: unknown) {
    console.error('Chat API Error:', error)
    
    let errorMessage = 'Error interno en Chat'
    if (error instanceof Error) {
      errorMessage = error.message
    } else if (typeof error === 'string') {
      errorMessage = error
    } else if (error && typeof error === 'object') {
      errorMessage = JSON.stringify(error)
    }
    
    return NextResponse.json({ error: errorMessage }, { status: 500 })
  }
}


