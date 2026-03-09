import Link from "next/link";
import { AnimeCard, AnimeCardSkeleton } from "@/components/cards/AnimeCard";
import type { Anime } from "@/types";

interface Props {
  title: string;
  href?: string;
  animes: Anime[];
  loading?: boolean;
  emoji?: string;
}

export function AnimeSection({ title, href, animes, loading, emoji }: Props) {
  return (
    <section className="mb-12">
      <div className="flex items-center justify-between mb-5">
        <h2 className="soraku-section-title">
          {emoji && <span className="text-base">{emoji}</span>}
          {title}
        </h2>
        {href && (
          <Link
            href={href}
            className="text-xs font-600 transition-colors hover:text-[var(--text-primary)] flex items-center gap-1"
            style={{ fontFamily: "var(--font-display)", fontWeight: 600, color: "var(--accent)" }}
          >
            Lihat semua →
          </Link>
        )}
      </div>

      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-7 gap-3 sm:gap-4">
        {loading
          ? Array.from({ length: 14 }).map((_, i) => <AnimeCardSkeleton key={i} />)
          : animes.map((anime) => <AnimeCard key={anime.id} anime={anime} />)
        }
      </div>
    </section>
  );
}
