"use client";

import Link from "next/link";
import Image from "next/image";
import { FaDiscord, FaGithub } from "react-icons/fa";

const currentYear = new Date().getFullYear();

export function Footer() {
  return (
    <footer
      className="mt-12 border-t"
      style={{ borderColor: "var(--border)" }}
    >
      {/* Main footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <div className="flex flex-col sm:flex-row justify-between gap-6">
          {/* Brand */}
          <div className="max-w-xs">
            <div className="flex items-center gap-2 mb-3">
              <Image
                src="/soraku-logo.png"
                alt="Soraku"
                width={28}
                height={28}
                className="rounded-full"
              />
              <span className="font-bold text-base" style={{ color: "var(--text-primary)" }}>
                Soraku{" "}
                <span style={{ color: "var(--accent)" }}>Stream</span>
              </span>
            </div>
            <p className="text-xs leading-relaxed" style={{ color: "var(--text-muted)" }}>
              Situs ini tidak menyimpan file apapun di servernya. Semua konten
              disediakan oleh layanan pihak ketiga.
            </p>
          </div>

          {/* Links */}
          <div className="flex flex-col gap-2 sm:items-end sm:justify-end">
            <Link
              href="/about"
              className="text-sm transition-colors hover:text-[var(--text-primary)]"
              style={{ color: "var(--text-secondary)" }}
            >
              Tentang
            </Link>
            <Link
              href="/pptos"
              className="text-sm transition-colors hover:text-[var(--text-primary)]"
              style={{ color: "var(--text-secondary)" }}
            >
              Privasi & Ketentuan
            </Link>
            <a
              href="https://discord.gg/soraku"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm transition-colors hover:text-[var(--text-primary)]"
              style={{ color: "var(--text-secondary)" }}
            >
              Discord
            </a>
          </div>
        </div>
      </div>

      {/* Sub footer */}
      <div
        className="border-t"
        style={{ borderColor: "var(--border)" }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs" style={{ color: "var(--text-muted)" }}>
            © {currentYear}{" "}
            <a
              href="https://soraku.id"
              rel="noopener noreferrer"
              className="hover:text-[var(--text-secondary)] transition-colors"
              style={{ color: "var(--text-muted)" }}
            >
              Soraku Community
            </a>{" "}
            — Dibuat dengan ❤️ oleh <strong style={{ color: "var(--text-secondary)" }}>Soraku Community</strong>
          </p>

          {/* Social icons */}
          <div className="flex items-center gap-3">
            {[
              { href: "https://discord.gg/soraku", Icon: FaDiscord, label: "Discord" },
              { href: "https://github.com/SorakuCommunity", Icon: FaGithub, label: "GitHub" },
            ].map(({ href, Icon, label }) => (
              <a
                key={href}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`Soraku di ${label}`}
                className="transition-all hover:scale-110"
                style={{ color: "var(--text-muted)" }}
              >
                <Icon size={18} />
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
