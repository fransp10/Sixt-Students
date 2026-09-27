import { isValidTime } from "../../src/helpers/isValidTime.js";
import { describe, it, expect } from "vitest";

describe("isValidTime", () => {
  it("should return true for valid time strings", () => {
    expect(isValidTime("00:00")).toBe(true);
    expect(isValidTime("12:34")).toBe(true);
    expect(isValidTime("23:59")).toBe(true);
  });
  it("should return false for invalid time strings", () => {
    expect(isValidTime("24:00")).toBe(false);
    expect(isValidTime("12:60")).toBe(false);
    expect(isValidTime("12:34:56")).toBe(false);
    expect(isValidTime("1234")).toBe(false);
    expect(isValidTime("12-34")).toBe(false);
    expect(isValidTime("12.34")).toBe(false);
    expect(isValidTime("abc")).toBe(false);
  });
  it("should return false for non-string inputs", () => {
    expect(isValidTime(null as any)).toBe(false);
    expect(isValidTime(undefined as any)).toBe(false);
    expect(isValidTime(1234 as any)).toBe(false);
    expect(isValidTime({} as any)).toBe(false);
    expect(isValidTime([] as any)).toBe(false);
  });
});
