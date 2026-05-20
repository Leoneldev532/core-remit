import type { NextApiRequest, NextApiResponse } from "next";
import { baseRates, currencies } from "../../lib/utils/general";

let lastRates = { ...baseRates };

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const rates = currencies.map((currency: string) => {
    const change = (Math.random() - 0.5) * 0.01;
    const previousRate = lastRates[currency];
    const rate = previousRate * (1 + change);
    lastRates[currency] = rate;

    return {
      currency,
      rate: Number(rate.toFixed(4)),
      previousRate: Number(previousRate.toFixed(4)),
      timestamp: Date.now(),
    };
  });

  return res.status(200).json(rates);
}
