"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Play, Plus, Star, Tv2, Clock, Globe, Users, BarChart3 } from "lucide-react";
import { cn } from "@/lib/utils";

type Tab = "Overview" | "Karakter" | "Artwork" | "Episode";

interface Props {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  anime: any;
  trailer: string | null;
  title: string;
}

export function AnimeInfoClient({ anime, trailer, title }: Props) {
  const [activeTab, setActiveTab] = useState<Tab>("Overview");
  const [showFullDesc, setShowFullDesc] = useState(false);

  const genres: string[] = anime.genres ?? [];
  const characters = anime.characters?.edges ?? [];
  const relations = anime.relations?.edges?.filter(
    (e: { node: { type: string } }) => e.node.type === "ANIME"
  ) ?? [];
  const recommendations = anime.recommendations?.nodes?.filter(
    (n: { mediaRecommendation: unknown }) => n.mediaRecommendation
  ) ?? [];
  const artworks: string[] = [
    anime.bannerImage,
    anime.coverImage?.extraLarge,
    ...(anime.characters?.edges?.slice(0, 8).map(
      (e: { node: { image: { medium: string } } }) => e.node.image?.medium
    ) ?? []),
  ].filter(Boolean);

  const TABS: Tab[] = ["Overview", "Karakter", "Artwork", "Episode"];

  return (
    <div>
      {/* Tab bar */}
      <div
        className="flex items-center gap-0 mb-7 overflow-x-auto"
        style={{ borderBottom: "1px solid var(--border)" }}
      >
        {TABS.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className="px-5 py-3 text-sm font-700 transition-all relative shrink-0 whitespace-nowrap"
            style={{
              fontFamily: "var(--font-display)",
              fontWeight: 700,
              color: activeTab === tab ? "var(--text-primary)" : "var(--text-muted)",
              borderBottom: activeTab === tab ? "2px solid var(--accent)" : "2px solid transparent",
              marginBottom: "-1px",
            }}
          >
            {activeTab === tab && (
              <span
                className="absolute inset-0 rounded-t-lg -z-10"
                style={{ background: "rgba(var(--accent-rgb),0.06)" }}
              />
            )}
            {tab}
          </button>
        ))}
      </div>

      {/* OVERVIEW */}
      {activeTab === "Overview" && (
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left */}
          <div className="flex-1 min-w-0">
            {anime.description && (
              <div className="mb-8">
                <h2 className="soraku-section-title text-sm mb-4">Sinopsis</h2>
                <div
                  className={cn("text-sm leading-relaxed transition-all overflow-hidden", !showFullDesc && "line-clamp-4")}
                  style={{ color: "var(--text-secondary)" }}
                  dangerouslySetInnerHTML={{ __html: anime.description }}
                />
                <button
                  onClick={() => setShowFullDesc((v) => !v)}
                  className="text-xs mt-2 hover:underline font-600"
                  style={{ fontFamily: "var(--font-display)", fontWeight: 600, color: "var(--accent)" }}
                >
                  {showFullDesc ? "Lebih sedikit ↑" : "Selengkapnya ↓"}
                </button>
              </div>
            )}

            {/* Trailer */}
            {trailer && (
              <div className="mb-8">
                <h2 className="soraku-section-title text-sm mb-4">Trailer</h2>
                <div className="overflow-hidden rounded-2xl" style={{ aspectRatio: "16/9" }}>
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

            {/* Related */}
            {relations.length > 0 && (
              <div>
                <h2 className="soraku-section-title text-sm mb-4">Anime Terkait</h2>
                <div className="scroll-row">
                  {relations.slice(0, 8).map((r: {
                    relationType: string;
                    node: { id: number; title: { romaji: string; english?: string }; coverImage: { medium: string } };
                  }) => (
                    <Link
                      key={r.node.id}
                      href={`/anime/${r.node.id}`}
                      className="flex flex-col items-center gap-1.5 shrink-0 group"
                      style={{ width: "70px" }}
                    >
                      <div className="w-[70px] h-[98px] rounded-xl overflow-hidden">
                        <Image
                          src={r.node.coverImage.medium}
                          alt={r.node.title.romaji}
                          width={70} height={98}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                        />
                      </div>
                      <span
                        className="text-[0.6rem] text-center line-clamp-2 font-600"
                        style={{ fontFamily: "var(--font-display)", fontWeight: 600, color: "var(--text-muted)" }}
                      >
                        {r.relationType}
                      </span>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right sidebar — stats */}
          <div className="lg:w-72 shrink-0">
            <div
              className="rounded-2xl p-5"
              style={{
                background: "var(--glass-bg)",
                backdropFilter: "blur(20px) saturate(180%)",
                WebkitBackdropFilter: "blur(20px) saturate(180%)",
                border: "1px solid var(--glass-border)",
                boxShadow: "var(--shadow-card), inset 0 1px 0 rgba(255,255,255,0.05)",
              }}
            >
              <h3
                className="text-sm font-700 mb-4"
                style={{ fontFamily: "var(--font-display)", fontWeight: 700, color: "var(--text-primary)" }}
              >
                Info
              </h3>

              {[
                { icon: Tv2, label: "Format", value: anime.format },
                { icon: BarChart3, label: "Status", value: anime.status === "RELEASING" ? "Sedang Tayang" : anime.status === "FINISHED" ? "Selesai" : anime.status },
                { icon: Clock, label: "Durasi", value: anime.duration ? `${anime.duration} menit` : null },
                { icon: Globe, label: "Musim", value: anime.season && anime.seasonYear ? `${anime.season} ${anime.seasonYear}` : null },
                { icon: Users, label: "Studio", value: anime.studios?.nodes?.[0]?.name },
              ].filter((i) => i.value).map(({ icon: Icon, label, value }) => (
                <div
                  key={label}
                  className="flex items-center justify-between py-2.5"
                  style={{ borderBottom: "1px solid var(--border)" }}
                >
                  <div className="flex items-center gap-2">
                    <Icon size={13} style={{ color: "var(--text-muted)" }} />
                    <span className="text-xs" style={{ color: "var(--text-muted)" }}>{label}</span>
                  </div>
                  <span
                    className="text-xs font-600"
                    style={{ fontFamily: "var(--font-display)", fontWeight: 600, color: "var(--text-primary)" }}
                  >
                    {value}
                  </span>
                </div>
              ))}

              {/* Score */}
              {anime.averageScore && (
                <div className="mt-4 p-3 rounded-xl text-center" style={{ background: "rgba(var(--accent-rgb),0.08)" }}>
                  <div className="flex items-center justify-center gap-1.5 mb-1">
                    <Star size={14} fill="#facc15" stroke="none" />
                    <span
                      className="text-2xl font-900"
                      style={{ fontFamily: "var(--font-display)", fontWeight: 900, color: "#facc15" }}
                    >
                      {(anime.averageScore / 10).toFixed(1)}
                    </span>
                  </div>
                  <p className="text-[0.68rem]" style={{ color: "var(--text-muted)" }}>
                    {anime.popularity?.toLocaleString()} pengguna
                  </p>
                </div>
              )}

              {/* Genres */}
              {genres.length > 0 && (
                <div className="mt-4">
                  <p className="text-[0.68rem] font-700 uppercase tracking-wider mb-2" style={{ color: "var(--text-muted)", fontFamily: "var(--font-display)", fontWeight: 700 }}>Genre</p>
                  <div className="flex flex-wrap gap-1.5">
                    {genres.map((g) => (
                      <Link
                        key={g}
                        href={`/search?genre=${encodeURIComponent(g)}`}
                        className="soraku-badge soraku-badge-accent hover:opacity-80 transition-opacity"
                      >
                        {g}
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* KARAKTER */}
      {activeTab === "Karakter" && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
          {characters.slice(0, 20).map((e: {
            node: { id: number; name: { full: string }; image: { medium: string } };
            voiceActors: { name: { full: string }; image: { medium: string } }[];
          }) => {
            const va = e.voiceActors?.[0];
            return (
              <div
                key={e.node.id}
                className="rounded-2xl overflow-hidden transition-all hover:-translate-y-1"
                style={{
                  background: "var(--glass-bg)",
                  backdropFilter: "blur(16px)",
                  border: "1px solid var(--glass-border)",
                  boxShadow: "var(--shadow-card)",
                }}
              >
                <div className="flex">
                  <Image src={e.node.image.medium} alt={e.node.name.full} width={60} height={80} className="object-cover" />
                  {va && (
                    <Image
                      src={va.image.medium}
                      alt={va.name.full}
                      width={60} height={80}
                      className="object-cover ml-auto"
                      style={{ transform: "scaleX(-1)" }}
                    />
                  )}
                </div>
                <div className="p-2">
                  <p className="text-[0.7rem] font-600 line-clamp-1" style={{ fontFamily: "var(--font-display)", fontWeight: 600, color: "var(--text-primary)" }}>
                    {e.node.name.full}
                  </p>
                  {va && (
                    <p className="text-[0.62rem] line-clamp-1 mt-0.5" style={{ color: "var(--text-muted)" }}>
                      {va.name.full}
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ARTWORK */}
      {activeTab === "Artwork" && (
        <div className="columns-2 sm:columns-3 md:columns-4 gap-3 space-y-3">
          {artworks.map((url, i) => (
            <div key={i} className="break-inside-avoid rounded-xl overflow-hidden">
              <Image
                src={url}
                alt={`${title} artwork ${i + 1}`}
                width={300}
                height={400}
                className="w-full object-cover hover:scale-105 transition-transform duration-300"
              />
            </div>
          ))}
        </div>
      )}

      {/* EPISODE */}
      {activeTab === "Episode" && (
        <div className="text-center py-12">
          <Link
            href={`/watch/${anime.id}`}
            className="soraku-btn soraku-btn-accent px-8 py-3 text-sm rounded-full inline-flex items-center gap-2"
          >
            <Play size={16} fill="white" stroke="none" />
            Tonton Sekarang
          </Link>
        </div>
      )}

      {/* Recommendations */}
      {activeTab === "Overview" && recommendations.length > 0 && (
        <div className="mt-10">
          <h2 className="soraku-section-title mb-5">Rekomendasi</h2>
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-7 gap-3">
            {recommendations.slice(0, 14).map((n: {
              mediaRecommendation: {
                id: number;
                title: { romaji: string; english?: string };
                coverImage: { large: string; color?: string };
                averageScore?: number;
              };
            }) => {
              const rec = n.mediaRecommendation;
              return (
                <Link
                  key={rec.id}
                  href={`/anime/${rec.id}`}
                  className="group block"
                >
                  <div
                    className="relative aspect-[3/4] w-full overflow-hidden rounded-xl transition-transform group-hover:scale-[1.03]"
                    style={{ backgroundColor: rec.coverImage.color ?? "var(--bg-card)" }}
                  >
                    <Image src={rec.coverImage.large} alt={rec.title.romaji} fill className="object-cover" sizes="14vw" />
                  </div>
                  <p
                    className="text-[0.7rem] font-600 mt-1.5 line-clamp-2 transition-colors group-hover:text-[var(--accent)]"
                    style={{ fontFamily: "var(--font-display)", fontWeight: 600, color: "var(--text-secondary)" }}
                  >
                    {rec.title.english || rec.title.romaji}
                  </p>
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
