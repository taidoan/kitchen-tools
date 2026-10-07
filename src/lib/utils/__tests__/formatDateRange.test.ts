import { describe, expect, it } from "vitest";
import { formatDateRange } from "../formatDateRange";

describe("formatDateRange", () => {
  it("formats a from/to range in en-GB", () => {
    expect(formatDateRange("2026-04-01", "2026-04-07")).toBe(
      "1 Apr 2026 – 7 Apr 2026",
    );
  });

  it("returns empty string when no dates are set", () => {
    expect(formatDateRange("", "")).toBe("");
  });
});
