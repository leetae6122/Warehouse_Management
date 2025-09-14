import { Injectable, Inject } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import type { Cache } from 'cache-manager';

type RedisStore = {
  redis: {
    flushdb: () => Promise<void>;
    scanStream: (options: { match: string }) => AsyncIterable<string[]>;
    del: (keys: string[]) => Promise<void>;
  };
};

@Injectable()
export class CacheService {
  constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) {}

  async get<T>(key: string): Promise<T | undefined> {
    return await this.cacheManager.get<T>(key);
  }

  async set<T>(key: string, value: T, ttl?: number): Promise<void> {
    await this.cacheManager.set(key, value, ttl);
  }

  async del(key: string): Promise<void> {
    await this.cacheManager.del(key);
  }

  async clearAll(): Promise<void> {
    const store = (this.cacheManager as unknown as { store?: RedisStore })
      .store;
    if (store && store.redis && typeof store.redis.flushdb === 'function') {
      await store.redis.flushdb();
    }
  }

  /**
   * Clears cache entries by prefix from Redis.
   * @param prefix The prefix to match cache keys.
   */
  async clearByPrefix(prefix: string): Promise<void> {
    const store = (this.cacheManager as unknown as { store?: RedisStore })
      .store;
    if (store && store.redis && typeof store.redis.scanStream === 'function') {
      const redis = store.redis;
      const stream = redis.scanStream({ match: `${prefix}*` });
      const keys: string[] = [];

      for await (const resultKeys of stream) {
        keys.push(...resultKeys);
      }

      if (keys.length && typeof redis.del === 'function') {
        await redis.del(keys);
      }
    }
  }
}
