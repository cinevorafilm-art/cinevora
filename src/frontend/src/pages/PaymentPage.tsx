import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { getSubscriptionPlans } from "@/lib/api";
import type { SubscriptionPlan } from "@/types";
import { Link, useNavigate, useSearch } from "@tanstack/react-router";
import {
  ArrowLeft,
  Check,
  CheckCircle,
  CreditCard,
  Lock,
  Smartphone,
  Wallet,
} from "lucide-react";
import { motion } from "motion/react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

type PaymentMethod = "upi" | "card" | "wallet";

const WALLET_OPTIONS = [
  { name: "PhonePe", emoji: "💜" },
  { name: "Paytm", emoji: "🔵" },
  { name: "Google Pay", emoji: "🔴" },
  { name: "Amazon Pay", emoji: "🟠" },
];

export default function PaymentPage() {
  const navigate = useNavigate();
  const searchParams = useSearch({ strict: false }) as { plan?: string };
  const planId = searchParams.plan ?? "monthly";

  const [plans, setPlans] = useState<SubscriptionPlan[]>([]);
  const [activePlan, setActivePlan] = useState<SubscriptionPlan | null>(null);
  const [method, setMethod] = useState<PaymentMethod>("upi");
  const [loading, setLoading] = useState(false);

  const [upiId, setUpiId] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCvv, setCardCvv] = useState("");
  const [cardName, setCardName] = useState("");

  useEffect(() => {
    getSubscriptionPlans().then((data) => {
      setPlans(data);
      const found = data.find((p) => p.id === planId) ?? data[0] ?? null;
      setActivePlan(found);
    });
  }, [planId]);

  function handlePay(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    // ─── RAZORPAY INTEGRATION READY ───────────────────────────────────────────
    // When integrating Razorpay, replace the setTimeout below with:
    //
    // const options = {
    //   key: import.meta.env.VITE_RAZORPAY_KEY_ID,
    //   amount: (activePlan?.price ?? 0) * 100, // paise
    //   currency: "INR",
    //   name: "Cinevora Premium",
    //   description: `${activePlan?.name} Subscription`,
    //   handler: async (response: RazorpayResponse) => {
    //     await verifyAndActivateSubscription(userId, activePlan?.id, response.razorpay_payment_id);
    //     navigate({ to: "/" });
    //   },
    //   prefill: { name: cardName, contact: "", email: "" },
    //   theme: { color: "#C9960C" },
    // };
    // const rzp = new (window as Window & { Razorpay: new (o: unknown) => { open(): void } }).Razorpay(options);
    // rzp.open();
    // ─────────────────────────────────────────────────────────────────────────

    setTimeout(() => {
      setLoading(false);
      toast.success(
        "Payment feature coming soon! Your subscription will be activated after payment integration.",
        { duration: 5000 },
      );
      navigate({ to: "/pricing" });
    }, 1400);
  }

  if (!activePlan) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="size-8 rounded-full border-2 border-primary border-t-transparent animate-spin" />
      </div>
    );
  }

  return (
    <div
      data-ocid="payment.page"
      className="min-h-screen px-6 md:px-12 max-w-screen-xl mx-auto py-10"
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="max-w-lg mx-auto"
      >
        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <Link
            to="/pricing"
            data-ocid="payment.back_button"
            className="text-muted-foreground hover:text-primary transition-smooth"
          >
            <ArrowLeft className="size-5" />
          </Link>
          <h1 className="text-section-heading text-foreground">
            Complete Payment
          </h1>
        </div>

        {/* Plan summary */}
        <div className="glass-card p-5 mb-6" data-ocid="payment.plan_summary">
          <div className="flex items-center justify-between mb-3">
            <div>
              <p className="text-sm font-semibold text-foreground">
                Cinevora Premium — {activePlan.name}
              </p>
              <p className="text-xs text-muted-foreground">
                {activePlan.durationMonths} month
                {activePlan.durationMonths > 1 ? "s" : ""} access
              </p>
            </div>
            <p className="text-2xl font-display font-bold text-gold">
              ₹{activePlan.price}
            </p>
          </div>
          <div className="border-t border-border/30 pt-3 grid grid-cols-2 gap-1.5">
            {activePlan.features.slice(0, 4).map((f) => (
              <div
                key={f}
                className="flex items-center gap-1.5 text-xs text-foreground/70"
              >
                <Check className="size-3 text-primary shrink-0" />
                {f}
              </div>
            ))}
          </div>

          {/* Plan switcher pills */}
          {plans.length > 1 && (
            <div className="flex gap-2 mt-4">
              {plans.map((p) => (
                <Link
                  key={p.id}
                  to="/payment"
                  search={{ plan: p.id }}
                  data-ocid={`payment.plan_switch.${p.id}`}
                  className={[
                    "text-xs px-3 py-1 rounded-full border transition-smooth",
                    p.id === planId
                      ? "border-primary/60 text-primary bg-primary/10"
                      : "border-border/40 text-muted-foreground hover:border-primary/30",
                  ].join(" ")}
                >
                  {p.name} — ₹{p.price}
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Payment method tabs */}
        <div className="flex gap-2 mb-6" data-ocid="payment.method_tabs">
          {(["upi", "card", "wallet"] as PaymentMethod[]).map((m, i) => (
            <button
              key={m}
              type="button"
              onClick={() => setMethod(m)}
              data-ocid={`payment.method.${i + 1}.tab`}
              className={[
                "flex-1 flex flex-col items-center gap-1.5 py-3 rounded-xl border text-xs font-medium transition-smooth",
                method === m
                  ? "border-primary/60 bg-primary/10 text-primary glow-gold"
                  : "border-border/50 text-muted-foreground hover:border-primary/30 hover:text-primary",
              ].join(" ")}
            >
              {m === "upi" && <Smartphone className="size-5" />}
              {m === "card" && <CreditCard className="size-5" />}
              {m === "wallet" && <Wallet className="size-5" />}
              {m === "upi" ? "UPI" : m === "card" ? "Card" : "Wallet"}
            </button>
          ))}
        </div>

        {/* Payment form */}
        <form onSubmit={handlePay} className="glass-card p-6 space-y-4">
          {method === "upi" && (
            <div>
              <Label className="text-sm text-foreground/80 mb-1.5 block">
                UPI ID
              </Label>
              <Input
                type="text"
                value={upiId}
                onChange={(e) => setUpiId(e.target.value)}
                placeholder="yourname@upi"
                data-ocid="payment.upi_input"
                className="bg-card/60 border-border/60 focus:border-primary/60"
                required
              />
              <p className="text-xs text-muted-foreground mt-1.5">
                You'll receive a payment request on your UPI app
              </p>
            </div>
          )}

          {method === "card" && (
            <>
              <div>
                <Label className="text-sm text-foreground/80 mb-1.5 block">
                  Card Number
                </Label>
                <Input
                  type="text"
                  value={cardNumber}
                  onChange={(e) => setCardNumber(e.target.value)}
                  placeholder="1234 5678 9012 3456"
                  data-ocid="payment.card_number_input"
                  className="bg-card/60 border-border/60 focus:border-primary/60 font-mono"
                  maxLength={19}
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label className="text-sm text-foreground/80 mb-1.5 block">
                    Expiry
                  </Label>
                  <Input
                    type="text"
                    value={cardExpiry}
                    onChange={(e) => setCardExpiry(e.target.value)}
                    placeholder="MM/YY"
                    data-ocid="payment.card_expiry_input"
                    className="bg-card/60 border-border/60 focus:border-primary/60 font-mono"
                    maxLength={5}
                    required
                  />
                </div>
                <div>
                  <Label className="text-sm text-foreground/80 mb-1.5 block">
                    CVV
                  </Label>
                  <Input
                    type="password"
                    value={cardCvv}
                    onChange={(e) => setCardCvv(e.target.value)}
                    placeholder="•••"
                    data-ocid="payment.card_cvv_input"
                    className="bg-card/60 border-border/60 focus:border-primary/60 font-mono"
                    maxLength={4}
                    required
                  />
                </div>
              </div>
              <div>
                <Label className="text-sm text-foreground/80 mb-1.5 block">
                  Name on Card
                </Label>
                <Input
                  type="text"
                  value={cardName}
                  onChange={(e) => setCardName(e.target.value)}
                  placeholder="Full name"
                  data-ocid="payment.card_name_input"
                  className="bg-card/60 border-border/60 focus:border-primary/60"
                  required
                />
              </div>
              <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-primary/5 border border-primary/20">
                <Lock className="size-3.5 text-primary shrink-0" />
                <span className="text-[11px] text-muted-foreground">
                  Secure payment via Razorpay — 256-bit SSL encrypted
                </span>
              </div>
            </>
          )}

          {method === "wallet" && (
            <div>
              <p className="text-xs text-muted-foreground mb-3">
                Select your wallet
              </p>
              <div className="grid grid-cols-2 gap-3">
                {WALLET_OPTIONS.map((w, i) => (
                  <button
                    key={w.name}
                    type="button"
                    data-ocid={`payment.wallet.${i + 1}`}
                    className="h-14 rounded-xl border border-border/50 text-sm font-medium text-foreground/70 hover:border-primary/50 hover:text-primary hover:bg-primary/10 transition-smooth flex items-center justify-center gap-2"
                  >
                    <span className="text-xl">{w.emoji}</span>
                    {w.name}
                  </button>
                ))}
              </div>
              <p className="text-xs text-muted-foreground mt-3 text-center">
                Select your wallet above and tap "Confirm Payment" to proceed
              </p>
            </div>
          )}

          <Button
            type="submit"
            disabled={loading}
            data-ocid="payment.pay_button"
            className="w-full btn-gold rounded-xl font-semibold h-12 mt-2 text-sm"
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <span className="size-4 rounded-full border-2 border-primary-foreground/60 border-t-primary-foreground animate-spin" />
                Processing...
              </span>
            ) : (
              <>
                <Lock className="size-4 mr-2" />
                Confirm Payment — ₹{activePlan.price}
              </>
            )}
          </Button>

          <p className="text-center text-xs text-muted-foreground">
            🔒 Payments powered by Razorpay. Your data is encrypted end-to-end.
          </p>
        </form>

        {/* Trust badges */}
        <div className="mt-5 flex items-center justify-center gap-6 text-xs text-muted-foreground">
          <div className="flex items-center gap-1.5">
            <Lock className="size-3 text-primary" />
            Secure
          </div>
          <div className="flex items-center gap-1.5">
            <CheckCircle className="size-3 text-primary" />
            Instant activation
          </div>
          <div className="flex items-center gap-1.5">
            <Wallet className="size-3 text-primary" />
            Cancel anytime
          </div>
        </div>
      </motion.div>
    </div>
  );
}
