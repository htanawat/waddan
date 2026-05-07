import React, { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import { Navigation } from "../components/navigation";
import JsonData from "../data/data.json";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import SmoothScroll from "smooth-scroll";
import "bootstrap/dist/css/bootstrap.min.css";
import Carousel from "react-bootstrap/Carousel";

import img1 from "../assets/img/carousel/1.jpg";

const serviceData = {
  title: "กิจกรรมวันอัฐมีบูชา",
  paragraphs: [
    `Lorem ipsum dolor sit amet, consectetur
    adipiscing elit. Duis sed dapibus leo nec ornare diam sedasd commodo
    nibh ante facilisis bibendum dolor feugiat at. Lorem ipsum dolor sit
    amet, consectetur adipiscing elit. Duis sed dapibus leo nec ornare
    diam sedasd commodo nibh ante facilisis bibendum dolor feugiat
    at.Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis sed
    dapibus leo nec ornare diam sedasd commodo nibh ante facilisis
    bibendum dolor feugiat at.Lorem ipsum dolor sit amet, consectetur
    adipiscing elit. Duis sed dapibus leo nec ornare diam sedasd commodo
    nibh ante facilisis bibendum dolor feugiat at.Lorem ipsum dolor sit
    amet, consectetur adipiscing elit. Duis sed dapibus leo nec ornare
    diam sedasd commodo nibh ante facilisis bibendum dolor feugiat at.`,
    `Lorem ipsum dolor sit amet, consectetur
    adipiscing elit. Duis sed dapibus leo nec ornare diam sedasd commodo
    nibh ante facilisis bibendum dolor feugiat at. Lorem ipsum dolor sit
    amet, consectetur adipiscing elit. Duis sed dapibus leo nec ornare
    diam sedasd commodo nibh ante facilisis bibendum dolor feugiat
    at.Lorem ipsum dolor sit amet`,
    `Lorem ipsum dolor sit amet, consectetur
    adipiscing elit. Duis sed dapibus leo nec ornare diam sedasd commodo
    nibh ante facilisis bibendum dolor feugiat at.Lorem ipsum dolor sit
    amet, consectetur adipiscing elit.`,
  ],
  images: [
    {
      src: img1,
    },
    {
      src: img1,
    },
    {
      src: img1,
    },
  ],
};

export const ContentServices = () => {
  const NavPath = (props) => {
    const headpath = window.location.pathname.includes("/media/")
      ? "สื่อธรรม"
      : "ข่าวและกิจกรรม";
    return (
      <>
        <span
          style={{ fontFamily: "charm", fontSize: "18px", fontWeight: "700" }}
        >
          {headpath} /{" "}
        </span>
        <a
          style={{
            fontFamily: "charm",
            fontSize: "18px",
            fontWeight: "700",
            color: "#a7261d",
            cursor: "pointer",
          }}
        >
          {props.title}
        </a>
      </>
    );
  };

  const [content, setContent] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [modalImageURL, setModalImageURL] = useState("");

  useEffect(() => {
    const contentId = window.location.pathname.split("/").splice(-1, 1)[0];
    const contentType = window.location.pathname.includes("/media/")
      ? "media"
      : "activity";
    fetch(
      `https://sycl7h5b43.execute-api.ap-southeast-1.amazonaws.com/content?type=${contentType}&id=${contentId}`
    )
      .then((res) => res.json())
      .then((data) => {
        if (data.length === 1) {
          data[0].data = JSON.parse(data[0].data);
          setContent(data[0]);
        }
        // console.log()
        console.log(data);
        // const items = JSON.parse(data.data);
        // setActivities(data);
        // console.log(data);
      });
  }, []);

  return (
    <>
      {/* <div> */}
      <Navigation />

      <div style={{ marginTop: "150px" }} className="container">
        <div style={{ marginBottom: "20px" }}>
          <Link
            to="/"
            style={{
              marginBottom: "30px",
              background: "#0000",
              border: "none",
              color: "#333a",
              fontSize: "18px",
              cursor: "pointer",
              fontFamily: "charm",
            }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              fill="currentColor"
              class="bi bi-arrow-left"
              viewBox="0 0 16 16"
              style={{ marginRight: "8px" }}
            >
              <path
                fill-rule="evenodd"
                d="M15 8a.5.5 0 0 0-.5-.5H2.707l3.147-3.146a.5.5 0 1 0-.708-.708l-4 4a.5.5 0 0 0 0 .708l4 4a.5.5 0 0 0 .708-.708L2.707 8.5H14.5A.5.5 0 0 0 15 8"
              />
            </svg>
            ย้อนกลับ
          </Link>
        </div>
        <NavPath title={content?.data?.title} />
        <div
          id="service-title"
          style={{
            marginTop: "50px",
            color: "#333333",
            fontFamily: "charm",
            fontSize: "28px",
            fontWeight: "700",
            color: "#a7261d",
          }}
        >
          {/* กิจกรรมวันอัฐมีบูชา */}
          {content?.data?.title}
        </div>
        <div
          style={{
            marginTop: "20px",
            color: "#333333",
            fontFamily: "charm",
            fontSize: "16px",
            fontWeight: "700",
            color: "#4e4e4e",
          }}
        >
          {content?.data?.caption}
        </div>
        <hr
          style={{
            border: "#a7261d 2px solid",
            background: "#a7261d",
            width: "80px",
          }}
        />

        {content?.data?.titleImageURL && (
          <div style={{ width: "100%", textAlign: "center" }}>
            <img
              style={{
                width: "100%",
                maxWidth: "500px",
                marginLeft: "auto",
                maxHeight: "530px",
                objectFit: "cover",
                marginBottom: "30px",
                marginTop: "30px",
              }}
              src={content?.data?.titleImageURL}
            />
          </div>
        )}
        {content?.data?.contents.map((data) => {
          return (
            <p
              style={{
                fontFamily: "chakra",
                whiteSpace: "break-spaces",
                wordWrap: "break-word",
              }}
            >
              &ensp;&ensp;&ensp;&ensp;&ensp;
              <span dangerouslySetInnerHTML={{ __html: data }} />
            </p>
          );
        })}
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            flexWrap: "wrap",
            gap: "10px",
          }}
        >
          {/* {serviceData.images.map((imgsrc, i) => {
            return (
              <img
                style={{ width: "calc( 100% / 3 - 10px )", height: "200px" }}
                src={imgsrc}
              />
            );
          })} */}
          <div
            className="row"
            style={{
              width: "100%",
              margin: "20px 0px 20px 0px",
              display: "flex",
              flexDirection: "row",
              flexWrap: "wrap",
              gap: "10px",
              // border: "1px solid #aaaaaa",
              // borderRadius: "8px",
            }}
          >
            {content?.data.contentImageURLs.map((imgsrc, i) => {
              return (
                <img
                  key={i}
                  style={{
                    width: "200px",
                    height: "200px",
                    maxWidth: "350px",
                    maxHeight: "350px",
                    objectFit: "cover",
                    border: "1px solid #eeeeee",
                    borderRadius: "8px",
                    cursor: "pointer",
                  }}
                  onClick={() => {
                    setShowModal(true);
                    setModalImageURL(imgsrc);
                  }}
                  src={imgsrc}
                />
              );
            })}
            {/* <Carousel>
              {content?.data.contentImageURLs.map((imgsrc, i) => {
                return (
                  <Carousel.Item key={i}>
                    <img
                      style={{
                        width: "100%",
                        maxHeight: "530px",
                        objectFit: "cover",
                      }}
                      src={imgsrc}
                    />
                  </Carousel.Item>
                );
              })}
            </Carousel> */}
          </div>
        </div>
      </div>
      {/* </div> */}

      <Modal
        show={showModal}
        animation={false}
        onHide={() => setShowModal(false)}
        style={{ marginTop: "100px" }}
      >
        <Modal.Body>
          <img
            style={{
              width: "100%",
            }}
            src={modalImageURL}
          />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            ปิด
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};
