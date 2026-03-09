"use client";

import React from "react";
"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Play, Star, ChevronDown, ChevronUp } from "lucide-react";
import { cn } from "@/lib/utils";

type Tab = "Overview" | "Karakter" | "Artwork";

interface Props {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  anime: any;
  trailer: string | null;
  title: string;
}

export function AnimeInfoClient({ anime, trailer, title }: Props) {
  const [activeTab,    setActiveTab]    = useState<Tab>("Overview");
  const [showFullDesc, setShowFullDesc] = useState(false);

  const genres: string[]    = anime.genres ?? [];
  const characters           = anime.characters?.edges ?? [];
  const relations            = (anime.relations?.edges ?? []).filter(
    (e: { node: { type: string } }) => e.node.type === "ANIME"
  );
  const recommendations      = (anime.recommendations?.nodes ?? []).filter(
    (n: { mediaRecommendation: unknown }) => n.mediaRecommendation
  );
  const artworks: string[]   = [
    anime.bannerImage,
    anime.coverImage?.extraLarge,
    ...(characters.slice(0, 8).map(
      (e: { node: { image: { medium: string } } }) => e.node.image?.medium
    )),
  ].filter(Boolean);

  const infoRows = [
    { label: "Format",  value: anime.format ?? "—" },
    { label: "Status",  value: anime.status === "RELEASING" ? "Sedang Tayang"
                             : anime.status === "FINISHED"   ? "Selesai"
                             : anime.status ?? "—" },
    { label: "Musim",   value: anime.season ? `${anime.season} ${anime.seasonYear}` : (anime.seasonYear ?? "—") },
    { label: "Durasi",  value: anime.duration ? `${anime.duration} menit` : "—" },
    { label: "Studio",  value: anime.studios?.nodes?.find((s: { isAnimationStudio: boolean }) => s.isAnimationStudio)?.name
                             ?? anime.studios?.nodes?.[0]?.name ?? "—" },
    { label: "Sumber",  value: anime.source?.replace(/_/g, " ") ?? "—" },
  ];

  return (
    <div className="flex flex-col lg:flex-row gap-8 pb-16">
      {/* ── Left/main content ── */}
      <div className="flex-1 min-w-0">

        {/* Tab bar */}
        <div
          className="flex items-center gap-0 mb-7 overflow-x-auto"
          style={{ borderBottom: "1px solid var(--border)" }}
        >
          {(["Overview", "Karakter", "Artwork"] as Tab[]).map((t) => (
            <button
              key={t}
              onClick={() => setActiveTab(t)}
              className="relative px-5 py-3 text-sm font-700 transition-all shrink-0"
              style={{
                fontFamily: "var(--font-display)", fontWeight: 700,
                color: activeTab === t ? "var(--text-primary)" : "var(--text-muted)",
                borderBottom: activeTab === t ? "2px solid var(--accent)" : "2px solid transparent",
                marginBottom: "-1px",
              }}
            >
              {t}
            </button>
          ))}
        </div>

        {/* ── OVERVIEW ── */}
        {activeTab === "Overview" && (
          <div className="space-y-8">

            {/* Synopsis */}
            {anime.description && (
              <div>
                <h2 className="soraku-section-title text-sm mb-3">Sinopsis</h2>
                <div
                  className={cn(
                    "text-sm leading-relaxed transition-all overflow-hidden",
                    !showFullDesc ? "line-clamp-4" : ""
                  )}
                  style={{ color: "var(--text-secondary)" }}
                  dangerouslySetInnerHTML={{ __html: anime.description }}
                />
                <button
                  onClick={() => setShowFullDesc((v) => !v)}
                  className="flex items-center gap-1 text-xs mt-2 font-600 hover:underline"
                  style={{ fontFamily: "var(--font-display)", fontWeight: 600, color: "var(--accent)" }}
                >
                  {showFullDesc
                    ? <><ChevronUp size={12} />Lebih sedikit</>
                    : <><ChevronDown size={12} />Selengkapnya</>
                  }
                </button>
              </div>
            )}

            {/* Genres */}
            {genres.length > 0 && (
              <div>
                <h2 className="soraku-section-title text-sm mb-3">Genre</h2>
                <div className="flex flex-wrap gap-2">
                  {genres.map((g) => (
                    <span key={g} className="soraku-badge soraku-badge-accent">{g}</span>
                  ))}
                </div>
              </div>
            )}

            {/* Trailer */}
            {trailer && (
              <div>
                <h2 className="soraku-section-title text-sm mb-3">Trailer</h2>
                <div
                  className="overflow-hidden"
                  style={{ aspectRatio: "16/9", borderRadius: "var(--radius-xl)" }}
                >
                  <iframe
                    src={`https://www.youtube-nocookie.com/embed/${trailer}`}
                    title={`${title} Trailer`}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="w-full h-full"
                  />
                </div>
              </div>
            )}

            {/* Relations */}
            {relations.length > 0 && (
              <div>
                <h2 className="soraku-section-title text-sm mb-3">Anime Terkait</h2>
                <div className="scroll-row">
                  {relations.slice(0, 8).map((r: {
                    relationType: string;
                    node: {
                      id: number;
                      title: { romaji: string; english?: string };
                      coverImage: { medium: string; large?: string };
                      format?: string;
                    };
                  }) => (
                    <Link
                      key={r.node.id}
                      href={`/anime/${r.node.id}`}
                      className="group shrink-0 w-28"
                    >
                      <div
                        className="relative overflow-hidden mb-2"
                        style={{ width: "100%", aspectRatio: "2/3", borderRadius: "var(--radius)" }}
                      >
                        <Image
                          src={r.node.coverImage.large ?? r.node.coverImage.medium}
                          alt={r.node.title.english ?? r.node.title.romaji}
                          fill className="object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                      <p
                        className="text-[0.68rem] font-600 line-clamp-2 leading-snug group-hover:text-[var(--accent)] transition-colors"
                        style={{ fontFamily: "var(--font-display)", fontWeight: 600, color: "var(--text-primary)" }}
                      >
                        {r.node.title.english ?? r.node.title.romaji}
                      </p>
                      <p className="text-[0.6rem] mt-0.5" style={{ color: "var(--text-muted)" }}>
                        {r.relationType.replace(/_/g, " ")}
                      </p>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Recommendations */}
            {recommendations.length > 0 && (
              <div>
                <h2 className="soraku-section-title text-sm mb-3">Rekomendasi</h2>
                <div className="grid grid-cols-3 sm:grid-cols-5 md:grid-cols-6 lg:grid-cols-5 xl:grid-cols-6 gap-3">
                  {recommendations.slice(0, 12).map((n: {
                    mediaRecommendation: {
                      id: number;
                      title: { romaji: string; english?: string };
                      coverImage: { large?: string; medium?: string };
                      averageScore?: number;
                    };
                  }) => {
                    const rec = n.mediaRecommendation;
                    const recTitle = rec.title.english ?? rec.title.romaji;
                    const recImg = rec.coverImage.large ?? rec.coverImage.medium;
                    const recScore = rec.averageScore ? (rec.averageScore / 10).toFixed(1) : null;
                    return (
                      <Link key={rec.id} href={`/anime/${rec.id}`} className="group">
                        <div
                          className="relative overflow-hidden mb-1.5"
                          style={{ aspectRatio: "2/3", borderRadius: "var(--radius)" }}
                        >
                          {recImg && (
                            <Image src={recImg} alt={recTitle} fill
                              className="object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                          )}
                          {recScore && (
                            <div
                              className="absolute top-1.5 left-1.5 flex items-center gap-0.5 px-1.5 py-0.5"
                              style={{ borderRadius: "6px", background: "rgba(0,0,0,0.7)" }}
                            >
                              <Star size={8} fill="#facc15" stroke="none" />
                              <span className="text-[0.58rem] font-700" style={{ color: "#facc15", fontFamily: "var(--font-display)" }}>
                                {recScore}
                              </span>
                            </div>
                          )}
                        </div>
                        <p
                          className="text-[0.7rem] font-600 line-clamp-2 leading-snug group-hover:text-[var(--accent)] transition-colors"
                          style={{ fontFamily: "var(--font-display)", fontWeight: 600, color: "var(--text-primary)" }}
                        >
                          {recTitle}
                        </p>
                      </Link>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        )}

        {/* ── KARAKTER ── */}
        {activeTab === "Karakter" && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {characters.slice(0, 16).map((edge: {
              node: { id: number; name: { full: string }; image: { medium: string } };
              voiceActors: { id: number; name: { full: string }; image: { medium: string } }[];
            }) => {
              const char = edge.node;
              const va   = edge.voiceActors?.[0];
              return (
                <div
                  key={char.id}
                  className="flex items-center justify-between gap-3 p-3 rounded-2xl"
                  style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}
                >
                  {/* Character */}
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="shrink-0 relative w-10 h-10 rounded-full overflow-hidden">
                      <Image src={char.image.medium} alt={char.name.full} fill className="object-cover" />
                    </div>
                    <p
                      className="text-xs font-700 line-clamp-2 leading-snug"
                      style={{ fontFamily: "var(--font-display)", fontWeight: 700, color: "var(--text-primary)" }}
                    >
                      {char.name.full}
                    </p>
                  </div>

                  {/* Voice actor */}
                  {va && (
                    <div className="flex items-center gap-2.5 min-w-0 flex-row-reverse">
                      <div className="shrink-0 relative w-10 h-10 rounded-full overflow-hidden">
                        <Image src={va.image.medium} alt={va.name.full} fill className="object-cover" />
                      </div>
                      <p
                        className="text-xs font-600 line-clamp-2 leading-snug text-right"
                        style={{ fontFamily: "var(--font-display)", fontWeight: 600, color: "var(--text-secondary)" }}
                      >
                        {va.name.full}
                      </p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* ── ARTWORK ── */}
        {activeTab === "Artwork" && (
          <div className="columns-2 sm:columns-3 md:columns-4 gap-3 space-y-3">
            {artworks.map((src, i) => (
              <div key={i} className="relative w-full overflow-hidden" style={{ borderRadius: "var(--radius)" }}>
                <Image
                  src={src}
                  alt={`Artwork ${i + 1}`}
                  width={400}
                  height={i % 3 === 0 ? 600 : 400}
                  className="w-full h-auto object-cover"
                />
              </div>
            ))}
            {artworks.length === 0 && (
              <p className="col-span-full text-sm text-center py-8" style={{ color: "var(--text-muted)" }}>
                Tidak ada artwork tersedia.
              </p>
            )}
          </div>
        )}
      </div>

      {/* ── Right sidebar ── */}
      <aside className="lg:w-56 xl:w-64 shrink-0">
        <div
          className="rounded-2xl overflow-hidden sticky top-20"
          style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}
        >
          <div className="p-4" style={{ borderBottom: "1px solid var(--border)" }}>
            <p
              className="text-xs font-800 uppercase tracking-widest mb-0"
              style={{ fontFamily: "var(--font-display)", fontWeight: 800, color: "var(--text-muted)" }}
            >
              Info
            </p>
          </div>
          <div className="divide-y" style={{ borderTopWidth: "1px", borderBottomWidth: "1px" }}>
            {infoRows.map(({ label, value }) => (
              <div key={label} className="flex flex-col gap-0.5 px-4 py-3">
                <span
                  className="text-[0.6rem] uppercase tracking-wider font-700"
                  style={{ fontFamily: "var(--font-display)", fontWeight: 700, color: "var(--text-muted)" }}
                >
                  {label}
                </span>
                <span
                  className="text-xs font-600"
                  style={{ fontFamily: "var(--font-display)", fontWeight: 600, color: "var(--text-primary)" }}
                >
                  {value}
                </span>
              </div>
            ))}
          </div>

          {/* Tags */}
          {anime.tags && anime.tags.length > 0 && (
            <div className="px-4 py-3" style={{ borderTop: "1px solid var(--border)" }}>
              <p
                className="text-[0.6rem] uppercase tracking-wider font-700 mb-2"
                style={{ fontFamily: "var(--font-display)", fontWeight: 700, color: "var(--text-muted)" }}
              >
                Tag
              </p>
              <div className="flex flex-wrap gap-1">
                {anime.tags.slice(0, 8).map((tag: { name: string; rank: number }) => (
                  <span
                    key={tag.name}
                    className="text-[0.58rem] px-1.5 py-0.5 rounded-full font-600"
                    style={{
                      fontFamily: "var(--font-display)", fontWeight: 600,
                      background: "var(--bg-hover)",
                      color: "var(--text-muted)",
                    }}
                  >
                    {tag.name}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Watch CTA */}
          <div className="p-4" style={{ borderTop: "1px solid var(--border)" }}>
            <Link
              href={`/watch/${anime.id}`}
              className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl text-sm font-700 transition-all hover:scale-105"
              style={{
                fontFamily: "var(--font-display)", fontWeight: 700,
                background: "var(--accent)", color: "#fff",
                boxShadow: "0 4px 16px rgba(var(--accent-rgb),0.35)",
              }}
            >
              <Play size={14} fill="white" stroke="none" />
              Tonton
            </Link>
          </div>
        </div>
      </aside>
    </div>
  );
}
