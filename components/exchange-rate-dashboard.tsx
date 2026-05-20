"use client";

import React from "react";
import { useExchangeRateViewModel } from "../hooks/use-exchange-rate-view-model";
import ExchangeRateTable from "./exchange-rate-table";
import { useTranslation } from "react-i18next";

const ExchangeRateDashboard = () => {
  const { t } = useTranslation();
  const { rates, isLoading, isError } = useExchangeRateViewModel();

  if (isLoading) return <div>{t("remittance.dashboard.loading")}</div>;
  if (isError) return <div>{t("remittance.dashboard.error")}</div>;

  return (
    <div className="exchange-rate-dashboard">
      <h2>{t("remittance.dashboard.title")}</h2>
      <ExchangeRateTable rates={rates || []} />
    </div>
  );
};

export default ExchangeRateDashboard;
