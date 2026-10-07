import { describe, expect, it } from "vitest";
import { formatDateRange, getDateRangeParts } from "../formatDateRange";

describe("formatDateRange", () => {
  it("formats a from/to range as dd/mm/yy", () => {
    expect(formatDateRange("2026-10-27", "2026-10-30")).toBe(
      "27/10/26 – 30/10/26",
    );
  });

  it("formats a single day without a dash", () => {
    expect(formatDateRange("2026-10-26", "2026-10-26")).toBe("26/10/26");
  });

  it("returns empty string when no dates are set", () => {
    expect(formatDateRange("", "")).toBe("");
  });
});

describe("getDateRangeParts", () => {
  it("marks matching from and to as a single day", () => {
    expect(getDateRangeParts("2025-10-26", "2025-10-26")).toEqual({
      from: "26/10/25",
      to: "26/10/25",
      isSingleDay: true,
    });
  });
});
