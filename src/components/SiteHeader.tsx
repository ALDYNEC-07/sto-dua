"use client";

import { useState } from "react";
import { useDisplaySettings } from "./DisplaySettingsProvider";
import styles from "./SiteHeader.module.css";

const chapterLinks = [
  { href: "/#dua-start", label: "О РАЕ И ЗАЩИТЕ ОТ АДА" },
  { href: "/#dua-forgiveness-mercy", label: "О ПРОЩЕНИИ И МИЛОСТИ" },
  { href: "/#dua-guidance-steadfastness", label: "О НАСТАВЛЕНИИ И СТОЙКОСТИ" },
  { href: "/#dua-good-this-world-hereafter", label: "О БЛАГЕ ЭТОГО И ВЕЧНОГО МИРА" },
];

export default function SiteHeader() {
  const { showTransliteration, setShowTransliteration } = useDisplaySettings();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen((prevState) => {
      const nextState = !prevState;
      if (nextState) {
        setIsSettingsOpen(false);
      }
      return nextState;
    });
  };

  const toggleSettings = () => {
    setIsSettingsOpen((prevState) => {
      const nextState = !prevState;
      if (nextState) {
        setIsMenuOpen(false);
      }
      return nextState;
    });
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
    setIsSettingsOpen(false);
  };

  return (
    <>
      {isMenuOpen || isSettingsOpen ? (
        <button
          className={styles.siteOverlay}
          type="button"
          aria-label="Закрыть панель"
          onClick={closeMenu}
        />
      ) : null}

      <header className={styles.siteHeader}>
        <div className={styles.siteHeaderInner}>
          <div className={styles.siteLogo} aria-label="Brand logo">
            DUA
          </div>
          <div className={styles.siteActions}>
            <button
              className={`${styles.iconButton} ${styles.settingsButton}`}
              type="button"
              aria-label={isSettingsOpen ? "Закрыть настройки" : "Открыть настройки"}
              aria-expanded={isSettingsOpen}
              aria-controls="site-settings"
              onClick={toggleSettings}
            >
              <img
                className={styles.settingsIcon}
                src="/settihgs.svg"
                alt=""
                aria-hidden="true"
              />
            </button>
            <button
              className={`${styles.iconButton} ${styles.burgerMenu}`}
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
        </div>
        <section
          id="site-settings"
          className={`${styles.siteSettings} ${isSettingsOpen ? styles.siteSettingsOpen : ""}`}
          aria-label="Настройки отображения"
        >
          <label className={styles.settingsRow}>
            <span className={styles.settingsText}>Показывать транскрипцию</span>
            <span className={styles.switch}>
              <input
                className={styles.switchInput}
                type="checkbox"
                checked={showTransliteration}
                onChange={(event) => setShowTransliteration(event.target.checked)}
              />
              <span className={styles.switchTrack} aria-hidden="true">
                <span className={styles.switchThumb} />
              </span>
            </span>
          </label>
        </section>
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
