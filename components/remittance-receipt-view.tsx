"use client";

import React from "react";
import { useTranslation } from "react-i18next";

type Props = {
  transactionId: string;
  totalPaidFormatted: string;
  receivedAmountFormatted: string;
  currencyPair: string;
};

const RemittanceReceiptView = ({
  transactionId,
  totalPaidFormatted,
  receivedAmountFormatted,
  currencyPair,
}: Props) => {
  const { t } = useTranslation();
  return (
    <div className="receipt-view">
      <p>
        <strong>{t("remittance.step3.transactionId")}:</strong> {transactionId}
      </p>
      <p>
        <strong>{t("remittance.step3.totalPaid")}:</strong> {totalPaidFormatted}
      </p>
      <p>
        <strong>{t("remittance.step3.totalReceived")}:</strong>{" "}
        {receivedAmountFormatted}
      </p>
      <p>
        <strong>{t("remittance.step3.currencyPair")}:</strong>{" "}
        {currencyPair}{" "}
      </p>
    </div>
  );
};

export default RemittanceReceiptView;
