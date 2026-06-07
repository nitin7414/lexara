// Upstash Redis client stub
// Replaced with actual @upstash/redis client when environment keys are configured.

export const redis = {
  get: async <T = any>(key: string): Promise<T | null> => {
    return null;
  },
  set: async (
    key: string,
    value: any,
    options?: { ex?: number }
  ): Promise<string | null> => {
    return null;
  },
  del: async (key: string): Promise<number> => {
    return 0;
  },
  incr: async (key: string): Promise<number> => {
    return 0;
  },
  expire: async (key: string, seconds: number): Promise<number> => {
    return 0;
  },
};
