import { HeroBanner } from "@/components/home/HeroBanner";
import { HomeClient } from "@/components/home/HomeClient";
import { ContinueWatching } from "@/components/home/ContinueWatching";
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
    return json?.data ?? null;
  } catch { return null; }
}

const HOME_QUERY = `
  query {
    trending: Page(page: 1, perPage: 24) {
      media(type: ANIME, sort: TRENDING_DESC) {
        id idMal title { romaji english }
        coverImage { large medium color }
        bannerImage averageScore popularity episodes status format
        season seasonYear genres
        nextAiringEpisode { airingAt timeUntilAiring episode }
      }
    }
    popular: Page(page: 1, perPage: 24) {
      media(type: ANIME, sort: POPULARITY_DESC, status: RELEASING) {
        id idMal title { romaji english }
        coverImage { large medium color }
        bannerImage averageScore popularity episodes status format
        season seasonYear genres
        nextAiringEpisode { airingAt timeUntilAiring episode }
      }
    }
    topRated: Page(page: 1, perPage: 24) {
      media(type: ANIME, sort: SCORE_DESC, status_not: NOT_YET_RELEASED) {
        id idMal title { romaji english }
        coverImage { large medium color }
        averageScore popularity episodes status format
        season seasonYear genres
        nextAiringEpisode { airingAt timeUntilAiring episode }
      }
    }
  }
`;

export default async function HomePage() {
  const data = await fetchAniList(HOME_QUERY, {});

  const trending: Anime[] = data?.trending?.media ?? [];
  const popular:  Anime[] = data?.popular?.media  ?? [];
  const topRated: Anime[] = data?.topRated?.media ?? [];
  const heroList = trending.filter((a) => a.bannerImage).slice(0, 6);

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6">
      <div className="pt-20 pb-10">
        {heroList.length > 0 && <HeroBanner animes={heroList} />}
        <ContinueWatching />
        <HomeClient newest={trending} popular={popular} topRated={topRated} />
      </div>
    </main>
  );
}
