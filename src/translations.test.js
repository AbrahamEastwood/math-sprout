import { describe, expect, it } from "vitest";
import { translations } from "./translations.js";

describe("translations", () => {
  it("provides the same keys for every language", () => {
    expect(Object.keys(translations.en).sort()).toEqual(
      Object.keys(translations["nl-BE"]).sort(),
    );
  });

  it("uses the same interpolation placeholders for every language", () => {
    for (const key of Object.keys(translations.en)) {
      const englishPlaceholders = [...translations.en[key].matchAll(/\{(\w+)\}/g)]
        .map((match) => match[1])
        .sort();
      const dutchPlaceholders = [...translations["nl-BE"][key].matchAll(/\{(\w+)\}/g)]
        .map((match) => match[1])
        .sort();

      expect(dutchPlaceholders, key).toEqual(englishPlaceholders);
    }
  });
});
