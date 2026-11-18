import { describe, expect, it } from "vitest";
import {
  getStoredLanguage,
  getStoredUsername,
  storeLanguage,
  storeTheme,
  storeUsername,
} from "./storage.js";

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

  it("stores the selected language and username", () => {
    const storage = createStorage();
    storeLanguage("nl-BE", storage);
    storeUsername("Ada", storage);
    expect(getStoredLanguage(storage)).toBe("nl-BE");
    expect(getStoredUsername(storage)).toBe("Ada");
  });
});
