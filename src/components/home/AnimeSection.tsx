import { AnimeCard, AnimeCardSkeleton } from "@/components/cards/AnimeCard";
import type { Anime } from "@/types";

interface Props {
  title: string;
  animes: Anime[];
  loading?: boolean;
  href?: string;
}

export function AnimeSection({ title, animes, loading = false, href }: Props) {
  return (
    <section className="mb-10">
      <div className="flex items-center justify-between mb-4">
        <h2 className="soraku-section-title">{title}</h2>
        {href && (
          <a
            href={href}
            className="text-xs font-700 transition-colors hover:text-[var(--text-primary)]"
            style={{ fontFamily: "var(--font-display)", fontWeight: 700, color: "var(--text-muted)" }}
          >
            Lihat Semua →
          </a>
        )}
      </div>

      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-3 sm:gap-4">
        {loading
          ? Array.from({ length: 6 }).map((_, i) => <AnimeCardSkeleton key={i} />)
          : animes.slice(0, 12).map((anime) => <AnimeCard key={anime.id} anime={anime} />)
        }
      </div>
    </section>
  );
}
