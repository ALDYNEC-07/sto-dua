export default function Home() {
  return (
    <main>
      {/* Что изменили: Убрали локальную картинку из hero | Зачем: теперь фон задается глобально для всего сайта через body */}
      <section className="hero">
        <div className="hero__overlay" />
        <div className="hero__content">
          <h1>STO DUA</h1>
        </div>
      </section>
    </main>
  );
}
