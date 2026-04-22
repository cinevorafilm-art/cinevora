import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { getMovies, getMoviesByCategory } from "@/lib/api";
import type { Movie } from "@/types";
import { Link, useNavigate, useSearch } from "@tanstack/react-router";
import { ArrowLeft, ChevronRight, Film, Lock, Play, Star } from "lucide-react";
import { motion } from "motion/react";
import { useEffect, useState } from "react";

interface CategoryData {
  name: string;
  icon: string;
  color: string;
  glowColor: string;
  count: number;
  thumbnail: string;
}

const CATEGORY_DATA: CategoryData[] = [
  {
    name: "Action",
    icon: "💥",
    color: "from-red-950/80 via-red-900/30 to-transparent",
    glowColor: "hover:shadow-[0_0_30px_oklch(0.55_0.22_25/0.3)]",
    count: 24,
    thumbnail: "/assets/generated/movie-3.dim_400x600.jpg",
  },
  {
    name: "Drama",
    icon: "🎭",
    color: "from-purple-950/80 via-purple-900/30 to-transparent",
    glowColor: "hover:shadow-[0_0_30px_oklch(0.45_0.18_310/0.3)]",
    count: 31,
    thumbnail: "/assets/generated/movie-4.dim_400x600.jpg",
  },
  {
    name: "Sci-Fi",
    icon: "🚀",
    color: "from-blue-950/80 via-blue-900/30 to-transparent",
    glowColor: "hover:shadow-[0_0_30px_oklch(0.45_0.2_250/0.3)]",
    count: 18,
    thumbnail: "/assets/generated/movie-1.dim_400x600.jpg",
  },
  {
    name: "Thriller",
    icon: "🔪",
    color: "from-neutral-950/90 via-neutral-900/30 to-transparent",
    glowColor: "hover:shadow-[0_0_30px_oklch(0.4_0.01_50/0.4)]",
    count: 22,
    thumbnail: "/assets/generated/movie-5.dim_400x600.jpg",
  },
  {
    name: "Comedy",
    icon: "😂",
    color: "from-amber-950/80 via-amber-900/25 to-transparent",
    glowColor: "hover:shadow-[0_0_30px_oklch(0.65_0.18_85/0.3)]",
    count: 15,
    thumbnail: "/assets/generated/movie-2.dim_400x600.jpg",
  },
  {
    name: "Horror",
    icon: "👻",
    color: "from-zinc-950/90 via-zinc-900/30 to-transparent",
    glowColor: "hover:shadow-[0_0_30px_oklch(0.35_0.01_50/0.5)]",
    count: 12,
    thumbnail: "/assets/generated/movie-6.dim_400x600.jpg",
  },
];

function MovieCard({
  movie,
  index,
}: {
  movie: Movie;
  index: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.93 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: index * 0.05 }}
      className="group relative"
      data-ocid={`categories.movie.item.${index + 1}`}
    >
      <Link to="/movie/$id" params={{ id: String(movie.id) }}>
        <div className="relative overflow-hidden rounded-xl aspect-[2/3] bg-card border border-border/40 transition-smooth group-hover:border-primary/40 group-hover:shadow-[0_0_24px_oklch(0.72_0.18_70/0.2)] group-hover:scale-[1.03]">
          <img
            src={movie.thumbnailUrl}
            alt={movie.title}
            className="w-full h-full object-cover"
            onError={(e) => {
              (e.target as HTMLImageElement).src =
                "/assets/images/placeholder.svg";
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-smooth" />
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-smooth">
            <div className="w-11 h-11 rounded-full bg-gradient-gold flex items-center justify-center shadow-glow">
              <Play className="size-4 text-primary-foreground fill-current ml-0.5" />
            </div>
          </div>
          {movie.isPremium && (
            <div className="absolute top-2 right-2 bg-gradient-gold rounded-md px-1.5 py-0.5 flex items-center gap-1">
              <Lock className="size-2.5 text-primary-foreground" />
              <span className="text-[9px] font-bold text-primary-foreground">
                PRO
              </span>
            </div>
          )}
          <div className="absolute bottom-2 left-2 flex items-center gap-1 text-[11px] text-foreground/80 bg-background/70 backdrop-blur-sm rounded px-1.5 py-0.5 group-hover:opacity-0 transition-smooth">
            <Star className="size-3 fill-primary text-primary" />
            {movie.rating.toFixed(1)}
          </div>
        </div>
      </Link>
      <div className="mt-2 px-0.5">
        <p className="text-xs font-medium text-foreground truncate">
          {movie.title}
        </p>
        <p className="text-[11px] text-muted-foreground">{movie.duration}</p>
      </div>
    </motion.div>
  );
}

