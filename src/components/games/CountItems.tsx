"use client";

import { useCallback, useEffect, useState } from "react";
import GameWrapper from "@/components/GameWrapper";

const ITEMS = ["⚽", "🏆", "🥅", "👟", "🧤", "🟨", "🎽", "🏟️"];

interface Round {
  emoji: string;
  count: number;
  positions: { x: number; y: number }[];
}

function makeRound(difficulty: number): Round {
  const emoji = ITEMS[Math.floor(Math.random() * ITEMS.length)];
  const max = Math.min(4 + difficulty * 2, 12);
  const count = Math.floor(Math.random() * max) + 2;
  const positions = Array.from({ length: count }, () => ({
    x: 5 + Math.random() * 80,
    y: 15 + Math.random() * 65,
  }));
  return { emoji, count, positions };
}

export default function CountItems() {
  const [round, setRound] = useState<Round | null>(null);
  const [showItems, setShowItems] = useState(false);
  const [answer, setAnswer] = useState<number | null>(null);
  const [feedback, setFeedback] = useState<"correct" | "wrong" | null>(null);
  const [score, setScore] = useState(0);
  const [roundNum, setRoundNum] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [started, setStarted] = useState(false);

  const startRound = useCallback((num: number) => {
    const difficulty = Math.floor(num / 3);
    const r = makeRound(difficulty);
    setRound(r);
    setAnswer(null);
    setFeedback(null);
    setShowItems(true);
    const displayTime = Math.max(1200, 2500 - difficulty * 200);
    setTimeout(() => setShowItems(false), displayTime);
  }, []);

  const reset = useCallback(() => {
    setRound(null); setShowItems(false);
    setAnswer(null); setFeedback(null);
    setScore(0); setRoundNum(0);
    setGameOver(false); setStarted(false);
  }, []);

  useEffect(() => {
    if (started && roundNum < 10) startRound(roundNum);
    else if (started && roundNum >= 10) setGameOver(true);
  }, [started, roundNum, startRound]);

  const guess = (n: number) => {
    if (!round || answer !== null || showItems) return;
    setAnswer(n);
    if (n === round.count) {
      setFeedback("correct");
      setScore((s) => s + 10);
    } else {
      setFeedback("wrong");
    }
    setTimeout(() => setRoundNum((r) => r + 1), 1000);
  };

  const options = round
    ? Array.from(new Set([
        round.count,
        Math.max(1, round.count - 1),
        round.count + 1,
        Math.max(1, round.count - 2),
        round.count + 2,
      ])).slice(0, 4).sort(() => Math.random() - 0.5)
    : [];

  return (
    <GameWrapper
      gameId="contar"
      gameName="¡Cuenta los Goles!"
      gameEmoji="🏆"
      color="#E74C3C"
      benefit="Entrena la atención visual rápida y el conteo"
      score={score}
      gameOver={gameOver}
      onRestart={reset}
    >
      <div
        className="relative w-full"
        style={{
          minHeight: "calc(100vh - 56px)",
          background: "linear-gradient(135deg, #1a0a0a 0%, #3d0d0d 50%, #1a0a0a 100%)",
        }}
      >
        {!started && !gameOver && (
          <div className="absolute inset-0 flex flex-col items-center justify-center z-10 px-6">
            <div className="text-8xl mb-4 float-anim">🏆</div>
            <h2 className="text-3xl font-black text-white text-center mb-3">¡Cuenta los Goles!</h2>
            <p className="text-white/70 text-center mb-8 text-sm leading-relaxed">
              Aparecerán objetos de fútbol por un momento.
              ¡Cuenta cuántos son y elige la respuesta correcta!
            </p>
            <button
              onClick={() => setStarted(true)}
              className="px-10 py-5 rounded-3xl text-2xl font-black text-white active:scale-95 transition-transform"
              style={{ background: "#E74C3C" }}
            >
              ¡A JUGAR! 🔢
            </button>
          </div>
        )}

        {started && round && (
          <>
            <div className="text-center pt-3 pb-2">
              <span className="text-white/40 text-sm">Ronda {roundNum + 1}/10</span>
            </div>

            <div
              className="relative mx-4 rounded-2xl overflow-hidden"
              style={{
                height: "40vh",
                background: "rgba(255,255,255,0.05)",
                border: "1px solid rgba(255,255,255,0.1)",
              }}
            >
              {showItems
                ? round.positions.map((pos, i) => (
                    <div
                      key={i}
                      className="absolute text-4xl pointer-events-none bounce-in"
                      style={{
                        left: `${pos.x}%`, top: `${pos.y}%`,
                        transform: "translate(-50%, -50%)",
                        animationDelay: `${i * 0.05}s`,
                      }}
                    >
                      {round.emoji}
                    </div>
                  ))
                : (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <p className="text-white/40 text-lg font-bold">
                      {answer !== null
                        ? feedback === "correct" ? "✅ ¡Correcto! ¡Goool!" : `❌ Eran ${round.count}`
                        : "¿Cuántos había?"}
                    </p>
                  </div>
                )}
            </div>

            {!showItems && answer === null && (
              <div className="grid grid-cols-2 gap-3 mx-4 mt-4">
                {options.map((opt) => (
                  <button
                    key={opt}
                    onClick={() => guess(opt)}
                    className="py-5 rounded-2xl text-3xl font-black text-white active:scale-95 transition-transform"
                    style={{ background: "rgba(231, 76, 60, 0.3)", border: "2px solid rgba(231, 76, 60, 0.5)" }}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            )}

            {feedback && (
              <div className="text-center mt-4">
                <span className={`text-2xl font-black ${feedback === "correct" ? "text-green-400" : "text-red-400"}`}>
                  {feedback === "correct" ? "🎉 +10 puntos" : `😅 Eran ${round.count}`}
                </span>
              </div>
            )}
          </>
        )}
      </div>
    </GameWrapper>
  );
}
