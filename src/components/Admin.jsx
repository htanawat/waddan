import React, { useState, useEffect, useRef } from "react";
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";
import "bootstrap/dist/css/bootstrap.min.css";
import Logo from "../assets/img/logo.png";
import {
  PlusIcon,
  MinusIcon,
  PencilIcon,
  TrashIcon,
  SaveIcon,
  LogoutIcon,
  ImageIcon,
  NewspaperIcon,
  BookIcon,
  InfoIcon,
  PhoneIcon,
} from "./icons";

const API_BASE =
  "https://sycl7h5b43.execute-api.ap-southeast-1.amazonaws.com";

const stateMap = {
  createActivity: "activity",
  createHighlight: "highlight",
  createMedia: "media",
  editActivity: "activity",
  editHighlight: "highlight",
  editMedia: "media",
};

const formatDate = (raw) => {
  if (!raw) return "";
  // raw is "YYYY-MM-DD HH:MM:SS" — render Thai-friendly date + time
  const [d, t] = raw.split(" ");
  return `${d || ""}${t ? " · " + t.slice(0, 5) : ""}`;
};

const DataTable = ({
  data,
  type,
  setModalEditData,
  setModalState,
  setShowModal,
  onEdit,
}) => {
  if (!data || data.length === 0) {
    return (
      <div className="admin-empty">ยังไม่มีรายการ — กดปุ่มเพิ่มเพื่อเริ่มต้น</div>
    );
  }
  return (
    <div className="admin-table-wrap">
      <table className="admin-table">
        <thead>
          <tr>
            <th>#</th>
            <th>วันที่เพิ่ม</th>
            <th>ชื่อเรื่อง</th>
            <th>รูปปก</th>
            <th>แสดง</th>
            <th style={{ textAlign: "right" }}>การจัดการ</th>
          </tr>
        </thead>
        <tbody>
          {data.map((row, i) => (
            <tr key={row.timestamp || i}>
              <td className="admin-table__index">{i + 1}</td>
              <td className="admin-table__date">{formatDate(row.timestamp)}</td>
              <td className="admin-table__title">{row.data?.title}</td>
              <td>
                {row.data?.titleImageURL && (
                  <img
                    className="admin-table__thumb"
                    src={row.data.titleImageURL}
                    alt=""
                  />
                )}
              </td>
              <td>
                <Form.Check
                  className="admin-toggle"
                  type="switch"
                  id={`switch-${type}-${i}`}
                  onChange={(e) => {
                    fetch(`${API_BASE}/admin/contents`, {
                      method: "put",
                      body: JSON.stringify({
                        type,
                        id: row.timestamp,
                        action: "setActive",
                        data: e.target.checked ? "active" : "inactive",
                        session: {
                          user: localStorage.getItem("user"),
                          auth: localStorage.getItem("auth"),
                        },
                      }),
                    })
                      .then((d) => d.json())
                      .then((d) => {
                        if (d?.status === "forbidden") {
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
                <div className="admin-table__actions">
                  <button
                    type="button"
                    className="admin-btn admin-btn--gold admin-btn--sm"
                    onClick={() => {
                      setModalEditData({
                        id: row.timestamp,
                        type,
                        ind: i,
                      });
                      if (type === "activity") setModalState("editActivity");
                      else if (type === "highlight")
                        setModalState("editHighlight");
                      else setModalState("editMedia");
                      onEdit(row);
                      setShowModal(true);
                    }}
                  >
                    <PencilIcon size={14} />
                    <span>แก้ไข</span>
                  </button>
                  <button
                    type="button"
                    className="admin-btn admin-btn--danger admin-btn--sm"
                    onClick={() => {
                      if (window.confirm(`ลบ "${row.data.title}" ?`)) {
                        fetch(`${API_BASE}/admin/contents`, {
                          method: "delete",
                          body: JSON.stringify({
                            type,
                            id: row.timestamp,
                            session: {
                              user: localStorage.getItem("user"),
                              auth: localStorage.getItem("auth"),
                            },
                          }),
                        })
                          .then((d) => d.json())
                          .then((d) => {
                            if (d?.status === "forbidden") {
                              window.alert("ผู้ใช้ไม่ถูกต้อง");
                              localStorage.clear();
                            } else {
                              window.alert("ลบข้อมูลเรียบร้อย");
                            }
                            window.location.reload();
                          });
                      }
                    }}
                  >
                    <TrashIcon size={14} />
                    <span>ลบ</span>
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

const SectionCard = ({ icon, title, sub, action, children, footer }) => (
  <section className="admin-section">
    <header className="admin-section__head">
      <div className="admin-section__title-wrap">
        <span className="admin-section__icon">{icon}</span>
        <div>
          <h2 className="admin-section__title">{title}</h2>
          {sub && <p className="admin-section__sub">{sub}</p>}
        </div>
      </div>
      {action}
    </header>
    <div className="admin-section__body">{children}</div>
    {footer && <div className="admin-section__footer">{footer}</div>}
  </section>
);

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
      `${API_BASE}/content?type=about&id=${encodeURIComponent(
        "2024-05-18 23:27:32"
      )}`
    )
      .then((res) => res.json())
      .then((data) => {
        if (data.length === 1) {
          data[0].data = JSON.parse(data[0].data);
          setAboutContent(data[0]);
        }
      });

    fetch(
      `${API_BASE}/content?type=contact&id=${encodeURIComponent(
        "2024-05-18 23:27:32"
      )}`
    )
      .then((res) => res.json())
      .then((data) => {
        if (data.length === 1) {
          data[0].data = JSON.parse(data[0].data);
          setContactContent(data[0]);
        }
      });
  }, []);

  useEffect(() => {
    fetch(`${API_BASE}/admin/contents?type=highlight`)
      .then((res) => res.json())
      .then((data) => {
        data.map((dj) => {
          dj.data = JSON.parse(dj.data);
          return dj;
        });
        setHighlight(data);
      })
      .catch(() => setUserSession(null));
  }, []);

  useEffect(() => {
    fetch(`${API_BASE}/admin/contents?type=activity`)
      .then((res) => res.json())
      .then((data) => {
        data.map((dj) => {
          dj.data = JSON.parse(dj.data);
          return dj;
        });
        setActivities(data);
      })
      .catch(() => setUserSession(null));
  }, []);

  useEffect(() => {
    fetch(`${API_BASE}/admin/contents?type=media`)
      .then((res) => res.json())
      .then((data) => {
        data.map((dj) => {
          dj.data = JSON.parse(dj.data);
          return dj;
        });
        setMedia(data);
      })
      .catch(() => setUserSession(null));
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
      [...e.target.files].map(async (f) => {
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

  const handleLogout = () => {
    if (window.confirm("ต้องการออกจากระบบ ?")) {
      localStorage.clear();
      window.location.reload();
    }
  };

  const handleLogin = () => {
    fetch(`${API_BASE}/admin/signin`, {
      method: "post",
      body: JSON.stringify({
        username: loginUsername,
        password: loginPassword,
      }),
    })
      .then((d) => d.json())
      .then((d) => {
        if (d?.["status"] === "forbidden") {
          window.alert("ชื่อผู้ใช้หรือรหัสไม่ถูกต้อง");
        } else {
          localStorage.setItem("user", d?.data?.user);
          localStorage.setItem("auth", d?.data?.auth);
          window.location.reload();
        }
      })
      .catch(() => window.alert("ชื่อผู้ใช้หรือรหัสไม่ถูกต้อง"));
  };

  // ---------- LOGIN VIEW ----------
  if (!userSession) {
    return (
      <div className="admin-page">
        <div className="admin-login">
          <div className="admin-login__card">
            <div className="admin-login__brand">
              <img src={Logo} alt="วัดด่าน พระราม 3" />
              <h2 className="admin-login__brand-name">วัดด่าน พระราม 3</h2>
              <span className="admin-login__brand-sub">Admin Panel</span>
            </div>
            <h1 className="admin-login__title">เข้าสู่ระบบ</h1>
            <p className="admin-login__hint">
              สำหรับผู้ดูแลเว็บไซต์เท่านั้น
            </p>
            <form
              className="admin-login__form"
              onSubmit={(e) => {
                e.preventDefault();
                handleLogin();
              }}
            >
              <div className="admin-field">
                <label className="admin-label" htmlFor="loginUsername">
                  ชื่อผู้ใช้
                </label>
                <input
                  id="loginUsername"
                  className="admin-input"
                  type="text"
                  autoComplete="username"
                  value={loginUsername}
                  onChange={(e) => setLoginUsername(e.target.value)}
                />
              </div>
              <div className="admin-field">
                <label className="admin-label" htmlFor="loginPassword">
                  รหัสผ่าน
                </label>
                <input
                  id="loginPassword"
                  className="admin-input"
                  type="password"
                  autoComplete="current-password"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                />
              </div>
              <button
                type="submit"
                className="admin-btn admin-btn--primary"
                style={{ marginTop: 8, justifyContent: "center" }}
              >
                เข้าสู่ระบบ
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  // ---------- DASHBOARD VIEW ----------
  return (
    <div className="admin-page">
      <header className="admin-topbar">
        <div className="admin-topbar__inner">
          <a href="/" className="admin-topbar__brand" aria-label="หน้าแรก">
            <img src={Logo} alt="" />
            <span className="admin-topbar__brand-text">
              <span className="admin-topbar__brand-name">วัดด่าน พระราม 3</span>
              <span className="admin-topbar__brand-sub">Admin</span>
            </span>
          </a>
          <h1 className="admin-topbar__title">จัดการเนื้อหา</h1>
          <button
            type="button"
            className="admin-btn admin-btn--danger"
            onClick={handleLogout}
          >
            <LogoutIcon size={16} />
            <span>ออกจากระบบ</span>
          </button>
        </div>
      </header>

      <div className="admin-shell">
        {/* About */}
        <SectionCard
          icon={<InfoIcon size={20} />}
          title="รู้จักวัดด่าน"
          sub="ข้อความแนะนำวัด ที่แสดงในส่วน About บนหน้าแรก"
          footer={
            <button
              type="button"
              className="admin-btn admin-btn--primary"
              onClick={() => {
                const postData = {};
                postData["type"] = "about";
                postData["contents"] = [aboutContent.data.contents[0]];
                postData["isTitleImageEdited"] = false;
                postData["isContentImageEdited"] = false;

                fetch(`${API_BASE}/admin/contents`, {
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
                })
                  .then((d) => d.json())
                  .then((d) => {
                    if (d?.status === "forbidden") {
                      window.alert("ผู้ใช้ไม่ถูกต้อง");
                      localStorage.clear();
                    } else {
                      window.alert("บันทึกสำเร็จ");
                      setShowModal(false);
                    }
                    window.location.reload();
                  });
              }}
            >
              <SaveIcon size={16} />
              <span>บันทึก</span>
            </button>
          }
        >
          <textarea
            className="admin-textarea admin-textarea--lg"
            value={aboutContent?.data?.contents[0] || ""}
            onChange={(e) => {
              if (!aboutContent) return;
              aboutContent.data.contents[0] = e.target.value;
              setAboutContent({ ...aboutContent });
            }}
            placeholder="พิมพ์ข้อความแนะนำวัด..."
          />
        </SectionCard>

        {/* Highlights */}
        <SectionCard
          icon={<ImageIcon size={20} />}
          title="ภาพหน้าแรก"
          sub="ภาพไฮไลต์สลับโชว์บนหน้าแรกของเว็บ"
          action={
            <button
              type="button"
              className="admin-btn admin-btn--primary"
              onClick={() => {
                setModalTitleName("");
                setModalCaption("");
                setModalTitleImage(null);
                setModalTitleImageFile(null);
                setModalTitleImageFileB64(null);
                setIsTitleImageEdited(false);
                setShowModal(true);
                setModalState("createHighlight");
              }}
            >
              <PlusIcon size={16} />
              <span>เพิ่มภาพหน้าแรก</span>
            </button>
          }
        >
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
        </SectionCard>

        {/* Activities */}
        <SectionCard
          icon={<NewspaperIcon size={20} />}
          title="ข่าวและกิจกรรม"
          sub="ประกาศ ข่าวสาร และกิจกรรมของวัด"
          action={
            <button
              type="button"
              className="admin-btn admin-btn--primary"
              onClick={() => {
                setModalTitleName("");
                setModalCaption("");
                setModalTitleImage(null);
                setModalTitleImageFile(null);
                setModalTitleImageFileB64(null);
                setModalParagraphs([""]);
                setModalContentImages([]);
                setModalContentImagesFiles(null);
                setModalContentImagesB64(null);
                setIsTitleImageEdited(false);
                setIsContentImageEdited(false);
                setShowModal(true);
                setModalState("createActivity");
              }}
            >
              <PlusIcon size={16} />
              <span>เพิ่มกิจกรรม</span>
            </button>
          }
        >
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
        </SectionCard>

        {/* Media */}
        <SectionCard
          icon={<BookIcon size={20} />}
          title="สื่อธรรม"
          sub="บทความและสื่อธรรมเพื่อการพิจารณา"
          action={
            <button
              type="button"
              className="admin-btn admin-btn--primary"
              onClick={() => {
                setModalTitleName("");
                setModalCaption("");
                setModalTitleImage(null);
                setModalTitleImageFile(null);
                setModalTitleImageFileB64(null);
                setModalParagraphs([""]);
                setIsTitleImageEdited(false);
                setShowModal(true);
                setModalState("createMedia");
              }}
            >
              <PlusIcon size={16} />
              <span>เพิ่มสื่อธรรม</span>
            </button>
          }
        >
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
        </SectionCard>

        {/* Contact */}
        <SectionCard
          icon={<PhoneIcon size={20} />}
          title="ติดต่อสอบถาม"
          sub="เบอร์ติดต่อที่แสดงในส่วนติดต่อสอบถาม"
          action={
            <div style={{ display: "flex", gap: 8 }}>
              <button
                type="button"
                className="admin-btn admin-btn--ghost admin-btn--sm"
                onClick={() => {
                  if (!contactContent) return;
                  contactContent.data.contents = [
                    ...contactContent?.data?.contents,
                    "{}",
                  ];
                  setContactContent({ ...contactContent });
                }}
              >
                <PlusIcon size={14} />
                <span>เพิ่มเบอร์</span>
              </button>
              <button
                type="button"
                className="admin-btn admin-btn--danger admin-btn--sm"
                onClick={() => {
                  if (
                    contactContent?.data?.contents.length > 1 &&
                    window.confirm("ลบเบอร์ติดต่อล่าสุด ?")
                  ) {
                    contactContent.data.contents.splice(-1, 1);
                    setContactContent({ ...contactContent });
                  }
                }}
              >
                <MinusIcon size={14} />
                <span>ลบเบอร์ล่าสุด</span>
              </button>
            </div>
          }
          footer={
            <button
              type="button"
              className="admin-btn admin-btn--primary"
              onClick={() => {
                const postData = {};
                postData["type"] = "about";
                postData["contents"] = contactContent.data.contents;
                postData["isTitleImageEdited"] = false;
                postData["isContentImageEdited"] = false;

                fetch(`${API_BASE}/admin/contents`, {
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
                })
                  .then((d) => d.json())
                  .then((d) => {
                    if (d?.status === "forbidden") {
                      window.alert("ผู้ใช้ไม่ถูกต้อง");
                      localStorage.clear();
                    } else {
                      window.alert("บันทึกสำเร็จ");
                      setShowModal(false);
                    }
                    window.location.reload();
                  });
              }}
            >
              <SaveIcon size={16} />
              <span>บันทึกข้อมูลติดต่อ</span>
            </button>
          }
        >
          {(contactContent?.data?.contents || []).length === 0 ? (
            <div className="admin-empty">ยังไม่มีเบอร์ติดต่อ</div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {contactContent?.data?.contents.map((cont, i) => {
                let contact;
                try {
                  contact = JSON.parse(cont);
                } catch (e) {
                  contact = {};
                }
                return (
                  <div className="admin-contact-row" key={i}>
                    <span className="admin-contact-row__index">{i + 1}.</span>
                    <input
                      className="admin-input"
                      placeholder="ตำแหน่ง / ชื่อ"
                      type="text"
                      value={contact.name || ""}
                      onChange={(e) => {
                        contact["name"] = e.target.value;
                        contactContent.data.contents[i] =
                          JSON.stringify(contact);
                        setContactContent({ ...contactContent });
                      }}
                    />
                    <input
                      className="admin-input"
                      placeholder="เบอร์โทรศัพท์"
                      type="tel"
                      value={contact.phone || ""}
                      onChange={(e) => {
                        contact["phone"] = e.target.value;
                        contactContent.data.contents[i] =
                          JSON.stringify(contact);
                        setContactContent({ ...contactContent });
                      }}
                    />
                  </div>
                );
              })}
            </div>
          )}
        </SectionCard>
      </div>

      {/* ---- MODAL ---- */}
      <Modal
        show={showModal}
        animation
        centered
        size="lg"
        dialogClassName="admin-modal"
        onHide={() => setShowModal(false)}
      >
        <Form ref={formRef}>
          <Modal.Header closeButton>
            <Modal.Title>
              {texts?.[modalState]?.title}
              {modalState.includes("edit") && modalEditData
                ? ` #${modalEditData.ind + 1}`
                : ""}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {(modalState === "createActivity" ||
              modalState === "editActivity") && (
              <>
                <div className="admin-field">
                  <label className="admin-label" htmlFor="content-title">
                    {texts?.[modalState]?.name}
                  </label>
                  <input
                    id="content-title"
                    className="admin-input"
                    type="text"
                    value={modalTitleName || ""}
                    onChange={(e) => setModalTitleName(e.target.value)}
                  />
                </div>

                <div className="admin-field">
                  <label className="admin-label" htmlFor="content-caption">
                    {texts?.[modalState]?.caption}
                  </label>
                  <input
                    id="content-caption"
                    className="admin-input"
                    type="text"
                    value={modalCaption || ""}
                    onChange={(e) => setModalCaption(e.target.value)}
                  />
                </div>

                <div className="admin-field">
                  <label className="admin-label">
                    {texts?.[modalState]?.titleImage}
                  </label>
                  {modalTitleImage && (
                    <img src={modalTitleImage} alt="" style={{ maxWidth: 320 }} />
                  )}
                  <input
                    type="file"
                    className="admin-file"
                    accept="image/*"
                    onChange={onImageChange}
                  />
                </div>

                <div className="admin-field">
                  <label className="admin-label">
                    {texts?.[modalState]?.paragraphTitle}
                  </label>
                  <div className="admin-modal__paragraph-stack">
                    {modalParagraphs.map((paragraph, i) => (
                      <textarea
                        key={i}
                        className="admin-textarea"
                        value={paragraph}
                        onChange={(e) => {
                          modalParagraphs[i] = e.target.value;
                          setModalParagraphs([...modalParagraphs]);
                        }}
                        placeholder={`ย่อหน้าที่ ${i + 1}`}
                      />
                    ))}
                  </div>
                  <div className="admin-modal__pair" style={{ marginTop: 8 }}>
                    <button
                      type="button"
                      className="admin-btn admin-btn--ghost admin-btn--sm"
                      onClick={() =>
                        setModalParagraphs([...modalParagraphs, ""])
                      }
                    >
                      <PlusIcon size={14} />
                      <span>เพิ่มย่อหน้า</span>
                    </button>
                    <button
                      type="button"
                      className="admin-btn admin-btn--danger admin-btn--sm"
                      onClick={() => {
                        if (modalParagraphs.length > 1) {
                          modalParagraphs.splice(-1, 1);
                          setModalParagraphs([...modalParagraphs]);
                        }
                      }}
                    >
                      <MinusIcon size={14} />
                      <span>ลบย่อหน้าล่าสุด</span>
                    </button>
                  </div>
                </div>

                <div className="admin-field">
                  <label className="admin-label">
                    {texts?.[modalState]?.contentImages}
                  </label>
                  <input
                    type="file"
                    className="admin-file"
                    accept="image/*"
                    multiple
                    onChange={onContentImagesChange}
                  />
                  {modalContentImages?.length > 0 && (
                    <div className="admin-modal__image-grid">
                      {modalContentImages.map((imgsrc, i) => (
                        <img key={i} src={imgsrc} alt="" />
                      ))}
                    </div>
                  )}
                </div>
              </>
            )}

            {(modalState === "createHighlight" ||
              modalState === "editHighlight") && (
              <>
                <div className="admin-field">
                  <label className="admin-label" htmlFor="content-title">
                    {texts?.[modalState]?.name}
                  </label>
                  <input
                    id="content-title"
                    className="admin-input"
                    type="text"
                    value={modalTitleName || ""}
                    onChange={(e) => setModalTitleName(e.target.value)}
                  />
                </div>

                <div className="admin-field">
                  <label className="admin-label" htmlFor="content-caption">
                    {texts?.[modalState]?.caption}
                  </label>
                  <input
                    id="content-caption"
                    className="admin-input"
                    type="text"
                    value={modalCaption || ""}
                    onChange={(e) => setModalCaption(e.target.value)}
                  />
                </div>

                <div className="admin-field">
                  <label className="admin-label">
                    {texts?.[modalState]?.titleImage}
                  </label>
                  {modalTitleImage && (
                    <img src={modalTitleImage} alt="" style={{ maxWidth: 320 }} />
                  )}
                  <input
                    type="file"
                    className="admin-file"
                    accept="image/*"
                    onChange={onImageChange}
                  />
                </div>
              </>
            )}

            {(modalState === "createMedia" || modalState === "editMedia") && (
              <>
                <div className="admin-field">
                  <label className="admin-label" htmlFor="content-title">
                    {texts?.[modalState]?.name}
                  </label>
                  <input
                    id="content-title"
                    className="admin-input"
                    type="text"
                    value={modalTitleName || ""}
                    onChange={(e) => setModalTitleName(e.target.value)}
                  />
                </div>

                <div className="admin-field">
                  <label className="admin-label" htmlFor="content-caption">
                    {texts?.[modalState]?.caption}
                  </label>
                  <input
                    id="content-caption"
                    className="admin-input"
                    type="text"
                    value={modalCaption || ""}
                    onChange={(e) => setModalCaption(e.target.value)}
                  />
                </div>

                <div className="admin-field">
                  <label className="admin-label">
                    {texts?.[modalState]?.titleImage}
                  </label>
                  {modalTitleImage && (
                    <img src={modalTitleImage} alt="" style={{ maxWidth: 320 }} />
                  )}
                  <input
                    type="file"
                    className="admin-file"
                    accept="image/*"
                    onChange={onImageChange}
                  />
                </div>

                <div className="admin-field">
                  <label className="admin-label">
                    {texts?.[modalState]?.paragraphTitle}
                  </label>
                  <div className="admin-modal__paragraph-stack">
                    {modalParagraphs.map((paragraph, i) => (
                      <textarea
                        key={i}
                        className="admin-textarea"
                        value={paragraph}
                        onChange={(e) => {
                          modalParagraphs[i] = e.target.value;
                          setModalParagraphs([...modalParagraphs]);
                        }}
                        placeholder={`ย่อหน้าที่ ${i + 1}`}
                      />
                    ))}
                  </div>
                  <div className="admin-modal__pair" style={{ marginTop: 8 }}>
                    <button
                      type="button"
                      className="admin-btn admin-btn--ghost admin-btn--sm"
                      onClick={() =>
                        setModalParagraphs([...modalParagraphs, ""])
                      }
                    >
                      <PlusIcon size={14} />
                      <span>เพิ่มย่อหน้า</span>
                    </button>
                    <button
                      type="button"
                      className="admin-btn admin-btn--danger admin-btn--sm"
                      onClick={() => {
                        if (modalParagraphs.length > 1) {
                          modalParagraphs.splice(-1, 1);
                          setModalParagraphs([...modalParagraphs]);
                        }
                      }}
                    >
                      <MinusIcon size={14} />
                      <span>ลบย่อหน้าล่าสุด</span>
                    </button>
                  </div>
                </div>
              </>
            )}
          </Modal.Body>
          <Modal.Footer>
            <button
              type="button"
              className="admin-btn admin-btn--ghost"
              onClick={() => setShowModal(false)}
            >
              ยกเลิก
            </button>
            <button
              type="button"
              className="admin-btn admin-btn--primary"
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
                    name: modalTitleImageFile?.name,
                    value: modalTitleImageFileB64,
                  };
                }

                postData["isContentImageEdited"] = isContentImageEdited;
                if (
                  stateMap[modalState] === "activity" &&
                  (modalState.includes("create") ||
                    (modalState.includes("edit") && isContentImageEdited))
                ) {
                  modalContentImagesFiles?.map((f, j) => {
                    postData[`contentImage-${j}`] = {
                      name: f.name,
                      value: modalContentImagesB64[j],
                    };
                    return f;
                  });
                }

                fetch(`${API_BASE}/admin/contents`, {
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
                })
                  .then((d) => d.json())
                  .then((d) => {
                    if (d?.status === "forbidden") {
                      window.alert("ผู้ใช้ไม่ถูกต้อง");
                      localStorage.clear();
                    } else {
                      window.alert(
                        modalState.includes("edit")
                          ? "แก้ไขสำเร็จ"
                          : "เพิ่มสำเร็จ"
                      );
                      setShowModal(false);
                    }
                    window.location.reload();
                  });
              }}
            >
              <SaveIcon size={16} />
              <span>บันทึก</span>
            </button>
          </Modal.Footer>
        </Form>
      </Modal>
    </div>
  );
};
