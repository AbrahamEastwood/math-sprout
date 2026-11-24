import {
  EXERCISE_COUNT_TARGETS,
  isValidPracticeTarget,
  TIME_LIMIT_TARGETS_MINUTES,
} from "./practice/session.js";

const storageKeys = {
  theme: "math-sprout.theme",
  username: "math-sprout.username",
  language: "math-sprout.language",
  exerciseSelection: "math-sprout.exercise-selection",
  leaderboards: "math-sprout.leaderboards",
};

const operationKeys = ["addition", "subtraction", "multiplication", "division"];
const tableNumbers = Array.from({ length: 12 }, (_, index) => index + 1);
const emptyLeaderboards = () => ({ "time-limit": [], "exercise-count": [] });

export function storeTheme(theme, storage = localStorage) {
  storage.setItem(storageKeys.theme, JSON.stringify(theme));
}

export function storeExerciseSelection(selection, storage = localStorage) {
  storage.setItem(storageKeys.exerciseSelection, JSON.stringify(selection));
}

export function getStoredExerciseSelection(storage = localStorage) {
  const savedSelection = storage.getItem(storageKeys.exerciseSelection);
  if (!savedSelection) return null;

  let selection;
  try {
    selection = JSON.parse(savedSelection);
  } catch {
    return null;
  }

  if (
    !selection ||
    !Array.isArray(selection.selectedOperations) ||
    selection.selectedOperations.some((operation) => !operationKeys.includes(operation)) ||
    new Set(selection.selectedOperations).size !== selection.selectedOperations.length ||
    !isValidLimits(selection.addition, 2) ||
    !isValidLimits(selection.subtraction, 0) ||
    !isValidTables(selection.multiplicationTables) ||
    !isValidTables(selection.divisionTables) ||
    !isValidPracticeMode(selection.practiceMode ?? null, selection.practiceTarget ?? null)
  ) {
    return null;
  }

  return {
    ...selection,
    practiceMode: selection.practiceMode ?? null,
    practiceTarget: selection.practiceTarget ?? null,
  };
}

function isValidPracticeMode(mode, target) {
  if (mode === null) return target === null;
  if (mode === "free-form") return target === null;
  if (mode === "exercise-count") return target === null || EXERCISE_COUNT_TARGETS.includes(target);
  if (mode === "time-limit") return target === null || TIME_LIMIT_TARGETS_MINUTES.includes(target);
  return false;
}

function isValidLimits(limits, minimumResult) {
  return (
    limits &&
    Number.isInteger(limits.maxLeft) &&
    limits.maxLeft >= 1 &&
    limits.maxLeft <= 1000 &&
    Number.isInteger(limits.maxRight) &&
    limits.maxRight >= 1 &&
    limits.maxRight <= 1000 &&
    Number.isInteger(limits.maxResult) &&
    limits.maxResult >= minimumResult &&
    limits.maxResult <= 1000
  );
}

function isValidTables(tables) {
  return (
    Array.isArray(tables) &&
    tables.every((table) => tableNumbers.includes(table)) &&
    new Set(tables).size === tables.length
  );
}

export function storeLanguage(language, storage = localStorage) {
  storage.setItem(storageKeys.language, language);
}

export function getStoredLanguage(storage = localStorage) {
  const language = storage.getItem(storageKeys.language);
  return language === "en" || language === "nl-BE" ? language : null;
}

export function storeUsername(username, storage = localStorage) {
  storage.setItem(storageKeys.username, username);
}

export function removeStoredUsername(storage = localStorage) {
  storage.removeItem(storageKeys.username);
}

export function getStoredUsername(storage = localStorage) {
  const savedUsername = storage.getItem(storageKeys.username);
  if (!savedUsername) return null;

  const username = savedUsername.trim();
  if (!username) {
    removeStoredUsername(storage);
    return null;
  }
  return username;
}

export function storeLeaderboards(leaderboards, storage = localStorage) {
  storage.setItem(storageKeys.leaderboards, JSON.stringify(leaderboards));
}

export function getStoredLeaderboards(storage = localStorage) {
  const savedLeaderboards = storage.getItem(storageKeys.leaderboards);
  if (!savedLeaderboards) return emptyLeaderboards();

  let leaderboards;
  try {
    leaderboards = JSON.parse(savedLeaderboards);
  } catch {
    return emptyLeaderboards();
  }

  if (!leaderboards || typeof leaderboards !== "object") return emptyLeaderboards();
  return {
    "time-limit": getValidLeaderboardEntries(leaderboards["time-limit"], "time-limit"),
    "exercise-count": getValidLeaderboardEntries(
      leaderboards["exercise-count"],
      "exercise-count",
    ),
  };
}

function getValidLeaderboardEntries(entries, mode) {
  if (!Array.isArray(entries)) return [];
  return entries.filter((entry) => (
    entry &&
    typeof entry.name === "string" &&
    Number.isInteger(entry.correct) &&
    entry.correct >= 0 &&
    Number.isInteger(entry.total) &&
    entry.total > 0 &&
    entry.correct <= entry.total &&
    entry.accuracy === entry.correct / entry.total &&
    entry.mode === mode &&
    Number.isFinite(entry.elapsedMilliseconds) &&
    entry.elapsedMilliseconds > 0 &&
    isValidPracticeTarget(mode, entry.target)
  )).slice(0, 20);
}
