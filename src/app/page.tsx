import ChapterSection from "../components/ChapterSection";
import { chapterOne, chapterTwo } from "../data/chapters";

export default function Home() {
  return (
    <main>
      {/* Что изменили: Убрали локальную картинку из hero | Зачем: теперь фон задается глобально для всего сайта через body */}
      <section className="hero">
        <div className="hero__overlay" />
        <div className="hero__content">
          <h1 className="hero__title">100 ДУА</h1>
          <p className="hero__subtitle">ИЗ КОРАНА И СУННЫ</p>
        </div>
        <div className="hero__bottom">
          <div className="hero__bismillah">
            <p className="hero__bismillah-ar">بِسْمِ ٱللَّٰهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ</p>
            <p className="hero__bismillah-ru">
              Во имя Аллаха, Милостивого и Милосердного.
            </p>
          </div>
          <a className="hero__scroll-down" href="#dua-start" aria-label="Прокрутить вниз">
            <span className="hero__scroll-chevron" aria-hidden="true" />
          </a>
        </div>
      </section>

      <ChapterSection
        id={chapterOne.id}
        title={chapterOne.title}
        duas={chapterOne.duas}
      />

      <ChapterSection
        id={chapterTwo.id}
        title={chapterTwo.title}
        duas={chapterTwo.duas}
      />

      <footer className="site-status" aria-label="Статус проекта">
        <p className="site-status__text">Проект в разработке: пока загружены не все дуа.</p>
      </footer>
    </main>
  );
}
