"use client";

import { useCallback, useState } from "react";
import GameWrapper from "@/components/GameWrapper";

// Dot sequences that form simple shapes
const SHAPES = [
  {
    name: "Estrella",
    emoji: "⭐",
    dots: [
      { x: 50, y: 10 }, { x: 70, y: 70 }, { x: 20, y: 35 },
      { x: 80, y: 35 }, { x: 30, y: 70 },
    ],
  },
  {
    name: "Casa",
    emoji: "🏠",
    dots: [
      { x: 50, y: 10 }, { x: 20, y: 45 }, { x: 20, y: 85 },
      { x: 50, y: 85 }, { x: 80, y: 85 }, { x: 80, y: 45 },
    ],
  },
  {
    name: "Cohete",
    emoji: "🚀",
    dots: [
      { x: 50, y: 8 }, { x: 68, y: 40 }, { x: 65, y: 75 },
      { x: 50, y: 85 }, { x: 35, y: 75 }, { x: 32, y: 40 },
    ],
  },
  {
    name: "Corazón",
    emoji: "❤️",
    dots: [
      { x: 50, y: 75 }, { x: 15, y: 35 }, { x: 28, y: 15 },
      { x: 50, y: 28 }, { x: 72, y: 15 }, { x: 85, y: 35 },
    ],
  },
  {
    name: "Pez",
    emoji: "🐟",
    dots: [
      { x: 15, y: 50 }, { x: 35, y: 25 }, { x: 60, y: 15 },
      { x: 80, y: 30 }, { x: 85, y: 50 }, { x: 80, y: 70 },
      { x: 60, y: 82 }, { x: 35, y: 75 },
    ],
  },
];

