import { describe, expect, it } from "vitest";
import {
  createExerciseResult,
  EXERCISE_COUNT_TARGETS,
  getSessionProgress,
  getSessionScore,
  hasExerciseResult,
  isValidPracticeTarget,
  shouldEndSession,
  TIME_LIMIT_TARGETS_MINUTES,
} from "./session.js";
import {
  addLeaderboardEntry,
  createLeaderboardEntry,
  LEADERBOARD_LIMIT,
  rankLeaderboardEntries,
} from "./leaderboard.js";

describe("practice modes", () => {
  it("accepts only the supported targets, and no target for free-form", () => {
    expect(EXERCISE_COUNT_TARGETS).toEqual([10, 20, 30, 40, 50, 60, 70, 80, 90, 100]);
    expect(TIME_LIMIT_TARGETS_MINUTES).toEqual([1, 2, 3, 5, 8]);
    expect(isValidPracticeTarget("exercise-count", 10)).toBe(true);
    expect(isValidPracticeTarget("exercise-count", 15)).toBe(false);
    expect(isValidPracticeTarget("time-limit", 5)).toBe(true);
    expect(isValidPracticeTarget("time-limit", 4)).toBe(false);
    expect(isValidPracticeTarget("free-form", null)).toBe(true);
    expect(isValidPracticeTarget("free-form", 10)).toBe(false);
    expect(isValidPracticeTarget("unknown", null)).toBe(false);
  });

  it("ends count and time sessions at their target, but leaves free-form manual", () => {
    expect(shouldEndSession("exercise-count", 10, 9, 0)).toBe(false);
    expect(shouldEndSession("exercise-count", 10, 10, 0)).toBe(true);
    expect(shouldEndSession("time-limit", 1, 0, 59_999)).toBe(false);
    expect(shouldEndSession("time-limit", 1, 0, 60_000)).toBe(true);
    expect(shouldEndSession("free-form", null, 100, 1_000_000)).toBe(false);
  });

  it("reports bounded progress for count and time sessions only", () => {
    expect(getSessionProgress("exercise-count", 10, 3, 0)).toBe(30);
    expect(getSessionProgress("exercise-count", 10, 12, 0)).toBe(100);
    expect(getSessionProgress("time-limit", 1, 0, 15_000)).toBe(25);
    expect(getSessionProgress("time-limit", 1, 0, -1)).toBe(0);
    expect(getSessionProgress("free-form", null, 3, 15_000)).toBeNull();
  });
});

describe("exercise results", () => {
  const exercise = {
    question: "4 + 3",
    correctAnswer: 7,
    firstAnswer: null,
    isCorrect: null,
    startedAt: 100,
  };

  it("does not record an unanswered exercise unless it was skipped", () => {
    expect(createExerciseResult(exercise, false, 250)).toBeNull();
    expect(createExerciseResult(null, true, 250)).toBeNull();
  });

  it("records skipped exercises as incorrect with no first answer", () => {
    expect(createExerciseResult(exercise, true, 250)).toEqual({
      question: "4 + 3",
      correctAnswer: 7,
      firstAnswer: null,
      isCorrect: false,
      duration: 150,
    });
  });

  it("preserves the first answer and its correctness", () => {
    expect(createExerciseResult({ ...exercise, firstAnswer: 7, isCorrect: true }, false, 250))
      .toMatchObject({ firstAnswer: 7, isCorrect: true, duration: 150 });
    expect(createExerciseResult({ ...exercise, firstAnswer: 5, isCorrect: false }, false, 250))
      .toMatchObject({ firstAnswer: 5, isCorrect: false });
  });
});

describe("session score", () => {
  it("counts completed results and includes the current exercise only after an answer", () => {
    const results = [{ isCorrect: true }, { isCorrect: false }];
    const unanswered = { firstAnswer: null, isCorrect: null };
    const answeredCorrectly = { firstAnswer: 7, isCorrect: true };

    expect(hasExerciseResult(unanswered)).toBe(false);
    expect(getSessionScore(results, unanswered)).toEqual({ correct: 1, total: 2 });
    expect(getSessionScore(results, answeredCorrectly)).toEqual({ correct: 2, total: 3 });
  });
});

describe("local leaderboards", () => {
  it("only creates entries for completed bounded sessions with recorded exercises", () => {
    const results = [{ isCorrect: true }, { isCorrect: false }];
    expect(createLeaderboardEntry({
      mode: "free-form",
      target: null,
      results,
      elapsedMilliseconds: 60_000,
      name: "Ada",
    })).toBeNull();
    expect(createLeaderboardEntry({
      mode: "time-limit",
      target: 1,
      results,
      elapsedMilliseconds: 59_999,
      name: "Ada",
    })).toBeNull();
    expect(createLeaderboardEntry({
      mode: "exercise-count",
      target: 10,
      results: [],
      elapsedMilliseconds: 60_000,
      name: "Ada",
    })).toBeNull();

    const fixedResults = Array.from({ length: 10 }, (_, index) => ({
      isCorrect: index === 0,
    }));
    expect(createLeaderboardEntry({
      mode: "exercise-count",
      target: 10,
      results: fixedResults,
      elapsedMilliseconds: 120_000,
      name: "  ",
    })).toEqual({
      name: "Anonymous",
      correct: 1,
      total: 10,
      accuracy: 0.1,
      target: 10,
      mode: "exercise-count",
      elapsedMilliseconds: 120_000,
    });
  });

  it("ranks by correct answers per minute, then accuracy, keeping earlier exact ties first", () => {
    const entries = [
      { name: "Earlier", correct: 5, total: 10, accuracy: 0.5, elapsedMilliseconds: 60_000 },
      { name: "Higher accuracy", correct: 10, total: 10, accuracy: 1, elapsedMilliseconds: 120_000 },
      { name: "Faster", correct: 6, total: 10, accuracy: 0.6, elapsedMilliseconds: 60_000 },
      { name: "Exact tie", correct: 5, total: 10, accuracy: 0.5, elapsedMilliseconds: 60_000 },
    ];

    expect(rankLeaderboardEntries(entries).map(({ name }) => name)).toEqual([
      "Faster",
      "Higher accuracy",
      "Earlier",
      "Exact tie",
    ]);
  });

  it("retains no more than the highest-ranked 20 results", () => {
    const leaderboards = { "time-limit": [], "exercise-count": [] };
    const updated = Array.from({ length: LEADERBOARD_LIMIT + 1 }, (_, index) => index)
      .reduce((current, index) => addLeaderboardEntry(current, {
        name: `Learner ${index}`,
        correct: index,
        total: LEADERBOARD_LIMIT,
        accuracy: index / LEADERBOARD_LIMIT,
        target: 1,
        mode: "time-limit",
        elapsedMilliseconds: 60_000,
      }), leaderboards);

    expect(updated["time-limit"]).toHaveLength(LEADERBOARD_LIMIT);
    expect(updated["time-limit"][0].name).toBe(`Learner ${LEADERBOARD_LIMIT}`);
    expect(updated["time-limit"].at(-1).name).toBe("Learner 1");
  });
});
