import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { WatchClient } from "./WatchClient";

interface Props {
  params: Promise<{ id: string }>;
}

const ANIME_QUERY = `
  query ($id: Int) {
    Media(id: $id, type: ANIME) {
      id idMal title { romaji english native }
      coverImage { large extraLarge }
      bannerImage description averageScore popularity
      episodes status format season seasonYear genres
      studios { nodes { name } }
      nextAiringEpisode { airingAt timeUntilAiring episode }
      externalLinks { url site }
    }
  }
`;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  try {
    const res = await fetch("https://graphql.anilist.co", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query: ANIME_QUERY, variables: { id: parseInt(id) } }),
      next: { revalidate: 3600 },
    });
    const json = await res.json();
    const anime = json.data?.Media;
    const title = anime?.title?.english || anime?.title?.romaji || "Anime";
    return {
      title: `${title} | Soraku Stream`,
      description: `Nonton ${title} di Soraku Stream — gratis, HD, tanpa iklan.`,
    };
  } catch {
    return { title: "Tonton Anime | Soraku Stream" };
  }
}

export default async function WatchPage({ params }: Props) {
  const { id } = await params;
  const numId = parseInt(id);
  if (isNaN(numId)) notFound();

  const res = await fetch("https://graphql.anilist.co", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ query: ANIME_QUERY, variables: { id: numId } }),
    next: { revalidate: 3600 },
  });
  const json = await res.json();
  const anime = json.data?.Media;
  if (!anime) notFound();

  return <WatchClient anime={anime} />;
}
