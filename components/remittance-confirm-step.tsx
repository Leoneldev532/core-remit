"use client";

import React from "react";
import { useTranslation } from "react-i18next";
import { QuoteResponse } from "../types/remittance";
import { formatCurrency } from "../lib/utils/i18n-utils";
import { formatTime } from "../logic/remittance-logic";

type Props = {
  quote: QuoteResponse;
  timeLeft: number;
  onConfirm: () => void;
  isLoading: boolean;
};

const RemittanceConfirmStep = ({
  quote,
  timeLeft,
  onConfirm,
  isLoading,
}: Props) => {
  const { t, i18n } = useTranslation();
  const locale = i18n.language === "fr" ? "fr-FR" : "en-US";

  return (
    <div className="remittance-confirm-step">
      <h3>{t("remittance.step2.title")}</h3>
      <div className="quote-summary">
        <p>
          <span>{t("remittance.step2.send")} : </span>
          <strong>
            {formatCurrency(quote.sendAmount, quote.sendCurrency, locale)}
          </strong>
        </p>
        <p>
          <span>{t("remittance.step2.fee")} : </span>
          <strong>
            {formatCurrency(quote.fee, quote.sendCurrency, locale)}
          </strong>
        </p>
        <p>
          <span>{t("remittance.step2.exchangeRate")} : </span>
          <strong>
            1 {quote.sendCurrency} = {quote.exchangeRate}{" "}
            {quote.receiveCurrency}
          </strong>
        </p>
        <div className="receive-amount">
          {formatCurrency(quote.receiveAmount, quote.receiveCurrency, locale)}
        </div>
      </div>

      <div className="timer">
        {t("remittance.step2.lockedFor")}:{" "}
        <span className="time">{formatTime(timeLeft)}</span>
      </div>

      <button onClick={onConfirm} disabled={isLoading} className="primary-btn">
        {isLoading
          ? t("remittance.step2.processing")
          : t("remittance.step2.confirmButton")}
      </button>
    </div>
  );
};

export default RemittanceConfirmStep;
