import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Core Remit",
  description: "Core Remit App Router Project",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
