"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter, usePathname } from "next/navigation";
import { useTheme } from "next-themes";
import { Sun, Moon, Search, X, Compass, Calendar, Home, Bell, User } from "lucide-react";
import { cn } from "@/lib/utils";

const NAV_LINKS = [
  { href: "/", label: "Beranda", icon: Home },
  { href: "/search", label: "Temukan", icon: Compass },
  { href: "/schedule", label: "Jadwal", icon: Calendar },
];

export function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setMounted(true);
    const onScroll = () => setScrolled(window.scrollY > 12);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => { setIsSearchOpen(false); setSearchQuery(""); }, [pathname]);

  const handleGlobalKey = useCallback((e: KeyboardEvent) => {
    if (e.key === "/" && document.activeElement?.tagName !== "INPUT" && document.activeElement?.tagName !== "TEXTAREA") {
      e.preventDefault();
      setIsSearchOpen(true);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
    if (e.key === "Escape") { setIsSearchOpen(false); setSearchQuery(""); }
  }, []);

  useEffect(() => {
    document.addEventListener("keydown", handleGlobalKey);
    return () => document.removeEventListener("keydown", handleGlobalKey);
  }, [handleGlobalKey]);

  const submitSearch = () => {
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setIsSearchOpen(false);
      setSearchQuery("");
    }
  };

  return (
    <>
      <header
        className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
        style={{
          backgroundColor: "var(--navbar-bg)",
          backdropFilter: "blur(24px) saturate(200%)",
          WebkitBackdropFilter: "blur(24px) saturate(200%)",
          borderBottom: scrolled ? "1px solid var(--border)" : "1px solid transparent",
          boxShadow: scrolled ? "0 4px 30px rgba(0,0,0,0.18)" : "none",
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center h-14 gap-2">

            {/* Logo */}
            <Link href="/" className="flex items-center gap-2.5 shrink-0 group mr-2">
              <div className="relative">
                <div
                  className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  style={{ boxShadow: "0 0 16px rgba(var(--accent-rgb), 0.5)", background: "transparent" }}
                />
                <Image
                  src="/soraku-logo.png"
                  alt="Soraku"
                  width={30}
                  height={30}
                  className="rounded-full transition-transform duration-200 group-hover:scale-105 relative z-10"
                />
                <span
                  className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full z-20"
                  style={{ background: "var(--accent)", border: "2px solid var(--navbar-bg)" }}
                />
              </div>
              <span
                className="hidden sm:block text-[0.9375rem] font-800 tracking-tight"
                style={{ fontFamily: "var(--font-display)", fontWeight: 800, letterSpacing: "-0.03em", color: "var(--text-primary)" }}
              >
                Soraku{" "}
                <span style={{ color: "var(--accent)" }}>Stream</span>
              </span>
            </Link>

            {/* Nav links */}
            <nav className="hidden md:flex items-center gap-0.5">
              {NAV_LINKS.map(({ href, label }) => {
                const active = href === "/" ? pathname === "/" : pathname.startsWith(href);
                return (
                  <Link
                    key={href}
                    href={href}
                    className={cn(
                      "relative px-3 py-1.5 rounded-lg text-[0.8125rem] font-medium transition-all duration-150",
                      active ? "text-[var(--text-primary)]" : "text-[var(--text-muted)] hover:text-[var(--text-secondary)]"
                    )}
                    style={{ fontFamily: "var(--font-display)" }}
                  >
                    {active && (
                      <span
                        className="absolute inset-0 rounded-lg"
                        style={{
                          background: "var(--glass-bg)",
                          backdropFilter: "blur(8px)",
                          border: "1px solid var(--glass-border)",
                        }}
                      />
                    )}
                    <span className="relative">{label}</span>
                  </Link>
                );
              })}
            </nav>

            <div className="flex-1" />

            {/* Search */}
            {!isSearchOpen ? (
              <button
                onClick={() => { setIsSearchOpen(true); setTimeout(() => inputRef.current?.focus(), 50); }}
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-[0.8125rem] transition-all"
                style={{
                  background: "var(--glass-bg)",
                  backdropFilter: "blur(8px)",
                  border: "1px solid var(--glass-border)",
                  color: "var(--text-muted)",
                  fontFamily: "var(--font-body)",
                }}
              >
                <Search size={14} />
                <span className="hidden sm:block" style={{ minWidth: "100px" }}>Cari anime...</span>
                <span
                  className="hidden md:flex items-center text-[0.68rem] opacity-40 ml-1 font-bold"
                  style={{ fontFamily: "var(--font-display)" }}
                >/</span>
              </button>
            ) : (
              <div
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg animate-scale-in"
                style={{
                  background: "var(--glass-bg)",
                  backdropFilter: "blur(16px)",
                  border: "1px solid var(--accent)",
                  boxShadow: "0 0 0 3px rgba(var(--accent-rgb),0.12), 0 4px 20px rgba(var(--accent-rgb),0.08)",
                  minWidth: "220px",
                }}
              >
                <Search size={14} style={{ color: "var(--accent)" }} className="shrink-0" />
                <input
                  ref={inputRef}
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") submitSearch();
                    if (e.key === "Escape") { setIsSearchOpen(false); setSearchQuery(""); }
                  }}
                  placeholder="Cari anime..."
                  className="bg-transparent border-none outline-none text-sm w-full"
                  style={{ color: "var(--text-primary)", fontFamily: "var(--font-body)" }}
                />
                <button
                  onClick={() => { setIsSearchOpen(false); setSearchQuery(""); }}
                  className="shrink-0 hover:opacity-70 transition-opacity"
                  style={{ color: "var(--text-muted)" }}
                >
                  <X size={14} />
                </button>
              </div>
            )}

            {/* Theme toggle */}
            {mounted && (
              <button
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                className="soraku-btn-ghost p-2 rounded-lg flex items-center justify-center transition-all hover:scale-105"
                aria-label="Ganti tema"
              >
                {theme === "dark"
                  ? <Sun size={16} style={{ color: "var(--text-muted)" }} />
                  : <Moon size={16} style={{ color: "var(--text-muted)" }} />}
              </button>
            )}

            {/* Bell */}
            <button
              className="soraku-btn-ghost p-2 rounded-lg hidden md:flex items-center justify-center hover:scale-105 transition-transform"
              title="Notifikasi"
            >
              <Bell size={16} style={{ color: "var(--text-muted)" }} />
            </button>

            {/* Profile */}
            <Link
              href="/auth/login"
              className="flex items-center justify-center w-8 h-8 rounded-full transition-all hover:scale-105"
              style={{
                background: "var(--glass-bg)",
                backdropFilter: "blur(8px)",
                border: "1px solid var(--glass-border)",
              }}
              title="Profil"
            >
              <User size={15} style={{ color: "var(--text-secondary)" }} />
            </Link>

            {/* Mobile nav icons */}
            <div className="flex md:hidden items-center gap-0.5 ml-0.5">
              {NAV_LINKS.slice(1).map(({ href, icon: Icon }) => {
                const active = pathname.startsWith(href);
                return (
                  <Link
                    key={href}
                    href={href}
                    className="p-2 rounded-lg transition-colors"
                    style={{
                      backgroundColor: active ? "var(--bg-card)" : "transparent",
                      color: active ? "var(--accent)" : "var(--text-muted)",
                    }}
                  >
                    <Icon size={17} />
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      </header>

      {/* Mobile search backdrop */}
      {isSearchOpen && (
        <div
          className="fixed inset-0 z-40 md:hidden animate-fade-in"
          style={{ backgroundColor: "rgba(0,0,0,0.6)", backdropFilter: "blur(4px)" }}
          onClick={() => { setIsSearchOpen(false); setSearchQuery(""); }}
        />
      )}
    </>
  );
}
