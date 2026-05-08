import React, { useEffect, useState } from "react";
import { LotusIcon } from "./icons";
import { CardGrid } from "./CardGrid";

export const Media = () => {
  const [media, setMedia] = useState(null);

  useEffect(() => {
    fetch(
      "https://sycl7h5b43.execute-api.ap-southeast-1.amazonaws.com/admin/contents?type=media"
    )
      .then((res) => res.json())
      .then((data) => {
        data.forEach((dj) => {
          dj.data = JSON.parse(dj.data);
        });
        setMedia(data);
      })
      .catch(() => setMedia([]));
  }, []);

  const items = (media || []).filter((m) => m?.state === "active");
  const isLoading = media === null;

  return (
    <section
      id="media"
      className="cinematic-section cinematic-section--dark reveal"
    >
      <div className="container" style={{ position: "relative", zIndex: 1 }}>
        <div className="text-center">
          <span className="cinematic-eyebrow">Dharma &middot; Reflections</span>
          <h2 className="cinematic-title">สื่อธรรม</h2>
          <div className="section-ornament" aria-hidden="true">
            <span className="section-ornament__line" />
            <LotusIcon className="section-ornament__icon" size={22} />
            <span className="section-ornament__line" />
          </div>
          <p className="cinematic-subtitle" style={{ color: "rgba(251, 244, 230, 0.78)" }}>
            บทความและสื่อธรรมเพื่อการพิจารณา ฝึกฝนจิตใจ และดำเนินชีวิตตามวิถีพุทธ
          </p>
        </div>

        <CardGrid items={items} basePath="media" loading={isLoading} />
      </div>
    </section>
  );
};
