'use client'

import { useState, useEffect, useRef, useMemo } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'
import { Send, Bot, User, FileText } from 'lucide-react'
import ReactMarkdown from 'react-markdown'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { toast } from '@/components/ui/toast'
import { motion, AnimatePresence } from 'framer-motion'

interface Source {
  title: string
  page: number
  content: string
  similarity: number
}

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  sources?: Source[]
}

export default function ChatPage() {
  const [documents, setDocuments] = useState<{id: string, title: string}[]>([])
  const [selectedDoc, setSelectedDoc] = useState<string>('all')
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content: '¡Hola! Soy tu asistente de DocuMind AI. Puedes preguntarme cualquier cosa sobre tus documentos indexados.',
    }
  ])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  
  const [sourceModalOpen, setSourceModalOpen] = useState(false)
  const [selectedSource, setSelectedSource] = useState<Source | null>(null)
  
  const messagesEndRef = useRef<HTMLDivElement>(null)
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

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || isLoading) return

    const userMessage = input
    setInput('')
    
    const newMessages: Message[] = [...messages, { id: crypto.randomUUID(), role: 'user', content: userMessage }]
    setMessages(newMessages)
    setIsLoading(true)

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMessage, document_id: selectedDoc })
      })

      if (!response.ok) {
        const text = await response.text()
        console.error('Chat Server Error:', text)
        let errorMsg = 'Failed to fetch response'
        try {
          const json = JSON.parse(text)
          if (json.error) errorMsg = json.error
        } catch {
          if (response.status === 429) errorMsg = 'Lmite de peticiones alcanzado, reintenta en un minuto.'
          else errorMsg = `Server error: ${response.status}`
        }
        throw new Error(errorMsg)
      }

      // Read sources from header
      const sourcesHeader = response.headers.get('x-sources')
      let sources: Source[] = []
      if (sourcesHeader) {
        try {
          sources = JSON.parse(decodeURIComponent(sourcesHeader))
        } catch (e) {
          console.error('Failed to parse sources', e)
        }
      }

      const reader = response.body?.getReader()
      const decoder = new TextDecoder()
      
      if (!reader) {
        setIsLoading(false)
        return
      }

      let assistantMessage = ''
      
      setMessages(prev => [...prev, { id: crypto.randomUUID(), role: 'assistant', content: '', sources }])

      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        
        const chunk = decoder.decode(value, { stream: true })
        assistantMessage += chunk
        
        setMessages(prev => {
          const lastIndex = prev.length - 1
          const updated = [...prev]
          updated[lastIndex] = { ...updated[lastIndex], content: assistantMessage }
          return updated
        })
      }
      
    } catch (error: unknown) {
      console.error(error)
      toast.error((error as Error).message || 'Hubo un error al procesar tu solicitud.')
    } finally {
      setIsLoading(false)
    }
  }

  const openSource = (source: Source) => {
    setSelectedSource(source)
    setSourceModalOpen(true)
  }

  return (
    <div className="flex flex-col h-[calc(100dvh-64px)] sm:h-[calc(100vh-120px)] sm:max-h-[800px] sm:rounded-xl sm:border border-border/40 overflow-hidden bg-background sm:shadow-sm">
      {/* Header */}
      <div className="p-4 border-b border-border/40 bg-card/50 backdrop-blur-sm">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="font-medium text-lg tracking-tight">Chat Documental RAG</h2>
            <p className="text-sm text-muted-foreground">Consulta tus archivos con IA</p>
          </div>
          <div className="w-64">
            <Select value={selectedDoc} onValueChange={(val) => setSelectedDoc(val || 'all')}>
              <SelectTrigger className="border-border/40 bg-background/50">
                <SelectValue placeholder="Seleccionar Documento" />
              </SelectTrigger>
              <SelectContent className="border-border/40">
                <SelectItem value="all">Todos mis documentos</SelectItem>
                {documents.map(doc => (
                  <SelectItem key={doc.id} value={doc.id}>{doc.title}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6 pb-24 bg-gradient-to-b from-background to-muted/20">
        <AnimatePresence initial={false}>
          {messages.map((msg) => (
            <motion.div 
              key={msg.id} 
              initial={{ opacity: 0, y: 15 }} 
              animate={{ opacity: 1, y: 0 }} 
              transition={{ duration: 0.3 }}
              className={`flex gap-4 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {msg.role === 'assistant' && (
                <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                  <Bot className="h-4 w-4 text-primary" />
                </div>
              )}
              
              <div className={`flex flex-col gap-2 max-w-[85%] md:max-w-[75%] ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                <div className={`px-4 py-3 rounded-2xl border border-border/10 shadow-sm ${msg.role === 'user' ? 'bg-primary text-primary-foreground rounded-br-sm' : 'bg-card text-card-foreground rounded-bl-sm'}`}>
                  {msg.role === 'assistant' ? (
                    <div className="prose prose-sm dark:prose-invert max-w-none break-words font-sans">
                      <ReactMarkdown>{msg.content}</ReactMarkdown>
                    </div>
                  ) : (
                    <div className="whitespace-pre-wrap font-sans text-sm">{msg.content}</div>
                  )}
                </div>
                
                {/* Citaciones de Fuentes (Solo asistente) */}
                {msg.role === 'assistant' && msg.sources && msg.sources.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-1">
                    {msg.sources.map((src, i) => (
                      <Badge 
                        key={src.title + src.page + src.similarity} 
                        variant="outline" 
                        className="cursor-pointer hover:bg-muted transition-colors duration-200 text-xs flex items-center gap-1.5 py-1 px-2.5 rounded-full border-border/40 font-mono bg-background text-muted-foreground hover:text-foreground"
                        onClick={() => openSource(src)}
                      >
                        <FileText className="h-3 w-3 opacity-70" />
                        {src.title} <span className="opacity-50">(Pág. {src.page})</span>
                      </Badge>
                    ))}
                  </div>
                )}
              </div>

              {msg.role === 'user' && (
                <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center shrink-0">
                  <User className="h-4 w-4 text-muted-foreground" />
                </div>
              )}
            </motion.div>
          ))}
        </AnimatePresence>
        
        {isLoading && messages[messages.length - 1]?.role === 'user' && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex gap-4 justify-start">
            <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
              <Bot className="h-4 w-4 text-primary" />
            </div>
            <div className="bg-card border border-border/10 rounded-2xl rounded-tl-sm px-4 py-3 shadow-sm flex items-center gap-3 h-11">
              <div className="flex gap-1 items-center h-full">
                {[0, 1, 2].map((i) => (
                  <motion.div
                    key={`loader-${i}`}
                    className="w-1.5 h-4 bg-primary/60 rounded-full origin-bottom"
                    animate={{ scaleY: [0.25, 1, 0.25] }}
                    transition={{
                      duration: 1,
                      repeat: Infinity,
                      delay: i * 0.15,
                      ease: "easeInOut",
                    }}
                  />
                ))}
              </div>
              <span className="text-sm font-medium text-muted-foreground animate-pulse">
                Procesando información
              </span>
            </div>
          </motion.div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area (Sticky Mobile First) */}
      <div className="sticky bottom-0 w-full p-4 border-t border-border/40 bg-background/80 backdrop-blur-xl pb-safe">
        <form onSubmit={handleSubmit} className="flex gap-3 max-w-4xl mx-auto">
          <Input 
            value={input} 
            onChange={(e) => setInput(e.target.value)}
            placeholder="Pregunta algo sobre tus documentos..." 
            className="flex-1 rounded-full px-5 min-h-[44px] bg-background shadow-sm focus-visible:ring-1"
            disabled={isLoading}
          />
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button type="submit" size="icon" className="rounded-full h-11 w-11 shrink-0" disabled={!input.trim() || isLoading}>
              <Send className="h-4 w-4 ml-0.5" />
              <span className="sr-only">Enviar</span>
            </Button>
          </motion.div>
        </form>
      </div>

      {/* Modal Visor de Fuente */}
      <Dialog open={sourceModalOpen} onOpenChange={setSourceModalOpen}>
        <DialogContent className="rounded-none border-2 border-border">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              {selectedSource?.title}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="text-sm text-muted-foreground flex justify-between border-b pb-2">
              <span>Página: {selectedSource?.page}</span>
              <span>Relevancia: {selectedSource?.similarity ? (selectedSource.similarity * 100).toFixed(1) : 0}%</span>
            </div>
            <div className="bg-muted p-4 rounded-md text-sm max-h-[300px] overflow-y-auto whitespace-pre-wrap">
              {selectedSource?.content}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}





