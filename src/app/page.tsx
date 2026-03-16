"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { GAMES, getStats, type GameStats } from "@/lib/games";

const STARS = Array.from({ length: 30 }, (_, i) => ({
  id: i,
  x: Math.round(Math.random() * 100),
  y: Math.round(Math.random() * 100),
  size: Math.round(Math.random() * 3 + 1),
  delay: Math.round(Math.random() * 30) / 10,
}));

export default function Home() {
  const [stats, setStats] = useState<GameStats | null>(null);
  const [showTip, setShowTip] = useState(false);

  useEffect(() => {
    setStats(getStats());
    const timer = setTimeout(() => setShowTip(true), 800);
    return () => clearTimeout(timer);
  }, []);

  const difficultyStars = (d: number) => "⭐".repeat(d) + "☆".repeat(3 - d);

  return (
    <div
      className="min-h-screen relative overflow-hidden"
      style={{ background: "linear-gradient(135deg, #0f0f2e 0%, #1a1a4e 50%, #0f2e1a 100%)" }}
    >
      {/* Background stars */}
      {STARS.map((s) => (
        <div
          key={s.id}
          className="absolute rounded-full bg-white twinkle pointer-events-none"
          style={{
            left: `${s.x}%`,
            top: `${s.y}%`,
            width: s.size,
            height: s.size,
            animationDelay: `${s.delay}s`,
            opacity: 0.6,
          }}
        />
      ))}

      <div className="relative z-10 max-w-md mx-auto px-4 py-6">
        {/* Header */}
        <div className="text-center mb-6">
          <div className="text-7xl mb-2 float-anim inline-block">👁️</div>
          <h1
            className="text-4xl font-black text-white mb-1"
            style={{ textShadow: "0 0 20px rgba(255,215,0,0.5)" }}
          >
            Mario Eye
          </h1>
          <p className="text-yellow-300 text-sm font-semibold">
            ¡Entrena tu ojo superpoderoso!
          </p>
        </div>

        {/* Stats bar */}
        {stats && stats.gamesPlayed > 0 && (
          <div className="bounce-in flex justify-around bg-white/10 backdrop-blur-sm rounded-2xl p-3 mb-5 border border-white/20">
            <div className="text-center">
              <div className="text-2xl font-black text-yellow-300">{stats.gamesPlayed}</div>
              <div className="text-xs text-white/70">Partidas</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-black text-green-300">{stats.totalScore}</div>
              <div className="text-xs text-white/70">Puntos</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-black text-pink-300">
                {stats.scores ? Object.keys(stats.scores).length : 0}/10
              </div>
              <div className="text-xs text-white/70">Juegos</div>
            </div>
          </div>
        )}

        {/* Tip banner */}
        {showTip && (
          <div className="bounce-in bg-blue-500/20 border border-blue-400/40 rounded-2xl p-3 mb-5 flex items-start gap-2">
            <span className="text-xl">💡</span>
            <p className="text-xs text-blue-200 leading-relaxed">
              <strong>Consejo:</strong> Cúbrete el ojo bueno con el parche antes de jugar.
              ¡15 minutos al día fortalecen tu ojo!
            </p>
          </div>
        )}

        {/* Games grid */}
        <h2 className="text-white font-bold text-lg mb-3 px-1">🎮 Elige tu juego</h2>
        <div className="grid grid-cols-2 gap-3 mb-6">
          {GAMES.map((game, idx) => {
            const bestScore =
              stats?.scores?.[game.id]?.length
                ? Math.max(...stats.scores[game.id])
                : null;
            return (
              <Link key={game.id} href={`/games/${game.slug}`}>
                <div
                  className="game-btn rounded-2xl p-4 cursor-pointer border active:scale-95 transition-transform"
                  style={{
                    background: `linear-gradient(135deg, ${game.color}33 0%, ${game.color}11 100%)`,
                    borderColor: `${game.color}44`,
                    animationDelay: `${idx * 0.05}s`,
                  }}
                >
                  <div className="text-4xl mb-2 text-center">{game.emoji}</div>
                  <div className="text-white font-bold text-sm text-center leading-tight mb-1">
                    {game.name}
                  </div>
                  <div className="text-center text-xs" style={{ color: game.color }}>
                    {difficultyStars(game.difficulty)}
                  </div>
                  {bestScore !== null && (
                    <div className="mt-1 text-center text-xs text-white/50">
                      Mejor: {bestScore}
                    </div>
                  )}
                </div>
              </Link>
            );
          })}
        </div>

        {/* Footer */}
        <div className="text-center text-white/40 text-xs pb-4">
          ⏱️ Sesión recomendada: 15 minutos · Descansa si te cansas
        </div>
      </div>
    </div>
  );
}
