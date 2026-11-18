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

const themeColors = [
  { id: "red", wheelColor: "#d97880" },
  { id: "orange", wheelColor: "#e49b63" },
  { id: "yellow", wheelColor: "#d9bd55" },
  { id: "green", wheelColor: "#70aa83" },
  { id: "blue", wheelColor: "#6d96c6" },
  { id: "indigo", wheelColor: "#8076b5" },
  { id: "violet", wheelColor: "#a18ad0" },
];
const themeStorageKey = "math-sprout.theme";
let selectedTheme = {
  color: document.documentElement.dataset.themeColor,
  mode: document.documentElement.dataset.themeMode,
};
let pendingTheme = { ...selectedTheme };

const translations = {
  en: {
    pageTitle: "Math Sprout — Maths Practice",
    metaDescription: "A friendly place for kids to practise their maths.",
    tagline: "A little practice goes a long way",
    languageLabel: "Language",
    englishLanguage: "English",
    dutchLanguage: "Dutch",
    chooseThemeColor: "Choose theme color",
    themeSettings: "Theme settings",
    themeColors: "Theme colors",
    themeRed: "Red",
    themeOrange: "Orange",
    themeYellow: "Yellow",
    themeGreen: "Green",
    themeBlue: "Blue",
    themeIndigo: "Indigo",
    themeViolet: "Violet",
    lightMode: "Light",
    darkMode: "Dark mode",
    cancel: "Cancel",
    themeStorageUnavailable: "Theme applies for this visit, but could not be saved in this browser.",
    usernamePrompt: "What should we call you?",
    usernamePlaceholder: "Add a username",
    save: "Save",
    clear: "Clear",
    chooseExercises: "Choose your exercises",
    addition: "Addition",
    subtraction: "Subtraction",
    multiplication: "Multiplication",
    division: "Division",
    additionLimits: "Addition limits",
    subtractionLimits: "Subtraction limits",
    maximumResult: "Maximum result",
    maximumLeftNumber: "Maximum left number",
    maximumRightNumber: "Maximum right number",
    multiplicationTables: "Multiplication tables",
    divisionTables: "Division tables",
    start: "Start",
    stop: "Stop",
    score: "Score: {correct} / {total}",
    time: "Time",
    intro: "Choose what you’d like to practise, then press Start.",
    questionPrompt: "What is…?",
    answerLabel: "Your answer",
    checkAnswer: "Check answer",
    numberPad: "Number pad",
    clearAnswer: "Clear answer",
    deleteLastDigit: "Delete last digit",
    newQuestion: "New question",
    sessionResults: "Session results",
    personalizedResults: "{name}’s session results",
    showMistakesOnly: "Show mistakes only",
    noExercises: "No recorded exercises yet.",
    noMistakes: "No mistakes in this session.",
    totalTime: "Total time",
    averageTime: "Average time",
    perExercise: "per exercise",
    close: "Close",
    footerNote: "Take your time — you’re doing great!",
    enterUsername: "Enter a username or clear it to use a generic name.",
    savedAs: "Saved as {name}.",
    usingForVisit: "Using {name} for this visit.",
    usernameCleared: "Username cleared.",
    usernameClearedForVisit: "Username cleared for this visit.",
    welcomeBack: "Welcome back, {name}!",
    languageForVisit: "Language will be used for this visit.",
    sessionComplete: "Session complete{name}! Press Start to practise again.",
    typeAnswer: "Type or tap your answer first.",
    correctFeedback: "That’s right{name}! Great job!",
    incorrectFeedback: "Not quite{name}. Keep going!",
    skippedAnswer: "Skipped — no answer submitted",
    answer: "Answer: {answer}",
    correctAnswer: "Correct answer: {answer}",
    correct: "Correct",
    incorrect: "Incorrect",
  },
  "nl-BE": {
    pageTitle: "Math Sprout — Oefen je rekenen",
    metaDescription: "Een fijne plek waar kinderen hun rekenvaardigheden oefenen.",
    tagline: "Een beetje oefenen helpt je vooruit",
    languageLabel: "Taal",
    englishLanguage: "Engels",
    dutchLanguage: "Nederlands",
    chooseThemeColor: "Kies een themakleur",
    themeSettings: "Thema-instellingen",
    themeColors: "Themakleuren",
    themeRed: "Rood",
    themeOrange: "Oranje",
    themeYellow: "Geel",
    themeGreen: "Groen",
    themeBlue: "Blauw",
    themeIndigo: "Indigo",
    themeViolet: "Violet",
    lightMode: "Licht",
    darkMode: "Donkere modus",
    cancel: "Annuleren",
    themeStorageUnavailable: "Het thema geldt voor dit bezoek, maar kon niet in deze browser worden opgeslagen.",
    usernamePrompt: "Hoe mogen we je noemen?",
    usernamePlaceholder: "Vul een gebruikersnaam in",
    save: "Opslaan",
    clear: "Wissen",
    chooseExercises: "Kies je oefeningen",
    addition: "Optellen",
    subtraction: "Aftrekken",
    multiplication: "Vermenigvuldigen",
    division: "Delen",
    additionLimits: "Grenzen voor optellen",
    subtractionLimits: "Grenzen voor aftrekken",
    maximumResult: "Maximaal antwoord",
    maximumLeftNumber: "Maximaal getal links",
    maximumRightNumber: "Maximaal getal rechts",
    multiplicationTables: "Maaltafels",
    divisionTables: "Deeltafels",
    start: "Start",
    stop: "Stoppen",
    score: "Score: {correct} / {total}",
    time: "Tijd",
    intro: "Kies wat je wilt oefenen en druk daarna op Start.",
    questionPrompt: "Hoeveel is…?",
    answerLabel: "Jouw antwoord",
    checkAnswer: "Controleer je antwoord",
    numberPad: "Cijfertoetsen",
    clearAnswer: "Antwoord wissen",
    deleteLastDigit: "Laatste cijfer wissen",
    newQuestion: "Nieuwe vraag",
    sessionResults: "Resultaten van de sessie",
    personalizedResults: "Resultaten van {name}",
    showMistakesOnly: "Toon alleen fouten",
    noExercises: "Er zijn nog geen oefeningen geregistreerd.",
    noMistakes: "Geen fouten in deze sessie.",
    totalTime: "Totale tijd",
    averageTime: "Gemiddelde tijd",
    perExercise: "per oefening",
    close: "Sluiten",
    footerNote: "Neem je tijd — je doet het geweldig!",
    enterUsername: "Vul een gebruikersnaam in of wis die om een algemene naam te gebruiken.",
    savedAs: "Opgeslagen als {name}.",
    usingForVisit: "{name} wordt alleen deze keer gebruikt.",
    usernameCleared: "Gebruikersnaam gewist.",
    usernameClearedForVisit: "Gebruikersnaam voor deze keer gewist.",
    welcomeBack: "Welkom terug, {name}!",
    languageForVisit: "De taal wordt alleen deze keer gebruikt.",
    sessionComplete: "Sessie afgelopen{name}! Druk op Start om opnieuw te oefenen.",
    typeAnswer: "Typ of tik eerst je antwoord.",
    correctFeedback: "Dat klopt{name}! Goed gedaan!",
    incorrectFeedback: "Niet helemaal{name}. Blijf proberen!",
    skippedAnswer: "Overgeslagen — geen antwoord ingevuld",
    answer: "Antwoord: {answer}",
    correctAnswer: "Juiste antwoord: {answer}",
    correct: "Juist",
    incorrect: "Fout",
  },
};

