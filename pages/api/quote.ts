import type { NextApiRequest, NextApiResponse } from "next";
import { v4 as uuidv4 } from "uuid";
import { z } from "zod";
import { REMITTANCE_POLICY } from "../../config/policy";
import { quoteSchema } from "../../schemas/remittance-schema";

/** Mock exchange rate map. In production this would hit a live FX feed. */
const MOCK_RATES: Record<string, number> = {
  EUR: 0.92,
  GBP: 0.79,
  JPY: 151.2,
  CAD: 1.35,
  AUD: 1.52,
};

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  // Validate body with Zod schema
  const parsed = quoteSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ message: "Invalid request", errors: parsed.error.format() });
  }

  const { sendAmount, sendCurrency, receiveCurrency } = parsed.data;

  const rate = MOCK_RATES[receiveCurrency] ?? 0.92;
  const fee = REMITTANCE_POLICY.fixedFee;
  const receiveAmount = (sendAmount - fee) * rate;

  const quote = {
    quoteId: uuidv4(),
    sendAmount,
    sendCurrency,
    receiveAmount: Number(receiveAmount.toFixed(2)),
    receiveCurrency,
    exchangeRate: rate,
    fee,
    expiresAt: Date.now() + 5 * 60 * 1000,
  };

  return res.status(200).json(quote);
}
