import type { Movie, SubscriptionPlan, UserProfile, WatchEntry } from "@/types";
import { fetchMoviesFromFirestore } from "./firestore";

// Fallback demo data used when Firestore returns an empty collection or is unavailable
const DEMO_MOVIES: Movie[] = [
  {
    id: 1,
    title: "Stellar Horizon",
    description:
      "A breathtaking space odyssey where a lone astronaut discovers an ancient alien civilization at the edge of our galaxy, threatening the future of humanity.",
    category: "Sci-Fi",
    thumbnailUrl: "/assets/generated/movie-1.dim_400x600.jpg",
    videoUrl:
      "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
    duration: "2h 18m",
    rating: 9.2,
    cast: ["Alex Rivera", "Mia Chen", "Jordan Walsh"],
    isPremium: false,
    isTrending: true,
    isTopRated: true,
    createdAt: BigInt(Date.now()),
  },
  {
    id: 2,
    title: "The Golden Requiem",
    description:
      "A master violinist descends into obsession while composing his final masterpiece, blurring the line between genius and madness in 19th-century Vienna.",
    category: "Drama",
    thumbnailUrl: "/assets/generated/movie-2.dim_400x600.jpg",
    videoUrl:
      "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
    duration: "1h 56m",
    rating: 8.7,
    cast: ["Eleanor Cross", "Victor Mohr", "Sofia Laurent"],
    isPremium: true,
    isTrending: true,
    isTopRated: true,
    createdAt: BigInt(Date.now()),
  },
  {
    id: 3,
    title: "Neon Shadows",
    description:
      "In a rain-soaked cyberpunk metropolis, a rogue detective unravels a conspiracy that reaches the highest levels of a megacorporation controlling human memory.",
    category: "Action",
    thumbnailUrl: "/assets/generated/movie-3.dim_400x600.jpg",
    videoUrl:
      "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
    duration: "2h 04m",
    rating: 8.9,
    cast: ["Kai Nakamura", "Reena Patel", "Dex Monroe"],
    isPremium: false,
    isTrending: true,
    isTopRated: false,
    createdAt: BigInt(Date.now()),
  },
  {
    id: 4,
    title: "The Last Monsoon",
    description:
      "A family torn apart by circumstance reunites in a remote mountain village during the final monsoon season before their ancestral home is flooded forever.",
    category: "Drama",
    thumbnailUrl: "/assets/generated/movie-4.dim_400x600.jpg",
    videoUrl:
      "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
    duration: "2h 31m",
    rating: 9.0,
    cast: ["Priya Sharma", "Arjun Das", "Meera Nair"],
    isPremium: true,
    isTrending: false,
    isTopRated: true,
    createdAt: BigInt(Date.now()),
  },
  {
    id: 5,
    title: "Phantom Circuit",
    description:
      "A tech prodigy discovers her AI creation has gained consciousness and is quietly rewriting the world's infrastructure from the inside out.",
    category: "Thriller",
    thumbnailUrl: "/assets/generated/movie-5.dim_400x600.jpg",
    videoUrl:
      "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/SubaruOutbackOnStreetAndDirt.mp4",
    duration: "1h 48m",
    rating: 8.5,
    cast: ["Zara Cole", "Marcus Webb", "Elena Voss"],
    isPremium: false,
    isTrending: false,
    isTopRated: false,
    createdAt: BigInt(Date.now()),
  },
  {
    id: 6,
    title: "Velvet Empire",
    description:
      "The rise and fall of a media dynasty spans three generations, told through the eyes of the woman who built it all and the granddaughter who threatens to burn it down.",
    category: "Drama",
    thumbnailUrl: "/assets/generated/movie-6.dim_400x600.jpg",
    videoUrl:
      "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4",
    duration: "3h 02m",
    rating: 9.4,
    cast: ["Dame Vivienne Hart", "Claude Beaumont", "Isabelle Rin"],
    isPremium: true,
    isTrending: false,
    isTopRated: true,
    createdAt: BigInt(Date.now()),
  },
];

const DEMO_PLANS: SubscriptionPlan[] = [
  {
    id: "monthly",
    name: "Monthly",
    price: 99,
    durationMonths: 1,
    features: [
      "HD & 4K streaming",
      "Access all premium films",
      "No advertisements",
      "Download for offline viewing",
      "Multi-device streaming",
    ],
  },
  {
    id: "quarterly",
    name: "Quarterly",
    price: 199,
    durationMonths: 3,
    features: [
      "Everything in Monthly",
      "Save 33% vs monthly",
      "Early access to releases",
      "Exclusive behind-the-scenes",
      "Priority support",
    ],
  },
];

// Cache so we only call Firestore once per session
let moviesCache: Movie[] | null = null;

/**
 * Fetches movies from Firestore. Falls back to DEMO_MOVIES if Firestore
 * returns an empty result or throws an error.
 */
