import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { createServerClient } from '@supabase/ssr'
import { chatRateLimit, uploadRateLimit } from '@/lib/redis/ratelimit'

export async function middleware(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) =>
            request.cookies.set(name, value)
          )
          supabaseResponse = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  const {
    data: { user },
  } = await supabase.auth.getUser()

  const { pathname } = request.nextUrl

  // 1. Rate Limiting for specific API routes
  const isUpload = pathname.startsWith('/api/upload')
  const isChat = pathname.startsWith('/api/chat') || pathname.startsWith('/api/cover-letter')
  
  // Solo limitamos las peticiones POST (creación/generación)
  if ((isUpload || isChat) && request.method === 'POST') {
    const identifier = user ? user.id : (request.headers.get('x-forwarded-for') ?? '127.0.0.1')
    try {
      const ratelimit = isUpload ? uploadRateLimit : chatRateLimit
      const { success, limit, reset, remaining } = await ratelimit.limit(identifier)
      
      if (!success) {
        const errorMessage = isUpload 
          ? 'Límite diario de subidas alcanzado (Máximo 10 por día). Inténtalo mañana.' 
          : 'Límite diario de mensajes alcanzado (Máximo 30 por día). Inténtalo mañana.'
        return NextResponse.json(
          { error: errorMessage, limit, remaining, reset },
          { status: 429 }
        )
      }
    } catch (ratelimitError) {
      console.error('Rate limit error:', ratelimitError)
    }
  }

  // 2. Route Protection
  const isAuthRoute = pathname.startsWith('/login') || pathname.startsWith('/register')
  const isDashboardRoute = pathname.startsWith('/dashboard')

  if (isDashboardRoute && !user) {
    const url = request.nextUrl.clone()
    url.pathname = '/login'
    return NextResponse.redirect(url)
  }

  if (isAuthRoute && user) {
    const url = request.nextUrl.clone()
    url.pathname = '/dashboard'
    return NextResponse.redirect(url)
  }

  return supabaseResponse
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * Feel free to modify this pattern to include more paths.
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}

