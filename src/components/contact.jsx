import { useEffect, useState } from "react";
import emailjs from "emailjs-com";
import React from "react";

const contactData = [
  { name: "เจ้าอาวาส", value: "089-915-2077" },
  { name: "กิจนิมนต์-ยืมของกิจ พระสมชาย", value: "081-742-5967" },
  { name: "ฌาปนสถาน ต๊อก", value: "095-826-2959" },
  { name: "เลขานุการ ธีรพงษ์", value: "080-303-6512" },
];

const address = [
  "เลขที่872 ถนนพระราม3 ซอย34",
  "แขวงบางโพงพาง เขตยานนาวา กรุงเทพมหานคร",
];

const initialState = {
  name: "",
  email: "",
  message: "",
};
export const Contact = (props) => {
  const [{ name, email, message }, setState] = useState(initialState);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setState((prevState) => ({ ...prevState, [name]: value }));
  };
  const clearState = () => setState({ ...initialState });
  const [contact, setContact] = useState(null);

  useEffect(() => {
    fetch(
      `https://sycl7h5b43.execute-api.ap-southeast-1.amazonaws.com/content?type=contact&id=${encodeURIComponent(
        "2024-05-18 23:27:32"
      )}`
    )
      .then((res) => res.json())
      .then((data) => {
        if (data.length === 1) {
          data[0].data = JSON.parse(data[0].data);
          setContact(data[0]);
        }
        // console.log()
        console.log(data);
        // const items = JSON.parse(data.data);
        // setActivities(data);
        // console.log(data);
      });
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(name, email, message);

    {
      /* replace below with your own Service ID, Template ID and Public Key from your EmailJS account */
    }

    emailjs
      .sendForm(
        "YOUR_SERVICE_ID",
        "YOUR_TEMPLATE_ID",
        e.target,
        "YOUR_PUBLIC_KEY"
      )
      .then(
        (result) => {
          console.log(result.text);
          clearState();
        },
        (error) => {
          console.log(error.text);
        }
      );
  };
  return (
    <div>
      <div id="contact">
        <div className="container">
          <div className="col-md-8">
            <div className="row">
              <div className="section-title">
                <h2
                  style={{
                    color: "#a7261d",
                    fontWeight: "700",
                    marginTop: "-140px",
                  }}
                >
                  ติดต่อสอบถาม
                </h2>
                {contact?.data?.contents.map((data, i) => {
                  const contactData = JSON.parse(data);
                  return (
                    <p
                      style={{
                        color: "#333333",
                        fontSize: "18px",
                        fontWeight: "700",
                        fontFamily: "chakra",
                      }}
                    >
                      {contactData.name}{" "}
                      <i
                        class="fa fa-solid fa-phone"
                        style={{ marginLeft: "30px" }}
                      />{" "}
                      {contactData.phone}
                    </p>
                  );
                })}
              </div>
              {/* <form name="sentMessage" validate onSubmit={handleSubmit}>
                <div className="row">
                  <div className="col-md-6">
                    <div className="form-group">
                      <input
                        type="text"
                        id="name"
                        name="name"
                        className="form-control"
                        placeholder="Name"
                        required
                        onChange={handleChange}
                      />
                      <p className="help-block text-danger"></p>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="form-group">
                      <input
                        type="email"
                        id="email"
                        name="email"
                        className="form-control"
                        placeholder="Email"
                        required
                        onChange={handleChange}
                      />
                      <p className="help-block text-danger"></p>
                    </div>
                  </div>
                </div>
                <div className="form-group">
                  <textarea
                    name="message"
                    id="message"
                    className="form-control"
                    rows="4"
                    placeholder="Message"
                    required
                    onChange={handleChange}
                  ></textarea>
                  <p className="help-block text-danger"></p>
                </div>
                <div id="success"></div>
                <button type="submit" className="btn btn-custom btn-lg">
                  Send Message
                </button>
              </form> */}
            </div>
          </div>
          {/* <div className="col-md-3 col-md-offset-1 contact-info">
            <div className="contact-item">
              <h3>Contact Info</h3>
              <p>
                <span>
                  <i className="fa fa-map-marker"></i> Address
                </span>
                {props.data ? props.data.address : "loading"}
              </p>
            </div>
            <div className="contact-item">
              <p>
                <span>
                  <i className="fa fa-phone"></i> Phone
                </span>{" "}
                {props.data ? props.data.phone : "loading"}
              </p>
            </div>
            <div className="contact-item">
              <p>
                <span>
                  <i className="fa fa-envelope-o"></i> Email
                </span>{" "}
                {props.data ? props.data.email : "loading"}
              </p>
            </div>
          </div> */}
          {/* <div className="col-md-12">
            <div className="row">
              <div className="social">
                <ul>
                  <li>
                    <a href={props.data ? props.data.facebook : "/"}>
                      <i className="fa fa-facebook"></i>
                    </a>
                  </li>
                  <li>
                    <a href={props.data ? props.data.twitter : "/"}>
                      <i className="fa fa-twitter"></i>
                    </a>
                  </li>
                  <li>
                    <a href={props.data ? props.data.youtube : "/"}>
                      <i className="fa fa-youtube"></i>
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div> */}
          {/* <div style="max-width:100%;overflow:hidden;color:red;width:500px;height:500px;"><div id="embed-map-display" style="height:100%; width:100%;max-width:100%;"> */}
          <div style={{}}></div>
          {/* </div><a class="our-googlemap-code" rel="nofollow" href="https://www.bootstrapskins.com/themes" id="auth-map-data">premium bootstrap themes</a><style>#embed-map-display img{max-width:none!important;background:none!important;font-size: inherit;font-weight:inherit;}</style></div> */}
        </div>
        <div
          className="container"
          style={{ display: "flex", flexDirection: "row" }}
        >
          <div style={{ marginRight: "30px" }}>
            <iframe
              style={{
                height: "200px",
                width: "300px",
                border: "0",
              }}
              frameborder="0"
              src="https://www.google.com/maps/embed/v1/place?q=วัดด่าน&key=AIzaSyBFw0Qbyq9zTFTd-tUY6dZWTgaQzuU17R8"
            ></iframe>
          </div>
          <div>
            {address.map((data, i) => {
              return (
                <p
                  style={{
                    color: "#333333",
                    fontSize: "18px",
                    fontWeight: "700",
                    fontFamily: "chakra",
                  }}
                >
                  {data}
                </p>
              );
            })}
          </div>
        </div>
      </div>
      <div id="footer">
        <div className="container text-center">
          <p>
            Copyright &copy; 2024 วัดด่าน พระราม 3. Design by{" "}
            <a href="http://www.templatewire.com" rel="nofollow">
              ธนาวัฒน์ ฮ้อศิริมานนท์
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};
