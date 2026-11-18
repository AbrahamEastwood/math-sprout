const answerForm = document.querySelector("#answer-form");
const answerInput = document.querySelector("#answer");
const questionText = document.querySelector("#question");
const sectionLabel = document.querySelector(".section-label");
const feedback = document.querySelector("#feedback");
const intro = document.querySelector("#intro");
const newQuestionButton = document.querySelector("#new-question");
const checkButton = document.querySelector("#check-answer");
const checkLabel = document.querySelector("#check-label");
const operationPicker = document.querySelector(".operation-picker");
const operationCheckboxes = document.querySelectorAll('input[name="operation"]');
const numberPadButtons = document.querySelectorAll(".number-key");
const deleteDigitButton = document.querySelector("#delete-digit");
const clearAnswerButton = document.querySelector("#clear-answer");
const sessionToggleButton = document.querySelector("#session-toggle");
const sessionMetrics = document.querySelector("#session-metrics");
const scoreCounter = document.querySelector("#score-counter");
const resultsScore = document.querySelector("#results-score");
const elapsedTime = document.querySelector("#elapsed-time");
const resultsDialog = document.querySelector("#results-dialog");
const resultsList = document.querySelector("#results-list");
const resultsEmpty = document.querySelector("#results-empty");
const mistakesOnlyCheckbox = document.querySelector("#mistakes-only");
const totalTimeText = document.querySelector("#total-time");
const averageTimeText = document.querySelector("#average-time");
const closeResultsButton = document.querySelector("#close-results");
const usernameForm = document.querySelector("#username-form");
const usernameInput = document.querySelector("#username");
const clearUsernameButton = document.querySelector("#clear-username");
const usernameStatus = document.querySelector("#username-status");
const resultsTitle = document.querySelector("#results-title");

const operations = {
  addition: {
    symbol: "+",
    makeNumbers() {
      return [randomNumber(10), randomNumber(10)];
    },
    calculate(first, second) {
      return first + second;
    },
  },
  subtraction: {
    symbol: "−",
    makeNumbers() {
      const first = randomNumber(10);
      const second = randomNumber(10);
      return [Math.max(first, second), Math.min(first, second)];
    },
    calculate(first, second) {
      return first - second;
    },
  },
  multiplication: {
    symbol: "×",
    makeNumbers() {
      return [randomNumber(10), randomNumber(10)];
    },
    calculate(first, second) {
      return first * second;
    },
  },
  division: {
    symbol: "÷",
    makeNumbers() {
      const divisor = randomNumber(10);
      const quotient = randomNumber(10);
      return [divisor * quotient, divisor];
    },
    calculate(first, second) {
      return first / second;
    },
  },
};

let currentExercise = null;
let results = [];
let sessionStartedAt = null;
let sessionElapsed = 0;
let sessionActive = false;
let timerInterval;
const usernameStorageKey = "math-sprout.username";
let username = "";

function randomNumber(max) {
  return Math.floor(Math.random() * max) + 1;
}

function selectedOperations() {
  return [...operationCheckboxes]
    .filter((checkbox) => checkbox.checked)
    .map((checkbox) => checkbox.value);
}

function clearFeedback() {
  feedback.textContent = "";
  feedback.className = "feedback";
}

function setPracticeVisible(visible) {
  [sectionLabel, questionText, answerForm, feedback, newQuestionButton].forEach((element) => {
    element.hidden = !visible;
  });
  answerInput.disabled = !visible;
  checkButton.disabled = !visible;
  numberPadButtons.forEach((button) => {
    button.disabled = !visible;
  });
  newQuestionButton.disabled = !visible;
}

