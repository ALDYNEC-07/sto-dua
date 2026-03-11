import styles from "./SiteHeader.module.css";

export default function SiteHeader() {
  return (
    <header className={styles.siteHeader}>
      <div className={styles.siteHeaderInner}>
        <div className={styles.siteLogo} aria-label="Brand logo">
          DUA
        </div>
        <button className={styles.burgerMenu} type="button" aria-label="Open menu">
          <span />
          <span />
        </button>
      </div>
    </header>
  );
}
