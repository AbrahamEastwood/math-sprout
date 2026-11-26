import { describe, expect, it } from "vitest";
import {
  getStoredExerciseSelection,
  getStoredLanguage,
  getStoredLeaderboards,
  getStoredUsername,
  storeExerciseSelection,
  storeLanguage,
  storeLeaderboards,
  storeTheme,
  storeUsername,
} from "./storage.js";

const exerciseSelection = {
  selectedOperations: ["addition", "multiplication"],
  addition: { maxLeft: 20, maxRight: 30, maxResult: 50 },
  subtraction: { maxLeft: 10, maxRight: 10, maxResult: 10 },
  multiplicationTables: [2, 5, 12],
  divisionTables: [1, 3, 10],
  practiceMode: "time-limit",
  practiceTarget: 5,
};

function createStorage(initialValues = {}) {
  const values = new Map(Object.entries(initialValues));
  return {
    getItem(key) {
      return values.get(key) ?? null;
    },
    setItem(key, value) {
      values.set(key, String(value));
    },
    removeItem(key) {
      values.delete(key);
    },
    values,
  };
}

describe("browser storage helpers", () => {
  it("only returns supported saved languages", () => {
    expect(getStoredLanguage(createStorage({ "math-sprout.language": "en" }))).toBe("en");
    expect(getStoredLanguage(createStorage({ "math-sprout.language": "nl-BE" }))).toBe("nl-BE");
    expect(getStoredLanguage(createStorage({ "math-sprout.language": "de" }))).toBe("de");
    expect(getStoredLanguage(createStorage({ "math-sprout.language": "fr" }))).toBeNull();
  });

  it("trims saved usernames and removes whitespace-only values", () => {
    const storage = createStorage({ "math-sprout.username": "  Ada  " });
    expect(getStoredUsername(storage)).toBe("Ada");

    const emptyStorage = createStorage({ "math-sprout.username": "   " });
    expect(getStoredUsername(emptyStorage)).toBeNull();
    expect(emptyStorage.values.has("math-sprout.username")).toBe(false);
  });

  it("stores the selected theme as JSON", () => {
    const storage = createStorage();
    storeTheme({ color: "blue", mode: "dark" }, storage);
    expect(storage.getItem("math-sprout.theme")).toBe('{"color":"blue","mode":"dark"}');
  });

  it("stores and restores the global exercise selection independently", () => {
    const storage = createStorage({ "math-sprout.username": "Ada" });
    storeExerciseSelection(exerciseSelection, storage);
    expect(storage.getItem("math-sprout.exercise-selection")).toBe(JSON.stringify(exerciseSelection));
    expect(getStoredExerciseSelection(storage)).toEqual(exerciseSelection);
    expect(storage.getItem("math-sprout.username")).toBe("Ada");
  });

  it("restores older selections and modes without a selected target", () => {
    const legacySelection = { ...exerciseSelection };
    delete legacySelection.practiceMode;
    delete legacySelection.practiceTarget;
    const storage = createStorage({
      "math-sprout.exercise-selection": JSON.stringify(legacySelection),
    });
    expect(getStoredExerciseSelection(storage)).toMatchObject({
      ...legacySelection,
      practiceMode: null,
      practiceTarget: null,
    });

    expect(
      getStoredExerciseSelection(
        createStorage({
          "math-sprout.exercise-selection": JSON.stringify({
            ...exerciseSelection,
            practiceTarget: null,
          }),
        }),
      ),
    ).toMatchObject({ practiceMode: "time-limit", practiceTarget: null });
  });

  it("returns no saved selection when it is missing or malformed", () => {
    expect(getStoredExerciseSelection(createStorage())).toBeNull();
    expect(
      getStoredExerciseSelection(createStorage({ "math-sprout.exercise-selection": "{" })),
    ).toBeNull();
    expect(
      getStoredExerciseSelection(
        createStorage({
          "math-sprout.exercise-selection": JSON.stringify({
            ...exerciseSelection,
            multiplicationTables: [13],
          }),
        }),
      ),
    ).toBeNull();
    expect(
      getStoredExerciseSelection(
        createStorage({
          "math-sprout.exercise-selection": JSON.stringify({
            ...exerciseSelection,
            practiceTarget: 4,
          }),
        }),
      ),
    ).toBeNull();
  });

  it("stores the selected language and username", () => {
    const storage = createStorage();
    storeLanguage("nl-BE", storage);
    storeUsername("Ada", storage);
    expect(getStoredLanguage(storage)).toBe("nl-BE");
    expect(getStoredUsername(storage)).toBe("Ada");
  });

  it("stores and restores shared leaderboards while discarding malformed entries", () => {
    const storage = createStorage();
    const entry = {
      name: "Ada",
      correct: 8,
      total: 10,
      accuracy: 0.8,
      target: 5,
      mode: "time-limit",
      elapsedMilliseconds: 300_000,
    };
    const leaderboards = { "time-limit": [entry], "exercise-count": [] };
    storeLeaderboards(leaderboards, storage);
    expect(getStoredLeaderboards(storage)).toEqual(leaderboards);

    storage.setItem("math-sprout.leaderboards", JSON.stringify({
      "time-limit": [entry, { ...entry, accuracy: 0.5 }],
      "exercise-count": "invalid",
    }));
    expect(getStoredLeaderboards(storage)).toEqual({
      "time-limit": [entry],
      "exercise-count": [],
    });
  });

  it("returns empty leaderboards for missing or malformed saved data", () => {
    expect(getStoredLeaderboards(createStorage())).toEqual({
      "time-limit": [],
      "exercise-count": [],
    });
    expect(getStoredLeaderboards(createStorage({
      "math-sprout.leaderboards": "{",
    }))).toEqual({
      "time-limit": [],
      "exercise-count": [],
    });
  });
});
