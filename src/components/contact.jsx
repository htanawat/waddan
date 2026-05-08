import React, { useEffect, useState } from "react";
import { LotusIcon, PhoneIcon, PinIcon } from "./icons";

const address = [
  "เลขที่ 872 ถนนพระราม 3 ซอย 34",
  "แขวงบางโพงพาง เขตยานนาวา กรุงเทพมหานคร",
];

export const Contact = () => {
  const [contact, setContact] = useState(null);

  useEffect(() => {
    fetch(
      `https://sycl7h5b43.execute-api.ap-southeast-1.amazonaws.com/content?type=contact&id=${encodeURIComponent(
        "2024-05-18 23:27:32"
      )}`
    )
      .then((res) => res.json())
      .then((data) => {
        if (data.length === 1) {
          data[0].data = JSON.parse(data[0].data);
          setContact(data[0]);
        }
      });
  }, []);

  const phones = (contact?.data?.contents || [])
    .map((raw) => {
      try {
        return JSON.parse(raw);
      } catch (e) {
        return null;
      }
    })
    .filter(Boolean);

  return (
    <section id="contact" className="contact-section reveal">
      <div className="container">
        <div className="text-center" style={{ marginBottom: 56 }}>
          <span className="cinematic-eyebrow">Get in touch</span>
          <h2 className="cinematic-title">ติดต่อสอบถาม</h2>
          <div className="section-ornament" aria-hidden="true">
            <span className="section-ornament__line" />
            <LotusIcon className="section-ornament__icon" size={22} />
            <span className="section-ornament__line" />
          </div>
        </div>

        <div className="contact-grid">
          <aside className="contact-info-card">
            <div className="contact-info-card__head">
              <div className="contact-info-card__icon" aria-hidden="true">
                <PinIcon size={20} />
              </div>
              <div>
                <span className="contact-info-card__label">ที่อยู่</span>
                <h3 className="contact-info-card__title">วัดด่าน พระราม 3</h3>
              </div>
            </div>
            <div className="contact-info-card__address">
              {address.map((line, i) => (
                <p key={i}>{line}</p>
              ))}
            </div>

            {phones.length > 0 && (
              <>
                <div className="contact-info-card__rule" aria-hidden="true" />
                <div className="contact-info-card__phones">
                  <span className="contact-info-card__label">โทรศัพท์</span>
                  <ul>
                    {phones.map((c, i) => (
                      <li key={i}>
                        <PhoneIcon size={14} />
                        <span className="phone-name">{c.name}</span>
                        <span className="phone-num">{c.phone}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </>
            )}
          </aside>

          <div className="contact-map-card">
            <iframe
              title="แผนที่วัดด่าน พระราม 3"
              src="https://www.google.com/maps/embed/v1/place?q=วัดด่าน&key=AIzaSyBFw0Qbyq9zTFTd-tUY6dZWTgaQzuU17R8"
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>
      </div>

      <footer className="site-footer" role="contentinfo">
        <div className="site-footer__top" aria-hidden="true">
          <span className="site-footer__rule" />
          <LotusIcon size={20} />
          <span className="site-footer__rule" />
        </div>
        <div className="container site-footer__inner">
          <div className="site-footer__brand">
            <span className="site-footer__brand-name">วัดด่าน พระราม 3</span>
            <span className="site-footer__brand-sub">
              Wat Dan &middot; Rama III &middot; Bangkok
            </span>
          </div>
          <div className="site-footer__meta">
            <span>&copy; {new Date().getFullYear()} วัดด่าน พระราม 3</span>
            <span className="site-footer__dot" aria-hidden="true">&middot;</span>
            <span>
              Design by{" "}
              <span className="site-footer__credit">ธนาวัฒน์ ฮ้อศิริมานนท์</span>
            </span>
          </div>
        </div>
      </footer>
    </section>
  );
};