const operations = {
  addition: {
    symbol: "+",
    makeNumbers({ maxResult, maxLeft, maxRight }) {
      const first = randomNumber(Math.min(maxLeft, maxResult - 1));
      const second = randomNumber(Math.min(maxRight, maxResult - first));
      return [first, second];
    },
    calculate(first, second) {
      return first + second;
    },
  },
  subtraction: {
    symbol: "−",
    makeNumbers({ maxResult, maxLeft, maxRight }) {
      const second = randomNumber(Math.min(maxRight, maxLeft));
      const first = randomNumberBetween(second, Math.min(maxLeft, second + maxResult));
      return [first, second];
    },
    calculate(first, second) {
      return first - second;
    },
  },
  multiplication: {
    symbol: "×",
    makeNumbers({ tables }) {
      return [randomNumber(10), randomChoice(tables)];
    },
    calculate(first, second) {
      return first * second;
    },
  },
  division: {
    symbol: "÷",
    makeNumbers({ tables }) {
      const divisor = randomChoice(tables);
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
const languageStorageKey = "math-sprout.language";
let username = "";
let language = "nl-BE";
let currentFeedback = null;
let currentUsernameStatus = null;
let settingsCollapsed = false;

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
    localStorage.setItem(themeStorageKey, JSON.stringify(theme));
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
      localStorage.setItem(languageStorageKey, language);
    } catch {
      setUsernameStatus("languageForVisit");
    }
  }
}

