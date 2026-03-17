export interface GameInfo {
  id: string;
  slug: string;
  name: string;
  emoji: string;
  description: string;
  benefit: string;
  color: string;
  bgGradient: string;
  difficulty: number; // 1-3
}

export const GAMES: GameInfo[] = [
  {
    id: "estrella",
    slug: "estrella",
    name: "Cabecea el Balón",
    emoji: "⚽",
    description: "¡Toca los balones antes de que caigan al suelo!",
    benefit: "Entrena la velocidad de reacción y el seguimiento visual",
    color: "#FFD700",
    bgGradient: "from-indigo-900 to-purple-900",
    difficulty: 1,
  },
  {
    id: "globos",
    slug: "globos",
    name: "Para el Penalti",
    emoji: "🥅",
    description: "¡Para los balones que van hacia la portería!",
    benefit: "Mejora la precisión y coordinación ojo-mano",
    color: "#FF6B6B",
    bgGradient: "from-sky-900 to-blue-900",
    difficulty: 1,
  },
  {
    id: "memoria",
    slug: "memoria",
    name: "Memoria Futbolera",
    emoji: "🃏",
    description: "Encuentra las parejas de jugadores y trofeos",
    benefit: "Desarrolla la memoria visual y la atención",
    color: "#9B59B6",
    bgGradient: "from-purple-900 to-pink-900",
    difficulty: 2,
  },
  {
    id: "numero",
    slug: "numero",
    name: "Dorsal Perdido",
    emoji: "👕",
    description: "Encuentra el dorsal del jugador entre todos los demás",
    benefit: "Entrena la búsqueda visual y la discriminación",
    color: "#2ECC71",
    bgGradient: "from-green-900 to-teal-900",
    difficulty: 2,
  },
  {
    id: "mariposa",
    slug: "mariposa",
    name: "Sigue el Balón",
    emoji: "⚽",
    description: "¡Toca el balón mientras bota por el campo!",
    benefit: "Mejora el seguimiento suave y la persecución visual",
    color: "#E67E22",
    bgGradient: "from-orange-900 to-yellow-900",
    difficulty: 1,
  },
  {
    id: "contar",
    slug: "contar",
    name: "¡Cuenta los Goles!",
    emoji: "🏆",
    description: "¿Cuántos balones hay? ¡Cuenta antes de que desaparezcan!",
    benefit: "Entrena la atención visual rápida y el conteo",
    color: "#E74C3C",
    bgGradient: "from-red-900 to-pink-900",
    difficulty: 2,
  },
  {
    id: "laberinto",
    slug: "laberinto",
    name: "Dribling",
    emoji: "🏃",
    description: "Lleva al jugador hasta la portería esquivando rivales",
    benefit: "Mejora la planificación espacial y el control motor",
    color: "#1ABC9C",
    bgGradient: "from-teal-900 to-cyan-900",
    difficulty: 2,
  },
  {
    id: "puntos",
    slug: "puntos",
    name: "Dibuja la Jugada",
    emoji: "📋",
    description: "Conecta los puntos en orden para trazar la jugada",
    benefit: "Entrena el seguimiento visual y la secuenciación",
    color: "#3498DB",
    bgGradient: "from-blue-900 to-indigo-900",
    difficulty: 1,
  },
  {
    id: "diferencias",
    slug: "diferencias",
    name: "VAR: Busca Faltas",
    emoji: "📺",
    description: "Encuentra las diferencias entre las dos jugadas",
    benefit: "Desarrolla la atención al detalle y la discriminación visual",
    color: "#F39C12",
    bgGradient: "from-amber-900 to-orange-900",
    difficulty: 3,
  },
  {
    id: "aguila",
    slug: "aguila",
    name: "Ojeador",
    emoji: "🔭",
    description: "Encuentra al jugador escondido en el campo",
    benefit: "Mejora la búsqueda visual y la figura-fondo",
    color: "#8E44AD",
    bgGradient: "from-violet-900 to-purple-900",
    difficulty: 3,
  },
];

export interface GameStats {
  gamesPlayed: number;
  totalScore: number;
  streak: number;
  lastPlayed: string;
  sessionMinutes: number;
  scores: Record<string, number[]>;
}

export function getStats(): GameStats {
  if (typeof window === "undefined") return defaultStats();
  const raw = localStorage.getItem("mario-eye-stats");
  if (!raw) return defaultStats();
  try { return JSON.parse(raw); } catch { return defaultStats(); }
}

export function saveStats(stats: GameStats) {
  if (typeof window === "undefined") return;
  localStorage.setItem("mario-eye-stats", JSON.stringify(stats));
}

export function recordScore(gameId: string, score: number) {
  const stats = getStats();
  if (!stats.scores[gameId]) stats.scores[gameId] = [];
  stats.scores[gameId].push(score);
  stats.totalScore += score;
  stats.gamesPlayed += 1;
  stats.lastPlayed = new Date().toISOString();
  saveStats(stats);
}

function defaultStats(): GameStats {
  return {
    gamesPlayed: 0,
    totalScore: 0,
    streak: 0,
    lastPlayed: "",
    sessionMinutes: 0,
    scores: {},
  };
}
