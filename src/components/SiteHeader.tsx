"use client";

import { useState } from "react";
import styles from "./SiteHeader.module.css";

const chapterLinks = [
  { href: "/#dua-start", label: "Глава 1" },
  { href: "/#dua-forgiveness-mercy", label: "Глава 2" },
  { href: "/#dua-guidance-steadfastness", label: "Глава 3" },
];

export default function SiteHeader() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen((prevState) => !prevState);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  return (
    <header className={styles.siteHeader}>
      <div className={styles.siteHeaderInner}>
        <div className={styles.siteLogo} aria-label="Brand logo">
          DUA
        </div>
        <button
          className={styles.burgerMenu}
          type="button"
          aria-label={isMenuOpen ? "Закрыть меню" : "Открыть меню"}
          aria-expanded={isMenuOpen}
          aria-controls="site-menu"
          onClick={toggleMenu}
        >
          <span />
          <span />
        </button>
      </div>
      <nav
        id="site-menu"
        className={`${styles.siteMenu} ${isMenuOpen ? styles.siteMenuOpen : ""}`}
        aria-label="Навигация по главам"
      >
        {chapterLinks.map((chapterLink) => {
          return (
            <a
              key={chapterLink.href}
              className={styles.siteMenuLink}
              href={chapterLink.href}
              onClick={closeMenu}
            >
              {chapterLink.label}
            </a>
          );
        })}
      </nav>
    </header>
  );
}
