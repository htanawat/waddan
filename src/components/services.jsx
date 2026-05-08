import React, { useEffect, useState } from "react";
import { LotusIcon } from "./icons";
import { CardGrid } from "./CardGrid";

export const Services = () => {
  const [activities, setActivities] = useState(null);

  useEffect(() => {
    fetch(
      "https://sycl7h5b43.execute-api.ap-southeast-1.amazonaws.com/admin/contents?type=activity"
    )
      .then((res) => res.json())
      .then((data) => {
        data.forEach((dj) => {
          dj.data = JSON.parse(dj.data);
        });
        setActivities(data);
      })
      .catch(() => setActivities([]));
  }, []);

  const items = (activities || []).filter((a) => a?.state === "active");
  const isLoading = activities === null;

  return (
    <section
      id="activities"
      className="cinematic-section cinematic-section--light reveal"
    >
      <div className="container" style={{ position: "relative", zIndex: 1 }}>
        <div className="text-center">
          <span className="cinematic-eyebrow">News &middot; Events</span>
          <h2 className="cinematic-title">ข่าวและกิจกรรม</h2>
          <div className="section-ornament" aria-hidden="true">
            <span className="section-ornament__line" />
            <LotusIcon className="section-ornament__icon" size={22} />
            <span className="section-ornament__line" />
          </div>
          <p className="cinematic-subtitle">
            ติดตามข่าวสารและกิจกรรมทางพระพุทธศาสนา ประเพณีและพิธีสำคัญของวัดด่าน พระราม 3
          </p>
        </div>

        <CardGrid items={items} basePath="activities" loading={isLoading} />
      </div>
    </section>
  );
};
