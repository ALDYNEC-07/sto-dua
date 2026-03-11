"use client";

import { useEffect, useRef } from "react";

type Dua = {
  id: number;
  arabic: string;
  transliteration: string;
  translation: string;
};

type ChapterSectionProps = {
  id: string;
  title: string;
  duas: Dua[];
};

const HOLD_DELAY_MS = 220;
const HOLD_INTERVAL_MS = 70;
const HOLD_STEP_PX = 34;

export default function ChapterSection({ id, title, duas }: ChapterSectionProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const holdDelayRef = useRef<number | null>(null);
  const holdIntervalRef = useRef<number | null>(null);

  const clearHold = () => {
    if (holdDelayRef.current !== null) {
      window.clearTimeout(holdDelayRef.current);
      holdDelayRef.current = null;
    }
    if (holdIntervalRef.current !== null) {
      window.clearInterval(holdIntervalRef.current);
      holdIntervalRef.current = null;
    }
  };

  useEffect(() => {
    return () => clearHold();
  }, []);

  const scrollOneSlide = (direction: -1 | 1) => {
    const track = trackRef.current;
    if (!track) {
      return;
    }
    track.scrollBy({ left: direction * track.clientWidth, behavior: "smooth" });
  };

  const startHoldScroll = (direction: -1 | 1) => {
    clearHold();
    holdDelayRef.current = window.setTimeout(() => {
      holdIntervalRef.current = window.setInterval(() => {
        trackRef.current?.scrollBy({ left: direction * HOLD_STEP_PX, behavior: "auto" });
      }, HOLD_INTERVAL_MS);
    }, HOLD_DELAY_MS);
  };

  return (
    <section id={id} className="chapter" aria-labelledby={`${id}-title`}>
      <h2 id={`${id}-title`} className="chapter__title">
        {title}
      </h2>

      <div className="chapter__track" ref={trackRef}>
        {duas.map((dua) => {
          return (
            <article className="dua-slide" key={dua.id}>
              <p className="dua-slide__index">{dua.id}</p>
              <p className="dua-slide__arabic" lang="ar" dir="rtl">
                {dua.arabic}
              </p>

              <p className="dua-slide__transliteration">{dua.transliteration}</p>

              <p className="dua-slide__translation">{dua.translation}</p>
            </article>
          );
        })}
      </div>

      <div className="chapter__nav">
        <button
          className="chapter__nav-btn"
          type="button"
          aria-label="Предыдущее дуа"
          onClick={() => scrollOneSlide(-1)}
          onPointerDown={() => startHoldScroll(-1)}
          onPointerUp={clearHold}
          onPointerLeave={clearHold}
          onPointerCancel={clearHold}
        >
          <span className="chapter__nav-chevron chapter__nav-chevron--left" aria-hidden="true" />
        </button>

        <button
          className="chapter__nav-btn"
          type="button"
          aria-label="Следующее дуа"
          onClick={() => scrollOneSlide(1)}
          onPointerDown={() => startHoldScroll(1)}
          onPointerUp={clearHold}
          onPointerLeave={clearHold}
          onPointerCancel={clearHold}
        >
          <span className="chapter__nav-chevron chapter__nav-chevron--right" aria-hidden="true" />
        </button>
      </div>
    </section>
  );
}
