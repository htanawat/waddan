import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { LotusIcon } from "./icons";

export const Services = () => {
  const [activities, setActivities] = useState([]);

  useEffect(() => {
    fetch(
      "https://sycl7h5b43.execute-api.ap-southeast-1.amazonaws.com/admin/contents?type=activity"
    )
      .then((res) => res.json())
      .then((data) => {
        data.forEach((dj) => {
          dj.data = JSON.parse(dj.data);
        });
        setActivities(data);
      });
  }, []);

  const items = activities.filter((a) => a?.state === "active");

  return (
    <section id="activities" className="cinematic-section cinematic-section--light">
      <div className="container" style={{ position: "relative", zIndex: 1 }}>
        <div className="text-center">
          <span className="cinematic-eyebrow">News &middot; Events</span>
          <h2 className="cinematic-title">ข่าวและกิจกรรม</h2>
          <div className="section-ornament" aria-hidden="true">
            <span className="section-ornament__line" />
            <LotusIcon className="section-ornament__icon" size={22} />
            <span className="section-ornament__line" />
          </div>
          <p className="cinematic-subtitle">
            ติดตามข่าวสารและกิจกรรมทางพระพุทธศาสนา ประเพณีและพิธีสำคัญของวัดด่าน พระราม 3
          </p>
        </div>

        <div className="thai-grid">
          {items.map((item, i) => (
            <Link
              key={item?.timestamp || i}
              to={`activities/${encodeURIComponent(item?.timestamp)}`}
              className="thai-card"
              style={{ animationDelay: `${Math.min(i, 8) * 60}ms` }}
            >
              <div className="thai-card__media">
                {item?.data?.titleImageURL && (
                  <img
                    src={item.data.titleImageURL}
                    alt={item?.data?.title || ""}
                    loading="lazy"
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
      </div>
    </section>
  );
};
