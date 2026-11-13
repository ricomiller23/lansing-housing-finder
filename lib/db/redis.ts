import { Redis } from '@upstash/redis';

let redisClient: Redis | null = null;
const memoryStore = new Map<string, string>();

if (process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN) {
  try {
    redisClient = new Redis({
      url: process.env.UPSTASH_REDIS_REST_URL,
      token: process.env.UPSTASH_REDIS_REST_TOKEN,
    });
  } catch (err) {
    console.warn('Failed to initialize Upstash Redis, falling back to memory store:', err);
  }
}

export async function dbGet<T>(key: string): Promise<T | null> {
  if (redisClient) {
    try {
      const data = await redisClient.get(key);
      if (typeof data === 'string') {
        try {
          return JSON.parse(data) as T;
        } catch {
          return data as T;
        }
      }
      return data as T;
    } catch (e) {
      console.error('Redis get error:', e);
    }
  }

  const raw = memoryStore.get(key);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return raw as unknown as T;
  }
}

export async function dbSet(key: string, value: any, ttlSeconds?: number): Promise<void> {
  const serialized = typeof value === 'string' ? value : JSON.stringify(value);

  if (redisClient) {
    try {
      if (ttlSeconds) {
        await redisClient.setex(key, ttlSeconds, serialized);
      } else {
        await redisClient.set(key, serialized);
      }
      return;
    } catch (e) {
      console.error('Redis set error:', e);
    }
  }

  memoryStore.set(key, serialized);
}

export async function dbDelete(key: string): Promise<void> {
  if (redisClient) {
    try {
      await redisClient.del(key);
      return;
    } catch (e) {
      console.error('Redis delete error:', e);
    }
  }
  memoryStore.delete(key);
}
