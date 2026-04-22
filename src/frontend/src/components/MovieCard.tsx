import { useAuthStore } from "@/store/authStore";
import { useMovieStore } from "@/store/movieStore";
import type { Movie, WatchEntry } from "@/types";
import { Link } from "@tanstack/react-router";
import { Check, Crown, Lock, Play, Plus, Star } from "lucide-react";
import { motion } from "motion/react";

interface MovieCardProps {
  movie: Movie;
  index: number;
  watchEntry?: WatchEntry;
}

export default function MovieCard({
  movie,
  index,
  watchEntry,
}: MovieCardProps) {
  const { myList, addToMyList, removeFromMyList } = useMovieStore();
  const { isPremium } = useAuthStore();
  const inList = myList.includes(movie.id);
  const isLocked = movie.isPremium && !isPremium;

  const progressPct =
    watchEntry && movie.duration
      ? Math.min(
          100,
          Math.round(
            (watchEntry.progressSeconds /
              (Number.parseInt(movie.duration) * 60 || 7200)) *
              100,
          ),
        )
      : 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.06, duration: 0.4 }}
      className="group relative shrink-0 w-36 md:w-44 lg:w-48 cursor-pointer select-none"
      data-ocid={`movie_card.item.${index + 1}`}
    >
      <Link
        to="/movie/$id"
        params={{ id: String(movie.id) }}
        aria-label={`Watch ${movie.title}`}
      >
        {/* Poster */}
        <div className="relative overflow-hidden rounded-xl aspect-[2/3] bg-card border border-border/40 transition-all duration-300 group-hover:border-primary/50 group-hover:scale-[1.03] group-hover:[box-shadow:0_0_24px_oklch(0.72_0.18_70_/_0.35),0_8px_32px_oklch(0_0_0_/_0.5)]">
          <img
            src={movie.thumbnailUrl}
            alt={movie.title}
            loading="lazy"
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            onError={(e) => {
              (e.target as HTMLImageElement).src =
                "/assets/images/placeholder.svg";
            }}
          />

          {/* Dark gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-300" />

          {/* Hover center play */}
          <motion.div
            initial={false}
            className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200"
          >
            <div className="w-12 h-12 rounded-full bg-primary/90 flex items-center justify-center shadow-[0_0_20px_oklch(0.72_0.18_70_/_0.6)]">
              <Play className="size-5 text-primary-foreground fill-current ml-0.5" />
            </div>
          </motion.div>

          {/* Lock overlay for premium */}
          {isLocked && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/60 backdrop-blur-sm">
              <Lock className="size-6 text-primary mb-1" />
              <span className="text-[10px] font-semibold text-primary uppercase tracking-wider">
                Premium
              </span>
            </div>
          )}

          {/* Premium crown badge */}
          {movie.isPremium && !isLocked && (
            <div className="absolute top-2 right-2 w-6 h-6 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center shadow-md">
              <Crown className="size-3 text-black fill-current" />
            </div>
          )}

          {/* Rating pill */}
          <div className="absolute bottom-2 left-2 flex items-center gap-1 text-[11px] text-foreground/90 bg-black/60 backdrop-blur-sm rounded-md px-1.5 py-0.5">
            <Star className="size-3 fill-primary text-primary" />
            <span className="font-medium">{movie.rating.toFixed(1)}</span>
          </div>

          {/* Duration pill */}
          <div className="absolute bottom-2 right-2 text-[10px] text-muted-foreground bg-black/60 backdrop-blur-sm rounded-md px-1.5 py-0.5">
            {movie.duration}
          </div>

          {/* Progress bar for continue watching */}
          {progressPct > 0 && (
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-border/30">
              <div
                className="h-full bg-primary transition-all"
                style={{ width: `${progressPct}%` }}
              />
            </div>
          )}
        </div>

        {/* Card info */}
        <div className="mt-2.5 px-0.5">
          <p className="text-xs font-semibold text-foreground truncate leading-tight">
            {movie.title}
          </p>
          <p className="text-[11px] text-muted-foreground mt-0.5">
            {movie.category}
          </p>
        </div>
      </Link>

      {/* Add/remove from list */}
      <button
        type="button"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          inList ? removeFromMyList(movie.id) : addToMyList(movie.id);
        }}
        data-ocid={`movie_card.list_button.${index + 1}`}
        aria-label={inList ? "Remove from My List" : "Add to My List"}
        className="absolute top-2 left-2 w-7 h-7 rounded-full bg-black/70 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-200 hover:bg-primary/30 hover:text-primary text-foreground/80 border border-border/40 hover:border-primary/60"
      >
        {inList ? (
          <Check className="size-3.5 text-primary" />
        ) : (
          <Plus className="size-3.5" />
        )}
      </button>
    </motion.div>
  );
}
