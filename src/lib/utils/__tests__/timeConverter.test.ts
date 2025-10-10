import {
  convertToMinutesSeconds,
  convertToHHMM,
  convertTimeToMinutes,
} from "../timeConverter";
import { describe, it, expect } from "vitest";

describe("convertToMinutesSeconds", () => {
  it("should convert decimal time to minutes and seconds", () => {
    expect(convertToMinutesSeconds(2.5)).toBe("2:50");
    expect(convertToMinutesSeconds(1.59)).toBe("1:59");
    expect(convertToMinutesSeconds(0.11)).toBe("0:11");
  });
});

describe("convertToHHMM", () => {
  it("should convert decimal time to HH:MM format", () => {
    expect(convertToHHMM(2.5)).toBe("02:30");
    expect(convertToHHMM(1.59)).toBe("01:35");
    expect(convertToHHMM(0.11)).toBe("00:07");
  });
});

describe("convertTimeToMinutes", () => {
  it("should convert time string to decimal minutes", () => {
    expect(convertTimeToMinutes("8:04")).toBe(8.07);
    expect(convertTimeToMinutes("01:35")).toBe(1.58);
    expect(convertTimeToMinutes("00:07")).toBe(0.12);
  });
});
