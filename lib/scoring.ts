function tokens(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s]/gu, " ")
    .split(/\s+/)
    .filter((t) => t.length > 2);
}

function shingles(text: string, n = 2): Set<string> {
  const toks = tokens(text);
  if (toks.length < n) return new Set(toks);
  const out = new Set<string>();
  for (let i = 0; i <= toks.length - n; i++) {
    out.add(toks.slice(i, i + n).join(" "));
  }
  return out;
}

function jaccard(a: Set<string>, b: Set<string>): number {
  if (a.size === 0 && b.size === 0) return 1;
  let intersect = 0;
  for (const x of a) if (b.has(x)) intersect++;
  const union = a.size + b.size - intersect;
  return union === 0 ? 0 : intersect / union;
}

export function consistencyScore(responses: string[]): number {
  if (responses.length < 2) return 100;
  const sets = responses.map((r) => shingles(r));
  let total = 0;
  let pairs = 0;
  for (let i = 0; i < sets.length; i++) {
    for (let j = i + 1; j < sets.length; j++) {
      total += jaccard(sets[i], sets[j]);
      pairs++;
    }
  }
  return Math.round((total / pairs) * 100);
}

export type BrandStats = {
  brand: string;
  mentions: number;
  iterations: number;
  frequency: number;
};

export function brandMentionStats(
  responses: string[],
  brand: string,
): BrandStats | null {
  const trimmed = brand.trim();
  if (!trimmed) return null;
  const needle = trimmed.toLowerCase();
  const mentions = responses.reduce(
    (acc, r) => acc + (r.toLowerCase().includes(needle) ? 1 : 0),
    0,
  );
  return {
    brand: trimmed,
    mentions,
    iterations: responses.length,
    frequency: responses.length ? mentions / responses.length : 0,
  };
}

export function extractMentionedEntities(
  responses: string[],
  limit = 8,
): { name: string; count: number }[] {
  const counts = new Map<string, number>();
  const seenPerResponse = new Map<string, Set<number>>();
  responses.forEach((r, idx) => {
    const matches = r.match(
      /\b[A-Z][A-Za-z0-9&.\-]+(?:\s+[A-Z][A-Za-z0-9&.\-]+){0,2}\b/g,
    );
    if (!matches) return;
    for (const m of matches) {
      const key = m.trim();
      if (key.length < 2) continue;
      let set = seenPerResponse.get(key);
      if (!set) {
        set = new Set();
        seenPerResponse.set(key, set);
      }
      if (set.has(idx)) continue;
      set.add(idx);
      counts.set(key, (counts.get(key) ?? 0) + 1);
    }
  });
  return [...counts.entries()]
    .filter(([, c]) => c >= 2)
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit)
    .map(([name, count]) => ({ name, count }));
}
