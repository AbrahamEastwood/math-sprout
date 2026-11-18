import { describe, expect, it } from "vitest";
import { createExerciseResult, getSessionScore, hasExerciseResult } from "./session.js";

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
