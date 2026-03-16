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
    name: "Caza Estrellas",
    emoji: "⭐",
    description: "¡Toca las estrellas antes de que caigan!",
    benefit: "Entrena la velocidad de reacción y el seguimiento visual",
    color: "#FFD700",
    bgGradient: "from-indigo-900 to-purple-900",
    difficulty: 1,
  },
  {
    id: "globos",
    slug: "globos",
    name: "Pincha Globos",
    emoji: "🎈",
    description: "¡Pincha los globos que suben antes de que escapen!",
    benefit: "Mejora la precisión y coordinación ojo-mano",
    color: "#FF6B6B",
    bgGradient: "from-sky-900 to-blue-900",
    difficulty: 1,
  },
  {
    id: "memoria",
    slug: "memoria",
    name: "Memoria",
    emoji: "🃏",
    description: "Encuentra todas las parejas de cartas",
    benefit: "Desarrolla la memoria visual y la atención",
    color: "#9B59B6",
    bgGradient: "from-purple-900 to-pink-900",
    difficulty: 2,
  },
  {
    id: "numero",
    slug: "numero",
    name: "Busca el Número",
    emoji: "🔢",
    description: "Encuentra el número que se esconde entre los demás",
    benefit: "Entrena la búsqueda visual y la discriminación",
    color: "#2ECC71",
    bgGradient: "from-green-900 to-teal-900",
    difficulty: 2,
  },
  {
    id: "mariposa",
    slug: "mariposa",
    name: "Sigue la Mariposa",
    emoji: "🦋",
    description: "Toca la mariposa mientras vuela por la pantalla",
    benefit: "Mejora el seguimiento suave y la persecución visual",
    color: "#E67E22",
    bgGradient: "from-orange-900 to-yellow-900",
    difficulty: 1,
  },
  {
    id: "contar",
    slug: "contar",
    name: "¡Cuenta Rápido!",
    emoji: "🍎",
    description: "¿Cuántas frutas hay? ¡Cuenta antes de que desaparezcan!",
    benefit: "Entrena la atención visual rápida y el conteo",
    color: "#E74C3C",
    bgGradient: "from-red-900 to-pink-900",
    difficulty: 2,
  },
  {
    id: "laberinto",
    slug: "laberinto",
    name: "Laberinto",
    emoji: "🌀",
    description: "Guía al personaje por el laberinto hasta la salida",
    benefit: "Mejora la planificación espacial y el control motor",
    color: "#1ABC9C",
    bgGradient: "from-teal-900 to-cyan-900",
    difficulty: 2,
  },
  {
    id: "puntos",
    slug: "puntos",
    name: "Conecta los Puntos",
    emoji: "✏️",
    description: "Conecta los puntos en orden para revelar el dibujo",
    benefit: "Entrena el seguimiento visual y la secuenciación",
    color: "#3498DB",
    bgGradient: "from-blue-900 to-indigo-900",
    difficulty: 1,
  },
  {
    id: "diferencias",
    slug: "diferencias",
    name: "7 Diferencias",
    emoji: "🔍",
    description: "Encuentra las diferencias entre las dos imágenes",
    benefit: "Desarrolla la atención al detalle y la discriminación visual",
    color: "#F39C12",
    bgGradient: "from-amber-900 to-orange-900",
    difficulty: 3,
  },
  {
    id: "aguila",
    slug: "aguila",
    name: "Ojo de Águila",
    emoji: "🦅",
    description: "Encuentra el objeto escondido en la imagen",
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
