"use client";

import { useCallback, useState } from "react";
import GameWrapper from "@/components/GameWrapper";

interface HiddenItem {
  target: string;
  label: string;
  x: number;
  y: number;
  size: number;
  bg: string;
  distractors: { emoji: string; x: number; y: number; size: number }[];
}

const ROUNDS: HiddenItem[] = [
  {
    target: "🦊",
    label: "el zorro",
    x: 62, y: 55, size: 36, bg: "#1a3300",
    distractors: [
      { emoji: "🌿", x: 10, y: 20, size: 30 },
      { emoji: "🌿", x: 75, y: 15, size: 28 },
      { emoji: "🌿", x: 40, y: 70, size: 32 },
      { emoji: "🌳", x: 20, y: 40, size: 40 },
      { emoji: "🌳", x: 80, y: 45, size: 38 },
      { emoji: "🐦", x: 50, y: 20, size: 25 },
      { emoji: "🐦", x: 30, y: 15, size: 22 },
      { emoji: "🌸", x: 15, y: 65, size: 24 },
      { emoji: "🍄", x: 55, y: 80, size: 22 },
      { emoji: "🦋", x: 85, y: 70, size: 24 },
      { emoji: "🐛", x: 45, y: 45, size: 20 },
      { emoji: "🐿️", x: 70, y: 80, size: 26 },
    ],
  },
  {
    target: "⭐",
    label: "la estrella dorada",
    x: 35, y: 45, size: 32, bg: "#00003d",
    distractors: [
      { emoji: "✨", x: 15, y: 20, size: 22 },
      { emoji: "💫", x: 70, y: 15, size: 24 },
      { emoji: "✨", x: 85, y: 55, size: 20 },
      { emoji: "🌙", x: 60, y: 30, size: 28 },
      { emoji: "💫", x: 25, y: 70, size: 22 },
      { emoji: "🌟", x: 50, y: 75, size: 26 },
      { emoji: "☄️", x: 80, y: 75, size: 28 },
      { emoji: "🪐", x: 10, y: 55, size: 30 },
      { emoji: "🔭", x: 65, y: 80, size: 26 },
      { emoji: "🛸", x: 40, y: 10, size: 30 },
      { emoji: "💠", x: 20, y: 40, size: 22 },
    ],
  },
  {
    target: "🐙",
    label: "el pulpo",
    x: 48, y: 60, size: 34, bg: "#001a3d",
    distractors: [
      { emoji: "🐠", x: 20, y: 25, size: 28 },
      { emoji: "🐡", x: 70, y: 20, size: 26 },
      { emoji: "🦈", x: 15, y: 50, size: 32 },
      { emoji: "🐠", x: 80, y: 50, size: 24 },
      { emoji: "🦞", x: 35, y: 75, size: 26 },
      { emoji: "🦀", x: 60, y: 80, size: 24 },
      { emoji: "🐟", x: 50, y: 30, size: 28 },
      { emoji: "🦑", x: 75, y: 65, size: 28 },
      { emoji: "🐚", x: 25, y: 70, size: 22 },
      { emoji: "🌊", x: 10, y: 15, size: 35 },
      { emoji: "🐋", x: 60, y: 10, size: 38 },
    ],
  },
  {
    target: "🍕",
    label: "la pizza",
    x: 55, y: 40, size: 34, bg: "#1a0a00",
    distractors: [
      { emoji: "🍔", x: 20, y: 20, size: 28 },
      { emoji: "🌮", x: 75, y: 25, size: 26 },
      { emoji: "🍟", x: 15, y: 55, size: 24 },
      { emoji: "🍩", x: 80, y: 60, size: 28 },
      { emoji: "🌭", x: 40, y: 75, size: 26 },
      { emoji: "🍦", x: 65, y: 70, size: 24 },
      { emoji: "🧁", x: 30, y: 45, size: 26 },
      { emoji: "🥪", x: 85, y: 40, size: 28 },
      { emoji: "🍱", x: 10, y: 35, size: 30 },
      { emoji: "🥐", x: 50, y: 15, size: 24 },
      { emoji: "🍰", x: 25, y: 80, size: 28 },
    ],
  },
  {
    target: "🦁",
    label: "el león",
    x: 30, y: 50, size: 38, bg: "#1a1200",
    distractors: [
      { emoji: "🦒", x: 65, y: 25, size: 34 },
      { emoji: "🦓", x: 80, y: 55, size: 30 },
      { emoji: "🐘", x: 15, y: 30, size: 36 },
      { emoji: "🦏", x: 55, y: 65, size: 30 },
      { emoji: "🐆", x: 40, y: 20, size: 28 },
      { emoji: "🦍", x: 75, y: 75, size: 32 },
      { emoji: "🌴", x: 20, y: 10, size: 38 },
      { emoji: "🌴", x: 85, y: 15, size: 35 },
      { emoji: "🐊", x: 45, y: 80, size: 30 },
      { emoji: "🦜", x: 10, y: 65, size: 24 },
    ],
  },
];

