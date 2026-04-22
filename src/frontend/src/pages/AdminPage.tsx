import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { addMovie, deleteMovie, getMoviesAdmin } from "@/lib/api";
import type { Movie } from "@/types";
import { Link } from "@tanstack/react-router";
import {
  CheckCircle,
  Film,
  ImageIcon,
  Lock,
  Plus,
  RefreshCw,
  Shield,
  Star,
  Trash2,
  TrendingUp,
  Upload,
  Video,
  XCircle,
} from "lucide-react";
import { motion } from "motion/react";
import { useCallback, useEffect, useRef, useState } from "react";

const CATEGORIES = [
  "Action",
  "Comedy",
  "Horror",
  "Sci-Fi",
  "Drama",
  "Thriller",
  "Romance",
  "Documentary",
];

const DEFAULT_FORM = {
  title: "",
  description: "",
  category: "",
  duration: "",
  rating: 8.0,
  cast: "",
  isPremium: false,
  isTrending: false,
  isTopRated: false,
};

/** Simulates upload with realistic progress. Returns an object URL for local preview. */
function simulateUpload(
  file: File,
  onProgress: (pct: number) => void,
): Promise<string> {
  return new Promise((resolve) => {
    let progress = 0;
    const tick = () => {
      progress += Math.random() * 18 + 8;
      if (progress >= 100) {
        onProgress(100);
        resolve(URL.createObjectURL(file));
      } else {
        onProgress(Math.min(progress, 95));
        setTimeout(tick, 120);
      }
    };
    setTimeout(tick, 120);
  });
}