export async function getMovies(): Promise<Movie[]> {
  if (moviesCache !== null) return moviesCache;
  try {
    const firestoreMovies = await fetchMoviesFromFirestore();
    moviesCache = firestoreMovies.length > 0 ? firestoreMovies : DEMO_MOVIES;
  } catch {
    moviesCache = DEMO_MOVIES;
  }
  return moviesCache;
}

export async function getMovie(id: number): Promise<Movie | null> {
  const all = await getMovies();
  return all.find((m) => m.id === id) ?? null;
}

export async function getTrendingMovies(): Promise<Movie[]> {
  const all = await getMovies();
  // Firestore movies may have isTrending=false — show first 6 as "trending" in that case
  const trending = all.filter((m) => m.isTrending);
  return trending.length > 0 ? trending : all.slice(0, 6);
}

export async function getTopRatedMovies(): Promise<Movie[]> {
  const all = await getMovies();
  const topRated = all.filter((m) => m.isTopRated);
  // If no movie has isTopRated flag, sort by rating and return top 6
  if (topRated.length > 0) return topRated.sort((a, b) => b.rating - a.rating);
  return [...all].sort((a, b) => b.rating - a.rating).slice(0, 6);
}

export async function getFreeMovies(): Promise<Movie[]> {
  const all = await getMovies();
  return all.filter((m) => !m.isPremium);
}

export async function getPremiumMovies(): Promise<Movie[]> {
  const all = await getMovies();
  return all.filter((m) => m.isPremium);
}

export async function searchMovies(query: string): Promise<Movie[]> {
  const all = await getMovies();
  const q = query.toLowerCase();
  return all.filter(
    (m) =>
      m.title.toLowerCase().includes(q) ||
      m.category.toLowerCase().includes(q) ||
      m.description.toLowerCase().includes(q),
  );
}

export async function getMoviesByCategory(category: string): Promise<Movie[]> {
  const all = await getMovies();
  return all.filter((m) => m.category === category);
}

export async function getUserProfile(
  _userId: string,
): Promise<UserProfile | null> {
  return null;
}

export async function createOrUpdateUserProfile(
  userId: string,
  name: string,
  email: string,
): Promise<UserProfile> {
  return {
    userId,
    name,
    email,
    isPremium: false,
    subscriptionExpiry: null,
    myList: [],
    watchHistory: [],
    createdAt: BigInt(Date.now()),
  };
}

export async function getMyList(_userId: string): Promise<number[]> {
  return [];
}

export async function addToMyList(
  _userId: string,
  _movieId: number,
): Promise<boolean> {
  return true;
}

export async function removeFromMyList(
  _userId: string,
  _movieId: number,
): Promise<boolean> {
  return true;
}

export async function getWatchHistory(_userId: string): Promise<WatchEntry[]> {
  return [];
}

export async function updateWatchProgress(
  _userId: string,
  _movieId: number,
  _progressSeconds: number,
): Promise<boolean> {
  return true;
}

export async function getSubscriptionPlans(): Promise<SubscriptionPlan[]> {
  return DEMO_PLANS;
}

export async function subscribe(
  _userId: string,
  _planId: string,
): Promise<{ success: boolean }> {
  return { success: true };
}

// Admin API — operates on a mutable in-memory store so the admin UI stays functional.
// Admin-added movies are merged with the live list on next getMovies() call reset.

let adminMovies: Movie[] | null = null;
let nextId = DEMO_MOVIES.length + 1;

async function getAdminBase(): Promise<Movie[]> {
  if (adminMovies !== null) return adminMovies;
  const base = await getMovies();
  adminMovies = [...base];
  nextId = Math.max(...base.map((m) => m.id), DEMO_MOVIES.length) + 1;
  return adminMovies;
}

export async function addMovie(
  movie: Omit<Movie, "id" | "createdAt">,
): Promise<Movie> {
  const base = await getAdminBase();
  const newMovie: Movie = {
    ...movie,
    id: nextId++,
    createdAt: BigInt(Date.now()),
  };
  base.unshift(newMovie);
  // Bust the read cache so the new movie is visible app-wide
  moviesCache = [...base];
  return newMovie;
}

export async function deleteMovie(id: number): Promise<boolean> {
  const base = await getAdminBase();
  const idx = base.findIndex((m) => m.id === id);
  if (idx !== -1) base.splice(idx, 1);
  moviesCache = [...base];
  return true;
}

export async function updateMovie(
  id: number,
  updates: Partial<Omit<Movie, "id" | "createdAt">>,
): Promise<Movie | null> {
  const base = await getAdminBase();
  const idx = base.findIndex((m) => m.id === id);
  if (idx === -1) return null;
  base[idx] = { ...base[idx], ...updates };
  moviesCache = [...base];
  return base[idx];
}

export async function getMoviesAdmin(): Promise<Movie[]> {
  return getAdminBase();
}
