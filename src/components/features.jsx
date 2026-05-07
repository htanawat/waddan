import React, { useState, useEffect } from "react";
import Carousel from "react-bootstrap/Carousel";
import { LotusIcon } from "./icons";

export const Features = () => {
  const [highlight, setHighlight] = useState([]);

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

  return (
    <section id="features" className="features-section">
      <div className="features-section__glow" aria-hidden="true" />
      <div className="container" style={{ position: "relative", zIndex: 1 }}>
        <div className="features-header">
          <span className="features-header__eyebrow">
            <span className="features-header__eyebrow-line" />
            <span>Highlights</span>
            <span className="features-header__eyebrow-line" />
          </span>
          <h2 className="features-header__title">หน้าแรก</h2>
          <p className="features-header__subtitle">
            ประมวลภาพและข่าวสารสำคัญของวัดด่าน พระราม 3
          </p>
          <div className="features-header__divider" aria-hidden="true">
            <span className="dot" />
            <span className="line" />
            <LotusIcon size={20} />
            <span className="line" />
            <span className="dot" />
          </div>
        </div>

        <div className="row" style={{ width: "100%", margin: 0 }}>
          <Carousel fade interval={6000} indicators controls>
            {items.map((data, i) => (
              <Carousel.Item key={data?.timestamp || i}>
                <div className="features-slide">
                  <img
                    className="features-slide__img"
                    src={data?.data?.titleImageURL}
                    alt={data?.data?.title || ""}
                  />
                  <div className="features-slide__overlay" aria-hidden="true" />
                </div>
                <Carousel.Caption className="features-slide__caption">
                  <h3>{data?.data?.title}</h3>
                  <p>{data?.data?.caption}</p>
                </Carousel.Caption>
              </Carousel.Item>
            ))}
          </Carousel>
        </div>
      </div>
    </section>
  );
};
