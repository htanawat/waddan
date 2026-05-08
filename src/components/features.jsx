import React, { useState, useEffect, useRef, useCallback } from "react";
import { LotusIcon, ChevronLeftIcon, ChevronRightIcon } from "./icons";

const AUTO_INTERVAL = 6500;

export const Features = () => {
  const [highlight, setHighlight] = useState([]);
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const timerRef = useRef(null);

  useEffect(() => {
    fetch(
      "https://sycl7h5b43.execute-api.ap-southeast-1.amazonaws.com/admin/contents?type=highlight"
    )
      .then((res) => res.json())
      .then((data) => {
        data.forEach((dj) => {
          dj.data = JSON.parse(dj.data);
        });
        setHighlight(data);
      });
  }, []);

  const items = highlight.filter((h) => h?.state === "active");
  const total = items.length;

  const next = useCallback(() => {
    setIndex((i) => (total === 0 ? 0 : (i + 1) % total));
  }, [total]);
  const prev = useCallback(() => {
    setIndex((i) => (total === 0 ? 0 : (i - 1 + total) % total));
  }, [total]);

  // Clamp index when items change
  useEffect(() => {
    if (total > 0 && index >= total) setIndex(0);
  }, [total, index]);

  // Auto-advance
  useEffect(() => {
    if (paused || total <= 1) return;
    timerRef.current = setTimeout(next, AUTO_INTERVAL);
    return () => clearTimeout(timerRef.current);
  }, [index, paused, total, next]);

  // Keyboard navigation
  const onKeyDown = (e) => {
    if (e.key === "ArrowLeft") prev();
    else if (e.key === "ArrowRight") next();
  };

  if (total === 0) {
    return (
      <section id="features" className="features-section reveal">
        <div className="features-section__glow" aria-hidden="true" />
        <div className="container" style={{ position: "relative", zIndex: 1 }}>
          <div className="hl-frame hl-frame--empty" aria-hidden="true" />
        </div>
      </section>
    );
  }

  const counter = `${String(index + 1).padStart(2, "0")} / ${String(total).padStart(2, "0")}`;

  return (
    <section id="features" className="features-section reveal">
      <div className="features-section__glow" aria-hidden="true" />
      <div className="container" style={{ position: "relative", zIndex: 1 }}>
        <div
          className="hl"
          tabIndex={0}
          role="region"
          aria-roledescription="carousel"
          aria-label="ภาพไฮไลต์ของวัดด่าน พระราม 3"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
          onFocus={() => setPaused(true)}
          onBlur={() => setPaused(false)}
          onKeyDown={onKeyDown}
        >
          <div className="hl-frame">
            <div className="hl-stage">
              {items.map((item, i) => (
                <div
                  key={item?.timestamp || i}
                  className={`hl-slide ${i === index ? "is-active" : ""}`}
                  aria-hidden={i !== index}
                >
                  {item?.data?.titleImageURL && (
                    <img
                      className="hl-slide__img"
                      src={item.data.titleImageURL}
                      alt={item?.data?.title || ""}
                      loading={i === 0 ? "eager" : "lazy"}
                      width="1600"
                      height="900"
                    />
                  )}
                  <div className="hl-slide__veil" aria-hidden="true" />
                </div>
              ))}
            </div>

            <button
              type="button"
              className="hl-arrow hl-arrow--prev"
              onClick={prev}
              aria-label="ภาพก่อนหน้า"
              disabled={total <= 1}
            >
              <ChevronLeftIcon size={22} />
            </button>
            <button
              type="button"
              className="hl-arrow hl-arrow--next"
              onClick={next}
              aria-label="ภาพถัดไป"
              disabled={total <= 1}
            >
              <ChevronRightIcon size={22} />
            </button>

            <div className="hl-caption" aria-live="polite">
              <div className="hl-caption__ornament" aria-hidden="true">
                <LotusIcon size={14} />
              </div>
              <h3 className="hl-caption__title">
                {items[index]?.data?.title}
              </h3>
              {items[index]?.data?.caption && (
                <p className="hl-caption__text">
                  {items[index].data.caption}
                </p>
              )}
            </div>

            <div className="hl-counter" aria-hidden="true">
              {counter}
            </div>
          </div>

          <div className="hl-dots" role="tablist" aria-label="เลือกภาพไฮไลต์">
            {items.map((_, i) => (
              <button
                type="button"
                key={i}
                role="tab"
                aria-selected={i === index}
                aria-label={`ภาพที่ ${i + 1}`}
                className={`hl-dot ${i === index ? "is-active" : ""}`}
                onClick={() => setIndex(i)}
              >
                <span className="hl-dot__fill" />
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
