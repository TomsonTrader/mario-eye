"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { recordScore } from "@/lib/games";

interface Props {
  gameId: string;
  gameName: string;
  gameEmoji: string;
  color: string;
  benefit: string;
  score: number;
  gameOver: boolean;
  onRestart: () => void;
  children: React.ReactNode;
  timeLeft?: number;
}

export default function GameWrapper({
  gameId, gameName, gameEmoji, color, benefit,
  score, gameOver, onRestart, children, timeLeft,
}: Props) {
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (gameOver && !saved) {
      recordScore(gameId, score);
      setSaved(true);
    }
  }, [gameOver, gameId, score, saved]);

  useEffect(() => {
    setSaved(false);
  }, [gameId]);

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{ background: "linear-gradient(135deg, #0f0f2e 0%, #1a1a4e 100%)" }}
    >
      {/* Top bar */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-white/10">
        <Link href="/" className="text-white/60 hover:text-white text-2xl transition-colors">
          ←
        </Link>
        <div className="flex items-center gap-2">
          <span className="text-xl">{gameEmoji}</span>
          <span className="text-white font-bold text-sm">{gameName}</span>
        </div>
        <div className="flex items-center gap-3">
          {timeLeft !== undefined && (
            <span
              className="font-black text-lg"
              style={{ color: timeLeft <= 10 ? "#FF6B6B" : "#FFD700" }}
            >
              {timeLeft}s
            </span>
          )}
          <span className="text-white font-black text-lg" style={{ color }}>
            {score}
          </span>
        </div>
      </div>

      {/* Game area */}
      <div className="flex-1 relative">
        {children}
      </div>

      {/* Game over overlay */}
      {gameOver && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
          <div className="bounce-in bg-white/10 border border-white/30 rounded-3xl p-8 mx-6 text-center max-w-sm w-full">
            <div className="text-6xl mb-3">{score > 10 ? "🏆" : score > 5 ? "⚽" : "💪"}</div>
            <h2 className="text-3xl font-black text-white mb-1">
              {score > 10 ? "¡Hat-trick!" : score > 5 ? "¡Golazo!" : "¡Sigue entrenando!"}
            </h2>
            <p className="text-white/60 text-sm mb-2">Puntuación final</p>
            <div className="text-6xl font-black mb-4" style={{ color }}>
              {score}
            </div>
            <p className="text-blue-200 text-xs mb-6 bg-blue-500/20 rounded-xl p-3">
              🧠 {benefit}
            </p>
            <div className="flex gap-3">
              <button
                onClick={onRestart}
                className="flex-1 py-4 rounded-2xl font-black text-white text-lg active:scale-95 transition-transform"
                style={{ background: color }}
              >
                ⚽ Otra vez
              </button>
              <Link href="/" className="flex-1">
                <button className="w-full py-4 rounded-2xl font-bold text-white text-lg bg-white/10 border border-white/20 active:scale-95 transition-transform">
                  🏠 Inicio
                </button>
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
