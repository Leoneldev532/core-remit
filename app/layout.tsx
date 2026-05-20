import React from "react";
import { I18nProvider } from "../lib/i18n-provider";
import Providers from "./providers";
import "../styles/globals.scss";

export const metadata = {
  title: "Core-Remit | Secure International Money Transfer",
  description:
    "Experience lightning-fast, secure, and transparent cross-border remittances with real-time exchange rates and flat-fee pricing.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <I18nProvider>
          <Providers>{children}</Providers>
        </I18nProvider>
      </body>
    </html>
  );
}
