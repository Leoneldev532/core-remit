"use client";

import { useAtom } from "jotai";
import { useEffect, useRef } from "react";
import {
  currentStepAtom,
  activeQuoteAtom,
  activeReceiptAtom,
  isRateLockedAtom,
  remainingTimeAtom,
} from "../lib/atom";
import {
  useCreateQuote,
  useConfirmTransfer,
  useTrackAbandonment,
} from "../query/remittance-query";
import { QuotePayload } from "../schemas/remittance-schema";
import { TransferReceipt, QuoteResponse } from "../types/remittance";

/** ViewModel orchestrating the 3-step wizard: Quote → Confirm → Receipt. */
export const useRemittanceWizardViewModel = () => {
  const [step, setStep] = useAtom(currentStepAtom);
  const [quote, setQuote] = useAtom(activeQuoteAtom);
  const [receipt, setReceipt] = useAtom(activeReceiptAtom);
  const [isLocked, setIsLocked] = useAtom(isRateLockedAtom);
  const [timeLeft, setTimeLeft] = useAtom(remainingTimeAtom);

  const { mutate: createQuote, isPending: isCreatingQuote } = useCreateQuote();
  const { mutate: confirmTransfer, isPending: isConfirming } =
    useConfirmTransfer();
  const { mutate: trackAbandonment } = useTrackAbandonment();

  // Ref to hold the countdown interval, cleaned up on unmount or step change
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Countdown effect: ticks every 1s while rate is locked, resets on expiry
  useEffect(() => {
    if (isLocked && timeLeft > 0) {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      handleTimeout();
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLocked, timeLeft]);

  const resetWizard = () => {
    setIsLocked(false);
    setQuote(null);
    setReceipt(null);
    setStep(1);
    setTimeLeft(300);
  };

  // On timer expiry: reset the flow AND log the Prometheus abandonment metric
  const handleTimeout = () => {
    resetWizard();
    trackAbandonment();
  };

  const handleGetQuote = (data: QuotePayload) => {
    createQuote(data, {
      onSuccess: (newQuote: QuoteResponse) => {
        setQuote(newQuote);
        setIsLocked(true);
        setStep(2);
        setTimeLeft(300);
      },
    });
  };

  const handleConfirm = () => {
    if (!quote) return;
    confirmTransfer(
      { quoteId: quote.quoteId },
      {
        onSuccess: (newReceipt: TransferReceipt) => {
          setReceipt(newReceipt);
          setStep(3);
          setIsLocked(false);
        },
      },
    );
  };

  return {
    step,
    quote,
    receipt,
    isLocked,
    timeLeft,
    isCreatingQuote,
    isConfirming,
    handleGetQuote,
    handleConfirm,
    resetWizard,
  };
};
