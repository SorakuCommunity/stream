import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Clock } from "lucide-react";

export const metadata: Metadata = { title: "Jadwal Tayang | Soraku Stream" };

const DAYS = ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"];
const DAY_EN = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

interface AiringItem {
  id: number;
  airingAt: number;
  episode: number;
  media: {
    id: number;
    title: { romaji: string; english?: string };
    coverImage: { medium: string; color?: string };
    format?: string;
  };
}

export default async function SchedulePage() {
  const now = Math.floor(Date.now() / 1000);
  const todayStart = now - (now % 86400);
  const weekEnd = todayStart + 7 * 86400;

  let schedule: AiringItem[] = [];

  try {
    const res = await fetch("https://graphql.anilist.co", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        query: `query ($start: Int, $end: Int) {
          Page(page: 1, perPage: 100) {
            airingSchedules(airingAt_greater: $start, airingAt_lesser: $end, sort: TIME) {
              id airingAt episode
              media {
                id title { romaji english }
                coverImage { medium color }
                format
              }
            }
          }
        }`,
        variables: { start: todayStart - 86400, end: weekEnd },
      }),
      next: { revalidate: 1800 },
    });
    schedule = (await res.json())?.data?.Page?.airingSchedules ?? [];
  } catch {}

  const todayIdx = new Date().getDay();
  const byDay: Record<number, AiringItem[]> = {};
  for (const item of schedule) {
    const d = new Date(item.airingAt * 1000).getDay();
    if (!byDay[d]) byDay[d] = [];
    byDay[d].push(item);
  }

  // Order days starting from today
  const orderedDays = Array.from({ length: 7 }, (_, i) => (todayIdx + i) % 7);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1
          className="text-2xl font-900 mb-1.5"
          style={{ fontFamily: "var(--font-display)", fontWeight: 900, letterSpacing: "-0.03em", color: "var(--text-primary)" }}
        >
          Jadwal Tayang
        </h1>
        <p className="text-sm" style={{ color: "var(--text-muted)" }}>
          Episode baru yang sedang dan akan tayang minggu ini
        </p>
      </div>

      {/* Day grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {orderedDays.map((dayIdx) => {
          const entries = byDay[dayIdx] ?? [];
          const isToday = dayIdx === todayIdx;

          return (
            <div
              key={dayIdx}
              className="rounded-2xl overflow-hidden"
              style={{
                background: "var(--glass-bg)",
                backdropFilter: "blur(20px) saturate(180%)",
                WebkitBackdropFilter: "blur(20px) saturate(180%)",
                border: isToday
                  ? "1px solid rgba(var(--accent-rgb),0.35)"
                  : "1px solid var(--glass-border)",
                boxShadow: isToday
                  ? "0 4px 30px rgba(var(--accent-rgb),0.12), inset 0 1px 0 rgba(var(--accent-rgb),0.1)"
                  : "var(--shadow-card)",
              }}
            >
              {/* Day header */}
              <div
                className="px-4 py-3 flex items-center justify-between"
                style={{
                  borderBottom: "1px solid var(--border)",
                  background: isToday ? "rgba(var(--accent-rgb),0.07)" : "transparent",
                }}
              >
                <div className="flex items-center gap-2">
                  <span
                    className="font-800 text-sm"
                    style={{
                      fontFamily: "var(--font-display)",
                      fontWeight: 800,
                      color: isToday ? "var(--accent)" : "var(--text-primary)",
                    }}
                  >
                    {DAYS[dayIdx]}
                  </span>
                  {isToday && (
                    <span className="soraku-badge soraku-badge-live text-[0.58rem]">Hari ini</span>
                  )}
                </div>
                <span className="text-xs font-600" style={{ fontFamily: "var(--font-display)", fontWeight: 600, color: "var(--text-muted)" }}>
                  {entries.length} anime
                </span>
              </div>

              {/* Entries */}
              <div className="p-2 flex flex-col gap-1 max-h-64 overflow-y-auto">
                {entries.length === 0 ? (
                  <p className="text-xs text-center py-4" style={{ color: "var(--text-muted)" }}>
                    Tidak ada jadwal
                  </p>
                ) : (
                  entries.map((e) => {
                    const titleText = e.media.title.english || e.media.title.romaji;
                    const time = new Date(e.airingAt * 1000).toLocaleTimeString("id-ID", {
                      hour: "2-digit",
                      minute: "2-digit",
                    });
                    return (
                      <Link
                        key={e.id}
                        href={`/anime/${e.media.id}`}
                        className="flex items-center gap-2.5 px-2 py-2 rounded-xl transition-all hover:bg-[var(--bg-hover)] group"
                      >
                        {/* Cover */}
                        <div
                          className="w-9 h-12 rounded-lg overflow-hidden shrink-0"
                          style={{ backgroundColor: e.media.coverImage.color ?? "var(--bg-card)" }}
                        >
                          <Image
                            src={e.media.coverImage.medium}
                            alt={titleText}
                            width={36}
                            height={48}
                            className="w-full h-full object-cover"
                          />
                        </div>

                        {/* Info */}
                        <div className="flex-1 min-w-0">
                          <p
                            className="text-[0.75rem] font-600 line-clamp-1 transition-colors group-hover:text-[var(--accent)]"
                            style={{ fontFamily: "var(--font-display)", fontWeight: 600, color: "var(--text-primary)" }}
                          >
                            {titleText}
                          </p>
                          <div className="flex items-center gap-1.5 mt-0.5">
                            <Clock size={10} style={{ color: "var(--text-muted)" }} />
                            <span className="text-[0.65rem]" style={{ color: "var(--text-muted)" }}>
                              {time}
                            </span>
                            <span
                              className="text-[0.62rem] font-700 px-1 py-0.5 rounded"
                              style={{
                                fontFamily: "var(--font-display)",
                                fontWeight: 700,
                                background: "rgba(var(--accent-rgb),0.12)",
                                color: "var(--accent)",
                              }}
                            >
                              Ep {e.episode}
                            </span>
                          </div>
                        </div>
                      </Link>
                    );
                  })
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
