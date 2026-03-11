import ChapterSection from "../components/ChapterSection";

const chapterOneDuas = [
  {
    id: 1,
    arabic: "اللَّهُمَّ إِنِّي أَسْأَلُكَ الْجَنَّةَ وَأَعُوذُ بِكَ مِنَ النَّارِ",
    transliteration:
      "«Алла́хумма, инни́ ас'алюка-ль-Джанната\nва а'узу бика мина-н-На́р(и)».",
    translation: "«О, Аллах! Прошу у Тебя Рая\nи прибегаю к Твоей защите от Ада».",
  },
  {
    id: 2,
    arabic: "رَبِّ ابْنِ لِي عِندَكَ بَيْتًا فِي الْجَنَّةِ",
    transliteration: "«Рабби-бни ли́ 'индака байтан фи-ль-Джаннат(и)».",
    translation: "«О, Господь! Возведи мне дом в Раю».",
  },
];

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
        id="dua-start"
        title="ИСПРАШИВАНИЕ У АЛЛАХА РАЯ И ЗАЩИТЫ ОТ АДА"
        duas={chapterOneDuas}
      />
    </main>
  );
}
