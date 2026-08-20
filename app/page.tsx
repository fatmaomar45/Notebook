import Link from "next/link";
import styles from "./page.module.css";

export default function Home() {
  return (
    <main className={styles.main}>
      <div className={styles.container}>
        <h1 className={`${styles.heading}`}>
          KARAGUL&apos;S WRITINGS
        </h1>
        <p className={styles.subtitle}>
          Write your thoughts, dreams and ideas
        </p>
        <div className={styles.buttons}>
          <Link
            href="/notes/new"
            className={`${styles.button} ${styles.buttonPrimary}`}
          >
            + New Note
          </Link>
          <Link
            href="/track"
            className={`${styles.button} ${styles.buttonSecondary}`}
          >
            Track Writings
          </Link>
        </div>
      </div>
    </main>
  );
}
