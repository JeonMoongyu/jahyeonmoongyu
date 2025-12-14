"use client";
import { useEffect, useState } from "react";

export default function StatsPage() {
  const [data, setData] = useState(null);

  useEffect(() => {
    fetch("/api/stats").then((r) => r.json()).then(setData);
  }, []);

  if (!data) return <div style={{ padding: 20 }}>불러오는 중...</div>;

  return (
    <div style={{ padding: 20, fontFamily: "system-ui" }}>
      <h1>📊 사진 월드컵 통계</h1>
      <p>총 참여: {data.total}회</p>
      <ol>
        {data.stats.map((x) => (
          <li key={x.id} style={{ marginBottom: 10 }}>
            <b>{x.id}.jpg</b> — {x.wins}표
          </li>
        ))}
      </ol>
    </div>
  );
}
