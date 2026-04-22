import { useAuthStore } from "@/store/authStore";
import { useInternetIdentity } from "@caffeineai/core-infrastructure";
import { Link, useRouterState } from "@tanstack/react-router";
import { ListVideo, LogOut, Menu, Search, User, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef, useState } from "react";

const navLinks = [
  { label: "Home", to: "/" },
  { label: "Movies", to: "/movies" },
  { label: "TV Shows", to: "/tv-shows" },
  { label: "Categories", to: "/categories" },
  { label: "My List", to: "/my-list" },
];

export default function Navbar() {
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const searchRef = useRef<HTMLInputElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);
  const { login, clear, identity } = useInternetIdentity();
  const { userProfile, logout } = useAuthStore();
  const router = useRouterState();
  const pathname = router.location.pathname;

  const isAuthenticated = !!identity;

  useEffect(() => {
    if (searchOpen && searchRef.current) {
      searchRef.current.focus();
    }
  }, [searchOpen]);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (
        profileRef.current &&
        !profileRef.current.contains(e.target as Node)
      ) {
        setProfileOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    if (searchValue.trim()) {
      window.location.href = `/search?q=${encodeURIComponent(searchValue.trim())}`;
      setSearchOpen(false);
    }
  }

  function handleLogout() {
    clear();
    logout();
    setProfileOpen(false);
  }

  return (
    <header className="fixed top-0 left-0 right-0 z-50 h-16 border-b border-primary/10 bg-[oklch(0.08_0.015_50/0.92)] backdrop-blur-xl">
      <div className="mx-auto flex h-full max-w-screen-2xl items-center justify-between px-4 md:px-8">
        {/* Logo */}
        <Link to="/" className="flex shrink-0 items-center">
          <img
            src="/assets/cinevora-logo.png"
            alt="Cinevora"
            className="h-10 w-auto object-contain"
          />
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden items-center gap-1 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              data-ocid={`nav.${link.label.toLowerCase().replace(" ", "_")}.link`}
              className={[
                "px-3 py-1.5 text-sm font-medium rounded-md transition-smooth",
                pathname === link.to
                  ? "text-primary glow-gold"
                  : "text-foreground/70 hover:text-primary hover:glow-gold",
              ].join(" ")}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Right actions */}
        <div className="flex items-center gap-2">
          {/* Search */}
          <AnimatePresence mode="wait">
            {searchOpen ? (
              <motion.form
                key="search-open"
                initial={{ width: 0, opacity: 0 }}
                animate={{ width: 220, opacity: 1 }}
                exit={{ width: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
                onSubmit={handleSearch}
                className="flex items-center overflow-hidden rounded-full border border-primary/30 bg-card/60"
              >
                <input
                  ref={searchRef}
                  type="text"
                  value={searchValue}
                  onChange={(e) => setSearchValue(e.target.value)}
                  placeholder="Search movies..."
                  data-ocid="navbar.search_input"
                  className="h-8 flex-1 bg-transparent px-3 text-sm text-foreground placeholder:text-muted-foreground outline-none min-w-0"
                />
                <button
                  type="button"
                  onClick={() => setSearchOpen(false)}
                  aria-label="Close search"
                  className="mr-1 rounded-full p-1 text-muted-foreground hover:text-primary transition-smooth"
                >
                  <X className="size-4" />
                </button>
              </motion.form>
            ) : (
              <motion.button
                key="search-closed"
                type="button"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setSearchOpen(true)}
                data-ocid="navbar.search_button"
                aria-label="Open search"
                className="flex h-8 w-8 items-center justify-center rounded-full text-foreground/70 hover:text-primary hover:glow-gold transition-smooth"
              >
                <Search className="size-5" />
              </motion.button>
            )}
          </AnimatePresence>

          {/* Profile dropdown */}
          <div ref={profileRef} className="relative">
            <button
              type="button"
              onClick={() => setProfileOpen((v) => !v)}
              data-ocid="navbar.profile_button"
              aria-label="Profile menu"
              className="flex h-8 w-8 items-center justify-center rounded-full border border-primary/30 bg-card/60 text-foreground/70 hover:text-primary hover:border-primary/60 hover:glow-gold transition-smooth"
            >
              <User className="size-4" />
            </button>

            <AnimatePresence>
              {profileOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -8, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -8, scale: 0.95 }}
                  transition={{ duration: 0.15 }}
                  data-ocid="navbar.profile_dropdown"
                  className="absolute right-0 top-10 w-48 rounded-xl border border-primary/20 bg-[oklch(0.13_0.02_50/0.95)] backdrop-blur-xl shadow-glow overflow-hidden"
                >
                  {isAuthenticated ? (
                    <>
                      {userProfile && (
                        <div className="px-4 py-2 border-b border-border/50">
                          <p className="text-xs font-semibold text-foreground truncate">
                            {userProfile.name}
                          </p>
                          <p className="text-[11px] text-muted-foreground truncate">
                            {userProfile.email}
                          </p>
                        </div>
                      )}
                      <Link
                        to="/profile"
                        onClick={() => setProfileOpen(false)}
                        data-ocid="navbar.profile_link"
                        className="flex items-center gap-2 px-4 py-2.5 text-sm text-foreground/80 hover:text-primary hover:bg-primary/10 transition-smooth"
                      >
                        <User className="size-4" />
                        Profile
                      </Link>
                      <Link
                        to="/my-list"
                        onClick={() => setProfileOpen(false)}
                        data-ocid="navbar.mylist_link"
                        className="flex items-center gap-2 px-4 py-2.5 text-sm text-foreground/80 hover:text-primary hover:bg-primary/10 transition-smooth"
                      >
                        <ListVideo className="size-4" />
                        My List
                      </Link>
                      <button
                        type="button"
                        onClick={handleLogout}
                        data-ocid="navbar.logout_button"
                        className="flex w-full items-center gap-2 border-t border-border/50 px-4 py-2.5 text-sm text-foreground/80 hover:text-destructive hover:bg-destructive/10 transition-smooth"
                      >
                        <LogOut className="size-4" />
                        Logout
                      </button>
                    </>
                  ) : (
                    <button
                      type="button"
                      onClick={() => {
                        login();
                        setProfileOpen(false);
                      }}
                      data-ocid="navbar.login_button"
                      className="flex w-full items-center gap-2 px-4 py-2.5 text-sm text-primary hover:bg-primary/10 transition-smooth"
                    >
                      <User className="size-4" />
                      Sign In
                    </button>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Hamburger - mobile only */}
          <button
            type="button"
            onClick={() => setMenuOpen((v) => !v)}
            data-ocid="navbar.hamburger_button"
            aria-label="Open menu"
            className="flex h-8 w-8 items-center justify-center rounded-full text-foreground/70 hover:text-primary transition-smooth md:hidden"
          >
            <Menu className="size-5" />
          </button>
        </div>
      </div>

      {/* Mobile menu drawer */}
      <AnimatePresence>
        {menuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 top-16 z-40 bg-black/60 backdrop-blur-sm md:hidden"
              onClick={() => setMenuOpen(false)}
            />
            <motion.nav
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              data-ocid="navbar.mobile_menu"
              className="fixed right-0 top-16 bottom-0 z-50 w-64 border-l border-primary/20 bg-[oklch(0.1_0.02_50/0.98)] backdrop-blur-xl p-6 md:hidden"
            >
              <div className="flex flex-col gap-1">
                {navLinks.map((link) => (
                  <Link
                    key={link.to}
                    to={link.to}
                    onClick={() => setMenuOpen(false)}
                    data-ocid={`nav.mobile.${link.label.toLowerCase().replace(" ", "_")}.link`}
                    className={[
                      "px-3 py-3 rounded-lg text-base font-medium transition-smooth",
                      pathname === link.to
                        ? "text-primary bg-primary/10"
                        : "text-foreground/70 hover:text-primary hover:bg-primary/10",
                    ].join(" ")}
                  >
                    {link.label}
                  </Link>
                ))}
                <div className="mt-4 border-t border-border/50 pt-4">
                  {isAuthenticated ? (
                    <button
                      type="button"
                      onClick={handleLogout}
                      data-ocid="navbar.mobile_logout_button"
                      className="flex w-full items-center gap-2 px-3 py-3 rounded-lg text-base font-medium text-foreground/70 hover:text-destructive hover:bg-destructive/10 transition-smooth"
                    >
                      <LogOut className="size-4" />
                      Logout
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => {
                        login();
                        setMenuOpen(false);
                      }}
                      data-ocid="navbar.mobile_login_button"
                      className="flex w-full items-center gap-2 px-3 py-3 rounded-lg text-base font-medium text-primary hover:bg-primary/10 transition-smooth"
                    >
                      <User className="size-4" />
                      Sign In
                    </button>
                  )}
                </div>
              </div>
            </motion.nav>
          </>
        )}
      </AnimatePresence>
    </header>
  );
}
