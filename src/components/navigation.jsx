import React, { useEffect, useState } from "react";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
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

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <Navbar
      id="navbarcustom"
      style={{
        background: scrolled
          ? "rgba(251, 244, 230, 0.94)"
          : "rgba(251, 244, 230, 0.55)",
        backdropFilter: "saturate(160%) blur(12px)",
        WebkitBackdropFilter: "saturate(160%) blur(12px)",
        marginBottom: "-92px",
        lineHeight: "70px",
        position: "fixed",
        zIndex: 10000,
        width: "100vw",
        top: 0,
        borderBottom: scrolled
          ? "1px solid rgba(201, 150, 43, 0.35)"
          : "1px solid rgba(201, 150, 43, 0.15)",
        boxShadow: scrolled
          ? "0 8px 28px rgba(94, 19, 16, 0.12)"
          : "0 2px 12px rgba(94, 19, 16, 0.04)",
        transition:
          "background 320ms ease, box-shadow 320ms ease, border-color 320ms ease",
      }}
    >
      <Container style={{ maxWidth: "none", padding: "0px 30px 0px 30px" }}>
        <Navbar.Brand href="#home" style={{ display: "flex", alignItems: "center" }}>
          <img
            style={{
              width: "70px",
              height: "70px",
              marginRight: "16px",
              filter: "drop-shadow(0 4px 12px rgba(94, 19, 16, 0.18))",
              transition: "transform 320ms ease",
            }}
            src={Logo}
            alt="วัดด่าน พระราม 3 logo"
          />
          <span
            style={{
              color: "#5C1310",
              fontSize: "24px",
              fontFamily: "taviraj, charm, serif",
              fontWeight: 700,
              letterSpacing: "0.005em",
              lineHeight: 1.1,
            }}
          >
            วัดด่าน พระราม 3
          </span>
        </Navbar.Brand>

        <Nav style={{ marginLeft: "auto", alignItems: "center", gap: "4px" }}>
          {navData.map(([href, label]) => (
            <Nav.Link
              key={href}
              href={href}
              style={{
                color: "#8B1A14",
                fontSize: "15px",
                fontFamily: "taviraj, Prompt, sans-serif",
                fontWeight: 600,
                padding: "8px 14px",
                position: "relative",
                transition: "color 220ms ease",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "#C9962B")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "#8B1A14")}
            >
              {label}
            </Nav.Link>
          ))}
        </Nav>
      </Container>
    </Navbar>
  );
};
