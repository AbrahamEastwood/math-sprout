export const EXERCISE_COUNT_TARGETS = Object.freeze([10, 20, 30, 40, 50, 60, 70, 80, 90, 100]);
export const TIME_LIMIT_TARGETS_MINUTES = Object.freeze([1, 2, 3, 5, 8]);

export function hasExerciseResult(exercise) {
  return exercise !== null && exercise.firstAnswer !== null;
}

export function isValidPracticeTarget(mode, target) {
  if (mode === "free-form") return target === null;
  if (mode === "exercise-count") return EXERCISE_COUNT_TARGETS.includes(target);
  if (mode === "time-limit") return TIME_LIMIT_TARGETS_MINUTES.includes(target);
  return false;
}

export function shouldEndSession(mode, target, completedExercises, elapsedMilliseconds) {
  if (mode === "exercise-count") return completedExercises >= target;
  if (mode === "time-limit") return elapsedMilliseconds >= target * 60_000;
  return false;
}

export function getSessionProgress(mode, target, completedExercises, elapsedMilliseconds) {
  if (!isValidPracticeTarget(mode, target) || mode === "free-form") return null;

  const progress = mode === "exercise-count"
    ? completedExercises / target
    : elapsedMilliseconds / (target * 60_000);
  return Math.min(100, Math.max(0, progress * 100));
}

export function getSessionScore(results, currentExercise) {
  const currentIsRecorded = hasExerciseResult(currentExercise);
  return {
    total: results.length + Number(currentIsRecorded),
    correct:
      results.filter((result) => result.isCorrect).length +
      Number(currentIsRecorded && currentExercise.isCorrect),
  };
}

export function createExerciseResult(exercise, skipped, finishedAt) {
  if (!exercise || (exercise.firstAnswer === null && !skipped)) return null;

  return {
    question: exercise.question,
    correctAnswer: exercise.correctAnswer,
    firstAnswer: exercise.firstAnswer,
    isCorrect: exercise.firstAnswer === null ? false : exercise.isCorrect,
    duration: finishedAt - exercise.startedAt,
  };
}
