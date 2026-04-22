import { Skeleton } from "@/components/ui/skeleton";
import { getMovies } from "@/lib/api";
import type { Movie } from "@/types";
import { Link } from "@tanstack/react-router";
import { Filter, Lock, Play, Star } from "lucide-react";
import { motion } from "motion/react";
import { useEffect, useMemo, useState } from "react";

type AccessFilter = "all" | "free" | "premium";

const CATEGORY_OPTIONS = [
  "All",
  "Action",
  "Drama",
  "Sci-Fi",
  "Thriller",
  "Comedy",
  "Horror",
];

export default function MoviesPage() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [accessFilter, setAccessFilter] = useState<AccessFilter>("all");
  const [activeCategory, setActiveCategory] = useState("All");

  useEffect(() => {
    getMovies().then((data) => {
      setMovies(data);
      setLoading(false);
    });
  }, []);

  const filtered = useMemo(() => {
    let result = movies;
    if (accessFilter === "free") result = result.filter((m) => !m.isPremium);
    if (accessFilter === "premium") result = result.filter((m) => m.isPremium);
    if (activeCategory !== "All")
      result = result.filter((m) => m.category === activeCategory);
    return result;
  }, [movies, accessFilter, activeCategory]);

  const availableCategories = useMemo(() => {
    const cats = new Set(movies.map((m) => m.category));
    return CATEGORY_OPTIONS.filter((c) => c === "All" || cats.has(c));
  }, [movies]);

  return (
    <div
      data-ocid="movies.page"
      className="min-h-screen px-6 md:px-12 max-w-screen-2xl mx-auto py-10"
    >
      {/* Page header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="mb-8"
      >
        <h1 className="text-section-heading text-foreground mb-1.5">Movies</h1>
        <p className="text-muted-foreground text-sm">
          {loading
            ? "Loading collection..."
            : `${movies.length} titles in our collection`}
        </p>
      </motion.div>

      {/* Filter bar */}
      <div className="space-y-3 mb-8">
        {/* Access type filters */}
        <div className="flex gap-2" data-ocid="movies.access_filter">
          {(["all", "free", "premium"] as AccessFilter[]).map((f) => (
            <button
              key={f}
              type="button"
              onClick={() => setAccessFilter(f)}
              data-ocid={`movies.access.${f}.tab`}
              className={[
                "px-4 py-1.5 rounded-full text-sm font-medium transition-smooth border capitalize",
                accessFilter === f
                  ? "btn-gold border-transparent"
                  : "border-border/50 text-muted-foreground hover:text-primary hover:border-primary/40",
              ].join(" ")}
            >
              {f === "premium"
                ? "🔒 Premium"
                : f === "free"
                  ? "✅ Free"
                  : "All"}
            </button>
          ))}
        </div>

        {/* Category pills */}
        <div
          className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none"
          data-ocid="movies.filter_tabs"
        >
          <Filter className="size-3.5 text-muted-foreground shrink-0 mr-1" />
          {availableCategories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setActiveCategory(cat)}
              data-ocid={`movies.filter.${cat.toLowerCase()}.tab`}
              className={[
                "px-3.5 py-1 rounded-full text-xs font-medium shrink-0 transition-smooth border",
                activeCategory === cat
                  ? "border-primary/60 bg-primary/15 text-primary"
                  : "border-border/40 text-muted-foreground hover:text-primary hover:border-primary/30",
              ].join(" ")}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Result count */}
      {!loading && (
        <p className="text-xs text-muted-foreground mb-5">
          {filtered.length} movie{filtered.length !== 1 ? "s" : ""} shown
        </p>
      )}

      {/* Loading state */}
      {loading && (
        <div
          className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4"
          data-ocid="movies.loading_state"
        >
          {Array.from({ length: 12 }).map((_, i) => (
            // biome-ignore lint/suspicious/noArrayIndexKey: static skeleton list
            <Skeleton key={i} className="aspect-[2/3] rounded-xl" />
          ))}
        </div>
      )}

      {/* Empty state */}
      {!loading && filtered.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex flex-col items-center justify-center py-24 text-center"
          data-ocid="movies.empty_state"
        >
          <p className="text-4xl mb-4">🎬</p>
          <p className="text-lg font-semibold text-foreground mb-2">
            No movies found
          </p>
          <p className="text-sm text-muted-foreground mb-5">
            Try a different filter or category
          </p>
          <button
            type="button"
            onClick={() => {
              setAccessFilter("all");
              setActiveCategory("All");
            }}
            className="btn-gold-outline px-5 py-2 rounded-lg text-sm font-medium"
          >
            Clear filters
          </button>
        </motion.div>
      )}

      {/* Movie grid */}
      {!loading && filtered.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {filtered.map((movie, i) => (
            <motion.div
              key={movie.id}
              initial={{ opacity: 0, scale: 0.94 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: Math.min(i * 0.04, 0.3) }}
              className="group relative"
              data-ocid={`movies.item.${i + 1}`}
            >
              <Link to="/movie/$id" params={{ id: String(movie.id) }}>
                <div className="relative overflow-hidden rounded-xl aspect-[2/3] bg-card border border-border/50 transition-smooth group-hover:border-primary/50 group-hover:glow-gold group-hover:scale-[1.04]">
                  <img
                    src={movie.thumbnailUrl}
                    alt={movie.title}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src =
                        "/assets/images/placeholder.svg";
                    }}
                  />
                  {/* Gradient overlay on hover */}
                  <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-smooth" />
                  {/* Play button */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-smooth">
                    <div className="size-11 rounded-full bg-primary/90 flex items-center justify-center shadow-glow">
                      <Play className="size-5 text-primary-foreground fill-current" />
                    </div>
                  </div>
                  {/* Premium lock */}
                  {movie.isPremium && (
                    <div className="absolute top-2 right-2 bg-background/80 backdrop-blur-sm rounded px-1.5 py-0.5 flex items-center gap-1 text-[10px] text-primary font-bold">
                      <Lock className="size-2.5" />
                      PRO
                    </div>
                  )}
                  {/* Free badge */}
                  {!movie.isPremium && (
                    <div className="absolute top-2 left-2 bg-background/80 backdrop-blur-sm rounded px-1.5 py-0.5 text-[10px] text-foreground/80 font-medium">
                      FREE
                    </div>
                  )}
                  {/* Rating */}
                  <div className="absolute bottom-2 left-2 flex items-center gap-1 text-[11px] text-foreground/90 bg-background/70 backdrop-blur-sm rounded px-1.5 py-0.5">
                    <Star className="size-3 fill-primary text-primary" />
                    {movie.rating.toFixed(1)}
                  </div>
                </div>
                <div className="mt-2 px-0.5">
                  <p className="text-xs font-semibold text-foreground truncate">
                    {movie.title}
                  </p>
                  <p className="text-[11px] text-muted-foreground">
                    {movie.duration}
                  </p>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
