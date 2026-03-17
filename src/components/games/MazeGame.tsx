"use client";

import { useCallback, useState } from "react";
import GameWrapper from "@/components/GameWrapper";

// 0=path, 1=wall, 2=start(player), 3=exit(goal)
const MAZES = [
  [
    [1,1,1,1,1,1,1],
    [1,2,0,0,0,0,1],
    [1,1,1,0,1,0,1],
    [1,0,0,0,1,0,1],
    [1,0,1,1,1,0,1],
    [1,0,0,0,0,3,1],
    [1,1,1,1,1,1,1],
  ],
  [
    [1,1,1,1,1,1,1],
    [1,2,1,0,0,0,1],
    [1,0,1,0,1,0,1],
    [1,0,0,0,1,0,1],
    [1,1,1,0,1,0,1],
    [1,0,0,0,0,3,1],
    [1,1,1,1,1,1,1],
  ],
  [
    [1,1,1,1,1,1,1],
    [1,2,0,0,1,0,1],
    [1,1,1,0,1,0,1],
    [1,0,0,0,0,0,1],
    [1,0,1,1,1,1,1],
    [1,0,0,0,0,3,1],
    [1,1,1,1,1,1,1],
  ],
];

export default function MazeGame() {
  const [mazeIdx, setMazeIdx] = useState(0);
  const [px, setPx] = useState(1);
  const [py, setPy] = useState(1);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [started, setStarted] = useState(false);
  const [moves, setMoves] = useState(0);

  const currentMaze = MAZES[mazeIdx % MAZES.length];

  const reset = useCallback(() => {
    setMazeIdx(0); setPx(1); setPy(1);
    setScore(0); setGameOver(false);
    setStarted(false); setMoves(0);
  }, []);

  const move = useCallback((dx: number, dy: number) => {
    if (!started || gameOver) return;
    const nx = px + dx;
    const ny = py + dy;
    if (ny < 0 || ny >= currentMaze.length || nx < 0 || nx >= currentMaze[0].length) return;
    const cell = currentMaze[ny][nx];
    if (cell === 1) return;
    setPx(nx); setPy(ny);
    setMoves((m) => m + 1);
    if (cell === 3) {
      const pts = Math.max(10, 50 - moves);
      setScore((s) => s + pts);
      setTimeout(() => {
        if (mazeIdx + 1 < MAZES.length) {
          setMazeIdx((i) => i + 1);
          setPx(1); setPy(1); setMoves(0);
        } else {
          setGameOver(true);
        }
      }, 500);
    }
  }, [started, gameOver, px, py, currentMaze, moves, mazeIdx]);

  const touchStart = useCallback((e: React.TouchEvent) => {
    const t = e.touches[0];
    const startX = t.clientX;
    const startY = t.clientY;
    const handleEnd = (e2: TouchEvent) => {
      const t2 = e2.changedTouches[0];
      const dx = t2.clientX - startX;
      const dy = t2.clientY - startY;
      if (Math.abs(dx) > Math.abs(dy)) {
        if (dx > 10) move(1, 0); else if (dx < -10) move(-1, 0);
      } else {
        if (dy > 10) move(0, 1); else if (dy < -10) move(0, -1);
      }
    };
    document.addEventListener("touchend", handleEnd, { once: true });
  }, [move]);

  const CELL = 48;

  return (
    <GameWrapper
      gameId="laberinto"
      gameName="Dribling"
      gameEmoji="🏃"
      color="#1ABC9C"
      benefit="Mejora la planificación espacial y el control motor"
      score={score}
      gameOver={gameOver}
      onRestart={reset}
    >
      <div
        className="relative w-full flex flex-col items-center"
        style={{
          minHeight: "calc(100vh - 56px)",
          background: "linear-gradient(135deg, #0a2a0a 0%, #0d3d0d 100%)",
        }}
      >
        {/* Field lines */}
        <div className="absolute inset-0 pointer-events-none opacity-5" style={{
          backgroundImage: "repeating-linear-gradient(0deg, transparent, transparent 47px, rgba(255,255,255,0.5) 47px, rgba(255,255,255,0.5) 48px)",
        }} />

        {!started && !gameOver && (
          <div className="absolute inset-0 flex flex-col items-center justify-center z-10 px-6">
            <div className="text-8xl mb-4 float-anim">🏃</div>
            <h2 className="text-3xl font-black text-white text-center mb-3">Dribling</h2>
            <p className="text-white/70 text-center mb-8 text-sm leading-relaxed">
              Lleva al jugador hasta la portería 🥅 esquivando los rivales.
              Usa los botones o desliza el dedo.
            </p>
            <button
              onClick={() => setStarted(true)}
              className="px-10 py-5 rounded-3xl text-2xl font-black text-white active:scale-95 transition-transform"
              style={{ background: "#1ABC9C" }}
            >
              ¡A JUGAR! ⚽
            </button>
          </div>
        )}

        {started && (
          <>
            <div className="text-center pt-3 pb-2 text-white/40 text-sm">
              Campo {mazeIdx + 1}/{MAZES.length}
            </div>

            <div className="mb-6" onTouchStart={touchStart} style={{ touchAction: "none" }}>
              {currentMaze.map((row, y) => (
                <div key={y} className="flex">
                  {row.map((cell, x) => (
                    <div
                      key={x}
                      style={{
                        width: CELL, height: CELL,
                        background: cell === 1 ? "rgba(26,188,156,0.15)" : "transparent",
                        border: cell === 1 ? "1px solid rgba(26,188,156,0.3)" : "1px solid rgba(255,255,255,0.04)",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        fontSize: 26, borderRadius: 4,
                      }}
                    >
                      {px === x && py === y ? "🏃" : cell === 3 ? "🥅" : cell === 1 ? "🟩" : ""}
                    </div>
                  ))}
                </div>
              ))}
            </div>

            {/* D-pad */}
            <div className="grid gap-2" style={{ gridTemplateColumns: "56px 56px 56px" }}>
              <div />
              <button onClick={() => move(0, -1)} className="w-14 h-14 rounded-xl text-2xl flex items-center justify-center active:scale-90 transition-transform font-black text-white" style={{ background: "rgba(26,188,156,0.3)", border: "2px solid rgba(26,188,156,0.5)" }}>↑</button>
              <div />
              <button onClick={() => move(-1, 0)} className="w-14 h-14 rounded-xl text-2xl flex items-center justify-center active:scale-90 transition-transform font-black text-white" style={{ background: "rgba(26,188,156,0.3)", border: "2px solid rgba(26,188,156,0.5)" }}>←</button>
              <div className="w-14 h-14 rounded-xl flex items-center justify-center text-2xl" style={{ background: "rgba(255,255,255,0.05)" }}>⚽</div>
              <button onClick={() => move(1, 0)} className="w-14 h-14 rounded-xl text-2xl flex items-center justify-center active:scale-90 transition-transform font-black text-white" style={{ background: "rgba(26,188,156,0.3)", border: "2px solid rgba(26,188,156,0.5)" }}>→</button>
              <div />
              <button onClick={() => move(0, 1)} className="w-14 h-14 rounded-xl text-2xl flex items-center justify-center active:scale-90 transition-transform font-black text-white" style={{ background: "rgba(26,188,156,0.3)", border: "2px solid rgba(26,188,156,0.5)" }}>↓</button>
              <div />
            </div>
          </>
        )}
      </div>
    </GameWrapper>
  );
}
