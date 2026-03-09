import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Play, Plus, Star } from "lucide-react";
import { AnimeInfoClient } from "./AnimeInfoClient";

interface PageProps { params: Promise<{ id: string }>; }

const ANIME_QUERY = `
  query ($id: Int) {
    Media(id: $id, type: ANIME) {
      id idMal
      title { romaji english native }
      coverImage { large extraLarge color }
      bannerImage
      description(asHtml: true)
      averageScore meanScore popularity favourites
      episodes duration status format
      season seasonYear startDate { year month day }
      genres tags { name rank isMediaSpoiler }
      studios { nodes { id name isAnimationStudio } }
      source countryOfOrigin
      trailer { id site }
      externalLinks { url site color icon }
      relations { edges {
        relationType(version: 2)
        node { id title { romaji english } coverImage { large medium color } format status type }
      }}
      characters(sort: ROLE, perPage: 12) { edges {
        node { id name { full } image { medium } }
        voiceActors(language: JAPANESE) { id name { full } image { medium } }
      }}
      recommendations(sort: RATING_DESC, perPage: 14) { nodes {
        mediaRecommendation {
          id title { romaji english }
          coverImage { large medium color }
          averageScore format status
        }
      }}
    }
  }
`;

async function getAnime(id: string) {
  try {
    const res = await fetch("https://graphql.anilist.co", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query: ANIME_QUERY, variables: { id: parseInt(id) } }),
      next: { revalidate: 3600 },
    });
    return (await res.json())?.data?.Media ?? null;
  } catch { return null; }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const anime = await getAnime(id);
  if (!anime) return { title: "Anime | Soraku Stream" };
  const title = anime.title.english || anime.title.romaji;
  return {
    title: `${title} | Soraku Stream`,
    description: `Info, jadwal, dan streaming ${title} di Soraku Stream.`,
  };
}

