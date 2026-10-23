import { describe, expect, it } from "vitest";
import { formatNumberWords } from "../src/frontend/number-words";

describe("number-in-words display", () => {
  it.each([
    [0, "zero"],
    [42, "forty-two"],
    [-42, "minus forty-two"],
    [1001, "one thousand, one"],
    [null, "None"],
    [undefined, "None"],
  ])("renders %s as %s", (value, expected) => {
    expect(formatNumberWords(value)).toBe(expected);
  });

  it("supports both safe-integer boundaries", () => {
    const words =
      "nine quadrillion, seven trillion, one hundred ninety-nine billion, two hundred fifty-four million, seven hundred forty thousand, nine hundred ninety-one";
    expect(formatNumberWords(Number.MAX_SAFE_INTEGER)).toBe(words);
    expect(formatNumberWords(Number.MIN_SAFE_INTEGER)).toBe(`minus ${words}`);
  });

  it.each([
    2.9,
    -2.9,
    Number.MAX_SAFE_INTEGER + 1,
    Number.MIN_SAFE_INTEGER - 1,
    Number.NaN,
    Number.POSITIVE_INFINITY,
    Number.NEGATIVE_INFINITY,
    "42",
    "",
    false,
    {},
  ])("rejects invalid value %s without truncating or coercing it", (value) => {
    expect(formatNumberWords(value)).toBe(
      "Enter a whole number between -9007199254740991 and 9007199254740991.",
    );
  });
});