function loadLanguage() {
  try {
    const savedLanguage = localStorage.getItem(languageStorageKey);
    if (savedLanguage === "en" || savedLanguage === "nl-BE") {
      language = savedLanguage;
    }
  } catch {
    language = "en";
  }
  applyTranslations();
}

function randomNumber(max) {
  return Math.floor(Math.random() * max) + 1;
}

function randomNumberBetween(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomChoice(values) {
  return values[Math.floor(Math.random() * values.length)];
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

function updateTimer() {
  const milliseconds = sessionActive ? performance.now() - sessionStartedAt : sessionElapsed;
  elapsedTime.textContent = formatDuration(milliseconds);
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
    localStorage.setItem(usernameStorageKey, username);
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
    localStorage.removeItem(usernameStorageKey);
    setUsernameStatus("usernameCleared");
  } catch {
    setUsernameStatus("usernameClearedForVisit");
  }
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
        setUsernameStatus("welcomeBack", { name: username });
      } else {
        localStorage.removeItem(usernameStorageKey);
      }
    }
  } catch {
    currentUsernameStatus = null;
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

  const scoreText = translate("score", { correct: correctCount, total: exerciseCount });
  scoreCounter.textContent = scoreText;
  resultsScore.textContent = scoreText;
}

function updateSessionControls() {
  sessionToggleButton.textContent = translate(sessionActive ? "stop" : "start");
  const selected = selectedOperations();
  sessionToggleButton.disabled =
    !sessionActive && (selected.length === 0 || !selected.every(operationSettingsAreValid));
  usernameForm.hidden = settingsCollapsed;
  operationPicker.hidden = settingsCollapsed;
  usernameDisplay.hidden = !settingsCollapsed || !username;
  displayUsername.textContent = username;
  operationPicker.disabled = sessionActive;
  Object.entries(operationSettings).forEach(([operationKey, settings]) => {
    settings.hidden = !selected.includes(operationKey);
    settings.disabled = sessionActive;
  });
  sessionMetrics.hidden = sessionStartedAt === null;
}

function createQuestion() {
  const selected = selectedOperations();
  const operationKey = selected[Math.floor(Math.random() * selected.length)];
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

  const visibleResults = resultsList.children.length;
  resultsEmpty.hidden = visibleResults > 0;
  resultsEmpty.textContent = results.length === 0
    ? translate("noExercises")
    : translate("noMistakes");

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
  intro.textContent = translate("sessionComplete", { name: username ? `, ${username}` : "" });
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
    setFeedback("typeAnswer", {}, "feedback feedback-try-again");
    return;
  }

  const answer = Number(value);
  currentExercise.firstAnswer = answer;
  currentExercise.isCorrect = answer === currentExercise.correctAnswer;
  const isCorrect = currentExercise.isCorrect;
  showAnswerFeedback(isCorrect);
  finishCurrentExercise(false);
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

tableCheckboxes.forEach((checkbox) => {
  checkbox.addEventListener("change", updateSessionControls);
});
Object.values(limitInputs).forEach((inputs) => {
  Object.values(inputs).forEach((input) => input.addEventListener("input", updateSessionControls));
});

mistakesOnlyCheckbox.addEventListener("change", renderResults);
closeResultsButton.addEventListener("click", () => resultsDialog.close());
resultsDialog.addEventListener("close", () => {
  settingsCollapsed = false;
  updateSessionControls();
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
setPracticeVisible(false);
updateSessionControls();
updateScore();
loadLanguage();
loadUsername();