export default function CategoriesPage() {
  const search = useSearch({ strict: false }) as { genre?: string };
  const genre = search?.genre;
  const navigate = useNavigate();

  const [movies, setMovies] = useState<Movie[]>([]);
  const [allMovies, setAllMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getMovies().then(setAllMovies);
  }, []);

  useEffect(() => {
    if (!genre) return;
    setLoading(true);
    getMoviesByCategory(genre).then((data) => {
      setMovies(data);
      setLoading(false);
    });
  }, [genre]);

  // Genre view — filtered movies
  if (genre) {
    const catData = CATEGORY_DATA.find((c) => c.name === genre);

    return (
      <div
        data-ocid="categories.genre_page"
        className="min-h-screen px-4 md:px-8 max-w-screen-xl mx-auto py-8 pb-16"
      >
        {/* Back + heading */}
        <motion.div
          initial={{ opacity: 0, x: -12 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center gap-3 mb-8"
        >
          <button
            type="button"
            onClick={() => navigate({ to: "/categories" })}
            data-ocid="categories.back_button"
            className="w-9 h-9 rounded-xl bg-card border border-border/50 flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary/40 transition-smooth"
          >
            <ArrowLeft className="size-4" />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-2xl">{catData?.icon ?? "🎬"}</span>
              <h1 className="text-section-heading text-foreground">{genre}</h1>
            </div>
            <p className="text-sm text-muted-foreground mt-0.5">
              {loading
                ? "Loading..."
                : `${movies.length} title${movies.length !== 1 ? "s" : ""}`}
            </p>
          </div>
        </motion.div>

        {/* Loading */}
        {loading && (
          <div
            data-ocid="categories.loading_state"
            className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4"
          >
            {Array.from({ length: 6 }).map((_, i) => (
              // biome-ignore lint/suspicious/noArrayIndexKey: static skeleton
              <Skeleton key={i} className="aspect-[2/3] rounded-xl" />
            ))}
          </div>
        )}

        {/* Movies */}
        {!loading && movies.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {movies.map((movie, i) => (
              <MovieCard key={movie.id} movie={movie} index={i} />
            ))}
          </div>
        )}

        {/* Empty state for genre */}
        {!loading && movies.length === 0 && (
          <div
            data-ocid="categories.genre.empty_state"
            className="flex flex-col items-center justify-center py-24 text-center"
          >
            <Film className="size-12 text-muted-foreground/30 mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">
              No movies in {genre} yet
            </h3>
            <p className="text-sm text-muted-foreground mb-5">
              We're adding new titles regularly. Check back soon.
            </p>
            <Button
              variant="outline"
              className="btn-gold-outline rounded-xl px-5"
              onClick={() => navigate({ to: "/categories" })}
              data-ocid="categories.genre.back_button"
            >
              Browse All Categories
            </Button>
          </div>
        )}
      </div>
    );
  }

  // Main categories view
  return (
    <div
      data-ocid="categories.page"
      className="min-h-screen px-4 md:px-8 max-w-screen-xl mx-auto py-8 pb-16"
    >
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-10"
      >
        <div className="flex items-center gap-2 mb-1">
          <Film className="size-5 text-primary" />
          <span className="text-label text-muted-foreground">Browse By</span>
        </div>
        <h1 className="text-section-heading text-foreground mb-2">
          Categories
        </h1>
        <p className="text-muted-foreground text-sm">
          Find exactly what you're in the mood for tonight
        </p>
      </motion.div>

      {/* Category cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-16">
        {CATEGORY_DATA.map((cat, i) => {
          const catMovies = allMovies.filter((m) => m.category === cat.name);
          return (
            <motion.div
              key={cat.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.07 }}
              data-ocid={`categories.item.${i + 1}`}
            >
              <Link
                to="/categories"
                search={{ genre: cat.name }}
                className={[
                  "relative flex h-44 rounded-2xl overflow-hidden border border-border/40 transition-smooth cursor-pointer group",
                  "hover:border-primary/50 hover:scale-[1.02]",
                  cat.glowColor,
                ].join(" ")}
                data-ocid={`categories.genre_link.${cat.name.toLowerCase()}`}
              >
                {/* Background thumbnail */}
                <div className="absolute inset-0">
                  <img
                    src={cat.thumbnail}
                    alt=""
                    className="w-full h-full object-cover opacity-30 group-hover:opacity-45 group-hover:scale-105 transition-smooth"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src =
                        "/assets/images/placeholder.svg";
                    }}
                  />
                </div>

                {/* Color overlay */}
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${cat.color}`}
                />

                {/* Content */}
                <div className="relative z-10 flex flex-col justify-between w-full p-5">
                  <div className="flex items-start justify-between">
                    <span className="text-4xl filter drop-shadow-lg">
                      {cat.icon}
                    </span>
                    <div className="flex items-center gap-1 bg-background/50 backdrop-blur-sm rounded-full px-2.5 py-1 border border-border/30">
                      <span className="text-[11px] font-semibold text-foreground">
                        {catMovies.length > 0 ? catMovies.length : cat.count}
                      </span>
                      <span className="text-[10px] text-muted-foreground">
                        titles
                      </span>
                    </div>
                  </div>

                  <div className="flex items-end justify-between">
                    <div>
                      <h3 className="text-xl font-display font-bold text-foreground">
                        {cat.name}
                      </h3>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {catMovies.length > 0
                          ? `${catMovies.filter((m) => !m.isPremium).length} free · ${catMovies.filter((m) => m.isPremium).length} premium`
                          : "Explore collection"}
                      </p>
                    </div>
                    <div className="w-8 h-8 rounded-full bg-background/60 backdrop-blur-sm border border-border/30 flex items-center justify-center text-muted-foreground group-hover:text-primary group-hover:border-primary/40 group-hover:bg-primary/10 transition-smooth">
                      <ChevronRight className="size-4 group-hover:translate-x-0.5 transition-smooth" />
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          );
        })}
      </div>

      {/* Quick browse section */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="glass-card p-6"
      >
        <h2 className="font-display font-bold text-foreground text-base mb-1">
          Trending Across All Categories
        </h2>
        <p className="text-sm text-muted-foreground mb-5">
          Most watched this week
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
          {allMovies.slice(0, 6).map((movie, i) => (
            <motion.div
              key={movie.id}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.04 }}
              className="group"
              data-ocid={`categories.trending.item.${i + 1}`}
            >
              <Link to="/movie/$id" params={{ id: String(movie.id) }}>
                <div className="relative overflow-hidden rounded-lg aspect-[2/3] bg-card border border-border/30 transition-smooth group-hover:border-primary/40 group-hover:scale-[1.03]">
                  <img
                    src={movie.thumbnailUrl}
                    alt={movie.title}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src =
                        "/assets/images/placeholder.svg";
                    }}
                  />
                  {movie.isPremium && (
                    <div className="absolute top-1.5 right-1.5 bg-gradient-gold rounded px-1 py-0.5 text-[8px] font-bold text-primary-foreground">
                      PRO
                    </div>
                  )}
                </div>
                <p className="text-[11px] font-medium text-foreground truncate mt-1.5">
                  {movie.title}
                </p>
              </Link>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
