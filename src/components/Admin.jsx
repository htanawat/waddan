import React, { useState, useEffect, useRef } from "react";
import Table from "react-bootstrap/Table";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import styled from "styled-components";
import Form from "react-bootstrap/Form";
import "bootstrap/dist/css/bootstrap.min.css";

const AdminContainer = styled.div`
  padding: 36px;
`;

const Header = styled.div`
  font-size: 38px;
  font-weight: 700;
`;

const SubHeader = styled.div`
  font-size: 24px;
  font-weight: 500;
`;

const stateMap = {
  createActivity: "activity",
  createHighlight: "highlight",
  createMedia: "media",
  editActivity: "activity",
  editHighlight: "highlight",
  editMedia: "media",
};

const DataTable = (props) => {
  return (
    <Table striped bordered hover>
      <thead>
        <tr>
          <th>ลำดับที่</th>
          <th>วันที่เพิ่ม</th>
          <th>ชื่อ</th>
          <th>รูปภาพตัวอย่าง</th>
          <th>แสดง</th>
          <th>แก้ไข</th>
          <th>ลบ</th>
        </tr>
      </thead>
      <tbody>
        {props.data.map((row, i) => {
          return (
            <tr key={i}>
              <td>{i + 1}</td>
              <td>{row.timestamp}</td>
              <td>{row.data.title}</td>
              <td>
                <img width={50} height={50} src={row.data.titleImageURL} />
                {row.image}
              </td>
              <td>
                <Form.Check // prettier-ignore
                  type="switch"
                  id="custom-switch"
                  onChange={(e) => {
                    // console.log(e.target.checked);
                    fetch(
                      `https://sycl7h5b43.execute-api.ap-southeast-1.amazonaws.com/admin/contents`,
                      {
                        method: "put",
                        body: JSON.stringify({
                          type: props.type,
                          id: row.timestamp,
                          action: "setActive",
                          data: e.target.checked ? "active" : "inactive",
                          session: {
                            user: localStorage.getItem("user"),
                            auth: localStorage.getItem("auth"),
                          },
                        }),
                      }
                    )
                      .then((data) => data.json())
                      .then((data) => {
                        if (data?.status === "forbidden") {
                          window.alert("ผู้ใช้ไม่ถูกต้อง");
                          localStorage.clear();
                        } else {
                          window.alert("แก้ไขข้อมูลเรียบร้อย");
                        }
                        window.location.reload();
                      });
                  }}
                  defaultChecked={row.state === "active"}
                />
              </td>
              <td>
                <Button
                  onClick={() => {
                    props.setModalEditData({
                      id: row.timestamp,
                      type: props.type,
                      ind: i,
                    });
                    if (props.type === "activity") {
                      props.setModalState("editActivity");
                    } else if (props.type === "highlight") {
                      props.setModalState("editHighlight");
                    } else {
                      props.setModalState("editMedia");
                    }

                    props.onEdit(row);

                    props.setShowModal(true);
                  }}
                  variant="warning"
                >
                  แก้ไช
                </Button>
              </td>
              <td>
                <Button
                  onClick={() => {
                    if (window.confirm(`ลบ ${row.data.title} ?`)) {
                      fetch(
                        `https://sycl7h5b43.execute-api.ap-southeast-1.amazonaws.com/admin/contents`,
                        {
                          method: "delete",
                          body: JSON.stringify({
                            type: props.type,
                            id: row.timestamp,
                            session: {
                              user: localStorage.getItem("user"),
                              auth: localStorage.getItem("auth"),
                            },
                          }),
                        }
                      )
                        .then((data) => data.json())
                        .then((data) => {
                          if (data?.status === "forbidden") {
                            window.alert("ผู้ใช้ไม่ถูกต้อง");
                            localStorage.clear();
                          } else {
                            window.alert("ลบข้อมูลเรียบร้อย");
                          }
                          window.location.reload();
                        });
                    }
                  }}
                  variant="danger"
                >
                  ลบ
                </Button>
              </td>
            </tr>
          );
        })}
      </tbody>
    </Table>
  );
};

