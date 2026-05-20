import { baseRates, currencies } from "lib/utils/general";
import { NextResponse } from "next/server";

let lastRates = { ...baseRates };

export async function GET() {
  const rates = currencies.map((currency::) => {
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

  return NextResponse.json(rates);
}
