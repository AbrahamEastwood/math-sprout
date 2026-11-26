import { describe, expect, it } from "vitest";
import {
  operations,
  randomChoice,
  randomNumber,
  randomNumberBetween,
} from "./operations.js";

describe("random helpers", () => {
  it("generates values within the requested inclusive ranges", () => {
    expect(randomNumber(5, () => 0)).toBe(1);
    expect(randomNumber(5, () => 0.999)).toBe(5);
    expect(randomNumberBetween(3, 7, () => 0)).toBe(3);
    expect(randomNumberBetween(3, 7, () => 0.999)).toBe(7);
  });

  it("chooses an item from the supplied values", () => {
    expect(randomChoice(["a", "b"], () => 0)).toBe("a");
    expect(randomChoice(["a", "b"], () => 0.999)).toBe("b");
  });
});

describe("exercise operations", () => {
  it("generates proper fractions of whole numbers with exact answers", () => {
    expect(operations.fraction.calculate(3, 4, 12)).toBe(9);
    expect(operations.fraction.calculate(2, 8, 24)).toBe(6);
    expect(operations.fraction.formatQuestion(3, 4, 12)).toBe("What is 3/4 of 12?");

    const numbers = operations.fraction.makeNumbers({}, () => 0.999);
    expect(numbers).toEqual([11, 12, 120]);
    expect(operations.fraction.calculate(...numbers)).toBe(110);
  });

  it("keeps addition operands within their limits and the sum under maxResult", () => {
    const numbers = operations.addition.makeNumbers(
      { maxResult: 20, maxLeft: 10, maxRight: 10 },
      () => 0.999,
    );

    expect(numbers).toEqual([10, 10]);
    expect(operations.addition.calculate(...numbers)).toBe(20);
  });

  it("keeps subtraction non-negative and under maxResult", () => {
    const numbers = operations.subtraction.makeNumbers(
      { maxResult: 10, maxLeft: 20, maxRight: 20 },
      () => 0.999,
    );

    expect(numbers).toEqual([20, 20]);
    expect(operations.subtraction.calculate(...numbers)).toBe(0);
  });

  it("uses a selected table for multiplication", () => {
    const numbers = operations.multiplication.makeNumbers(
      { tables: [3, 5] },
      () => 0,
    );

    expect(numbers).toEqual([1, 3]);
    expect(operations.multiplication.calculate(...numbers)).toBe(3);
  });

  it("generates division questions with an exact answer", () => {
    const numbers = operations.division.makeNumbers(
      { tables: [2, 3] },
      () => 0.999,
    );

    expect(numbers).toEqual([30, 3]);
    expect(operations.division.calculate(...numbers)).toBe(10);
  });
});
