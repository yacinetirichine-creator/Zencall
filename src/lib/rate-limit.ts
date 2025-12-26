/**
 * Rate limiting pour protéger l'application contre les abus
 * 
 * Installation optionnelle (recommandée pour production):
 * npm install @upstash/ratelimit @upstash/redis
 * 
 * Variables d'environnement:
 * UPSTASH_REDIS_REST_URL=https://...
 * UPSTASH_REDIS_REST_TOKEN=...
 * 
 * Si les packages ne sont pas installés, le rate limiting sera désactivé
 * (mode développement uniquement)
 */

type RateLimitResult = {
  success: boolean;
  limit: number;
  remaining: number;
  reset: number;
  pending?: Promise<unknown>;
};

type RateLimiter = {
  limit: (identifier: string) => Promise<RateLimitResult>;
};

// Créer un mock de rate limiter si les packages ne sont pas disponibles
const createMockLimiter = (): RateLimiter => ({
  limit: async () => ({
    success: true,
    limit: 100,
    remaining: 100,
    reset: Date.now() + 60000,
  }),
});

// Tentative d'import dynamique des packages Upstash
let Ratelimit: any = null;
let Redis: any = null;

try {
  // @ts-ignore - Import dynamique optionnel
  const ratelimitModule = require('@upstash/ratelimit');
  // @ts-ignore
  const redisModule = require('@upstash/redis');
  
  Ratelimit = ratelimitModule.Ratelimit;
  Redis = redisModule.Redis;
} catch (error) {
  console.warn('⚠️ Upstash packages not installed. Rate limiting is DISABLED. Install with: npm install @upstash/ratelimit @upstash/redis');
}

// Créer client Redis (uniquement si les packages et env vars sont disponibles)
let redis: any = null;

if (Ratelimit && Redis && process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN) {
  try {
    redis = new Redis({
      url: process.env.UPSTASH_REDIS_REST_URL,
      token: process.env.UPSTASH_REDIS_REST_TOKEN,
    });
  } catch (error) {
    console.warn('Failed to initialize Upstash Redis:', error);
  }
}

/**
 * Rate limiter pour les routes API publiques
 * 100 requêtes par minute par IP
 */
export const apiLimiter: RateLimiter | null = redis && Ratelimit ? new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(100, '1 m'),
  analytics: true,
  prefix: 'ratelimit:api',
}) : null;

/**
 * Rate limiter pour les webhooks (volume élevé attendu)
 * 1000 webhooks par minute
 */
export const webhookLimiter: RateLimiter | null = redis && Ratelimit ? new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(1000, '1 m'),
  analytics: true,
  prefix: 'ratelimit:webhook',
}) : null;

/**
 * Rate limiter pour l'authentification (protège contre brute force)
 * 5 tentatives par 15 minutes par IP
 */
export const authLimiter: RateLimiter | null = redis && Ratelimit ? new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(5, '15 m'),
  analytics: true,
  prefix: 'ratelimit:auth',
}) : null;

/**
 * Rate limiter pour les actions sensibles (création API key, suppression compte)
 * 10 actions par heure
 */
export const sensitiveActionLimiter: RateLimiter | null = redis && Ratelimit ? new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(10, '1 h'),
  analytics: true,
  prefix: 'ratelimit:sensitive',
}) : null;

/**
 * Rate limiter pour les export de données RGPD
 * 3 exports par jour par utilisateur
 */
export const gdprExportLimiter: RateLimiter | null = redis && Ratelimit ? new Ratelimit({
  redis,
  limiter: Ratelimit.fixedWindow(3, '24 h'),
  analytics: true,
  prefix: 'ratelimit:gdpr:export',
}) : null;

/**
 * Helper pour obtenir l'IP du client de manière fiable
 */
export function getClientIp(request: Request): string {
  // Essayer différentes sources d'IP
  const forwarded = request.headers.get('x-forwarded-for');
  const realIp = request.headers.get('x-real-ip');
  const cfConnectingIp = request.headers.get('cf-connecting-ip');
  
  if (cfConnectingIp) return cfConnectingIp; // Cloudflare
  if (realIp) return realIp;
  if (forwarded) return forwarded.split(',')[0].trim();
  
  return 'unknown';
}

/**
 * Exemple d'utilisation dans une route API:
 * 
 * ```typescript
 * import { authLimiter, getClientIp } from '@/lib/rate-limit';
 * import { NextRequest, NextResponse } from 'next/server';
 * 
 * export async function POST(request: NextRequest) {
 *   // 1. Rate limiting
 *   if (authLimiter) {
 *     const ip = getClientIp(request);
 *     const { success, limit, reset, remaining } = await authLimiter.limit(ip);
 *     
 *     if (!success) {
 *       return NextResponse.json(
 *         { 
 *           error: 'Too many requests',
 *           limit,
 *           reset: new Date(reset).toISOString(),
 *         },
 *         { 
 *           status: 429,
 *           headers: {
 *             'X-RateLimit-Limit': limit.toString(),
 *             'X-RateLimit-Remaining': remaining.toString(),
 *             'X-RateLimit-Reset': reset.toString(),
 *           }
 *         }
 *       );
 *     }
 *   }
 *   
 *   // 2. Continue avec la logique normale
 *   // ...
 * }
 * ```
 */
