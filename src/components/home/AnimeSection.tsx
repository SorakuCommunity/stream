import Link from "next/link";
import { AnimeCard, AnimeCardSkeleton } from "@/components/cards/AnimeCard";
import type { Anime } from "@/types";

interface AnimeSectionProps {
  title: string;
  href?: string;
  animes: Anime[];
  loading?: boolean;
}

export function AnimeSection({ title, href, animes, loading }: AnimeSectionProps) {
  return (
    <section className="mb-10">
      <div className="flex items-center justify-between mb-4">
        <h2
          className="text-base font-bold"
          style={{ color: "var(--text-primary)" }}
        >
          {title}
        </h2>
        {href && (
          <Link
            href={href}
            className="text-xs font-medium transition-colors hover:underline"
            style={{ color: "var(--accent)" }}
          >
            Lihat semua →
          </Link>
        )}
      </div>

      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-7 gap-3">
        {loading
          ? Array.from({ length: 14 }).map((_, i) => (
              <AnimeCardSkeleton key={i} />
            ))
          : animes.map((anime) => (
              <AnimeCard key={anime.id} anime={anime} />
            ))}
      </div>
    </section>
  );
}
