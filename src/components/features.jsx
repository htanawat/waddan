import React, { useState, useEffect } from "react";
import img1 from "../assets/img/carousel/1.jpg";
import img2 from "../assets/img/carousel/2.jpg";
import img3 from "../assets/img/carousel/3.jpg";
import img4 from "../assets/img/carousel/4.jpg";
import Carousel from "react-bootstrap/Carousel";
// import ExampleCarouselImage from '../assets/img/carousel/1.jpg';

export const Features = (props) => {
  const images = [img1, img2, img3];
  const imageShow = useState(0);

  const [highlight, setHighlight] = useState([]);
  useEffect(() => {
    fetch(
      "https://sycl7h5b43.execute-api.ap-southeast-1.amazonaws.com/admin/contents?type=highlight"
    )
      .then((res) => res.json())
      .then((data) => {
        // console.log(data);
        data.map((dj) => {
          dj.data = JSON.parse(dj.data);
        });
        setHighlight(data);
        // console.log(data);
      });
  }, []);

  return (
    <div
      id="features"
      style={{ paddingBottom: "30px" }}
      className="text-center"
    >
      <div className="container">
        {/* <div className="col-md-10 col-md-offset-1 section-title"> */}
        <h2
          style={{
            color: "#dddddd",
            fontSize: "36px",
            marginTop: "20px",
            fontWeight: "700",
          }}
        >
          หน้าแรก
        </h2>
        {/* </div> */}
        <div className="row" style={{ width: "100%" }}>
          <Carousel>
            {highlight.map((data, i) => {
              if (data?.state === "active") {
                return (
                  <Carousel.Item key={i}>
                    <img
                      style={{
                        width: "100%",
                        maxHeight: "530px",
                        objectFit: "cover",
                      }}
                      src={data?.data?.titleImageURL}
                    />
                    <Carousel.Caption style={{ background: "#33333388" }}>
                      <h3>{data?.data?.title}</h3>
                      <p>{data?.data?.caption}</p>
                    </Carousel.Caption>
                  </Carousel.Item>
                );
              }
            })}
          </Carousel>
        </div>
      </div>
    </div>
  );
};
