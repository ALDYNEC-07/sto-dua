"use client";

import { useEffect, useRef, useState } from "react";

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

// Что изменили: Добавили пороги для определения уверенного свайпа и фиксации оси жеста | Зачем: один свайп = один стабильный перелист без ложных срабатываний
const SWIPE_THRESHOLD_PX = 44;
const AXIS_LOCK_PX = 8;

export default function ChapterSection({ id, title, duas }: ChapterSectionProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const slideRefs = useRef<Array<HTMLElement | null>>([]);
  const scrollEndTimeoutRef = useRef<number | null>(null);
  const touchStartXRef = useRef(0);
  const touchStartYRef = useRef(0);
  const swipeStartIndexRef = useRef(0);
  const swipeAxisRef = useRef<"x" | "y" | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [trackHeight, setTrackHeight] = useState<number | null>(null);

  // Что изменили: Вынесли повторяющееся ограничение индекса в один helper | Зачем: убрать дубли и держать границы слайдов в одном месте
  const clampIndex = (index: number) => {
    const maxIndex = Math.max(duas.length - 1, 0);
    return Math.min(Math.max(index, 0), maxIndex);
  };

  // Что изменили: Вынесли сброс оси свайпа в helper | Зачем: избежать повторения одинаковой строки в нескольких ветках
  const resetSwipeAxis = () => {
    swipeAxisRef.current = null;
  };

  const clearScrollEndTimeout = () => {
    if (scrollEndTimeoutRef.current !== null) {
      window.clearTimeout(scrollEndTimeoutRef.current);
      scrollEndTimeoutRef.current = null;
    }
  };

  useEffect(() => {
    return () => clearScrollEndTimeout();
  }, []);

  useEffect(() => {
    const track = trackRef.current;
    const activeSlide = slideRefs.current[activeIndex];
    if (!track || !activeSlide) {
      return;
    }

    const updateHeight = () => {
      setTrackHeight(activeSlide.offsetHeight);
    };

    updateHeight();
    const observer = new ResizeObserver(updateHeight);
    observer.observe(activeSlide);

    return () => observer.disconnect();
  }, [activeIndex, duas.length]);

  const setActiveIndexFromScroll = () => {
    const track = trackRef.current;
    if (!track) {
      return;
    }

    const nextIndex = Math.round(track.scrollLeft / track.clientWidth);
    const boundedIndex = clampIndex(nextIndex);
    setActiveIndex(boundedIndex);
  };

  const scrollToIndex = (index: number) => {
    const track = trackRef.current;
    if (!track) {
      return;
    }

    const boundedIndex = clampIndex(index);
    track.scrollTo({ left: boundedIndex * track.clientWidth, behavior: "smooth" });
    setActiveIndex(boundedIndex);
  };

  const scrollOneSlide = (direction: -1 | 1) => {
    scrollToIndex(activeIndex + direction);
  };

  // Что изменили: Сдвинули обновление активного слайда на окончание скролла | Зачем: убрать дергания из-за частых промежуточных пересчетов во время инерции
  const handleTrackScroll = () => {
    clearScrollEndTimeout();
    scrollEndTimeoutRef.current = window.setTimeout(setActiveIndexFromScroll, 90);
  };

  // Что изменили: Реализовали контролируемый свайп на мобильных | Зачем: гарантировать максимум один переход за один жест
  const handleTouchStart: React.TouchEventHandler<HTMLDivElement> = (event) => {
    const touch = event.touches[0];
    if (!touch) {
      return;
    }

    touchStartXRef.current = touch.clientX;
    touchStartYRef.current = touch.clientY;
    swipeStartIndexRef.current = activeIndex;
    resetSwipeAxis();
  };

  const handleTouchMove: React.TouchEventHandler<HTMLDivElement> = (event) => {
    if (swipeAxisRef.current !== null) {
      return;
    }

    const touch = event.touches[0];
    if (!touch) {
      return;
    }

    const deltaX = Math.abs(touch.clientX - touchStartXRef.current);
    const deltaY = Math.abs(touch.clientY - touchStartYRef.current);
    if (deltaX < AXIS_LOCK_PX && deltaY < AXIS_LOCK_PX) {
      return;
    }

    swipeAxisRef.current = deltaX > deltaY ? "x" : "y";
  };

  const handleTouchEnd: React.TouchEventHandler<HTMLDivElement> = (event) => {
    const touch = event.changedTouches[0];
    if (!touch) {
      resetSwipeAxis();
      return;
    }

    if (swipeAxisRef.current !== "x") {
      resetSwipeAxis();
      return;
    }

    const deltaX = touch.clientX - touchStartXRef.current;
    if (Math.abs(deltaX) < SWIPE_THRESHOLD_PX) {
      scrollToIndex(swipeStartIndexRef.current);
      resetSwipeAxis();
      return;
    }

    const direction = deltaX < 0 ? 1 : -1;
    scrollToIndex(swipeStartIndexRef.current + direction);
    resetSwipeAxis();
  };

  const handleTouchCancel: React.TouchEventHandler<HTMLDivElement> = () => {
    resetSwipeAxis();
  };

  return (
    <section id={id} className="chapter" aria-labelledby={`${id}-title`}>
      <h2 id={`${id}-title`} className="chapter__title">
        {title}
      </h2>

      <div
        className="chapter__track"
        ref={trackRef}
        onScroll={handleTrackScroll}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onTouchCancel={handleTouchCancel}
        style={trackHeight ? { height: `${trackHeight}px` } : undefined}
      >
        {duas.map((dua, index) => {
          return (
            <article
              className="dua-slide"
              key={dua.id}
              ref={(node) => {
                slideRefs.current[index] = node;
              }}
            >
              <div className="dua-slide__panel">
                <p className="dua-slide__index">{dua.id}</p>
                <p className="dua-slide__arabic" lang="ar" dir="rtl">
                  {dua.arabic}
                </p>

                <p className="dua-slide__transliteration">{dua.transliteration}</p>

                <p className="dua-slide__translation">{dua.translation}</p>
              </div>
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
        >
          <span className="chapter__nav-chevron chapter__nav-chevron--left" aria-hidden="true" />
        </button>

        <button
          className="chapter__nav-btn"
          type="button"
          aria-label="Следующее дуа"
          onClick={() => scrollOneSlide(1)}
        >
          <span className="chapter__nav-chevron chapter__nav-chevron--right" aria-hidden="true" />
        </button>
      </div>
    </section>
  );
}
