import React, { useEffect, useState } from "react";
import Logo from "../assets/img/logo.png";

const navData = [
  ["/#home", "หน้าแรก"],
  ["/#aboutus", "รู้จักวัดด่าน"],
  ["/#activities", "ข่าวและกิจกรรม"],
  ["/#media", "สื่อธรรม"],
  ["/#contact", "ติดต่อสอบถาม"],
];

export const Navigation = () => {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav
      id="navbarcustom"
      className={`thai-nav ${scrolled ? "is-scrolled" : ""} ${open ? "is-open" : ""}`}
      aria-label="ระบบนำทางหลัก"
    >
      <div className="thai-nav__inner">
        <a className="thai-nav__brand" href="#home" aria-label="วัดด่าน พระราม 3 หน้าแรก">
          <span className="thai-nav__brand-mark">
            <img src={Logo} alt="" />
          </span>
          <span className="thai-nav__brand-text">
            <span className="thai-nav__brand-name">วัดด่าน พระราม 3</span>
            <span className="thai-nav__brand-sub">Wat Dan · Bangkok</span>
          </span>
        </a>

        <button
          type="button"
          className="thai-nav__toggle"
          aria-label="เปิด/ปิดเมนู"
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
        >
          <span />
          <span />
          <span />
        </button>

        <ul className="thai-nav__links" role="menubar">
          {navData.map(([href, label]) => {
            const targetId = href.split("#")[1];
            return (
              <li key={href} role="none">
                <a
                  role="menuitem"
                  className="thai-nav__link"
                  href={href}
                  onClick={(e) => {
                    setOpen(false);
                    if (!targetId) return;
                    const el = document.getElementById(targetId);
                    if (el) {
                      e.preventDefault();
                      el.scrollIntoView({ behavior: "smooth", block: "start" });
                      window.history.replaceState(null, "", `#${targetId}`);
                    }
                  }}
                >
                  <span>{label}</span>
                </a>
              </li>
            );
          })}
        </ul>
      </div>
    </nav>
  );
};
