import Image from "next/image";

export default function Home() {
  return (
    <main>
      <section className="hero">
        <Image
          src="/hero-dua.jpg"
          alt="STO DUA hero"
          fill
          priority
          className="hero__image"
          sizes="100vw"
        />
        <div className="hero__overlay" />
        <div className="hero__content">
          <h1>STO DUA</h1>
        </div>
      </section>
    </main>
  );
}
