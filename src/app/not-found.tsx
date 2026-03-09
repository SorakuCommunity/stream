"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { Home, Search, ArrowLeft } from "lucide-react";

export default function NotFound() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center px-4 relative overflow-hidden"
      style={{ background: "var(--bg-primary)" }}
    >
      {/* Ambient glow background */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: "radial-gradient(ellipse 60% 50% at 50% 40%, rgba(var(--accent-rgb),0.07), transparent 70%)",
        }}
      />

      {/* Floating logo */}
      <div className={`mb-8 transition-all duration-700 ${mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}>
        <div className="animate-float">
          <Image
            src="/soraku-logo.png"
            alt="Soraku"
            width={80}
            height={80}
            className="rounded-full mx-auto"
            style={{ boxShadow: "0 0 40px rgba(var(--accent-rgb),0.35), 0 0 80px rgba(var(--accent-rgb),0.1)" }}
          />
        </div>
      </div>

      {/* 404 number */}
      <div className={`transition-all duration-700 delay-100 ${mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}>
        <h1
          className="text-center mb-2 leading-none select-none"
          style={{
            fontFamily: "var(--font-display)",
            fontWeight: 900,
            fontSize: "clamp(6rem, 20vw, 12rem)",
            letterSpacing: "-0.05em",
            background: "linear-gradient(135deg, var(--text-primary) 0%, var(--text-muted) 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}
        >
          404
        </h1>
      </div>

      {/* Glass card */}
      <div
        className={`text-center rounded-2xl px-8 py-6 max-w-sm w-full transition-all duration-700 delay-200 ${mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
        style={{
          background: "var(--glass-bg)",
          backdropFilter: "blur(20px) saturate(180%)",
          WebkitBackdropFilter: "blur(20px) saturate(180%)",
          border: "1px solid var(--glass-border)",
          boxShadow: "var(--shadow-card), inset 0 1px 0 rgba(255,255,255,0.05)",
        }}
      >
        <h2
          className="text-lg font-800 mb-2"
          style={{ fontFamily: "var(--font-display)", fontWeight: 800, color: "var(--text-primary)" }}
        >
          Halaman Tidak Ditemukan
        </h2>
        <p className="text-sm mb-6 leading-relaxed" style={{ color: "var(--text-muted)" }}>
          Anime yang kamu cari mungkin sudah pindah atau tidak ada.
          Yuk kembali dan temukan anime seru lainnya!
        </p>

        <div className="flex flex-col sm:flex-row gap-2.5">
          <Link
            href="/"
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl font-700 text-sm transition-all hover:scale-105"
            style={{
              fontFamily: "var(--font-display)",
              fontWeight: 700,
              background: "var(--accent)",
              color: "#fff",
              boxShadow: "0 4px 20px rgba(var(--accent-rgb),0.35)",
            }}
          >
            <Home size={14} />
            Beranda
          </Link>
          <Link
            href="/search"
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl font-700 text-sm transition-all hover:scale-105"
            style={{
              fontFamily: "var(--font-display)",
              fontWeight: 700,
              background: "var(--bg-hover)",
              border: "1px solid var(--border)",
              color: "var(--text-secondary)",
            }}
          >
            <Search size={14} />
            Cari Anime
          </Link>
        </div>

        <button
          onClick={() => window.history.back()}
          className="mt-3 flex items-center gap-1.5 mx-auto text-xs transition-colors hover:text-[var(--text-primary)]"
          style={{ color: "var(--text-muted)", fontFamily: "var(--font-display)", fontWeight: 600 }}
        >
          <ArrowLeft size={12} />
          Kembali
        </button>
      </div>

      {/* Version badge */}
      <p
        className={`mt-8 text-xs transition-all duration-700 delay-300 ${mounted ? "opacity-100" : "opacity-0"}`}
        style={{ color: "var(--text-muted)", fontFamily: "var(--font-display)" }}
      >
        Soraku Stream v0.1.0
      </p>
    </div>
  );
}
