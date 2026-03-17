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
  const vxRef = useRef(0.6 + Math.random() * 0.5);
  const vyRef = useRef(0.4 + Math.random() * 0.5);
  const trailId = useRef(0);

  const moveRef = useCallback(() => {
    setBx((x) => {
      let nx = x + vxRef.current;
      if (nx > 88 || nx < 5) { vxRef.current *= -1; nx = x + vxRef.current; }
      return nx;
    });
    setBy((y) => {
      let ny = y + vyRef.current;
      if (ny > 88 || ny < 10) { vyRef.current *= -1; ny = y + vyRef.current; }
      return ny;
    });
    if (Math.random() < 0.03) vxRef.current = (Math.random() * 1.4 - 0.7);
    if (Math.random() < 0.03) vyRef.current = (Math.random() * 1.2 - 0.6);
  }, []);

  useEffect(() => {
    if (!started || gameOver) return;
    const frame = setInterval(moveRef, 50);
    return () => clearInterval(frame);
  }, [started, gameOver, moveRef]);

  useEffect(() => {
    if (!started || gameOver) return;
    const t = setInterval(() => {
      const id = trailId.current++;
      setBx((x) => { setBy((y) => { setTrail((prev) => [...prev.slice(-5), { x, y, id }]); return y; }); return x; });
    }, 100);
    return () => clearInterval(t);
  }, [started, gameOver]);

  useEffect(() => {
    if (!started || gameOver) return;
    const timer = setInterval(() => {
      setTimeLeft((t) => { if (t <= 1) { setGameOver(true); return 0; } return t - 1; });
    }, 1000);
    return () => clearInterval(timer);
  }, [started, gameOver]);

  const tapBall = () => {
    if (!started || gameOver) return;
    setCaught(true);
    setScore((s) => s + 1);
    setTimeout(() => setCaught(false), 400);
  };

  const reset = useCallback(() => {
    setBx(50); setBy(50);
    setScore(0); setTimeLeft(30);
    setGameOver(false); setStarted(false);
    setCaught(false); setTrail([]);
    vxRef.current = 0.6 + Math.random() * 0.5;
    vyRef.current = 0.4 + Math.random() * 0.5;
  }, []);

  return (
    <GameWrapper
      gameId="mariposa"
      gameName="Sigue el Balón"
      gameEmoji="⚽"
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
          background: "linear-gradient(180deg, #0d3d0d 0%, #1a5c1a 40%, #0d3d0d 100%)",
        }}
      >
        {/* Field markings */}
        <div className="absolute inset-0 pointer-events-none opacity-10">
          <div className="absolute" style={{ top: "50%", left: "10%", right: "10%", height: "1px", background: "white" }} />
          <div className="absolute rounded-full" style={{ top: "25%", left: "30%", right: "30%", bottom: "25%", border: "1px solid white" }} />
        </div>

        {!started && !gameOver && (
          <div className="absolute inset-0 flex flex-col items-center justify-center z-10 px-6">
            <div className="text-8xl mb-4 float-anim">⚽</div>
            <h2 className="text-3xl font-black text-white text-center mb-3">Sigue el Balón</h2>
            <p className="text-white/70 text-center mb-8 text-sm leading-relaxed">
              El balón bota por el campo. ¡Tócalo cuantas veces puedas en 30 segundos!
            </p>
            <button
              onClick={() => setStarted(true)}
              className="px-10 py-5 rounded-3xl text-2xl font-black text-white active:scale-95 transition-transform"
              style={{ background: "#E67E22" }}
            >
              ¡A JUGAR! 🏃
            </button>
          </div>
        )}

        {/* Ball trail */}
        {trail.map((t, i) => (
          <div
            key={t.id}
            className="absolute pointer-events-none"
            style={{
              left: `${t.x}%`, top: `${t.y}%`,
              transform: "translate(-50%, -50%)",
              fontSize: 10 + i * 3,
              opacity: (i + 1) / trail.length * 0.3,
            }}
          >
            ·
          </div>
        ))}

        {/* Ball */}
        <button
          onClick={tapBall}
          className="absolute"
          style={{
            left: `${bx}%`, top: `${by}%`,
            transform: `translate(-50%, -50%) scale(${caught ? 1.3 : 1})`,
            background: "none", border: "none", cursor: "pointer",
            fontSize: 52, lineHeight: 1,
            transition: "transform 0.15s ease",
            filter: caught ? "drop-shadow(0 0 12px #FFD700)" : "drop-shadow(0 2px 4px rgba(0,0,0,0.5))",
          }}
        >
          ⚽
        </button>

        {caught && (
          <div
            className="absolute pointer-events-none font-black text-xl text-yellow-300"
            style={{
              left: `${bx}%`, top: `${by - 10}%`,
              transform: "translate(-50%, -50%)",
              animation: "bounce-in 0.5s ease-out forwards",
            }}
          >
            +1 ⚡
          </div>
        )}
      </div>
    </GameWrapper>
  );
}
