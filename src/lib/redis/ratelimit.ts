import { Ratelimit } from '@upstash/ratelimit'
import { Redis } from '@upstash/redis'

// Limitamos a 50 peticiones por usuario por día para evitar abusos en el portfolio
export const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(50, '1 d'),
  analytics: true,
  prefix: '@dochub/ratelimit',
})