export default function EagleEye() {
  const [roundIdx, setRoundIdx] = useState(0);
  const [found, setFound] = useState(false);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [started, setStarted] = useState(false);
  const [wrong, setWrong] = useState<number | null>(null);

  const round = ROUNDS[roundIdx % ROUNDS.length];

  const reset = useCallback(() => {
    setRoundIdx(0);
    setFound(false);
    setScore(0);
    setGameOver(false);
    setStarted(false);
    setWrong(null);
  }, []);

  const tapTarget = () => {
    if (!started || gameOver || found) return;
    setFound(true);
    setScore((s) => s + 10);
    setTimeout(() => {
      const next = roundIdx + 1;
      if (next >= ROUNDS.length) {
        setGameOver(true);
      } else {
        setRoundIdx(next);
        setFound(false);
        setWrong(null);
      }
    }, 700);
  };

  const tapWrong = (idx: number) => {
    if (!started || gameOver || found) return;
    setWrong(idx);
    setTimeout(() => setWrong(null), 500);
  };

  return (
    <GameWrapper
      gameId="aguila"
      gameName="Ojo de Águila"
      gameEmoji="🦅"
      color="#8E44AD"
      benefit="Mejora la búsqueda visual y la discriminación figura-fondo"
      score={score}
      gameOver={gameOver}
      onRestart={reset}
    >
      <div
        className="relative w-full"
        style={{
          minHeight: "calc(100vh - 56px)",
          background: "linear-gradient(135deg, #1a0030 0%, #0d0015 100%)",
        }}
      >
        {!started && !gameOver && (
          <div className="absolute inset-0 flex flex-col items-center justify-center z-10 px-6">
            <div className="text-8xl mb-4 float-anim">🦅</div>
            <h2 className="text-3xl font-black text-white text-center mb-3">Ojo de Águila</h2>
            <p className="text-white/70 text-center mb-8 text-sm leading-relaxed">
              Busca el objeto escondido entre todos los demás. ¡Usa tu ojo de águila!
            </p>
            <button
              onClick={() => setStarted(true)}
              className="px-10 py-5 rounded-3xl text-2xl font-black text-white active:scale-95 transition-transform"
              style={{ background: "#8E44AD" }}
            >
              ¡JUGAR! 🔎
            </button>
          </div>
        )}

        {started && (
          <div className="p-4">
            {/* Target instruction */}
            <div
              className="flex items-center gap-3 rounded-2xl p-3 mb-3"
              style={{ background: "rgba(142, 68, 173, 0.2)", border: "1px solid rgba(142, 68, 173, 0.4)" }}
            >
              <span className="text-white/60 text-sm">Busca</span>
              <span className="text-3xl">{round.target}</span>
              <span className="text-white font-bold">{round.label}</span>
            </div>

            {/* Round indicator */}
            <div className="text-center text-white/40 text-xs mb-3">
              Nivel {roundIdx + 1}/{ROUNDS.length}
            </div>

            {/* Scene */}
            <div
              className="relative rounded-2xl overflow-hidden"
              style={{
                background: round.bg,
                height: "55vw",
                maxHeight: 340,
                border: "1px solid rgba(255,255,255,0.1)",
              }}
            >
              {/* Distractors */}
              {round.distractors.map((d, idx) => (
                <button
                  key={idx}
                  onClick={() => tapWrong(idx)}
                  className="absolute"
                  style={{
                    left: `${d.x}%`,
                    top: `${d.y}%`,
                    fontSize: d.size,
                    transform: "translate(-50%, -50%)",
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    lineHeight: 1,
                    filter: wrong === idx ? "brightness(0.5)" : "none",
                    transition: "filter 0.3s",
                  }}
                >
                  {d.emoji}
                </button>
              ))}

              {/* Target */}
              <button
                onClick={tapTarget}
                className="absolute"
                style={{
                  left: `${round.x}%`,
                  top: `${round.y}%`,
                  fontSize: round.size,
                  transform: `translate(-50%, -50%) scale(${found ? 1.5 : 1})`,
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  lineHeight: 1,
                  transition: "transform 0.2s, filter 0.2s",
                  filter: found ? "drop-shadow(0 0 12px #FFD700)" : "none",
                }}
              >
                {round.target}
              </button>
            </div>

            {found && (
              <div className="text-center mt-4 bounce-in text-3xl font-black text-yellow-300">
                🎉 ¡Encontrado! +10
              </div>
            )}
          </div>
        )}
      </div>
    </GameWrapper>
  );
}
