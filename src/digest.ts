// Pure word-frequency digest -- the metered "work" of the upto-server
// demo. Extracted into its own module (no Express/env/network
// dependencies) so it can be unit tested without side effects.

export type DigestResult = { wordCount: number; topWords: [string, number][] };

export function digest(text: string): DigestResult {
  const words = text.toLowerCase().match(/[a-z0-9']+/g) ?? [];
  const freq = new Map<string, number>();
  for (const w of words) freq.set(w, (freq.get(w) ?? 0) + 1);
  const topWords = [...freq.entries()].sort((a, b) => b[1] - a[1]).slice(0, 10);
  return { wordCount: words.length, topWords };
}
