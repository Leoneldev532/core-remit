"use client";

import React from "react";
import { useTranslation } from "react-i18next";
import ExchangeRateDashboard from "../components/exchange-rate-dashboard";
import RemittanceWizard from "../components/remittance-wizard";
import LanguageSwitcher from "../components/language-switcher";

export default function Home() {
  const { t } = useTranslation();

  return (
    <main className="main-container">
      <header className="page-header">
        <div className="header-content">
          <h1>{t("remittance.title")}</h1>
          <LanguageSwitcher />
        </div>
      </header>

      <div className="remittance-layout">
        <div className="layout-grid">
          <ExchangeRateDashboard />
          <RemittanceWizard />
        </div>
      </div>
    </main>
  );
}
