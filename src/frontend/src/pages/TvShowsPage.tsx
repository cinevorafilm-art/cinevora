import { Button } from "@/components/ui/button";
import { Link } from "@tanstack/react-router";
import { ArrowRight, Bell, Clapperboard, Sparkles, Tv2 } from "lucide-react";
import { motion } from "motion/react";
import { toast } from "sonner";

const COMING_SOON_SHOWS = [
  {
    title: "Crimson Arc",
    genre: "Thriller",
    seasons: "3 Seasons",
    status: "Coming Q2 2026",
    thumbnail: "/assets/generated/movie-3.dim_400x600.jpg",
  },
  {
    title: "Dynasty of Echoes",
    genre: "Drama",
    seasons: "2 Seasons",
    status: "Coming Q3 2026",
    thumbnail: "/assets/generated/movie-6.dim_400x600.jpg",
  },
  {
    title: "The Quantum Files",
    genre: "Sci-Fi",
    seasons: "1 Season",
    status: "Coming Q3 2026",
    thumbnail: "/assets/generated/movie-1.dim_400x600.jpg",
  },
  {
    title: "Midnight Protocol",
    genre: "Action",
    seasons: "4 Seasons",
    status: "Coming Q4 2026",
    thumbnail: "/assets/generated/movie-2.dim_400x600.jpg",
  },
];

const FEATURES = [
  {
    icon: Clapperboard,
    title: "Binge-worthy Series",
    desc: "Full seasons of original drama, sci-fi, and thriller content",
  },
  {
    icon: Sparkles,
    title: "Original Productions",
    desc: "Exclusive Cinevora originals you won't find anywhere else",
  },
  {
    icon: Bell,
    title: "New Episodes Weekly",
    desc: "Fresh episodes drop every Friday — never wait long",
  },
];

export default function TvShowsPage() {
  return (
    <div data-ocid="tv_shows.page" className="min-h-screen overflow-hidden">
      {/* Hero section */}
      <div className="relative flex flex-col items-center justify-center text-center px-6 py-24 md:py-36 overflow-hidden">
        {/* Animated background */}
        <div className="absolute inset-0 bg-gradient-to-b from-background via-card/30 to-background" />
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-primary/8 rounded-full blur-3xl animate-pulse" />
          <div
            className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent/6 rounded-full blur-3xl animate-pulse"
            style={{ animationDelay: "1.5s" }}
          />
          <div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-primary/5 rounded-full blur-2xl animate-pulse"
            style={{ animationDelay: "0.75s" }}
          />
        </div>

        {/* Grid overlay */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              "linear-gradient(currentColor 1px, transparent 1px), linear-gradient(90deg, currentColor 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />

        <div className="relative z-10 max-w-3xl">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="inline-flex items-center gap-2 bg-primary/10 border border-primary/25 rounded-full px-4 py-1.5 text-sm font-medium text-primary mb-8"
          >
            <Tv2 className="size-4" />
            <span>TV Shows — Coming Soon</span>
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-hero leading-none mb-4"
          >
            <span className="text-foreground">Your Next </span>
            <span
              className="text-transparent bg-clip-text"
              style={{ backgroundImage: "var(--gradient-gold)" }}
            >
              Obsession
            </span>
            <br />
            <span className="text-foreground">Is Coming</span>
          </motion.h1>

          {/* Subtext */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.35 }}
            className="text-lg text-muted-foreground max-w-xl mx-auto mb-10 leading-relaxed"
          >
            We're crafting a world-class TV experience — original series,
            gripping dramas, and edge-of-your-seat thrillers. Launching 2026.
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.45 }}
            className="flex flex-wrap items-center justify-center gap-3"
          >
            <Button asChild className="btn-gold px-8 py-2.5 rounded-xl text-sm">
              <Link to="/movies" data-ocid="tv_shows.explore_movies_button">
                Explore Movies While You Wait
                <ArrowRight className="size-4 ml-2" />
              </Link>
            </Button>
            <Button
              type="button"
              variant="outline"
              className="btn-gold-outline px-6 py-2.5 rounded-xl text-sm"
              data-ocid="tv_shows.notify_button"
              onClick={() =>
                toast("We'll notify you when TV Shows launch!", {
                  description: "Stay tuned — TV is coming to Cinevora in 2026.",
                })
              }
            >
              <Bell className="size-4 mr-2" />
              Notify Me
            </Button>
          </motion.div>
        </div>
      </div>

      {/* Features row */}
      <div className="px-4 md:px-8 max-w-screen-xl mx-auto mb-16">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {FEATURES.map((feat, i) => (
            <motion.div
              key={feat.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="glass-card p-5 text-center"
            >
              <div className="w-10 h-10 rounded-full bg-primary/10 border border-primary/25 flex items-center justify-center mx-auto mb-3">
                <feat.icon className="size-5 text-primary" />
              </div>
              <h3 className="font-semibold text-foreground text-sm mb-1">
                {feat.title}
              </h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                {feat.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Preview shows */}
      <div className="px-4 md:px-8 max-w-screen-xl mx-auto pb-20">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mb-6"
        >
          <h2 className="text-section-heading text-foreground mb-1">
            Sneak Preview
          </h2>
          <p className="text-sm text-muted-foreground">
            A glimpse of what's coming to Cinevora TV
          </p>
        </motion.div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {COMING_SOON_SHOWS.map((show, i) => (
            <motion.div
              key={show.title}
              initial={{ opacity: 0, scale: 0.93 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className="group relative"
              data-ocid={`tv_shows.preview.item.${i + 1}`}
            >
              <div className="relative overflow-hidden rounded-xl aspect-[2/3] bg-card border border-border/40">
                <img
                  src={show.thumbnail}
                  alt={show.title}
                  className="w-full h-full object-cover opacity-60 group-hover:opacity-80 transition-smooth group-hover:scale-105"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src =
                      "/assets/images/placeholder.svg";
                  }}
                />
                {/* Coming soon overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/30 to-transparent" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="bg-background/60 backdrop-blur-sm border border-border/40 rounded-full px-3 py-1.5 text-[10px] font-semibold text-muted-foreground">
                    Coming Soon
                  </div>
                </div>
                <div className="absolute bottom-0 left-0 right-0 p-3">
                  <p className="text-xs font-bold text-foreground truncate">
                    {show.title}
                  </p>
                  <div className="flex items-center justify-between mt-0.5">
                    <span className="text-[10px] text-muted-foreground">
                      {show.genre}
                    </span>
                    <span className="text-[10px] text-primary font-medium">
                      {show.seasons}
                    </span>
                  </div>
                </div>
              </div>
              <div className="mt-2 px-0.5">
                <p className="text-[11px] text-muted-foreground text-gold-subtle">
                  {show.status}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
