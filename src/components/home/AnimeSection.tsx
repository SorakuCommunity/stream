import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { AnimeCard, AnimeCardSkeleton } from "@/components/cards/AnimeCard";
import type { Anime } from "@/types";

interface AnimeSectionProps {
  title: string;
  emoji?: string;
  href?: string;
  animes: Anime[];
  loading?: boolean;
}

export function AnimeSection({ title, emoji, href, animes, loading }: AnimeSectionProps) {
  return (
    <section className="mb-10">
      <div className="flex items-center justify-between mb-4">
        <h2 className="soraku-section-title">
          {emoji && <span className="text-base mr-0.5">{emoji}</span>}
          {title}
        </h2>
        {href && (
          <Link
            href={href}
            className="flex items-center gap-0.5 text-xs font-semibold transition-colors hover:text-[var(--accent)]"
            style={{ color: "var(--text-muted)", fontFamily: "var(--font-display)" }}
          >
            Lihat semua
            <ChevronRight size={13} />
          </Link>
        )}
      </div>

      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-7 gap-3">
        {loading
          ? Array.from({ length: 14 }).map((_, i) => <AnimeCardSkeleton key={i} />)
          : animes.map((anime) => <AnimeCard key={anime.id} anime={anime} />)
        }
      </div>
    </section>
  );
}
