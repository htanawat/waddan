import React, { useEffect, useState } from "react";
import AboutImage from "../assets/img/about.jpg";

export const About = (props) => {
  const [about, setAbout] = useState(null);

  useEffect(() => {
    fetch(
      `https://sycl7h5b43.execute-api.ap-southeast-1.amazonaws.com/content?type=about&id=${encodeURIComponent(
        "2024-05-18 23:27:32"
      )}`
    )
      .then((res) => res.json())
      .then((data) => {
        if (data.length === 1) {
          data[0].data = JSON.parse(data[0].data);
          setAbout(data[0]);
        }
        // console.log()
        console.log(data);
        // const items = JSON.parse(data.data);
        // setActivities(data);
        // console.log(data);
      });
  });

  return (
    <div id="about">
      <div className="container">
        <div className="row">
          <div className="col-xs-12 col-md-6">
            {" "}
            <img src={AboutImage} className="img-responsive" alt="" />{" "}
          </div>
          <div className="col-xs-12 col-md-6">
            <div className="about-text">
              <h2 style={{ color: "#dddddd" }}>รู้จักวัดด่าน</h2>
              <p style={{ fontFamily: "chakra" }}>
                {props.data ? (
                  <span
                    dangerouslySetInnerHTML={{
                      __html: about?.data?.contents?.[0],
                    }}
                  />
                ) : (
                  "loading..."
                )}
              </p>
              {/* <h3>Why Choose Us?</h3> */}
              {/* <div className="list-style">
                <div className="col-lg-6 col-sm-6 col-xs-12">
                  <ul>
                    {props.data
                      ? props.data.Why.map((d, i) => (
                          <li key={`${d}-${i}`}>{d}</li>
                        ))
                      : "loading"}
                  </ul>
                </div>
                <div className="col-lg-6 col-sm-6 col-xs-12">
                  <ul>
                    {props.data
                      ? props.data.Why2.map((d, i) => (
                          <li key={`${d}-${i}`}> {d}</li>
                        ))
                      : "loading"}
                  </ul>
                </div>
              </div> */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
