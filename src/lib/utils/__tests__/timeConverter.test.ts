import {
  convertToMinutesSeconds,
  convertToHHMM,
  convertToHoursMinutes,
  convertTimeToMinutes,
  formatKitchenTime,
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

describe("convertToHoursMinutes", () => {
  it("treats the fractional part as minutes", () => {
    expect(convertToHoursMinutes(8.3)).toBe("08:30");
    expect(convertToHoursMinutes(8)).toBe("08:00");
    expect(convertToHoursMinutes(7.15)).toBe("07:15");
  });
});

describe("convertTimeToMinutes", () => {
  it("should convert time string to decimal minutes", () => {
    expect(convertTimeToMinutes("8:04")).toBe(8.07);
    expect(convertTimeToMinutes("01:35")).toBe(1.58);
    expect(convertTimeToMinutes("00:07")).toBe(0.12);
  });
});

describe("formatKitchenTime", () => {
  it("formats decimal minutes as M:SS", () => {
    expect(formatKitchenTime(8)).toBe("8:00");
    expect(formatKitchenTime(8.5)).toBe("8:30");
    expect(formatKitchenTime(1.5)).toBe("1:30");
    expect(formatKitchenTime(10)).toBe("10:00");
  });
});