export default function ConnectDots() {
  const [shapeIdx, setShapeIdx] = useState(0);
  const [nextDot, setNextDot] = useState(0);
  const [connected, setConnected] = useState<number[]>([]);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [started, setStarted] = useState(false);
  const [flash, setFlash] = useState<number | null>(null);

  const shape = SHAPES[shapeIdx % SHAPES.length];

  const reset = useCallback(() => {
    setShapeIdx(0);
    setNextDot(0);
    setConnected([]);
    setScore(0);
    setGameOver(false);
    setStarted(false);
    setFlash(null);
  }, []);

  const tapDot = (idx: number) => {
    if (!started || gameOver) return;
    if (idx !== nextDot) return;

    setFlash(idx);
    setConnected((prev) => [...prev, idx]);
    setTimeout(() => setFlash(null), 300);

    const newNext = nextDot + 1;
    if (newNext >= shape.dots.length) {
      // Shape complete
      setScore((s) => s + shape.dots.length * 5);
      setTimeout(() => {
        const nextShape = shapeIdx + 1;
        if (nextShape >= SHAPES.length) {
          setGameOver(true);
        } else {
          setShapeIdx(nextShape);
          setNextDot(0);
          setConnected([]);
        }
      }, 800);
    } else {
      setNextDot(newNext);
    }
  };

  return (
    <GameWrapper
      gameId="puntos"
      gameName="Conecta los Puntos"
      gameEmoji="✏️"
      color="#3498DB"
      benefit="Entrena el seguimiento visual y la secuenciación"
      score={score}
      gameOver={gameOver}
      onRestart={reset}
    >
      <div
        className="relative w-full flex flex-col items-center"
        style={{
          minHeight: "calc(100vh - 56px)",
          background: "linear-gradient(135deg, #001a3d 0%, #000d1f 100%)",
        }}
      >
        {!started && !gameOver && (
          <div className="absolute inset-0 flex flex-col items-center justify-center z-10 px-6">
            <div className="text-8xl mb-4 float-anim">✏️</div>
            <h2 className="text-3xl font-black text-white text-center mb-3">
              Conecta los Puntos
            </h2>
            <p className="text-white/70 text-center mb-8 text-sm leading-relaxed">
              Toca los puntos en orden del 1 al último para revelar el dibujo secreto.
            </p>
            <button
              onClick={() => setStarted(true)}
              className="px-10 py-5 rounded-3xl text-2xl font-black text-white active:scale-95 transition-transform"
              style={{ background: "#3498DB" }}
            >
              ¡JUGAR! ✨
            </button>
          </div>
        )}

        {started && (
          <>
            <div className="text-center pt-3 pb-1">
              <span className="text-white/60 text-sm">
                Forma {shapeIdx + 1}/{SHAPES.length}: {shape.name} {shape.emoji}
              </span>
            </div>
            <p className="text-white/40 text-xs text-center mb-2">
              Toca el punto número <strong className="text-yellow-300 text-lg">{nextDot + 1}</strong>
            </p>

            {/* SVG canvas */}
            <div className="relative w-full" style={{ height: "55vw", maxHeight: 340 }}>
              <svg
                className="absolute inset-0 w-full h-full"
                viewBox="0 0 100 100"
                preserveAspectRatio="xMidYMid meet"
              >
                {/* Lines between connected dots */}
                {connected.slice(0, -1).map((_, i) => (
                  <line
                    key={i}
                    x1={shape.dots[i].x}
                    y1={shape.dots[i].y}
                    x2={shape.dots[i + 1].x}
                    y2={shape.dots[i + 1].y}
                    stroke="#3498DB"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                  />
                ))}

                {/* Dots */}
                {shape.dots.map((dot, idx) => {
                  const isDone = connected.includes(idx);
                  const isNext = idx === nextDot;
                  const isFlash = flash === idx;
                  return (
                    <g key={idx} onClick={() => tapDot(idx)} style={{ cursor: "pointer" }}>
                      <circle
                        cx={dot.x}
                        cy={dot.y}
                        r={isNext ? 5 : 4}
                        fill={isDone ? "#3498DB" : isNext ? "#FFD700" : "rgba(255,255,255,0.3)"}
                        stroke={isNext ? "#FFD700" : isDone ? "#3498DB" : "rgba(255,255,255,0.5)"}
                        strokeWidth={isFlash ? 2 : 1}
                      />
                      {!isDone && (
                        <text
                          x={dot.x}
                          y={dot.y + 0.5}
                          textAnchor="middle"
                          dominantBaseline="middle"
                          fontSize="3.5"
                          fill={isNext ? "#000" : "rgba(255,255,255,0.7)"}
                          fontWeight="bold"
                        >
                          {idx + 1}
                        </text>
                      )}
                      {isDone && (
                        <text
                          x={dot.x}
                          y={dot.y + 0.5}
                          textAnchor="middle"
                          dominantBaseline="middle"
                          fontSize="4"
                          fill="white"
                        >
                          ✓
                        </text>
                      )}
                    </g>
                  );
                })}
              </svg>
            </div>

            {/* Enlarged tap targets below */}
            <div className="grid grid-cols-4 gap-3 px-4 mt-2">
              {shape.dots.map((_, idx) => {
                const isDone = connected.includes(idx);
                const isNext = idx === nextDot;
                return (
                  <button
                    key={idx}
                    onClick={() => tapDot(idx)}
                    className="py-4 rounded-xl font-black text-xl active:scale-90 transition-all"
                    style={{
                      background: isDone
                        ? "rgba(52, 152, 219, 0.4)"
                        : isNext
                        ? "rgba(255, 215, 0, 0.3)"
                        : "rgba(255,255,255,0.05)",
                      border: isDone
                        ? "2px solid #3498DB"
                        : isNext
                        ? "2px solid #FFD700"
                        : "1px solid rgba(255,255,255,0.1)",
                      color: isDone ? "#3498DB" : isNext ? "#FFD700" : "rgba(255,255,255,0.3)",
                    }}
                  >
                    {isDone ? "✓" : idx + 1}
                  </button>
                );
              })}
            </div>
          </>
        )}
      </div>
    </GameWrapper>
  );
}