const texts = {
  createActivity: {
    title: "เพิ่มกิจกรรม",
    name: "ชื่อกิจกรรม",
    caption: "คำอธิบาย",
    titleImage: "รูปปก",
    paragraphTitle: "เนื้อหา",
    addParagraphButton: "เพิ่มเนื้อหา",
    contentImages: "รูปเนื้อหา",
  },
  createHighlight: {
    title: "เพิ่มภาพหน้าแรก",
    name: "ชื่อภาพ",
    caption: "คำอธิบาย",
    titleImage: "รูปภาพ",
  },
  createMedia: {
    title: "เพิ่มสื่อธรรม",
    name: "ชื่อหัวข้อ",
    caption: "คำอธิบาย",
    titleImage: "รูปปก",
    paragraphTitle: "เนื้อหา",
    addParagraphButton: "เพิ่มเนื้อหา",
  },
  editActivity: {
    title: "แก้ไขกิจกรรม",
    name: "ชื่อกิจกรรม",
    caption: "คำอธิบาย",
    titleImage: "รูปปก",
    paragraphTitle: "เนื้อหา",
    addParagraphButton: "เพิ่มเนื้อหา",
    contentImages: "รูปเนื้อหา",
  },
  editHighlight: {
    title: "แก้ไขภาพหน้าแรก",
    name: "ชื่อภาพ",
    caption: "คำอธิบาย",
    titleImage: "รูปภาพ",
  },
  editMedia: {
    title: "แก้ไขสื่อธรรม",
    name: "ชื่อหัวข้อ",
    caption: "คำอธิบาย",
    titleImage: "รูปปก",
    paragraphTitle: "เนื้อหา",
    addParagraphButton: "เพิ่มเนื้อหา",
  },
};

