"use client";

import React from "react";
import { useRemittanceWizardViewModel } from "../hooks/use-remittance-wizard-view-model";
import RemittanceQuoteStep from "./remittance-quote-step";
import RemittanceConfirmStep from "./remittance-confirm-step";
import RemittanceReceiptStep from "./remittance-receipt-step";
import { useTranslation } from "react-i18next";

const RemittanceWizard = () => {
  const { t } = useTranslation();
  const {
    step,
    quote,
    receipt,
    timeLeft,
    isCreatingQuote,
    isConfirming,
    handleGetQuote,
    handleConfirm,
    resetWizard,
  } = useRemittanceWizardViewModel();

  const STEPS = [
    { id: 1, label: t("remittance.step1.stepper") || "Calculate" },
    { id: 2, label: t("remittance.step2.stepper") || "Confirm" },
    { id: 3, label: t("remittance.step3.stepper") || "Success" },
  ];

  return (
    <div className="remittance-wizard">
      <div className="wizard-header">
        <h2>
          {t("remittance.wizard.title") || "International Money Transfer"}
        </h2>

        <div className="wizard-stepper">
          {STEPS.map((s) => (
            <div
              key={s.id + "step-id"}
              className={`step-item ${step >= s.id ? "active" : ""}`}
            >
              <div className="step-circle">{s.id}</div>
              <span className="step-label">{s.label}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="wizard-body">
        <div className="wizard-content">
          {step === 1 && (
            <RemittanceQuoteStep
              onSubmit={handleGetQuote}
              isLoading={isCreatingQuote}
            />
          )}
          {step === 2 && quote && (
            <RemittanceConfirmStep
              quote={quote}
              timeLeft={timeLeft}
              onConfirm={handleConfirm}
              isLoading={isConfirming}
            />
          )}
          {step === 3 && receipt && (
            <RemittanceReceiptStep
              receipt={receipt}
              onNewTransfer={resetWizard}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default RemittanceWizard;
