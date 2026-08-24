import { Ratelimit } from '@upstash/ratelimit'
import { Redis } from '@upstash/redis'

const redis = Redis.fromEnv()

// Límite para chats y cartas: 30 peticiones por día
export const chatRateLimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(30, '1 d'),
  analytics: true,
  prefix: '@dochub/chat',
})

// Límite para subidas de PDF: 10 subidas por día
export const uploadRateLimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(10, '1 d'),
  analytics: true,
  prefix: '@dochub/upload',
})
