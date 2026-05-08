import React, { useState } from "react";
import { Link } from "react-router-dom";
import { ChevronRightIcon } from "./icons";

const Skeleton = ({ count = 3 }) =>
  Array.from({ length: count }).map((_, i) => (
    <div className="thai-card-skeleton" key={`sk-${i}`} aria-hidden="true">
      <div className="thai-card-skeleton__media" />
      <div className="thai-card-skeleton__body">
        <div className="thai-card-skeleton__line" />
        <div className="thai-card-skeleton__line thai-card-skeleton__line--short" />
        <div className="thai-card-skeleton__line thai-card-skeleton__line--cta" />
      </div>
    </div>
  ));

export const CardGrid = ({ items, basePath, loading, initialCount = 6 }) => {
  const [showAll, setShowAll] = useState(false);

  if (loading) {
    return (
      <div className="thai-grid">
        <Skeleton count={6} />
      </div>
    );
  }

  const total = items.length;
  const hasMore = total > initialCount;
  const visibleItems = showAll || !hasMore ? items : items.slice(0, initialCount);

  return (
    <>
      <div className="thai-grid">
        {visibleItems.map((item, i) => (
          <Link
            key={item?.timestamp || i}
            to={`${basePath}/${encodeURIComponent(item?.timestamp)}`}
            className={`thai-card ${i === 0 ? "thai-card--featured" : ""}`}
            style={{ animationDelay: `${Math.min(i, 8) * 60}ms` }}
          >
            <div className="thai-card__media">
              {item?.data?.titleImageURL && (
                <img
                  src={item.data.titleImageURL}
                  alt={item?.data?.title || ""}
                  loading={i === 0 ? "eager" : "lazy"}
                  width={i === 0 ? "1600" : "800"}
                  height={i === 0 ? "900" : "600"}
                />
              )}
            </div>
            <div className="thai-card__body">
              <h3 className="thai-card__title">{item?.data?.title}</h3>
              <p className="thai-card__caption">{item?.data?.caption}</p>
              <span className="thai-card__cta">อ่านต่อ</span>
            </div>
          </Link>
        ))}
      </div>

      {hasMore && (
        <div className="thai-grid-action">
          <button
            type="button"
            className="btn-thai-outline"
            onClick={() => setShowAll((v) => !v)}
            aria-expanded={showAll}
          >
            <span>
              {showAll ? "แสดงน้อยลง" : `ดูทั้งหมด`}
              <span className="btn-thai-outline__count">
                {showAll ? "" : ` (${total})`}
              </span>
            </span>
            <ChevronRightIcon size={18} />
          </button>
        </div>
      )}
    </>
  );
};
