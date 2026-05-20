import { formatCurrency } from "../lib/utils/i18n-utils";
import { TransferReceipt } from "../types/remittance";

/**
 * Calculates the amount the recipient will receive after deducting the fee
 * and applying the exchange rate.
 */
export const calculateReceiveAmount = (
  sendAmount: number,
  rate: number,
  fee: number,
): number => {
  if (sendAmount <= fee) return 0;
  return (sendAmount - fee) * rate;
};

/**
 * Returns true if the given timestamp is in the past.
 */
export const isQuoteExpired = (expiresAt: number): boolean => {
  return Date.now() > expiresAt;
};

/**
 * Maps a raw TransferReceipt to locale-formatted display props.
 */
export const mapToReceiptProps = (receipt: TransferReceipt, locale: string) => {
  const [sendCurr, recCurr] = receipt.currencyPair.split("/");
  return {
    transactionId: receipt.transactionId,
    totalPaidFormatted: formatCurrency(receipt.totalPaid, sendCurr, locale),
    receivedAmountFormatted: formatCurrency(
      receipt.receivedAmount,
      recCurr,
      locale,
    ),
    currencyPair: receipt.currencyPair,
    status: receipt.status,
    date: receipt.date,
  };
};

/**
 * Formats a countdown in seconds to MM:SS.
 */
export const formatTime = (seconds: number): string => {
  const min = Math.floor(seconds / 60);
  const sec = seconds % 60;
  return `${min}:${sec < 10 ? "0" : ""}${sec}`;
};
