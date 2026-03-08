import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { AnimeInfoClient } from "./AnimeInfoClient";

interface PageProps { params: Promise<{ id: string }>; }

const ANIME_QUERY = `
  query ($id: Int) {
    Media(id: $id, type: ANIME) {
      id idMal
      title { romaji english native }
      coverImage { large extraLarge color }
      bannerImage
      description(asHtml: false)
      averageScore meanScore popularity favourites
      episodes duration status format
      season seasonYear startDate { year month day } endDate { year month day }
      genres tags { name rank isMediaSpoiler }
      studios { nodes { id name isAnimationStudio } }
      source countryOfOrigin
      trailer { id site }
      externalLinks { url site color icon }
      relations { edges {
        relationType(version: 2)
        node {
          id title { romaji english }
          coverImage { large medium color }
          format status averageScore
          type
        }
      }}
      characters(sort: ROLE, perPage: 8) { edges {
        role
        node { id name { full } image { medium } }
        voiceActors(language: JAPANESE) { id name { full } image { medium } }
      }}
      recommendations(sort: RATING_DESC, perPage: 8) { nodes {
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
    const json = await res.json();
    return json?.data?.Media ?? null;
  } catch { return null; }
}

export default async function AnimePage({ params }: PageProps) {
  const { id } = await params;
  const anime = await getAnime(id);
  if (!anime) notFound();

  const title = anime.title.english || anime.title.romaji;
  const score = anime.averageScore ? (anime.averageScore / 10).toFixed(1) : null;
  const trailer = anime.trailer?.site === "youtube" ? anime.trailer.id : null;
  const studio = anime.studios?.nodes?.find((s: { isAnimationStudio: boolean; name: string }) => s.isAnimationStudio)?.name
    ?? anime.studios?.nodes?.[0]?.name;

  const startYear = anime.startDate?.year;
  const statusLabel = anime.status === "RELEASING" ? "Airing"
    : anime.status === "FINISHED" ? "Finished"
    : anime.status === "NOT_YET_RELEASED" ? "Upcoming"
    : anime.status?.replace(/_/g, " ");

  return (
    <div>
      {/* ── Banner + Cover overlay ── */}
      <div className="relative w-full" style={{ height: "clamp(220px, 30vw, 380px)" }}>
        {anime.bannerImage ? (
          <Image
            src={anime.bannerImage}
            alt={title}
            fill priority
            sizes="100vw"
            className="object-cover"
          />
        ) : (
          <div className="w-full h-full"
            style={{ backgroundColor: anime.coverImage?.color ?? "var(--bg-card)" }} />
        )}
        {/* Dark overlay */}
        <div className="absolute inset-0"
          style={{ background: "linear-gradient(to bottom, rgba(0,0,0,0.1) 0%, rgba(10,10,12,0.7) 70%, var(--bg-primary) 100%)" }} />
      </div>

      {/* ── Info section ── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex gap-5 -mt-20 relative z-10 mb-6">
          {/* Cover image */}
          <div className="relative shrink-0 overflow-hidden rounded-xl shadow-2xl"
            style={{ width: "clamp(100px, 14vw, 160px)", height: "clamp(140px, 20vw, 225px)" }}>
            <Image
              src={anime.coverImage?.extraLarge ?? anime.coverImage?.large ?? "/soraku-logo.png"}
              alt={title}
              fill
              sizes="160px"
              className="object-cover"
              style={{ backgroundColor: anime.coverImage?.color ?? "var(--bg-hover)" }}
            />
          </div>

          {/* Title + meta */}
          <div className="flex flex-col justify-end pb-1 min-w-0">
            {/* Badge pills */}
            <div className="flex flex-wrap gap-1.5 mb-2">
              {anime.format && (
                <span className="px-2.5 py-1 rounded-full text-xs font-bold"
                  style={{ backgroundColor: "var(--bg-card)", border: "1px solid var(--border)", color: "var(--text-secondary)", fontFamily: "var(--font-display)" }}>
                  {anime.format}
                </span>
              )}
              {startYear && (
                <span className="px-2.5 py-1 rounded-full text-xs font-bold"
                  style={{ backgroundColor: "var(--bg-card)", border: "1px solid var(--border)", color: "var(--text-secondary)", fontFamily: "var(--font-display)" }}>
                  {startYear}
                </span>
              )}
              {statusLabel && (
                <span className="px-2.5 py-1 rounded-full text-xs font-bold"
                  style={{
                    backgroundColor: anime.status === "RELEASING" ? "rgba(34,197,94,0.15)" : "var(--bg-card)",
                    border: `1px solid ${anime.status === "RELEASING" ? "rgba(34,197,94,0.4)" : "var(--border)"}`,
                    color: anime.status === "RELEASING" ? "#4ade80" : "var(--text-secondary)",
                    fontFamily: "var(--font-display)",
                  }}>
                  {statusLabel}
                </span>
              )}
              {score && (
                <span className="px-2.5 py-1 rounded-full text-xs font-bold"
                  style={{
                    backgroundColor: "rgba(var(--accent-rgb),0.15)",
                    border: "1px solid rgba(var(--accent-rgb),0.4)",
                    color: "var(--accent)",
                    fontFamily: "var(--font-display)",
                  }}>
                  {score}
                </span>
              )}
            </div>

            <h1 className="text-xl sm:text-2xl font-black leading-tight mb-1 line-clamp-2"
              style={{ fontFamily: "var(--font-display)", color: "var(--text-primary)", letterSpacing: "-0.03em" }}>
              {title}
            </h1>
            {anime.title.romaji !== title && (
              <p className="text-xs mb-1" style={{ color: "var(--text-muted)", fontFamily: "var(--font-body)" }}>
                {anime.title.romaji}
              </p>
            )}
          </div>
        </div>

        {/* ── Action buttons ── */}
        <div className="flex flex-wrap items-center gap-2 mb-6">
          <Link href={`/watch/${anime.id}`}
            className="flex items-center gap-2 px-5 py-2.5 rounded-full font-bold text-sm transition-all hover:scale-105 active:scale-95"
            style={{
              backgroundColor: "var(--accent)",
              color: "#fff",
              fontFamily: "var(--font-display)",
              boxShadow: "0 4px 15px rgba(var(--accent-rgb),0.4)",
            }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>
            WATCH
          </Link>

          <button
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-full font-bold text-sm transition-all hover:scale-105"
            style={{
              backgroundColor: "var(--bg-card)",
              border: "1px solid var(--border)",
              color: "var(--text-secondary)",
              fontFamily: "var(--font-display)",
            }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M12 5v14M5 12h14"/></svg>
            Add to List
          </button>

          {/* AniList link */}
          {anime.idMal && (
            <Link href={`https://anilist.co/anime/${anime.id}`} target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-3 py-2.5 rounded-full font-black text-xs transition-all hover:scale-105"
              style={{
                backgroundColor: "#02a9ff",
                color: "#fff",
                fontFamily: "var(--font-display)",
                letterSpacing: "0.02em",
              }}>
              A.
            </Link>
          )}

          {/* MAL link */}
          {anime.idMal && (
            <Link href={`https://myanimelist.net/anime/${anime.idMal}`} target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-3 py-2.5 rounded-full font-black text-xs transition-all hover:scale-105"
              style={{
                backgroundColor: "#2e51a2",
                color: "#fff",
                fontFamily: "var(--font-display)",
                letterSpacing: "0.02em",
              }}>
              MAL
            </Link>
          )}
        </div>

        {/* ── Stats grid ── */}
        <div className="grid grid-cols-3 sm:grid-cols-5 gap-3 mb-6">
          {[
            { label: "Episodes", value: anime.episodes ? `${anime.episodes}` : "?" },
            { label: "Duration",  value: anime.duration ? `${anime.duration} min` : "?" },
            { label: "Season",    value: anime.season ? `${anime.season}` : "?" },
            { label: "Studio",    value: studio ?? "?" },
            { label: "Country",   value: anime.countryOfOrigin ?? "?" },
          ].map(({ label, value }) => (
            <div key={label} className="flex flex-col gap-0.5 p-3 rounded-xl"
              style={{ backgroundColor: "var(--bg-card)", border: "1px solid var(--border)" }}>
              <span className="text-[0.65rem] uppercase tracking-wider font-bold"
                style={{ color: "var(--text-muted)", fontFamily: "var(--font-display)" }}>
                {label}
              </span>
              <span className="text-sm font-semibold truncate"
                style={{ color: "var(--text-primary)", fontFamily: "var(--font-body)" }}>
                {value}
              </span>
            </div>
          ))}
        </div>

        {/* ── Tab content (client) ── */}
        <AnimeInfoClient
          anime={anime}
          trailer={trailer}
          title={title}
        />
      </div>
    </div>
  );
}
