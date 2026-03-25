"use client";

import { useEffect, useRef, useState } from "react";
import { useDisplaySettings } from "./DisplaySettingsProvider";
import type { Chapter } from "../types";

type ChapterSectionProps = Chapter;

// Изменено: добавлен компонент SlidingDots | Зачем: при 40+ дуа все точки не помещаются на мобильном экране — показываем окно из 5 точек с плавным скольжением
const MAX_VISIBLE_DOTS = 5;
const DOT_SIZE = 8;
const DOT_GAP = 8;

function SlidingDots({
  total,
  activeIndex,
  onDotClick,
}: {
  total: number;
  activeIndex: number;
  onDotClick: (index: number) => void;
}) {
  const useSlidingMode = total > MAX_VISIBLE_DOTS;
  const dotStep = DOT_SIZE + DOT_GAP;

  if (!useSlidingMode) {
    return (
      <div className="chapter__dots" role="group" aria-label="Навигация по дуа">
        {Array.from({ length: total }, (_, index) => (
          <button
            key={index}
            className={`chapter__dot ${index === activeIndex ? "chapter__dot--active" : ""}`}
            type="button"
            aria-label={`Дуа ${index + 1} из ${total}`}
            aria-current={index === activeIndex ? "true" : undefined}
            onClick={() => onDotClick(index)}
          />
        ))}
      </div>
    );
  }

  const containerWidth = MAX_VISIBLE_DOTS * DOT_SIZE + (MAX_VISIBLE_DOTS - 1) * DOT_GAP;
  const totalTrackWidth = total * DOT_SIZE + (total - 1) * DOT_GAP;
  const centerOffset = containerWidth / 2;
  const activeDotCenter = activeIndex * dotStep + DOT_SIZE / 2;
  const rawTranslate = centerOffset - activeDotCenter;
  const clampedTranslate = Math.min(0, Math.max(containerWidth - totalTrackWidth, rawTranslate));

  return (
    <div
      className="chapter__dots chapter__dots--sliding"
      role="group"
      aria-label="Навигация по дуа"
      style={{ maxWidth: containerWidth, overflow: "hidden" }}
    >
      <div
        className="chapter__dots-track"
        style={{
          display: "flex",
          gap: DOT_GAP,
          transform: `translateX(${clampedTranslate}px)`,
          transition: "transform 200ms ease",
        }}
      >
        {Array.from({ length: total }, (_, index) => {
          const dotCenter = index * dotStep + DOT_SIZE / 2;
          const posInContainer = dotCenter + clampedTranslate;
          const distFromCenter = Math.abs(posInContainer - centerOffset) / dotStep;
          let scale = 1;
          let opacity = 1;
          if (distFromCenter > 2.5) {
            scale = 0;
            opacity = 0;
          } else if (distFromCenter > 1.5) {
            scale = 0.5;
            opacity = 0.3;
          }

          return (
            <button
              key={index}
              className={`chapter__dot ${index === activeIndex ? "chapter__dot--active" : ""}`}
              type="button"
              aria-label={`Дуа ${index + 1} из ${total}`}
              aria-current={index === activeIndex ? "true" : undefined}
              onClick={() => onDotClick(index)}
              style={{
                transform: `scale(${index === activeIndex ? 1 : scale})`,
                opacity: index === activeIndex ? 1 : opacity,
                transition: "transform 200ms ease, opacity 200ms ease",
              }}
            />
          );
        })}
      </div>
    </div>
  );
}

// Что изменили: Добавили пороги для определения уверенного свайпа и фиксации оси жеста | Зачем: один свайп = один стабильный перелист без ложных срабатываний
const SWIPE_THRESHOLD_PX = 44;
const AXIS_LOCK_PX = 8;

export default function ChapterSection({ id, title, duas }: ChapterSectionProps) {
  const { showTransliteration } = useDisplaySettings();
  const trackRef = useRef<HTMLDivElement>(null);
  const scrollEndTimeoutRef = useRef<number | null>(null);
  const touchStartXRef = useRef(0);
  const touchStartYRef = useRef(0);
  const swipeStartIndexRef = useRef(0);
  const swipeAxisRef = useRef<"x" | "y" | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);

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

  const handleKeyDown: React.KeyboardEventHandler<HTMLDivElement> = (event) => {
    if (event.key === "ArrowLeft") {
      event.preventDefault();
      scrollOneSlide(-1);
    } else if (event.key === "ArrowRight") {
      event.preventDefault();
      scrollOneSlide(1);
    }
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

      {/* Изменено: добавлены role="region" и aria-roledescription | Зачем: скринридеры объявляют этот блок как карусель */}
      <div
        className="chapter__track"
        ref={trackRef}
        tabIndex={0}
        role="region"
        aria-roledescription="карусель"
        aria-label={`Дуа из главы: ${title}`}
        onKeyDown={handleKeyDown}
        onScroll={handleTrackScroll}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onTouchCancel={handleTouchCancel}
      >
        {duas.map((dua, index) => {
          return (
            <article className="dua-slide" key={dua.id}>
              <div className="dua-slide__panel">
                <p className="dua-slide__index">
                  {index + 1}/{duas.length}
                </p>
                {/* Что изменили: Вынесли текст дуа в отдельную прокручиваемую область | Зачем: фиксированная карточка без скачков высоты и удобное чтение длинных дуа */}
                <div className="dua-slide__content">
                  <p className="dua-slide__arabic" lang="ar" dir="rtl">
                    {dua.arabic}
                  </p>

                  {showTransliteration ? (
                    <p className="dua-slide__transliteration">{dua.transliteration}</p>
                  ) : null}

                  <p className="dua-slide__translation">{dua.translation}</p>
                </div>
              </div>
            </article>
          );
        })}
      </div>

      {/* Изменено: скользящие точки (макс. 5 видимых) | Зачем: при 40+ дуа точки не помещались на экран и вызывали горизонтальный overflow, ломая position: fixed у шапки в Яндекс Браузере */}
      <SlidingDots
        total={duas.length}
        activeIndex={activeIndex}
        onDotClick={scrollToIndex}
      />
    </section>
  );
}
