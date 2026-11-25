import { operations, randomChoice } from "./exercises/operations.js";
import {
  getStoredExerciseSelection,
  getStoredLanguage,
  getStoredLeaderboards,
  getStoredUsername,
  removeStoredUsername,
  storeExerciseSelection,
  storeLanguage,
  storeLeaderboards,
  storeTheme,
  storeUsername,
} from "./storage.js";
import {
  createExerciseResult,
  EXERCISE_COUNT_TARGETS,
  getSessionProgress,
  getSessionScore,
  hasExerciseResult,
  isValidPracticeTarget,
  shouldEndSession,
  TIME_LIMIT_TARGETS_MINUTES,
} from "./practice/session.js";
import {
  addLeaderboardEntry,
  createLeaderboardEntry,
  LEADERBOARD_DISPLAY_LIMIT,
} from "./practice/leaderboard.js";
import { translations } from "./translations.js";
import { renderSessionResults } from "./ui/results.js";

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
const operationSettings = {
  addition: document.querySelector("#addition-settings"),
  subtraction: document.querySelector("#subtraction-settings"),
  multiplication: document.querySelector("#multiplication-settings"),
  division: document.querySelector("#division-settings"),
};
const limitInputs = {
  addition: {
    maxResult: document.querySelector("#addition-max-result"),
    maxLeft: document.querySelector("#addition-max-left"),
    maxRight: document.querySelector("#addition-max-right"),
  },
  subtraction: {
    maxResult: document.querySelector("#subtraction-max-result"),
    maxLeft: document.querySelector("#subtraction-max-left"),
    maxRight: document.querySelector("#subtraction-max-right"),
  },
};
const tableCheckboxes = document.querySelectorAll('input[name^="table-"]');
const numberPadButtons = document.querySelectorAll(".number-key");
const deleteDigitButton = document.querySelector("#delete-digit");
const clearAnswerButton = document.querySelector("#clear-answer");
const sessionToggleButton = document.querySelector("#session-toggle");
const practiceModePicker = document.querySelector("#practice-mode-picker");
const practiceModeSelect = document.querySelector("#practice-mode");
const practiceTargetLabel = document.querySelector("#practice-target-label");
const practiceTargetSelect = document.querySelector("#practice-target");
const sessionMetrics = document.querySelector("#session-metrics");
const sessionProgress = document.querySelector("#session-progress");
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
const usernameDisplay = document.querySelector("#username-display");
const displayUsername = document.querySelector("#display-username");
const usernameInput = document.querySelector("#username");
const clearUsernameButton = document.querySelector("#clear-username");
const usernameStatus = document.querySelector("#username-status");
const resultsTitle = document.querySelector("#results-title");
const languageToggle = document.querySelector("#language-toggle");
const languageOptionsMenu = document.querySelector("#language-options");
const languageOptions = document.querySelectorAll(".language-option");
const selectedLanguage = document.querySelector("#selected-language");
const selectedLanguageFlags = document.querySelectorAll("[data-selected-language-flag]");
const descriptionMeta = document.querySelector('meta[name="description"]');
const themePickerButton = document.querySelector("#theme-picker-button");
const themeDialog = document.querySelector("#theme-dialog");
const themeDialogClose = document.querySelector("#theme-dialog-close");
const themeCancelButton = document.querySelector("#theme-cancel");
const themeSaveButton = document.querySelector("#theme-save");
const themeSegments = [...document.querySelectorAll(".theme-segment")];
const themeModeSwitch = document.querySelector("#theme-mode-switch");
const themeModeLabel = document.querySelector("#theme-mode-label");
const themeStatus = document.querySelector("#theme-status");
const highScoresButton = document.querySelector("#high-scores-button");
const leaderboardDialog = document.querySelector("#leaderboard-dialog");
const leaderboardCloseButton = document.querySelector("#leaderboard-close-button");
const closeLeaderboardButton = document.querySelector("#close-leaderboard-button");
const leaderboardInfoButton = document.querySelector("#leaderboard-info-button");
const leaderboardInfo = document.querySelector("#leaderboard-info");
const leaderboardStorageWarning = document.querySelector("#leaderboard-storage-warning");
const leaderboardTabs = [...document.querySelectorAll(".leaderboard-tab")];
const leaderboardPanel = document.querySelector("#leaderboard-panel");
const leaderboardList = document.querySelector("#leaderboard-list");
const leaderboardEmpty = document.querySelector("#leaderboard-empty");

