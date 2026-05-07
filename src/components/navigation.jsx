import React from "react";
import Radium from "radium";
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

export const Navigation = (props) => {
  return (
    <>
      <Navbar
        id="navbarcustom"
        style={{
          background: "#ffbe6eaa",
          marginBottom: "-92px",
          lineHeight: "70px",
          position: "fixed",
          zIndex: "10000",
          width: "100vw",
          top: "0px",
          ":not([data-scroll='0'])": {
            background: "#ffbe6e !important",
          },
        }}
      >
        <Container style={{ maxWidth: "none", padding: "0px 30px 0px 30px" }}>
          <Navbar.Brand href="#home">
            <span
              style={{
                color: "#a7261d",
                display: "inline-block",
                marginTop: "-15px",
                fontSize: "25px",
                fontFamily: "charm",
                fontWeight: "700",
              }}
            >
              <img
                style={{
                  width: "80px",
                  height: "80px",
                  marginTop: "-5px",
                  marginRight: "20px",
                  display: "inline-block",
                }}
                src={Logo}
              />
              วัดด่าน พระราม 3
            </span>
          </Navbar.Brand>
          <Nav style={{ marginLeft: "auto" }}>
            {navData.map((data) => {
              return (
                <Nav.Link
                  style={{
                    color: "#a7261d",
                    fontSize: "14px",
                    fontFamily: "charm",
                    fontWeight: "700",
                  }}
                  href={data[0]}
                >
                  {data[1]}
                </Nav.Link>
              );
            })}

            {/* <Nav.Link href="#home">รู้จักวัดด่าน</Nav.Link>
          <Nav.Link href="#features">ข่าวและกิจกรรม</Nav.Link>
          <Nav.Link href="#pricing">สื่อธรรม</Nav.Link>
          <Nav.Link href="#pricing">ติดต่อสอบถาม</Nav.Link> */}
          </Nav>
        </Container>
      </Navbar>
    </>
  );
};

// export const Navigation = (props) => {
//   return (
//     <nav style={{backgorund: "#e6a14c"}} id="menu" className="navbar navbar-default navbar-fixed-top">
//       <div className="container">
//         <div className="navbar-header">
//           <button
//             type="button"
//             className="navbar-toggle collapsed"
//             data-toggle="collapse"
//             data-target="#bs-example-navbar-collapse-1"
//           >
//             {" "}
//             <span className="sr-only">Toggle navigation</span>{" "}
//             <span className="icon-bar"></span>{" "}
//             <span className="icon-bar"></span>{" "}
//             <span className="icon-bar"></span>{" "}
//           </button>
//           <a className="navbar-brand page-scroll" href="#page-top">
//             <span style={{color: '#a7261d',  display: 'inline-block',  marginTop: '-15px'}}><img style={{ width: '70px', height: '70px', marginTop: '-10px', marginRight: '20px', display: 'inline-block'}} src="logo.png" />วัดด่าน พระราม 3</span>
//           </a>{" "}
//         </div>

//         <div
//           className="collapse navbar-collapse"
//           id="bs-example-navbar-collapse-1"
//         >
//           <ul className="nav navbar-nav navbar-right">
//             <li>
//               <a href="#features" className="page-scroll">
//               รู้จักวัดด่าน
//               </a>
//             </li>
//             <li>
//               <a href="#about" className="page-scroll">
//               ข่าวและกิจกรรม
//               </a>
//             </li>
//             <li>
//               <a href="#services" className="page-scroll">
//               สื่อธรรม
//               </a>
//             </li>
//             <li>
//               <a href="#portfolio" className="page-scroll">
//               ติดต่อสอบถาม
//               </a>
//             </li>
//             {/* <li>
//               <a href="#testimonials" className="page-scroll">
//                 ติดต่อสอบถาม
//               </a>
//             </li> */}
//             {/* <li>
//               <a href="#team" className="page-scroll">
//                 Team
//               </a>
//             </li>
//             <li>
//               <a href="#contact" className="page-scroll">
//                 Contact
//               </a>
//             </li> */}
//           </ul>
//         </div>
//       </div>
//     </nav>
//   );
// };
