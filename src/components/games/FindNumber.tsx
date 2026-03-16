"use client";

import { useCallback, useEffect, useState } from "react";
import GameWrapper from "@/components/GameWrapper";

function makeGrid(target: number) {
  const count = 25;
  const nums: number[] = [target];
  while (nums.length < count) {
    const n = Math.floor(Math.random() * 50) + 1;
    if (n !== target) nums.push(n);
  }
  return nums.sort(() => Math.random() - 0.5);
}

export default function FindNumber() {
  const [target, setTarget] = useState(() => Math.floor(Math.random() * 50) + 1);
  const [grid, setGrid] = useState<number[]>([]);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(45);
  const [gameOver, setGameOver] = useState(false);
  const [started, setStarted] = useState(false);
  const [flash, setFlash] = useState<number | null>(null);
  const [wrong, setWrong] = useState<number | null>(null);

  const nextRound = useCallback(() => {
    const newTarget = Math.floor(Math.random() * 50) + 1;
    setTarget(newTarget);
    setGrid(makeGrid(newTarget));
  }, []);

  const reset = useCallback(() => {
    const t = Math.floor(Math.random() * 50) + 1;
    setTarget(t);
    setGrid(makeGrid(t));
    setScore(0);
    setTimeLeft(45);
    setGameOver(false);
    setStarted(false);
  }, []);

  useEffect(() => {
    const t = Math.floor(Math.random() * 50) + 1;
    setTarget(t);
    setGrid(makeGrid(t));
  }, []);

  useEffect(() => {
    if (!started || gameOver) return;
    const timer = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) { setGameOver(true); return 0; }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [started, gameOver]);

  const tap = (idx: number, num: number) => {
    if (!started || gameOver) return;
    if (num === target) {
      setFlash(idx);
      setScore((s) => s + 1);
      setTimeout(() => {
        setFlash(null);
        nextRound();
      }, 400);
    } else {
      setWrong(idx);
      setTimeout(() => setWrong(null), 400);
    }
  };

  return (
    <GameWrapper
      gameId="numero"
      gameName="Busca el Número"
      gameEmoji="🔢"
      color="#2ECC71"
      benefit="Entrena la búsqueda visual y la discriminación"
      score={score}
      gameOver={gameOver}
      onRestart={reset}
      timeLeft={timeLeft}
    >
      <div
        className="relative w-full"
        style={{
          minHeight: "calc(100vh - 56px)",
          background: "linear-gradient(135deg, #003d1a 0%, #001a0d 100%)",
        }}
      >
        {!started && !gameOver && (
          <div className="absolute inset-0 flex flex-col items-center justify-center z-10 px-6">
            <div className="text-8xl mb-4 float-anim">🔢</div>
            <h2 className="text-3xl font-black text-white text-center mb-3">
              Busca el Número
            </h2>
            <p className="text-white/70 text-center mb-8 text-sm leading-relaxed">
              Te diré un número. ¡Encuéntralo entre todos los demás lo más rápido que puedas!
            </p>
            <button
              onClick={() => setStarted(true)}
              className="px-10 py-5 rounded-3xl text-2xl font-black text-white active:scale-95 transition-transform"
              style={{ background: "#2ECC71" }}
            >
              ¡JUGAR! 🔍
            </button>
          </div>
        )}

        {started && (
          <div className="p-4 flex flex-col items-center">
            {/* Target */}
            <div className="mb-4 text-center">
              <p className="text-white/60 text-sm mb-1">Encuentra el número</p>
              <div
                className="text-6xl font-black rounded-2xl px-8 py-3"
                style={{
                  color: "#2ECC71",
                  background: "rgba(46, 204, 113, 0.15)",
                  border: "2px solid rgba(46, 204, 113, 0.4)",
                }}
              >
                {target}
              </div>
            </div>

            {/* Grid */}
            <div className="grid grid-cols-5 gap-2 w-full max-w-xs">
              {grid.map((num, idx) => (
                <button
                  key={idx}
                  onClick={() => tap(idx, num)}
                  className="aspect-square rounded-xl text-lg font-black flex items-center justify-center active:scale-90 transition-all"
                  style={{
                    background:
                      flash === idx
                        ? "#2ECC71"
                        : wrong === idx
                        ? "#E74C3C"
                        : "rgba(255,255,255,0.1)",
                    color:
                      flash === idx || wrong === idx
                        ? "#fff"
                        : "rgba(255,255,255,0.9)",
                    border: "1px solid rgba(255,255,255,0.15)",
                    transform: flash === idx ? "scale(1.2)" : "scale(1)",
                  }}
                >
                  {num}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </GameWrapper>
  );
}
