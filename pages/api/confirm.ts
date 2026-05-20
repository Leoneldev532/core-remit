import type { NextApiRequest, NextApiResponse } from "next";
import { v4 as uuidv4 } from "uuid";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const { quoteId } = req.body;

  const receipt = {
    transactionId: uuidv4().substring(0, 8).toUpperCase(),
    totalPaid: 100.0, // Mock
    receivedAmount: 90.16, // Mock
    currencyPair: "USD/EUR",
    status: "SUCCESS",
    date: new Date().toISOString(),
  };

  return res.status(200).json(receipt);
}
