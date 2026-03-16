"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import GameWrapper from "@/components/GameWrapper";

export default function FollowButterfly() {
  const [bx, setBx] = useState(50);
  const [by, setBy] = useState(50);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [gameOver, setGameOver] = useState(false);
  const [started, setStarted] = useState(false);
  const [caught, setCaught] = useState(false);
  const [trail, setTrail] = useState<{ x: number; y: number; id: number }[]>([]);
  const vxRef = useRef(0.5 + Math.random() * 0.5);
  const vyRef = useRef(0.3 + Math.random() * 0.5);
  const trailId = useRef(0);

  const moveButterfly = useCallback(() => {
    setBx((x) => {
      let nx = x + vxRef.current;
      if (nx > 88 || nx < 5) {
        vxRef.current *= -1;
        nx = x + vxRef.current;
      }
      return nx;
    });
    setBy((y) => {
      let ny = y + vyRef.current;
      if (ny > 88 || ny < 10) {
        vyRef.current *= -1;
        ny = y + vyRef.current;
      }
      return ny;
    });
    // Random direction changes
    if (Math.random() < 0.03) vxRef.current = (Math.random() * 1.2 - 0.6);
    if (Math.random() < 0.03) vyRef.current = (Math.random() * 1.0 - 0.5);
  }, []);

  useEffect(() => {
    if (!started || gameOver) return;
    const frame = setInterval(moveButterfly, 50);
    return () => clearInterval(frame);
  }, [started, gameOver, moveButterfly]);

  // Trail
  useEffect(() => {
    if (!started || gameOver) return;
    const t = setInterval(() => {
      const id = trailId.current++;
      setBx((x) => {
        setBy((y) => {
          setTrail((prev) => [...prev.slice(-6), { x, y, id }]);
          return y;
        });
        return x;
      });
    }, 100);
    return () => clearInterval(t);
  }, [started, gameOver]);

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

  const tapButterfly = () => {
    if (!started || gameOver) return;
    setCaught(true);
    setScore((s) => s + 1);
    setTimeout(() => setCaught(false), 400);
  };

  const reset = useCallback(() => {
    setBx(50);
    setBy(50);
    setScore(0);
    setTimeLeft(30);
    setGameOver(false);
    setStarted(false);
    setCaught(false);
    setTrail([]);
    vxRef.current = 0.5 + Math.random() * 0.5;
    vyRef.current = 0.3 + Math.random() * 0.5;
  }, []);

  return (
    <GameWrapper
      gameId="mariposa"
      gameName="Sigue la Mariposa"
      gameEmoji="🦋"
      color="#E67E22"
      benefit="Mejora el seguimiento suave y la persecución visual"
      score={score}
      gameOver={gameOver}
      onRestart={reset}
      timeLeft={timeLeft}
    >
      <div
        className="relative w-full overflow-hidden"
        style={{
          minHeight: "calc(100vh - 56px)",
          background: "linear-gradient(180deg, #87CEEB 0%, #98FB98 70%, #228B22 100%)",
        }}
      >
        {/* Flowers in background */}
        <div className="absolute bottom-4 left-4 text-3xl opacity-40">🌸</div>
        <div className="absolute bottom-8 right-8 text-2xl opacity-30">🌺</div>
        <div className="absolute bottom-2 left-20 text-4xl opacity-35">🌼</div>

        {!started && !gameOver && (
          <div className="absolute inset-0 flex flex-col items-center justify-center z-10 px-6">
            <div className="text-8xl mb-4 float-anim">🦋</div>
            <h2 className="text-3xl font-black text-gray-800 text-center mb-3">
              Sigue la Mariposa
            </h2>
            <p className="text-gray-600 text-center mb-8 text-sm leading-relaxed">
              La mariposa vuela por el jardín. ¡Tócala cuantas veces puedas en 30 segundos!
            </p>
            <button
              onClick={() => setStarted(true)}
              className="px-10 py-5 rounded-3xl text-2xl font-black text-white active:scale-95 transition-transform"
              style={{ background: "#E67E22" }}
            >
              ¡JUGAR! 🌸
            </button>
          </div>
        )}

        {/* Trail */}
        {trail.map((t, i) => (
          <div
            key={t.id}
            className="absolute pointer-events-none"
            style={{
              left: `${t.x}%`,
              top: `${t.y}%`,
              transform: "translate(-50%, -50%)",
              fontSize: 12 + i * 2,
              opacity: (i + 1) / trail.length * 0.4,
            }}
          >
            ✨
          </div>
        ))}

        {/* Butterfly */}
        <button
          onClick={tapButterfly}
          className="absolute transition-none"
          style={{
            left: `${bx}%`,
            top: `${by}%`,
            transform: `translate(-50%, -50%) scale(${caught ? 1.4 : 1})`,
            background: "none",
            border: "none",
            cursor: "pointer",
            fontSize: 52,
            lineHeight: 1,
            transition: "transform 0.15s ease",
            filter: caught ? "brightness(1.5)" : "none",
          }}
        >
          🦋
        </button>

        {caught && (
          <div
            className="absolute pointer-events-none font-black text-2xl text-orange-500"
            style={{
              left: `${bx}%`,
              top: `${by - 8}%`,
              transform: "translate(-50%, -50%)",
              animation: "bounce-in 0.5s ease-out forwards",
            }}
          >
            +1 ✨
          </div>
        )}
      </div>
    </GameWrapper>
  );
}
