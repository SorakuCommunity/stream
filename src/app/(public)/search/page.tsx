"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { Search } from "lucide-react";
import { AnimeCard, AnimeCardSkeleton } from "@/components/cards/AnimeCard";
import type { Anime } from "@/types";

const SEARCH_QUERY = `
  query ($search: String, $page: Int, $perPage: Int, $sort: [MediaSort], $genre: String, $status: MediaStatus) {
    Page(page: $page, perPage: $perPage) {
      pageInfo { total hasNextPage currentPage lastPage }
      media(type: ANIME, search: $search, sort: $sort, genre: $genre, status: $status) {
        id title { romaji english }
        coverImage { large color }
        averageScore popularity episodes status format season seasonYear genres
        nextAiringEpisode { airingAt timeUntilAiring episode }
      }
    }
  }
`;

const GENRES = ["Action", "Adventure", "Comedy", "Drama", "Fantasy", "Horror", "Mystery", "Romance", "Sci-Fi", "Slice of Life", "Sports", "Thriller"];
const SORTS = [
  { value: "TRENDING_DESC", label: "Trending" },
  { value: "POPULARITY_DESC", label: "Populer" },
  { value: "SCORE_DESC", label: "Skor Tertinggi" },
  { value: "UPDATED_AT_DESC", label: "Terbaru" },
];

export default function SearchPage() {
  const searchParams = useSearchParams();
  const q = searchParams.get("q") ?? "";
  const [animes, setAnimes] = useState<Anime[]>([]);
  const [loading, setLoading] = useState(false);
  const [query, setQuery] = useState(q);
  const [genre, setGenre] = useState("");
  const [sort, setSort] = useState("TRENDING_DESC");
  const [page, setPage] = useState(1);
  const [hasNext, setHasNext] = useState(false);

  const fetchAnime = async (reset = false) => {
    setLoading(true);
    const currentPage = reset ? 1 : page;
    try {
      const res = await fetch("https://graphql.anilist.co", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          query: SEARCH_QUERY,
          variables: {
            search: query || undefined,
            genre: genre || undefined,
            sort: [sort],
            page: currentPage,
            perPage: 24,
          },
        }),
      });
      const json = await res.json();
      const media = json.data?.Page?.media ?? [];
      const pageInfo = json.data?.Page?.pageInfo;
      setAnimes(reset ? media : (prev) => [...prev, ...media]);
      setHasNext(pageInfo?.hasNextPage ?? false);
      if (reset) setPage(2); else setPage((p) => p + 1);
    } catch {}
    setLoading(false);
  };

  useEffect(() => {
    setQuery(q);
  }, [q]);

  useEffect(() => {
    fetchAnime(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query, genre, sort]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
      <h1 className="text-xl font-bold mb-5" style={{ color: "var(--text-primary)" }}>
        Temukan Anime
      </h1>

      {/* Filters */}
      <div className="flex flex-wrap gap-2 mb-6">
        {/* Sort */}
        <select
          value={sort}
          onChange={(e) => setSort(e.target.value)}
          className="soraku-input w-auto text-xs py-1.5"
        >
          {SORTS.map((s) => (
            <option key={s.value} value={s.value}>{s.label}</option>
          ))}
        </select>

        {/* Genre filter */}
        <select
          value={genre}
          onChange={(e) => setGenre(e.target.value)}
          className="soraku-input w-auto text-xs py-1.5"
        >
          <option value="">Semua Genre</option>
          {GENRES.map((g) => (
            <option key={g} value={g}>{g}</option>
          ))}
        </select>
      </div>

      {/* Results */}
      {!loading && animes.length === 0 && (
        <div className="text-center py-16" style={{ color: "var(--text-muted)" }}>
          <Search size={40} className="mx-auto mb-3 opacity-30" />
          <p>Tidak ada hasil ditemukan.</p>
        </div>
      )}

      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-7 gap-3">
        {animes.map((a) => <AnimeCard key={a.id} anime={a} />)}
        {loading && Array.from({ length: 12 }).map((_, i) => <AnimeCardSkeleton key={i} />)}
      </div>

      {hasNext && !loading && (
        <div className="text-center mt-8">
          <button onClick={() => fetchAnime(false)} className="soraku-btn soraku-btn-accent px-8">
            Muat Lebih Banyak
          </button>
        </div>
      )}
    </div>
  );
}