const themeColors = [
  { id: "red", wheelColor: "#d97880" },
  { id: "orange", wheelColor: "#e49b63" },
  { id: "yellow", wheelColor: "#d9bd55" },
  { id: "green", wheelColor: "#70aa83" },
  { id: "blue", wheelColor: "#6d96c6" },
  { id: "indigo", wheelColor: "#8076b5" },
  { id: "violet", wheelColor: "#a18ad0" },
];
let selectedTheme = {
  color: document.documentElement.dataset.themeColor,
  mode: document.documentElement.dataset.themeMode,
};
let pendingTheme = { ...selectedTheme };

let currentExercise = null;
let results = [];
let sessionStartedAt = null;
let sessionElapsed = 0;
let sessionActive = false;
let activePracticeMode = null;
let activePracticeTarget = null;
let timerInterval;
let username = "";
let language = "nl-BE";
let currentFeedback = null;
let currentUsernameStatus = null;
let settingsCollapsed = false;
let leaderboards = { "time-limit": [], "exercise-count": [] };
let leaderboardStorageAvailable = true;
let activeLeaderboardMode = "time-limit";

function translate(key, values = {}) {
  return translations[language][key].replace(/\{(\w+)\}/g, (_, name) => values[name] ?? "");
}

function applyTranslations() {
  document.documentElement.lang = language;
  document.title = translate("pageTitle");
  descriptionMeta.content = translate("metaDescription");
  document.querySelectorAll("[data-i18n]").forEach((element) => {
    element.textContent = translate(element.dataset.i18n);
  });
  document.querySelectorAll("[data-i18n-placeholder]").forEach((element) => {
    element.placeholder = translate(element.dataset.i18nPlaceholder);
  });
  document.querySelectorAll("[data-i18n-aria-label]").forEach((element) => {
    element.setAttribute("aria-label", translate(element.dataset.i18nAriaLabel));
  });
  document.querySelectorAll("[data-i18n-title]").forEach((element) => {
    element.title = translate(element.dataset.i18nTitle);
  });
  renderPracticeTargetOptions();
  updateLanguagePicker();
  updateThemeModeLabel();
  if (currentFeedback) {
    feedback.textContent = translate(currentFeedback.key, currentFeedback.values);
  }
  if (currentUsernameStatus) {
    usernameStatus.textContent = translate(currentUsernameStatus.key, currentUsernameStatus.values);
  }
  updatePersonalizedText();
  updateSessionControls();
  updateScore();
  if (resultsDialog.open) renderResults();
  if (leaderboardDialog.open) renderLeaderboard();
}

function setUsernameStatus(key, values = {}, isError = false) {
  currentUsernameStatus = { key, values };
  usernameStatus.textContent = translate(key, values);
  usernameStatus.className = isError
    ? "username-status username-status-error"
    : "username-status";
}

function setFeedback(key, values = {}, className = "feedback") {
  currentFeedback = { key, values };
  feedback.textContent = translate(key, values);
  feedback.className = className;
}

function updateLanguagePicker() {
  selectedLanguage.textContent = translate(language === "en" ? "englishLanguage" : "dutchLanguage");
  selectedLanguageFlags.forEach((flag) => {
    flag.classList.toggle("language-flag-hidden", flag.dataset.selectedLanguageFlag !== language);
  });
  languageOptions.forEach((option) => {
    option.setAttribute("aria-pressed", String(option.dataset.language === language));
  });
}

function updateThemeModeLabel() {
  themeModeLabel.textContent = translate(pendingTheme.mode === "dark" ? "darkMode" : "lightMode");
}

