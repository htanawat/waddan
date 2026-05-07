import React, { useState, useEffect, useMemo, useRef, useCallback } from "react";
import { Link } from "react-router-dom";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import { Navigation } from "../components/navigation";
import {
  ArrowLeftIcon,
  LotusIcon,
  PlayIcon,
  PauseIcon,
  StopIcon,
  SoundWaveIcon,
} from "./icons";

// Strip HTML tags safely (article content may contain <br>, <p>, etc.)
const stripHtml = (html) => {
  if (typeof window === "undefined") return html || "";
  const tmp = document.createElement("div");
  tmp.innerHTML = html || "";
  return (tmp.textContent || tmp.innerText || "").replace(/\s+/g, " ").trim();
};

// Choose the best Thai female voice available on this device.
// Known names: macOS "Kanya" (th-TH female), Google "Premwadee" (Android),
// Windows "Pattara" / "Achara" — fall back to any Thai voice.
const FEMALE_HINTS = [
  "kanya",
  "premwadee",
  "pattara",
  "achara",
  "noppawan",
  "sarinrat",
  "female",
];
const pickThaiFemaleVoice = (voices) => {
  if (!voices || voices.length === 0) return null;
  const thai = voices.filter((v) => (v.lang || "").toLowerCase().startsWith("th"));
  const named = thai.find((v) =>
    FEMALE_HINTS.some((h) => (v.name || "").toLowerCase().includes(h))
  );
  if (named) return named;
  // Some browsers (Chrome) suffix Thai voices with "(Thailand)"
  if (thai.length) return thai[0];
  return null;
};

const useArticleTTS = (text) => {
  const supported =
    typeof window !== "undefined" && "speechSynthesis" in window;
  const [voices, setVoices] = useState([]);
  const [state, setState] = useState("idle"); // idle | playing | paused
  const utteranceRef = useRef(null);

  useEffect(() => {
    if (!supported) return;
    const load = () => setVoices(window.speechSynthesis.getVoices());
    load();
    window.speechSynthesis.onvoiceschanged = load;
    return () => {
      window.speechSynthesis.cancel();
    };
  }, [supported]);

  const stop = useCallback(() => {
    if (!supported) return;
    window.speechSynthesis.cancel();
    utteranceRef.current = null;
    setState("idle");
  }, [supported]);

  const play = useCallback(() => {
    if (!supported || !text) return;

    if (state === "paused") {
      window.speechSynthesis.resume();
      setState("playing");
      return;
    }

    window.speechSynthesis.cancel();

    // Chunk long Thai text — Web Speech engines often cut off after ~200–400 chars.
    const chunks = text.match(/[^.!?\n]{1,220}([.!?\n]|$)/g) || [text];
    const voice = pickThaiFemaleVoice(voices);

    let idx = 0;
    const speakNext = () => {
      if (idx >= chunks.length) {
        utteranceRef.current = null;
        setState("idle");
        return;
      }
      const u = new SpeechSynthesisUtterance(chunks[idx]);
      u.lang = voice ? voice.lang : "th-TH";
      if (voice) u.voice = voice;
      u.rate = 0.95;
      u.pitch = 1.05;
      u.volume = 1;
      u.onend = () => {
        idx += 1;
        speakNext();
      };
      u.onerror = () => {
        utteranceRef.current = null;
        setState("idle");
      };
      utteranceRef.current = u;
      window.speechSynthesis.speak(u);
    };

    setState("playing");
    speakNext();
  }, [supported, text, voices, state]);

  const pause = useCallback(() => {
    if (!supported) return;
    window.speechSynthesis.pause();
    setState("paused");
  }, [supported]);

  return { supported, state, play, pause, stop, hasThaiVoice: !!pickThaiFemaleVoice(voices) };
};

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
  const paragraphs = useMemo(() => content?.data?.contents || [], [content]);
  const galleryImages = content?.data?.contentImageURLs || [];

  const speechText = useMemo(
    () =>
      paragraphs
        .map((p) => stripHtml(p))
        .filter(Boolean)
        .join(" "),
    [paragraphs]
  );

  const tts = useArticleTTS(speechText);

  return (
    <div className="article-page">
      <Navigation />

      <Link to="/" className="article-back" aria-label="ย้อนกลับสู่หน้าแรก">
        <ArrowLeftIcon size={16} />
        <span>ย้อนกลับ</span>
      </Link>

      <header className="article-hero">
        <div className="article-hero__bg">
          {heroImage && <img src={heroImage} alt={title || ""} />}
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
            <h1 className="article-hero__title">{title || " "}</h1>
            {caption && <p className="article-hero__caption">{caption}</p>}
          </div>
        </div>
      </header>

      <article className="article-body">
        <div className="article-divider" aria-hidden="true">
          <span className="line" />
          <LotusIcon size={18} />
          <span className="label">บทความ</span>
          <span className="line line--right" />
        </div>

        {tts.supported && speechText && (
          <div
            className={`tts-bar ${tts.state !== "idle" ? "is-active" : ""}`}
            role="region"
            aria-label="ฟังบทความ"
          >
            <div className="tts-bar__icon" aria-hidden="true">
              <SoundWaveIcon size={18} />
              <span className="tts-bar__waves">
                <span /><span /><span /><span />
              </span>
            </div>
            <div className="tts-bar__text">
              <span className="tts-bar__label">ฟังบทความ</span>
              <span className="tts-bar__hint">
                {tts.state === "playing"
                  ? "กำลังอ่าน..."
                  : tts.state === "paused"
                  ? "หยุดชั่วคราว"
                  : tts.hasThaiVoice
                  ? "เสียงผู้หญิง · ภาษาไทย"
                  : "เปิดเสียงเพื่อฟัง"}
              </span>
            </div>
            <div className="tts-bar__controls">
              {tts.state !== "playing" ? (
                <button
                  type="button"
                  className="tts-btn tts-btn--primary"
                  onClick={tts.play}
                  aria-label={tts.state === "paused" ? "เล่นต่อ" : "เริ่มอ่าน"}
                >
                  <PlayIcon size={18} />
                </button>
              ) : (
                <button
                  type="button"
                  className="tts-btn tts-btn--primary"
                  onClick={tts.pause}
                  aria-label="หยุดชั่วคราว"
                >
                  <PauseIcon size={18} />
                </button>
              )}
              <button
                type="button"
                className="tts-btn"
                onClick={tts.stop}
                disabled={tts.state === "idle"}
                aria-label="หยุดอ่าน"
              >
                <StopIcon size={16} />
              </button>
            </div>
          </div>
        )}

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