function formatDuration(milliseconds) {
  const totalSeconds = Math.floor(Math.max(0, milliseconds) / 1000);
  const seconds = totalSeconds % 60;
  const minutes = Math.floor(totalSeconds / 60) % 60;
  const hours = Math.floor(totalSeconds / 3600);

  if (hours > 0) {
    return `${hours}:${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
  }

  return `${String(Math.floor(totalSeconds / 60)).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}

function updateTimer() {
  const milliseconds = sessionActive ? performance.now() - sessionStartedAt : sessionElapsed;
  elapsedTime.textContent = formatDuration(milliseconds);
}

function updatePersonalizedText() {
  const name = username ? `, ${username}` : "";
  resultsTitle.textContent = username ? `${username}'s session results` : "Session results";

  if (!sessionActive) {
    intro.textContent = sessionStartedAt === null
      ? "Choose what you’d like to practise, then press Start."
      : `Session complete${name}! Press Start to practise again.`;
  }
}

function saveUsername(value) {
  const trimmedName = value.trim();

  if (trimmedName === "") {
    usernameInput.value = "";
    usernameStatus.textContent = "Enter a username or clear it to use a generic name.";
    usernameStatus.className = "username-status username-status-error";
    return;
  }

  username = trimmedName;
  usernameInput.value = username;
  clearUsernameButton.hidden = false;
  try {
    localStorage.setItem(usernameStorageKey, username);
    usernameStatus.textContent = `Saved as ${username}.`;
  } catch {
    usernameStatus.textContent = `Using ${username} for this visit.`;
  }
  usernameStatus.className = "username-status";
  updatePersonalizedText();
}

function clearUsername() {
  username = "";
  usernameInput.value = "";
  clearUsernameButton.hidden = true;
  try {
    localStorage.removeItem(usernameStorageKey);
    usernameStatus.textContent = "Username cleared.";
  } catch {
    usernameStatus.textContent = "Username cleared for this visit.";
  }
  usernameStatus.className = "username-status";
  updatePersonalizedText();
}

function loadUsername() {
  try {
    const savedUsername = localStorage.getItem(usernameStorageKey);
    if (savedUsername) {
      username = savedUsername.trim();
      if (username) {
        usernameInput.value = username;
        clearUsernameButton.hidden = false;
        usernameStatus.textContent = `Welcome back, ${username}!`;
      } else {
        localStorage.removeItem(usernameStorageKey);
      }
    }
  } catch {
    usernameStatus.textContent = "";
  }
  updatePersonalizedText();
}

function currentExerciseHasResult() {
  return currentExercise !== null && currentExercise.firstAnswer !== null;
}

function updateScore() {
  const currentIsRecorded = currentExerciseHasResult();
  const exerciseCount = results.length + Number(currentIsRecorded);
  const correctCount =
    results.filter((result) => result.isCorrect).length +
    Number(currentIsRecorded && currentExercise.isCorrect);

  const scoreText = `Score: ${correctCount} / ${exerciseCount}`;
  scoreCounter.textContent = scoreText;
  resultsScore.textContent = scoreText;
}

function updateSessionControls() {
  sessionToggleButton.textContent = sessionActive ? "Stop" : "Start";
  sessionToggleButton.disabled = !sessionActive && selectedOperations().length === 0;
  operationPicker.disabled = sessionActive;
  sessionMetrics.hidden = sessionStartedAt === null;
}

function createQuestion() {
  const selected = selectedOperations();
  const operationKey = selected[Math.floor(Math.random() * selected.length)];
  const selectedOperation = operations[operationKey];
  const [firstNumber, secondNumber] = selectedOperation.makeNumbers();
  const expectedAnswer = selectedOperation.calculate(firstNumber, secondNumber);
  const question = `${firstNumber} ${selectedOperation.symbol} ${secondNumber}`;

  currentExercise = {
    question,
    correctAnswer: expectedAnswer,
    firstAnswer: null,
    isCorrect: null,
    startedAt: performance.now(),
  };
  answerInput.value = "";
  questionText.textContent = `${question} = ?`;
  checkLabel.textContent = "Check answer";
  clearFeedback();
  answerInput.focus({ preventScroll: true });
}

function finishCurrentExercise(skipped, finishedAt = performance.now()) {
  if (!currentExercise) return;

  if (currentExercise.firstAnswer === null && !skipped) {
    currentExercise = null;
    return;
  }

  results.push({
    question: currentExercise.question,
    correctAnswer: currentExercise.correctAnswer,
    firstAnswer: currentExercise.firstAnswer,
    isCorrect: currentExercise.firstAnswer === null ? false : currentExercise.isCorrect,
    duration: finishedAt - currentExercise.startedAt,
  });
  currentExercise = null;
}

function showAnswerFeedback(isCorrect) {
  answerInput.classList.remove("answer-correct", "answer-incorrect");
  void answerInput.offsetWidth;
  answerInput.classList.add(isCorrect ? "answer-correct" : "answer-incorrect");
}

function startSession() {
  if (selectedOperations().length === 0) return;

  results = [];
  sessionStartedAt = performance.now();
  sessionElapsed = 0;
  sessionActive = true;
  intro.hidden = true;
  setPracticeVisible(true);
  updateSessionControls();
  createQuestion();
  updateScore();
  updateTimer();
  window.clearInterval(timerInterval);
  timerInterval = window.setInterval(updateTimer, 250);
}

function renderResults() {
  resultsList.replaceChildren();
  const showMistakesOnly = mistakesOnlyCheckbox.checked;

  results.forEach((result) => {
    if (showMistakesOnly && result.isCorrect) return;

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
      result.firstAnswer === null ? "Skipped — no answer submitted" : `Answer: ${result.firstAnswer}`;

    const correctAnswer = document.createElement("p");
    correctAnswer.className = "result-answer";
    correctAnswer.textContent = `Correct answer: ${result.correctAnswer}`;

    const outcome = document.createElement("div");
    outcome.className = "result-outcome";

    const status = document.createElement("span");
    status.className = "result-status";
    status.textContent = result.isCorrect ? "Correct" : "Incorrect";

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

  const visibleResults = resultsList.children.length;
  resultsEmpty.hidden = visibleResults > 0;
  resultsEmpty.textContent =
    results.length === 0
      ? "No recorded exercises yet."
      : "No mistakes in this session.";

  const totalExerciseTime = results.reduce((total, result) => total + result.duration, 0);
  const averageExerciseTime = results.length ? totalExerciseTime / results.length : 0;
  totalTimeText.textContent = formatDuration(sessionElapsed);
  averageTimeText.textContent = formatDuration(averageExerciseTime);
}

function stopSession() {
  if (!sessionActive) return;

  const stoppedAt = performance.now();
  sessionElapsed = stoppedAt - sessionStartedAt;
  window.clearInterval(timerInterval);
  sessionActive = false;

  if (currentExerciseHasResult()) {
    finishCurrentExercise(false, stoppedAt);
  } else {
    currentExercise = null;
  }

  setPracticeVisible(false);
  intro.textContent = username
    ? `Session complete, ${username}! Press Start to practise again.`
    : "Session complete! Press Start to practise again.";
  intro.hidden = false;
  updateSessionControls();
  updateScore();
  updateTimer();
  mistakesOnlyCheckbox.checked = false;
  renderResults();
  resultsDialog.showModal();
}

answerForm.addEventListener("submit", (event) => {
  event.preventDefault();
  if (!sessionActive || !currentExercise) return;

  const value = answerInput.value.trim();
  if (value === "" || !/^-?\d+$/.test(value)) {
    feedback.textContent = "Type or tap your answer first.";
    feedback.className = "feedback feedback-try-again";
    return;
  }

  const answer = Number(value);
  currentExercise.firstAnswer = answer;
  currentExercise.isCorrect = answer === currentExercise.correctAnswer;
  const isCorrect = currentExercise.isCorrect;
  showAnswerFeedback(isCorrect);
  finishCurrentExercise(false);
  createQuestion();
  feedback.textContent = isCorrect
    ? username ? `That’s right, ${username}! Great job!` : "That’s right! Great job!"
    : username ? `Not quite, ${username}. Keep going!` : "Not quite.";
  feedback.className = `feedback ${isCorrect ? "feedback-correct" : "feedback-try-again"}`;
  updateScore();
});

numberPadButtons.forEach((button) => {
  const digit = button.dataset.digit;
  if (!digit) return;

  button.addEventListener("click", () => {
    if (!sessionActive) return;
    answerInput.value += digit;
    answerInput.focus({ preventScroll: true });
    clearFeedback();
  });
});

deleteDigitButton.addEventListener("click", () => {
  if (!sessionActive) return;
  answerInput.value = answerInput.value.slice(0, -1);
  answerInput.focus({ preventScroll: true });
  clearFeedback();
});

clearAnswerButton.addEventListener("click", () => {
  if (!sessionActive) return;
  answerInput.value = "";
  answerInput.focus({ preventScroll: true });
  clearFeedback();
});

answerInput.addEventListener("input", () => {
  if (!sessionActive) return;
  checkLabel.textContent = "Check answer";
  clearFeedback();
});

newQuestionButton.addEventListener("click", () => {
  if (!sessionActive) return;
  finishCurrentExercise(true);
  createQuestion();
  updateScore();
});

sessionToggleButton.addEventListener("click", () => {
  if (sessionActive) {
    stopSession();
  } else {
    startSession();
  }
});

operationCheckboxes.forEach((checkbox) => {
  checkbox.addEventListener("change", updateSessionControls);
});

mistakesOnlyCheckbox.addEventListener("change", renderResults);
closeResultsButton.addEventListener("click", () => resultsDialog.close());
usernameForm.addEventListener("submit", (event) => {
  event.preventDefault();
  saveUsername(usernameInput.value);
});
clearUsernameButton.addEventListener("click", clearUsername);

setPracticeVisible(false);
updateSessionControls();
updateScore();
loadUsername();