function updateThemeSelection() {
  const center = 120;
  const radius = 110;
  themeSegments.forEach((segment, index) => {
    const color = themeColors[index];
    const startAngle = (-90 + index * 360 / themeColors.length) * Math.PI / 180;
    const endAngle = (-90 + (index + 1) * 360 / themeColors.length) * Math.PI / 180;
    const startX = center + radius * Math.cos(startAngle);
    const startY = center + radius * Math.sin(startAngle);
    const endX = center + radius * Math.cos(endAngle);
    const endY = center + radius * Math.sin(endAngle);
    const isSelected = color.id === pendingTheme.color;

    segment.setAttribute(
      "d",
      `M ${center} ${center} L ${startX} ${startY} A ${radius} ${radius} 0 0 1 ${endX} ${endY} Z`,
    );
    segment.setAttribute("fill", color.wheelColor);
    segment.setAttribute("aria-checked", String(isSelected));
    segment.setAttribute("tabindex", isSelected ? "0" : "-1");
    segment.classList.toggle("is-selected", isSelected);
  });
  themeModeSwitch.checked = pendingTheme.mode === "dark";
  updateThemeModeLabel();
}

function applyTheme(theme) {
  selectedTheme = { ...theme };
  document.documentElement.dataset.themeColor = theme.color;
  document.documentElement.dataset.themeMode = theme.mode;
  document.querySelector('meta[name="theme-color"]').content =
    getComputedStyle(document.documentElement).getPropertyValue("--page-background").trim();
}

function openThemeDialog() {
  closeLanguageMenu();
  pendingTheme = { ...selectedTheme };
  themeStatus.hidden = true;
  themeDialog.showModal();
  updateThemeSelection();
  themeSegments.find((segment) => segment.dataset.themeColor === pendingTheme.color).focus();
}

function selectPendingThemeColor(color) {
  if (!themeColors.some((themeColor) => themeColor.id === color)) return;
  pendingTheme.color = color;
  updateThemeSelection();
}

function saveTheme() {
  const theme = { ...pendingTheme };
  applyTheme(theme);
  try {
    storeTheme(theme);
    themeDialog.close();
  } catch {
    themeStatus.textContent = translate("themeStorageUnavailable");
    themeStatus.hidden = false;
  }
}

function setLanguageMenuOpen(isOpen, focusIndex = 0) {
  languageOptionsMenu.hidden = !isOpen;
  languageToggle.setAttribute("aria-expanded", String(isOpen));
  if (isOpen) languageOptions[focusIndex].focus();
}

function closeLanguageMenu(restoreFocus = false) {
  if (languageOptionsMenu.hidden) return;
  setLanguageMenuOpen(false);
  if (restoreFocus) languageToggle.focus();
}

function setLanguage(value, persist = true) {
  language = value === "nl-BE" ? "nl-BE" : "en";
  applyTranslations();
  closeLanguageMenu(true);
  if (persist) {
    try {
      storeLanguage(language);
    } catch {
      setUsernameStatus("languageForVisit");
    }
  }
}

function loadLanguage() {
  try {
    language = getStoredLanguage() ?? language;
  } catch {
    language = "en";
  }
  applyTranslations();
}

function selectedOperations() {
  return [...operationCheckboxes]
    .filter((checkbox) => checkbox.checked)
    .map((checkbox) => checkbox.value);
}

function selectedTables(operationKey) {
  return [...document.querySelectorAll(`input[name="table-${operationKey}"]:checked`)]
    .map((checkbox) => Number(checkbox.value));
}

function restoreExerciseSelection() {
  try {
    const selection = getStoredExerciseSelection();
    if (!selection) return;

    operationCheckboxes.forEach((checkbox) => {
      checkbox.checked = selection.selectedOperations.includes(checkbox.value);
    });
    Object.entries(limitInputs).forEach(([operationKey, inputs]) => {
      Object.entries(inputs).forEach(([key, input]) => {
        input.value = String(selection[operationKey][key]);
      });
    });
    tableCheckboxes.forEach((checkbox) => {
      const operationKey = checkbox.name.slice("table-".length);
      const tables = selection[`${operationKey}Tables`];
      checkbox.checked = tables.includes(Number(checkbox.value));
    });
    practiceModeSelect.value = selection.practiceMode ?? "";
    renderPracticeTargetOptions();
    practiceTargetSelect.value = selection.practiceTarget === null
      ? ""
      : String(selection.practiceTarget);
  } catch {
    // Keep the page defaults if browser storage is unavailable.
  }
}

