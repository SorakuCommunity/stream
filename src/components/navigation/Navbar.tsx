"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter, usePathname } from "next/navigation";
import { Search, Sun, Moon, Monitor, X, Menu } from "lucide-react";
import { useTheme } from "next-themes";
import { cn } from "@/lib/utils";

const NAV_LINKS = [
  { href: "/",         label: "Beranda"  },
  { href: "/search",   label: "Temukan"  },
  { href: "/schedule", label: "Jadwal"   },
  { href: "/about",    label: "Tentang"  },
];

export function Navbar() {
  const { theme, setTheme } = useTheme();
  const router    = useRouter();
  const pathname  = usePathname();
  const [query,       setQuery]       = useState("");
  const [showSearch,  setShowSearch]  = useState(false);
  const [scrolled,    setScrolled]    = useState(false);
  const [mobileMenu,  setMobileMenu]  = useState(false);
  const [mounted,     setMounted]     = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setMounted(true);
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Keyboard shortcut "/"
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "/" && document.activeElement?.tagName !== "INPUT" && document.activeElement?.tagName !== "TEXTAREA") {
        e.preventDefault();
        setShowSearch(true);
        setTimeout(() => inputRef.current?.focus(), 60);
      }
      if (e.key === "Escape") { setShowSearch(false); setMobileMenu(false); }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query.trim())}`);
      setShowSearch(false);
      setQuery("");
    }
  };

  const cycleTheme = () => {
    const order = ["dark", "light", "system"];
    const cur = order.indexOf(theme ?? "system");
    setTheme(order[(cur + 1) % order.length]);
  };

  const ThemeIcon = !mounted ? Monitor : theme === "dark" ? Moon : theme === "light" ? Sun : Monitor;

  return (
    <header
      className="fixed top-0 left-0 right-0 z-50 transition-all duration-200"
      style={{
        background: scrolled ? "var(--navbar-bg)" : "transparent",
        backdropFilter: scrolled ? "blur(24px) saturate(180%)" : "none",
        WebkitBackdropFilter: scrolled ? "blur(24px) saturate(180%)" : "none",
        borderBottom: scrolled ? "1px solid var(--border)" : "1px solid transparent",
        boxShadow: scrolled ? "0 2px 20px rgba(0,0,0,0.12)" : "none",
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-14 flex items-center gap-4">

        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 shrink-0 group">
          <Image
            src="/soraku-logo.png"
            alt="Soraku"
            width={28}
            height={28}
            className="rounded-full transition-transform group-hover:scale-110"
          />
          <span
            className="hidden sm:block"
            style={{
              fontFamily: "var(--font-display)",
              fontWeight: 800,
              fontSize: "0.9375rem",
              letterSpacing: "-0.03em",
              color: "var(--text-primary)",
            }}
          >
            Soraku <span style={{ color: "var(--accent)" }}>Stream</span>
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-0.5 flex-1">
          {NAV_LINKS.map(({ href, label }) => {
            const isActive = href === "/" ? pathname === "/" : pathname.startsWith(href);
            return (
              <Link
                key={href}
                href={href}
                className="px-3.5 py-1.5 rounded-lg text-sm font-600 transition-all"
                style={{
                  fontFamily: "var(--font-display)", fontWeight: isActive ? 700 : 600,
                  background: isActive ? "var(--bg-card)" : "transparent",
                  color: isActive ? "var(--text-primary)" : "var(--text-muted)",
                }}
              >
                {label}
              </Link>
            );
          })}
        </nav>

        {/* Spacer */}
        <div className="flex-1 md:flex-none" />

        {/* Right actions */}
        <div className="flex items-center gap-1.5">
          {/* Search bar (desktop) / icon (mobile) */}
          <div className="hidden sm:block">
            {showSearch ? (
              <form onSubmit={handleSearch} className="flex items-center gap-2">
                <div
                  className="flex items-center gap-2 px-3 py-1.5 rounded-xl"
                  style={{
                    background: "var(--bg-card)",
                    border: "1px solid var(--accent)",
                    boxShadow: "0 0 0 3px rgba(var(--accent-rgb),0.1)",
                    width: "220px",
                  }}
                >
                  <Search size={13} style={{ color: "var(--text-muted)", flexShrink: 0 }} />
                  <input
                    ref={inputRef}
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Cari anime…"
                    className="flex-1 bg-transparent outline-none text-sm"
                    style={{ fontFamily: "var(--font-body)", color: "var(--text-primary)" }}
                    autoFocus
                  />
                </div>
                <button
                  type="button"
                  onClick={() => { setShowSearch(false); setQuery(""); }}
                  className="w-8 h-8 flex items-center justify-center rounded-lg transition-all"
                  style={{ color: "var(--text-muted)" }}
                >
                  <X size={14} />
                </button>
              </form>
            ) : (
              <button
                onClick={() => { setShowSearch(true); setTimeout(() => inputRef.current?.focus(), 60); }}
                className="w-8 h-8 flex items-center justify-center rounded-lg transition-all hover:scale-110"
                style={{ color: "var(--text-muted)" }}
                title="Cari (tekan /)"
              >
                <Search size={16} />
              </button>
            )}
          </div>

          {/* Search icon (mobile) */}
          <Link href="/search" className="sm:hidden w-8 h-8 flex items-center justify-center rounded-lg transition-all"
            style={{ color: "var(--text-muted)" }}>
            <Search size={16} />
          </Link>

          {/* Theme toggle */}
          <button
            onClick={cycleTheme}
            className="w-8 h-8 flex items-center justify-center rounded-lg transition-all hover:scale-110"
            style={{ color: "var(--text-muted)" }}
            title={`Tema: ${theme}`}
          >
            <ThemeIcon size={16} />
          </button>

          {/* Mobile menu toggle */}
          <button
            className="md:hidden w-8 h-8 flex items-center justify-center rounded-lg transition-all"
            onClick={() => setMobileMenu((v) => !v)}
            style={{ color: "var(--text-muted)" }}
          >
            {mobileMenu ? <X size={16} /> : <Menu size={16} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileMenu && (
        <div
          className="md:hidden px-4 pb-4 animate-slide-down"
          style={{ background: "var(--navbar-bg)", backdropFilter: "blur(24px)" }}
        >
          {NAV_LINKS.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              onClick={() => setMobileMenu(false)}
              className="block px-4 py-3 rounded-xl text-sm font-600 transition-all"
              style={{
                fontFamily: "var(--font-display)", fontWeight: 600,
                color: pathname === href ? "var(--accent)" : "var(--text-secondary)",
              }}
            >
              {label}
            </Link>
          ))}
        </div>
      )}
    </header>
  );
}
