import type { Metadata } from "next";
import "./globals.css";

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
    <html lang="en">
      <body>
        {/* Фиксированная шапка всегда остается видимой при прокрутке страницы */}
        <header className="site-header">
          <div className="site-header__inner">
            {/* Текстовый логотип проекта */}
            <div className="site-logo" aria-label="Brand logo">
              100 DUA
            </div>
            {/* Пока только визуальная кнопка-бургер из двух линий, без ссылок и меню */}
            <button
              className="burger-menu"
              type="button"
              aria-label="Open menu"
            >
              <span />
              <span />
            </button>
          </div>
        </header>
        {children}
      </body>
    </html>
  );
}
