import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { getMovies } from "@/lib/api";
import { useAuthStore } from "@/store/authStore";
import { useMovieStore } from "@/store/movieStore";
import type { Movie } from "@/types";
import { useInternetIdentity } from "@caffeineai/core-infrastructure";
import { Link, useNavigate } from "@tanstack/react-router";
import {
  Clock,
  CreditCard,
  Crown,
  Download,
  Heart,
  History,
  ListVideo,
  LogOut,
  Settings,
  Shield,
  Smartphone,
  Star,
  User,
} from "lucide-react";
import { motion } from "motion/react";
import { useEffect, useState } from "react";

type ProfileTab = "mylist" | "history" | "downloads" | "settings";

const WATCH_HISTORY_DEMO = [
  {
    movieId: 1,
    title: "Stellar Horizon",
    progress: 65,
    category: "Sci-Fi",
    duration: "2h 18m",
    thumbnail: "/assets/generated/movie-1.dim_400x600.jpg",
    lastWatched: "2 hours ago",
  },
  {
    movieId: 3,
    title: "Neon Shadows",
    progress: 30,
    category: "Action",
    duration: "2h 04m",
    thumbnail: "/assets/generated/movie-3.dim_400x600.jpg",
    lastWatched: "Yesterday",
  },
  {
    movieId: 5,
    title: "Phantom Circuit",
    progress: 88,
    category: "Thriller",
    duration: "1h 48m",
    thumbnail: "/assets/generated/movie-5.dim_400x600.jpg",
    lastWatched: "3 days ago",
  },
];

const STAT_ITEMS = [
  { label: "Movies Watched", value: "24", icon: History },
  { label: "Saved Titles", value: "0", icon: Heart },
  { label: "Avg. Rating", value: "8.9", icon: Star },
];

