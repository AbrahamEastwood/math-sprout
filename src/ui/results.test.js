import { describe, expect, it } from "vitest";
import { getAverageExerciseTime, getDisplayedResults } from "./results.js";

describe("session results helpers", () => {
  const results = [
    { isCorrect: true, duration: 1000 },
    { isCorrect: false, duration: 3000 },
    { isCorrect: false, duration: 2000 },
  ];

  it("filters to incorrect results only when requested", () => {
    expect(getDisplayedResults(results, false)).toEqual(results);
    expect(getDisplayedResults(results, true)).toEqual(results.slice(1));
  });

  it("calculates average time for all results, including the empty case", () => {
    expect(getAverageExerciseTime(results)).toBe(2000);
    expect(getAverageExerciseTime([])).toBe(0);
  });
});
