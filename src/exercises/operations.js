export function randomNumber(max, random = Math.random) {
  return Math.floor(random() * max) + 1;
}

export function randomNumberBetween(min, max, random = Math.random) {
  return Math.floor(random() * (max - min + 1)) + min;
}

export function randomChoice(values, random = Math.random) {
  return values[Math.floor(random() * values.length)];
}

export const operations = {
  fraction: {
    makeNumbers({}, random = Math.random) {
      const denominator = randomNumberBetween(2, 12, random);
      const numerator = randomNumberBetween(1, denominator - 1, random);
      const quotient = randomNumber(10, random);
      return [numerator, denominator, denominator * quotient];
    },
    calculate(numerator, denominator, wholeNumber) {
      return wholeNumber / denominator * numerator;
    },
    formatQuestion(numerator, denominator, wholeNumber) {
      return `What is ${numerator}/${denominator} of ${wholeNumber}?`;
    },
  },
  addition: {
    symbol: "+",
    makeNumbers({ maxResult, maxLeft, maxRight }, random = Math.random) {
      const first = randomNumber(Math.min(maxLeft, maxResult - 1), random);
      const second = randomNumber(Math.min(maxRight, maxResult - first), random);
      return [first, second];
    },
    calculate(first, second) {
      return first + second;
    },
  },
  subtraction: {
    symbol: "−",
    makeNumbers({ maxResult, maxLeft, maxRight }, random = Math.random) {
      const second = randomNumber(Math.min(maxRight, maxLeft), random);
      const first = randomNumberBetween(second, Math.min(maxLeft, second + maxResult), random);
      return [first, second];
    },
    calculate(first, second) {
      return first - second;
    },
  },
  multiplication: {
    symbol: "×",
    makeNumbers({ tables }, random = Math.random) {
      return [randomNumber(10, random), randomChoice(tables, random)];
    },
    calculate(first, second) {
      return first * second;
    },
  },
  division: {
    symbol: "÷",
    makeNumbers({ tables }, random = Math.random) {
      const divisor = randomChoice(tables, random);
      const quotient = randomNumber(10, random);
      return [divisor * quotient, divisor];
    },
    calculate(first, second) {
      return first / second;
    },
  },
};
