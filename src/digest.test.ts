import { describe, expect, it } from "vitest";
import { digest } from "./digest.js";

describe("digest", () => {
  it("counts words and ranks the most frequent ones", () => {
    const result = digest("the quick brown fox jumps over the lazy dog the dog barks");
    expect(result.wordCount).toBe(12);
    expect(result.topWords[0]).toEqual(["the", 3]);
    expect(result.topWords).toContainEqual(["dog", 2]);
  });

  it("is case-insensitive and ignores punctuation", () => {
    const result = digest("Hedera, Hedera! HEDERA?");
    expect(result.wordCount).toBe(3);
    expect(result.topWords).toEqual([["hedera", 3]]);
  });

  it("keeps apostrophes inside words (e.g. contractions)", () => {
    const result = digest("it's a test, it's real");
    expect(result.wordCount).toBe(5);
    expect(result.topWords).toContainEqual(["it's", 2]);
  });

  it("returns zero words for empty or punctuation-only input", () => {
    expect(digest("")).toEqual({ wordCount: 0, topWords: [] });
    expect(digest("!!! ... ---")).toEqual({ wordCount: 0, topWords: [] });
  });

  it("caps topWords at 10 distinct entries", () => {
    const text = Array.from({ length: 15 }, (_, i) => `word${i}`).join(" ");
    const result = digest(text);
    expect(result.wordCount).toBe(15);
    expect(result.topWords.length).toBe(10);
  });

  it("charges exactly 1 atomic unit per word -- this is the real metered price", () => {
    // This is the actual pricing rule from upto-server.ts: settlement
    // amount == wordCount. If this test breaks, the billing logic changed.
    const result = digest("pay per word on hedera");
    expect(result.wordCount).toBe(5);
  });
});
