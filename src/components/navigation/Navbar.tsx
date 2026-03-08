"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter, usePathname } from "next/navigation";
import { useTheme } from "next-themes";
import { Sun, Moon, Search, X, User, Command } from "lucide-react";
import { cn } from "@/lib/utils";

export function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [showMobileSearch, setShowMobileSearch] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const debounceRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    setMounted(true);
    setIsMobile(window.innerWidth < 500);
    const onResize = () => setIsMobile(window.innerWidth < 500);
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("resize", onResize);
    window.addEventListener("scroll", onScroll);
    return () => {
      window.removeEventListener("resize", onResize);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  // Close mobile search on route change
  useEffect(() => {
    if (isMobile) setShowMobileSearch(false);
  }, [pathname, isMobile]);

  // Keyboard shortcut
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "/" && document.activeElement !== inputRef.current) {
        e.preventDefault();
        inputRef.current?.focus();
      }
      if (e.key === "Escape") inputRef.current?.blur();
    },
    []
  );

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  const handleSearch = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      inputRef.current?.blur();
    }
  };

  const SearchBar = (
    <div
      className={cn(
        "flex flex-1 max-w-md items-center gap-2 px-3 py-1.5 rounded-lg transition-all",
        "bg-[var(--bg-card)] border border-[var(--border)]",
        isSearchFocused && "border-[var(--accent)]"
      )}
    >
      <Search
        size={15}
        style={{ color: isSearchFocused ? "var(--accent)" : "var(--text-muted)" }}
        className="shrink-0 transition-colors"
      />
      <input
        ref={inputRef}
        type="text"
        placeholder="Cari anime..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        onKeyDown={handleSearch}
        onFocus={() => setIsSearchFocused(true)}
        onBlur={() => setIsSearchFocused(false)}
        className="bg-transparent border-none outline-none text-sm w-full text-[var(--text-primary)] placeholder:text-[var(--text-muted)]"
        aria-label="Cari anime"
      />
      {searchQuery && (
        <button
          onClick={() => setSearchQuery("")}
          className="text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors"
          aria-label="Hapus pencarian"
        >
          <X size={14} />
        </button>
      )}
      {!isMobile && (
        <span className="hidden md:flex items-center text-xs text-[var(--text-muted)] gap-0.5 shrink-0">
          <Command size={11} /> /
        </span>
      )}
    </div>
  );

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-200",
        "backdrop-blur-md",
        scrolled
          ? "shadow-sm"
          : ""
      )}
      style={{ backgroundColor: "var(--navbar-bg)" }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Main row */}
        <div className="flex items-center gap-3 h-14">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center gap-2 shrink-0 group"
            aria-label="Soraku Stream"
          >
            <Image
              src="/soraku-logo.png"
              alt="Soraku"
              width={32}
              height={32}
              className="rounded-full group-hover:scale-105 transition-transform"
            />
            <span className="font-bold text-base hidden sm:block"
              style={{ color: "var(--text-primary)" }}>
              Soraku{" "}
              <span style={{ color: "var(--accent)" }}>Stream</span>
            </span>
          </Link>

          {/* Nav links — desktop */}
          <nav className="hidden md:flex items-center gap-1 ml-2">
            {[
              { href: "/", label: "Beranda" },
              { href: "/search", label: "Temukan" },
              { href: "/schedule", label: "Jadwal" },
            ].map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className={cn(
                  "px-3 py-1.5 rounded-lg text-sm font-medium transition-colors",
                  pathname === href
                    ? "bg-[var(--bg-card)] text-[var(--text-primary)]"
                    : "text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-card)]"
                )}
              >
                {label}
              </Link>
            ))}
          </nav>

          {/* Search bar — desktop */}
          {!isMobile && <div className="flex-1">{SearchBar}</div>}

          {/* Right actions */}
          <div className="flex items-center gap-1 ml-auto">
            {/* Mobile search toggle */}
            {isMobile && (
              <button
                onClick={() => setShowMobileSearch((v) => !v)}
                className="soraku-btn p-2"
                aria-label="Buka pencarian"
              >
                {showMobileSearch ? <X size={18} /> : <Search size={18} />}
              </button>
            )}

            {/* Theme toggle */}
            {mounted && (
              <button
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                className="soraku-btn p-2"
                aria-label="Ganti tema"
              >
                {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
              </button>
            )}

            {/* Profile */}
            <Link href="/auth/login" className="soraku-btn p-2" aria-label="Profil">
              <User size={18} />
            </Link>
          </div>
        </div>

        {/* Mobile search bar */}
        {isMobile && showMobileSearch && (
          <div className="pb-3 animate-slide-down">{SearchBar}</div>
        )}
      </div>
    </header>
  );
}
