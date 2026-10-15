import numberToWords from "number-to-words";

export function formatNumberWords(value: unknown): string {
  if (value == null) return "None";
  if (typeof value !== "number" || !Number.isSafeInteger(value)) {
    return "Enter a whole number between -9007199254740991 and 9007199254740991.";
  }
  return numberToWords.toWords(value);
}
