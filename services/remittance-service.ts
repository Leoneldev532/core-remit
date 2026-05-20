import axiosInstance from "../config/axiosInstance";
import {
  CurrencyRate,
  QuoteResponse,
  TransferReceipt,
} from "../types/remittance";
import {
  QuotePayload,
  ConfirmTransferPayload,
  quoteSchema,
  confirmTransferSchema,
} from "../schemas/remittance-schema";

export const remittanceService = {
  getRates: async (): Promise<CurrencyRate[]> => {
    const response = await axiosInstance.get<CurrencyRate[]>("/api/rates");
    return response.data;
  },

  // Zod validates the input before sending to the API
  createQuote: async (rawInput: unknown): Promise<QuoteResponse> => {
    const payload = quoteSchema.parse(rawInput);
    const response = await axiosInstance.post<QuoteResponse>(
      "/api/quote",
      payload,
    );
    return response.data;
  },

  // Zod validates the quoteId before confirming the transfer
  confirmTransfer: async (rawInput: unknown): Promise<TransferReceipt> => {
    const payload = confirmTransferSchema.parse(rawInput);
    const response = await axiosInstance.post<TransferReceipt>(
      "/api/confirm",
      payload,
    );
    return response.data;
  },
};