function saveExerciseSelection() {
  const limitsAreValid = Object.values(limitInputs).every((inputs) =>
    Object.values(inputs).every((input) => input.validity.valid));
  if (!limitsAreValid) {
    return;
  }

  const selection = {
    selectedOperations: selectedOperations(),
    addition: settingsForOperation("addition"),
    subtraction: settingsForOperation("subtraction"),
    multiplicationTables: selectedTables("multiplication"),
    divisionTables: selectedTables("division"),
    practiceMode: practiceModeSelect.value || null,
    practiceTarget: practiceTargetSelect.value === "" ? null : Number(practiceTargetSelect.value),
  };
  try {
    storeExerciseSelection(selection);
  } catch {
    // Keep the current-visit selection if browser storage is unavailable.
  }
}

function settingsForOperation(operationKey) {
  if (operationKey === "multiplication" || operationKey === "division") {
    return { tables: selectedTables(operationKey) };
  }
  return Object.fromEntries(
    Object.entries(limitInputs[operationKey]).map(([key, input]) => [key, input.valueAsNumber]),
  );
}

function operationSettingsAreValid(operationKey) {
  if (operationKey === "multiplication" || operationKey === "division") {
    return selectedTables(operationKey).length > 0;
  }
  return Object.values(limitInputs[operationKey]).every((input) => input.validity.valid);
}

