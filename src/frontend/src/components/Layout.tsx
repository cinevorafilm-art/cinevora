import Navbar from "@/components/Navbar";
import { Outlet } from "@tanstack/react-router";

export default function Layout() {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <Navbar />
      <main className="pt-16 flex-1">
        <Outlet />
      </main>
      <footer className="py-3 text-center border-t border-border/20 bg-background/80">
        <p className="text-[11px] text-muted-foreground/50">
          Powered by{" "}
          <a
            href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(typeof window !== "undefined" ? window.location.hostname : "")}`}
            target="_blank"
            rel="noopener noreferrer"
            className="transition-colors hover:opacity-80"
            style={{ color: "oklch(0.72 0.18 70 / 0.7)" }}
          >
            Caffeine
          </a>
        </p>
      </footer>
    </div>
  );
}
