import HeroSection from "@/components/HeroSection";
import MovieSection, { MovieSectionSkeleton } from "@/components/MovieSection";
import {
  getFreeMovies,
  getMovies,
  getPremiumMovies,
  getTopRatedMovies,
  getTrendingMovies,
} from "@/lib/api";
import { useAuthStore } from "@/store/authStore";
import { useMovieStore } from "@/store/movieStore";
import type { Movie } from "@/types";
import { Link } from "@tanstack/react-router";
import { motion } from "motion/react";
import { useEffect, useState } from "react";

const CATEGORY_CONFIG = [
  {
    name: "Action",
    emoji: "💥",
    color:
      "from-orange-950/60 to-orange-900/20 border-orange-500/30 hover:border-orange-400/60",
  },
  {
    name: "Comedy",
    emoji: "😄",
    color:
      "from-yellow-950/60 to-yellow-900/20 border-yellow-500/30 hover:border-yellow-400/60",
  },
  {
    name: "Horror",
    emoji: "👻",
    color:
      "from-red-950/60 to-red-900/20 border-red-500/30 hover:border-red-400/60",
  },
  {
    name: "Sci-Fi",
    emoji: "🚀",
    color:
      "from-blue-950/60 to-blue-900/20 border-blue-500/30 hover:border-blue-400/60",
  },
  {
    name: "Drama",
    emoji: "🎭",
    color:
      "from-purple-950/60 to-purple-900/20 border-purple-500/30 hover:border-purple-400/60",
  },
  {
    name: "Thriller",
    emoji: "🔪",
    color:
      "from-zinc-950/60 to-zinc-800/20 border-zinc-500/30 hover:border-zinc-400/60",
  },
] as const;

export default function HomePage() {
  const { movies, setMovies, watchHistory } = useMovieStore();
  const { isAuthenticated } = useAuthStore();
  const [trending, setTrending] = useState<Movie[]>([]);
  const [topRated, setTopRated] = useState<Movie[]>([]);
  const [free, setFree] = useState<Movie[]>([]);
  const [premium, setPremium] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      setLoading(true);
      const [all, trend, top, freeM, premM] = await Promise.all([
        getMovies(),
        getTrendingMovies(),
        getTopRatedMovies(),
        getFreeMovies(),
        getPremiumMovies(),
      ]);
      setMovies(all);
      setTrending(trend);
      setTopRated(top);
      setFree(freeM);
      setPremium(premM);
      setLoading(false);
    }
    load();
  }, [setMovies]);

  const continueWatching = isAuthenticated
    ? movies.filter((m) => watchHistory.some((w) => w.movieId === m.id))
    : [];

  return (
    <div data-ocid="home.page" className="min-h-screen">
      {/* Hero — bleeds under navbar via -mt-16 in HeroSection */}
      <HeroSection movies={loading ? [] : movies} />

      {/* Main content sections */}
      <div className="relative z-10">
        {loading ? (
          <>
            <MovieSectionSkeleton />
            <MovieSectionSkeleton />
            <MovieSectionSkeleton />
          </>
        ) : (
          <>
            {/* Trending Now */}
            <MovieSection
              title="Trending Now"
              movies={trending}
              ocid="trending.section"
              seeAllHref="/movies"
            />

            {/* Top Rated */}
            <MovieSection
              title="Top Rated"
              movies={topRated}
              ocid="top_rated.section"
              seeAllHref="/movies"
              dimmed
            />

            {/* Continue Watching (auth only) */}
            {isAuthenticated && continueWatching.length > 0 && (
              <MovieSection
                title="Continue Watching"
                movies={continueWatching}
                ocid="continue_watching.section"
                watchHistory={watchHistory}
              />
            )}

            {/* Free Movies */}
            <MovieSection
              title="Free Movies"
              movies={free}
              ocid="free_movies.section"
              seeAllHref="/movies"
              dimmed={continueWatching.length === 0 || !isAuthenticated}
            />

            {/* Premium Movies */}
            <div className="section-divider">
              <MovieSection
                title="Premium Movies 🔒"
                movies={premium}
                ocid="premium_movies.section"
                seeAllHref="/pricing"
              />
            </div>

            {/* Browse by Category */}
            <CategoriesSection />
          </>
        )}
      </div>
    </div>
  );
}

function CategoriesSection() {
  return (
    <section
      className="py-10 bg-card/20 section-divider"
      data-ocid="categories.section"
    >
      <div className="px-6 md:px-12 max-w-screen-2xl mx-auto">
        <h2 className="text-section-heading text-foreground mb-6">
          Browse by Category
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
          {CATEGORY_CONFIG.map((cat, i) => (
            <motion.div
              key={cat.name}
              initial={{ opacity: 0, scale: 0.92 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.06, duration: 0.35 }}
            >
              <Link
                to="/categories"
                search={{ genre: cat.name } as Record<string, string>}
                data-ocid={`categories.item.${i + 1}`}
                className={`relative flex flex-col items-center justify-center h-20 rounded-xl bg-gradient-to-br ${cat.color} border text-sm font-semibold text-foreground/80 hover:text-foreground transition-all duration-300 hover:scale-[1.04] hover:[box-shadow:0_0_20px_oklch(0.72_0.18_70_/_0.15)] overflow-hidden group`}
              >
                <span className="text-2xl mb-1 group-hover:scale-110 transition-transform duration-200">
                  {cat.emoji}
                </span>
                <span className="text-xs font-semibold tracking-wide uppercase">
                  {cat.name}
                </span>
                {/* Subtle gold border on hover */}
                <div className="absolute inset-0 rounded-xl border border-primary/0 group-hover:border-primary/30 transition-all duration-300 pointer-events-none" />
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
