import { useQuery, useMutation } from "@tanstack/react-query";
import { remittanceService } from "../services/remittance-service";
import { metricsService } from "../services/metrics-service";
import { CACHE_POLICY, RATE_LIMIT_POLICY } from "../config/policy";
import {
  CurrencyRate,
  QuoteResponse,
  TransferReceipt,
} from "../types/remittance";

/** Polls live exchange rates every 10s for the dashboard. */
export const useGetRates = () => {
  return useQuery<CurrencyRate[], Error>({
    queryKey: ["rates"],
    queryFn: () => remittanceService.getRates(),
    ...CACHE_POLICY,
    refetchInterval: 10000,
  });
};

export const useCreateQuote = () => {
  return useMutation<QuoteResponse, Error, unknown>({
    mutationFn: (data: unknown) => remittanceService.createQuote(data),
    retry: RATE_LIMIT_POLICY.maxRetries,
    retryDelay: RATE_LIMIT_POLICY.retryDelayMs,
  });
};

export const useConfirmTransfer = () => {
  return useMutation<TransferReceipt, Error, unknown>({
    mutationFn: (data: unknown) => remittanceService.confirmTransfer(data),
    retry: RATE_LIMIT_POLICY.maxRetries,
    retryDelay: RATE_LIMIT_POLICY.retryDelayMs,
  });
};

/** Fires a POST to /api/metrics to increment the Prometheus abandonment counter. */
export const useTrackAbandonment = () => {
  return useMutation<void, Error, void>({
    mutationFn: () => metricsService.trackAbandonment(),
  });
};
