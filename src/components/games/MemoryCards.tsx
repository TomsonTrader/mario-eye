"use client";

import { useCallback, useEffect, useState } from "react";
import GameWrapper from "@/components/GameWrapper";

const EMOJIS = ["🐶", "🐱", "🐸", "🦊", "🐼", "🦁", "🐧", "🦋"];

interface Card {
  id: number;
  emoji: string;
  flipped: boolean;
  matched: boolean;
}

function makeCards(): Card[] {
  const pairs = [...EMOJIS, ...EMOJIS].map((emoji, i) => ({
    id: i,
    emoji,
    flipped: false,
    matched: false,
  }));
  return pairs.sort(() => Math.random() - 0.5);
}

export default function MemoryCards() {
  const [cards, setCards] = useState<Card[]>(makeCards());
  const [selected, setSelected] = useState<number[]>([]);
  const [score, setScore] = useState(0);
  const [moves, setMoves] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [started, setStarted] = useState(false);
  const [lock, setLock] = useState(false);

  const reset = useCallback(() => {
    setCards(makeCards());
    setSelected([]);
    setScore(0);
    setMoves(0);
    setGameOver(false);
    setStarted(false);
    setLock(false);
  }, []);

  const tap = (id: number) => {
    if (lock || !started) return;
    const card = cards.find((c) => c.id === id);
    if (!card || card.flipped || card.matched) return;
    if (selected.includes(id)) return;

    const newSelected = [...selected, id];
    setCards((prev) =>
      prev.map((c) => (c.id === id ? { ...c, flipped: true } : c))
    );
    setSelected(newSelected);

    if (newSelected.length === 2) {
      setMoves((m) => m + 1);
      setLock(true);
      const [a, b] = newSelected.map((sid) => cards.find((c) => c.id === sid)!);
      if (a.emoji === b.emoji) {
        setTimeout(() => {
          setCards((prev) =>
            prev.map((c) =>
              newSelected.includes(c.id) ? { ...c, matched: true } : c
            )
          );
          setScore((s) => s + 10);
          setSelected([]);
          setLock(false);
        }, 400);
      } else {
        setTimeout(() => {
          setCards((prev) =>
            prev.map((c) =>
              newSelected.includes(c.id) ? { ...c, flipped: false } : c
            )
          );
          setSelected([]);
          setLock(false);
        }, 900);
      }
    }
  };

  // Check win
  useEffect(() => {
    if (started && cards.every((c) => c.matched)) {
      setTimeout(() => setGameOver(true), 600);
    }
  }, [cards, started]);

  // Final score based on moves
  const finalScore = Math.max(0, score - moves);

  return (
    <GameWrapper
      gameId="memoria"
      gameName="Memoria"
      gameEmoji="🃏"
      color="#9B59B6"
      benefit="Desarrolla la memoria visual y la atención"
      score={started ? finalScore : 0}
      gameOver={gameOver}
      onRestart={reset}
    >
      <div
        className="relative w-full"
        style={{
          minHeight: "calc(100vh - 56px)",
          background: "linear-gradient(135deg, #2d0050 0%, #1a0030 100%)",
        }}
      >
        {!started && !gameOver && (
          <div className="absolute inset-0 flex flex-col items-center justify-center z-10 px-6">
            <div className="text-8xl mb-4 float-anim">🃏</div>
            <h2 className="text-3xl font-black text-white text-center mb-3">Memoria</h2>
            <p className="text-white/70 text-center mb-8 text-sm leading-relaxed">
              Encuentra todas las parejas de animales.
              ¡Cuantos menos intentos mejor!
            </p>
            <button
              onClick={() => setStarted(true)}
              className="px-10 py-5 rounded-3xl text-2xl font-black text-white active:scale-95 transition-transform"
              style={{ background: "#9B59B6" }}
            >
              ¡JUGAR! 🧠
            </button>
          </div>
        )}

        {started && (
          <div className="p-4">
            <div className="text-center text-white/60 text-sm mb-4">
              Intentos: {moves}
            </div>
            <div className="grid grid-cols-4 gap-2 max-w-sm mx-auto">
              {cards.map((card) => (
                <button
                  key={card.id}
                  onClick={() => tap(card.id)}
                  className="aspect-square rounded-2xl text-3xl flex items-center justify-center font-bold active:scale-95 transition-all duration-200"
                  style={{
                    background: card.matched
                      ? "rgba(155, 89, 182, 0.3)"
                      : card.flipped
                      ? "rgba(255,255,255,0.2)"
                      : "rgba(255,255,255,0.1)",
                    border: card.matched
                      ? "2px solid #9B59B6"
                      : card.flipped
                      ? "2px solid rgba(255,255,255,0.5)"
                      : "2px solid rgba(255,255,255,0.15)",
                    transform: card.flipped || card.matched ? "rotateY(0deg)" : "",
                  }}
                >
                  {card.flipped || card.matched ? card.emoji : "❓"}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </GameWrapper>
  );
}
