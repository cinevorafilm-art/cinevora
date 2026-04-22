import MovieCard from "@/components/MovieCard";
import { Skeleton } from "@/components/ui/skeleton";
import type { Movie, WatchEntry } from "@/types";
import { Link } from "@tanstack/react-router";
import useEmblaCarousel from "embla-carousel-react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useCallback, useEffect, useState } from "react";

interface MovieSectionProps {
  title: string;
  movies: Movie[];
  ocid: string;
  seeAllHref?: string;
  watchHistory?: WatchEntry[];
  dimmed?: boolean;
}

export default function MovieSection({
  title,
  movies,
  ocid,
  seeAllHref,
  watchHistory = [],
  dimmed = false,
}: MovieSectionProps) {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    dragFree: true,
    align: "start",
    containScroll: "trimSnaps",
  });
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(true);

  const updateButtons = useCallback(() => {
    if (!emblaApi) return;
    setCanPrev(emblaApi.canScrollPrev());
    setCanNext(emblaApi.canScrollNext());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    emblaApi.on("select", updateButtons);
    emblaApi.on("reInit", updateButtons);
    updateButtons();
  }, [emblaApi, updateButtons]);

  function scrollPrev() {
    emblaApi?.scrollPrev();
  }
  function scrollNext() {
    emblaApi?.scrollNext();
  }

  if (!movies.length) return null;

  return (
    <section className={`py-6 ${dimmed ? "bg-card/20" : ""}`} data-ocid={ocid}>
      <div className="px-6 md:px-12 max-w-screen-2xl mx-auto">
        {/* Section header */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-section-heading text-foreground">{title}</h2>
          <div className="flex items-center gap-3">
            {seeAllHref && (
              <Link
                to={seeAllHref as "/movies"}
                className="text-sm font-medium text-gold hover:text-primary/80 transition-colors duration-200 underline-offset-2 hover:underline"
                data-ocid={`${ocid}.see_all_link`}
              >
                See All
              </Link>
            )}
            <div className="flex gap-1">
              <button
                type="button"
                onClick={scrollPrev}
                disabled={!canPrev}
                aria-label="Scroll left"
                className="w-7 h-7 rounded-full border border-border/50 flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary/50 transition-smooth disabled:opacity-30 disabled:cursor-not-allowed"
              >
                <ChevronLeft className="size-4" />
              </button>
              <button
                type="button"
                onClick={scrollNext}
                disabled={!canNext}
                aria-label="Scroll right"
                className="w-7 h-7 rounded-full border border-border/50 flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary/50 transition-smooth disabled:opacity-30 disabled:cursor-not-allowed"
              >
                <ChevronRight className="size-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Carousel */}
        <div ref={emblaRef} className="overflow-hidden">
          <div className="flex gap-3">
            {movies.map((movie, i) => (
              <MovieCard
                key={movie.id}
                movie={movie}
                index={i}
                watchEntry={watchHistory.find((w) => w.movieId === movie.id)}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// Skeleton loading placeholder for a section
export function MovieSectionSkeleton() {
  const skeletonKeys = ["sk1", "sk2", "sk3", "sk4", "sk5", "sk6"];
  return (
    <div className="py-6 px-6 md:px-12 max-w-screen-2xl mx-auto">
      <div className="flex items-center justify-between mb-4">
        <Skeleton className="h-7 w-40" />
        <Skeleton className="h-4 w-14" />
      </div>
      <div className="flex gap-3">
        {skeletonKeys.map((k) => (
          <Skeleton
            key={k}
            className="w-36 md:w-44 lg:w-48 shrink-0 rounded-xl"
            style={{ aspectRatio: "2/3" }}
          />
        ))}
      </div>
    </div>
  );
}
