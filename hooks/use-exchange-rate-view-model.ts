import { useGetRates } from "../query/remittance-query";

export const useExchangeRateViewModel = () => {
  const { data: rates, isLoading, isError } = useGetRates();

  return {
    rates,
    isLoading,
    isError,
  };
};
