interface CacheOptions {
  ttl: number; // Time to live in milliseconds
}

interface CacheEntry<T> {
  data: T;
  expires: number;
}

class ApiCache {
  private static instance: ApiCache;
  private cache: Map<string, CacheEntry<any>> = new Map();

  private constructor() {}

  static getInstance(): ApiCache {
    if (!ApiCache.instance) {
      ApiCache.instance = new ApiCache();
    }
    return ApiCache.instance;
  }

  set<T>(key: string, data: T, options: CacheOptions) {
    const expires = Date.now() + options.ttl;
    this.cache.set(key, { data, expires });
  }

  get<T>(key: string): T | null {
    const entry = this.cache.get(key);
    
    if (!entry) return null;
    
    if (Date.now() > entry.expires) {
      this.cache.delete(key);
      return null;
    }
    
    return entry.data;
  }

  clear() {
    this.cache.clear();
  }

  remove(key: string) {
    this.cache.delete(key);
  }
}

export const cache = ApiCache.getInstance();