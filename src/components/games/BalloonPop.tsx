"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import GameWrapper from "@/components/GameWrapper";

interface ShotBall {
  id: number;
  x: number;
  y: number;
  color: string;
  size: number;
  speed: number;
  angle: number;
}

const JERSEY_COLORS = ["#FF6B6B", "#FFD700", "#00C3FF", "#FF85C8", "#7BFF7B", "#FF9500"];
let bid = 0;

export default function BalloonPop() {
  const [balls, setBalls] = useState<ShotBall[]>([]);
  const [score, setScore] = useState(0);
  const [missed, setMissed] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [gameOver, setGameOver] = useState(false);
  const [started, setStarted] = useState(false);
  const [pops, setPops] = useState<{ id: number; x: number; y: number }[]>([]);

  const reset = useCallback(() => {
    setBalls([]);
    setScore(0);
    setMissed(0);
    setTimeLeft(30);
    setGameOver(false);
    setStarted(false);
    setPops([]);
    bid = 0;
  }, []);

  const spawnBall = useCallback(() => {
    const b: ShotBall = {
      id: bid++,
      x: 10 + Math.random() * 80,
      y: 110,
      color: JERSEY_COLORS[Math.floor(Math.random() * JERSEY_COLORS.length)],
      size: 44 + Math.random() * 16,
      speed: 0.7 + Math.random() * 0.9,
      angle: -5 + Math.random() * 10,
    };
    setBalls((prev) => [...prev, b]);
  }, []);

  useEffect(() => {
    if (!started || gameOver) return;
    const frame = setInterval(() => {
      setBalls((prev) => {
        const escaped = prev.filter((b) => b.y < -10);
        if (escaped.length > 0) {
          setMissed((m) => {
            const nm = m + escaped.length;
            if (nm >= 5) setGameOver(true);
            return nm;
          });
        }
        return prev.map((b) => ({ ...b, y: b.y - b.speed, x: b.x + b.angle * 0.01 })).filter((b) => b.y >= -10);
      });
    }, 50);
    return () => clearInterval(frame);
  }, [started, gameOver]);

  useEffect(() => {
    if (!started || gameOver) return;
    const timer = setInterval(() => {
      setTimeLeft((t) => { if (t <= 1) { setGameOver(true); return 0; } return t - 1; });
    }, 1000);
    const spawner = setInterval(spawnBall, 850);
    return () => { clearInterval(timer); clearInterval(spawner); };
  }, [started, gameOver, spawnBall]);

  const save = (b: ShotBall) => {
    setBalls((prev) => prev.filter((bb) => bb.id !== b.id));
    setScore((s) => s + 1);
    setPops((p) => [...p, { id: b.id, x: b.x, y: b.y }]);
    setTimeout(() => setPops((p) => p.filter((pp) => pp.id !== b.id)), 500);
  };

  return (
    <GameWrapper
      gameId="globos"
      gameName="Para el Penalti"
      gameEmoji="🥅"
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
          background: "linear-gradient(180deg, #1a2a4a 0%, #0d3d0d 50%, #0a2a0a 100%)",
        }}
      >
        {/* Stadium crowd */}
        <div className="absolute top-0 left-0 right-0 text-center text-4xl opacity-10 pointer-events-none" style={{ letterSpacing: "-4px" }}>
          👥👥👥👥👥👥👥👥👥👥
        </div>

        {/* Goal post at bottom */}
        <div className="absolute bottom-0 left-0 right-0 flex justify-center pointer-events-none" style={{ height: "20%" }}>
          <div className="relative w-4/5" style={{ border: "3px solid rgba(255,255,255,0.4)", borderBottom: "none", borderRadius: "4px 4px 0 0" }} />
        </div>

        {!started && !gameOver && (
          <div className="absolute inset-0 flex flex-col items-center justify-center z-10 px-6">
            <div className="text-8xl mb-4 float-anim">🥅</div>
            <h2 className="text-3xl font-black text-white text-center mb-3">¡Para el Penalti!</h2>
            <p className="text-white/70 text-center mb-8 text-sm leading-relaxed">
              Los balones van hacia tu portería. ¡Tócalos para pararlos!
              No dejes que entren más de 5.
            </p>
            <button
              onClick={() => setStarted(true)}
              className="px-10 py-5 rounded-3xl text-2xl font-black text-white active:scale-95 transition-transform"
              style={{ background: "#FF6B6B" }}
            >
              ¡A JUGAR! 🧤
            </button>
          </div>
        )}

        {started && (
          <div className="absolute top-3 left-4 flex gap-1">
            {Array.from({ length: 5 }).map((_, i) => (
              <span key={i} className="text-xl">{i < missed ? "❌" : "🥅"}</span>
            ))}
          </div>
        )}

        {balls.map((b) => (
          <button
            key={b.id}
            onClick={() => save(b)}
            className="absolute active:scale-125 transition-transform"
            style={{
              left: `${b.x}%`, top: `${b.y}%`,
              transform: "translate(-50%, -50%)",
              background: "none", border: "none", cursor: "pointer",
              fontSize: b.size, lineHeight: 1,
            }}
          >
            ⚽
          </button>
        ))}

        {pops.map((p) => (
          <div
            key={p.id}
            className="absolute pointer-events-none font-black text-2xl text-green-300"
            style={{
              left: `${p.x}%`, top: `${p.y}%`,
              transform: "translate(-50%, -50%)",
              animation: "bounce-in 0.5s ease-out forwards",
            }}
          >
            🧤 ¡Parado!
          </div>
        ))}
      </div>
    </GameWrapper>
  );
}