export default function ProfilePage() {
  const { clear, identity } = useInternetIdentity();
  const { userProfile, logout, isPremium } = useAuthStore();
  const { myList, removeFromMyList } = useMovieStore();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<ProfileTab>("mylist");
  const [movies, setMovies] = useState<Movie[]>([]);

  const isAuthenticated = !!identity;

  useEffect(() => {
    getMovies().then(setMovies);
  }, []);

  const listedMovies = movies.filter((m) => myList.includes(m.id));
  const initials =
    userProfile?.name
      ?.split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2) ?? "CU";

  function handleLogout() {
    clear();
    logout();
    navigate({ to: "/" });
  }

  if (!isAuthenticated) {
    return (
      <div
        data-ocid="profile.not_authenticated"
        className="min-h-[70vh] flex flex-col items-center justify-center text-center px-6"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="glass-card p-12 max-w-sm w-full"
        >
          <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center mx-auto mb-5">
            <User className="size-10 text-muted-foreground/40" />
          </div>
          <h2 className="text-xl font-display font-bold text-foreground mb-2">
            Sign in required
          </h2>
          <p className="text-sm text-muted-foreground mb-6 leading-relaxed">
            Sign in to access your profile, saved content, and watch history.
          </p>
          <Button asChild className="btn-gold w-full rounded-xl py-2.5">
            <Link to="/auth/login" data-ocid="profile.login_button">
              Sign In
            </Link>
          </Button>
          <p className="text-xs text-muted-foreground mt-4">
            Don't have an account?{" "}
            <Link
              to="/auth/signup"
              className="text-primary hover:underline"
              data-ocid="profile.signup_link"
            >
              Sign up free
            </Link>
          </p>
        </motion.div>
      </div>
    );
  }

  return (
    <div
      data-ocid="profile.page"
      className="min-h-screen max-w-screen-xl mx-auto px-4 md:px-8 py-8 pb-16"
    >
      {/* Profile Hero */}
      <motion.div
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-2xl mb-8"
      >
        {/* Banner gradient */}
        <div className="h-32 bg-gradient-to-br from-card via-muted to-background relative">
          <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-transparent to-accent/10" />
          <div
            className="absolute inset-0 opacity-[0.04]"
            style={{
              backgroundImage:
                "radial-gradient(circle at 2px 2px, currentColor 1px, transparent 0)",
              backgroundSize: "32px 32px",
            }}
          />
        </div>

        {/* Profile info card */}
        <div className="bg-card border border-border/60 rounded-b-2xl px-6 pb-6 pt-0">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
            {/* Avatar */}
            <div className="flex items-end gap-4 -mt-10">
              <div className="relative shrink-0">
                <div className="w-20 h-20 rounded-full bg-gradient-gold flex items-center justify-center shadow-glow text-primary-foreground text-2xl font-display font-bold border-4 border-card">
                  {initials}
                </div>
                {isPremium && (
                  <div className="absolute -bottom-1 -right-1 bg-gradient-gold rounded-full p-1">
                    <Crown className="size-3 text-primary-foreground" />
                  </div>
                )}
              </div>
              <div className="pb-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <h1 className="text-xl font-display font-bold text-foreground">
                    {userProfile?.name ?? "Cinevora User"}
                  </h1>
                  <Badge
                    className={
                      isPremium
                        ? "bg-gradient-gold text-primary-foreground border-0 text-[10px] px-2"
                        : "border-border/60 text-muted-foreground text-[10px] px-2"
                    }
                  >
                    {isPremium ? (
                      <>
                        <Crown className="size-3 mr-1" />
                        Premium
                      </>
                    ) : (
                      "Free"
                    )}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground">
                  {userProfile?.email ?? "Not configured"}
                </p>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2 pb-1">
              {!isPremium && (
                <Button
                  asChild
                  className="btn-gold px-4 py-1.5 rounded-lg text-sm"
                >
                  <Link to="/pricing" data-ocid="profile.upgrade_button">
                    <Crown className="size-3.5 mr-1.5" />
                    Upgrade
                  </Link>
                </Button>
              )}
              <button
                type="button"
                onClick={handleLogout}
                data-ocid="profile.logout_button"
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border/50 text-sm text-muted-foreground hover:text-foreground hover:border-border transition-smooth"
              >
                <LogOut className="size-3.5" />
                Sign Out
              </button>
            </div>
          </div>

          {/* Stats row */}
          <div className="grid grid-cols-3 gap-3 mt-5">
            {STAT_ITEMS.map((stat) => (
              <div
                key={stat.label}
                className="bg-muted/40 rounded-xl p-3 text-center border border-border/40"
              >
                <stat.icon className="size-4 text-primary mx-auto mb-1" />
                <p className="text-base font-display font-bold text-foreground">
                  {stat.label === "Saved Titles"
                    ? String(myList.length)
                    : stat.value}
                </p>
                <p className="text-[11px] text-muted-foreground">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>

          {/* Subscription status */}
          {isPremium && (
            <div className="mt-4 flex items-center gap-2 text-xs text-muted-foreground bg-primary/5 border border-primary/20 rounded-lg px-3 py-2">
              <Shield className="size-3.5 text-primary shrink-0" />
              <span>
                Premium active
                {userProfile?.subscriptionExpiry
                  ? ` · Renews ${new Date(Number(userProfile.subscriptionExpiry)).toLocaleDateString()}`
                  : ""}
              </span>
            </div>
          )}
        </div>
      </motion.div>

      {/* Tabs */}
      <div
        className="flex gap-1 bg-card/60 border border-border/50 rounded-xl p-1 mb-6 overflow-x-auto"
        data-ocid="profile.tabs"
      >
        {(
          [
            { id: "mylist", label: "My List", icon: ListVideo },
            { id: "history", label: "Watch History", icon: History },
            { id: "downloads", label: "Downloads", icon: Download },
            { id: "settings", label: "Settings", icon: Settings },
          ] as { id: ProfileTab; label: string; icon: typeof ListVideo }[]
        ).map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id)}
            data-ocid={`profile.tab.${tab.id}`}
            className={[
              "flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-smooth shrink-0 flex-1 justify-center",
              activeTab === tab.id
                ? "bg-primary text-primary-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground",
            ].join(" ")}
          >
            <tab.icon className="size-3.5" />
            <span className="hidden sm:inline">{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Tab: My List */}
      {activeTab === "mylist" && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          data-ocid="profile.my_list_section"
        >
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-lg font-display font-bold text-foreground">
              My List
            </h2>
            <span className="text-sm text-muted-foreground">
              {listedMovies.length} title{listedMovies.length !== 1 ? "s" : ""}
            </span>
          </div>

          {listedMovies.length === 0 ? (
            <div
              data-ocid="profile.my_list.empty_state"
              className="glass-card flex flex-col items-center justify-center py-20 text-center"
            >
              <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
                <ListVideo className="size-8 text-muted-foreground/40" />
              </div>
              <h3 className="text-base font-semibold text-foreground mb-2">
                Your list is empty
              </h3>
              <p className="text-sm text-muted-foreground mb-5 max-w-xs">
                Start exploring and add movies to your list to watch later
              </p>
              <Button asChild className="btn-gold px-6 rounded-xl">
                <Link to="/movies" data-ocid="profile.my_list.explore_button">
                  Explore Movies
                </Link>
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {listedMovies.map((movie, i) => (
                <motion.div
                  key={movie.id}
                  initial={{ opacity: 0, scale: 0.93 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.06 }}
                  className="group relative"
                  data-ocid={`profile.my_list.item.${i + 1}`}
                >
                  <Link to="/movie/$id" params={{ id: String(movie.id) }}>
                    <div className="relative overflow-hidden rounded-xl aspect-[2/3] bg-card border border-border/40 transition-smooth group-hover:border-primary/40 group-hover:shadow-[0_0_20px_oklch(0.72_0.18_70/0.2)] group-hover:scale-[1.02]">
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
                      <div className="absolute bottom-0 left-0 right-0 p-3 translate-y-full group-hover:translate-y-0 transition-smooth">
                        <p className="text-xs font-semibold text-foreground truncate">
                          {movie.title}
                        </p>
                        <div className="flex items-center gap-1 mt-0.5">
                          <Star className="size-3 fill-primary text-primary" />
                          <span className="text-[10px] text-muted-foreground">
                            {movie.rating.toFixed(1)}
                          </span>
                        </div>
                      </div>
                      {movie.isPremium && (
                        <div className="absolute top-2 right-2 bg-gradient-gold rounded px-1.5 py-0.5 text-[9px] font-bold text-primary-foreground">
                          PRO
                        </div>
                      )}
                    </div>
                  </Link>
                  <button
                    type="button"
                    onClick={() => removeFromMyList(movie.id)}
                    data-ocid={`profile.my_list.remove_button.${i + 1}`}
                    aria-label={`Remove ${movie.title} from list`}
                    className="absolute top-2 left-2 w-7 h-7 rounded-full bg-background/80 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-smooth hover:bg-destructive/80 text-muted-foreground hover:text-foreground border border-border/30"
                  >
                    <Heart className="size-3.5 fill-primary text-primary" />
                  </button>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      )}

      {/* Tab: Watch History */}
      {activeTab === "history" && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          data-ocid="profile.history_section"
        >
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-lg font-display font-bold text-foreground">
              Watch History
            </h2>
            <span className="text-sm text-muted-foreground">
              {WATCH_HISTORY_DEMO.length} titles
            </span>
          </div>

          {WATCH_HISTORY_DEMO.length === 0 ? (
            <div
              data-ocid="profile.history.empty_state"
              className="glass-card flex flex-col items-center justify-center py-20 text-center"
            >
              <History className="size-10 text-muted-foreground/30 mb-4" />
              <h3 className="text-base font-semibold text-foreground mb-2">
                No watch history yet
              </h3>
              <p className="text-sm text-muted-foreground mb-5">
                Start watching to see your history here
              </p>
              <Button asChild className="btn-gold px-6 rounded-xl">
                <Link to="/movies" data-ocid="profile.history.browse_button">
                  Start Watching
                </Link>
              </Button>
            </div>
          ) : (
            <div className="space-y-3">
              {WATCH_HISTORY_DEMO.map((item, i) => (
                <motion.div
                  key={item.movieId}
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.08 }}
                  className="glass-card p-4 flex items-center gap-4 group"
                  data-ocid={`profile.history.item.${i + 1}`}
                >
                  <div className="w-16 h-24 rounded-lg overflow-hidden shrink-0">
                    <img
                      src={item.thumbnail}
                      alt={item.title}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src =
                          "/assets/images/placeholder.svg";
                      }}
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-foreground text-sm truncate mb-0.5">
                      {item.title}
                    </p>
                    <p className="text-[11px] text-muted-foreground mb-2">
                      {item.category} · {item.duration}
                    </p>
                    <div className="flex items-center gap-2">
                      <Progress
                        value={item.progress}
                        className="h-1.5 flex-1"
                      />
                      <span className="text-[11px] text-primary font-medium shrink-0">
                        {item.progress}%
                      </span>
                    </div>
                    <div className="flex items-center gap-1 mt-1.5">
                      <Clock className="size-3 text-muted-foreground" />
                      <span className="text-[11px] text-muted-foreground">
                        {item.lastWatched}
                      </span>
                    </div>
                  </div>
                  <Link
                    to="/movie/$id"
                    params={{ id: String(item.movieId) }}
                    data-ocid={`profile.history.resume_button.${i + 1}`}
                    className="shrink-0 px-3 py-1.5 rounded-lg bg-primary/10 border border-primary/30 text-xs font-semibold text-primary hover:bg-primary/20 transition-smooth"
                  >
                    Resume
                  </Link>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      )}

      {/* Tab: Downloads */}
      {activeTab === "downloads" && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          data-ocid="profile.downloads_section"
          className="glass-card p-10 flex flex-col items-center justify-center text-center"
        >
          <div className="relative mb-6">
            <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center">
              <Download className="size-9 text-muted-foreground/40" />
            </div>
            <div className="absolute -bottom-2 -right-2 bg-primary/20 border border-primary/30 rounded-full p-1.5">
              <Smartphone className="size-4 text-primary" />
            </div>
          </div>
          <h3 className="text-lg font-display font-bold text-foreground mb-2">
            Downloads — Mobile App
          </h3>
          <p className="text-sm text-muted-foreground max-w-sm leading-relaxed mb-6">
            Downloads are available in the Cinevora mobile app for offline
            viewing. Coming soon for web browsers.
          </p>
          <div className="flex items-center gap-2 text-xs text-muted-foreground bg-muted/40 border border-border/40 rounded-xl px-4 py-2.5">
            <Shield className="size-3.5 text-primary" />
            <span>DRM-protected downloads · Available on iOS & Android</span>
          </div>
        </motion.div>
      )}

      {/* Tab: Settings */}
      {activeTab === "settings" && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          data-ocid="profile.settings_section"
        >
          <h2 className="text-lg font-display font-bold text-foreground mb-5">
            Settings
          </h2>

          <div className="space-y-3">
            {/* Account */}
            <div className="glass-card p-5">
              <div className="flex items-center gap-2 mb-4">
                <User className="size-4 text-primary" />
                <h3 className="font-semibold text-foreground text-sm">
                  Account
                </h3>
              </div>
              <div className="space-y-3">
                <div className="flex items-center justify-between py-2 border-b border-border/30">
                  <div>
                    <p className="text-sm text-foreground">Name</p>
                    <p className="text-xs text-muted-foreground">
                      {userProfile?.name ?? "Not set"}
                    </p>
                  </div>
                  <span className="text-xs text-muted-foreground bg-muted/40 px-2 py-1 rounded">
                    Managed via II
                  </span>
                </div>
                <div className="flex items-center justify-between py-2">
                  <div>
                    <p className="text-sm text-foreground">Email</p>
                    <p className="text-xs text-muted-foreground">
                      {userProfile?.email ?? "Not set"}
                    </p>
                  </div>
                  <span className="text-xs text-muted-foreground bg-muted/40 px-2 py-1 rounded">
                    Managed via II
                  </span>
                </div>
              </div>
            </div>

            {/* Billing */}
            <div className="glass-card p-5">
              <div className="flex items-center gap-2 mb-4">
                <CreditCard className="size-4 text-primary" />
                <h3 className="font-semibold text-foreground text-sm">
                  Subscription & Billing
                </h3>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-foreground">
                    {isPremium ? "Premium Plan" : "Free Plan"}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {isPremium
                      ? "Full access to all content"
                      : "Limited access · No HD streaming"}
                  </p>
                </div>
                <Button
                  asChild
                  size="sm"
                  className="btn-gold-outline rounded-lg text-xs"
                >
                  <Link
                    to="/pricing"
                    data-ocid="profile.settings.manage_plan_button"
                  >
                    {isPremium ? "Manage" : "Upgrade"}
                  </Link>
                </Button>
              </div>
            </div>

            {/* Danger zone */}
            <div className="glass-card p-5 border-destructive/20">
              <h3 className="font-semibold text-destructive text-sm mb-3">
                Danger Zone
              </h3>
              <button
                type="button"
                onClick={handleLogout}
                data-ocid="profile.settings.logout_button"
                className="flex items-center gap-2 text-sm font-medium text-destructive hover:text-foreground transition-smooth"
              >
                <LogOut className="size-4" />
                Sign Out of All Devices
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}
