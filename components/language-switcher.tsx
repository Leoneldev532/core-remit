"use client";

import React from "react";
import { useTranslation } from "react-i18next";

const LanguageSwitcher = () => {
  const { i18n } = useTranslation();

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
  };

  return (
    <div className="language-switcher">
      <button
        onClick={() => changeLanguage("en")}
        className={i18n.language === "en" ? "active" : ""}
      >
        English
      </button>
      <button
        onClick={() => changeLanguage("fr")}
        className={i18n.language === "fr" ? "active" : ""}
      >
        Français
      </button>
    </div>
  );
};

export default LanguageSwitcher;
