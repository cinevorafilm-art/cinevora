import VideoPlayer from "@/components/VideoPlayer";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { getMovie, getMovies } from "@/lib/api";
import { useAuthStore } from "@/store/authStore";
import { useMovieStore } from "@/store/movieStore";
import type { Movie, WatchEntry } from "@/types";
import { Link, useParams } from "@tanstack/react-router";
import {
  Check,
  Clock,
  Crown,
  Play,
  Plus,
  Star,
  Tag,
  Users,
} from "lucide-react";
import { motion } from "motion/react";
import { useEffect, useRef, useState } from "react";

function RelatedCard({
  movie,
  index,
}: {
  movie: Movie;
  index: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.07, duration: 0.4 }}
      className="group flex-shrink-0 w-36 sm:w-44"
      data-ocid={`related.item.${index + 1}`}
    >
      <Link to="/movie/$id" params={{ id: String(movie.id) }}>
        <div className="relative overflow-hidden rounded-lg aspect-[2/3] bg-card border border-border/40 transition-smooth group-hover:border-primary/50 group-hover:scale-[1.03] group-hover:shadow-[0_0_20px_oklch(0.72_0.18_70_/_0.2)]">
          <img
            src={movie.thumbnailUrl}
            alt={movie.title}
            className="w-full h-full object-cover transition-smooth group-hover:scale-105"
            onError={(e) => {
              (e.target as HTMLImageElement).src =
                "/assets/images/placeholder.svg";
            }}
          />
          {movie.isPremium && (
            <div className="absolute top-1.5 right-1.5">
              <div
                className="w-5 h-5 rounded-full flex items-center justify-center"
                style={{
                  background:
                    "linear-gradient(135deg, oklch(0.72 0.18 70), oklch(0.65 0.16 65))",
                }}
              >
                <Crown className="size-2.5 text-primary-foreground" />
              </div>
            </div>
          )}
          <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-2">
            <div className="flex items-center gap-1">
              <Star className="size-2.5 fill-primary text-primary" />
              <span className="text-xs text-foreground/80 font-semibold">
                {movie.rating.toFixed(1)}
              </span>
            </div>
          </div>
        </div>
        <p className="mt-2 text-xs font-semibold text-foreground truncate">
          {movie.title}
        </p>
        <p className="text-[10px] text-muted-foreground mt-0.5">
          {movie.category}
        </p>
      </Link>
    </motion.div>
  );
}

function MetaBadge({
  icon: Icon,
  children,
}: {
  icon: React.ElementType;
  children: React.ReactNode;
}) {
  return (
    <span className="flex items-center gap-1.5 text-sm text-muted-foreground">
      <Icon className="size-3.5 text-primary/70" />
      {children}
    </span>
  );
}

function LoadingSkeleton() {
  return (
    <div
      className="min-h-screen px-4 md:px-12 max-w-screen-2xl mx-auto py-8"
      data-ocid="movie_detail.loading_state"
    >
      <Skeleton className="aspect-video w-full rounded-xl mb-8" />
      <div className="grid md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-4">
          <Skeleton className="h-10 w-3/4" />
          <Skeleton className="h-4 w-48" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-5/6" />
        </div>
        <Skeleton className="h-48 rounded-xl" />
      </div>
    </div>
  );
}

