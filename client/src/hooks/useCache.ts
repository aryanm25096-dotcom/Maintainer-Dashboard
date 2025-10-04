import { useState, useEffect, useCallback, useRef } from 'react';

interface CacheEntry<T> {
  data: T;
  timestamp: number;
  ttl: number;
}

interface CacheOptions {
  ttl?: number; // Time to live in milliseconds
  maxSize?: number; // Maximum number of entries
  onExpire?: (key: string) => void;
}

class Cache<T> {
  private cache = new Map<string, CacheEntry<T>>();
  private options: Required<CacheOptions>;

  constructor(options: CacheOptions = {}) {
    this.options = {
      ttl: options.ttl || 5 * 60 * 1000, // 5 minutes default
      maxSize: options.maxSize || 100,
      onExpire: options.onExpire || (() => {})
    };
  }

  set(key: string, data: T, ttl?: number): void {
    // Remove oldest entries if cache is full
    if (this.cache.size >= this.options.maxSize) {
      const oldestKey = this.cache.keys().next().value;
      this.cache.delete(oldestKey);
    }

    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl: ttl || this.options.ttl
    });
  }

  get(key: string): T | null {
    const entry = this.cache.get(key);
    if (!entry) return null;

    const now = Date.now();
    if (now - entry.timestamp > entry.ttl) {
      this.cache.delete(key);
      this.options.onExpire(key);
      return null;
    }

    return entry.data;
  }

  has(key: string): boolean {
    return this.get(key) !== null;
  }

  delete(key: string): boolean {
    return this.cache.delete(key);
  }

  clear(): void {
    this.cache.clear();
  }

  size(): number {
    return this.cache.size;
  }

  keys(): string[] {
    return Array.from(this.cache.keys());
  }

  // Clean up expired entries
  cleanup(): void {
    const now = Date.now();
    for (const [key, entry] of this.cache.entries()) {
      if (now - entry.timestamp > entry.ttl) {
        this.cache.delete(key);
        this.options.onExpire(key);
      }
    }
  }
}

// Global cache instance
const globalCache = new Cache<any>();

export const useCache = <T>(
  key: string,
  fetcher: () => Promise<T>,
  options: CacheOptions = {}
) => {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const cacheRef = useRef(new Cache<T>(options));

  const fetchData = useCallback(async (forceRefresh = false) => {
    // Check cache first
    if (!forceRefresh) {
      const cachedData = cacheRef.current.get(key);
      if (cachedData) {
        setData(cachedData);
        return;
      }
    }

    try {
      setLoading(true);
      setError(null);
      
      const result = await fetcher();
      
      // Cache the result
      cacheRef.current.set(key, result);
      setData(result);
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  }, [key, fetcher]);

  const invalidate = useCallback(() => {
    cacheRef.current.delete(key);
  }, [key]);

  const refresh = useCallback(() => {
    fetchData(true);
  }, [fetchData]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return {
    data,
    loading,
    error,
    refresh,
    invalidate,
    isCached: cacheRef.current.has(key)
  };
};

export const useGlobalCache = <T>(
  key: string,
  fetcher: () => Promise<T>,
  options: CacheOptions = {}
) => {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchData = useCallback(async (forceRefresh = false) => {
    // Check global cache first
    if (!forceRefresh) {
      const cachedData = globalCache.get(key);
      if (cachedData) {
        setData(cachedData);
        return;
      }
    }

    try {
      setLoading(true);
      setError(null);
      
      const result = await fetcher();
      
      // Cache the result
      globalCache.set(key, result, options.ttl);
      setData(result);
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  }, [key, fetcher, options.ttl]);

  const invalidate = useCallback(() => {
    globalCache.delete(key);
  }, [key]);

  const refresh = useCallback(() => {
    fetchData(true);
  }, [fetchData]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return {
    data,
    loading,
    error,
    refresh,
    invalidate,
    isCached: globalCache.has(key)
  };
};

// Utility functions for cache management
export const clearCache = (key?: string) => {
  if (key) {
    globalCache.delete(key);
  } else {
    globalCache.clear();
  }
};

export const getCacheSize = () => globalCache.size();

export const cleanupCache = () => globalCache.cleanup();

// Auto-cleanup every 5 minutes
setInterval(cleanupCache, 5 * 60 * 1000);