export default function AdminPage() {
  // ─── Form state ───────────────────────────────────────────────
  const [form, setForm] = useState(DEFAULT_FORM);

  // ─── File state ───────────────────────────────────────────────
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null);
  const [thumbnailUrl, setThumbnailUrl] = useState("");
  const [thumbnailProgress, setThumbnailProgress] = useState(0);
  const [thumbnailUploading, setThumbnailUploading] = useState(false);
  const [thumbnailDone, setThumbnailDone] = useState(false);

  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [videoUrl, setVideoUrl] = useState("");
  const [videoProgress, setVideoProgress] = useState(0);
  const [videoUploading, setVideoUploading] = useState(false);
  const [videoDone, setVideoDone] = useState(false);

  // ─── Submit state ─────────────────────────────────────────────
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  // ─── Movie list ───────────────────────────────────────────────
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loadingMovies, setLoadingMovies] = useState(true);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const thumbnailInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);

  // Load movies on mount
  const loadMovies = useCallback(async () => {
    setLoadingMovies(true);
    try {
      const data = await getMoviesAdmin();
      setMovies(data);
    } finally {
      setLoadingMovies(false);
    }
  }, []);

  useEffect(() => {
    loadMovies();
  }, [loadMovies]);

  const handleThumbnailSelect = async (file: File) => {
    setThumbnailFile(file);
    setThumbnailDone(false);
    setThumbnailProgress(0);
    // Instant local preview
    const reader = new FileReader();
    reader.onloadend = () => setThumbnailPreview(reader.result as string);
    reader.readAsDataURL(file);
    // Upload with progress
    setThumbnailUploading(true);
    try {
      const url = await simulateUpload(file, setThumbnailProgress);
      setThumbnailUrl(url);
      setThumbnailDone(true);
    } catch {
      setThumbnailUrl("");
    } finally {
      setThumbnailUploading(false);
    }
  };

  const handleVideoSelect = async (file: File) => {
    setVideoFile(file);
    setVideoDone(false);
    setVideoProgress(0);
    setVideoUploading(true);
    try {
      const url = await simulateUpload(file, setVideoProgress);
      setVideoUrl(url);
      setVideoDone(true);
    } catch {
      setVideoUrl("");
    } finally {
      setVideoUploading(false);
    }
  };

  // Handle submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title || !form.category) {
      setError("Title and category are required.");
      return;
    }
    setError("");
    setSubmitting(true);
    try {
      await addMovie({
        title: form.title.trim(),
        description: form.description.trim(),
        category: form.category,
        duration: form.duration.trim() || "N/A",
        rating: Math.max(1, Math.min(10, form.rating)),
        cast: form.cast
          .split(",")
          .map((c) => c.trim())
          .filter(Boolean),
        isPremium: form.isPremium,
        isTrending: form.isTrending,
        isTopRated: form.isTopRated,
        thumbnailUrl:
          thumbnailUrl || "/assets/generated/movie-1.dim_400x600.jpg",
        videoUrl:
          videoUrl ||
          "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
      });
      setSuccess(true);
      setForm(DEFAULT_FORM);
      setThumbnailFile(null);
      setThumbnailPreview(null);
      setThumbnailUrl("");
      setThumbnailProgress(0);
      setThumbnailDone(false);
      setVideoFile(null);
      setVideoUrl("");
      setVideoProgress(0);
      setVideoDone(false);
      await loadMovies();
      setTimeout(() => setSuccess(false), 4000);
    } catch {
      setError("Failed to add movie. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: number) => {
    setDeletingId(id);
    try {
      await deleteMovie(id);
      await loadMovies();
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div data-ocid="admin.page" className="min-h-screen bg-background">
      {/* Admin header */}
      <header className="sticky top-0 z-50 border-b border-primary/20 bg-card/90 backdrop-blur-md px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <img
            src="/assets/file_00000000327071fa8725ab91047814ea-019db614-8423-75f7-bd3b-07933677e749.png"
            alt="Cinevora"
            className="h-8 w-auto"
            onError={(e) => {
              (e.currentTarget as HTMLImageElement).src =
                "/assets/cinevora-logo.png";
            }}
          />
          <div className="h-5 w-px bg-border/60" />
          <div className="flex items-center gap-2">
            <Shield className="size-4 text-primary" />
            <span className="text-sm font-display font-bold text-foreground">
              Cinevora Admin
            </span>
          </div>
          <Badge className="bg-primary/20 text-primary border border-primary/30 text-xs font-semibold">
            Admin Panel
          </Badge>
        </div>
        <Link
          to="/"
          data-ocid="admin.back_link"
          className="text-sm text-muted-foreground hover:text-primary transition-smooth"
        >
          ← Back to App
        </Link>
      </header>

      <div className="max-w-screen-xl mx-auto px-4 md:px-6 py-8 space-y-10">
        {/* ── Section 1: Add New Movie ─────────────────────────── */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          data-ocid="admin.add_movie.section"
        >
          <div className="flex items-center gap-2 mb-5">
            <div className="w-1 h-6 bg-gradient-gold rounded-full" />
            <h2 className="text-section-heading">Add New Movie</h2>
          </div>

          <div className="glass-card p-6 md:p-8">
            {/* Success / Error banners */}
            {success && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex items-center gap-2 p-3 rounded-lg bg-primary/10 border border-primary/30 text-primary text-sm mb-6"
                data-ocid="admin.success_state"
              >
                <CheckCircle className="size-4 shrink-0" />
                Movie added successfully!
              </motion.div>
            )}
            {error && (
              <div
                className="flex items-center gap-2 p-3 rounded-lg bg-destructive/10 border border-destructive/30 text-destructive text-sm mb-6"
                data-ocid="admin.error_state"
              >
                <XCircle className="size-4 shrink-0" />
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Row 1: Title + Duration */}
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label htmlFor="title" className="text-sm text-foreground/80">
                    Movie Title <span className="text-primary">*</span>
                  </Label>
                  <Input
                    id="title"
                    value={form.title}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, title: e.target.value }))
                    }
                    placeholder="e.g. Stellar Horizon"
                    data-ocid="admin.title_input"
                    className="bg-card/60 border-border/60 focus:border-primary/60"
                    required
                  />
                </div>
                <div className="space-y-1.5">
                  <Label
                    htmlFor="duration"
                    className="text-sm text-foreground/80"
                  >
                    Duration
                  </Label>
                  <Input
                    id="duration"
                    value={form.duration}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, duration: e.target.value }))
                    }
                    placeholder="e.g. 2h 28m"
                    data-ocid="admin.duration_input"
                    className="bg-card/60 border-border/60 focus:border-primary/60"
                  />
                </div>
              </div>

              {/* Description */}
              <div className="space-y-1.5">
                <Label
                  htmlFor="description"
                  className="text-sm text-foreground/80"
                >
                  Description
                </Label>
                <Textarea
                  id="description"
                  value={form.description}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, description: e.target.value }))
                  }
                  placeholder="Brief synopsis of the movie..."
                  data-ocid="admin.description_input"
                  className="bg-card/60 border-border/60 focus:border-primary/60 resize-none"
                  rows={3}
                />
              </div>

              {/* Row 2: Category + Rating */}
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label className="text-sm text-foreground/80">
                    Category <span className="text-primary">*</span>
                  </Label>
                  <Select
                    value={form.category}
                    onValueChange={(v) =>
                      setForm((f) => ({ ...f, category: v }))
                    }
                  >
                    <SelectTrigger
                      data-ocid="admin.category_select"
                      className="bg-card/60 border-border/60 focus:border-primary/60"
                    >
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {CATEGORIES.map((cat) => (
                        <SelectItem key={cat} value={cat}>
                          {cat}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1.5">
                  <Label
                    htmlFor="rating"
                    className="text-sm text-foreground/80"
                  >
                    Rating (1–10)
                  </Label>
                  <Input
                    id="rating"
                    type="number"
                    min={1}
                    max={10}
                    step={0.1}
                    value={form.rating}
                    onChange={(e) =>
                      setForm((f) => ({
                        ...f,
                        rating: Number.parseFloat(e.target.value) || 8.0,
                      }))
                    }
                    data-ocid="admin.rating_input"
                    className="bg-card/60 border-border/60 focus:border-primary/60"
                  />
                </div>
              </div>

              {/* Cast */}
              <div className="space-y-1.5">
                <Label htmlFor="cast" className="text-sm text-foreground/80">
                  Cast{" "}
                  <span className="text-muted-foreground text-xs font-normal">
                    (comma-separated)
                  </span>
                </Label>
                <Input
                  id="cast"
                  value={form.cast}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, cast: e.target.value }))
                  }
                  placeholder="e.g. Alex Rivera, Mia Chen, Jordan Walsh"
                  data-ocid="admin.cast_input"
                  className="bg-card/60 border-border/60 focus:border-primary/60"
                />
              </div>

              {/* Toggles row */}
              <div className="grid md:grid-cols-3 gap-4">
                {/* Free / Premium toggle */}
                <div className="glass-card p-4 flex flex-col gap-3">
                  <span className="text-sm text-foreground/80 font-medium">
                    Access Type
                  </span>
                  <div className="flex items-center justify-between">
                    <span
                      className={`text-sm font-semibold ${form.isPremium ? "text-muted-foreground" : "text-primary"}`}
                    >
                      Free
                    </span>
                    <Switch
                      checked={form.isPremium}
                      onCheckedChange={(v) =>
                        setForm((f) => ({ ...f, isPremium: v }))
                      }
                      data-ocid="admin.premium_toggle"
                    />
                    <div className="flex items-center gap-1 text-sm font-semibold">
                      <Lock
                        className={`size-3.5 ${form.isPremium ? "text-primary" : "text-muted-foreground"}`}
                      />
                      <span
                        className={
                          form.isPremium
                            ? "text-primary"
                            : "text-muted-foreground"
                        }
                      >
                        Premium
                      </span>
                    </div>
                  </div>
                </div>

                {/* Trending */}
                <div className="glass-card p-4 flex flex-col gap-3">
                  <span className="text-sm text-foreground/80 font-medium">
                    Trending Now
                  </span>
                  <div className="flex items-center gap-3">
                    <Checkbox
                      id="trending"
                      checked={form.isTrending}
                      onCheckedChange={(v) =>
                        setForm((f) => ({
                          ...f,
                          isTrending: v === true,
                        }))
                      }
                      data-ocid="admin.trending_checkbox"
                      className="border-primary/40 data-[state=checked]:bg-primary"
                    />
                    <Label
                      htmlFor="trending"
                      className="flex items-center gap-1.5 text-sm text-muted-foreground cursor-pointer"
                    >
                      <TrendingUp className="size-4 text-primary" />
                      Mark as Trending
                    </Label>
                  </div>
                </div>

                {/* Top Rated */}
                <div className="glass-card p-4 flex flex-col gap-3">
                  <span className="text-sm text-foreground/80 font-medium">
                    Top Rated
                  </span>
                  <div className="flex items-center gap-3">
                    <Checkbox
                      id="toprated"
                      checked={form.isTopRated}
                      onCheckedChange={(v) =>
                        setForm((f) => ({
                          ...f,
                          isTopRated: v === true,
                        }))
                      }
                      data-ocid="admin.toprated_checkbox"
                      className="border-primary/40 data-[state=checked]:bg-primary"
                    />
                    <Label
                      htmlFor="toprated"
                      className="flex items-center gap-1.5 text-sm text-muted-foreground cursor-pointer"
                    >
                      <Star className="size-4 text-primary" />
                      Mark as Top Rated
                    </Label>
                  </div>
                </div>
              </div>

              {/* File uploads: Thumbnail + Video */}
              <div className="grid md:grid-cols-2 gap-6">
                {/* Thumbnail upload */}
                <div className="space-y-2">
                  <Label className="text-sm text-foreground/80 flex items-center gap-1.5">
                    <ImageIcon className="size-4" />
                    Thumbnail Image
                  </Label>
                  <button
                    type="button"
                    onClick={() => thumbnailInputRef.current?.click()}
                    data-ocid="admin.thumbnail_dropzone"
                    className="w-full border-2 border-dashed border-border/60 rounded-xl overflow-hidden hover:border-primary/50 transition-smooth"
                  >
                    {thumbnailPreview ? (
                      <div className="relative">
                        <img
                          src={thumbnailPreview}
                          alt="Thumbnail preview"
                          className="w-full h-40 object-cover"
                        />
                        <div className="absolute inset-0 bg-background/40 flex items-center justify-center opacity-0 hover:opacity-100 transition-smooth">
                          <Upload className="size-6 text-primary" />
                          <span className="text-sm text-foreground ml-2">
                            Change
                          </span>
                        </div>
                        {thumbnailDone && (
                          <div className="absolute top-2 right-2 bg-primary/90 text-primary-foreground rounded-full px-2 py-0.5 text-[11px] font-semibold flex items-center gap-1">
                            <CheckCircle className="size-3" /> Uploaded
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="p-6 text-center">
                        <ImageIcon className="size-8 text-muted-foreground mx-auto mb-2" />
                        <p className="text-sm text-muted-foreground">
                          Click to upload thumbnail
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          JPG, PNG, WebP — up to 5MB
                        </p>
                      </div>
                    )}
                  </button>
                  <input
                    ref={thumbnailInputRef}
                    type="file"
                    accept="image/*"
                    className="sr-only"
                    data-ocid="admin.thumbnail_upload"
                    onChange={(e) => {
                      const f = e.target.files?.[0];
                      if (f) handleThumbnailSelect(f);
                    }}
                  />
                  {thumbnailUploading && (
                    <ProgressBar
                      progress={thumbnailProgress}
                      label="Uploading thumbnail…"
                    />
                  )}
                  {thumbnailFile && !thumbnailUploading && (
                    <p className="text-xs text-muted-foreground truncate">
                      {thumbnailFile.name}
                    </p>
                  )}
                </div>

                {/* Video upload */}
                <div className="space-y-2">
                  <Label className="text-sm text-foreground/80 flex items-center gap-1.5">
                    <Video className="size-4" />
                    Video File
                  </Label>
                  <button
                    type="button"
                    onClick={() => videoInputRef.current?.click()}
                    data-ocid="admin.video_dropzone"
                    className="w-full border-2 border-dashed border-border/60 rounded-xl hover:border-primary/50 transition-smooth p-6 text-center"
                  >
                    {videoFile ? (
                      <div className="flex flex-col items-center gap-2">
                        <Film className="size-8 text-primary" />
                        <p className="text-sm text-primary font-medium truncate max-w-full">
                          {videoFile.name}
                        </p>
                        {videoDone && (
                          <span className="text-xs text-primary font-semibold flex items-center gap-1">
                            <CheckCircle className="size-3" /> Uploaded
                          </span>
                        )}
                      </div>
                    ) : (
                      <>
                        <Film className="size-8 text-muted-foreground mx-auto mb-2" />
                        <p className="text-sm text-muted-foreground">
                          Click to upload video
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          MP4, MOV, WebM — up to 2GB
                        </p>
                      </>
                    )}
                  </button>
                  <input
                    ref={videoInputRef}
                    type="file"
                    accept="video/*"
                    className="sr-only"
                    data-ocid="admin.video_upload"
                    onChange={(e) => {
                      const f = e.target.files?.[0];
                      if (f) handleVideoSelect(f);
                    }}
                  />
                  {videoUploading && (
                    <ProgressBar
                      progress={videoProgress}
                      label="Uploading video…"
                    />
                  )}
                </div>
              </div>

              {/* Submit */}
              <Button
                type="submit"
                disabled={
                  submitting ||
                  !form.title ||
                  !form.category ||
                  thumbnailUploading ||
                  videoUploading
                }
                data-ocid="admin.submit_button"
                className="btn-gold w-full h-11 rounded-xl font-semibold text-sm"
              >
                {submitting ? (
                  <span className="flex items-center gap-2">
                    <span className="size-4 rounded-full border-2 border-primary-foreground/30 border-t-primary-foreground animate-spin" />
                    Adding Movie…
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    <Plus className="size-4" />
                    Add Movie
                  </span>
                )}
              </Button>
            </form>
          </div>
        </motion.section>

        {/* ── Section 2: Manage Movies ─────────────────────────── */}
        <motion.section
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          data-ocid="admin.manage_movies.section"
        >
          <div className="flex items-center gap-3 mb-5">
            <div className="w-1 h-6 bg-gradient-gold rounded-full" />
            <h2 className="text-section-heading">Manage Movies</h2>
            <Badge className="ml-1 bg-secondary text-secondary-foreground border-0">
              {movies.length}
            </Badge>
            <button
              type="button"
              onClick={loadMovies}
              data-ocid="admin.refresh_button"
              disabled={loadingMovies}
              aria-label="Refresh movie list"
              className="ml-auto flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-smooth disabled:opacity-50"
            >
              <RefreshCw
                className={`size-4 ${loadingMovies ? "animate-spin" : ""}`}
              />
              Refresh
            </button>
          </div>

          <div className="glass-card overflow-hidden">
            {loadingMovies ? (
              <div
                className="p-6 space-y-3"
                data-ocid="admin.table_loading_state"
              >
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="flex items-center gap-4">
                    <Skeleton className="w-14 h-20 rounded-lg bg-card/80" />
                    <div className="flex-1 space-y-2">
                      <Skeleton className="h-4 w-48 bg-card/80" />
                      <Skeleton className="h-3 w-24 bg-card/80" />
                    </div>
                    <Skeleton className="h-8 w-20 rounded-lg bg-card/80" />
                  </div>
                ))}
              </div>
            ) : movies.length === 0 ? (
              <div
                className="py-16 text-center text-muted-foreground"
                data-ocid="admin.movies_empty_state"
              >
                <Film className="size-10 mx-auto mb-3 opacity-30" />
                <p className="text-sm">No movies in library yet.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table
                  className="w-full text-sm"
                  data-ocid="admin.movies_table"
                >
                  <thead>
                    <tr className="border-b border-border/40 text-muted-foreground text-left">
                      <th className="px-4 py-3 font-medium text-xs tracking-widest uppercase">
                        Thumbnail
                      </th>
                      <th className="px-4 py-3 font-medium text-xs tracking-widest uppercase">
                        Title
                      </th>
                      <th className="px-4 py-3 font-medium text-xs tracking-widest uppercase hidden md:table-cell">
                        Category
                      </th>
                      <th className="px-4 py-3 font-medium text-xs tracking-widest uppercase hidden lg:table-cell">
                        Badges
                      </th>
                      <th className="px-4 py-3 font-medium text-xs tracking-widest uppercase text-right">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {movies.map((movie, i) => (
                      <tr
                        key={movie.id}
                        data-ocid={`admin.movie.item.${i + 1}`}
                        className="border-b border-border/20 hover:bg-card/30 transition-smooth"
                      >
                        {/* Thumbnail */}
                        <td className="px-4 py-3">
                          <img
                            src={movie.thumbnailUrl}
                            alt={movie.title}
                            className="w-12 h-16 object-cover rounded-lg border border-border/40"
                            onError={(e) => {
                              (e.currentTarget as HTMLImageElement).src =
                                "/assets/generated/movie-1.dim_400x600.jpg";
                            }}
                          />
                        </td>

                        {/* Title + rating */}
                        <td className="px-4 py-3">
                          <p className="font-semibold text-foreground leading-tight truncate max-w-[180px]">
                            {movie.title}
                          </p>
                          <div className="flex items-center gap-1 mt-0.5">
                            <Star className="size-3 text-primary fill-primary" />
                            <span className="text-xs text-muted-foreground">
                              {movie.rating.toFixed(1)}
                            </span>
                            {movie.duration && (
                              <span className="text-xs text-muted-foreground">
                                · {movie.duration}
                              </span>
                            )}
                          </div>
                        </td>

                        {/* Category */}
                        <td className="px-4 py-3 hidden md:table-cell">
                          <Badge
                            variant="outline"
                            className="border-border/60 text-muted-foreground text-xs"
                          >
                            {movie.category}
                          </Badge>
                        </td>

                        {/* Badges */}
                        <td className="px-4 py-3 hidden lg:table-cell">
                          <div className="flex flex-wrap gap-1.5">
                            {movie.isPremium ? (
                              <span className="premium-badge flex items-center gap-1">
                                <Lock className="size-2.5" /> Premium
                              </span>
                            ) : (
                              <Badge
                                variant="secondary"
                                className="text-xs bg-secondary/80"
                              >
                                Free
                              </Badge>
                            )}
                            {movie.isTrending && (
                              <Badge className="text-xs bg-primary/15 text-primary border border-primary/30">
                                <TrendingUp className="size-2.5 mr-1" />
                                Trending
                              </Badge>
                            )}
                            {movie.isTopRated && (
                              <Badge className="text-xs bg-accent/20 text-accent-foreground border border-accent/30">
                                <Star className="size-2.5 mr-1 fill-current" />
                                Top Rated
                              </Badge>
                            )}
                          </div>
                        </td>

                        {/* Actions */}
                        <td className="px-4 py-3 text-right">
                          <button
                            type="button"
                            onClick={() => handleDelete(movie.id)}
                            data-ocid={`admin.delete_button.${i + 1}`}
                            disabled={deletingId === movie.id}
                            aria-label={`Delete ${movie.title}`}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border border-destructive/30 text-destructive hover:bg-destructive/10 hover:border-destructive/60 transition-smooth disabled:opacity-50"
                          >
                            {deletingId === movie.id ? (
                              <span className="size-3 rounded-full border border-destructive/30 border-t-destructive animate-spin" />
                            ) : (
                              <Trash2 className="size-3" />
                            )}
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </motion.section>
      </div>
    </div>
  );
}

// ── Progress bar sub-component ─────────────────────────────────
function ProgressBar({
  progress,
  label,
}: {
  progress: number;
  label: string;
}) {
  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <span>{label}</span>
        <span>{Math.round(progress)}%</span>
      </div>
      <div className="h-1.5 rounded-full bg-card/80 overflow-hidden">
        <motion.div
          className="h-full bg-gradient-gold rounded-full"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ ease: "easeOut" }}
        />
      </div>
    </div>
  );
}
