export function getDisplayedResults(results, showMistakesOnly) {
  return showMistakesOnly ? results.filter((result) => !result.isCorrect) : results;
}

export function getAverageExerciseTime(results) {
  const totalExerciseTime = results.reduce((total, result) => total + result.duration, 0);
  return results.length ? totalExerciseTime / results.length : 0;
}

export function renderSessionResults({
  results,
  showMistakesOnly,
  resultsList,
  resultsEmpty,
  totalTimeText,
  averageTimeText,
  sessionElapsed,
  translate,
  formatDuration,
}) {
  resultsList.replaceChildren();

  const displayedResults = getDisplayedResults(results, showMistakesOnly);
  displayedResults.forEach((result) => {
    const item = document.createElement("li");
    item.className = `result-item ${result.isCorrect ? "result-correct" : "result-incorrect"}`;

    const details = document.createElement("div");
    details.className = "result-details";

    const question = document.createElement("p");
    question.className = "result-question";
    question.textContent = `${result.question} = ?`;

    const answer = document.createElement("p");
    answer.className = "result-response";
    answer.textContent =
      result.firstAnswer === null
        ? translate("skippedAnswer")
        : translate("answer", { answer: result.firstAnswer });

    const correctAnswer = document.createElement("p");
    correctAnswer.className = "result-answer";
    correctAnswer.textContent = translate("correctAnswer", { answer: result.correctAnswer });

    const outcome = document.createElement("div");
    outcome.className = "result-outcome";

    const status = document.createElement("span");
    status.className = "result-status";
    status.textContent = translate(result.isCorrect ? "correct" : "incorrect");

    const duration = document.createElement("span");
    duration.className = "result-duration";
    duration.textContent = formatDuration(result.duration);

    details.append(question, answer);
    if (!result.isCorrect && result.firstAnswer !== null) {
      details.append(correctAnswer);
    }
    outcome.append(status, duration);
    item.append(details, outcome);
    resultsList.append(item);
  });

  resultsEmpty.hidden = displayedResults.length > 0;
  resultsEmpty.textContent = results.length === 0
    ? translate("noExercises")
    : translate("noMistakes");

  totalTimeText.textContent = formatDuration(sessionElapsed);
  averageTimeText.textContent = formatDuration(getAverageExerciseTime(results));
}
