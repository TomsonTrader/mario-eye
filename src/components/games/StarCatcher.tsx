"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import GameWrapper from "@/components/GameWrapper";

interface Ball {
  id: number;
  x: number;
  y: number;
  size: number;
  speed: number;
  emoji: string;
}

const EMOJIS = ["⚽", "⚽", "⚽", "🏆", "⭐"];
let nextId = 0;

export default function StarCatcher() {
  const [balls, setBalls] = useState<Ball[]>([]);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [gameOver, setGameOver] = useState(false);
  const [started, setStarted] = useState(false);
  const [popped, setPopped] = useState<{ id: number; x: number; y: number }[]>([]);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const spawnRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const reset = useCallback(() => {
    setBalls([]);
    setScore(0);
    setTimeLeft(30);
    setGameOver(false);
    setStarted(false);
    setPopped([]);
    nextId = 0;
  }, []);

  const spawnBall = useCallback(() => {
    const ball: Ball = {
      id: nextId++,
      x: 5 + Math.random() * 85,
      y: -10,
      size: 36 + Math.random() * 20,
      speed: 14 + Math.random() * 18,
      emoji: EMOJIS[Math.floor(Math.random() * EMOJIS.length)],
    };
    setBalls((prev) => [...prev, ball]);
  }, []);

  useEffect(() => {
    if (!started || gameOver) return;
    const frame = setInterval(() => {
      setBalls((prev) =>
        prev.map((b) => ({ ...b, y: b.y + b.speed * 0.05 })).filter((b) => b.y < 110)
      );
    }, 50);
    return () => clearInterval(frame);
  }, [started, gameOver]);

  useEffect(() => {
    if (!started || gameOver) return;
    timerRef.current = setInterval(() => {
      setTimeLeft((t) => { if (t <= 1) { setGameOver(true); return 0; } return t - 1; });
    }, 1000);
    spawnRef.current = setInterval(spawnBall, 750);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (spawnRef.current) clearInterval(spawnRef.current);
    };
  }, [started, gameOver, spawnBall]);

  const tapBall = (id: number, x: number, y: number) => {
    setBalls((prev) => prev.filter((b) => b.id !== id));
    setScore((s) => s + 1);
    setPopped((p) => [...p, { id, x, y }]);
    setTimeout(() => setPopped((p) => p.filter((pp) => pp.id !== id)), 600);
  };

  return (
    <GameWrapper
      gameId="estrella"
      gameName="Cabecea el Balón"
      gameEmoji="⚽"
      color="#FFD700"
      benefit="Entrena la velocidad de reacción y el seguimiento visual"
      score={score}
      gameOver={gameOver}
      onRestart={reset}
      timeLeft={timeLeft}
    >
      <div className="relative w-full" style={{ minHeight: "calc(100vh - 56px)" }}>
        <div className="absolute inset-0" style={{ background: "linear-gradient(180deg, #1a1a3e 0%, #0d3d0d 60%, #0a2a0a 100%)" }} />
        <div className="absolute bottom-0 left-0 right-0" style={{ height: "25%", background: "rgba(255,255,255,0.03)", borderTop: "1px solid rgba(255,255,255,0.1)" }} />

        {!started && !gameOver && (
          <div className="absolute inset-0 flex flex-col items-center justify-center z-10 px-6">
            <div className="text-8xl mb-4 float-anim">⚽</div>
            <h2 className="text-3xl font-black text-white text-center mb-3">¡Cabecea el Balón!</h2>
            <p className="text-white/70 text-center mb-8 text-sm leading-relaxed">
              Los balones caen del cielo. ¡Tócalos antes de que lleguen al suelo!
            </p>
            <button
              onClick={() => setStarted(true)}
              className="px-10 py-5 rounded-3xl text-2xl font-black text-black active:scale-95 transition-transform"
              style={{ background: "#FFD700" }}
            >
              ¡A JUGAR! 🏟️
            </button>
          </div>
        )}

        {balls.map((ball) => (
          <button
            key={ball.id}
            onClick={() => tapBall(ball.id, ball.x, ball.y)}
            className="absolute"
            style={{
              left: `${ball.x}%`, top: `${ball.y}%`,
              fontSize: ball.size, transform: "translate(-50%, -50%)",
              background: "none", border: "none", cursor: "pointer", lineHeight: 1,
            }}
          >
            {ball.emoji}
          </button>
        ))}

        {popped.map((p) => (
          <div
            key={p.id}
            className="absolute pointer-events-none text-yellow-300 font-black text-xl"
            style={{
              left: `${p.x}%`, top: `${p.y}%`,
              transform: "translate(-50%, -50%)",
              animation: "bounce-in 0.6s ease-out forwards",
            }}
          >
            ¡GOL!
          </div>
        ))}

        <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/20" />
      </div>
    </GameWrapper>
  );
}
