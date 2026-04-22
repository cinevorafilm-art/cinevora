import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Link } from "@tanstack/react-router";
import { ArrowLeft, ExternalLink, Info, Mail, ShieldCheck } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitted(true);
  }

  return (
    <div
      data-ocid="forgot_password.page"
      className="min-h-screen flex items-center justify-center px-4 relative overflow-hidden"
      style={{ background: "oklch(0.06 0.01 50)" }}
    >
      {/* Ambient glow */}
      <div
        className="pointer-events-none absolute -top-40 -left-40 w-96 h-96 rounded-full opacity-15"
        style={{
          background:
            "radial-gradient(circle, oklch(0.72 0.18 70 / 0.35) 0%, transparent 70%)",
        }}
      />
      <div
        className="pointer-events-none absolute -bottom-40 -right-40 w-80 h-80 rounded-full opacity-10"
        style={{
          background:
            "radial-gradient(circle, oklch(0.72 0.18 70 / 0.25) 0%, transparent 70%)",
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

          {submitted ? (
            <motion.div
              key="submitted"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.35 }}
              className="text-center"
              data-ocid="forgot_password.success_state"
            >
              <div className="flex justify-center mb-4">
                <div className="size-16 rounded-full flex items-center justify-center bg-primary/10 border border-primary/20">
                  <ShieldCheck className="size-8 text-primary" />
                </div>
              </div>
              <h2 className="text-xl font-display font-bold text-foreground mb-2">
                Check your email
              </h2>
              <p className="text-sm text-muted-foreground mb-6">
                If <span className="text-foreground font-medium">{email}</span>{" "}
                is registered, a reset link is on its way.
              </p>

              {/* II portal notice */}
              <div className="rounded-xl border border-primary/20 bg-primary/5 p-4 mb-6 text-left">
                <div className="flex gap-3">
                  <Info className="size-4 text-primary mt-0.5 shrink-0" />
                  <div>
                    <p className="text-xs font-semibold text-primary mb-1">
                      Using Internet Identity?
                    </p>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      Password management is handled directly through the
                      Internet Identity portal. Visit the portal to update your
                      passkey or recovery phrase.
                    </p>
                    <a
                      href="https://identity.ic0.app"
                      target="_blank"
                      rel="noopener noreferrer"
                      data-ocid="forgot_password.ii_portal_link"
                      className="inline-flex items-center gap-1 mt-2 text-xs text-primary hover:text-primary/80 font-medium transition-smooth"
                    >
                      Open II Portal
                      <ExternalLink className="size-3" />
                    </a>
                  </div>
                </div>
              </div>

              <Button
                asChild
                className="btn-gold w-full rounded-xl font-semibold h-10"
              >
                <Link
                  to="/auth/login"
                  data-ocid="forgot_password.back_to_login_button"
                >
                  Back to Sign In
                </Link>
              </Button>
            </motion.div>
          ) : (
            <motion.div
              key="form"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.15 }}
            >
              <div className="text-center mb-7">
                <h1 className="text-2xl font-display font-bold text-foreground mb-1">
                  Reset password
                </h1>
                <p className="text-sm text-muted-foreground">
                  Enter your email and we'll send you a reset link
                </p>
              </div>

              {/* II notice banner */}
              <div className="rounded-xl border border-primary/20 bg-primary/5 p-4 mb-6">
                <div className="flex gap-3">
                  <Info className="size-4 text-primary mt-0.5 shrink-0" />
                  <div>
                    <p className="text-xs font-semibold text-primary mb-0.5">
                      Internet Identity users
                    </p>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      Password reset is managed via the{" "}
                      <a
                        href="https://identity.ic0.app"
                        target="_blank"
                        rel="noopener noreferrer"
                        data-ocid="forgot_password.ii_portal_inline_link"
                        className="text-primary hover:underline font-medium"
                      >
                        Internet Identity portal
                      </a>
                      . Visit it to manage your identity and recovery options.
                    </p>
                  </div>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label
                    htmlFor="email"
                    className="text-sm text-foreground/80 mb-1.5 block"
                  >
                    Email Address
                  </Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground pointer-events-none" />
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@example.com"
                      data-ocid="forgot_password.email_input"
                      className="pl-9 bg-card/60 border-border/60 focus:border-primary/60 h-10 rounded-lg"
                      required
                      autoComplete="email"
                    />
                  </div>
                </div>

                <Button
                  type="submit"
                  data-ocid="forgot_password.submit_button"
                  className="w-full h-10 btn-gold rounded-xl font-semibold text-sm"
                >
                  Send Reset Link
                </Button>
              </form>

              <Link
                to="/auth/login"
                data-ocid="forgot_password.back_link"
                className="flex items-center justify-center gap-2 mt-6 text-sm text-muted-foreground hover:text-primary transition-smooth"
              >
                <ArrowLeft className="size-4" />
                Back to Sign In
              </Link>
            </motion.div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
