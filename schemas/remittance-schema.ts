import { z } from "zod";

export const quoteSchema = z.object({
  sendAmount: z.number().positive("Amount must be positive"),
  sendCurrency: z.string().min(3).max(3),
  receiveCurrency: z.string().min(3).max(3),
});

export type QuotePayload = z.infer<typeof quoteSchema>;

export const confirmTransferSchema = z.object({
  quoteId: z.string().uuid(),
});

export type ConfirmTransferPayload = z.infer<typeof confirmTransferSchema>;
