"use client";

import { useCallback, useState } from "react";
import GameWrapper from "@/components/GameWrapper";

// Each puzzle: two versions of a scene, with differences defined by positions
interface Puzzle {
  title: string;
  bg: string;
  elements: {
    emoji: string;
    x: number;
    y: number;
    size: number;
    inRight?: boolean; // only in right image
    missingRight?: boolean; // missing from right image
    colorRight?: string; // different in right
    showColor?: boolean;
  }[];
}

const PUZZLES: Puzzle[] = [
  {
    title: "El Jardín",
    bg: "#1a4a1a",
    elements: [
      { emoji: "🌳", x: 10, y: 40, size: 40 },
      { emoji: "🌻", x: 30, y: 60, size: 30 },
      { emoji: "🌹", x: 50, y: 65, size: 28 },
      { emoji: "🐝", x: 65, y: 25, size: 25 },
      { emoji: "🏠", x: 70, y: 30, size: 38 },
      { emoji: "☁️", x: 20, y: 10, size: 35 },
      { emoji: "☀️", x: 80, y: 8, size: 32 },
      // Differences
      { emoji: "🦋", x: 45, y: 15, size: 24, inRight: true },
      { emoji: "🌻", x: 85, y: 55, size: 28, inRight: true },
      { emoji: "🐝", x: 35, y: 35, size: 22, missingRight: true },
    ],
  },
  {
    title: "El Espacio",
    bg: "#0a0a2e",
    elements: [
      { emoji: "🚀", x: 45, y: 30, size: 40 },
      { emoji: "⭐", x: 15, y: 15, size: 20 },
      { emoji: "⭐", x: 75, y: 20, size: 18 },
      { emoji: "🌙", x: 80, y: 60, size: 32 },
      { emoji: "🪐", x: 20, y: 55, size: 35 },
      { emoji: "🛸", x: 60, y: 70, size: 30 },
      // Differences
      { emoji: "💫", x: 50, y: 65, size: 22, inRight: true },
      { emoji: "⭐", x: 40, y: 75, size: 18, inRight: true },
      { emoji: "🛸", x: 60, y: 70, size: 30, missingRight: true },
    ],
  },
];

export default function SpotDifference() {
  const [puzzleIdx, setPuzzleIdx] = useState(0);
  const [found, setFound] = useState<number[]>([]);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [started, setStarted] = useState(false);
  const [hints, setHints] = useState(0);

  const puzzle = PUZZLES[puzzleIdx % PUZZLES.length];
  const differences = puzzle.elements.filter((e) => e.inRight || e.missingRight);
  const totalDiffs = differences.length;

  const reset = useCallback(() => {
    setPuzzleIdx(0);
    setFound([]);
    setScore(0);
    setGameOver(false);
    setStarted(false);
    setHints(0);
  }, []);

  const tapRight = (globalIdx: number) => {
    if (!started || gameOver) return;
    const el = puzzle.elements[globalIdx];
    const diffIdx = differences.indexOf(el);
    if (diffIdx === -1) return; // not a difference
    if (found.includes(diffIdx)) return;
    setFound((f) => {
      const newFound = [...f, diffIdx];
      if (newFound.length >= totalDiffs) {
        setScore((s) => s + (totalDiffs * 10) - hints * 5);
        setTimeout(() => {
          if (puzzleIdx + 1 < PUZZLES.length) {
            setPuzzleIdx((i) => i + 1);
            setFound([]);
            setHints(0);
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
      {puzzle.elements.map((el, idx) => {
        const shouldShow = isRight
          ? !el.missingRight
          : !el.inRight;
        if (!shouldShow) return null;

        const isFoundDiff =
          isRight &&
          (el.inRight) &&
          found.includes(differences.indexOf(el));

        return (
          <button
            key={idx}
            onClick={() => isRight && tapRight(idx)}
            className="absolute"
            style={{
              left: `${el.x}%`,
              top: `${el.y}%`,
              fontSize: el.size,
              transform: "translate(-50%, -50%)",
              background: "none",
              border: "none",
              cursor: isRight ? "pointer" : "default",
              lineHeight: 1,
              filter: isFoundDiff ? "drop-shadow(0 0 8px #FFD700)" : "none",
            }}
          >
            {el.emoji}
          </button>
        );
      })}

      {/* Found markers on right */}
      {isRight && differences.map((diff, dIdx) => {
        if (!found.includes(dIdx) || !diff.inRight) return null;
        return (
          <div
            key={dIdx}
            className="absolute pointer-events-none text-2xl"
            style={{
              left: `${diff.x}%`,
              top: `${diff.y - 8}%`,
              transform: "translate(-50%, -50%)",
            }}
          >
            ✅
          </div>
        );
      })}
    </div>
  );

  return (
    <GameWrapper
      gameId="diferencias"
      gameName="7 Diferencias"
      gameEmoji="🔍"
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
          background: "linear-gradient(135deg, #2d1a00 0%, #1a0f00 100%)",
        }}
      >
        {!started && !gameOver && (
          <div className="absolute inset-0 flex flex-col items-center justify-center z-10 px-6">
            <div className="text-8xl mb-4 float-anim">🔍</div>
            <h2 className="text-3xl font-black text-white text-center mb-3">7 Diferencias</h2>
            <p className="text-white/70 text-center mb-8 text-sm leading-relaxed">
              Compara las dos imágenes y toca en la imagen de la derecha todo lo que sea diferente.
            </p>
            <button
              onClick={() => setStarted(true)}
              className="px-10 py-5 rounded-3xl text-2xl font-black text-white active:scale-95 transition-transform"
              style={{ background: "#F39C12" }}
            >
              ¡JUGAR! 🕵️
            </button>
          </div>
        )}

        {started && (
          <div className="p-3">
            <div className="flex items-center justify-between mb-2">
              <span className="text-white/60 text-sm">{puzzle.title}</span>
              <span className="text-yellow-300 text-sm font-bold">
                {found.length}/{totalDiffs} encontradas
              </span>
            </div>

            <div className="flex gap-2 mb-3">
              <div className="flex-1 text-center text-white/40 text-xs">Original</div>
              <div className="flex-1 text-center text-yellow-300 text-xs font-bold">← Toca aquí</div>
            </div>

            <div className="flex gap-2">
              {renderScene(false)}
              {renderScene(true)}
            </div>

            {/* Progress dots */}
            <div className="flex justify-center gap-2 mt-3">
              {Array.from({ length: totalDiffs }).map((_, i) => (
                <div
                  key={i}
                  className="w-3 h-3 rounded-full transition-all"
                  style={{
                    background: found.includes(i) ? "#F39C12" : "rgba(255,255,255,0.2)",
                  }}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </GameWrapper>
  );
}
