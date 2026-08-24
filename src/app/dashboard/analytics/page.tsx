import { createClient } from '@/lib/supabase/server'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Activity, Coins, FileStack, Zap, ShieldCheck } from 'lucide-react'

export default async function AnalyticsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  let usage = { total_tokens: 0, queries_count: 0 }
  let docCount = 0

  if (user) {
    const { data } = await supabase
      .from('user_usage')
      .select('*')
      .eq('user_id', user.id)
      .single()
      
    if (data) usage = data

    const { count } = await supabase
      .from('documents')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', user.id)
      
    if (count !== null) docCount = count
  }

  // Rough estimation: Gemini 1.5 Flash costs ~$0.075 per 1M tokens
  const estimatedCost = (usage.total_tokens / 1000000) * 0.075

  return (
    <div className="space-y-8 p-4 sm:p-0">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Telemetría y Costos</h1>
        <p className="text-muted-foreground mt-2">Monitorea el uso de recursos y métricas de seguridad de tu cuenta.</p>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tokens Consumidos</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-mono">{usage.total_tokens.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Tokens procesados hoy</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Costo Estimado</CardTitle>
            <Coins className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-mono">${estimatedCost.toFixed(5)} USD</div>
            <p className="text-xs text-muted-foreground">Basado en Gemini 1.5 Flash API</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Consultas RAG</CardTitle>
            <Zap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-mono">{usage.queries_count.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Llamadas totales a la base vectorial</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Base Documental</CardTitle>
            <FileStack className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-mono">{docCount}</div>
            <p className="text-xs text-muted-foreground">PDFs indexados en Vector Store</p>
          </CardContent>
        </Card>
      </div>

      {/* Security Architecture */}
      <div>
        <h2 className="text-xl font-bold tracking-tight mb-4">Arquitectura de Seguridad</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-center justify-between p-4 bg-background/50 rounded-xl border border-border/40 shadow-sm">
            <div>
              <p className="font-medium">Upstash Redis Middleware</p>
              <p className="text-sm text-muted-foreground">Previene ataques DDoS y abuso de API</p>
            </div>
            <Badge variant="outline" className="bg-emerald-500/10 text-emerald-500 dark:text-emerald-400 border-emerald-500/20">Activo (10 req/min)</Badge>
          </div>
          <div className="flex items-center justify-between p-4 bg-background/50 rounded-xl border border-border/40 shadow-sm">
            <div>
              <p className="font-medium">Supabase RLS (Row Level Security)</p>
              <p className="text-sm text-muted-foreground">Aislamiento criptográfico de vectores por usuario</p>
            </div>
            <Badge variant="outline" className="bg-emerald-500/10 text-emerald-500 dark:text-emerald-400 border-emerald-500/20">Aislado (Tenant)</Badge>
          </div>
        </div>
      </div>
    </div>
  )
}


