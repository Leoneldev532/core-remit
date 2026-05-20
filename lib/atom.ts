import { atom } from "jotai";
import { QuoteResponse, TransferReceipt } from "../types/remittance";

export const currentStepAtom = atom<1 | 2 | 3>(1);
export const activeQuoteAtom = atom<QuoteResponse | null>(null);
export const activeReceiptAtom = atom<TransferReceipt | null>(null);
export const isRateLockedAtom = atom<boolean>(false);
export const remainingTimeAtom = atom<number>(300); // 5 minutes in seconds
