export function hasExerciseResult(exercise) {
  return exercise !== null && exercise.firstAnswer !== null;
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
