import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useAuthStore } from "@/store/authStore";
import { useInternetIdentity } from "@caffeineai/core-infrastructure";
import { Link, useNavigate } from "@tanstack/react-router";
import {
  Chrome,
  Eye,
  EyeOff,
  Facebook,
  Lock,
  Mail,
  Shield,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [comingSoonTarget, setComingSoonTarget] = useState<string | null>(null);
  const { login, identity, loginStatus } = useInternetIdentity();
  const setAuthenticated = useAuthStore((s) => s.setAuthenticated);
  const navigate = useNavigate();
  const isLoggingIn = loginStatus === "logging-in";

  // Redirect after II login success
  useEffect(() => {
    if (identity) {
      setAuthenticated(true);
      navigate({ to: "/" });
    }
  }, [identity, navigate, setAuthenticated]);

  function handleEmailSubmit(e: React.FormEvent) {
    e.preventDefault();
    toast.info("Use Internet Identity to sign in securely", {
      description:
        "Email/password login is handled via Internet Identity for maximum security.",
      duration: 5000,
    });
  }

  function handleComingSoon(label: string) {
    setComingSoonTarget(label);
    toast("Coming Soon", {
      description: `${label} login will be available in a future update.`,
      duration: 3000,
    });
    setTimeout(() => setComingSoonTarget(null), 2000);
  }

  return (
    <div
      data-ocid="login.page"
      className="min-h-screen flex items-center justify-center px-4 relative overflow-hidden"
      style={{ background: "oklch(0.06 0.01 50)" }}
    >
      {/* Ambient gold corner glows */}
      <div
        className="pointer-events-none absolute -top-40 -left-40 w-96 h-96 rounded-full opacity-20"
        style={{
          background:
            "radial-gradient(circle, oklch(0.72 0.18 70 / 0.4) 0%, transparent 70%)",
        }}
      />
      <div
        className="pointer-events-none absolute -bottom-40 -right-40 w-96 h-96 rounded-full opacity-15"
        style={{
          background:
            "radial-gradient(circle, oklch(0.72 0.18 70 / 0.3) 0%, transparent 70%)",
        }}
      />

      <motion.div
        initial={{ opacity: 0, y: 32 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
        className="relative w-full max-w-md z-10"
      >
        <div className="glass-card p-8 md:p-10">
          {/* Logo */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1, duration: 0.4 }}
            className="flex justify-center mb-8"
          >
            <Link to="/" aria-label="Cinevora home">
              <img
                src="/assets/cinevora-logo.png"
                alt="Cinevora"
                className="h-12 w-auto object-contain"
              />
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="text-center mb-7"
          >
            <h1 className="text-2xl font-display font-bold text-gold mb-1">
              Welcome back
            </h1>
            <p className="text-sm text-muted-foreground">
              Sign in to continue watching
            </p>
          </motion.div>

          {/* Primary II login */}
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Button
              type="button"
              onClick={login}
              disabled={isLoggingIn}
              data-ocid="login.ii_button"
              className="btn-gold w-full h-11 rounded-xl font-semibold text-sm gap-2"
            >
              {isLoggingIn ? (
                <>
                  <motion.span
                    animate={{ rotate: 360 }}
                    transition={{
                      repeat: Number.POSITIVE_INFINITY,
                      duration: 1,
                      ease: "linear",
                    }}
                    className="inline-block"
                  >
                    ⟳
                  </motion.span>
                  Connecting…
                </>
              ) : (
                <>
                  <Shield className="size-4" />
                  Continue with Internet Identity
                </>
              )}
            </Button>
          </motion.div>

          <div className="flex items-center gap-3 my-5">
            <Separator className="flex-1" style={{ opacity: 0.3 }} />
            <span className="text-xs text-muted-foreground px-1">
              or sign in with email
            </span>
            <Separator className="flex-1" style={{ opacity: 0.3 }} />
          </div>

          {/* Email/password form — UI only */}
          <motion.form
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.25 }}
            onSubmit={handleEmailSubmit}
            className="space-y-4"
          >
            <div>
              <Label
                htmlFor="email"
                className="text-sm text-foreground/80 mb-1.5 block"
              >
                Email
              </Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground pointer-events-none" />
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  data-ocid="login.email_input"
                  className="pl-9 bg-card/60 border-border/60 focus:border-primary/60 h-10 rounded-lg"
                  autoComplete="email"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <Label
                  htmlFor="password"
                  className="text-sm text-foreground/80"
                >
                  Password
                </Label>
                <Link
                  to="/auth/forgot-password"
                  data-ocid="login.forgot_password_link"
                  className="text-xs text-primary hover:text-primary/80 transition-smooth"
                >
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground pointer-events-none" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  data-ocid="login.password_input"
                  className="pl-9 pr-10 bg-card/60 border-border/60 focus:border-primary/60 h-10 rounded-lg"
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  aria-label="Toggle password visibility"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-primary transition-smooth"
                >
                  {showPassword ? (
                    <EyeOff className="size-4" />
                  ) : (
                    <Eye className="size-4" />
                  )}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              data-ocid="login.submit_button"
              className="w-full h-10 btn-gold-outline rounded-xl font-semibold text-sm mt-1"
            >
              Sign In
            </Button>
          </motion.form>

          {/* Social stubs */}
          <div className="mt-4 grid grid-cols-2 gap-3">
            <div className="relative">
              <button
                type="button"
                data-ocid="login.google_button"
                onClick={() => handleComingSoon("Google")}
                className="relative w-full flex items-center justify-center gap-2 h-10 rounded-xl border border-border/50 text-sm text-foreground/60 hover:border-primary/40 hover:text-primary/80 transition-smooth"
              >
                <Chrome className="size-4" />
                Google
              </button>
              <AnimatePresence>
                {comingSoonTarget === "Google" && (
                  <motion.span
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: -28 }}
                    exit={{ opacity: 0 }}
                    className="absolute left-1/2 -translate-x-1/2 text-xs bg-card border border-primary/30 text-primary px-2 py-0.5 rounded-md pointer-events-none whitespace-nowrap z-20"
                  >
                    Coming Soon
                  </motion.span>
                )}
              </AnimatePresence>
            </div>

            <div className="relative">
              <button
                type="button"
                data-ocid="login.facebook_button"
                onClick={() => handleComingSoon("Facebook")}
                className="relative w-full flex items-center justify-center gap-2 h-10 rounded-xl border border-border/50 text-sm text-foreground/60 hover:border-primary/40 hover:text-primary/80 transition-smooth"
              >
                <Facebook className="size-4" />
                Facebook
              </button>
              <AnimatePresence>
                {comingSoonTarget === "Facebook" && (
                  <motion.span
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: -28 }}
                    exit={{ opacity: 0 }}
                    className="absolute left-1/2 -translate-x-1/2 text-xs bg-card border border-primary/30 text-primary px-2 py-0.5 rounded-md pointer-events-none whitespace-nowrap z-20"
                  >
                    Coming Soon
                  </motion.span>
                )}
              </AnimatePresence>
            </div>
          </div>

          <p className="text-center text-sm text-muted-foreground mt-6">
            New to Cinevora?{" "}
            <Link
              to="/auth/signup"
              data-ocid="login.signup_link"
              className="text-primary hover:text-primary/80 transition-smooth font-semibold"
            >
              Create account
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
