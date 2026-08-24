import { GoogleGenerativeAI } from '@google/generative-ai'

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!)

/**
 * Generates an embedding for the given text using Gemini text-embedding-004.
 */
export async function generateEmbedding(text: string): Promise<number[]> {
  // Use gemini-embedding-2 and truncate to 768 dimensions to match pgvector config
  const model = genAI.getGenerativeModel({ model: 'gemini-embedding-2' })
  const result = await model.embedContent({
    content: { role: 'user', parts: [{ text }] },
    outputDimensionality: 768
  } as any) // Typecast if outputDimensionality is not fully typed in older versions
  return result.embedding.values
}

/**
 * Splits text into chunks with a specified size and overlap.
 */
export function chunkText(text: string, chunkSize = 800, overlap = 100): string[] {
  // Very simple chunking based on word count/characters.
  // We'll chunk by characters for simplicity and precision.
  const chunks: string[] = []
  let i = 0
  
  while (i < text.length) {
    const end = Math.min(i + chunkSize, text.length)
    const chunk = text.slice(i, end)
    chunks.push(chunk)
    // If we've reached the end, stop
    if (end === text.length) break
    // Step forward by chunkSize minus overlap
    i += chunkSize - overlap
  }

  return chunks
}

