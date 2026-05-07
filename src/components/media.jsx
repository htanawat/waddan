import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { LotusIcon } from "./icons";

export const Media = () => {
  const [media, setMedia] = useState([]);

  useEffect(() => {
    fetch(
      "https://sycl7h5b43.execute-api.ap-southeast-1.amazonaws.com/admin/contents?type=media"
    )
      .then((res) => res.json())
      .then((data) => {
        data.forEach((dj) => {
          dj.data = JSON.parse(dj.data);
        });
        setMedia(data);
      });
  }, []);

  const items = media.filter((m) => m?.state === "active");

  return (
    <section id="media" className="cinematic-section cinematic-section--dark">
      <div className="container" style={{ position: "relative", zIndex: 1 }}>
        <div className="text-center">
          <span className="cinematic-eyebrow">Dharma &middot; Reflections</span>
          <h2 className="cinematic-title">สื่อธรรม</h2>
          <div className="section-ornament" aria-hidden="true">
            <span className="section-ornament__line" />
            <LotusIcon className="section-ornament__icon" size={22} />
            <span className="section-ornament__line" />
          </div>
          <p className="cinematic-subtitle" style={{ color: "rgba(251, 244, 230, 0.78)" }}>
            บทความและสื่อธรรมเพื่อการพิจารณา ฝึกฝนจิตใจ และดำเนินชีวิตตามวิถีพุทธ
          </p>
        </div>

        <div className="thai-grid">
          {items.map((item, i) => (
            <Link
              key={item?.timestamp || i}
              to={`media/${encodeURIComponent(item?.timestamp)}`}
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
