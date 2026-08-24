import { createClient } from '@/lib/supabase/server'

/**
 * Estimates token count for the given text strings.
 * Approximation: 1 token â‰ˆ 4 characters (standard LLM heuristic).
 */
function estimateTokens(...texts: string[]): number {
  return Math.ceil(texts.reduce((sum, t) => sum + (t?.length ?? 0), 0) / 4)
}

/**
 * Records token usage to the database.
 * Logs a warning if the RPC call fails instead of silently dropping it.
 */
export async function trackTokenUsage(userId: string, tokens: number, isQuery = false) {
  if (!userId || tokens <= 0) return
  const costUsd = (tokens / 1_000_000) * 0.075 // Gemini Flash pricing estimate
  const supabase = await createClient()

  const { error } = await supabase.rpc('increment_user_usage', {
    p_user_id: userId,
    p_tokens: tokens,
    p_cost: costUsd,
    p_is_query: isQuery,
  })

  if (error) {
    console.warn('[Telemetry] Failed to record usage:', error.message)
  }
}

