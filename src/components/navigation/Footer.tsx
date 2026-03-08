"use client";

import Link from "next/link";
import Image from "next/image";
import { FaDiscord, FaGithub } from "react-icons/fa";

const year = new Date().getFullYear();

export function Footer() {
  return (
    <footer className="mt-16 border-t" style={{ borderColor: "var(--border)" }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <div className="flex flex-col sm:flex-row justify-between gap-8">

          {/* Brand */}
          <div className="max-w-xs">
            <Link href="/" className="flex items-center gap-2.5 mb-3 group w-fit">
              <Image src="/soraku-logo.png" alt="Soraku" width={26} height={26} className="rounded-full" />
              <span style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "0.9rem", letterSpacing: "-0.02em", color: "var(--text-primary)" }}>
                Soraku <span style={{ color: "var(--accent)" }}>Stream</span>
              </span>
            </Link>
            <p className="text-xs leading-relaxed" style={{ color: "var(--text-muted)", fontFamily: "var(--font-body)" }}>
              Platform streaming anime komunitas Soraku. Gratis, tanpa iklan, untuk semua pecinta anime Indonesia.
            </p>
            <p className="text-xs mt-3" style={{ color: "var(--text-muted)", fontFamily: "var(--font-body)" }}>
              Situs ini tidak menyimpan file apapun di server. Semua konten dari layanan pihak ketiga.
            </p>
          </div>

          {/* Links */}
          <div className="flex gap-12">
            <div>
              <p className="text-[0.7rem] font-bold uppercase tracking-wider mb-3"
                style={{ color: "var(--text-muted)", fontFamily: "var(--font-display)" }}>
                Platform
              </p>
              <div className="flex flex-col gap-2">
                {[
                  { href: "/", label: "Beranda" },
                  { href: "/search", label: "Temukan" },
                  { href: "/schedule", label: "Jadwal" },
                ].map(({ href, label }) => (
                  <Link key={href} href={href}
                    className="text-sm transition-colors hover:text-[var(--text-primary)]"
                    style={{ color: "var(--text-secondary)", fontFamily: "var(--font-body)" }}>
                    {label}
                  </Link>
                ))}
              </div>
            </div>
            <div>
              <p className="text-[0.7rem] font-bold uppercase tracking-wider mb-3"
                style={{ color: "var(--text-muted)", fontFamily: "var(--font-display)" }}>
                Komunitas
              </p>
              <div className="flex flex-col gap-2">
                {[
                  { href: "https://soraku.id", label: "Soraku Community", ext: true },
                  { href: "https://discord.gg/soraku", label: "Discord Server", ext: true },
                  { href: "/about", label: "Tentang", ext: false },
                  { href: "/pptos", label: "Privasi & Ketentuan", ext: false },
                ].map(({ href, label, ext }) => (
                  ext
                    ? <a key={href} href={href} target="_blank" rel="noopener noreferrer"
                        className="text-sm transition-colors hover:text-[var(--text-primary)]"
                        style={{ color: "var(--text-secondary)", fontFamily: "var(--font-body)" }}>
                        {label}
                      </a>
                    : <Link key={href} href={href}
                        className="text-sm transition-colors hover:text-[var(--text-primary)]"
                        style={{ color: "var(--text-secondary)", fontFamily: "var(--font-body)" }}>
                        {label}
                      </Link>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 mt-8 pt-5 border-t"
          style={{ borderColor: "var(--border)" }}>
          <p className="text-xs" style={{ color: "var(--text-muted)", fontFamily: "var(--font-body)" }}>
            © {year}{" "}
            <a href="https://soraku.id" rel="noopener noreferrer"
              className="hover:text-[var(--text-secondary)] transition-colors">
              Soraku Community
            </a>
            {" "}— dibuat dengan ❤️ oleh komunitas
          </p>
          <div className="flex items-center gap-3">
            {[
              { href: "https://discord.gg/soraku", Icon: FaDiscord, label: "Discord" },
              { href: "https://github.com/SorakuCommunity", Icon: FaGithub, label: "GitHub" },
            ].map(({ href, Icon, label }) => (
              <a key={href} href={href} target="_blank" rel="noopener noreferrer"
                aria-label={`Soraku di ${label}`}
                className="transition-all hover:scale-110 hover:text-[var(--text-primary)]"
                style={{ color: "var(--text-muted)" }}>
                <Icon size={17} />
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
