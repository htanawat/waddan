import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import { Navigation } from "../components/navigation";
import { ArrowLeftIcon, LotusIcon } from "./icons";

export const ContentServices = () => {
  const [content, setContent] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [modalImageURL, setModalImageURL] = useState("");

  const isMedia = window.location.pathname.includes("/media/");
  const sectionLabel = isMedia ? "สื่อธรรม" : "ข่าวและกิจกรรม";
  const sectionAnchor = isMedia ? "/#media" : "/#activities";

  useEffect(() => {
    const contentId = window.location.pathname.split("/").splice(-1, 1)[0];
    const contentType = isMedia ? "media" : "activity";
    fetch(
      `https://sycl7h5b43.execute-api.ap-southeast-1.amazonaws.com/content?type=${contentType}&id=${contentId}`
    )
      .then((res) => res.json())
      .then((data) => {
        if (data.length === 1) {
          data[0].data = JSON.parse(data[0].data);
          setContent(data[0]);
        }
      });
  }, [isMedia]);

  const title = content?.data?.title;
  const caption = content?.data?.caption;
  const heroImage = content?.data?.titleImageURL;
  const paragraphs = content?.data?.contents || [];
  const galleryImages = content?.data?.contentImageURLs || [];

  return (
    <div className="article-page">
      <Navigation />

      <Link to="/" className="article-back" aria-label="ย้อนกลับสู่หน้าแรก">
        <ArrowLeftIcon size={16} />
        <span>ย้อนกลับ</span>
      </Link>

      <header className="article-hero">
        <div className="article-hero__bg">
          {heroImage && (
            <img src={heroImage} alt={title || ""} />
          )}
        </div>
        <div className="article-hero__overlay" aria-hidden="true" />
        <div className="article-hero__pattern" aria-hidden="true" />
        <div className="article-hero__content">
          <div className="article-hero__inner">
            <nav className="article-hero__breadcrumb" aria-label="breadcrumb">
              <Link to={sectionAnchor}>{sectionLabel}</Link>
              <span className="sep">/</span>
              <span className="current">{title || "กำลังโหลด..."}</span>
            </nav>
            <h1 className="article-hero__title">{title || " "}</h1>
            {caption && <p className="article-hero__caption">{caption}</p>}
          </div>
        </div>
      </header>

      <article className="article-body">
        <div className="article-divider" aria-hidden="true">
          <span className="line" />
          <LotusIcon size={18} />
          <span className="label">บทความ</span>
          <span className="line" style={{ background: "linear-gradient(to left, currentColor, transparent)" }} />
        </div>

        {paragraphs.map((p, i) => (
          <p key={i}>
            <span dangerouslySetInnerHTML={{ __html: p }} />
          </p>
        ))}

        {galleryImages.length > 0 && (
          <div className="article-gallery">
            {galleryImages.map((src, i) => (
              <div
                key={i}
                className="article-gallery__item"
                role="button"
                tabIndex={0}
                onClick={() => {
                  setShowModal(true);
                  setModalImageURL(src);
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    setShowModal(true);
                    setModalImageURL(src);
                  }
                }}
              >
                <img src={src} alt={`${title || "รูปประกอบ"} ${i + 1}`} loading="lazy" />
              </div>
            ))}
          </div>
        )}
      </article>

      <Modal
        show={showModal}
        animation
        centered
        onHide={() => setShowModal(false)}
        dialogClassName="thai-modal"
        size="lg"
      >
        <Modal.Body>
          <img src={modalImageURL} alt="" />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            ปิด
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};
