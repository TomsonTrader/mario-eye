"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import GameWrapper from "@/components/GameWrapper";

interface Star {
  id: number;
  x: number;
  y: number;
  size: number;
  speed: number;
  emoji: string;
  born: number;
}

const EMOJIS = ["⭐", "🌟", "✨", "💫", "⚡"];
let nextId = 0;

export default function StarCatcher() {
  const [stars, setStars] = useState<Star[]>([]);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [gameOver, setGameOver] = useState(false);
  const [started, setStarted] = useState(false);
  const [popped, setPopped] = useState<{ id: number; x: number; y: number }[]>([]);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const spawnRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const reset = useCallback(() => {
    setStars([]);
    setScore(0);
    setTimeLeft(30);
    setGameOver(false);
    setStarted(false);
    setPopped([]);
    nextId = 0;
  }, []);

  const spawnStar = useCallback(() => {
    const star: Star = {
      id: nextId++,
      x: 5 + Math.random() * 85,
      y: -10,
      size: 32 + Math.random() * 24,
      speed: 15 + Math.random() * 20,
      emoji: EMOJIS[Math.floor(Math.random() * EMOJIS.length)],
      born: Date.now(),
    };
    setStars((prev) => [...prev, star]);
  }, []);

  // Fall animation
  useEffect(() => {
    if (!started || gameOver) return;
    const frame = setInterval(() => {
      setStars((prev) =>
        prev
          .map((s) => ({ ...s, y: s.y + s.speed * 0.05 }))
          .filter((s) => s.y < 110)
      );
    }, 50);
    return () => clearInterval(frame);
  }, [started, gameOver]);

  useEffect(() => {
    if (!started || gameOver) return;
    timerRef.current = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          setGameOver(true);
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    spawnRef.current = setInterval(spawnStar, 800);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (spawnRef.current) clearInterval(spawnRef.current);
    };
  }, [started, gameOver, spawnStar]);

  const tapStar = (id: number, x: number, y: number) => {
    setStars((prev) => prev.filter((s) => s.id !== id));
    setScore((s) => s + 1);
    setPopped((p) => [...p, { id, x, y }]);
    setTimeout(() => setPopped((p) => p.filter((pp) => pp.id !== id)), 600);
  };

  return (
    <GameWrapper
      gameId="estrella"
      gameName="Caza Estrellas"
      gameEmoji="⭐"
      color="#FFD700"
      benefit="Entrena la velocidad de reacción y el seguimiento visual"
      score={score}
      gameOver={gameOver}
      onRestart={reset}
      timeLeft={timeLeft}
    >
      <div className="relative w-full h-full" style={{ minHeight: "calc(100vh - 56px)" }}>
        {/* Stars background gradient */}
        <div
          className="absolute inset-0"
          style={{
            background: "radial-gradient(ellipse at top, #1a1a6e 0%, #0f0f2e 60%)",
          }}
        />

        {!started && !gameOver && (
          <div className="absolute inset-0 flex flex-col items-center justify-center z-10 px-6">
            <div className="text-8xl mb-4 float-anim">⭐</div>
            <h2 className="text-3xl font-black text-white text-center mb-3">
              ¡Caza las Estrellas!
            </h2>
            <p className="text-white/70 text-center mb-8 text-sm leading-relaxed">
              Toca las estrellas antes de que caigan al suelo.
              ¡Coge todas las que puedas en 30 segundos!
            </p>
            <button
              onClick={() => setStarted(true)}
              className="px-10 py-5 rounded-3xl text-2xl font-black text-black active:scale-95 transition-transform shadow-lg"
              style={{ background: "#FFD700" }}
            >
              ¡JUGAR! 🚀
            </button>
          </div>
        )}

        {/* Falling stars */}
        {stars.map((star) => (
          <button
            key={star.id}
            onClick={() => tapStar(star.id, star.x, star.y)}
            className="absolute transition-none active:scale-110"
            style={{
              left: `${star.x}%`,
              top: `${star.y}%`,
              fontSize: star.size,
              transform: "translate(-50%, -50%)",
              background: "none",
              border: "none",
              cursor: "pointer",
              lineHeight: 1,
            }}
          >
            {star.emoji}
          </button>
        ))}

        {/* Pop effects */}
        {popped.map((p) => (
          <div
            key={p.id}
            className="absolute pointer-events-none text-yellow-300 font-black text-2xl"
            style={{
              left: `${p.x}%`,
              top: `${p.y}%`,
              transform: "translate(-50%, -50%)",
              animation: "bounce-in 0.6s ease-out forwards",
            }}
          >
            +1
          </div>
        ))}

        {/* Ground line */}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-red-500/30" />
      </div>
    </GameWrapper>
  );
}
