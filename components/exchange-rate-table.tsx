"use client";

import React, { useEffect, useState } from "react";
import { CurrencyRate } from "../types/remittance";
import { useTranslation } from "react-i18next";

type Props = {
  rates: CurrencyRate[];
};

const ExchangeRateTable = ({ rates }: Props) => {
  const { t } = useTranslation();
  const [flash, setFlash] = useState<Record<string, "up" | "down" | null>>({});

  // Compare current vs previous rate to determine flash direction (green/red)
  useEffect(() => {
    const newFlash: Record<string, "up" | "down" | null> = {};
    rates.forEach((rate) => {
      if (rate.rate > rate.previousRate) newFlash[rate.currency] = "up";
      else if (rate.rate < rate.previousRate) newFlash[rate.currency] = "down";
    });
    setFlash(newFlash);

    // Clear flash after 1s so the animation plays once per poll cycle
    const timer = setTimeout(() => setFlash({}), 1000);
    return () => clearTimeout(timer);
  }, [rates]);

  return (
    <table className="exchange-rate-table">
      <thead>
        <tr>
          <th>{t("remittance.dashboard.currencyPair")}</th>
          <th>{t("remittance.dashboard.rate")}</th>
        </tr>
      </thead>
      <tbody>
        {rates.map((rate) => (
          <tr
            key={rate.currency + "rate"}
            className={
              flash[rate.currency] ? `flash-${flash[rate.currency]}` : ""
            }
          >
            <td>1 USD → {rate.currency}</td>
            <td>{rate.rate.toFixed(4)}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default ExchangeRateTable;
