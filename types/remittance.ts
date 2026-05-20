export type CurrencyRate = {
  currency: string;
  rate: number;
  previousRate: number;
  timestamp: number;
};

export type QuoteResponse = {
  quoteId: string;
  sendAmount: number;
  sendCurrency: string;
  receiveAmount: number;
  receiveCurrency: string;
  exchangeRate: number;
  fee: number;
  expiresAt: number;
};

export type TransferReceipt = {
  transactionId: string;
  totalPaid: number;
  receivedAmount: number;
  currencyPair: string;
  status: "SUCCESS" | "FAILED";
  date: string;
};
