import { HeroBanner } from "@/components/home/HeroBanner";
import { AnimeSection } from "@/components/home/AnimeSection";
import type { Anime } from "@/types";

async function fetchAniList(query: string, variables: Record<string, unknown>) {
  try {
    const res = await fetch("https://graphql.anilist.co", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query, variables }),
      next: { revalidate: 3600 },
    });
    const json = await res.json();
    return json.data;
  } catch {
    return null;
  }
}

const TRENDING_QUERY = `
  query ($page: Int, $perPage: Int) {
    trending: Page(page: $page, perPage: $perPage) {
      media(type: ANIME, sort: TRENDING_DESC) {
        id title { romaji english }
        coverImage { large color }
        bannerImage averageScore popularity episodes status format season seasonYear
        nextAiringEpisode { airingAt timeUntilAiring episode }
      }
    }
    popular: Page(page: 1, perPage: 14) {
      media(type: ANIME, sort: POPULARITY_DESC, status: RELEASING) {
        id title { romaji english }
        coverImage { large color }
        bannerImage averageScore popularity episodes status format season seasonYear
        nextAiringEpisode { airingAt timeUntilAiring episode }
      }
    }
  }
`;

export default async function HomePage() {
  const data = await fetchAniList(TRENDING_QUERY, { page: 1, perPage: 14 });

  const trending: Anime[] = data?.trending?.media ?? [];
  const popular: Anime[] = data?.popular?.media ?? [];
  const heroAnimes = trending.filter((a) => a.bannerImage).slice(0, 5);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
      {/* Hero Banner */}
      {heroAnimes.length > 0 && <HeroBanner animes={heroAnimes} />}

      {/* Sections */}
      <AnimeSection
        title="🔥 Trending Sekarang"
        href="/search?sort=TRENDING_DESC"
        animes={trending}
      />
      <AnimeSection
        title="📡 Sedang Tayang"
        href="/search?sort=POPULARITY_DESC&status=RELEASING"
        animes={popular}
      />
    </div>
  );
}
