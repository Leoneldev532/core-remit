"use client";

import React from "react";
import { useTranslation } from "react-i18next";
import { TransferReceipt } from "../types/remittance";
import { mapToReceiptProps } from "../logic/remittance-logic";
import { formatDate } from "../lib/utils/i18n-utils";

type Props = {
  receipt: TransferReceipt;
  onNewTransfer: () => void;
};

const RemittanceReceiptStep = ({ receipt, onNewTransfer }: Props) => {
  const { t, i18n } = useTranslation();
  const locale = i18n.language === "fr" ? "fr-FR" : "en-US";
  const receiptProps = mapToReceiptProps(receipt, locale);

  return (
    <div className="remittance-receipt-step">
      <div className="success-badge">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          height={25}
          width={25}
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="green"
          className="size-2"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
          />
        </svg>
        {t("remittance.step3.statusCompleted")}
      </div>
      <h3>{t("remittance.step3.title")}</h3>
      <p>{t("remittance.step3.message")}</p>

      <div className="receipt-details">
        <div className="receipt-row">
          <span>{t("remittance.step3.transactionId")} : </span>
          <strong>{receiptProps.transactionId}</strong>
        </div>
        <div className="receipt-row">
          <span>{t("remittance.step3.totalPaid")} : </span>
          <strong>{receiptProps.totalPaidFormatted}</strong>
        </div>
        <div className="receipt-row">
          <span>{t("remittance.step3.totalReceived")} : </span>
          <strong>{receiptProps.receivedAmountFormatted}</strong>
        </div>
        <div className="receipt-row">
          <span>{t("remittance.step3.currencyPair")} : </span>
          <strong>{receiptProps.currencyPair}</strong>
        </div>
        <div className="receipt-row">
          <span>{t("remittance.step3.status")} : </span>
          <strong className="status-completed">
            {t("remittance.step3.statusCompleted")}
          </strong>
        </div>
        <div className="receipt-row">
          <span>Date : </span>
          <strong>{formatDate(receipt.date, locale)}</strong>
        </div>
      </div>

      <button onClick={onNewTransfer} className="primary-btn">
        {t("remittance.step3.newTransfer")}
      </button>
    </div>
  );
};

export default RemittanceReceiptStep;
