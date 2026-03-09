/**
 * Episode search utility — multi-strategy, multi-provider
 * Tries multiple title variants and providers to find episodes
 */

export interface EpisodeInfo {
  id: string;
  number: number;
  title?: string;
}

const PROVIDERS = [
  { id: "animekai",  path: "/anime/animekai"  },
  { id: "gogoanime", path: "/anime/gogoanime" },
  { id: "zoro",      path: "/anime/zoro"      },
] as const;

/** Normalize a title to a search-friendly slug */
function toSlug(t: string): string {
  return t
    .toLowerCase()
    .replace(/[^\w\s]/g, " ")   // strip punctuation
    .replace(/\s+/g, " ")
    .trim()
    .replace(/\s+/g, "-");
}

/** Simple similarity score between two strings (0–1) */
function similarity(a: string, b: string): number {
  const norm = (s: string) => s.toLowerCase().replace(/[^\w]/g, "");
  const na = norm(a), nb = norm(b);
  if (na === nb) return 1;
  if (na.includes(nb) || nb.includes(na)) return 0.85;
  // Count common words
  const wa = new Set(na.split(""));
  const wb = nb.split("");
  const common = wb.filter((c) => wa.has(c)).length;
  return common / Math.max(na.length, nb.length);
}

/** Generate title variants to try */
function titleVariants(english?: string, romaji?: string): string[] {
  const variants: string[] = [];
  if (english) {
    variants.push(english);
    // Remove season/part suffix
    variants.push(english.replace(/\s*(season|part|cour)\s*\d+/i, "").trim());
    // Remove " 2", " II" suffix
    variants.push(english.replace(/\s+(2|3|4|II|III|IV)$/i, "").trim());
  }
  if (romaji && romaji !== english) {
    variants.push(romaji);
    variants.push(romaji.replace(/\s*(season|part|cour)\s*\d+/i, "").trim());
  }
  // Deduplicate and filter empty
  return [...new Set(variants)].filter(Boolean);
}

export async function searchEpisodes(
  consumetBase: string,
  english?: string,
  romaji?: string,
): Promise<EpisodeInfo[]> {
  const variants = titleVariants(english, romaji);
  const targetTitle = english || romaji || "";

  for (const provider of PROVIDERS) {
    for (const variant of variants) {
      try {
        const slug = toSlug(variant);
        const searchUrl = `${consumetBase}${provider.path}/${encodeURIComponent(slug)}`;
        const res = await fetch(searchUrl, { signal: AbortSignal.timeout(6000) });
        if (!res.ok) continue;
        const data = await res.json();
        const results: { id: string; title: string }[] = data?.results ?? [];
        if (!results.length) continue;

        // Score each result for best match
        const scored = results
          .slice(0, 6)
          .map((r) => ({ r, score: similarity(targetTitle, r.title) }))
          .sort((a, b) => b.score - a.score);

        const best = scored[0];
        if (!best || best.score < 0.35) continue;

        // Fetch episode list
        const infoUrl = `${consumetBase}${provider.path}/info/${encodeURIComponent(best.r.id)}`;
        const infoRes = await fetch(infoUrl, { signal: AbortSignal.timeout(8000) });
        if (!infoRes.ok) continue;
        const info = await infoRes.json();
        const eps: EpisodeInfo[] = (info?.episodes ?? []).map(
          (e: { id: string; number: number; title?: string }) => ({
            id: e.id, number: e.number, title: e.title,
          })
        );
        if (eps.length > 0) return eps;
      } catch {
        // Try next variant / provider
      }
    }
  }
  return [];
}
