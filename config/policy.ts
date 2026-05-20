export const CACHE_POLICY = {
  staleTime: 1000 * 60 * 5, // 5 minutes
  gcTime: 1000 * 60 * 10, // 10 minutes
  refetchOnWindowFocus: true,
  refetchOnMount: true,
  refetchInterval: false,
};

export const RATE_LIMIT_POLICY = {
  maxRetries: 3,
  retryDelayMs: (attempt: number): number =>
    Math.min(1000 * 2 ** attempt, 30_000),
  nonRetryableStatuses: [400, 401, 403, 404, 422],
  mutationThrottleMs: 1_000,
  maxConcurrentRequests: 5,
} as const;

export const REMITTANCE_POLICY = {
  fixedFee: 2.0,
  minAmount: 1,
  maxAmount: 10000,
} as const;
