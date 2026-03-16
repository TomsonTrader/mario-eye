"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import GameWrapper from "@/components/GameWrapper";

interface Balloon {
  id: number;
  x: number;
  y: number;
  color: string;
  size: number;
  speed: number;
}

const COLORS = ["#FF6B6B", "#FFD700", "#00C3FF", "#FF85C8", "#7BFF7B", "#FF9500"];
let bid = 0;

export default function BalloonPop() {
  const [balloons, setBalloons] = useState<Balloon[]>([]);
  const [score, setScore] = useState(0);
  const [missed, setMissed] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [gameOver, setGameOver] = useState(false);
  const [started, setStarted] = useState(false);
  const [pops, setPops] = useState<{ id: number; x: number; y: number; color: string }[]>([]);

  const reset = useCallback(() => {
    setBalloons([]);
    setScore(0);
    setMissed(0);
    setTimeLeft(30);
    setGameOver(false);
    setStarted(false);
    setPops([]);
    bid = 0;
  }, []);

  const spawnBalloon = useCallback(() => {
    const b: Balloon = {
      id: bid++,
      x: 5 + Math.random() * 80,
      y: 110,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      size: 44 + Math.random() * 20,
      speed: 0.6 + Math.random() * 0.8,
    };
    setBalloons((prev) => [...prev, b]);
  }, []);

  // Float upward
  useEffect(() => {
    if (!started || gameOver) return;
    const frame = setInterval(() => {
      setBalloons((prev) => {
        const escaped = prev.filter((b) => b.y < -10);
        if (escaped.length > 0) {
          setMissed((m) => {
            const newMissed = m + escaped.length;
            if (newMissed >= 5) setGameOver(true);
            return newMissed;
          });
        }
        return prev
          .map((b) => ({ ...b, y: b.y - b.speed }))
          .filter((b) => b.y >= -10);
      });
    }, 50);
    return () => clearInterval(frame);
  }, [started, gameOver]);

  useEffect(() => {
    if (!started || gameOver) return;
    const timer = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) { setGameOver(true); return 0; }
        return t - 1;
      });
    }, 1000);
    const spawner = setInterval(spawnBalloon, 900);
    return () => { clearInterval(timer); clearInterval(spawner); };
  }, [started, gameOver, spawnBalloon]);

  const pop = (b: Balloon) => {
    setBalloons((prev) => prev.filter((bb) => bb.id !== b.id));
    setScore((s) => s + 1);
    setPops((p) => [...p, { id: b.id, x: b.x, y: b.y, color: b.color }]);
    setTimeout(() => setPops((p) => p.filter((pp) => pp.id !== b.id)), 500);
  };

  return (
    <GameWrapper
      gameId="globos"
      gameName="Pincha Globos"
      gameEmoji="🎈"
      color="#FF6B6B"
      benefit="Mejora la precisión y coordinación ojo-mano"
      score={score}
      gameOver={gameOver}
      onRestart={reset}
      timeLeft={timeLeft}
    >
      <div
        className="relative w-full"
        style={{
          minHeight: "calc(100vh - 56px)",
          background: "linear-gradient(180deg, #87CEEB 0%, #E0F7FF 100%)",
        }}
      >
        {/* Clouds */}
        <div className="absolute top-8 left-4 text-5xl opacity-30">☁️</div>
        <div className="absolute top-16 right-8 text-4xl opacity-20">☁️</div>
        <div className="absolute top-32 left-16 text-3xl opacity-25">☁️</div>

        {!started && !gameOver && (
          <div className="absolute inset-0 flex flex-col items-center justify-center z-10 px-6">
            <div className="text-8xl mb-4 float-anim">🎈</div>
            <h2 className="text-3xl font-black text-gray-800 text-center mb-3">
              ¡Pincha los Globos!
            </h2>
            <p className="text-gray-600 text-center mb-8 text-sm leading-relaxed">
              Los globos suben volando. ¡Tócalos para pincharlos!
              No dejes escapar más de 5 globos.
            </p>
            <button
              onClick={() => setStarted(true)}
              className="px-10 py-5 rounded-3xl text-2xl font-black text-white active:scale-95 transition-transform"
              style={{ background: "#FF6B6B" }}
            >
              ¡JUGAR! 🎉
            </button>
          </div>
        )}

        {/* Missed counter */}
        {started && (
          <div className="absolute top-3 left-4 flex gap-1">
            {Array.from({ length: 5 }).map((_, i) => (
              <span key={i} className="text-xl">{i < missed ? "💨" : "🎈"}</span>
            ))}
          </div>
        )}

        {/* Balloons */}
        {balloons.map((b) => (
          <button
            key={b.id}
            onClick={() => pop(b)}
            className="absolute active:scale-125 transition-transform"
            style={{
              left: `${b.x}%`,
              top: `${b.y}%`,
              transform: "translate(-50%, -50%)",
              background: "none",
              border: "none",
              cursor: "pointer",
              fontSize: b.size,
              lineHeight: 1,
            }}
          >
            🎈
          </button>
        ))}

        {/* Pop effects */}
        {pops.map((p) => (
          <div
            key={p.id}
            className="absolute pointer-events-none font-black text-2xl"
            style={{
              left: `${p.x}%`,
              top: `${p.y}%`,
              transform: "translate(-50%, -50%)",
              color: p.color,
              animation: "bounce-in 0.5s ease-out forwards",
            }}
          >
            💥
          </div>
        ))}
      </div>
    </GameWrapper>
  );
}
