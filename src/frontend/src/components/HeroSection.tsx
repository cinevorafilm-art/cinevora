import type { Movie } from "@/types";
import { Link } from "@tanstack/react-router";
import useEmblaCarousel from "embla-carousel-react";
import { Info, Play } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useCallback, useEffect, useState } from "react";

const HERO_OVERLAYS = [
  {
    gradient: "from-indigo-950/90 via-indigo-900/30 to-transparent",
    accent: "oklch(0.45 0.2 260)",
  },
  {
    gradient: "from-violet-950/90 via-violet-900/30 to-transparent",
    accent: "oklch(0.42 0.22 290)",
  },
  {
    gradient: "from-amber-950/90 via-amber-900/30 to-transparent",
    accent: "oklch(0.38 0.18 65)",
  },
  {
    gradient: "from-emerald-950/90 via-emerald-900/30 to-transparent",
    accent: "oklch(0.38 0.18 145)",
  },
  {
    gradient: "from-rose-950/90 via-rose-900/30 to-transparent",
    accent: "oklch(0.45 0.22 15)",
  },
];

interface HeroSectionProps {
  movies: Movie[];
}

export default function HeroSection({ movies }: HeroSectionProps) {
  const heroMovies = movies.slice(0, Math.min(5, movies.length));
  const [current, setCurrent] = useState(0);
  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: true,
    duration: 40,
  });

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setCurrent(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    emblaApi.on("select", onSelect);
    return () => {
      emblaApi.off("select", onSelect);
    };
  }, [emblaApi, onSelect]);

  // Auto-advance every 6 seconds
  useEffect(() => {
    if (!emblaApi) return;
    const timer = setInterval(() => {
      emblaApi.scrollNext();
    }, 6000);
    return () => clearInterval(timer);
  }, [emblaApi]);

  function goTo(idx: number) {
    emblaApi?.scrollTo(idx);
  }

  if (!heroMovies.length) return null;

  return (
    <section
      data-ocid="hero.section"
      className="relative -mt-16 h-[72vh] min-h-[520px] max-h-[800px] overflow-hidden"
      aria-label="Featured Movies"
    >
      <div ref={emblaRef} className="h-full overflow-hidden">
        <div className="flex h-full">
          {heroMovies.map((movie, idx) => {
            const overlay = HERO_OVERLAYS[idx % HERO_OVERLAYS.length];
            return (
              <div
                key={movie.id}
                className="relative flex-[0_0_100%] h-full min-w-0"
              >
                {/* Background image */}
                <div className="absolute inset-0">
                  <img
                    src={movie.thumbnailUrl}
                    alt=""
                    aria-hidden="true"
                    className="w-full h-full object-cover object-top scale-105"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src =
                        "/assets/images/placeholder.svg";
                    }}
                  />
                  {/* Gradient layers */}
                  <div
                    className={`absolute inset-0 bg-gradient-to-r ${overlay.gradient}`}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
                  {/* Ambient glow */}
                  <div
                    className="absolute bottom-0 left-0 right-0 h-48 opacity-30 blur-3xl"
                    style={{
                      background: `radial-gradient(ellipse at 20% 100%, ${overlay.accent} 0%, transparent 70%)`,
                    }}
                  />
                </div>

                {/* Content — aligned bottom-left */}
                <AnimatePresence mode="wait">
                  {idx === current && (
                    <motion.div
                      key={`hero-content-${movie.id}`}
                      initial={{ opacity: 0, y: 28 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -12 }}
                      transition={{ duration: 0.55, ease: [0.4, 0, 0.2, 1] }}
                      className="relative z-10 flex h-full flex-col justify-end px-6 md:px-12 pb-24 max-w-screen-2xl mx-auto"
                    >
                      <div className="max-w-xl">
                        {/* Badges row */}
                        <div className="flex items-center gap-2 mb-3">
                          {movie.isPremium ? (
                            <span className="premium-badge">Premium</span>
                          ) : (
                            <span className="text-label px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                              Free
                            </span>
                          )}
                          <span className="text-label text-muted-foreground px-2 py-0.5 rounded-full border border-border/40">
                            {movie.category}
                          </span>
                        </div>

                        {/* Title */}
                        <h1 className="text-4xl md:text-6xl font-display font-bold tracking-tight text-foreground leading-none mb-3">
                          {movie.title}
                        </h1>

                        {/* Meta */}
                        <div className="flex items-center gap-3 mb-3 text-sm text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <span className="text-primary">★</span>
                            <span className="font-semibold text-foreground">
                              {movie.rating.toFixed(1)}
                            </span>
                          </span>
                          <span className="w-1 h-1 rounded-full bg-border" />
                          <span>{movie.duration}</span>
                        </div>

                        {/* Description */}
                        <p className="text-sm md:text-base text-muted-foreground line-clamp-2 mb-6 leading-relaxed">
                          {movie.description}
                        </p>

                        {/* CTAs */}
                        <div className="flex items-center gap-3 flex-wrap">
                          <Link
                            to="/movie/$id"
                            params={{ id: String(movie.id) }}
                            data-ocid="hero.watch_button"
                            className="btn-gold inline-flex items-center gap-2 px-6 py-2.5 rounded-xl font-display text-sm"
                          >
                            <Play className="size-4 fill-current" />
                            Watch Now
                          </Link>
                          <Link
                            to="/movie/$id"
                            params={{ id: String(movie.id) }}
                            data-ocid="hero.more_info_button"
                            className="btn-gold-outline inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-display text-sm"
                          >
                            <Info className="size-4" />
                            More Info
                          </Link>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>

      {/* Dot indicators */}
      <div
        data-ocid="hero.pagination"
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-2 z-20"
      >
        {heroMovies.map((movie, i) => (
          <button
            key={movie.id}
            type="button"
            onClick={() => goTo(i)}
            aria-label={`Go to slide ${i + 1}`}
            className={`h-1.5 rounded-full transition-all duration-300 ${
              i === current
                ? "w-8 bg-primary shadow-[0_0_8px_oklch(0.72_0.18_70_/_0.8)]"
                : "w-2 bg-foreground/25 hover:bg-foreground/50"
            }`}
          />
        ))}
      </div>

      {/* Bottom fade into content */}
      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-background to-transparent pointer-events-none z-10" />
    </section>
  );
}
