import React, { useEffect, useState } from "react";
import { ArrowUpIcon } from "./icons";

export const BackToTop = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 480);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const goTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <button
      type="button"
      className={`back-to-top ${visible ? "is-visible" : ""}`}
      onClick={goTop}
      aria-label="กลับขึ้นด้านบน"
      tabIndex={visible ? 0 : -1}
    >
      <ArrowUpIcon size={20} />
    </button>
  );
};
