import { Button } from "@/components/ui/button";
import { getSubscriptionPlans } from "@/lib/api";
import type { SubscriptionPlan } from "@/types";
import { Link } from "@tanstack/react-router";
import { Check, Crown, Shield, Star, Tv, Wifi, Zap } from "lucide-react";
import { motion } from "motion/react";
import { useEffect, useState } from "react";

const FEATURE_COMPARISON = [
  { label: "HD & 4K Streaming", icon: <Tv className="size-5 text-primary" /> },
  {
    label: "No Advertisements",
    icon: <Shield className="size-5 text-primary" />,
  },
  {
    label: "Access All Premium Films",
    icon: <Crown className="size-5 text-primary" />,
  },
  {
    label: "Watch on Any Device",
    icon: <Wifi className="size-5 text-primary" />,
  },
  {
    label: "Download for Offline",
    icon: <Zap className="size-5 text-primary" />,
  },
];

export default function PricingPage() {
  const [plans, setPlans] = useState<SubscriptionPlan[]>([]);
  const [selected, setSelected] = useState("quarterly");

  useEffect(() => {
    getSubscriptionPlans().then(setPlans);
  }, []);

  return (
    <div
      data-ocid="pricing.page"
      className="min-h-screen px-6 md:px-12 max-w-screen-2xl mx-auto py-16"
    >
      {/* Hero Header */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center mb-16"
      >
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-primary/30 bg-primary/10 mb-6">
          <Crown className="size-4 text-primary" />
          <span className="text-label text-primary">Cinevora Premium</span>
        </div>
        <h1 className="text-5xl md:text-6xl font-display font-bold mb-5">
          <span className="text-foreground">Unlock Premium </span>
          <span
            className="bg-clip-text text-transparent"
            style={{
              background: "var(--gradient-gold)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            Entertainment
          </span>
        </h1>
        <p className="text-base text-muted-foreground max-w-xl mx-auto leading-relaxed">
          Crystal-clear HD & 4K streaming, zero ads, early access to new
          releases, and an ever-growing library of premium cinema — all in one
          plan.
        </p>
      </motion.div>

      {/* Plan Cards */}
      <div className="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto mb-16">
        {plans.map((plan, i) => {
          const isPopular = plan.id === "quarterly";
          const isSelected = selected === plan.id;

          return (
            <motion.div
              key={plan.id}
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.15, duration: 0.5 }}
              onClick={() => setSelected(plan.id)}
              data-ocid={`pricing.plan.${i + 1}`}
              className={[
                "relative glass-card p-7 cursor-pointer transition-smooth",
                isSelected
                  ? "border-primary/70 glow-gold-lg scale-[1.02]"
                  : "hover:border-primary/40 hover:glow-gold",
              ].join(" ")}
            >
              {/* Popular badge */}
              {isPopular && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 z-10">
                  <span className="inline-flex items-center gap-1 premium-badge px-4 py-1 text-xs font-bold shadow-glow">
                    <Star className="size-3 fill-current" />
                    MOST POPULAR
                  </span>
                </div>
              )}

              {/* Selected ring decoration */}
              {isSelected && (
                <div className="absolute inset-0 rounded-xl pointer-events-none border-2 border-primary/50" />
              )}

              {/* Plan header */}
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-display font-bold text-foreground mb-1">
                    {plan.name}
                  </h2>
                  <p className="text-xs text-muted-foreground">
                    {plan.durationMonths} month
                    {plan.durationMonths > 1 ? "s" : ""} access
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-4xl font-display font-bold text-gold leading-none">
                    ₹{plan.price}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {plan.durationMonths > 1
                      ? `₹${Math.round(plan.price / plan.durationMonths)}/mo`
                      : "per month"}
                  </p>
                  {isPopular && (
                    <span className="inline-block mt-1 text-[10px] font-semibold text-primary bg-primary/10 border border-primary/30 rounded-full px-2 py-0.5">
                      Save 25%
                    </span>
                  )}
                </div>
              </div>

              {/* Features */}
              <ul className="space-y-3 mb-7">
                {plan.features.map((feat) => (
                  <li key={feat} className="flex items-start gap-3 text-sm">
                    <span className="mt-0.5 shrink-0 size-4 rounded-full bg-primary/20 border border-primary/40 flex items-center justify-center">
                      <Check className="size-2.5 text-primary stroke-[2.5]" />
                    </span>
                    <span className="text-foreground/85 leading-snug">
                      {feat}
                    </span>
                  </li>
                ))}
              </ul>

              <Button
                asChild
                type="button"
                data-ocid={`pricing.plan_cta.${i + 1}`}
                className={`w-full rounded-xl font-semibold text-sm h-11 ${
                  isSelected ? "btn-gold" : "btn-gold-outline"
                }`}
              >
                <Link to="/payment" search={{ plan: plan.id }}>
                  <Zap className="size-4 mr-2" />
                  Choose {plan.name}
                </Link>
              </Button>
            </motion.div>
          );
        })}
      </div>

      {/* Feature Highlights */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="max-w-3xl mx-auto"
      >
        <div className="section-divider pt-10 mb-8 text-center">
          <p className="text-sm font-semibold text-foreground/70 uppercase tracking-widest mb-6">
            All plans include
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
            {FEATURE_COMPARISON.map((f, i) => (
              <motion.div
                key={f.label}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="glass-card p-4 text-center"
                data-ocid={`pricing.feature.${i + 1}`}
              >
                <div className="flex justify-center mb-2">{f.icon}</div>
                <p className="text-xs font-medium text-foreground/80 leading-snug">
                  {f.label}
                </p>
              </motion.div>
            ))}
          </div>
        </div>

        <p className="text-center text-xs text-muted-foreground mt-6">
          ✦ Cancel anytime. No questions asked. Your subscription is fully
          refundable within 7 days.
        </p>
      </motion.div>
    </div>
  );
}
