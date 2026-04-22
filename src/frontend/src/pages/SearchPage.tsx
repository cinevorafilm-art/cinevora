import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { searchMovies } from "@/lib/api";
import { useMovieStore } from "@/store/movieStore";
import type { Movie } from "@/types";
import { Link, useNavigate, useSearch } from "@tanstack/react-router";
import { Film, Lock, Play, Search, Star } from "lucide-react";
import { motion } from "motion/react";
import { useEffect, useRef, useState } from "react";

export default function SearchPage() {
  const navigate = useNavigate();
  const searchParams = useSearch({ strict: false }) as { q?: string };
  const query = searchParams.q ?? "";

  const [inputValue, setInputValue] = useState(query);
  const [results, setResults] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const { setSearchQuery, setSearchResults } = useMovieStore();

  // Sync input when URL query changes
  useEffect(() => {
    setInputValue(query);
  }, [query]);

  // Fetch on URL query change
  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }
    setLoading(true);
    searchMovies(query).then((data) => {
      setResults(data);
      setSearchResults(data);
      setLoading(false);
    });
    setSearchQuery(query);
  }, [query, setSearchQuery, setSearchResults]);

  // Debounce navigate on typed input
  function handleInputChange(value: string) {
    setInputValue(value);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      if (value.trim()) {
        navigate({ to: "/search", search: { q: value.trim() } });
      } else {
        navigate({ to: "/search" });
      }
    }, 400);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (inputValue.trim()) {
      navigate({ to: "/search", search: { q: inputValue.trim() } });
    }
  }

  return (
    <div
      data-ocid="search.page"
      className="min-h-screen px-6 md:px-12 max-w-screen-2xl mx-auto py-10"
    >
      {/* Search bar */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="mb-8"
      >
        <h1 className="text-section-heading text-foreground mb-5">Search</h1>
        <form onSubmit={handleSubmit} className="flex gap-3 max-w-xl">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
            <Input
              value={inputValue}
              onChange={(e) => handleInputChange(e.target.value)}
              placeholder="Search movies, genres, cast..."
              data-ocid="search.search_input"
              className="pl-10 bg-card border-border/50 focus:border-primary/60 h-11"
              autoFocus
            />
          </div>
          <button
            type="submit"
            data-ocid="search.submit_button"
            className="btn-gold px-6 py-2 rounded-lg text-sm font-semibold"
          >
            Search
          </button>
        </form>
      </motion.div>

      {/* Result count */}
      {query && !loading && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-sm text-muted-foreground mb-6"
          data-ocid="search.result_count"
        >
          {results.length > 0
            ? `${results.length} movie${results.length !== 1 ? "s" : ""} found for "${query}"`
            : null}
        </motion.p>
      )}

      {/* Loading skeletons */}
      {loading && (
        <div
          className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4"
          data-ocid="search.loading_state"
        >
          {Array.from({ length: 8 }).map((_, i) => (
            // biome-ignore lint/suspicious/noArrayIndexKey: static skeleton
            <Skeleton key={i} className="aspect-[2/3] rounded-lg" />
          ))}
        </div>
      )}

      {/* Empty state: no query */}
      {!query && !loading && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col items-center justify-center py-28 text-center"
          data-ocid="search.empty_state"
        >
          <div className="size-20 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center mb-5">
            <Search className="size-8 text-primary/60" />
          </div>
          <p className="text-xl font-display font-semibold text-foreground mb-2">
            Discover your next favourite
          </p>
          <p className="text-sm text-muted-foreground max-w-xs">
            Search by title, genre, cast member, or mood — we'll find it.
          </p>
          <div className="mt-6 flex flex-wrap gap-2 justify-center">
            {["Action", "Drama", "Sci-Fi", "Thriller"].map((g) => (
              <button
                key={g}
                type="button"
                onClick={() => handleInputChange(g)}
                className="px-4 py-1.5 rounded-full border border-border/50 text-xs text-muted-foreground hover:border-primary/50 hover:text-primary transition-smooth"
              >
                {g}
              </button>
            ))}
          </div>
        </motion.div>
      )}

      {/* No results */}
      {query && !loading && results.length === 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col items-center justify-center py-28 text-center"
          data-ocid="search.no_results"
        >
          <Film className="size-12 text-muted-foreground/30 mb-4" />
          <p className="text-xl font-display font-semibold text-foreground mb-2">
            No results for "{query}"
          </p>
          <p className="text-sm text-muted-foreground mb-5">
            Try a different spelling or browse our categories
          </p>
          <Link
            to="/categories"
            className="btn-gold-outline px-6 py-2.5 rounded-lg text-sm font-semibold"
          >
            Browse Categories
          </Link>
        </motion.div>
      )}

      {/* Results grid */}
      {!loading && results.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {results.map((movie, i) => (
            <motion.div
              key={movie.id}
              initial={{ opacity: 0, scale: 0.94 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.05 }}
              className="group"
              data-ocid={`search.item.${i + 1}`}
            >
              <Link to="/movie/$id" params={{ id: String(movie.id) }}>
                <div className="relative overflow-hidden rounded-xl aspect-[2/3] bg-card border border-border/50 transition-smooth group-hover:border-primary/50 group-hover:glow-gold group-hover:scale-105">
                  <img
                    src={movie.thumbnailUrl}
                    alt={movie.title}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src =
                        "/assets/images/placeholder.svg";
                    }}
                  />
                  {/* Hover overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-smooth" />
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-smooth">
                    <div className="size-10 rounded-full bg-primary/90 flex items-center justify-center shadow-glow">
                      <Play className="size-4 text-primary-foreground fill-current" />
                    </div>
                  </div>
                  {/* Premium badge */}
                  {movie.isPremium && (
                    <div className="absolute top-2 right-2 bg-background/80 backdrop-blur-sm rounded px-1.5 py-0.5 flex items-center gap-1 text-[10px] text-primary font-bold">
                      <Lock className="size-2.5" />
                      PRO
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
                    {movie.category}
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
