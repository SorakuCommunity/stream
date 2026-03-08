export default async function SchedulePage() {
  const now = Math.floor(Date.now() / 1000);
  const weekStart = now - (now % 86400);
  const weekEnd = weekStart + 7 * 86400;

  let schedule: {
    id: number;
    airingAt: number;
    episode: number;
    media: {
      id: number;
      title: { romaji: string; english?: string };
      coverImage: { medium: string };
    };
  }[] = [];

  try {
    const res = await fetch("https://graphql.anilist.co", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        query: `query ($weekStart: Int, $weekEnd: Int) {
          Page(page: 1, perPage: 50) {
            airingSchedules(airingAt_greater: $weekStart, airingAt_lesser: $weekEnd, sort: TIME) {
              id airingAt episode
              media {
                id title { romaji english }
                coverImage { medium }
              }
            }
          }
        }`,
        variables: { weekStart, weekEnd },
      }),
      next: { revalidate: 1800 },
    });
    const json = await res.json();
    schedule = json.data?.Page?.airingSchedules ?? [];
  } catch {}

  const days = ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"];

  const byDay: Record<number, typeof schedule> = {};
  for (const item of schedule) {
    const d = new Date(item.airingAt * 1000).getDay();
    if (!byDay[d]) byDay[d] = [];
    byDay[d].push(item);
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
      <h1 className="text-xl font-bold mb-6" style={{ color: "var(--text-primary)" }}>
        📅 Jadwal Tayang Mingguan
      </h1>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {days.map((day, idx) => {
          const entries = byDay[idx] ?? [];
          if (entries.length === 0) return null;
          return (
            <div
              key={day}
              className="rounded-xl p-4"
              style={{ backgroundColor: "var(--bg-card)", border: "1px solid var(--border)" }}
            >
              <h2 className="font-bold text-sm mb-3" style={{ color: "var(--accent)" }}>{day}</h2>
              <div className="flex flex-col gap-2">
                {entries.map((e) => {
                  const time = new Date(e.airingAt * 1000).toLocaleTimeString("id-ID", {
                    hour: "2-digit", minute: "2-digit",
                  });
                  return (
                    <a
                      key={e.id}
                      href={`/watch/${e.media.id}`}
                      className="flex items-center gap-2 text-xs hover:text-[var(--accent)] transition-colors"
                      style={{ color: "var(--text-secondary)" }}
                    >
                      <span className="w-12 shrink-0" style={{ color: "var(--text-muted)" }}>{time}</span>
                      <span className="line-clamp-1">
                        {e.media.title.english || e.media.title.romaji} — Ep {e.episode}
                      </span>
                    </a>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
