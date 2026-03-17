"use client";

import { useCallback, useState } from "react";
import GameWrapper from "@/components/GameWrapper";

interface Puzzle {
  title: string;
  bg: string;
  elements: {
    emoji: string;
    x: number;
    y: number;
    size: number;
    inRight?: boolean;
    missingRight?: boolean;
  }[];
}

const PUZZLES: Puzzle[] = [
  {
    title: "El Partido",
    bg: "#0a2a0a",
    elements: [
      { emoji: "🏟️", x: 50, y: 12, size: 38 },
      { emoji: "👟", x: 20, y: 35, size: 28 },
      { emoji: "⚽", x: 50, y: 55, size: 30 },
      { emoji: "🧤", x: 75, y: 30, size: 26 },
      { emoji: "🏃", x: 30, y: 65, size: 30 },
      { emoji: "🏃", x: 70, y: 65, size: 30 },
      { emoji: "🟨", x: 85, y: 20, size: 24 },
      // Differences
      { emoji: "🏆", x: 50, y: 80, size: 28, inRight: true },
      { emoji: "⭐", x: 15, y: 55, size: 22, inRight: true },
      { emoji: "🟨", x: 85, y: 20, size: 24, missingRight: true },
    ],
  },
  {
    title: "El Vestuario",
    bg: "#1a1a2e",
    elements: [
      { emoji: "🎽", x: 20, y: 25, size: 32 },
      { emoji: "🎽", x: 50, y: 25, size: 32 },
      { emoji: "🎽", x: 80, y: 25, size: 32 },
      { emoji: "👟", x: 25, y: 65, size: 26 },
      { emoji: "👟", x: 55, y: 65, size: 26 },
      { emoji: "🧤", x: 80, y: 65, size: 26 },
      { emoji: "⚽", x: 15, y: 80, size: 24 },
      // Differences
      { emoji: "🏆", x: 50, y: 78, size: 24, inRight: true },
      { emoji: "🎽", x: 50, y: 25, size: 32, missingRight: true },
      { emoji: "👟", x: 75, y: 48, size: 24, inRight: true },
    ],
  },
];

export default function SpotDifference() {
  const [puzzleIdx, setPuzzleIdx] = useState(0);
  const [found, setFound] = useState<number[]>([]);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [started, setStarted] = useState(false);

  const puzzle = PUZZLES[puzzleIdx % PUZZLES.length];
  const differences = puzzle.elements.filter((e) => e.inRight || e.missingRight);
  const totalDiffs = differences.length;

  const reset = useCallback(() => {
    setPuzzleIdx(0); setFound([]); setScore(0);
    setGameOver(false); setStarted(false);
  }, []);

  const tapRight = (globalIdx: number) => {
    if (!started || gameOver) return;
    const el = puzzle.elements[globalIdx];
    const diffIdx = differences.indexOf(el);
    if (diffIdx === -1 || found.includes(diffIdx)) return;
    setFound((f) => {
      const newFound = [...f, diffIdx];
      if (newFound.length >= totalDiffs) {
        setScore((s) => s + totalDiffs * 10);
        setTimeout(() => {
          if (puzzleIdx + 1 < PUZZLES.length) {
            setPuzzleIdx((i) => i + 1);
            setFound([]);
          } else {
            setGameOver(true);
          }
        }, 600);
      }
      return newFound;
    });
    setScore((s) => s + 5);
  };

  const renderScene = (isRight: boolean) => (
    <div
      className="relative rounded-xl overflow-hidden flex-1"
      style={{ background: puzzle.bg, aspectRatio: "1 / 1", border: "2px solid rgba(255,255,255,0.1)" }}
    >
      {/* Field markings */}
      <div className="absolute inset-0 pointer-events-none opacity-10">
        <div style={{ position: "absolute", bottom: 0, left: "10%", right: "10%", height: "1px", background: "white" }} />
      </div>

      {puzzle.elements.map((el, idx) => {
        const shouldShow = isRight ? !el.missingRight : !el.inRight;
        if (!shouldShow) return null;
        const isFoundDiff = isRight && el.inRight && found.includes(differences.indexOf(el));
        return (
          <button
            key={idx}
            onClick={() => isRight && tapRight(idx)}
            className="absolute"
            style={{
              left: `${el.x}%`, top: `${el.y}%`, fontSize: el.size,
              transform: "translate(-50%, -50%)",
              background: "none", border: "none",
              cursor: isRight ? "pointer" : "default", lineHeight: 1,
              filter: isFoundDiff ? "drop-shadow(0 0 8px #FFD700)" : "none",
            }}
          >
            {el.emoji}
          </button>
        );
      })}

      {isRight && differences.map((diff, dIdx) => {
        if (!found.includes(dIdx) || !diff.inRight) return null;
        return (
          <div key={dIdx} className="absolute pointer-events-none text-xl"
            style={{ left: `${diff.x}%`, top: `${diff.y - 8}%`, transform: "translate(-50%, -50%)" }}>
            ✅
          </div>
        );
      })}
    </div>
  );

  return (
    <GameWrapper
      gameId="diferencias"
      gameName="VAR: Busca Faltas"
      gameEmoji="📺"
      color="#F39C12"
      benefit="Desarrolla la atención al detalle y la discriminación visual"
      score={score}
      gameOver={gameOver}
      onRestart={reset}
    >
      <div
        className="relative w-full"
        style={{
          minHeight: "calc(100vh - 56px)",
          background: "linear-gradient(135deg, #1a0f00 0%, #2d1a00 100%)",
        }}
      >
        {!started && !gameOver && (
          <div className="absolute inset-0 flex flex-col items-center justify-center z-10 px-6">
            <div className="text-8xl mb-4 float-anim">📺</div>
            <h2 className="text-3xl font-black text-white text-center mb-3">VAR: Busca Faltas</h2>
            <p className="text-white/70 text-center mb-8 text-sm leading-relaxed">
              El VAR revisa las dos imágenes. ¡Toca en la imagen de la derecha todo lo que sea diferente!
            </p>
            <button
              onClick={() => setStarted(true)}
              className="px-10 py-5 rounded-3xl text-2xl font-black text-white active:scale-95 transition-transform"
              style={{ background: "#F39C12" }}
            >
              ¡A JUGAR! 🕵️
            </button>
          </div>
        )}

        {started && (
          <div className="p-3">
            <div className="flex items-center justify-between mb-2">
              <span className="text-white/60 text-sm">{puzzle.title}</span>
              <span className="text-yellow-300 text-sm font-bold">{found.length}/{totalDiffs} faltas</span>
            </div>
            <div className="flex gap-2 mb-2">
              <div className="flex-1 text-center text-white/40 text-xs">Original</div>
              <div className="flex-1 text-center text-yellow-300 text-xs font-bold">← Toca aquí</div>
            </div>
            <div className="flex gap-2">
              {renderScene(false)}
              {renderScene(true)}
            </div>
            <div className="flex justify-center gap-2 mt-3">
              {Array.from({ length: totalDiffs }).map((_, i) => (
                <div key={i} className="w-3 h-3 rounded-full transition-all"
                  style={{ background: found.includes(i) ? "#F39C12" : "rgba(255,255,255,0.2)" }} />
              ))}
            </div>
          </div>
        )}
      </div>
    </GameWrapper>
  );
}
