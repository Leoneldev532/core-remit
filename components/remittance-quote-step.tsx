"use client";

import React, { useState, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { SEND_CURRENCIES, RECEIVE_CURRENCIES } from "../config/currencies";
import { useGetRates } from "../query/remittance-query";
import { REMITTANCE_POLICY } from "../config/policy";
import { calculateReceiveAmount } from "../logic/remittance-logic";
import { formatCurrency } from "../lib/utils/i18n-utils";
import { QuotePayload } from "../schemas/remittance-schema";

type Props = {
  onSubmit: (data: QuotePayload) => void;
  isLoading: boolean;
};

const ChevronDown = () => (
  <svg width="12" height="8" viewBox="0 0 12 8" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M1 1L6 6L11 1" stroke="#757575" strokeWidth="2" strokeLinecap="round"/>
  </svg>
);

const RemittanceQuoteStep = ({ onSubmit, isLoading }: Props) => {
  const { t, i18n } = useTranslation();
  const locale = i18n.language === "fr" ? "fr-FR" : "en-US";
  const { data: rates } = useGetRates();

  const [formData, setFormData] = useState({
    sendAmount: 100,
    sendCurrency: SEND_CURRENCIES[0].code,
    receiveCurrency: RECEIVE_CURRENCIES[0].code,
  });

  const selectedSendCurrency = useMemo(
    () => SEND_CURRENCIES.find((c) => c.code === formData.sendCurrency),
    [formData.sendCurrency],
  );

  const selectedReceiveCurrency = useMemo(
    () => RECEIVE_CURRENCIES.find((c) => c.code === formData.receiveCurrency),
    [formData.receiveCurrency],
  );

  const activeRate = useMemo(() => {
    return rates?.find((r) => r.currency === formData.receiveCurrency)?.rate || 0;
  }, [rates, formData.receiveCurrency]);

  const preview = useMemo(() => {
    const receiveAmount = calculateReceiveAmount(
      formData.sendAmount,
      activeRate,
      REMITTANCE_POLICY.fixedFee,
    );

    return {
      fee: REMITTANCE_POLICY.fixedFee,
      rate: activeRate,
      receiveAmount,
    };
  }, [formData.sendAmount, activeRate]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "sendAmount" ? parseFloat(value) || 0 : value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="remittance-quote-step">
      <form onSubmit={handleSubmit}>
        <div className="currency-input-group">
          <div className="currency-selector">
            <span className="flag">{selectedSendCurrency?.flag}</span>
            <span className="code">{selectedSendCurrency?.code}</span>
            <ChevronDown />
            <select
              name="sendCurrency"
              value={formData.sendCurrency}
              onChange={handleChange}
            >
              {SEND_CURRENCIES.map((c) => (
                <option key={c.code} value={c.code}>
                  {c.code}
                </option>
              ))}
            </select>
          </div>
          <input
            id="sendAmount"
            type="number"
            name="sendAmount"
            value={formData.sendAmount}
            onChange={handleChange}
            min={REMITTANCE_POLICY.minAmount}
            max={REMITTANCE_POLICY.maxAmount}
            required
          />
        </div>

        <div className="currency-input-group">
          <div className="currency-selector">
            <span className="flag">{selectedReceiveCurrency?.flag}</span>
            <span className="code">{selectedReceiveCurrency?.code}</span>
            <ChevronDown />
            <select
              name="receiveCurrency"
              value={formData.receiveCurrency}
              onChange={handleChange}
            >
              {RECEIVE_CURRENCIES.map((c) => (
                <option key={c.code + "code"} value={c.code}>
                  {c.code}
                </option>
              ))}
            </select>
          </div>
          <input
            readOnly
            type="text"
            value={preview.receiveAmount.toLocaleString(locale, {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          />
        </div>

        <div className="conversion-preview-box">
          <div>
            <span className="live-indicator">
              {t("remittance.step2.exchangeRate")}
            </span>
            <strong>
              1 {formData.sendCurrency} = {preview.rate.toFixed(4)}{" "}
              {formData.receiveCurrency}
            </strong>
          </div>
          <div>
            <span>{t("remittance.step2.fee")}</span>
            <strong>
              {formatCurrency(preview.fee, formData.sendCurrency, locale)}
            </strong>
          </div>
          <div className="total-to-pay">
            <span>{t("remittance.step2.receive")}</span>
            <strong>
              {formatCurrency(preview.receiveAmount, formData.receiveCurrency, locale)}
            </strong>
          </div>
        </div>

        <button
          type="submit"
          className="primary-btn"
          disabled={isLoading || formData.sendAmount <= 0}
        >
          {isLoading
            ? t("remittance.step1.calculating")
            : t("remittance.step1.button")}
        </button>
      </form>
    </div>
  );
};

export default RemittanceQuoteStep;
