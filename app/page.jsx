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

  useEffect(() => {
    const photos = Array.from({ length: TOTAL }, (_, i) =>
      `/photos/${String(i + 1).padStart(2, "0")}.jpg`
    );
    setRound(shuffle(photos));
  }, []);

  if (winner) {
    return (
      <div style={styles.container}>
        <h1 style={styles.title}>🏆 FINAL WINNER</h1>
        <img src={winner} style={styles.winner} />
        <p style={styles.text}>가장 많은 선택을 받은 우리의 순간</p>
        <button style={styles.button} onClick={() => location.reload()}>
          다시 하기
        </button>
      </div>
    );
  }

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
      <h2 style={styles.subtitle}>
        {round.length}강
      </h2>
      <div style={styles.vs}>
        <img src={current} style={styles.photo} onClick={() => select(current)} />
        <span style={styles.vsText}>VS</span>
        <img src={opponent} style={styles.photo} onClick={() => select(opponent)} />
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
