import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { getMovies } from "@/lib/api";
import { useMovieStore } from "@/store/movieStore";
import type { Movie } from "@/types";
import { Link } from "@tanstack/react-router";
import { Bookmark, Heart, Lock, Play, Star, Trash2 } from "lucide-react";
import { motion } from "motion/react";
import { useEffect, useState } from "react";

export default function MyListPage() {
  const { myList, removeFromMyList } = useMovieStore();
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getMovies().then((data) => {
      setMovies(data);
      setLoading(false);
    });
  }, []);

  const listedMovies = movies.filter((m) => myList.includes(m.id));

  return (
    <div
      data-ocid="my_list.page"
      className="min-h-screen px-4 md:px-8 max-w-screen-xl mx-auto py-8 pb-16"
    >
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-end justify-between mb-8"
      >
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Bookmark className="size-5 text-primary" />
            <span className="text-label text-muted-foreground">Collection</span>
          </div>
          <h1 className="text-section-heading text-foreground">My List</h1>
          {!loading && (
            <p className="text-sm text-muted-foreground mt-1">
              {listedMovies.length} title
              {listedMovies.length !== 1 ? "s" : ""} saved
            </p>
          )}
        </div>
        {listedMovies.length > 0 && (
          <Button
            asChild
            variant="outline"
            className="btn-gold-outline rounded-xl text-sm"
          >
            <Link to="/movies" data-ocid="my_list.browse_more_button">
              + Browse More
            </Link>
          </Button>
        )}
      </motion.div>

      {/* Loading skeleton */}
      {loading && (
        <div
          data-ocid="my_list.loading_state"
          className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4"
        >
          {Array.from({ length: 8 }).map((_, i) => (
            // biome-ignore lint/suspicious/noArrayIndexKey: static skeleton
            <Skeleton key={i} className="aspect-[2/3] rounded-xl" />
          ))}
        </div>
      )}

      {/* Empty state */}
      {!loading && listedMovies.length === 0 && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          data-ocid="my_list.empty_state"
          className="flex flex-col items-center justify-center py-24 text-center"
        >
          <div className="relative mb-6">
            <div className="w-24 h-24 rounded-full bg-card border border-border/50 flex items-center justify-center">
              <Heart className="size-10 text-muted-foreground/30" />
            </div>
            <div className="absolute -top-1 -right-1 w-8 h-8 rounded-full bg-gradient-gold flex items-center justify-center">
              <span className="text-primary-foreground text-sm font-bold">
                0
              </span>
            </div>
          </div>
          <h3 className="text-xl font-display font-bold text-foreground mb-3">
            Nothing saved yet
          </h3>
          <p className="text-sm text-muted-foreground mb-7 max-w-xs leading-relaxed">
            Browse our collection and tap the bookmark icon to save movies and
            shows to your list.
          </p>
          <Button asChild className="btn-gold px-8 rounded-xl py-2.5 text-sm">
            <Link to="/movies" data-ocid="my_list.browse_button">
              Browse Movies
            </Link>
          </Button>
          <div className="mt-6 flex items-center gap-6 text-xs text-muted-foreground">
            <Link
              to="/categories"
              className="hover:text-primary transition-smooth"
              data-ocid="my_list.categories_link"
            >
              Browse Categories
            </Link>
            <span>·</span>
            <Link
              to="/tv-shows"
              className="hover:text-primary transition-smooth"
              data-ocid="my_list.tv_shows_link"
            >
              TV Shows
            </Link>
          </div>
        </motion.div>
      )}

      {/* Movie grid */}
      {!loading && listedMovies.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {listedMovies.map((movie, i) => (
            <motion.div
              key={movie.id}
              initial={{ opacity: 0, scale: 0.93, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ delay: i * 0.06 }}
              className="group relative"
              data-ocid={`my_list.item.${i + 1}`}
            >
              {/* Movie card */}
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

                  {/* Hover overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-background/95 via-background/20 to-transparent opacity-0 group-hover:opacity-100 transition-smooth" />

                  {/* Play button */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-smooth">
                    <div className="w-12 h-12 rounded-full bg-gradient-gold flex items-center justify-center shadow-glow">
                      <Play className="size-5 text-primary-foreground fill-current ml-0.5" />
                    </div>
                  </div>

                  {/* Bottom info */}
                  <div className="absolute bottom-0 left-0 right-0 p-3 translate-y-2 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-smooth">
                    <p className="text-xs font-semibold text-foreground truncate">
                      {movie.title}
                    </p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <div className="flex items-center gap-0.5">
                        <Star className="size-3 fill-primary text-primary" />
                        <span className="text-[10px] text-muted-foreground">
                          {movie.rating.toFixed(1)}
                        </span>
                      </div>
                      <span className="text-[10px] text-muted-foreground">
                        {movie.duration}
                      </span>
                    </div>
                  </div>

                  {/* Premium badge */}
                  {movie.isPremium && (
                    <div className="absolute top-2 right-2 bg-gradient-gold rounded-md px-1.5 py-0.5 flex items-center gap-1">
                      <Lock className="size-2.5 text-primary-foreground" />
                      <span className="text-[9px] font-bold text-primary-foreground">
                        PRO
                      </span>
                    </div>
                  )}

                  {/* Rating badge */}
                  <div className="absolute bottom-2 left-2 flex items-center gap-1 text-[11px] text-foreground/80 bg-background/70 backdrop-blur-sm rounded px-1.5 py-0.5 group-hover:opacity-0 transition-smooth">
                    <Star className="size-3 fill-primary text-primary" />
                    {movie.rating.toFixed(1)}
                  </div>
                </div>
              </Link>

              {/* Movie meta below card */}
              <div className="mt-2 px-0.5">
                <p className="text-xs font-medium text-foreground truncate">
                  {movie.title}
                </p>
                <p className="text-[11px] text-muted-foreground">
                  {movie.category}
                </p>
              </div>

              {/* Remove button */}
              <button
                type="button"
                onClick={() => removeFromMyList(movie.id)}
                data-ocid={`my_list.remove_button.${i + 1}`}
                aria-label={`Remove ${movie.title} from list`}
                className="absolute top-2 left-2 w-8 h-8 rounded-full bg-background/80 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-smooth hover:bg-destructive/80 text-muted-foreground hover:text-foreground border border-border/40"
              >
                <Trash2 className="size-3.5" />
              </button>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
