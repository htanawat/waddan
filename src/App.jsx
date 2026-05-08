import React, { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Navigation } from "./components/navigation";
import { Header } from "./components/header";
import { Features } from "./components/features";
import { About } from "./components/about";
import { Services } from "./components/services";
import { Media } from "./components/media";
import { Admin } from "./components/Admin";
import { Contact } from "./components/contact";
import { BackToTop } from "./components/BackToTop";
import { useReveal } from "./components/useReveal";
import JsonData from "./data/data.json";
import "bootstrap/dist/css/bootstrap.min.css";
import { ContentServices } from "./components/ContentService";
import "./App.css";

const Main = () => {
  const [landingPageData, setLandingPageData] = useState({});
  useReveal();

  useEffect(() => {
    setLandingPageData(JsonData);
  }, []);

  useEffect(() => {
    if (window.location.hash) {
      const id = window.location.hash.slice(1);
      const tryScroll = (attempts = 0) => {
        const el = document.getElementById(id);
        if (el) {
          el.scrollIntoView({ behavior: "smooth", block: "start" });
        } else if (attempts < 10) {
          setTimeout(() => tryScroll(attempts + 1), 80);
        }
      };
      tryScroll();
    }
  }, []);

  return (
    <>
      <a className="skip-link" href="#main-content">
        ข้ามไปยังเนื้อหาหลัก
      </a>
      <Navigation />
      <main id="main-content">
        <Header data={landingPageData.Header} />
        <Features data={landingPageData.Features} />
        <About data={landingPageData.About} />
        <Services data={landingPageData.Services} />
        <Media data={landingPageData.Services} />
        <Contact data={landingPageData.Contact} />
      </main>
      <BackToTop />
    </>
  );
};

const ArticleRoute = ({ type }) => {
  useReveal();
  return (
    <>
      <a className="skip-link" href="#article-main">
        ข้ามไปยังเนื้อหาหลัก
      </a>
      <ContentServices type={type} />
      <BackToTop />
    </>
  );
};

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/">
          <Route index element={<Main />} />
          <Route path="activities/*" element={<ArticleRoute type="activity" />} />
          <Route path="media/*" element={<ArticleRoute type="media" />} />
          <Route path="admin" element={<Admin />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;
