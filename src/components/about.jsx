import React, { useEffect, useState } from "react";
import AboutImage from "../assets/img/about.jpg";
import { LotusIcon } from "./icons";

export const About = (props) => {
  const [about, setAbout] = useState(null);

  useEffect(() => {
    fetch(
      `https://sycl7h5b43.execute-api.ap-southeast-1.amazonaws.com/content?type=about&id=${encodeURIComponent(
        "2024-05-18 23:27:32"
      )}`
    )
      .then((res) => res.json())
      .then((data) => {
        if (data.length === 1) {
          data[0].data = JSON.parse(data[0].data);
          setAbout(data[0]);
        }
      });
  }, []);

  return (
    <section id="aboutus" className="reveal" style={{ scrollMarginTop: "100px" }}>
      <div id="about">
        <div className="container">
          <div className="row" style={{ alignItems: "center" }}>
            <div className="col-12 col-md-6">
              <div style={{ position: "relative" }}>
                <img
                  src={AboutImage}
                  className="img-responsive"
                  alt="วัดด่าน พระราม 3"
                  loading="lazy"
                />
              </div>
            </div>
            <div className="col-12 col-md-6">
              <div className="about-text">
                <span
                  className="cinematic-eyebrow"
                  style={{ color: "var(--thai-gold-soft)" }}
                >
                  About the temple
                </span>
                <h2 style={{ fontFamily: "taviraj, serif" }}>รู้จักวัดด่าน</h2>
                <div
                  className="section-ornament"
                  aria-hidden="true"
                  style={{ margin: "0 0 24px", justifyContent: "flex-start", color: "var(--thai-gold)" }}
                >
                  <LotusIcon className="section-ornament__icon" size={20} />
                  <span className="section-ornament__line" />
                </div>
                <p style={{ fontFamily: "Prompt, chakra, sans-serif" }}>
                  {props.data ? (
                    <span
                      dangerouslySetInnerHTML={{
                        __html: about?.data?.contents?.[0],
                      }}
                    />
                  ) : (
                    "loading..."
                  )}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
