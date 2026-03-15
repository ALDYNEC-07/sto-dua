import type { Metadata } from "next";
import "./globals.css";
import { DisplaySettingsProvider } from "../components/DisplaySettingsProvider";
import SiteHeader from "../components/SiteHeader";

export const metadata: Metadata = {
  title: "STO DUA",
  description: "New website",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru">
      <body>
        <div className="site-background" aria-hidden="true" />
        <DisplaySettingsProvider>
          <SiteHeader />
          {children}
        </DisplaySettingsProvider>
      </body>
    </html>
  );
}
