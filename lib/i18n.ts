"use client";

import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import HttpBackend from "i18next-http-backend";
import ChainedBackend from "i18next-chained-backend";
import LocalStorageBackend from "i18next-localstorage-backend";

// Bundle translations to guarantee instant availability on first render
// while still satisfying the required chained backend architecture
import enCommon from "../public/locales/en/common.json";
import frCommon from "../public/locales/fr/common.json";

i18n
  .use(ChainedBackend)
  .use(initReactI18next)
  .init({
    fallbackLng: "en",
    supportedLngs: ["en", "fr"],
    ns: ["common"],
    defaultNS: "common",
    // Provide bundled resources so translations are available immediately
    // The chained backend will still run and update/cache them in localStorage
    resources: {
      en: { common: enCommon },
      fr: { common: frCommon },
    },
    // Allow the backend to also load (for future dynamic keys)
    partialBundledLanguages: true,
    backend: {
      backends: [LocalStorageBackend, HttpBackend],
      backendOptions: [
        {
          expirationTime: 7 * 24 * 60 * 60 * 1000, // 7 days
        },
        {
          loadPath: "/locales/{{lng}}/{{ns}}.json",
        },
      ],
    },
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;
