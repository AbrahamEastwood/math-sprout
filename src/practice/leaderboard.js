import { isValidPracticeTarget } from "./session.js";

export const LEADERBOARD_LIMIT = 20;
export const LEADERBOARD_DISPLAY_LIMIT = 10;

export function createLeaderboardEntry({
  mode,
  target,
  results,
  elapsedMilliseconds,
  name,
}) {
  if (
    !["time-limit", "exercise-count"].includes(mode) ||
    !isValidPracticeTarget(mode, target) ||
    !Array.isArray(results) ||
    results.length === 0 ||
    !Number.isFinite(elapsedMilliseconds) ||
    elapsedMilliseconds <= 0 ||
    (mode === "time-limit" && elapsedMilliseconds < target * 60_000) ||
    (mode === "exercise-count" && results.length < target)
  ) {
    return null;
  }

  const correct = results.filter((result) => result.isCorrect).length;
  return {
    name: name.trim() || "Anonymous",
    correct,
    total: results.length,
    accuracy: correct / results.length,
    target,
    mode,
    elapsedMilliseconds,
  };
}

export function rankLeaderboardEntries(entries) {
  return [...entries].sort((left, right) => {
    const rateComparison =
      left.correct * right.elapsedMilliseconds -
      right.correct * left.elapsedMilliseconds;
    if (rateComparison !== 0) return -Math.sign(rateComparison);

    const accuracyComparison = left.correct * right.total - right.correct * left.total;
    return accuracyComparison === 0 ? 0 : -Math.sign(accuracyComparison);
  });
}

export function addLeaderboardEntry(leaderboards, entry) {
  const entries = rankLeaderboardEntries([...leaderboards[entry.mode], entry]);
  return {
    ...leaderboards,
    [entry.mode]: entries.slice(0, LEADERBOARD_LIMIT),
  };
}
