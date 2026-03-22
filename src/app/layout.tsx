import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";
import { DisplaySettingsProvider } from "../components/DisplaySettingsProvider";
import SiteHeader from "../components/SiteHeader";

const SITE_URL = "https://sto-dua.vercel.app";
const SITE_TITLE = "100 ДУА — из Корана и Сунны";
const SITE_DESCRIPTION =
  "Сборник из 100 дуа (мольб) из Корана и Сунны с арабским текстом, транскрипцией и переводом на русский язык.";

export const metadata: Metadata = {
  title: SITE_TITLE,
  description: SITE_DESCRIPTION,
  metadataBase: new URL(SITE_URL),
  openGraph: {
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    url: SITE_URL,
    siteName: "STO DUA",
    locale: "ru_RU",
    type: "website",
    images: [
      {
        url: "/hero-dua.jpg",
        width: 1200,
        height: 630,
        alt: "100 ДУА — из Корана и Сунны",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    images: ["/hero-dua.jpg"],
  },
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
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
        <Analytics />
      </body>
    </html>
  );
}