function clearFeedback() {
  currentFeedback = null;
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

function shouldEndActiveSession(now = performance.now()) {
  return shouldEndSession(
    activePracticeMode,
    activePracticeTarget,
    results.length,
    now - sessionStartedAt,
  );
}

function updateTimer() {
  const now = performance.now();
  const milliseconds = sessionActive ? now - sessionStartedAt : sessionElapsed;
  elapsedTime.textContent = formatDuration(milliseconds);
  updateSessionProgress(now);
  if (sessionActive && shouldEndActiveSession(now)) {
    stopSession(true, now);
  }
}

function updatePersonalizedText() {
  const name = username ? `, ${username}` : "";
  resultsTitle.textContent = username
    ? translate("personalizedResults", { name: username })
    : translate("sessionResults");

  if (!sessionActive) {
    intro.textContent = sessionStartedAt === null
      ? translate("intro")
      : translate("sessionComplete", { name });
  }
}

function saveUsername(value) {
  const trimmedName = value.trim();

  if (trimmedName === "") {
    usernameInput.value = "";
    setUsernameStatus("enterUsername", {}, true);
    return;
  }

  username = trimmedName;
  usernameInput.value = username;
  clearUsernameButton.hidden = false;
  try {
    storeUsername(username);
    setUsernameStatus("savedAs", { name: username });
  } catch {
    setUsernameStatus("usingForVisit", { name: username });
  }
  updatePersonalizedText();
}

function clearUsername() {
  username = "";
  usernameInput.value = "";
  clearUsernameButton.hidden = true;
  try {
    removeStoredUsername();
    setUsernameStatus("usernameCleared");
  } catch {
    setUsernameStatus("usernameClearedForVisit");
  }
  updatePersonalizedText();
}

function loadUsername() {
  try {
    username = getStoredUsername() ?? "";
    if (username) {
      usernameInput.value = username;
      clearUsernameButton.hidden = false;
      setUsernameStatus("welcomeBack", { name: username });
    }
  } catch {
    currentUsernameStatus = null;
    usernameStatus.textContent = "";
  }
  updatePersonalizedText();
}

function updateScore() {
  const { correct, total } = getSessionScore(results, currentExercise);
  const scoreText = translate("score", { correct, total });
  scoreCounter.textContent = scoreText;
  resultsScore.textContent = scoreText;
  updateSessionProgress();
}

function updateSessionProgress(now = performance.now()) {
  const progress = getSessionProgress(
    activePracticeMode,
    activePracticeTarget,
    results.length,
    now - sessionStartedAt,
  );
  sessionProgress.hidden = !sessionActive || progress === null;
  sessionProgress.value = progress ?? 0;
}

function updateSessionControls() {
  sessionToggleButton.textContent = translate(sessionActive ? "stop" : "start");
  const selected = selectedOperations();
  const mode = practiceModeSelect.value;
  const target = practiceTargetSelect.value === "" ? null : Number(practiceTargetSelect.value);
  const hasValidPracticeMode = isValidPracticeTarget(mode, target);
  sessionToggleButton.disabled =
    !sessionActive &&
    (!hasValidPracticeMode || selected.length === 0 || !selected.every(operationSettingsAreValid));
  usernameForm.hidden = settingsCollapsed;
  practiceModePicker.hidden = settingsCollapsed;
  practiceModePicker.disabled = sessionActive;
  practiceTargetLabel.hidden = mode === "" || mode === "free-form";
  practiceTargetSelect.required = !practiceTargetLabel.hidden;
  operationPicker.hidden = settingsCollapsed || mode === "";
  operationPicker.disabled = sessionActive || mode === "";
  usernameDisplay.hidden = !settingsCollapsed || !username;
  displayUsername.textContent = username;
  Object.entries(operationSettings).forEach(([operationKey, settings]) => {
    settings.hidden = !selected.includes(operationKey);
    settings.disabled = sessionActive;
  });
  sessionMetrics.hidden = sessionStartedAt === null;
}

function createQuestion() {
  const selected = selectedOperations();
  const operationKey = randomChoice(selected);
  const selectedOperation = operations[operationKey];
  const [firstNumber, secondNumber] = selectedOperation.makeNumbers(settingsForOperation(operationKey));
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
  checkLabel.textContent = translate("checkAnswer");
  clearFeedback();
  answerInput.focus({ preventScroll: true });
}

function renderPracticeTargetOptions() {
  const mode = practiceModeSelect.value;
  const targetValues = mode === "exercise-count"
    ? EXERCISE_COUNT_TARGETS
    : mode === "time-limit"
      ? TIME_LIMIT_TARGETS_MINUTES
      : [];
  const selectedTarget = practiceTargetSelect.value;
  const placeholder = document.createElement("option");
  placeholder.value = "";
  placeholder.disabled = true;
  placeholder.selected = true;
  placeholder.textContent = translate("choosePracticeTarget");
  practiceTargetSelect.replaceChildren(placeholder);

  targetValues.forEach((value) => {
    const option = document.createElement("option");
    option.value = String(value);
    option.textContent = mode === "exercise-count"
      ? translate("exerciseCountTarget", { count: value })
      : translate("timeLimitTarget", { minutes: value });
    practiceTargetSelect.append(option);
  });

  if (targetValues.includes(Number(selectedTarget))) {
    practiceTargetSelect.value = selectedTarget;
  }
}

function finishCurrentExercise(skipped, finishedAt = performance.now()) {
  const result = createExerciseResult(currentExercise, skipped, finishedAt);
  if (result) results.push(result);
  currentExercise = null;
}

function showAnswerFeedback(isCorrect) {
  answerInput.classList.remove("answer-correct", "answer-incorrect");
  void answerInput.offsetWidth;
  answerInput.classList.add(isCorrect ? "answer-correct" : "answer-incorrect");
}

function startSession() {
  const mode = practiceModeSelect.value;
  const target = practiceTargetSelect.value === "" ? null : Number(practiceTargetSelect.value);
  if (
    !isValidPracticeTarget(mode, target) ||
    selectedOperations().length === 0 ||
    !selectedOperations().every(operationSettingsAreValid)
  ) return;

  results = [];
  activePracticeMode = mode;
  activePracticeTarget = target;
  sessionStartedAt = performance.now();
  sessionElapsed = 0;
  sessionActive = true;
  settingsCollapsed = true;
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
  renderSessionResults({
    results,
    showMistakesOnly: mistakesOnlyCheckbox.checked,
    resultsList,
    resultsEmpty,
    totalTimeText,
    averageTimeText,
    sessionElapsed,
    translate,
    formatDuration,
  });
}

function updateLeaderboardStorageWarning() {
  leaderboardStorageWarning.hidden = leaderboardStorageAvailable;
}

function selectLeaderboardMode(mode, focus = false) {
  activeLeaderboardMode = mode;
  leaderboardTabs.forEach((tab) => {
    const selected = tab.dataset.leaderboardMode === mode;
    tab.setAttribute("aria-selected", String(selected));
    tab.tabIndex = selected ? 0 : -1;
    if (selected) leaderboardPanel.setAttribute("aria-labelledby", tab.id);
    if (selected && focus) tab.focus();
  });
  renderLeaderboard();
}

function renderLeaderboard() {
  const entries = leaderboards[activeLeaderboardMode].slice(0, LEADERBOARD_DISPLAY_LIMIT);
  leaderboardList.replaceChildren();
  leaderboardEmpty.hidden = entries.length > 0;
  updateLeaderboardStorageWarning();

  entries.forEach((entry, index) => {
    const rank = index + 1;
    const item = document.createElement("li");
    item.className = "leaderboard-entry";

    const rankLabel = document.createElement("span");
    rankLabel.className = "leaderboard-rank";
    if (rank <= 3) {
      const trophy = document.createElementNS("http://www.w3.org/2000/svg", "svg");
      trophy.setAttribute("viewBox", "0 0 24 24");
      trophy.setAttribute("aria-hidden", "true");
      trophy.classList.add("leaderboard-trophy", `leaderboard-trophy-${rank}`);
      const trophyShape = document.createElementNS("http://www.w3.org/2000/svg", "path");
      trophyShape.setAttribute(
        "d",
        "M7 3h10v4h4v3a5 5 0 0 1-5 5h-2v3h4v3H6v-3h4v-3H8a5 5 0 0 1-5-5V7h4zm0 6H5v1a3 3 0 0 0 3 3H8a7 7 0 0 1-1-4zm10 0a7 7 0 0 1-1 4h0a3 3 0 0 0 3-3V9z",
      );
      trophy.append(trophyShape);
      rankLabel.append(trophy);
    }
    const visibleRank = document.createElement("span");
    visibleRank.setAttribute("aria-hidden", "true");
    visibleRank.textContent = `#${rank}`;
    const accessibleRank = document.createElement("span");
    accessibleRank.className = "visually-hidden";
    accessibleRank.textContent = translate("rank", { rank });
    rankLabel.append(visibleRank, accessibleRank);

    const details = document.createElement("div");
    details.className = "leaderboard-entry-details";
    const learnerName = document.createElement("strong");
    learnerName.className = "leaderboard-learner";
    learnerName.textContent = entry.name;
    const score = document.createElement("span");
    score.textContent = translate("leaderboardScore", {
      correct: entry.correct,
      total: entry.total,
    });
    const accuracy = document.createElement("span");
    accuracy.textContent = translate("leaderboardAccuracy", {
      accuracy: Math.round(entry.accuracy * 100),
    });
    const target = document.createElement("span");
    target.textContent = translate(
      entry.mode === "time-limit" ? "timeLimitTarget" : "exerciseCountTarget",
      entry.mode === "time-limit" ? { minutes: entry.target } : { count: entry.target },
    );
    details.append(learnerName, score, accuracy, target);
    item.append(rankLabel, details);
    leaderboardList.append(item);
  });
}

function stopSession(expired = false, stoppedAt = performance.now()) {
  if (!sessionActive) return;

  const endTime = expired && activePracticeMode === "time-limit"
    ? sessionStartedAt + activePracticeTarget * 60_000
    : stoppedAt;
  sessionElapsed = endTime - sessionStartedAt;
  window.clearInterval(timerInterval);
  sessionActive = false;

  if (!expired && hasExerciseResult(currentExercise)) {
    finishCurrentExercise(false, endTime);
  } else {
    currentExercise = null;
  }

  const entry = createLeaderboardEntry({
    mode: activePracticeMode,
    target: activePracticeTarget,
    results,
    elapsedMilliseconds: sessionElapsed,
    name: username,
  });
  if (entry) {
    leaderboards = addLeaderboardEntry(leaderboards, entry);
    try {
      storeLeaderboards(leaderboards);
      leaderboardStorageAvailable = true;
    } catch {
      leaderboardStorageAvailable = false;
    }
    updateLeaderboardStorageWarning();
  }

  setPracticeVisible(false);
  intro.textContent = translate("sessionComplete", { name: username ? `, ${username}` : "" });
  intro.hidden = false;
  updateSessionControls();
  updateScore();
  updateTimer();
  mistakesOnlyCheckbox.checked = mistakesOnlyCheckbox.defaultChecked;
  renderResults();
  resultsDialog.showModal();
}

answerForm.addEventListener("submit", (event) => {
  event.preventDefault();
  if (!sessionActive || !currentExercise) return;
  if (shouldEndActiveSession()) {
    stopSession(true);
    return;
  }

  const value = answerInput.value.trim();
  if (value === "" || !/^-?\d+$/.test(value)) {
    setFeedback("typeAnswer", {}, "feedback feedback-try-again");
    return;
  }

  const answer = Number(value);
  currentExercise.firstAnswer = answer;
  currentExercise.isCorrect = answer === currentExercise.correctAnswer;
  const isCorrect = currentExercise.isCorrect;
  showAnswerFeedback(isCorrect);
  finishCurrentExercise(false);
  if (shouldEndActiveSession()) {
    stopSession();
    return;
  }
  createQuestion();
  setFeedback(
    isCorrect ? "correctFeedback" : "incorrectFeedback",
    { name: username ? `, ${username}` : "" },
    `feedback ${isCorrect ? "feedback-correct" : "feedback-try-again"}`,
  );
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
  checkLabel.textContent = translate("checkAnswer");
  clearFeedback();
});

newQuestionButton.addEventListener("click", () => {
  if (!sessionActive) return;
  if (shouldEndActiveSession()) {
    stopSession(true);
    return;
  }
  finishCurrentExercise(true);
  if (shouldEndActiveSession()) {
    stopSession();
    return;
  }
  createQuestion();
  updateScore();
});

sessionToggleButton.addEventListener("click", () => {
  if (sessionActive) {
    const now = performance.now();
    if (shouldEndActiveSession(now)) {
      stopSession(true, now);
    } else {
      stopSession(false, now);
    }
  } else {
    startSession();
  }
});

operationCheckboxes.forEach((checkbox) => {
  checkbox.addEventListener("change", () => {
    saveExerciseSelection();
    updateSessionControls();
  });
});

practiceModeSelect.addEventListener("change", () => {
  renderPracticeTargetOptions();
  saveExerciseSelection();
  updateSessionControls();
});
practiceTargetSelect.addEventListener("change", () => {
  saveExerciseSelection();
  updateSessionControls();
});

tableCheckboxes.forEach((checkbox) => {
  checkbox.addEventListener("change", () => {
    saveExerciseSelection();
    updateSessionControls();
  });
});
Object.values(limitInputs).forEach((inputs) => {
  Object.values(inputs).forEach((input) =>
    input.addEventListener("input", () => {
      saveExerciseSelection();
      updateSessionControls();
    }),
  );
});

mistakesOnlyCheckbox.addEventListener("change", renderResults);
closeResultsButton.addEventListener("click", () => resultsDialog.close());
resultsDialog.addEventListener("close", () => {
  settingsCollapsed = false;
  updateSessionControls();
});
highScoresButton.addEventListener("click", () => {
  renderLeaderboard();
  leaderboardDialog.showModal();
});
leaderboardCloseButton.addEventListener("click", () => leaderboardDialog.close());
closeLeaderboardButton.addEventListener("click", () => leaderboardDialog.close());
leaderboardInfoButton.addEventListener("click", () => {
  const expanded = leaderboardInfoButton.getAttribute("aria-expanded") !== "true";
  leaderboardInfoButton.setAttribute("aria-expanded", String(expanded));
  leaderboardInfo.hidden = !expanded;
});
leaderboardTabs.forEach((tab, index) => {
  tab.addEventListener("click", () => selectLeaderboardMode(tab.dataset.leaderboardMode));
  tab.addEventListener("keydown", (event) => {
    if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;
    event.preventDefault();
    const nextIndex = (index + (event.key === "ArrowRight" ? 1 : -1) + leaderboardTabs.length)
      % leaderboardTabs.length;
    selectLeaderboardMode(leaderboardTabs[nextIndex].dataset.leaderboardMode, true);
  });
});
leaderboardDialog.addEventListener("click", (event) => {
  if (event.target === leaderboardDialog) leaderboardDialog.close();
});
usernameForm.addEventListener("submit", (event) => {
  event.preventDefault();
  saveUsername(usernameInput.value);
});
clearUsernameButton.addEventListener("click", clearUsername);
languageToggle.addEventListener("click", () => {
  setLanguageMenuOpen(languageOptionsMenu.hidden);
});
languageToggle.addEventListener("keydown", (event) => {
  if (event.key === "ArrowDown" || event.key === "ArrowUp") {
    event.preventDefault();
    setLanguageMenuOpen(true, event.key === "ArrowUp" ? languageOptions.length - 1 : 0);
  }
});
languageOptions.forEach((option, index) => {
  option.addEventListener("click", () => setLanguage(option.dataset.language));
  option.addEventListener("keydown", (event) => {
    let nextIndex;
    if (event.key === "ArrowDown") nextIndex = (index + 1) % languageOptions.length;
    if (event.key === "ArrowUp") nextIndex = (index - 1 + languageOptions.length) % languageOptions.length;
    if (event.key === "Home") nextIndex = 0;
    if (event.key === "End") nextIndex = languageOptions.length - 1;
    if (nextIndex !== undefined) {
      event.preventDefault();
      languageOptions[nextIndex].focus();
    } else if (event.key === "Escape") {
      event.preventDefault();
      closeLanguageMenu(true);
    }
  });
});
themePickerButton.addEventListener("click", openThemeDialog);
themeDialogClose.addEventListener("click", () => themeDialog.close());
themeCancelButton.addEventListener("click", () => themeDialog.close());
themeSaveButton.addEventListener("click", saveTheme);
themeModeSwitch.addEventListener("change", () => {
  pendingTheme.mode = themeModeSwitch.checked ? "dark" : "light";
  updateThemeModeLabel();
});
themeSegments.forEach((segment, index) => {
  segment.addEventListener("click", () => {
    selectPendingThemeColor(segment.dataset.themeColor);
    segment.focus();
  });
  segment.addEventListener("keydown", (event) => {
    let nextIndex = index;
    if (event.key === "ArrowRight" || event.key === "ArrowDown") {
      nextIndex = (index + 1) % themeSegments.length;
    } else if (event.key === "ArrowLeft" || event.key === "ArrowUp") {
      nextIndex = (index - 1 + themeSegments.length) % themeSegments.length;
    } else if (event.key === "Home") {
      nextIndex = 0;
    } else if (event.key === "End") {
      nextIndex = themeSegments.length - 1;
    } else if (event.key === " " || event.key === "Enter") {
      event.preventDefault();
      selectPendingThemeColor(segment.dataset.themeColor);
      return;
    } else {
      return;
    }

    event.preventDefault();
    const nextSegment = themeSegments[nextIndex];
    selectPendingThemeColor(nextSegment.dataset.themeColor);
    nextSegment.focus();
  });
});
themeDialog.addEventListener("click", (event) => {
  if (event.target === themeDialog) themeDialog.close();
});
document.addEventListener("click", (event) => {
  if (!event.target.closest(".language-picker")) closeLanguageMenu();
});

applyTheme(selectedTheme);
updateThemeSelection();
restoreExerciseSelection();
setPracticeVisible(false);
updateSessionControls();
updateScore();
loadLanguage();
loadUsername();
try {
  leaderboards = getStoredLeaderboards();
} catch {
  leaderboardStorageAvailable = false;
}
updateLeaderboardStorageWarning();
