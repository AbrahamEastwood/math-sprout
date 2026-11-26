import { describe, expect, it } from "vitest";
import { translations } from "./translations.js";

describe("translations", () => {
  it.each(["nl-BE", "de"])("provides all keys for %s", (locale) => {
    expect(Object.keys(translations.en).sort()).toEqual(
      Object.keys(translations[locale]).sort(),
    );
  });

  it.each(["nl-BE", "de"])("preserves interpolation placeholders in %s", (locale) => {
    for (const key of Object.keys(translations.en)) {
      const englishPlaceholders = [...translations.en[key].matchAll(/\{(\w+)\}/g)]
        .map((match) => match[1])
        .sort();
      const localizedPlaceholders = [...translations[locale][key].matchAll(/\{(\w+)\}/g)]
        .map((match) => match[1])
        .sort();

      expect(localizedPlaceholders, key).toEqual(englishPlaceholders);
    }
  });
});