export default function MovieDetailPage() {
  const { id } = useParams({ strict: false }) as { id: string };
  const [movie, setMovie] = useState<Movie | null>(null);
  const [related, setRelated] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const playerRef = useRef<HTMLDivElement>(null);

  const { myList, addToMyList, removeFromMyList, watchHistory } =
    useMovieStore();
  const { isPremium } = useAuthStore();

  const inList = movie ? myList.includes(movie.id) : false;

  // Find resume position from watch history
  const watchEntry: WatchEntry | undefined = movie
    ? (watchHistory as WatchEntry[]).find(
        (entry: WatchEntry) => entry.movieId === movie.id,
      )
    : undefined;
  const resumeFrom = watchEntry?.progressSeconds ?? 0;

  // Parse duration string like "2h 28m", "1h 45m", "45m" → total seconds
  function parseDurationToSeconds(duration: string): number {
    const hoursMatch = duration.match(/(\d+)\s*h/);
    const minsMatch = duration.match(/(\d+)\s*m/);
    const hours = hoursMatch ? Number.parseInt(hoursMatch[1], 10) : 0;
    const mins = minsMatch ? Number.parseInt(minsMatch[1], 10) : 0;
    if (hours === 0 && mins === 0) return 0;
    return hours * 3600 + mins * 60;
  }

  const watchProgressPct =
    resumeFrom > 0 && movie
      ? (() => {
          const totalSeconds = parseDurationToSeconds(movie.duration);
          return totalSeconds > 0
            ? Math.min(100, (resumeFrom / totalSeconds) * 100)
            : 0;
        })()
      : 0;

  useEffect(() => {
    async function load() {
      setLoading(true);
      const [m, all] = await Promise.all([getMovie(Number(id)), getMovies()]);
      setMovie(m);
      if (m) {
        const rel = all
          .filter((mv) => mv.id !== m.id && mv.category === m.category)
          .slice(0, 8);
        // If not enough same category, fill with trending
        if (rel.length < 3) {
          const extra = all
            .filter(
              (mv) =>
                mv.id !== m.id &&
                !rel.find((r) => r.id === mv.id) &&
                mv.isTrending,
            )
            .slice(0, 4 - rel.length);
          setRelated([...rel, ...extra]);
        } else {
          setRelated(rel);
        }
      }
      setLoading(false);
    }
    load();
  }, [id]);

  function scrollToPlayer() {
    playerRef.current?.scrollIntoView({ behavior: "smooth" });
  }

  if (loading) return <LoadingSkeleton />;

  if (!movie) {
    return (
      <div
        className="min-h-screen flex flex-col items-center justify-center text-center px-6"
        data-ocid="movie_detail.not_found"
      >
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <p className="text-6xl mb-6">🎬</p>
          <h2 className="text-2xl font-display font-bold text-foreground mb-2">
            Movie not found
          </h2>
          <p className="text-muted-foreground mb-8 max-w-sm">
            This title doesn't exist or may have been removed.
          </p>
          <Button asChild className="btn-gold px-8 py-2.5 rounded-lg">
            <Link to="/movies">Browse Movies</Link>
          </Button>
        </motion.div>
      </div>
    );
  }

  return (
    <motion.div
      data-ocid="movie_detail.page"
      className="min-h-screen"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      {/* Hero backdrop blur */}
      <div
        className="fixed inset-0 -z-10 opacity-20 pointer-events-none"
        style={{
          backgroundImage: `url(${movie.thumbnailUrl})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          filter: "blur(60px) saturate(0.4)",
        }}
      />

      {/* ── Video Player ── */}
      <div
        ref={playerRef}
        className="px-4 md:px-8 lg:px-12 max-w-screen-2xl mx-auto pt-6 pb-4"
        data-ocid="movie_detail.player_section"
      >
        <VideoPlayer movie={movie} resumeFrom={resumeFrom} />
      </div>

      {/* ── Movie Info ── */}
      <div className="px-4 md:px-8 lg:px-12 max-w-screen-2xl mx-auto pb-16">
        <div className="grid md:grid-cols-3 gap-8 lg:gap-12">
          {/* Left: Main Info */}
          <motion.div
            className="md:col-span-2"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15, duration: 0.5 }}
          >
            {/* Title row */}
            <div className="flex items-start justify-between flex-wrap gap-4 mb-4">
              <div className="flex-1 min-w-0">
                {movie.isPremium && (
                  <motion.span
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="premium-badge inline-flex items-center gap-1 mb-2"
                  >
                    <Crown className="size-2.5" />
                    Premium
                  </motion.span>
                )}
                <h1
                  className="text-3xl md:text-4xl font-display font-bold leading-tight"
                  style={{ color: "oklch(0.92 0.01 60)" }}
                >
                  {movie.title}
                </h1>
              </div>

              {/* My List toggle */}
              <Button
                type="button"
                onClick={() => {
                  inList ? removeFromMyList(movie.id) : addToMyList(movie.id);
                }}
                data-ocid="movie_detail.list_button"
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold flex-shrink-0 transition-smooth ${
                  inList ? "btn-gold" : "btn-gold-outline"
                }`}
              >
                {inList ? (
                  <Check className="size-4" />
                ) : (
                  <Plus className="size-4" />
                )}
                {inList ? "In My List" : "Add to My List"}
              </Button>
            </div>

            {/* Meta badges */}
            <div className="flex flex-wrap items-center gap-4 mb-5">
              <MetaBadge icon={Star}>
                <span
                  className="font-bold text-sm"
                  style={{ color: "oklch(0.72 0.18 70)" }}
                >
                  {movie.rating.toFixed(1)}
                </span>
                <span className="text-xs">/ 10</span>
              </MetaBadge>
              <MetaBadge icon={Clock}>{movie.duration}</MetaBadge>
              <MetaBadge icon={Tag}>
                <Badge
                  variant="secondary"
                  className="text-xs bg-secondary/80 text-secondary-foreground"
                >
                  {movie.category}
                </Badge>
              </MetaBadge>
            </div>

            {/* Description */}
            <p className="text-sm md:text-base text-muted-foreground leading-relaxed mb-8">
              {movie.description}
            </p>

            {/* Cast */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Users className="size-3.5 text-primary/70" />
                <span className="text-xs font-bold tracking-widest uppercase text-muted-foreground">
                  Cast
                </span>
              </div>
              <div className="flex flex-wrap gap-2">
                {movie.cast.map((name) => (
                  <span
                    key={name}
                    className="px-3 py-1 rounded-full text-xs text-foreground/80 border transition-smooth hover:border-primary/40 hover:text-primary"
                    style={{
                      background: "oklch(0.14 0.018 50 / 0.7)",
                      backdropFilter: "blur(8px)",
                      borderColor: "oklch(0.72 0.18 70 / 0.15)",
                    }}
                  >
                    {name}
                  </span>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Right: Action Panel */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.25, duration: 0.5 }}
            className="glass-card p-6 h-fit"
            data-ocid="movie_detail.action_panel"
          >
            {/* Watch progress */}
            {resumeFrom > 0 && (
              <div className="mb-5">
                <div className="flex items-center justify-between text-xs text-muted-foreground mb-1.5">
                  <span>Continue watching</span>
                  <span className="text-primary">
                    {Math.floor(resumeFrom / 60)}m watched
                  </span>
                </div>
                <div className="h-1 rounded-full bg-muted overflow-hidden">
                  <div
                    className="h-full rounded-full bg-gradient-gold transition-all"
                    style={{ width: `${watchProgressPct}%` }}
                  />
                </div>
              </div>
            )}

            {/* Watch Now CTA */}
            {movie.isPremium && !isPremium ? (
              <div className="space-y-3">
                <div className="flex items-center gap-2 p-3 rounded-lg bg-primary/5 border border-primary/20">
                  <Crown className="size-4 text-primary flex-shrink-0" />
                  <span className="text-xs text-muted-foreground">
                    Premium subscription required
                  </span>
                </div>
                <Button
                  asChild
                  className="btn-gold w-full rounded-lg text-sm font-bold py-2.5"
                >
                  <Link to="/pricing" data-ocid="movie_detail.subscribe_button">
                    <Crown className="size-4 mr-2" />
                    Subscribe to Premium
                  </Link>
                </Button>
              </div>
            ) : (
              <Button
                type="button"
                onClick={scrollToPlayer}
                data-ocid="movie_detail.watch_button"
                className="btn-gold w-full rounded-lg text-sm font-bold py-2.5 flex items-center justify-center gap-2"
              >
                <Play className="size-4 fill-current" />
                {resumeFrom > 0 ? "Resume Watching" : "Watch Now"}
              </Button>
            )}

            {/* Info grid */}
            <div className="mt-5 pt-5 border-t border-border/30 space-y-3">
              <div className="flex justify-between text-xs">
                <span className="text-muted-foreground">Category</span>
                <span className="text-foreground font-medium">
                  {movie.category}
                </span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-muted-foreground">Runtime</span>
                <span className="text-foreground font-medium">
                  {movie.duration}
                </span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-muted-foreground">Rating</span>
                <span
                  className="font-bold"
                  style={{ color: "oklch(0.72 0.18 70)" }}
                >
                  ★ {movie.rating.toFixed(1)}
                </span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-muted-foreground">Access</span>
                <span
                  className={`font-semibold ${movie.isPremium ? "" : "text-green-400"}`}
                  style={
                    movie.isPremium ? { color: "oklch(0.72 0.18 70)" } : {}
                  }
                >
                  {movie.isPremium ? "Premium" : "Free"}
                </span>
              </div>
            </div>
          </motion.div>
        </div>

        {/* ── Related Movies ── */}
        {related.length > 0 && (
          <motion.div
            className="mt-14 pt-10 section-divider"
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            data-ocid="movie_detail.related_section"
          >
            <h2 className="text-section-heading text-foreground mb-6">
              More Like This
            </h2>
            <div className="overflow-x-auto scrollbar-thin pb-4">
              <div className="flex gap-4">
                {related.map((m, i) => (
                  <RelatedCard key={m.id} movie={m} index={i} />
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}