export const Admin = () => {
  const [highlight, setHighlight] = useState([]);
  const [activities, setActivities] = useState([]);
  const [media, setMedia] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [modalState, setModalState] = useState("");
  const [modalTitleName, setModalTitleName] = useState(null);
  const [modalCaption, setModalCaption] = useState(null);
  const [modalTitleImage, setModalTitleImage] = useState(null);
  const [modalTitleImageFile, setModalTitleImageFile] = useState(null);
  const [modalTitleImageFileB64, setModalTitleImageFileB64] = useState(null);
  const [modalParagraphs, setModalParagraphs] = useState([""]);
  const [modalContentImages, setModalContentImages] = useState([]);
  const [modalContentImagesFiles, setModalContentImagesFiles] = useState(null);
  const [modalContentImagesB64, setModalContentImagesB64] = useState(null);
  const [modalEditData, setModalEditData] = useState(null);
  const [isTitleImageEdited, setIsTitleImageEdited] = useState(false);
  const [isContentImageEdited, setIsContentImageEdited] = useState(false);
  const [userSession, setUserSession] = useState(localStorage.getItem("user"));
  const [aboutContent, setAboutContent] = useState(null);
  const [contactContent, setContactContent] = useState(null);
  const formRef = useRef();

  const [loginUsername, setLoginUsername] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

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
          setAboutContent(data[0]);
        }
        // console.log()
        console.log(data);
        // const items = JSON.parse(data.data);
        // setActivities(data);
        // console.log(data);
      });

    fetch(
      `https://sycl7h5b43.execute-api.ap-southeast-1.amazonaws.com/content?type=contact&id=${encodeURIComponent(
        "2024-05-18 23:27:32"
      )}`
    )
      .then((res) => res.json())
      .then((data) => {
        if (data.length === 1) {
          data[0].data = JSON.parse(data[0].data);
          setContactContent(data[0]);
        }
        // console.log()
        console.log(data);
        // const items = JSON.parse(data.data);
        // setActivities(data);
        // console.log(data);
      });
  }, []);

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
        // const items = JSON.parse(data.data);
        setHighlight(data);
        // console.log(data);
      })
      .catch(() => {
        setUserSession(null);
      });
  }, []);

  useEffect(() => {
    fetch(
      "https://sycl7h5b43.execute-api.ap-southeast-1.amazonaws.com/admin/contents?type=activity"
    )
      .then((res) => res.json())
      .then((data) => {
        // console.log(data);
        data.map((dj) => {
          dj.data = JSON.parse(dj.data);
        });
        // const items = JSON.parse(data.data);
        setActivities(data);
        // console.log(data);
      })
      .catch(() => {
        setUserSession(null);
      });
  }, []);

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
        // const items = JSON.parse(data.data);
        setMedia(data);
        // console.log(data);
      })
      .catch(() => {
        setUserSession(null);
      });
  }, []);

  const toBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = reject;
    });

  const onImageChange = (e) => {
    setModalTitleImage(URL.createObjectURL(e.target.files[0]));
    setModalTitleImageFile(e.target.files[0]);
    setIsTitleImageEdited(true);
    toBase64(e.target.files[0]).then((b64data) => {
      setModalTitleImageFileB64(b64data);
    });
  };

  const onContentImagesChange = async (e) => {
    const images = [];
    const b64s = [];
    await Promise.all(
      [...e.target.files].map(async (f, i) => {
        images.push(await URL.createObjectURL(f));
        const b64data = await toBase64(f);
        b64s.push(b64data);
      })
    );
    setModalContentImages(images);
    setIsContentImageEdited(true);
    setModalContentImagesFiles([...e.target.files]);
    setModalContentImagesB64(b64s);
  };

  return (
    <>
      <AdminContainer>
        <Header>จัดการเนื้อหา</Header>
        {userSession && (
          <Button
            style={{ float: "right" }}
            onClick={(data) => {
              if (window.confirm("ต้องการออกจากระบบ ?")) {
                localStorage.clear();
                window.location.reload();
              }
            }}
            variant="danger"
          >
            ออกจากระบบ
          </Button>
        )}
        {userSession ? (
          <>
            <SubHeader>รู้จักวัดด่าน</SubHeader>
            <Form.Control
              as="textarea"
              value={aboutContent?.data?.contents[0]}
              onChange={(e) => {
                aboutContent.data.contents[0] = e.target.value;
                setAboutContent({ ...aboutContent });
              }}
            />
            <Button
              variant="primary"
              onClick={() => {
                const postData = {};
                postData["type"] = "about";
                // postData["title"] = modalTitleName;
                // postData["caption"] = modalCaption;
                postData["contents"] = [aboutContent.data.contents[0]];
                postData["isTitleImageEdited"] = false;
                postData["isContentImageEdited"] = false;

                console.log(postData);
                fetch(
                  "https://sycl7h5b43.execute-api.ap-southeast-1.amazonaws.com/admin/contents",
                  {
                    method: "put",
                    body: JSON.stringify({
                      type: "about",
                      id: "2024-05-18 23:27:32",
                      action: "editData",
                      session: {
                        user: localStorage.getItem("user"),
                        auth: localStorage.getItem("auth"),
                      },
                      data: postData,
                    }),
                  }
                )
                  .then((data) => data.json())
                  .then((data) => {
                    if (data?.status === "forbidden") {
                      window.alert("ผู้ใช้ไม่ถูกต้อง");
                      localStorage.clear();
                    } else {
                      console.log(data);
                      window.alert("แก้ไขสำเร็จ");
                      setShowModal(false);
                    }
                    window.location.reload();
                  });
                // formRef.current.submit();
              }}
            >
              บันทึก "รู้จักวัดด่าน"
            </Button>
            <hr style={{ width: "100%" }} />
            <SubHeader>ภาพหน้าแรก</SubHeader>
            <Button
              onClick={() => {
                setShowModal(true);
                setModalState("createHighlight");
              }}
              variant="primary"
            >
              เพิ่มภาพหน้าแรก
            </Button>
            <div style={{ maxHeight: "400px", overflow: "scroll" }}>
              <DataTable
                data={highlight}
                type="highlight"
                setModalEditData={setModalEditData}
                setModalState={setModalState}
                setShowModal={setShowModal}
                onEdit={(row) => {
                  setModalCaption(row?.data?.caption);
                  setModalTitleName(row?.data?.title);
                  setModalTitleImage(row?.data?.titleImageURL);
                  setModalTitleImageFile(null);
                  setModalTitleImageFileB64(null);
                  setIsTitleImageEdited(false);
                }}
              />
            </div>
            <hr style={{ width: "100%" }} />

            <SubHeader>ข่าวและกิจกรรม</SubHeader>
            <Button
              onClick={() => {
                setShowModal(true);
                setModalState("createActivity");
              }}
              variant="primary"
            >
              เพิ่มกิจกรรม
            </Button>
            <div style={{ maxHeight: "400px", overflow: "scroll" }}>
              <DataTable
                data={activities}
                type="activity"
                setModalEditData={setModalEditData}
                setModalState={setModalState}
                setShowModal={setShowModal}
                onEdit={(row) => {
                  setModalParagraphs(row?.data?.contents);
                  setModalCaption(row?.data?.caption);
                  setModalTitleName(row?.data?.title);
                  setModalTitleImage(row?.data?.titleImageURL);
                  setModalTitleImageFile(null);
                  setModalTitleImageFileB64(null);
                  setModalContentImages(row?.data?.contentImageURLs);
                  setModalContentImagesFiles(null);
                  setModalContentImagesB64(null);
                  setIsTitleImageEdited(false);
                  setIsContentImageEdited(false);
                }}
              />
            </div>
            <hr style={{ width: "100%" }} />

            <SubHeader>สื่อธรรม</SubHeader>
            <Button
              onClick={() => {
                setShowModal(true);
                setModalState("createMedia");
              }}
              variant="primary"
            >
              เพิ่มสื่อธรรม
            </Button>
            <div style={{ maxHeight: "400px", overflow: "scroll" }}>
              <DataTable
                data={media}
                type="media"
                setModalEditData={setModalEditData}
                setModalState={setModalState}
                setShowModal={setShowModal}
                onEdit={(row) => {
                  setModalParagraphs(row?.data?.contents);
                  setModalCaption(row?.data?.caption);
                  setModalTitleName(row?.data?.title);
                  setModalTitleImage(row?.data?.titleImageURL);
                  setModalTitleImageFile(null);
                  setModalTitleImageFileB64(null);
                  setIsTitleImageEdited(false);
                }}
              />
            </div>
            <hr style={{ width: "100%" }} />

            <SubHeader>ติดต่อสอบถาม</SubHeader>
            <Table striped bordered hover>
              <thead>
                <tr>
                  <td>ลำดับที่</td>
                  <td>ชื่อ</td>
                  <td>เบอร์โทร</td>
                </tr>
              </thead>
              <tbody>
                {contactContent?.data?.contents.map((cont, i) => {
                  const contact = JSON.parse(cont);
                  return (
                    <>
                      <tr>
                        <td>{i + 1}</td>
                        <td>
                          <Form.Control
                            onChange={(e) => {
                              contact["name"] = e.target.value;
                              contactContent.data.contents[i] =
                                JSON.stringify(contact);
                              setContactContent({ ...contactContent });
                            }}
                            value={contact["name"] || ""}
                            type="text"
                          />
                        </td>
                        <td>
                          <Form.Control
                            onChange={(e) => {
                              contact["phone"] = e.target.value;
                              contactContent.data.contents[i] =
                                JSON.stringify(contact);
                              setContactContent({ ...contactContent });
                            }}
                            value={contact["phone"] || ""}
                            type="text"
                          />
                        </td>
                      </tr>
                    </>
                  );
                })}
              </tbody>

              <Button
                variant="info"
                onClick={() => {
                  contactContent.data.contents = [
                    ...contactContent?.data?.contents,
                    "{}",
                  ];
                  setContactContent({ ...contactContent });
                }}
              >
                + เพิ่มเบอร์ติดต่อ
              </Button>
              <Button
                variant="danger"
                onClick={() => {
                  if (contactContent?.data?.contents.length > 1) {
                    contactContent.data.contents.splice(-1, 1);
                    setContactContent({ ...contactContent });
                  }
                }}
              >
                - ลบเบอร์ติดต่อ
              </Button>
            </Table>
            <Button
              variant="primary"
              onClick={() => {
                const postData = {};
                postData["type"] = "about";
                // postData["title"] = modalTitleName;
                // postData["caption"] = modalCaption;
                postData["contents"] = contactContent.data.contents;
                postData["isTitleImageEdited"] = false;
                postData["isContentImageEdited"] = false;

                console.log(postData);
                fetch(
                  "https://sycl7h5b43.execute-api.ap-southeast-1.amazonaws.com/admin/contents",
                  {
                    method: "put",
                    body: JSON.stringify({
                      type: "contact",
                      id: "2024-05-18 23:27:32",
                      action: "editData",
                      session: {
                        user: localStorage.getItem("user"),
                        auth: localStorage.getItem("auth"),
                      },
                      data: postData,
                    }),
                  }
                )
                  .then((data) => data.json())
                  .then((data) => {
                    if (data?.status === "forbidden") {
                      window.alert("ผู้ใช้ไม่ถูกต้อง");
                      localStorage.clear();
                    } else {
                      console.log(data);
                      window.alert("แก้ไขสำเร็จ");
                      setShowModal(false);
                    }
                    window.location.reload();
                  });
                // formRef.current.submit();
              }}
            >
              บันทึก "ข้อมูลการติดต่อ"
            </Button>
          </>
        ) : (
          <>
            <SubHeader>เข้าสู่ระบบ</SubHeader>
            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
              <Form.Label htmlFor="content-title">ชื่อผู้ใช้</Form.Label>
              <Form.Control
                onChange={(e) => setLoginUsername(e.target.value)}
                type="text"
                id="loginUsername"
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
              <Form.Label htmlFor="content-title">รหัสผ่าน</Form.Label>
              <Form.Control
                onChange={(e) => setLoginPassword(e.target.value)}
                type="password"
                id="loginPassword"
              />
            </Form.Group>
            <Button
              variant="success"
              onClick={() => {
                fetch(
                  "https://sycl7h5b43.execute-api.ap-southeast-1.amazonaws.com/admin/signin",
                  {
                    method: "post",
                    body: JSON.stringify({
                      username: loginUsername,
                      password: loginPassword,
                    }),
                  }
                )
                  .then((data) => data.json())
                  .then((data) => {
                    if (data?.["status"] === "forbidden") {
                      window.alert("ชื่อผู้ใช้หรือรหัสไม่ถูกต้อง");
                    } else {
                      // console.log(data);
                      localStorage.setItem("user", data?.data?.user);
                      localStorage.setItem("auth", data?.data?.auth);
                      window.location.reload();
                    }
                  })
                  .catch((e) => {
                    window.alert("ชื่อผู้ใช้หรือรหัสไม่ถูกต้อง");
                    // setUserSession(null);
                  });
              }}
            >
              เข้าสู่ระบบ
            </Button>
          </>
        )}
      </AdminContainer>

      <Modal
        show={showModal}
        animation={false}
        onHide={() => setShowModal(false)}
      >
        <Form ref={formRef}>
          <Modal.Header closeButton>
            <Modal.Title>
              {texts?.[modalState]?.title}{" "}
              {modalState.includes("edit") ? `${modalEditData["ind"] + 1}` : ""}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {(modalState === "createActivity" ||
              modalState === "editActivity") && (
              <>
                <Form.Group
                  className="mb-3"
                  controlId="exampleForm.ControlInput1"
                >
                  <Form.Label htmlFor="content-title">
                    {texts?.[modalState]?.name}
                  </Form.Label>
                  <Form.Control
                    onChange={(e) => setModalTitleName(e.target.value)}
                    value={modalTitleName}
                    type="text"
                    id="content-title"
                  />
                </Form.Group>
                <hr style={{ width: "100%" }} />

                <Form.Group
                  className="mb-3"
                  controlId="exampleForm.ControlInput1"
                >
                  <Form.Label htmlFor="content-title">
                    {texts?.[modalState]?.caption}
                  </Form.Label>
                  <Form.Control
                    onChange={(e) => setModalCaption(e.target.value)}
                    type="text"
                    value={modalCaption}
                    id="content-caption"
                  />
                </Form.Group>
                <hr style={{ width: "100%" }} />

                <div>
                  <img width={300} src={modalTitleImage} />
                </div>
                <Form.Label htmlFor="content-title">
                  {texts?.[modalState]?.titleImage}
                </Form.Label>
                <Form.Control
                  onChange={onImageChange}
                  type="file"
                  id="content-title"
                />
                <hr style={{ width: "100%" }} />

                <Form.Group
                  className="mb-3"
                  controlId="exampleForm.ControlInput1"
                >
                  <Form.Label htmlFor="content-title">
                    {texts?.[modalState]?.paragraphTitle}
                  </Form.Label>
                  {modalParagraphs.map((paragraph, i) => {
                    return (
                      <Form.Control
                        as="textarea"
                        value={paragraph}
                        onChange={(e) => {
                          modalParagraphs[i] = e.target.value;
                          setModalParagraphs([...modalParagraphs]);
                        }}
                      />
                    );
                  })}
                  <Button
                    variant="info"
                    onClick={() => {
                      setModalParagraphs([...modalParagraphs, ""]);
                    }}
                  >
                    + เพิ่มย่อหน้า
                  </Button>
                  <Button
                    variant="danger"
                    onClick={() => {
                      if (modalParagraphs.length > 1) {
                        modalParagraphs.splice(-1, 1);
                        setModalParagraphs([...modalParagraphs]);
                      }
                    }}
                  >
                    - ลบย่อหน้า
                  </Button>
                </Form.Group>
                <hr style={{ width: "100%" }} />

                <Form.Label htmlFor="content-images">
                  {texts?.[modalState]?.contentImages}
                </Form.Label>

                <Form.Control
                  onChange={onContentImagesChange}
                  type="file"
                  id="content-images"
                  multiple
                />

                <div>
                  {modalContentImages?.map((imgsrc) => {
                    return <img width={100} height={100} src={imgsrc} />;
                  })}
                </div>
              </>
            )}

            {(modalState === "createHighlight" ||
              modalState === "editHighlight") && (
              <>
                <Form.Group
                  className="mb-3"
                  controlId="exampleForm.ControlInput1"
                >
                  <Form.Label htmlFor="content-title">
                    {texts?.[modalState]?.name}
                  </Form.Label>
                  <Form.Control
                    onChange={(e) => setModalTitleName(e.target.value)}
                    type="text"
                    id="content-title"
                    value={modalTitleName}
                  />
                </Form.Group>
                <hr style={{ width: "100%" }} />

                <Form.Group
                  className="mb-3"
                  controlId="exampleForm.ControlInput1"
                >
                  <Form.Label htmlFor="content-title">
                    {texts?.[modalState]?.caption}
                  </Form.Label>
                  <Form.Control
                    onChange={(e) => setModalCaption(e.target.value)}
                    type="text"
                    id="content-caption"
                    value={modalCaption}
                  />
                </Form.Group>
                <hr style={{ width: "100%" }} />

                <div>
                  <img width={300} src={modalTitleImage} />
                </div>
                <Form.Label htmlFor="content-title">
                  {texts?.[modalState]?.titleImage}
                </Form.Label>
                <Form.Control
                  onChange={onImageChange}
                  type="file"
                  id="content-title"
                />
              </>
            )}

            {(modalState === "createMedia" || modalState === "editMedia") && (
              <>
                <Form.Group
                  className="mb-3"
                  controlId="exampleForm.ControlInput1"
                >
                  <Form.Label htmlFor="content-title">
                    {texts?.[modalState]?.name}
                  </Form.Label>
                  <Form.Control
                    onChange={(e) => setModalTitleName(e.target.value)}
                    type="text"
                    id="content-title"
                    value={modalTitleName}
                  />
                </Form.Group>
                <hr style={{ width: "100%" }} />

                <Form.Group
                  className="mb-3"
                  controlId="exampleForm.ControlInput1"
                >
                  <Form.Label htmlFor="content-title">
                    {texts?.[modalState]?.caption}
                  </Form.Label>
                  <Form.Control
                    onChange={(e) => setModalCaption(e.target.value)}
                    type="text"
                    id="content-caption"
                    value={modalCaption}
                  />
                </Form.Group>
                <hr style={{ width: "100%" }} />

                <div>
                  <img width={300} src={modalTitleImage} />
                </div>
                <Form.Label htmlFor="content-title">
                  {texts?.[modalState]?.titleImage}
                </Form.Label>
                <Form.Control
                  onChange={onImageChange}
                  type="file"
                  id="content-title"
                />

                <Form.Group
                  className="mb-3"
                  controlId="exampleForm.ControlInput1"
                >
                  <Form.Label htmlFor="content-title">
                    {texts?.[modalState]?.paragraphTitle}
                  </Form.Label>
                  {modalParagraphs.map((paragraph, i) => {
                    return (
                      <Form.Control
                        as="textarea"
                        onChange={(e) => {
                          modalParagraphs[i] = e.target.value;
                          setModalParagraphs([...modalParagraphs]);
                        }}
                        value={paragraph}
                      />
                    );
                  })}
                  <Button
                    variant="info"
                    onClick={() => {
                      setModalParagraphs([...modalParagraphs, ""]);
                    }}
                  >
                    + เพิ่มย่อหน้า
                  </Button>
                  <Button
                    variant="danger"
                    onClick={() => {
                      if (modalParagraphs.length > 1) {
                        modalParagraphs.splice(-1, 1);
                        setModalParagraphs([...modalParagraphs]);
                      }
                    }}
                  >
                    - ลบย่อหน้า
                  </Button>
                </Form.Group>
              </>
            )}
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowModal(false)}>
              ยกเลิก
            </Button>
            <Button
              variant="primary"
              onClick={() => {
                const postData = {};
                if (modalState.includes("create")) {
                  postData["session"] = {
                    user: localStorage.getItem("user"),
                    auth: localStorage.getItem("auth"),
                  };
                }
                postData["type"] = stateMap[modalState];
                postData["title"] = modalTitleName;
                postData["caption"] = modalCaption;

                if (
                  stateMap[modalState] === "activity" ||
                  stateMap[modalState] === "media"
                ) {
                  postData["contents"] = modalParagraphs;
                }

                postData["isTitleImageEdited"] = isTitleImageEdited;
                if (
                  modalState.includes("create") ||
                  (modalState.includes("edit") && isTitleImageEdited)
                ) {
                  postData["titleImage"] = {
                    name: modalTitleImageFile.name,
                    value: modalTitleImageFileB64,
                  };
                }

                postData["isContentImageEdited"] = isContentImageEdited;
                if (
                  stateMap[modalState] === "activity" &&
                  (modalState.includes("create") ||
                    (modalState.includes("edit") && isContentImageEdited))
                ) {
                  modalContentImagesFiles.map((f, j) => {
                    postData[`contentImage-${j}`] = {
                      name: f.name,
                      value: modalContentImagesB64[j],
                    };
                  });
                }

                console.log(postData);
                fetch(
                  "https://sycl7h5b43.execute-api.ap-southeast-1.amazonaws.com/admin/contents",
                  {
                    method: modalState.includes("edit") ? "put" : "post",
                    body: JSON.stringify(
                      modalState.includes("edit")
                        ? {
                            type: modalEditData.type,
                            id: modalEditData.id,
                            action: "editData",
                            session: {
                              user: localStorage.getItem("user"),
                              auth: localStorage.getItem("auth"),
                            },
                            data: postData,
                          }
                        : postData
                    ),
                  }
                )
                  .then((data) => data.json())
                  .then((data) => {
                    if (data?.status === "forbidden") {
                      window.alert("ผู้ใช้ไม่ถูกต้อง");
                      localStorage.clear();
                    } else {
                      console.log(data);
                      window.alert(
                        modalState.includes("edit")
                          ? "แก้ไขสำเร็จ"
                          : "เพิ่มสำเร็จ"
                      );
                      setShowModal(false);
                    }
                    window.location.reload();
                  });
                // formRef.current.submit();
              }}
            >
              บันทึก
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </>
  );
};
