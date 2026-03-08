"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter, usePathname } from "next/navigation";
import { useTheme } from "next-themes";
import { Sun, Moon, Search, X, Compass, Calendar, Home, Inbox, User } from "lucide-react";
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

  // Close search on route change
  useEffect(() => { setIsSearchOpen(false); setSearchQuery(""); }, [pathname]);

  // Keyboard shortcut /
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
        className={cn(
          "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
          scrolled ? "shadow-[0_1px_0_rgba(255,255,255,0.04)]" : ""
        )}
        style={{ backgroundColor: "var(--navbar-bg)", backdropFilter: "blur(20px) saturate(180%)" }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center h-14 gap-2">

            {/* Logo */}
            <Link href="/" className="flex items-center gap-2.5 shrink-0 group mr-1">
              <div className="relative">
                <Image
                  src="/soraku-logo.png"
                  alt="Soraku"
                  width={30}
                  height={30}
                  className="rounded-full transition-transform duration-200 group-hover:scale-105"
                />
                <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-[var(--accent)] border-2"
                  style={{ borderColor: "var(--navbar-bg)" }} />
              </div>
              <span className="font-display hidden sm:block text-[0.9375rem] font-700 tracking-tight"
                style={{ fontFamily: "var(--font-display)", fontWeight: 700, letterSpacing: "-0.025em", color: "var(--text-primary)" }}>
                Soraku{" "}
                <span style={{ color: "var(--accent)" }}>Stream</span>
              </span>
            </Link>

            {/* Nav links — desktop */}
            <nav className="hidden md:flex items-center gap-0.5">
              {NAV_LINKS.map(({ href, label }) => {
                const active = href === "/" ? pathname === "/" : pathname.startsWith(href);
                return (
                  <Link
                    key={href}
                    href={href}
                    className={cn(
                      "relative px-3 py-1.5 rounded-lg text-[0.8125rem] font-medium transition-all duration-150",
                      active
                        ? "text-[var(--text-primary)]"
                        : "text-[var(--text-muted)] hover:text-[var(--text-secondary)]"
                    )}
                    style={{ fontFamily: "var(--font-display)" }}
                  >
                    {active && (
                      <span className="absolute inset-0 rounded-lg" style={{ backgroundColor: "var(--bg-card)", border: "1px solid var(--border)" }} />
                    )}
                    <span className="relative">{label}</span>
                  </Link>
                );
              })}
            </nav>

            <div className="flex-1" />

            {/* Search button / bar */}
            {!isSearchOpen ? (
              <button
                onClick={() => { setIsSearchOpen(true); setTimeout(() => inputRef.current?.focus(), 50); }}
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-[0.8125rem] transition-all"
                style={{
                  backgroundColor: "var(--bg-card)",
                  border: "1px solid var(--border)",
                  color: "var(--text-muted)",
                  fontFamily: "var(--font-body)",
                }}
              >
                <Search size={14} />
                <span className="hidden sm:block" style={{ minWidth: "110px" }}>Cari anime...</span>
                <span className="hidden md:flex items-center gap-0.5 ml-1 text-[0.7rem] opacity-50"
                  style={{ fontFamily: "var(--font-display)", fontWeight: 600 }}>/</span>
              </button>
            ) : (
              <div
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg animate-scale-in"
                style={{
                  backgroundColor: "var(--bg-card)",
                  border: "1px solid var(--accent)",
                  boxShadow: "0 0 0 3px rgba(var(--accent-rgb), 0.12)",
                  minWidth: "220px",
                }}
              >
                <Search size={14} style={{ color: "var(--accent)" }} className="shrink-0" />
                <input
                  ref={inputRef}
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => { if (e.key === "Enter") submitSearch(); if (e.key === "Escape") { setIsSearchOpen(false); setSearchQuery(""); } }}
                  placeholder="Cari anime..."
                  className="bg-transparent border-none outline-none text-sm w-full"
                  style={{ color: "var(--text-primary)", fontFamily: "var(--font-body)" }}
                />
                <button onClick={() => { setIsSearchOpen(false); setSearchQuery(""); }}
                  className="shrink-0 transition-opacity hover:opacity-70" style={{ color: "var(--text-muted)" }}>
                  <X size={14} />
                </button>
              </div>
            )}

            {/* Theme toggle */}
            {mounted && (
              <button
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                className="soraku-btn soraku-btn-ghost p-2 ml-0.5"
                style={{ borderRadius: "var(--radius)" }}
                aria-label="Ganti tema"
              >
                {theme === "dark"
                  ? <Sun size={16} style={{ color: "var(--text-muted)" }} />
                  : <Moon size={16} style={{ color: "var(--text-muted)" }} />
                }
              </button>
            )}

            {/* Inbox icon */}
            <button
              className="soraku-btn soraku-btn-ghost p-2 hidden md:flex"
              style={{ borderRadius: "var(--radius)" }}
              title="Watchlist"
            >
              <Inbox size={16} style={{ color: "var(--text-muted)" }} />
            </button>

            {/* User icon */}
            <Link href="/profile"
              className="soraku-btn soraku-btn-ghost p-2 hidden md:flex"
              style={{ borderRadius: "var(--radius)" }}
              title="Profil"
            >
              <User size={16} style={{ color: "var(--text-muted)" }} />
            </Link>

            {/* Mobile nav icons */}
            <div className="flex md:hidden items-center gap-0.5 ml-0.5">
              {NAV_LINKS.slice(1).map(({ href, icon: Icon }) => {
                const active = pathname.startsWith(href);
                return (
                  <Link key={href} href={href}
                    className={cn("p-2 rounded-lg transition-colors", active ? "" : "")}
                    style={{
                      backgroundColor: active ? "var(--bg-card)" : "transparent",
                      color: active ? "var(--accent)" : "var(--text-muted)",
                    }}>
                    <Icon size={17} />
                  </Link>
                );
              })}
            </div>
          </div>
        </div>

        {/* Bottom border glow when scrolled */}
        {scrolled && (
          <div className="absolute bottom-0 left-0 right-0 h-px"
            style={{ background: "linear-gradient(to right, transparent, var(--border-strong), transparent)" }} />
        )}
      </header>

      {/* Search overlay on mobile */}
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
