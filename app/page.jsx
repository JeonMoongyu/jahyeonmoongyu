"use client";
import { useState, useEffect } from "react";

const TOTAL = 32;

function shuffle(arr) {
  return [...arr].sort(() => Math.random() - 0.5);
}

export default function PhotoWorldCup() {
  const [round, setRound] = useState([]);
  const [nextRound, setNextRound] = useState([]);
  const [index, setIndex] = useState(0);
  const [winner, setWinner] = useState(null);

  // 1) 초기 사진 세팅
  useEffect(() => {
    const photos = Array.from({ length: TOTAL }, (_, i) =>
      `/photos/${String(i + 1).padStart(2, "0")}.jpg`
    );
    setRound(shuffle(photos));
  }, []);

  // 2) 우승이 결정되면 서버에 제출 (1회)
  useEffect(() => {
    if (!winner) return;

    // 같은 세션에서 중복 제출 방지
    const key = `submitted_winner:${winner}`;
    if (typeof window !== "undefined" && sessionStorage.getItem(key) === "1") return;
    if (typeof window !== "undefined") sessionStorage.setItem(key, "1");

    fetch("/api/submit", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ winner }),
    }).catch(() => {
      // 실패해도 사용자 경험은 그대로 진행
    });
  }, [winner]);

  // 우승 화면
  if (winner) {
    return (
      <div style={styles.container}>
        <h1 style={styles.title}>🏆 FINAL WINNER</h1>
        <img src={winner} style={styles.winner} alt="winner" />
        <p style={styles.text}>가장 많은 선택을 받은 우리의 순간</p>
        <button style={styles.button} onClick={() => location.reload()}>
          다시 하기
        </button>
      </div>
    );
  }

  // 라운드가 1장 남으면 우승 확정
  if (round.length === 1) {
    setWinner(round[0]);
    return null;
  }

  const current = round[index];
  const opponent = round[index + 1];

  const select = (img) => {
    const updated = [...nextRound, img];
    setNextRound(updated);

    if (index + 2 >= round.length) {
      setRound(updated);
      setNextRound([]);
      setIndex(0);
    } else {
      setIndex(index + 2);
    }
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.subtitle}>{round.length}강</h2>
      <div style={styles.vs}>
        <img
          src={current}
          style={styles.photo}
          onClick={() => select(current)}
          alt="left"
        />
        <span style={styles.vsText}>VS</span>
        <img
          src={opponent}
          style={styles.photo}
          onClick={() => select(opponent)}
          alt="right"
        />
      </div>
      <p style={styles.text}>사진을 눌러 선택해주세요</p>
    </div>
  );
}

const styles = {
  container: {
    minHeight: "100vh",
    background: "#FFF5F8",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
    textAlign: "center",
  },
  title: { fontSize: 28, marginBottom: 20 },
  subtitle: { fontSize: 20, marginBottom: 20 },
  vs: {
    display: "flex",
    gap: 12,
    alignItems: "center",
  },
  photo: {
    width: "45vw",
    maxWidth: 200,
    borderRadius: 16,
    cursor: "pointer",
    boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
  },
  vsText: { fontSize: 18, fontWeight: "bold" },
  winner: {
    width: "80%",
    maxWidth: 320,
    borderRadius: 20,
    marginBottom: 20,
  },
  text: { marginTop: 12, color: "#555" },
  button: {
    marginTop: 20,
    padding: "10px 20px",
    borderRadius: 20,
    border: "none",
    background: "#F48FB1",
    color: "white",
    fontSize: 16,
    cursor: "pointer",
  },
};
