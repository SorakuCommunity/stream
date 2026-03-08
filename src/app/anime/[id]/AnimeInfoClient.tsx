"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Play, Star } from "lucide-react";
import { cn } from "@/lib/utils";

type Tab = "Overview" | "Characters" | "Artwork" | "Episodes";

interface Props {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  anime:   any;
  trailer: string | null;
  title:   string;
}

export function AnimeInfoClient({ anime, trailer, title }: Props) {
  const [activeTab, setActiveTab] = useState<Tab>("Overview");

  const genres: string[]    = anime.genres ?? [];
  const tags: { name: string; rank: number; isMediaSpoiler: boolean }[] = (anime.tags ?? []).filter((t: { isMediaSpoiler: boolean }) => !t.isMediaSpoiler).slice(0, 12);
  const characters          = anime.characters?.edges ?? [];
  const relations           = anime.relations?.edges?.filter((e: { node: { type: string } }) => e.node.type === "ANIME") ?? [];
  const recommendations     = anime.recommendations?.nodes?.filter((n: { mediaRecommendation: unknown }) => n.mediaRecommendation) ?? [];
  const artworks: string[]  = [
    anime.bannerImage,
    anime.coverImage?.extraLarge,
    ...(anime.characters?.edges?.slice(0, 6).map((e: { node: { image: { medium: string } } }) => e.node.image?.medium) ?? []),
  ].filter(Boolean);

  return (
    <div>
      {/* ── Tab bar ── */}
      <div className="flex items-center gap-0 mb-6 border-b" style={{ borderColor: "var(--border)" }}>
        {(["Overview", "Characters", "Artwork", "Episodes"] as Tab[]).map((tab) => (
          <button key={tab} onClick={() => setActiveTab(tab)}
            className="px-5 py-3 text-sm font-bold transition-all relative"
            style={{
              fontFamily: "var(--font-display)",
              color: activeTab === tab ? "var(--text-primary)" : "var(--text-muted)",
              borderBottom: activeTab === tab ? "2px solid var(--accent)" : "2px solid transparent",
              marginBottom: "-1px",
            }}>
            {tab}
          </button>
        ))}
      </div>

      {/* ── OVERVIEW ── */}
      {activeTab === "Overview" && (
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left: description + trailer */}
          <div className="flex-1 min-w-0">
            {anime.description && (
              <div className="mb-6">
                <h2 className="text-sm font-bold uppercase tracking-wider mb-3"
                  style={{ color: "var(--text-muted)", fontFamily: "var(--font-display)" }}>
                  Sinopsis
                </h2>
                <p className="text-sm leading-relaxed"
                  style={{ color: "var(--text-secondary)", fontFamily: "var(--font-body)" }}>
                  {anime.description.replace(/<[^>]+>/g, "")}
                </p>
              </div>
            )}

            {/* YouTube trailer */}
            {trailer && (
              <div className="mb-6">
                <h2 className="text-sm font-bold uppercase tracking-wider mb-3"
                  style={{ color: "var(--text-muted)", fontFamily: "var(--font-display)" }}>
                  Trailer
                </h2>
                <div className="relative overflow-hidden rounded-xl" style={{ aspectRatio: "16/9" }}>
                  <iframe
                    src={`https://www.youtube-nocookie.com/embed/${trailer}`}
                    title={`${title} Trailer`}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="absolute inset-0 w-full h-full"
                  />
                </div>
              </div>
            )}

            {/* Relations */}
            {relations.length > 0 && (
              <div className="mb-6">
                <h2 className="text-sm font-bold uppercase tracking-wider mb-3"
                  style={{ color: "var(--text-muted)", fontFamily: "var(--font-display)" }}>
                  Related
                </h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {relations.slice(0, 6).map((edge: { relationType: string; node: { id: number; title: { english?: string; romaji: string }; coverImage: { medium: string; color?: string }; format?: string; status?: string; averageScore?: number } }) => (
                    <Link key={edge.node.id} href={`/anime/${edge.node.id}`}
                      className="flex items-center gap-2.5 p-2.5 rounded-xl transition-all hover:scale-[1.02]"
                      style={{ backgroundColor: "var(--bg-card)", border: "1px solid var(--border)" }}>
                      <div className="relative w-10 h-14 shrink-0 rounded-lg overflow-hidden">
                        <Image src={edge.node.coverImage.medium} alt="" fill sizes="40px" className="object-cover"
                          style={{ backgroundColor: edge.node.coverImage.color ?? "var(--bg-hover)" }} />
                      </div>
                      <div className="min-w-0">
                        <p className="text-[0.65rem] font-bold uppercase tracking-wider mb-0.5"
                          style={{ color: "var(--accent)", fontFamily: "var(--font-display)" }}>
                          {edge.relationType.replace(/_/g, " ")}
                        </p>
                        <p className="text-xs font-semibold line-clamp-2"
                          style={{ color: "var(--text-secondary)", fontFamily: "var(--font-body)" }}>
                          {edge.node.title.english || edge.node.title.romaji}
                        </p>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right: genres + tags + stats */}
          <div className="lg:w-56 shrink-0 flex flex-col gap-4">
            {genres.length > 0 && (
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider mb-2"
                  style={{ color: "var(--text-muted)", fontFamily: "var(--font-display)" }}>
                  Genre
                </h3>
                <div className="flex flex-wrap gap-1.5">
                  {genres.map((g) => (
                    <Link key={g} href={`/search?genre=${encodeURIComponent(g)}`}
                      className="px-3 py-1 rounded-full text-xs font-semibold transition-all hover:scale-105"
                      style={{
                        backgroundColor: "var(--bg-hover)",
                        border: "1px solid var(--border)",
                        color: "var(--text-secondary)",
                        fontFamily: "var(--font-display)",
                      }}>
                      {g}
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {tags.length > 0 && (
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider mb-2"
                  style={{ color: "var(--text-muted)", fontFamily: "var(--font-display)" }}>
                  Tags
                </h3>
                <div className="flex flex-col gap-1">
                  {tags.map((tag) => (
                    <div key={tag.name} className="flex items-center justify-between">
                      <span className="text-xs truncate mr-2"
                        style={{ color: "var(--text-secondary)", fontFamily: "var(--font-body)" }}>
                        {tag.name}
                      </span>
                      <span className="text-[0.65rem] shrink-0 font-bold"
                        style={{ color: "var(--text-muted)", fontFamily: "var(--font-display)" }}>
                        {tag.rank}%
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Score stats */}
            {(anime.averageScore || anime.popularity) && (
              <div className="p-3 rounded-xl" style={{ backgroundColor: "var(--bg-card)", border: "1px solid var(--border)" }}>
                {anime.averageScore && (
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs" style={{ color: "var(--text-muted)", fontFamily: "var(--font-display)" }}>Score</span>
                    <span className="flex items-center gap-1 text-sm font-black"
                      style={{ color: "var(--accent)", fontFamily: "var(--font-display)" }}>
                      <Star size={11} fill="currentColor" /> {(anime.averageScore / 10).toFixed(1)}
                    </span>
                  </div>
                )}
                {anime.popularity && (
                  <div className="flex items-center justify-between">
                    <span className="text-xs" style={{ color: "var(--text-muted)", fontFamily: "var(--font-display)" }}>Popularity</span>
                    <span className="text-sm font-bold"
                      style={{ color: "var(--text-secondary)", fontFamily: "var(--font-display)" }}>
                      #{anime.popularity.toLocaleString()}
                    </span>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── CHARACTERS ── */}
      {activeTab === "Characters" && (
        <div>
          {characters.length === 0 ? (
            <p className="text-center py-16 text-sm" style={{ color: "var(--text-muted)" }}>Tidak ada data karakter.</p>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {characters.map((edge: {
                role: string;
                node: { id: number; name: { full: string }; image: { medium: string } };
                voiceActors: { id: number; name: { full: string }; image: { medium: string } }[];
              }) => {
                const va = edge.voiceActors?.[0];
                return (
                  <div key={edge.node.id} className="flex gap-2 p-2.5 rounded-xl"
                    style={{ backgroundColor: "var(--bg-card)", border: "1px solid var(--border)" }}>
                    {/* Character */}
                    <div className="flex flex-col items-center gap-1 flex-1">
                      <div className="relative w-12 h-16 rounded-lg overflow-hidden">
                        <Image src={edge.node.image.medium} alt={edge.node.name.full} fill sizes="48px" className="object-cover"
                          style={{ backgroundColor: "var(--bg-hover)" }} />
                      </div>
                      <p className="text-[0.65rem] text-center line-clamp-2 font-semibold"
                        style={{ color: "var(--text-secondary)", fontFamily: "var(--font-body)" }}>
                        {edge.node.name.full}
                      </p>
                      <span className="text-[0.6rem] uppercase font-bold"
                        style={{ color: "var(--text-muted)", fontFamily: "var(--font-display)" }}>
                        {edge.role}
                      </span>
                    </div>

                    {/* Voice actor */}
                    {va && (
                      <div className="flex flex-col items-center gap-1 flex-1">
                        <div className="relative w-12 h-16 rounded-lg overflow-hidden">
                          <Image src={va.image.medium} alt={va.name.full} fill sizes="48px" className="object-cover"
                            style={{ backgroundColor: "var(--bg-hover)" }} />
                        </div>
                        <p className="text-[0.65rem] text-center line-clamp-2 font-semibold"
                          style={{ color: "var(--text-secondary)", fontFamily: "var(--font-body)" }}>
                          {va.name.full}
                        </p>
                        <span className="text-[0.6rem] font-bold"
                          style={{ color: "var(--text-muted)", fontFamily: "var(--font-display)" }}>
                          JP VA
                        </span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* ── ARTWORK ── */}
      {activeTab === "Artwork" && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {artworks.map((src, i) => (
            <div key={i} className="relative overflow-hidden rounded-xl group cursor-pointer"
              style={{ aspectRatio: i === 0 ? "16/9" : "3/4", ...(i === 0 ? { gridColumn: "span 2" } : {}) }}>
              <Image src={src} alt="" fill sizes="400px" className="object-cover transition-transform duration-300 group-hover:scale-105"
                style={{ backgroundColor: "var(--bg-hover)" }} />
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
                style={{ backgroundColor: "rgba(0,0,0,0.4)" }}>
                <Play size={24} style={{ color: "#fff" }} />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── EPISODES ── */}
      {activeTab === "Episodes" && (
        <div className="flex flex-col items-center gap-4 py-8">
          <div className="text-5xl">🎬</div>
          <p className="text-sm font-bold" style={{ color: "var(--text-secondary)", fontFamily: "var(--font-display)" }}>
            Siap nonton?
          </p>
          <Link href={`/watch/${anime.id}`}
            className="flex items-center gap-2 px-6 py-3 rounded-full font-bold text-sm transition-all hover:scale-105"
            style={{
              backgroundColor: "var(--accent)",
              color: "#fff",
              fontFamily: "var(--font-display)",
              boxShadow: "0 4px 15px rgba(var(--accent-rgb),0.4)",
            }}>
            <Play size={16} fill="currentColor" />
            Tonton Episode 1
          </Link>
        </div>
      )}

      {/* ── Recommendations ── */}
      {activeTab === "Overview" && recommendations.length > 0 && (
        <div className="mt-8">
          <h2 className="text-sm font-bold uppercase tracking-wider mb-4"
            style={{ color: "var(--text-muted)", fontFamily: "var(--font-display)" }}>
            Rekomendasi
          </h2>
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-3">
            {recommendations.slice(0, 8).map((node: {
              mediaRecommendation: {
                id: number;
                title: { english?: string; romaji: string };
                coverImage: { large: string; color?: string };
                averageScore?: number;
              };
            }) => {
              const rec = node.mediaRecommendation;
              const recTitle = rec.title.english || rec.title.romaji;
              return (
                <Link key={rec.id} href={`/anime/${rec.id}`}
                  className="flex flex-col gap-2 group">
                  <div className="relative overflow-hidden rounded-xl" style={{ aspectRatio: "3/4" }}>
                    <Image src={rec.coverImage.large} alt={recTitle} fill sizes="120px"
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                      style={{ backgroundColor: rec.coverImage.color ?? "var(--bg-hover)" }} />
                    {rec.averageScore && (
                      <div className="absolute top-1.5 left-1.5">
                        <span className="flex items-center gap-0.5 px-1.5 py-0.5 rounded-md text-[0.6rem] font-bold"
                          style={{ backgroundColor: "rgba(0,0,0,0.7)", color: "var(--accent)", fontFamily: "var(--font-display)" }}>
                          <Star size={8} fill="currentColor" /> {(rec.averageScore / 10).toFixed(1)}
                        </span>
                      </div>
                    )}
                  </div>
                  <p className="text-xs line-clamp-2 font-semibold group-hover:text-[var(--accent)] transition-colors"
                    style={{ color: "var(--text-secondary)", fontFamily: "var(--font-body)" }}>
                    {recTitle}
                  </p>
                </Link>
              );
            })}
          </div>
        </div>
      )}

      <div className="pb-16" />
    </div>
  );
}
