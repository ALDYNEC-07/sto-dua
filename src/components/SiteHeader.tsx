"use client";

import { useState } from "react";
import styles from "./SiteHeader.module.css";

const chapterLinks = [
  { href: "/#dua-start", label: "О РАЕ И ЗАЩИТЕ ОТ АДА" },
  { href: "/#dua-forgiveness-mercy", label: "О ПРОЩЕНИИ И МИЛОСТИ" },
  { href: "/#dua-guidance-steadfastness", label: "О НАСТАВЛЕНИИ И СТОЙКОСТИ" },
  { href: "/#dua-good-this-world-hereafter", label: "О БЛАГЕ ЭТОГО И ВЕЧНОГО МИРА" },
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
    <>
      {isMenuOpen ? (
        <button
          className={styles.siteOverlay}
          type="button"
          aria-label="Закрыть меню"
          onClick={closeMenu}
        />
      ) : null}

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
    </>
  );
}
