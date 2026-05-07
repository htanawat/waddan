import React, { useState, useEffect } from "react";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import img1 from "../assets/img/carousel/1.jpg";
import { Outlet, Link } from "react-router-dom";

const cardData = [1, 2, 3, 4];

export const Media = (props) => {
  const [media, setMedia] = useState([]);
  useEffect(() => {
    fetch(
      "https://sycl7h5b43.execute-api.ap-southeast-1.amazonaws.com/admin/contents?type=media"
    )
      .then((res) => res.json())
      .then((data) => {
        // console.log(data);
        data.map((dj) => {
          dj.data = JSON.parse(dj.data);
        });
        setMedia(data);
        // console.log(data);
      });
  }, []);

  return (
    <div id="services" style={{ marginTop: "-150px" }} className="text-center">
      <div className="container">
        {/* <div className="section-title"> */}
        <h2 style={{ marginBottom: "30px" }}>สื่อธรรม</h2>
        {/* <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit duis sed
            dapibus leonec.
          </p> */}
        {/* </div> */}
        <div style={{ width: "100%", overflow: "scroll" }}>
          <div
            style={{
              display: "inline-flex",
              gap: "10px",
            }}
          >
            {media.map((data, i) => {
              if (data?.state === "active") {
                return (
                  <Card id="service-card">
                    <Card.Img
                      variant="top"
                      height="200"
                      style={{ objectFit: "cover" }}
                      src={data?.data?.titleImageURL}
                    />
                    <Card.Body>
                      <Card.Title
                        style={{
                          fontWeight: "700",
                          fontFamily: "charm",
                          fontSize: "18px",
                        }}
                      >
                        {data.data.title}
                      </Card.Title>
                      <Card.Text
                        style={{
                          color: "#333333",
                          fontFamily: "chakra",
                          height: "40px",
                          textOverflow: "ellipsis",
                          overflow: "scroll",
                        }}
                      >
                        <span>{data?.data?.caption}</span>
                      </Card.Text>
                      <Link
                        style={{
                          color: "#ffffff",
                          fontFamily: "charm",
                          background: "#a7261d",
                          border: "none",
                          fontSize: "18px",
                          fontWeight: "700",
                          padding: "0px 8px 0px 8px",
                          borderRadius: "8px",
                        }}
                        variant="primary"
                        to={`media/${encodeURIComponent(data?.timestamp)}`}
                      >
                        อ่านต่อ
                      </Link>
                    </Card.Body>
                  </Card>
                );
              }
            })}
          </div>
        </div>

        {/* <div className="row">
          {props.data
            ? props.data.map((d, i) => (
                <div key={`${d.name}-${i}`} className="col-md-4">
                  {" "}
                  <i className={d.icon}></i>
                  <div className="service-desc">
                    <h3>{d.name}</h3>
                    <p>{d.text}</p>
                  </div>
                </div>
              ))
            : "loading"}
        </div> */}
      </div>
    </div>
  );
};