export default async function AnimePage({ params }: PageProps) {
  const { id } = await params;
  const anime = await getAnime(id);
  if (!anime) notFound();

  const title = anime.title.english || anime.title.romaji;
  const score = anime.averageScore ? (anime.averageScore / 10).toFixed(1) : null;
  const trailer = anime.trailer?.site === "youtube" ? anime.trailer.id : null;
  const studio = anime.studios?.nodes?.find((s: { isAnimationStudio: boolean }) => s.isAnimationStudio)?.name
    ?? anime.studios?.nodes?.[0]?.name;
  const statusLabel = anime.status === "RELEASING" ? "Sedang Tayang"
    : anime.status === "FINISHED" ? "Selesai"
    : anime.status === "NOT_YET_RELEASED" ? "Belum Tayang"
    : anime.status?.replace(/_/g, " ");

  return (
    <div>
      {/* ── Cinematic Banner ── */}
      <div className="relative w-full" style={{ height: "clamp(240px, 32vw, 400px)" }}>
        {anime.bannerImage ? (
          <Image src={anime.bannerImage} alt={title} fill priority sizes="100vw" className="object-cover" />
        ) : (
          <div className="w-full h-full" style={{ backgroundColor: anime.coverImage?.color ?? "var(--bg-card)" }} />
        )}
        {/* Cinematic gradient */}
        <div
          className="absolute inset-0"
          style={{
            background: "linear-gradient(to bottom, rgba(9,9,12,0.1) 0%, rgba(9,9,12,0.55) 65%, var(--bg-primary) 100%)",
          }}
        />
        {/* Accent color tint */}
        {anime.coverImage?.color && (
          <div
            className="absolute inset-0 opacity-15"
            style={{ background: `radial-gradient(ellipse at 30% 100%, ${anime.coverImage.color}66, transparent 65%)` }}
          />
        )}
      </div>

      {/* ── Main content ── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Cover + header info row */}
        <div className="flex gap-5 sm:gap-7 -mt-16 sm:-mt-20 mb-7 relative z-10">
          {/* Cover image — glass shadow */}
          <div className="shrink-0">
            <div
              className="relative overflow-hidden rounded-2xl shadow-2xl"
              style={{
                width: "clamp(88px, 14vw, 140px)",
                aspectRatio: "2/3",
                boxShadow: `0 12px 40px rgba(0,0,0,0.65), 0 0 0 1px rgba(255,255,255,0.08)`,
              }}
            >
              <Image
                src={anime.coverImage.extraLarge || anime.coverImage.large}
                alt={title}
                fill
                className="object-cover"
              />
            </div>
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0 pt-2">
            {/* Badges row */}
            <div className="flex flex-wrap items-center gap-1.5 mb-3">
              {anime.format && <span className="soraku-badge">{anime.format}</span>}
              {statusLabel && (
                <span className={`soraku-badge ${anime.status === "RELEASING" ? "soraku-badge-live" : "soraku-badge-accent"}`}>
                  {statusLabel}
                </span>
              )}
              {anime.seasonYear && <span className="soraku-badge">{anime.seasonYear}</span>}
              {score && (
                <span className="soraku-badge flex items-center gap-1">
                  <Star size={9} fill="#facc15" stroke="none" />
                  <span style={{ color: "#facc15" }}>{score}</span>
                </span>
              )}
            </div>

            <h1
              className="text-xl sm:text-2xl font-900 leading-tight mb-1 line-clamp-2"
              style={{ fontFamily: "var(--font-display)", fontWeight: 900, color: "var(--text-primary)", letterSpacing: "-0.03em" }}
            >
              {title}
            </h1>
            {anime.title.romaji !== title && (
              <p className="text-xs mb-3" style={{ color: "var(--text-muted)" }}>{anime.title.romaji}</p>
            )}

            {/* Action buttons */}
            <div className="flex flex-wrap items-center gap-2 mt-3">
              <Link
                href={`/watch/${anime.id}`}
                className="flex items-center gap-2 px-5 py-2.5 rounded-full font-700 text-sm transition-all hover:scale-105 active:scale-95"
                style={{
                  fontFamily: "var(--font-display)",
                  fontWeight: 700,
                  backgroundColor: "var(--accent)",
                  color: "#fff",
                  boxShadow: "0 4px 20px rgba(var(--accent-rgb),0.45)",
                }}
              >
                <Play size={14} fill="white" stroke="none" />
                TONTON
              </Link>

              <button
                className="flex items-center gap-1.5 px-4 py-2.5 rounded-full font-700 text-sm transition-all hover:scale-105"
                style={{
                  fontFamily: "var(--font-display)",
                  fontWeight: 700,
                  background: "var(--glass-bg)",
                  backdropFilter: "blur(10px)",
                  border: "1px solid var(--glass-border)",
                  color: "var(--text-secondary)",
                }}
              >
                <Plus size={14} />
                Daftar
              </button>

              {anime.id && (
                <Link href={`https://anilist.co/anime/${anime.id}`} target="_blank" rel="noopener noreferrer"
                  className="px-3 py-2.5 rounded-full font-900 text-xs hover:scale-105 transition-transform"
                  style={{ backgroundColor: "#02a9ff", color: "#fff", fontFamily: "var(--font-display)", fontWeight: 900 }}
                >A.</Link>
              )}
              {anime.idMal && (
                <Link href={`https://myanimelist.net/anime/${anime.idMal}`} target="_blank" rel="noopener noreferrer"
                  className="px-3 py-2.5 rounded-full font-900 text-xs hover:scale-105 transition-transform"
                  style={{ backgroundColor: "#2e51a2", color: "#fff", fontFamily: "var(--font-display)", fontWeight: 900 }}
                >MAL</Link>
              )}
            </div>
          </div>
        </div>

        {/* Stats glass grid */}
        <div className="grid grid-cols-3 sm:grid-cols-5 gap-2.5 mb-8">
          {[
            { label: "Episode", value: anime.episodes ?? "?" },
            { label: "Durasi", value: anime.duration ? `${anime.duration}m` : "?" },
            { label: "Musim", value: anime.season ?? "?" },
            { label: "Studio", value: studio ?? "?" },
            { label: "Negara", value: anime.countryOfOrigin ?? "?" },
          ].map(({ label, value }) => (
            <div
              key={label}
              className="flex flex-col gap-1 p-3 rounded-xl"
              style={{
                background: "var(--glass-bg)",
                backdropFilter: "blur(12px)",
                WebkitBackdropFilter: "blur(12px)",
                border: "1px solid var(--glass-border)",
                boxShadow: "var(--shadow-card)",
              }}
            >
              <span
                className="text-[0.62rem] uppercase tracking-wider font-700"
                style={{ color: "var(--text-muted)", fontFamily: "var(--font-display)", fontWeight: 700 }}
              >
                {label}
              </span>
              <span
                className="text-sm font-600 truncate"
                style={{ color: "var(--text-primary)", fontFamily: "var(--font-display)", fontWeight: 600 }}
              >
                {value}
              </span>
            </div>
          ))}
        </div>

        {/* Tab content */}
        <AnimeInfoClient anime={anime} trailer={trailer} title={title} />
      </div>
    </div>
  );
}
